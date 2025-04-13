import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { getGlownetCustomerDetails, type GlownetCustomer } from '@/lib/glownet';

// Helper function now gets cookies internally from the request context if needed,
// but for this specific case, just reading from the direct cookies() call is fine.
// Updated to accept the resolved cookie store directly.
async function getAuthenticatedUserId(cookieStore: Awaited<ReturnType<typeof cookies>>): Promise<string | null> {
    // Example: Read the session cookie set during login/claim
    const sessionCookie = cookieStore.get('auth_session');
    if (sessionCookie && sessionCookie.value) {
        // In a real app, you might need to validate this session ID against your DB
        console.log(`Auth: Found user ID ${sessionCookie.value} in cookie.`);
        return sessionCookie.value; // Assuming the cookie value IS the user's Supabase profile ID (UUID)
    }
    console.warn('Auth: No session cookie found.');
    return null;
}

export async function GET(
  request: Request,
  { params }: { params: { membershipId: string } }
) {
  const membershipId = params.membershipId;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  try {
    // 1. Authenticate User
    const profileId = await getAuthenticatedUserId(cookieStore);
    if (!profileId) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    // 2. Fetch Membership and Venue Details from Supabase
    console.log(`Fetching membership ${membershipId} for profile ${profileId}...`);
    const { data: membership, error: membershipError } = await supabase
      .from('memberships')
      .select(`
        id,
        profile_id,
        venue_id,
        glownet_customer_id,
        status,
        venues ( glownet_event_id )
      `)
      .eq('id', membershipId)
      .eq('profile_id', profileId) // Ensure the membership belongs to the authenticated user
      .single();

    if (membershipError) {
      console.error(`Error fetching membership ${membershipId} for profile ${profileId}:`, membershipError);
      return NextResponse.json({ error: 'Failed to retrieve membership details.' }, { status: 500 });
    }

    if (!membership) {
      console.warn(`Membership ${membershipId} not found or does not belong to profile ${profileId}.`);
      return NextResponse.json({ error: 'Membership not found or access denied.' }, { status: 404 });
    }

    // 3. Validate required Glownet IDs
    const glownetCustomerId = membership.glownet_customer_id;
    // Type guard for nested venue data
    const glownetEventId = membership.venues?.glownet_event_id;

    if (!glownetCustomerId) {
      console.error(`Membership ${membershipId} is missing Glownet Customer ID.`);
      return NextResponse.json({ error: 'Membership is not correctly linked to Glownet.' }, { status: 409 }); // 409 Conflict - data inconsistency
    }
    if (!glownetEventId) {
      console.error(`Venue associated with membership ${membershipId} (Venue ID: ${membership.venue_id}) is missing Glownet Event ID.`);
      return NextResponse.json({ error: 'Associated venue is not correctly linked to Glownet.' }, { status: 409 });
    }

    console.log(`Found Glownet IDs: Customer ${glownetCustomerId}, Event ${glownetEventId}`);

    // 4. Fetch Customer Details from Glownet
    let glownetCustomerDetails: GlownetCustomer;
    try {
        glownetCustomerDetails = await getGlownetCustomerDetails(glownetEventId, glownetCustomerId);
        console.log(`Successfully fetched Glownet details for customer ${glownetCustomerId}`);
    } catch (glownetError: any) {
        console.error(`Failed to fetch Glownet customer details for customer ${glownetCustomerId} (Event ${glownetEventId}):`, glownetError);
        // Consider different status codes based on Glownet error (e.g., 404 if customer/event not found there)
        return NextResponse.json({ error: 'Failed to fetch details from Glownet.' }, { status: 502 }); // 502 Bad Gateway - issue communicating with upstream
    }

    // 5. (Optional) Update Supabase Membership Status/Timestamp
    // Example: Update last_check_in_at timestamp if you add that column
    /*
    const { error: updateError } = await supabase
        .from('memberships')
        .update({ last_check_in_at: new Date().toISOString() })
        .eq('id', membershipId);
    if (updateError) {
        console.warn(`Failed to update last_check_in_at for membership ${membershipId}:`, updateError);
        // Non-critical, maybe just log it
    }
    */

    // 6. Return Glownet Customer Details
    return NextResponse.json(glownetCustomerDetails);

  } catch (error: any) {
    console.error('----------------------------------------');
    console.error('MEMBERSHIP CHECK-IN API ERROR:');
    console.error('Membership ID:', params.membershipId)
    console.error('Timestamp:', new Date().toISOString());
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('----------------------------------------');

    // Default error response
    let message = 'An internal server error occurred during check-in.';
    let status = 500;

    // Customize based on specific errors if needed
    if (error.message?.includes('Authentication required')) {
        status = 401;
        message = error.message;
    } else if (error.message?.includes('not found or access denied')) {
        status = 404;
        message = error.message;
    } else if (error.message?.includes('correctly linked')) {
        status = 409;
        message = error.message;
    } else if (error.message?.includes('Glownet')) {
        status = 502;
        message = error.message;
    }

    return NextResponse.json({ error: message }, { status: status });
  }
} 