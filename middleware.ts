import { updateSession } from '@/lib/supabase/middleware'
import { NextRequest, NextResponse } from 'next/server'

// Define the same secure cookie name
const SESSION_COOKIE_NAME = 'auth_session';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // updateSession handles session refresh and contains your redirect logic
  return await updateSession(request)
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 