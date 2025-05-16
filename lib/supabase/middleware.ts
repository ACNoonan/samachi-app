// lib/supabase/middleware.ts (Revised)
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

// Define public PAGE routes that don't require authentication for viewing.
// API routes are handled differently: session is refreshed, but no redirect FROM middleware.
// Individual API routes will do their own auth check.
const PUBLIC_PAGE_PATHS = [
  '/login',
  '/minimal-login', // For our Phase 1 test
  '/auth/callback', // Crucial for OTP
  '/card/',         // Allows /card/ and /card/[card_id]. Note trailing slash.
  // Consider if '/create-profile' page is still active. If not, remove.
];

// Define patterns for static assets/files to be ignored by middleware's core logic.
const IGNORE_PATTERNS = [
  '/_next',          // Next.js internals
  '/favicon.ico',
  '/images',         // Your static image assets (if served from public)
  '/fonts',          // Your static font assets (if served from public)
  // Public folder assets are typically served directly and might not hit middleware,
  // but good to list if patterns could overlap.
];

function isIgnoredPath(pathname: string): boolean {
  return IGNORE_PATTERNS.some(pattern => pathname.startsWith(pattern));
}

/**
 * Checks if a given page path is considered public.
 * This is used for page redirection logic only.
 * Root path ('/') is considered public initially, redirection rules apply.
 */
function isPublicPage(pathname: string): boolean {
  if (pathname === '/') return true; // Root path is handled by specific redirection rules

  for (const publicPathPrefix of PUBLIC_PAGE_PATHS) {
    if (pathname.startsWith(publicPathPrefix)) {
      return true;
    }
  }
  return false;
}

export async function middleware(request: NextRequest) {
  // 1. Skip middleware for explicitly ignored paths (static assets)
  if (isIgnoredPath(request.nextUrl.pathname)) {
    // console.log('[Middleware] Skipping ignored path:', request.nextUrl.pathname);
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
        getAll() {
          const cookies = request.cookies.getAll();
          return cookies;
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
          try {
            // Update request cookies for the current Supabase instance's context
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            // Re-assign response to ensure it's the one Supabase will modify with set-cookie headers
            response = NextResponse.next({
              request, // Pass the modified request
            });
            // Apply cookies to the outgoing response, including secure options
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, { ...SECURE_COOKIE_OPTIONS, ...options });
            });
          } catch (error) {
            console.error('[Middleware] Error in setAll cookies:', error);
            // If an error occurs, ensure we still have a valid response object to return
            // (though it might not have the intended cookies set if error happened mid-way)
            if (!response) {
                response = NextResponse.next({
                    request,
                });
            }
          }
        }
      },
    }
  );

  // 2. ALWAYS attempt to get user and refresh session for all non-ignored paths.
  // This ensures cookies are managed and session is fresh for both pages AND API routes.
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  const { pathname, searchParams, search } = request.nextUrl; // Added 'search'
  const isAuthenticated = !!user;

  console.log(
    `[Middleware] Path: ${pathname}${search}`, // Log full path with query
    `Authenticated: ${isAuthenticated}`,
    `Is API: ${pathname.startsWith('/api')}`,
    `Auth Error: ${authError ? authError.message : null}`
  );

  if (authError && authError.name !== 'AuthSessionMissingError' && authError.name !== 'AuthInvalidCredentialsError') {
    console.warn(`[Middleware] Supabase auth error (${authError.name}): ${authError.message}. Consider clearing cookies if persistent.`);
    // Example: response.cookies.delete('sb-auth-token'); // Be cautious with aggressive cookie clearing
  }

  // 3. Handle Page Redirections (DO NOT redirect API routes from middleware)
  // API routes will perform their own authorization checks using the (now refreshed) session.
  if (!pathname.startsWith('/api')) {
    // Rule: Root path redirection
    if (pathname === '/') {
      const targetUrl = isAuthenticated ? '/dashboard' : '/login'; // Or '/minimal-login' for testing
      // console.log(`[Middleware] Root path. Redirecting to ${targetUrl}`);
      return NextResponse.redirect(new URL(targetUrl, request.url));
    }

    // Rule: Authenticated user on public-only pages (like login)
    if (isAuthenticated) {
      if (pathname === '/login' || pathname === '/minimal-login' || pathname.startsWith('/card/')) { // If user is auth and tries to re-claim/view card
        // console.log(`[Middleware] Authenticated user on auth/card page (${pathname}). Redirecting to dashboard.`);
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    // Rule: Unauthenticated user on a protected page
    else { // Not authenticated
      if (!isPublicPage(pathname)) {
        // console.log(`[Middleware] Unauthenticated user on protected page: ${pathname}. Redirecting to login.`);
        const loginUrl = new URL('/login', request.url); // Or '/minimal-login'
        loginUrl.searchParams.set('redirectTo', pathname + search); // Preserve query params
        return NextResponse.redirect(loginUrl);
      }
    }
  }
  // For API routes, or public pages for unauthenticated users,
  // or authenticated users on allowed pages, the middleware has done its job by refreshing the session.

  // 4. Return the response (which includes any updated Supabase cookies)
  return response;
} 