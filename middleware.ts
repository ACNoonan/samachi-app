import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // TODO: Implement authentication check (e.g., check for session cookie or token)
  // For MVP, middleware might be disabled or rely solely on client-side checks/redirects
  // until proper session management is implemented.
  const isAuthenticated = false; // Replace with actual auth check logic (e.g., check cookie)
  
  // Add /create-profile and /dashboard to public paths for MVP
  const publicPaths = ['/login', '/register', '/card/', '/create-profile', '/dashboard']; 
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path)) || request.nextUrl.pathname === '/';

  // Redirect unauthenticated users trying to access protected routes to login
  // This rule will now allow access to /dashboard even if isAuthenticated is false
  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect authenticated users trying to access login/register/create-profile to dashboard
  // We might want to prevent access to /create-profile if already logged in too
  if (isAuthenticated && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register' || request.nextUrl.pathname === '/create-profile')) {
     return NextResponse.redirect(new URL('/dashboard', request.url));
  }

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