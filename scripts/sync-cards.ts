import dotenv from 'dotenv';
import path from 'path';
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

interface GlownetEvent {
    id: number;
    name: string;
}

interface GlownetTag {
    tag_uid: string;
    state?: string;
}

interface SyncResult {
    message?: string;
    results: {
        synced: number;
        failed: number;
        skipped: number;
        details: Array<{
            cardId: string;
            status: string;
            error?: string;
        }>;
    };
}

async function getAllEvents(): Promise<GlownetEvent[]> {
    try {
        const response = await axios.get(`${GLOWNET_API_BASE_URL}/api/v2/events`, { headers: HEADERS });
        return response.data;
    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
}

async function getEventGtags(eventId: number): Promise<string[]> {
    const gtags: string[] = [];
    let page = 1;
    
    while (true) {
        try {
            const response = await axios.get(
                `${GLOWNET_API_BASE_URL}/api/v2/events/${eventId}/gtags`,
                {
                    headers: HEADERS,
                    params: { page, per_page: 100 }
                }
            );
            
            const data: GlownetTag[] = response.data;
            if (!data || !data.length) break;
            
            gtags.push(...data.filter(tag => tag.tag_uid).map(tag => tag.tag_uid));
            
            if (data.length < 100) break;
            page++;
            await new Promise(resolve => setTimeout(resolve, 200)); // Rate limiting
            
        } catch (error) {
            console.error(`Error fetching G-Tags for event ${eventId}:`, error);
            break;
        }
    }
    
    return gtags;
}

async function syncCards(cardIds: string[], eventId: number): Promise<SyncResult | null> {
    if (!cardIds.length) {
        console.log("No cards to sync for this event batch.");
        return null;
    }
    
    try {
        // First try to get existing cards
        const { data: existingCards, error: queryError } = await supabase
            .from('membership_cards')
            .select('card_identifier')
            .in('card_identifier', cardIds);
            
        if (queryError) throw queryError;
        
        const existingCardIds = new Set(existingCards?.map(card => card.card_identifier));
        
        // Prepare card data
        const cardsData = cardIds.map(cardId => ({
            card_identifier: cardId,
            glownet_event_id: eventId,
            glownet_status: 'ACTIVE',
            status: 'unregistered'
        }));
        
        // Split into new and existing cards
        const newCards = cardsData.filter(card => !existingCardIds.has(card.card_identifier));
        const updateCards = cardsData.filter(card => existingCardIds.has(card.card_identifier));
        
        let syncedCount = 0;
        const failedCards: SyncResult['results']['details'] = [];
        
        // Insert new cards
        if (newCards.length) {
            console.log(`Inserting ${newCards.length} new cards...`);
            const { error: insertError } = await supabase
                .from('membership_cards')
                .insert(newCards);
                
            if (insertError) {
                console.error('Error inserting new cards:', insertError);
                failedCards.push(...newCards.map(card => ({
                    cardId: card.card_identifier,
                    status: 'failed',
                    error: insertError.message
                })));
            } else {
                syncedCount += newCards.length;
            }
        }
        
        // Update existing cards
        if (updateCards.length) {
            console.log(`Updating ${updateCards.length} existing cards...`);
            for (const card of updateCards) {
                const { error: updateError } = await supabase
                    .from('membership_cards')
                    .update(card)
                    .eq('card_identifier', card.card_identifier);
                    
                if (updateError) {
                    console.error(`Error updating card ${card.card_identifier}:`, updateError);
                    failedCards.push({
                        cardId: card.card_identifier,
                        status: 'failed',
                        error: updateError.message
                    });
                } else {
                    syncedCount++;
                }
            }
        }
        
        return {
            message: 'Cards sync completed',
            results: {
                synced: syncedCount,
                failed: failedCards.length,
                skipped: 0,
                details: failedCards
            }
        };
        
    } catch (error) {
        console.error('Error syncing cards:', error);
        return {
            results: {
                synced: 0,
                failed: cardIds.length,
                skipped: 0,
                details: cardIds.map(cardId => ({
                    cardId,
                    status: 'failed',
                    error: error instanceof Error ? error.message : String(error)
                }))
            }
        };
    }
}

async function processEventGtags(eventId: number, eventName: string, batchSize = 50) {
    console.log(`\nProcessing G-Tags for event: ${eventName} (ID: ${eventId})`);
    
    const gtags = await getEventGtags(eventId);
    const totalGtags = gtags.length;
    
    if (!gtags.length) {
        console.log(`No G-Tags found for event ${eventName}`);
        return;
    }
    
    console.log(`Found ${totalGtags} G-Tags`);
    
    let processed = 0;
    let totalSynced = 0;
    let totalFailed = 0;
    let totalSkipped = 0;
    
    for (let i = 0; i < gtags.length; i += batchSize) {
        const batch = gtags.slice(i, i + batchSize);
        processed += batch.length;
        console.log(`\nSyncing batch ${Math.floor(i / batchSize) + 1} (${processed}/${totalGtags} G-Tags) for event ID ${eventId}...`);
        
        const result = await syncCards(batch, eventId);
        if (result?.results) {
            totalSynced += result.results.synced;
            totalFailed += result.results.failed;
            totalSkipped += result.results.skipped;
            
            if (result.results.failed > 0) {
                console.log('\nFailed G-Tags in this batch:');
                result.results.details
                    .filter(detail => detail.status === 'failed')
                    .forEach(detail => console.log(`- ${detail.cardId}: ${detail.error || 'Unknown error'}`));
            }
        }
        
        await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
    }
    
    console.log(`\nEvent ${eventName} sync completed:`);
    console.log(`Total G-Tags processed: ${totalGtags}`);
    console.log(`Synced: ${totalSynced}`);
    console.log(`Failed: ${totalFailed}`);
    console.log(`Skipped: ${totalSkipped}`);
}

// Main function that orchestrates the sync process
export async function main() {
    try {
        console.log('Starting card sync process...');
        const events = await getAllEvents();
        console.log(`Found ${events.length} events`);

        for (const event of events) {
            const gTag = await getEventGtags(event.id);
            if (!gTag) {
                console.log(`No G-Tag found for event ${event.id}, skipping...`);
                continue;
            }

            const result = await syncCards(gTag, event.id);
            console.log(`Sync result for event ${event.id}:`, result);
        }

        console.log('Card sync process completed successfully');
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