import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { getAllGlownetEvents, type GlownetEvent } from '@/lib/glownet';

// Environment variable for security
const SYNC_SECRET = process.env.GLOWNET_SYNC_SECRET;

export async function POST(request: Request) {
  // 1. Security Check
  const authHeader = request.headers.get('Authorization');
  const providedSecret = authHeader?.split(' ')[1]; // Assuming "Bearer YOUR_SECRET"

  if (!SYNC_SECRET) {
    console.error('GLOWNET_SYNC_SECRET is not set in environment variables.');
    return NextResponse.json({ error: 'Internal server configuration error.' }, { status: 500 });
  }

  if (providedSecret !== SYNC_SECRET) {
    console.warn('Unauthorized attempt to access sync-glownet endpoint.');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Fetch Events from Glownet
    console.log('Starting Glownet event sync...');
    const glownetEvents: GlownetEvent[] = await getAllGlownetEvents();
    console.log(`Fetched ${glownetEvents.length} events from Glownet.`);

    if (!glownetEvents || glownetEvents.length === 0) {
      console.log('No Glownet events found to sync.');
      return NextResponse.json({ message: 'No Glownet events found to sync.' });
    }

    // 3. Prepare Data for Supabase
    const venuesToUpsert = glownetEvents.map((event) => ({
      glownet_event_id: event.id,
      name: event.name,
      address: event.timezone, // Using timezone as a placeholder for address - adjust as needed
      image_url: null, // Placeholder - Add logic to fetch/generate image URL if available
      // Add other fields from your 'venues' table schema here, mapping from 'event' properties
      // e.g., start_date: event.start_date, end_date: event.end_date, etc.
    }));

    // 4. Upsert into Supabase
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    console.log(`Attempting to upsert ${venuesToUpsert.length} venues...`);
    const { data, error } = await supabase
      .from('venues')
      .upsert(venuesToUpsert, {
        onConflict: 'glownet_event_id', // Specify the conflict target
        ignoreDuplicates: false, // Ensure updates happen
      })
      .select('id, name, glownet_event_id'); // Select some data to confirm success

    if (error) {
      console.error('Error upserting venues to Supabase:', error);
      throw new Error(`Supabase upsert failed: ${error.message}`);
    }

    console.log('Successfully upserted/updated venues:', data);

    // 5. Return Success Response
    return NextResponse.json({
        message: `Successfully synced ${data?.length ?? 0} venues from Glownet.`,
        syncedVenues: data
    });

  } catch (error: any) {
    console.error('----------------------------------------');
    console.error('VENUE SYNC API ROUTE CRITICAL ERROR:');
    console.error('Timestamp:', new Date().toISOString());
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('----------------------------------------');

    const message = error.message.includes('Glownet API') || error.message.includes('Supabase')
        ? error.message
        : 'An internal server error occurred during venue synchronization.';
    const status = error.message.includes('Unauthorized') ? 401 : 500;

    return NextResponse.json({ error: message }, { status: status });
  }
}

// Optional: Add a GET handler for simple testing or status check if needed
// export async function GET() {
//   return NextResponse.json({ status: 'Venue sync endpoint is active. Use POST to trigger sync.' });
// } 