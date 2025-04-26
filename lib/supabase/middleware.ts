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
  '/api'
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
  return STATIC_PATTERNS.some(pattern => pathname.startsWith(pattern));
}

export async function middleware(request: NextRequest) {
  // Skip middleware for static files and API routes
  if (isStaticPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => request.cookies.get(name)?.value,
        set: (name: string, value: string, options: CookieOptions) => {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...SECURE_COOKIE_OPTIONS, ...options });
        },
        remove: (name: string, options: CookieOptions) => {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
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
  console.log('[Middleware] Path:', pathname, 'Authenticated:', authenticated, 'Public:', publicPath, 'Error:', error);

  // If session error, clear cookies
  if (error) {
    // Clear all auth-related cookies
    const cookies = ['sb-auth-token', 'sb-access-token', 'sb-refresh-token'];
    cookies.forEach(cookieName => {
      response.cookies.set({
        name: cookieName,
        value: '',
        ...SECURE_COOKIE_OPTIONS,
        maxAge: 0 // Immediately expire the cookie
      });
    });
    
    // Only redirect if we're not already on the login page
    if (pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // If accessing root path ('/'), redirect based on auth status
  if (pathname === '/') {
    if (authenticated) {
      // If authenticated, redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      // If not authenticated, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // If not authenticated and not on a public path, redirect to login
  if (!authenticated && !publicPath) {
    const redirectUrl = new URL('/login', request.url);
    // Add the original URL as a query parameter to redirect back after login
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If authenticated and on /login, redirect to dashboard
  if (authenticated && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Otherwise, allow
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 