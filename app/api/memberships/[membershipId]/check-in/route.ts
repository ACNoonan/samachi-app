import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { getGlownetCustomerDetails, type GlownetCustomer } from '@/lib/glownet';

// Define the expected structure for the Supabase query result
type MembershipWithVenue = {
  id: string; 
  user_id: string; 
  venue_id: string; 
  glownet_customer_id: number | null;
  status: string; 
  venues: { 
    glownet_event_id: number | null;
  } | null;
};

// Define the type for the route parameters object
type CheckInParams = {
  params: { membershipId: string };
};

export async function GET(
  request: NextRequest,
  { params }: CheckInParams
) {
  const membershipId = params.membershipId;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  try {
    // 1. Authenticate User using Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Auth Error in check-in route:', authError);
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }
    const userId = user.id; // Get user ID from Supabase session

    // 2. Fetch Membership and Venue Details from Supabase, ensuring it belongs to the authenticated user
    console.log(`Fetching membership ${membershipId} for user ${userId}...`);
    const { data: membership, error: membershipError } = await supabase
      .from('memberships')
      .select(`
        id,
        user_id,
        venue_id,
        glownet_customer_id,
        status,
        venues ( glownet_event_id )
      `)
      .eq('id', membershipId)
      .eq('user_id', userId)
      .single<MembershipWithVenue>();

    if (membershipError) {
      console.error(`Error fetching membership ${membershipId} for user ${userId}:`, membershipError);
      // Check if error is due to no rows found (PGRST116)
       if (membershipError.code === 'PGRST116') {
          return NextResponse.json({ error: 'Membership not found or access denied.' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to retrieve membership details.' }, { status: 500 });
    }

    // Note: No need for explicit !membership check if .single() throws on no rows

    // 3. Validate required Glownet IDs
    const glownetCustomerId = membership.glownet_customer_id;
    // Type guard for nested venue data
    const glownetEventId = membership.venues?.glownet_event_id;

    if (!glownetCustomerId) {
      console.error(`Membership ${membershipId} is missing Glownet Customer ID.`);
      return NextResponse.json({ error: 'Membership is not correctly linked to Glownet.' }, { status: 409 });
    }

    if (typeof glownetEventId !== 'number') {
        console.error(`Venue data or Glownet Event ID missing for membership ${membershipId}.`);
        return NextResponse.json({ error: 'Associated venue information is missing or incomplete.' }, { status: 409 });
    }

    // 4. Fetch Glownet Customer Details (Check-in status)
    console.log(`Fetching Glownet details for customer ${glownetCustomerId}, event ${glownetEventId}...`);
    const glownetData: GlownetCustomer = await getGlownetCustomerDetails(glownetEventId, glownetCustomerId);

    // 5. Return Relevant Glownet Data (e.g., check-in status, balance, etc.)
    // Adapt the response based on what getGlownetCustomerDetails returns
    return NextResponse.json({
      membershipId: membership.id,
      userId: membership.user_id,
      status: membership.status,
      glownetBalances: glownetData.balances,
      // Include other relevant fields from glownetData
    });

  } catch (error: any) {
    console.error(`Error in GET /api/memberships/[membershipId]/check-in:`, error);
    // Distinguish between Glownet API errors and other errors if possible
    return NextResponse.json({ error: error.message || 'Internal server error during check-in process.' }, { status: 500 });
  }
} 