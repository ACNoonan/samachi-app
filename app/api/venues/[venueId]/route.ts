import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function GET(
  request: Request,
  { params }: { params: { venueId: string } }
) {
  const venueId = params.venueId;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Validate if venueId looks like a UUID (basic check)
  if (!venueId || !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(venueId)) {
      return NextResponse.json({ error: 'Invalid Venue ID format.' }, { status: 400 });
  }

  try {
    console.log(`Fetching venue details for ID: ${venueId}`);
    const { data: venue, error } = await supabase
      .from('venues')
      .select(`
        id,
        name,
        glownet_event_id,
        address,
        image_url,
        created_at,
        updated_at
      `)
      .eq('id', venueId)
      .single();

    if (error) {
      console.error(`Error fetching venue ${venueId}:`, error);
      // Check if the error is because the venue was not found
      if (error.code === 'PGRST116') { // PostgREST code for "relation does not contain row"
         return NextResponse.json({ error: 'Venue not found.' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Database error fetching venue.' }, { status: 500 });
    }

    if (!venue) {
      // This case might be redundant due to .single() throwing error, but good safety check
      return NextResponse.json({ error: 'Venue not found.' }, { status: 404 });
    }

    console.log(`Successfully fetched venue: ${venue.name}`);
    return NextResponse.json(venue);

  } catch (error: any) {
    console.error('----------------------------------------');
    console.error('FETCH VENUE DETAIL API ERROR:');
    console.error('Venue ID:', venueId);
    console.error('Timestamp:', new Date().toISOString());
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('----------------------------------------');

    return NextResponse.json({ error: 'Internal server error fetching venue details.' }, { status: 500 });
  }
} 