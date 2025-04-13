import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Define the same secure cookie name
const SESSION_COOKIE_NAME = 'auth_session';

export async function POST(request: Request) {
  try {
    console.log('[API Logout] Clearing session cookie.');

    // Prepare response first
    const response = NextResponse.json({ message: 'Logged out successfully' });

    // Clear the cookie by setting its maxAge to 0 or expiring it
    response.cookies.set(SESSION_COOKIE_NAME, '', { // Set value to empty
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0), // Expire immediately
      path: '/',
      sameSite: 'lax',
    });

    return response;

  } catch (error: any) {
    console.error('[API Logout] Error during logout:', error);
    return NextResponse.json({ error: 'Logout failed.' }, { status: 500 });
  }
}

// Allow GET as well for simpler client-side calls if needed (e.g., link click)
// Although POST is generally preferred for actions that change state.
export async function GET(request: Request) {
    return POST(request); // Just call the POST handler
} 