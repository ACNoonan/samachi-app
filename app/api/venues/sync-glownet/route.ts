import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { getAllGlownetEvents, type GlownetEvent } from '@/lib/glownet';

// Rate limiting setup
const RATE_LIMIT = 10; // requests per minute
const rateLimitStore = new Map<string, number[]>();

// Environment variable for security
const API_KEY = process.env.GLOWNET_API_KEY;

// Sync types
type SyncType = 'full' | 'incremental';
type SyncStatus = 'pending' | 'success' | 'failed';

// Track sync status in Supabase
async function trackSyncStatus(supabase: any, venueId: string, status: SyncStatus, error?: string) {
  await supabase
    .from('venues')
    .update({ 
      sync_status: status,
      last_sync_attempt: new Date().toISOString(),
      sync_error: error
    })
    .eq('id', venueId);
}

// Main sync logic
async function syncVenues(type: SyncType = 'full', venueImages: Record<string, { image_url: string, image_alt: string }> = {}) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  try {
    console.log(`Starting ${type} Glownet venue sync...`);
    const glownetEvents: GlownetEvent[] = await getAllGlownetEvents();
    
    if (!glownetEvents?.length) {
      console.log('No Glownet events found to sync.');
      return { message: 'No events to sync', status: 200 };
    }

    // Prepare venue data with enhanced fields
    const venuesToUpsert = glownetEvents.map((event) => {
      // Get image data if available
      const imageData = venueImages[event.id.toString()] || {};
      
      return {
        glownet_event_id: event.id,
        name: event.name,
        status: event.state,
        start_date: event.start_date,
        end_date: event.end_date,
        timezone: event.timezone,
        currency: event.currency,
        image_url: imageData.image_url || null,
        max_balance: event.maximum_gtag_standard_balance,
        max_virtual_balance: event.maximum_gtag_virtual_balance,
        last_synced: new Date().toISOString(),
        sync_status: 'success' as SyncStatus
      };
    });

    // Perform upsert
    const { data, error } = await supabase
      .from('venues')
      .upsert(venuesToUpsert, {
        onConflict: 'glownet_event_id',
        ignoreDuplicates: false,
      })
      .select('id, name, glownet_event_id');

    if (error) throw error;

    // Track sync status for each venue
    for (const venue of data || []) {
      await trackSyncStatus(supabase, venue.id, 'success');
    }

    return {
      message: `Successfully synced ${data?.length ?? 0} venues`,
      data,
      status: 200
    };

  } catch (error: any) {
    console.error('----------------------------------------');
    console.error('VENUE SYNC ERROR:');
    console.error('Timestamp:', new Date().toISOString());
    console.error('Error:', error);
    console.error('----------------------------------------');

    // Track failed status if possible
    if (error.venue_id) {
      await trackSyncStatus(supabase, error.venue_id, 'failed', error.message);
    }

    return {
      error: error.message || 'Sync failed',
      status: error.status || 500
    };
  }
}

// Activation Points:

// 1. Manual Sync via API endpoint
export async function POST(request: Request) {
  // Security check using GLOWNET_API_KEY
  const API_KEY = process.env.GLOWNET_API_KEY;

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

  // Get sync type and venue images from request
  const { type = 'full', venue_images = {} } = await request.json();
  const result = await syncVenues(type as SyncType, venue_images);
  
  return NextResponse.json(
    result.error ? { error: result.error } : { message: result.message, data: result.data },
    { status: result.status }
  );
}

// 2. Scheduled Sync via Vercel Cron
export const config = {
  runtime: 'edge',
  regions: ['iad1'],  // Specify regions if needed
};

// This function is triggered by Vercel Cron
// Configure in vercel.json:
// {
//   "crons": [{
//     "path": "/api/venues/sync-glownet",
//     "schedule": "0 */6 * * *"
//   }]
// }
export async function GET(request: Request) {
  // Only allow requests from Vercel Cron
  const isCron = request.headers.get('x-vercel-cron') === 'true';
  
  if (!isCron) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await syncVenues('incremental');
  return NextResponse.json(
    result.error ? { error: result.error } : { message: result.message },
    { status: result.status }
  );
} 