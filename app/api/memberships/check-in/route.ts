import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';
import { glownetVirtualTopup } from '@/lib/glownet'; // Import the Glownet helper

// Helper function to calculate staked balance (can be moved to a lib file)
// Ensure this function returns balance in STANDARD units (e.g., 10.50)
async function calculateStakedBalance(supabase: ReturnType<typeof createServerClient<Database>>, userProfileId: string): Promise<number> {
    const {
      data: stakeData,
      error: stakeError,
    } = await supabase
      .from('custodial_stakes')
      .select('amount_staked')
      .eq('user_profile_id', userProfileId);

    const {
        data: withdrawalData,
        error: withdrawalError,
    } = await supabase
      .from('custodial_withdrawals')
      .select('amount_withdrawn')
      .eq('user_profile_id', userProfileId);

    if (stakeError || withdrawalError) {
        console.error(`Balance Calc Error for ${userProfileId}:`, stakeError, withdrawalError);
        // Throw a more specific error for the calling function to catch
        throw new Error('Database error calculating available balance.');
    }

    // Assuming amount_staked and amount_withdrawn are stored in STANDARD units
    const totalStakedStandard = stakeData?.reduce((sum, stake) => sum + (stake.amount_staked ?? 0), 0) ?? 0;
    const totalWithdrawnStandard = withdrawalData?.reduce((sum, withdrawal) => sum + (withdrawal.amount_withdrawn ?? 0), 0) ?? 0;

    const availableBalanceStandard = totalStakedStandard - totalWithdrawnStandard;
    console.log(`Calculated available balance for ${userProfileId}: ${availableBalanceStandard} (Staked: ${totalStakedStandard}, Withdrawn: ${totalWithdrawnStandard})`);
    return availableBalanceStandard; // Return standard units
}


export async function POST(request: Request) {
    const cookieStore = cookies();
    const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    cookieStore.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                    cookieStore.delete({ name, ...options })
                },
            },
        }
    );

    // 1. Authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        console.error('POST /api/memberships/check-in: Auth error', authError);
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse Input
    let venueId: string;
    try {
        const body = await request.json();
        venueId = body.venueId;
        if (!venueId || typeof venueId !== 'string') {
            return NextResponse.json({ error: 'Invalid input: venueId is required and must be a string.' }, { status: 400 });
        }
    } catch (error) {
        console.error('POST /api/memberships/check-in: Error parsing body', error);
        return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const userProfileId = user.id;
    console.log(`POST /api/memberships/check-in: User ${userProfileId} attempting check-in for venue ${venueId}`);

    let availableBalanceStandard = 0; // Define here to use in finally block if needed
    let membershipId: string | undefined = undefined; // For potential rollback logging

    try {
        // 3. Fetch Active Membership & Related Venue Glownet ID
        const { data: membership, error: membershipError } = await supabase
            .from('memberships')
            .select(`
                id,
                status,
                glownet_customer_id,
                venues ( glownet_event_id )
            `) 
            .eq('user_id', userProfileId)
            .eq('venue_id', venueId)
            .single();

        if (membershipError) {
            console.error(`Check-in Error: DB error fetching membership/venue for user ${userProfileId}, venue ${venueId}`, membershipError);
            return NextResponse.json({ error: 'Could not retrieve membership details.' }, { status: 500 });
        }
        if (!membership) {
            return NextResponse.json({ error: 'No active membership found for this venue.' }, { status: 404 });
        }
        membershipId = membership.id; // Store for logging

        // Validate membership status
        if (membership.status !== 'active') {
             return NextResponse.json({ error: `Cannot check in. Membership status is currently: ${membership.status}` }, { status: 400 });
        }

        // Validate Glownet IDs
        if (!membership.glownet_customer_id) {
             console.error(`Check-in Error: Membership ${membership.id} is missing Glownet Customer ID.`);
            return NextResponse.json({ error: 'Membership configuration incomplete (missing Glownet Customer ID).' }, { status: 500 });
        }
        if (!membership.venues?.glownet_event_id) {
             console.error(`Check-in Error: Venue associated with membership ${membership.id} is missing Glownet Event ID.`);
             return NextResponse.json({ error: 'Venue configuration incomplete (missing Glownet Event ID).' }, { status: 500 });
        }
        
        const glownetCustomerId = membership.glownet_customer_id;
        const glownetEventId = membership.venues.glownet_event_id;

        // 4. Calculate Staked Balance (Standard Units)
        availableBalanceStandard = await calculateStakedBalance(supabase, userProfileId);

        if (availableBalanceStandard <= 0) {
            return NextResponse.json({ error: 'Cannot check in. No funds currently staked.' }, { status: 400 });
        }

        // 5. Glownet API Call - Fund Tag (Virtual Topup)
        // ==============================================
        console.log(`Check-in: Attempting Glownet virtual top-up for user ${userProfileId} / customer ${glownetCustomerId} / event ${glownetEventId} with ${availableBalanceStandard}`);
        
        // Call the helper function (handles conversion to cents internally)
        // This function will throw an error if the Glownet API call fails
        await glownetVirtualTopup(glownetEventId, glownetCustomerId, availableBalanceStandard);
        
        console.log(`Check-in: Glownet virtual top-up successful for user ${userProfileId}`);
        // ==============================================

        // 6. Update Membership Status in DB
        const now = new Date().toISOString();
        const { error: updateError } = await supabase
            .from('memberships')
            .update({
                status: 'checked-in',
                last_check_in_at: now,
                last_funded_amount: availableBalanceStandard // Store the amount funded in standard units
            })
            .eq('id', membership.id);

        if (updateError) {
            console.error(`Check-in CRITICAL Error: Glownet funding succeeded for user ${userProfileId} but failed to update membership ${membership.id} status!`, updateError);
            // CRITICAL: Glownet funding succeeded, but DB update failed. Potential inconsistency.
            // Needs manual reconciliation. Return an error indicating this.
            return NextResponse.json({ error: 'Check-in partially failed. Glownet tag funded but status update failed. Please contact support.' }, { status: 500 });
        }

        // 7. Success Response
        console.log(`Check-in successful for user ${userProfileId} at venue ${venueId}. Funded: ${availableBalanceStandard}`);
        // Return the funded amount for frontend display
        return NextResponse.json({ 
            message: 'Check-in successful', 
            fundedAmount: availableBalanceStandard 
        }, { status: 200 });

    } catch (error: any) {
        console.error(`POST /api/memberships/check-in: FAILED for user ${userProfileId}, membership ${membershipId ?? 'N/A'}. Error:`, error);
        // Check for specific errors we threw or Glownet errors
        if (error.message.includes('Database error calculating available balance') || 
            error.message.startsWith('Glownet API Error:') ||
            error.message.startsWith('Failed to communicate with Glownet')) {
             // Return specific error messages for clarity
             return NextResponse.json({ error: `Check-in failed: ${error.message}` }, { status: 500 });
        }
        // Generic internal server error for unexpected issues
        return NextResponse.json({ error: 'Internal Server Error during check-in process.' }, { status: 500 });
    }
} 