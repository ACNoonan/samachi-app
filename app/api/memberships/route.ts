import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

// Re-use or adapt the authentication helper
async function getAuthenticatedUserId(cookieStore: Awaited<ReturnType<typeof cookies>>): Promise<string | null> {
    const sessionCookie = cookieStore.get('auth_session');
    if (sessionCookie && sessionCookie.value) {
        console.log(`Auth (Memberships): Found user ID ${sessionCookie.value} in cookie.`);
        return sessionCookie.value; // Assuming cookie value is the profile ID
    }
    console.warn('Auth (Memberships): No session cookie found.');
    return null;
}

// Define the expected structure of the membership data from the query
interface MembershipWithVenue {
  id: string;
  status: string;
  glownet_customer_id: number | null;
  created_at: string;
  venues: {
    id: string;
    name: string;
    address: string | null;
    image_url: string | null;
    glownet_event_id: number | null;
  } | null; // Define venues as potentially null for the filter check
}

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  try {
    // 1. Authenticate User
    const profileId = await getAuthenticatedUserId(cookieStore);
    if (!profileId) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    // 2. Fetch Memberships with Venue Details
    console.log(`Fetching memberships for profile ID: ${profileId}`);
    const { data: memberships, error } = await supabase
      .from('memberships')
      .select(`
        id, 
        status,
        glownet_customer_id,
        created_at,
        venues (
          id,
          name,
          address,
          image_url,
          glownet_event_id
        )
      `)
      .eq('user_id', profileId)
      .order('created_at', { ascending: false })
      .returns<MembershipWithVenue[]>();

    if (error) {
      console.error(`Error fetching memberships for profile ${profileId}:`, error);
      return NextResponse.json({ error: 'Database error fetching memberships.' }, { status: 500 });
    }

    if (!memberships) {
      // This shouldn't happen with .select(), it returns [] if no rows match
      console.log(`No memberships found for profile ${profileId}. Returning empty array.`);
      return NextResponse.json([]); // Return empty array if no memberships found
    }

    console.log(`Successfully fetched ${memberships.length} memberships for profile ${profileId}.`);
    // Add explicit type annotation to the filter parameter
    const validMemberships = memberships.filter((m: MembershipWithVenue) => m.venues !== null);
    return NextResponse.json(validMemberships);

  } catch (error: any) {
    console.error('----------------------------------------');
    console.error('FETCH MEMBERSHIPS API ERROR:');
    console.error('Timestamp:', new Date().toISOString());
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('----------------------------------------');

    return NextResponse.json({ error: 'Internal server error fetching memberships.' }, { status: 500 });
  }
} 