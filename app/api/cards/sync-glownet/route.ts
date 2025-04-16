import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import axios from 'axios';

// Rate limiting setup
const RATE_LIMIT = 10; // requests per minute
const rateLimitStore = new Map<string, number[]>();

// Environment variable for security
const API_KEY = process.env.GLOWNET_API_KEY;
const GLOWNET_API_BASE_URL = process.env.GLOWNET_API_BASE_URL || 'https://opera.glownet.com';

// Sync types
type SyncType = 'full' | 'incremental';
type SyncStatus = 'pending' | 'success' | 'failed';

// Interfaces
interface GlownetEvent {
  id: number;
  name: string;
}

interface GlownetTag {
  tag_uid: string;
  state?: string;
}

// Track sync status in Supabase
async function trackSyncStatus(supabase: any, cardId: string, status: SyncStatus, error?: string) {
  await supabase
    .from('membership_cards')
    .update({
      sync_status: status,
      last_sync_attempt: new Date().toISOString(),
      sync_error: error
    })
    .eq('card_identifier', cardId);
}

// Fetch all events from Glownet
async function getAllEvents(): Promise<GlownetEvent[]> {
  try {
    const headers = {
      "AUTHORIZATION": `Token token=${API_KEY}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    };

    const response = await axios.get(`${GLOWNET_API_BASE_URL}/api/v2/events`, { headers });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

// Fetch G-Tags (cards) for a specific event
async function getEventGtags(eventId: number): Promise<string[]> {
  const gtags: string[] = [];
  let page = 1;
  
  const headers = {
    "AUTHORIZATION": `Token token=${API_KEY}`,
    "Content-Type": "application/json",
    "Accept": "application/json"
  };
  
  while (true) {
    try {
      const response = await axios.get(
        `${GLOWNET_API_BASE_URL}/api/v2/events/${eventId}/gtags`,
        {
          headers,
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

// Main sync logic
async function syncCards(type: SyncType = 'full', batchSize = 100) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  try {
    console.log(`Starting ${type} Glownet card sync...`);
    
    // 1. Fetch all events
    const events = await getAllEvents();
    
    if (!events?.length) {
      console.log('No Glownet events found to sync.');
      return { message: 'No events to sync', status: 200 };
    }
    
    // Stats
    let totalCards = 0;
    let syncedCards = 0;
    let failedCards = 0;
    
    // 2. Process each event
    for (const event of events) {
      console.log(`Processing event: ${event.name} (ID: ${event.id})`);
      
      // 3. Get all G-Tags (cards) for this event
      const cardIds = await getEventGtags(event.id);
      
      if (!cardIds.length) {
        console.log(`No cards found for event ${event.name}`);
        continue;
      }
      
      totalCards += cardIds.length;
      console.log(`Found ${cardIds.length} cards for event ${event.name}`);
      
      // 4. Process in batches to avoid hitting limits
      for (let i = 0; i < cardIds.length; i += batchSize) {
        const batch = cardIds.slice(i, i + batchSize);
        console.log(`Processing batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(cardIds.length/batchSize)}`);
        
        try {
          // 5. Check existing cards
          const { data: existingCards } = await supabase
            .from('membership_cards')
            .select('card_identifier')
            .in('card_identifier', batch);
            
          const existingCardIds = new Set(existingCards?.map(card => card.card_identifier) || []);
          
          // 6. Prepare card data
          const cardsToUpsert = batch.map(cardId => ({
            card_identifier: cardId,
            glownet_status: 'ACTIVE',
            status: 'unregistered',
            glownet_event_id: event.id,
            last_synced: new Date().toISOString(),
            sync_status: 'success' as SyncStatus
          }));
          
          // 7. Perform upsert
          const { data, error } = await supabase
            .from('membership_cards')
            .upsert(cardsToUpsert, {
              onConflict: 'card_identifier',
              ignoreDuplicates: false,
            });
        
          if (error) throw error;
          
          // 8. Track stats
          syncedCards += batch.length;
          
          // 9. Delay between batches for rate limiting
          await new Promise(resolve => setTimeout(resolve, 200));
          
        } catch (error: any) {
          console.error(`Error processing batch for event ${event.name}:`, error);
          failedCards += batch.length;
          
          // Track individual card failures if possible
          for (const cardId of batch) {
            try {
              await trackSyncStatus(supabase, cardId, 'failed', error.message);
            } catch (trackError) {
              console.error(`Failed to update status for card ${cardId}:`, trackError);
            }
          }
        }
      }
    }
    
    return {
      message: `Card sync completed. Processed: ${totalCards}, Synced: ${syncedCards}, Failed: ${failedCards}`,
      stats: { total: totalCards, synced: syncedCards, failed: failedCards },
      status: 200
    };
    
  } catch (error: any) {
    console.error('----------------------------------------');
    console.error('CARD SYNC ERROR:');
    console.error('Timestamp:', new Date().toISOString());
    console.error('Error:', error);
    console.error('----------------------------------------');
    
    return {
      error: error.message || 'Sync failed',
      status: error.status || 500
    };
  }
}

// 1. Manual Sync via API endpoint
export async function POST(request: Request) {
  // Security check using GLOWNET_API_KEY
  if (!API_KEY) {
    console.error('GLOWNET_API_KEY is not set in environment variables.');
    return NextResponse.json({ error: 'Internal server configuration error.' }, { status: 500 });
  }

  // Rate limiting
  const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const recentRequests = rateLimitStore.get(clientIP) || [];
  const validRequests = recentRequests.filter(time => now - time < 60000);
  
  if (validRequests.length >= RATE_LIMIT) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }
  
  rateLimitStore.set(clientIP, [...validRequests, now]);

  // Get sync parameters from request
  const { type = 'full', batchSize = 100 } = await request.json().catch(() => ({}));
  const result = await syncCards(type as SyncType, batchSize);
  
  return NextResponse.json(
    result.error ? { error: result.error } : { message: result.message, stats: result.stats },
    { status: result.status }
  );
}

// 2. Scheduled Sync via Vercel Cron

// Use separate exports for Route Segment Config
export const runtime = 'edge';
export const preferredRegion = 'iad1'; 
// Note: 'regions' is deprecated, use 'preferredRegion' or 'dynamic = "force-dynamic"' if applicable
// See: https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config

// This function is triggered by Vercel Cron
export async function GET(request: Request) {
  // Only allow requests from Vercel Cron
  const isCron = request.headers.get('x-vercel-cron') === 'true';
  
  if (!isCron) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await syncCards('incremental');
  return NextResponse.json(
    result.error ? { error: result.error } : { message: result.message, stats: result.stats },
    { status: result.status }
  );
} 