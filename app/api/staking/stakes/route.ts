import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { Database } from '@/lib/database.types';

// TODO: Implement robust user identification that handles both Supabase session
// and custom Phantom JWTs.

export async function GET() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  );

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

    const { data: stakes, error: fetchError } = await supabase
      .from('custodial_stakes')
      .select('id, amount_staked, deposit_timestamp, status, unstake_request_timestamp, unstake_transaction_signature')
      .eq('user_profile_id', userProfileId)
      .order('deposit_timestamp', { ascending: false });

    if (fetchError) {
      console.error('Fetch Stakes Error:', fetchError.message);
      return NextResponse.json({ error: 'Failed to fetch stakes' }, { status: 500 });
    }

    return NextResponse.json(stakes || []);

  } catch (error: any) {
    console.error('Unexpected Error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 