import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

// Define types for cleaner code (adjust based on actual schema)
interface Venue {
  id: string;
  name: string;
  address?: string | null;
  image_url?: string | null;
  glownet_event_id: number;
}

interface MembershipWithVenue {
  id: string;
  status: string;
  glownet_customer_id: number;
  created_at: string;
  venues: Venue | null; // Relationship can be null if venue deleted
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Get venueId from query parameters (NEW)
  const venueId = request.nextUrl.searchParams.get('venueId');

  try {
    // 1. Authenticate User using Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Auth Error fetching memberships:', authError);
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }
    const userId = user.id; // Get user ID from Supabase session

    // 2. Build Base Query
    let query = supabase
      .from('memberships')
      .select(`
        id,
        status,
        created_at,
        user_id, // Keep user_id for potential validation
        venue_id, // Fetch venue_id for client-side confirmation if needed
        venues (
          id,
          name,
          address,
          image_url
        )
      `)
      .eq('user_id', userId) // Always filter by the authenticated user ID

    // 3. Add optional venueId filter (NEW)
    if (venueId) {
      console.log(`Fetching specific membership for user ID: ${userId}, venue ID: ${venueId}`);
      query = query.eq('venue_id', venueId);
    } else {
      console.log(`Fetching all memberships for user ID: ${userId}`);
      // Optional: Add ordering only when fetching all
      query = query.order('created_at', { ascending: false });
    }

    // 4. Execute Query
    const { data: memberships, error } = await query.returns<MembershipWithVenue[]>(); // Expect an array

    if (error) {
      console.error(`Error fetching memberships for user ${userId}` + (venueId ? ` and venue ${venueId}` : '') + ":", error);
      return NextResponse.json({ error: 'Database error fetching memberships.' }, { status: 500 });
    }

    // 5. Handle Response
    if (!memberships || memberships.length === 0) {
      // If fetching for a specific venue and not found, return 404 (or empty array)
      if (venueId) {
         console.log(`No membership found for user ${userId} at venue ${venueId}.`);
         // Return 404 if specifically requested one not found, or empty array if that's preferred client handling
         // return NextResponse.json({ error: 'Membership not found for this venue.' }, { status: 404 });
         return NextResponse.json([]); // Consistent empty array response
      }
      // If fetching all and none found
      console.log(`No memberships found for user ${userId}. Returning empty array.`);
      return NextResponse.json([]);
    }

    console.log(`Successfully fetched ${memberships.length} memberships for user ${userId}` + (venueId ? ` for venue ${venueId}` : '') + ".");
    // Filter out memberships where the related venue might have been deleted (still relevant)
    const validMemberships = memberships.filter((m: MembershipWithVenue) => m.venues !== null);

    // If filtering by venueId, we expect at most one result after filtering deleted venues
    // The client-side code currently expects an array and uses find(), so returning the array is fine.
    return NextResponse.json(validMemberships);

  } catch (err: any) {
     console.error('Unexpected error in GET /api/memberships:', err);
     return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
} 