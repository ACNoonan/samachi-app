import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define the same secure cookie name
const SESSION_COOKIE_NAME = 'auth_session';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // 1. Check for the session cookie
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  const isAuthenticated = !!sessionCookie; // User is authenticated if the cookie exists

  console.log(`[Middleware] Path: ${request.nextUrl.pathname}, Cookie found: ${isAuthenticated}`);

  // 2. Define public paths (paths accessible without authentication)
  // Remove /dashboard, /create-profile - they should require auth or be handled differently
  const publicPaths = ['/login', '/card/'];
  // Allow root path and API routes implicitly (though matcher excludes API)
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path)) || request.nextUrl.pathname === '/';

  // 3. Handle Redirections

  // If user is NOT authenticated and trying to access a non-public path
  if (!isAuthenticated && !isPublicPath) {
    console.log(`[Middleware] Redirecting unauthenticated user from ${request.nextUrl.pathname} to /login`);
    // Special case: Allow access to /create-profile only if coming from card scan (has cardId query param)
    if (request.nextUrl.pathname === '/create-profile' && request.nextUrl.searchParams.has('cardId')) {
        console.log(`[Middleware] Allowing unauthenticated access to /create-profile with cardId`);
        return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user IS authenticated and trying to access login or root path (after login)
  if (isAuthenticated && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/')) {
    console.log(`[Middleware] Redirecting authenticated user from ${request.nextUrl.pathname} to /dashboard`);
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user IS authenticated and trying to access /create-profile (shouldn't happen)
  if (isAuthenticated && request.nextUrl.pathname === '/create-profile') {
     console.log(`[Middleware] Redirecting authenticated user from /create-profile to /dashboard`);
     return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Otherwise, allow the request to proceed
  return NextResponse.next();
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 