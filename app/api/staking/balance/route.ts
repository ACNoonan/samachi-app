import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/lib/database.types';

// Define USDC decimals (consider moving to env var or config)
const USDC_DECIMALS = 6;

export async function GET() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        console.error('GET /api/staking/balance: Auth error or no user', authError);
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

    if (profileError || !profile) {
        console.error(`GET /api/staking/balance: Profile not found for user ${user.id}`, profileError);
        // Return 0 balance if profile doesn't exist, as user has no stakes/withdrawals linked
        return NextResponse.json({ balance: 0, balanceUnits: 0 });
    }

    const userProfileId = profile.id;

    try {
        // Fetch total staked amount
        const { data: stakeData, error: stakeError } = await supabase
            .from('custodial_stakes')
            .select('amount_staked')
            .eq('user_profile_id', userProfileId);
            // Removed .eq('status', 'staked'); - Sum all historical deposits

        // Fetch total withdrawn amount
        const { data: withdrawalData, error: withdrawalError } = await supabase
            .from('custodial_withdrawals')
            .select('amount_withdrawn')
            .eq('user_profile_id', userProfileId);

        if (stakeError || withdrawalError) {
            console.error(`GET /api/staking/balance: Error querying stakes/withdrawals for profile ${userProfileId}`, stakeError, withdrawalError);
            throw new Error('Failed to fetch staking data.');
        }

        // Calculate sums (handle potential null/undefined data)
        // These amounts are already standard units (e.g., 100 USDC, not 100_000_000)
        const totalStakedStandard = stakeData?.reduce((sum, stake) => sum + (stake.amount_staked ?? 0), 0) ?? 0;
        const totalWithdrawnStandard = withdrawalData?.reduce((sum, withdrawal) => sum + (withdrawal.amount_withdrawn ?? 0), 0) ?? 0;

        // Calculate final balance in standard units
        const balanceStandard = totalStakedStandard - totalWithdrawnStandard;

        console.log(`GET /api/staking/balance: User ${user.id} (Profile ${userProfileId}) balance: ${balanceStandard}`);

        // Return balance in standard units. Optionally return raw units if needed elsewhere, but calculate correctly.
        // For now, only return the standard balance as 'balance'.
        return NextResponse.json({ balance: balanceStandard /* , balanceUnits: balanceUnits * (10 ** USDC_DECIMALS) */ });

    } catch (error: any) {
        console.error(`GET /api/staking/balance: Unexpected error for profile ${userProfileId}`, error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
} 