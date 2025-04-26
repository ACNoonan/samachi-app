// lib/supabase/middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Session configuration
const SESSION_DURATION = 24 * 60 * 60; // 24 hours in seconds
const SECURE_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: SESSION_DURATION
};

// Define public routes that don't require authentication
const PUBLIC_PATHS = [
  '/login',
  '/card/',
  '/create-profile'
];

// Define static file patterns to ignore
const STATIC_PATTERNS = [
  '/_next',
  '/favicon.ico',
  '/images',
  '/fonts',
  // Remove '/api' from static patterns as API routes might need auth
  // '/api' 
];

function isPublicPath(pathname: string, searchParams: URLSearchParams) {
  const normalized = pathname.replace(/\/+$/, ''); // Remove trailing slashes
  
  // Root path is public
  if (normalized === '') return true; 
  
  // Check if the route is in our public paths list
  const isPublic = PUBLIC_PATHS.some(path => 
    normalized === path.replace(/\/+$/, '') || normalized.startsWith(path)
  );
  
  // Special case for create-profile which requires cardId
  if (normalized === '/create-profile') {
    return searchParams.has('cardId');
  }
  
  return isPublic;
}

function isStaticPath(pathname: string) {
  // Check if the path starts with /api or any other static pattern
  if (pathname.startsWith('/api')) return false; // API routes are not static
  return STATIC_PATTERNS.some(pattern => pathname.startsWith(pattern));
}

export async function middleware(request: NextRequest) {
  // Skip middleware for static files (but NOT API routes)
  if (isStaticPath(request.nextUrl.pathname)) {
    // console.log('[Middleware] Skipping static path:', request.nextUrl.pathname);
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => request.cookies.get(name)?.value,
        set: (name: string, value: string, options: CookieOptions) => {
          // Modify the request cookies for the current request flow
          request.cookies.set({ name, value, ...options });
          // Set the cookie on the response to be sent back to the browser
          response.cookies.set({ name, value, ...SECURE_COOKIE_OPTIONS, ...options });
        },
        remove: (name: string, options: CookieOptions) => {
          // Modify the request cookies for the current request flow
          request.cookies.set({ name, value: '', ...options });
          // Set the cookie on the response to be sent back to the browser
          response.cookies.set({ name, value: '', ...SECURE_COOKIE_OPTIONS, ...options });
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  const { pathname, searchParams } = request.nextUrl;
  const authenticated = !!user;
  const publicPath = isPublicPath(pathname, searchParams);

  // Add logging for debugging
  console.log('[Middleware] Path:', pathname, 'Authenticated:', authenticated, 'Public:', publicPath, 'Error:', error ? error.name : null);


  // Handle potential session errors first
  if (error) {
    console.warn('[Middleware] Auth error encountered:', error.message);
    // If it's not the expected "no session" error, try clearing cookies.
    if (error.name !== 'AuthSessionMissingError' && error.name !== 'AuthInvalidCredentialsError') { 
      console.log('[Middleware] Clearing auth cookies due to unexpected error:', error.name);
      // Clear the main auth token cookie by name
      response.cookies.delete('sb-auth-token'); 
      // Attempt to clear potential PKCE-related cookies as well
      response.cookies.delete('sb-pkce-verifier');
    }
    // Allow the request to continue; the redirection logic below will handle
    // redirecting to login if necessary based on the (now potentially cleared) auth state.
  }


  // --- Authentication and Redirection Logic ---

  // Rule 1: If accessing root path ('/'), redirect based on auth status
  if (pathname === '/') {
    const targetUrl = authenticated ? '/dashboard' : '/login';
    // console.log(`[Middleware] Root path access. Redirecting to ${targetUrl}`);
    return NextResponse.redirect(new URL(targetUrl, request.url));
  }

  // Rule 2: If authenticated...
  if (authenticated) {
    // ...and trying to access login or create-profile, redirect to dashboard
    if (pathname === '/login' || pathname === '/create-profile') {
      // console.log('[Middleware] Authenticated user on auth page. Redirecting to dashboard.');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // ...otherwise, allow access (response is already set to NextResponse.next())
  } 
  // Rule 3: If NOT authenticated...
  else {
    // ...and trying to access a protected path, redirect to login
    if (!publicPath) {
      // console.log('[Middleware] Unauthenticated user on protected path. Redirecting to login.');
      const redirectUrl = new URL('/login', request.url);
      // Add the original URL as a query parameter to redirect back after login
      if (pathname !== '/') { // Avoid redirecting back to root
          redirectUrl.searchParams.set('redirectTo', pathname + request.nextUrl.search);
      }
      return NextResponse.redirect(redirectUrl);
    }
    // ...and accessing a public path, allow access (response is already NextResponse.next())
  }

  // --- Default: Allow the request ---
  // console.log('[Middleware] Allowing request for path:', pathname);
  return response;
}

export const config = {
  matcher: [
    // Match all routes except static files and specific assets
    // Exclude paths starting with /_next/ (static files), /api/ (API routes, handled separately), 
    // and paths containing a dot (.) indicating a file extension.
    '/((?!api|_next/static|_next/image|favicon.ico|.*\..*).*)',
  ],
}; 