import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server'; // Use server client

// Define the same secure cookie name used in login/logout
const SESSION_COOKIE_NAME = 'auth_session';

export async function GET(request: Request) {
  const cookieStore = await cookies(); // Await the promise
  const supabase = createClient(cookieStore); // Pass the resolved object

  try {
    // 1. Read the session cookie
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME); // Now 'get' should exist
    if (!sessionCookie || !sessionCookie.value) {
      console.log('[API Session] No session cookie found.');
      return NextResponse.json(null, { status: 401 }); // No session or invalid cookie
    }

    const profileId = sessionCookie.value;

    // 2. Validate the profile ID format (optional but recommended)
    // Basic UUID check - adjust if your IDs are different
    if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(profileId)) {
        console.warn(`[API Session] Invalid UUID format in session cookie: ${profileId}`);
        // Consider clearing the invalid cookie here if desired
        // cookieStore.delete(SESSION_COOKIE_NAME);
        return NextResponse.json(null, { status: 401 });
    }

    // 3. Fetch Profile from Supabase using the ID from the cookie
    console.log(`[API Session] Validating profile ID from cookie: ${profileId}`);
    const { data: profile, error } = await supabase
      .from('profiles')
      // Select only necessary, non-sensitive data
      .select('id, username, twitter_handle, telegram_handle, wallet_address, created_at')
      .eq('id', profileId)
      .single();

    if (error) {
        console.error(`[API Session] Error fetching profile for ID ${profileId}:`, error);
        // If user doesn't exist for the ID in the cookie, treat as unauthorized
        // Supabase throws error with code PGRST116 when .single() finds no rows
        if (error.code === 'PGRST116') {
            console.warn(`[API Session] Profile ID ${profileId} from cookie not found in DB.`);
             return NextResponse.json(null, { status: 401 });
        }
        // Otherwise, it's likely a server error
        return NextResponse.json({ error: 'Database error validating session.' }, { status: 500 });
    }

    if (!profile) {
        // This case might be redundant if .single() always throws PGRST116 on no match,
        // but added for safety.
        console.warn(`[API Session] Profile ID ${profileId} from cookie resulted in no profile data.`);
        return NextResponse.json(null, { status: 401 }); // User not found
    }

    // 4. Return Profile Data
    console.log(`[API Session] Session validated successfully for user: ${profile.username}`);
    return NextResponse.json(profile);

  } catch (error: any) {
    console.error('----------------------------------------');
    console.error('SESSION CHECK API ERROR:');
    console.error('Timestamp:', new Date().toISOString());
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    // Add stack trace if available and helpful in debugging
    if (error.stack) {
        console.error('Stack Trace:', error.stack);
    }
    console.error('----------------------------------------');
    return NextResponse.json({ error: 'Internal server error checking session.' }, { status: 500 });
  }
} 