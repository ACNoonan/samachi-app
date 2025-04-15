import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { getGlownetCustomerDetails, type GlownetCustomer } from '@/lib/glownet';

export async function GET(request: Request) {
  try {
    // 1. Authenticate User
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Auth Error in glownet-details route:', authError);
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }
    const userId = user.id;

    // 2. Fetch the first active membership for the user to get Glownet IDs
    //    We join with venues to get the glownet_event_id
    console.log(`Fetching first active membership for user ${userId} to get Glownet IDs...`);
    const { data: membership, error: membershipError } = await supabase
      .from('memberships')
      .select(`
        glownet_customer_id,
        venues ( glownet_event_id )
      `)
      .eq('user_id', userId)
      .eq('status', 'active') // Assuming 'active' is the status for current memberships
      .limit(1)
      .maybeSingle();

    if (membershipError) {
      console.error(`Error fetching membership for user ${userId}:`, membershipError);
      return NextResponse.json({ error: 'Failed to retrieve membership details.' }, { status: 500 });
    }

    if (!membership || !membership.glownet_customer_id || !membership.venues?.[0]?.glownet_event_id) {
        console.warn(`No active membership with Glownet IDs found for user ${userId}.`);
        // Decide how to handle this: error or empty data? Let's return empty data for now.
        return NextResponse.json({
            message: 'No active Glownet-linked membership found.',
            glownetData: null
         });
    }

    const glownetCustomerId = membership.glownet_customer_id;
    // Type assertion needed as Supabase relationships can be null/arrays
    const glownetEventId = membership.venues[0].glownet_event_id;

    if (typeof glownetEventId !== 'number') {
        console.error(`Invalid glownet_event_id found for user ${userId} membership.`);
        return NextResponse.json({ error: 'Invalid venue configuration.' }, { status: 500 });
    }

    // 3. Fetch Glownet Customer Details
    console.log(`Fetching Glownet details for customer ${glownetCustomerId} in event ${glownetEventId}...`);
    const glownetData: GlownetCustomer = await getGlownetCustomerDetails(
      glownetEventId,
      glownetCustomerId
    );

    // 4. Return relevant data
    //    Select only the fields needed by the frontend to minimize data transfer
    const relevantData = {
        money: glownetData.money,
        virtual_money: glownetData.virtual_money,
        balances: glownetData.balances,
        // Add other fields from GlownetCustomer if needed later
    };

    console.log(`Successfully fetched Glownet details for user ${userId}.`);
    return NextResponse.json({ glownetData: relevantData });

  } catch (error: any) {
    console.error('Error fetching Glownet wallet details:', error);
    // Distinguish Glownet API errors from others if possible
    let errorMessage = 'An unexpected error occurred.';
    if (error instanceof Error && error.message.includes('Glownet API request failed')) {
        errorMessage = 'Failed to retrieve data from Glownet.';
        // Consider specific status codes based on Glownet error if available
         return NextResponse.json({ error: errorMessage }, { status: 502 }); // Bad Gateway
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 