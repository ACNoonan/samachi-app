import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import { fileURLToPath } from 'url';

// --- Configuration ---
// Get current directory using ESM method
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const GLOWNET_API_BASE_URL = process.env.GLOWNET_API_BASE_URL || 'https://opera.glownet.com';
const GLOWNET_API_KEY = process.env.GLOWNET_API_KEY;
const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!GLOWNET_API_KEY || !NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Error: Required environment variables not set in .env.local");
    console.error("Required: GLOWNET_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
}

const HEADERS = {
    "AUTHORIZATION": `Token token=${GLOWNET_API_KEY}`,
    "Content-Type": "application/json",
    "Accept": "application/json"
};

// Initialize Supabase client
const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface VenueImage {
    [key: string]: string;
}

interface VenueData {
    id: number;
    name: string;
    [key: string]: any; // For other venue properties
}

interface SyncResult {
    message?: string;
    error?: string;
    results: {
        synced: number;
        failed: number;
        details: Array<{
            venueId: number;
            status: string;
            error?: string;
        }>;
    };
}

async function loadVenueImages(): Promise<VenueImage> {
    const imagePath = path.join(__dirname, 'venue_images.json');
    try {
        const data = await fs.promises.readFile(imagePath, 'utf8');
        const jsonData = JSON.parse(data);
        return jsonData.venue_images || {};
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            console.log(`Warning: venue_images.json not found at ${imagePath}`);
        } else {
            console.log(`Warning: Error reading venue_images.json: ${error}`);
        }
        return {};
    }
}

async function getAllVenues(): Promise<VenueData[]> {
    try {
        const response = await axios.get(`${GLOWNET_API_BASE_URL}/api/v2/events`, { headers: HEADERS });
        return response.data;
    } catch (error) {
        console.error('Error fetching venues:', error);
        return [];
    }
}

async function syncVenues(venuesData: VenueData[], venueImages: VenueImage): Promise<SyncResult | null> {
    if (!venuesData.length) {
        console.log("No venues to sync.");
        return null;
    }

    const syncAttemptTimestamp = new Date().toISOString(); // Timestamp for this sync attempt

    try {
        // Map Glownet data to Supabase schema
        const venuesToUpsert = venuesData.map(venue => {
            const { 
                id: glownet_event_id, 
                name,
                currency,
                start_date, 
                end_date,   
                timezone,   
                state: glownet_event_state, 
                maximum_gtag_standard_balance, 
                maximum_gtag_virtual_balance, 
                ...restOfGlownetData 
            } = venue; 
            
            const supabaseVenueData: any = {
                glownet_event_id,
                name,
                currency: currency || null,
                start_date: start_date || null,
                end_date: end_date || null,
                timezone: timezone || null,
                max_balance: maximum_gtag_standard_balance ?? null, 
                max_virtual_balance: maximum_gtag_virtual_balance ?? null, 
                image_url: venueImages[glownet_event_id] || null, 
                last_sync_attempt: syncAttemptTimestamp, // Record attempt time
                // status: mapGlownetStateToSupabaseStatus(glownet_event_state), // Map state later
                // sync_status, last_synced, sync_error will be updated after success/failure
            };
            Object.keys(supabaseVenueData).forEach(key => supabaseVenueData[key] === undefined && delete supabaseVenueData[key]);
            return supabaseVenueData;
        });

        // Use upsert for data sync
        console.log(`Attempting to upsert ${venuesToUpsert.length} venues...`);
        const { data: upsertedData, error: upsertError } = await supabase
            .from('venues')
            .upsert(venuesToUpsert, {
                onConflict: 'glownet_event_id',
                ignoreDuplicates: false
            })
            .select('id, glownet_event_id, name'); // Select IDs to know which succeeded

        if (upsertError) {
            console.error('Error upserting venues:', upsertError);
            // TODO: Optionally update status to 'failed' and set sync_error for attempted venues
            return {
                error: upsertError.message, 
                results: {
                    synced: 0,
                    failed: venuesData.length,
                    details: venuesData.map(venue => ({
                        venueId: venue.id, 
                        status: 'failed',
                        error: upsertError.message
                    }))
                }
            };
        }

        const syncedCount = upsertedData?.length ?? 0;
        console.log(`Successfully upserted data for ${syncedCount} venues.`);

        // Update sync status for successfully upserted venues
        let statusUpdateError: any = null;
        if (upsertedData && upsertedData.length > 0) {
            const successfulGlownetIds = upsertedData.map(v => v.glownet_event_id);
            const syncSuccessTimestamp = new Date().toISOString();
            console.log(`Updating sync status for ${successfulGlownetIds.length} venues...`);
            const { error: updateError } = await supabase
                .from('venues')
                .update({
                    sync_status: 'success',
                    last_synced: syncSuccessTimestamp,
                    sync_error: null // Clear any previous error
                })
                .in('glownet_event_id', successfulGlownetIds);

            if (updateError) {
                console.error('Error updating sync status for successful venues:', updateError);
                statusUpdateError = updateError; // Store error to report later
            }
        }

        // Determine which failed based on the initial list vs successful upsert list
        const successfulGlownetIdsSet = new Set(upsertedData?.map(v => v.glownet_event_id));
        const failedDetails = venuesData
            .filter(v => !successfulGlownetIdsSet.has(v.id))
            .map(v => ({ 
                 venueId: v.id, 
                 status: 'failed', 
                 error: 'Did not appear in successful upsert result' 
            }));

        // Add status update error to the overall result if it occurred
        const finalErrorMessage = statusUpdateError ? `Venue data upserted, but failed to update sync status: ${statusUpdateError.message}` : undefined;

        return {
            message: finalErrorMessage ? undefined : 'Venues sync completed',
            error: finalErrorMessage,
            results: {
                synced: syncedCount, // Count based on successful data upsert
                failed: failedDetails.length, 
                details: failedDetails 
            }
        };

    } catch (error) {
        console.error('Error syncing venues:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
            error: errorMessage,
            results: {
                synced: 0,
                failed: venuesData.length,
                details: venuesData.map(venue => ({
                    venueId: venue.id,
                    status: 'failed',
                    error: errorMessage
                }))
            }
        };
    }
}

async function verifyVenuesInSupabase(glownetEventIds: number[]): Promise<void> {
    if (!glownetEventIds.length) return;

    try {
        const { data: foundVenues, error } = await supabase
            .from('venues')
            .select('id, name, status, glownet_event_id') // Ensure glownet_event_id is selected
            .in('glownet_event_id', glownetEventIds); // Query by glownet_event_id

        if (error) throw error;

        console.log('\nVerifying venues in Supabase (based on glownet_event_id):');
        console.log(`Attempted to verify ${glownetEventIds.length} Glownet event IDs:`);
        console.log(`Found in Supabase: ${foundVenues?.length || 0}`);

        // Show which venues weren't found
        const foundSupabaseGlownetEventIds = new Set(foundVenues?.map(venue => venue.glownet_event_id));
        const missingGlownetEventIds = glownetEventIds.filter(id => !foundSupabaseGlownetEventIds.has(id));

        if (missingGlownetEventIds.length) {
            console.log('\nGlownet Event IDs not found in Supabase (by glownet_event_id):');
            missingGlownetEventIds.forEach(id => console.log(`- ${id}`));
        }

    } catch (error) {
        console.error('Error verifying venues in Supabase:', error);
    }
}

// Main function that orchestrates the sync process
export async function main() {
    try {
        console.log('=== Glownet Venue Sync Tool ===');
        console.log(`API Base URL: ${GLOWNET_API_BASE_URL}`);
        console.log('=' .repeat(40));

        // 1. Load venue images
        console.log('\nLoading venue images...');
        const venueImages = await loadVenueImages();
        console.log(`Loaded ${Object.keys(venueImages).length} venue image mappings`);

        // 2. Fetch all venues
        console.log('\nFetching Glownet venues...');
        const venues = await getAllVenues();

        if (!venues.length) {
            console.log('No venues found or error occurred while fetching venues.');
            process.exit(1);
        }

        // 3. Process venues
        console.log(`\nFound ${venues.length} venues`);
        const glownetEventIdsForVerification = venues.map(venue => venue.id); // Keep original Glownet IDs for verification

        // 4. Sync venues
        const result = await syncVenues(venues, venueImages);
        if (result) {
            console.log('\nSync Results:');
            if (result.error) {
                console.error(`Error: ${result.error}`);
            } else {
                console.log(`Success: ${result.message}`);
            }
            console.log(`Synced venues: ${result.results.synced}`);
            if (result.results.failed > 0) {
                console.log(`Failed to sync: ${result.results.failed}`);
                result.results.details.forEach(detail => {
                    if (detail.status === 'failed') {
                        console.log(`- Venue ID (Glownet): ${detail.venueId}, Error: ${detail.error || 'Unknown'}`);
                    }
                });
            }
        } else {
            console.log("\nSync process did not return a result. Might indicate no venues were processed or an early exit.");
        }
        
        // 5. Verify venues in Supabase, using the original Glownet IDs
        if (result && result.results.synced > 0) {
             await verifyVenuesInSupabase(glownetEventIdsForVerification);
        } else if (result && result.results.synced === 0 && venues.length > 0) {
            console.log("\nSkipping Supabase verification as no venues were successfully synced in the last step, but Glownet venues were found.");
            // Optionally, still attempt verification if it's useful for debugging
            // await verifyVenuesInSupabase(glownetEventIdsForVerification);
        }

        console.log('\nSync process completed.');
    } catch (error) {
        console.error('Error in main sync process:', error);
        throw error;
    }
}

// Run the script
main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
}); 