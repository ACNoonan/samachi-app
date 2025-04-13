import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAdminKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Admin Key

if (!supabaseUrl || !supabaseAdminKey) {
  console.error('Missing Supabase URL or Admin Key environment variables.');
}

const supabaseAdmin = createClient(supabaseUrl!, supabaseAdminKey!);

// Define a secure cookie name
const SESSION_COOKIE_NAME = 'auth_session';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // 1. Validate Input
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    // 2. Find Profile by Username
    const { data: profile, error: findError } = await supabaseAdmin
      .from('profiles')
      .select('id, username, password_hash') // Select the hash
      .eq('username', username)
      .single(); // Expect exactly one user with this username

    if (findError) {
        // Add specific log for find error
        console.error(`[API Login] Supabase find error for username ${username}:`, findError);
        // Still return generic message to client
        return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
    }
    if (!profile) {
      console.warn(`[API Login] Login attempt failed for username: ${username}. User not found.`);
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 }); // Unauthorized
    }

    // Ensure password_hash is valid before comparing
    if (!profile.password_hash || typeof profile.password_hash !== 'string') {
        console.error(`[API Login] Invalid or missing password hash for username: ${username}. Profile ID: ${profile.id}`);
        // This indicates a problem during profile creation/update
        return NextResponse.json({ error: 'Account configuration error. Please contact support.' }, { status: 500 });
    }

    // 3. Compare Password Hashes
    console.log(`[API Login] Comparing password for username: ${username}`); // Log before compare
    const passwordMatch = await bcrypt.compare(password, profile.password_hash);
    console.log(`[API Login] Password match result for ${username}:`, passwordMatch); // Log after compare

    if (!passwordMatch) {
      console.warn(`Login attempt failed for username: ${username}. Incorrect password.`);
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 }); // Unauthorized
    }

    // 4. Login Successful
    console.log(`Login successful for username: ${username}, Profile ID: ${profile.id}`);

    // 5. Prepare Success Response
    const response = NextResponse.json({
        message: 'Signed in successfully!',
        profile: { id: profile.id, username: profile.username } // Can return profile info
    });

    // 6. Set Session Cookie on the Response
    response.cookies.set(SESSION_COOKIE_NAME, profile.id, {
      httpOnly: true, // Prevent client-side JS access
      secure: process.env.NODE_ENV === 'production', // Use Secure in production (HTTPS)
      maxAge: 60 * 60 * 24 * 7, // Example: 1 week expiry
      path: '/', // Available on all paths
      sameSite: 'lax', // Recommended for most cases
    });

    // 7. Return the Response with the Cookie
    return response;

  } catch (error: any) {
    // --- Enhanced Error Logging --- 
    console.error('-----------------------------------------');
    console.error('LOGIN API ROUTE CRITICAL ERROR:');
    console.error('Timestamp:', new Date().toISOString());
    // Log the specific error object
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    // Log request details if possible (be careful with sensitive data)
    // const requestBody = await request.clone().json().catch(() => ({})); // Avoid logging raw password
    // console.error('Request Body (Username only):', { username: requestBody.username });
    console.error('-----------------------------------------');
    // Return generic error to client
    return NextResponse.json({ error: 'An internal server error occurred during login.' }, { status: 500 });
  }
} 