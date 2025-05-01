import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/lib/database.types'; // Adjusted import path

export async function GET() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore); // Removed <Database> generic

    // 1. Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        console.error('GET /api/staking/balance: Auth error or no user', authError);
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // 2. Get the corresponding profile ID
    // Assuming your profiles table links auth.users.id to profiles.user_id
    // Adjust the column name if necessary (e.g., if it's profiles.id directly)
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id') // Select the profile ID (which is the FK in custodial_stakes)
        .eq('id', user.id) // Match the authenticated user's ID
        .single();

    if (profileError || !profile) {
        console.error(`GET /api/staking/balance: Profile not found for user ${user.id}`, profileError);
        // Return 0 balance if profile doesn't exist?
        // Or return an error? Let's return 0 for now.
        return NextResponse.json({ balance: 0 });
        // Alternatively: return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }

    const userProfileId = profile.id;

    // 3. Query the custodial_stakes table
    try {
        const { data, error: sumError } = await supabase
            .from('custodial_stakes')
            .select('amount_staked')
            .eq('user_profile_id', userProfileId)
            .eq('status', 'staked'); // Only sum stakes with 'staked' status

        if (sumError) {
            console.error(`GET /api/staking/balance: Error querying stakes for profile ${userProfileId}`, sumError);
            throw sumError;
        }

        // 4. Calculate the sum
        const totalStaked = data?.reduce((sum, stake) => {
            // Ensure amount_staked is treated as a number
            const amount = typeof stake.amount_staked === 'number' 
                ? stake.amount_staked 
                : parseFloat(stake.amount_staked || '0');
            return sum + (isNaN(amount) ? 0 : amount);
        }, 0) || 0;

        console.log(`GET /api/staking/balance: User ${user.id} (Profile ${userProfileId}) balance: ${totalStaked}`);

        // 5. Return the balance
        return NextResponse.json({ balance: totalStaked });

    } catch (error: any) {
        console.error(`GET /api/staking/balance: Unexpected error for profile ${userProfileId}`, error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
} 