import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';
import { USDC_MINT_ADDRESS } from '@/lib/constants';
import { getGlownetCustomerVirtualBalance } from '@/lib/glownet'; // Adjust relative path

// --- Configuration (Should match lib/glownet.ts) ---
const GLOWNET_UNIT_MULTIPLIER = 100;

// Placeholder function for Glownet API calls (REMOVED - Now using imported helper)
// async function getGlownetSpentAmount(...) { ... }
// async function resetGlownetTagBalance(...) { ... }


export async function POST(request: Request) {
    const cookieStore = cookies();
    const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value },
                set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
                remove(name: string, options: CookieOptions) { cookieStore.delete({ name, ...options }) },
            },
        }
    );

    // 1. Authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        console.error('POST /api/memberships/check-out: Auth error', authError);
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userProfileId = user.id;

    // 2. Parse Input
    let venueId: string;
    try {
        const body = await request.json();
        venueId = body.venueId;
        if (!venueId || typeof venueId !== 'string') {
            return NextResponse.json({ error: 'Invalid input: venueId is required.' }, { status: 400 });
        }
    } catch (error) {
        console.error('POST /api/memberships/check-out: Error parsing body', error);
        return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    console.log(`POST /api/memberships/check-out: User ${userProfileId} attempting check-out for venue ${venueId}`);
    let membershipId: string | undefined = undefined; // For logging

    try {
        // 3. Fetch Membership & Venue Details
        // Need last_funded_amount, glownet_customer_id, and glownet_event_id
        const { data: membership, error: membershipError } = await supabase
            .from('memberships')
            .select(`
                id,
                status,
                last_funded_amount,
                glownet_customer_id,
                venues ( glownet_event_id )
            `)
            .eq('user_id', userProfileId)
            .eq('venue_id', venueId)
            .single();

        if (membershipError) {
            console.error(`Check-out Error: DB error fetching membership for user ${userProfileId}, venue ${venueId}`, membershipError);
            return NextResponse.json({ error: 'Could not retrieve membership details.' }, { status: 500 });
        }
        if (!membership) {
            return NextResponse.json({ error: 'No membership found for this venue.' }, { status: 404 });
        }
        membershipId = membership.id; // Store for logging

        // Validate Status
        if (membership.status !== 'checked-in') {
             return NextResponse.json({ error: `Cannot check out. Membership status is: ${membership.status}` }, { status: 400 });
        }
         
        // Validate Glownet IDs and last funded amount
        if (membership.last_funded_amount === null || membership.last_funded_amount === undefined || typeof membership.last_funded_amount !== 'number' ) {
             console.error(`Check-out Error: Invalid or missing last_funded_amount for membership ${membership.id}. Cannot calculate spent amount.`);
             // Treat this as an error because we can't determine spent amount accurately
             return NextResponse.json({ error: 'Cannot check out. Funding amount not recorded correctly.' }, { status: 500 });
        }
        if (!membership.glownet_customer_id) {
            console.error(`Check-out Error: Membership ${membership.id} is missing Glownet Customer ID.`);
            return NextResponse.json({ error: 'Membership configuration incomplete (missing Glownet Customer ID).' }, { status: 500 });
        }
        if (!membership.venues?.glownet_event_id) {
             console.error(`Check-out Error: Venue associated with membership ${membership.id} is missing Glownet Event ID.`);
             return NextResponse.json({ error: 'Venue configuration incomplete (missing Glownet Event ID).' }, { status: 500 });
        }

        const lastFundedStandard = membership.last_funded_amount;
        const glownetCustomerId = membership.glownet_customer_id;
        const glownetEventId = membership.venues.glownet_event_id;

        // 4. Glownet API Call - Get Current Balance
        // ========================================
        console.log(`Check-out: Getting Glownet virtual balance for user ${userProfileId}, customer ${glownetCustomerId}, event ${glownetEventId}`);
        let currentBalanceStandard = 0;
        try {
            // Helper function returns balance in STANDARD units
            currentBalanceStandard = await getGlownetCustomerVirtualBalance(glownetEventId, glownetCustomerId);
            console.log(`Check-out: Current Glownet virtual balance: ${currentBalanceStandard}`);
        } catch (glownetError: any) {
            console.error(`Check-out Error: Failed to get Glownet balance for user ${userProfileId}. Error: ${glownetError.message}`);
            // If we can't get the balance, we can't calculate spent amount reliably.
            return NextResponse.json({ error: 'Failed to retrieve current balance from Glownet.' }, { status: 502 }); 
        }
        // ========================================

        // 5. Calculate Spent Amount (in Standard Units)
        // Ensure precision, especially when dealing with floating point numbers
        const spentAmountStandard = Math.max(0, parseFloat((lastFundedStandard - currentBalanceStandard).toFixed(2)));
        console.log(`Check-out: Calculated spent amount: ${spentAmountStandard} (Funded: ${lastFundedStandard}, Remaining: ${currentBalanceStandard})`);

        // 6. Glownet API Call - Reset Tag Balance (Optional - Skipped)
        // ==========================================================
        // If needed, call a Glownet endpoint here to zero out the balance
        // e.g., using a negative virtual_topup: await glownetVirtualTopup(eventId, customerId, -currentBalanceStandard);
        // ==========================================================

        // 7. Record Withdrawal in DB if amount spent > 0
        if (spentAmountStandard > 0) {
            console.log(`Check-out: Recording withdrawal of ${spentAmountStandard} for user ${userProfileId}`);
            const { error: withdrawalError } = await supabase
                .from('custodial_withdrawals')
                .insert({
                    user_profile_id: userProfileId,
                    amount_withdrawn: spentAmountStandard, // Store standard units
                    withdrawal_transaction_signature: `glownet_settlement_m_${membership.id}_${new Date().toISOString()}`, // Unique placeholder signature
                    token_mint_address: USDC_MINT_ADDRESS // Use imported constant
                });

            if (withdrawalError) {
                 console.error(`Check-out CRITICAL Error: Failed to insert withdrawal record for user ${userProfileId}, membership ${membership.id}, amount ${spentAmountStandard}`, withdrawalError);
                 // Needs manual reconciliation.
                 return NextResponse.json({ error: 'Failed to record settlement amount after confirming spending. Please contact support.' }, { status: 500 });
            }
             console.log(`Check-out: Successfully recorded withdrawal for user ${userProfileId}`);
        } else {
             console.log(`Check-out: No amount spent by user ${userProfileId} (Spent: ${spentAmountStandard}). Skipping withdrawal record.`);
        }

        // 8. Update Membership Status in DB
        console.log(`Check-out: Updating membership ${membership.id} status to 'active' for user ${userProfileId}`);
        const { error: updateError } = await supabase
            .from('memberships')
            .update({
                status: 'active',
                last_check_in_at: null, // Clear check-in time
                last_funded_amount: null // Clear funded amount
            })
            .eq('id', membership.id);

        if (updateError) {
            console.error(`Check-out Error: Failed to update membership status for user ${userProfileId}, membership ${membership.id}`, updateError);
             return NextResponse.json({ error: 'Check-out complete but failed to finalize membership status. Please contact support if issues persist.' }, { status: 500 });
        }

        // 9. Success Response
        console.log(`Check-out successful for user ${userProfileId} at venue ${venueId}. Settled amount: ${spentAmountStandard}`);
        return NextResponse.json({ 
            message: 'Check-out successful', 
            settledAmount: spentAmountStandard // Return the settled amount
        }, { status: 200 });

    } catch (error: any) {
        console.error(`POST /api/memberships/check-out: FAILED for user ${userProfileId}, membership ${membershipId ?? 'N/A'}. Error:`, error);
        // Check for specific errors from Glownet or DB
         if (error.message.startsWith('Glownet API Error:') || 
             error.message.startsWith('Failed to communicate with Glownet') ||
             error.message.includes('Could not retrieve valid virtual balance') ||
             error.message.includes('Funding amount not recorded correctly')) {
             return NextResponse.json({ error: `Check-out failed: ${error.message}` }, { status: 500 }); 
        }
        return NextResponse.json({ error: 'Internal Server Error during check-out.' }, { status: 500 });
    }
} 