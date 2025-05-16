import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

// --- Configuration ---
// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

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
        const response = await axios.get(`${GLOWNET_API_BASE_URL}/api/v2/venues`, { headers: HEADERS });
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

    try {
        // First try to get existing venues
        const { data: existingVenues, error: queryError } = await supabase
            .from('venues')
            .select('id')
            .in('id', venuesData.map(v => v.id));

        if (queryError) throw queryError;

        const existingVenueIds = new Set(existingVenues?.map(venue => venue.id));

        // Split into new and existing venues
        const newVenues = venuesData.filter(venue => !existingVenueIds.has(venue.id));
        const updateVenues = venuesData.filter(venue => existingVenueIds.has(venue.id));

        let syncedCount = 0;
        const failedVenues: SyncResult['results']['details'] = [];

        // Insert new venues
        if (newVenues.length) {
            console.log(`Inserting ${newVenues.length} new venues...`);
            const { error: insertError } = await supabase
                .from('venues')
                .insert(newVenues.map(venue => ({
                    ...venue,
                    image_url: venueImages[venue.id] || null
                })));

            if (insertError) {
                console.error('Error inserting new venues:', insertError);
                failedVenues.push(...newVenues.map(venue => ({
                    venueId: venue.id,
                    status: 'failed',
                    error: insertError.message
                })));
            } else {
                syncedCount += newVenues.length;
            }
        }

        // Update existing venues
        if (updateVenues.length) {
            console.log(`Updating ${updateVenues.length} existing venues...`);
            for (const venue of updateVenues) {
                const { error: updateError } = await supabase
                    .from('venues')
                    .update({
                        ...venue,
                        image_url: venueImages[venue.id] || null
                    })
                    .eq('id', venue.id);

                if (updateError) {
                    console.error(`Error updating venue ${venue.id}:`, updateError);
                    failedVenues.push({
                        venueId: venue.id,
                        status: 'failed',
                        error: updateError.message
                    });
                } else {
                    syncedCount++;
                }
            }
        }

        return {
            message: 'Venues sync completed',
            results: {
                synced: syncedCount,
                failed: failedVenues.length,
                details: failedVenues
            }
        };

    } catch (error) {
        console.error('Error syncing venues:', error);
        return {
            error: error instanceof Error ? error.message : String(error),
            results: {
                synced: 0,
                failed: venuesData.length,
                details: venuesData.map(venue => ({
                    venueId: venue.id,
                    status: 'failed',
                    error: error instanceof Error ? error.message : String(error)
                }))
            }
        };
    }
}

async function verifyVenuesInSupabase(venueIds: number[]): Promise<void> {
    if (!venueIds.length) return;

    try {
        const { data: foundVenues, error } = await supabase
            .from('venues')
            .select('id,name,status')
            .in('id', venueIds);

        if (error) throw error;

        console.log('\nVerifying venues in Supabase:');
        console.log(`Checked ${venueIds.length} venues:`);
        console.log(`Found in Supabase: ${foundVenues?.length || 0}`);

        // Show which venues weren't found
        const foundIds = new Set(foundVenues?.map(venue => venue.id));
        const missingIds = venueIds.filter(id => !foundIds.has(id));

        if (missingIds.length) {
            console.log('\nVenues not found in Supabase:');
            missingIds.forEach(id => console.log(`- ${id}`));
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
        const venueIds = venues.map(venue => venue.id);

        // 4. Sync venues
        const result = await syncVenues(venues, venueImages);
        if (result) {
            console.log('\nSync Results:');
            if (result.error) {
                console.error(`Error: ${result.error}`);
            } else {
                console.log(`Success: ${result.message}`);
                console.log(`Synced venues: ${result.results?.synced || 0}`);

                // 5. Verify the sync
                await verifyVenuesInSupabase(venueIds);
            }
        }

        console.log('\nSync process completed.');
    } catch (error) {
        console.error('Error in main sync process:', error);
        throw error;
    }
}

// Run the script
if (require.main === module) {
    main().catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
} 