import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server'; // Use server client
import { Database } from '@/lib/database.types';

// TODO: Implement robust user identification that handles both Supabase session
// and custom Phantom JWTs.

export async function GET() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore); // Initialize server client

    // Securely get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        console.error('GET /api/staking/stakes: Auth error or no user', authError);
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Fetch profile using the authenticated user ID
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id) // Use the secure user.id
        .single();

    if (profileError || !profile) {
        console.error(`GET /api/staking/stakes: Profile not found for user ${user.id}`, profileError);
        // Return empty array if profile not found, as they have no stakes
        return NextResponse.json([]);
    }

    const userProfileId = profile.id;

    try {
        // Fetch all stakes for the user profile ID
        const { data: stakes, error: stakeError } = await supabase
            .from('custodial_stakes')
            .select('*') // Select all columns or specific ones needed by frontend
            .eq('user_profile_id', userProfileId)
            .order('deposit_timestamp', { ascending: false }); // Optional: order by timestamp

        if (stakeError) {
            console.error(`GET /api/staking/stakes: Error fetching stakes for profile ${userProfileId}`, stakeError);
            throw new Error('Failed to fetch stake history.');
        }

        console.log(`GET /api/staking/stakes: Found ${stakes?.length ?? 0} stakes for user ${user.id} (Profile ${userProfileId})`);

        // Return the fetched stakes (or empty array if null)
        return NextResponse.json(stakes ?? []);

    } catch (error: any) {
        console.error(`GET /api/staking/stakes: Unexpected error for profile ${userProfileId}`, error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
} 