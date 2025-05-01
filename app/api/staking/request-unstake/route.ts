import { createRouteHandlerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/lib/database.types'; // Assuming types are generated here

// TODO: Implement robust user identification that handles both Supabase session
// and custom Phantom JWTs, potentially extracting logic from middleware.
// For now, this relies on Supabase session and assumes profiles.id = auth.uid().

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Session Error:', sessionError.message);
      return NextResponse.json({ error: 'Failed to get session' }, { status: 500 });
    }

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Assuming for Magic Link users, profiles.id is the same as auth.user.id
    const userProfileId = session.user.id;

    let stake_id: string;
    try {
        const body = await request.json();
        if (!body.stake_id || typeof body.stake_id !== 'string') {
            throw new Error('Missing or invalid stake_id');
        }
        stake_id = body.stake_id;
        // Basic UUID validation (optional but recommended)
        // const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        // if (!uuidRegex.test(stake_id)) {
        //     throw new Error('Invalid stake_id format');
        // }
    } catch (e: any) {
      return NextResponse.json({ error: e.message || 'Invalid request body' }, { status: 400 });
    }


    // 1. Find the specific stake record
    const { data: stake, error: findError } = await supabase
      .from('custodial_stakes')
      .select('id, status, user_profile_id')
      .eq('id', stake_id)
      .single();

    if (findError || !stake) {
      console.error('Find Stake Error:', findError?.message);
      return NextResponse.json({ error: 'Stake not found' }, { status: 404 });
    }

    // 2. Verify ownership and status
    if (stake.user_profile_id !== userProfileId) {
      console.warn(`User ${userProfileId} attempted to unstake record ${stake_id} owned by ${stake.user_profile_id}`);
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (stake.status !== 'staked') {
      return NextResponse.json({ error: `Stake status is already '${stake.status}', cannot request unstake.` }, { status: 400 });
    }

    // 3. Update the stake status
    const { error: updateError } = await supabase
      .from('custodial_stakes')
      .update({
        status: 'unstaking_requested',
        unstake_request_timestamp: new Date().toISOString(), // Use ISO string for timestamptz
      })
      .eq('id', stake_id);

    if (updateError) {
      console.error('Update Stake Error:', updateError.message);
      return NextResponse.json({ error: 'Failed to request unstake' }, { status: 500 });
    }

    console.log(`User ${userProfileId} requested unstake for record ${stake_id}`);
    return NextResponse.json({ message: 'Unstake requested successfully' });

  } catch (error: any) {
    console.error('Unexpected Error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 