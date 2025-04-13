// lib/supabase/middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Refresh session if expired - important!
  const { data: { user } } = await supabase.auth.getUser();

  // --- Your Custom Logic Here (Copied from previous plan) ---
  const { pathname } = request.nextUrl;
  const isAuthenticated = !!user;

  console.log(`[Middleware] Path: ${pathname}, Auth User: ${isAuthenticated ? user.id : 'None'}`);

  const publicPaths = ['/login', '/card/'];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path)) || pathname === '/';

  // Redirect unauthenticated users from protected paths
  if (!isAuthenticated && !isPublicPath) {
     // Allow create-profile only if coming from card scan
     if (pathname === '/create-profile' && request.nextUrl.searchParams.has('cardId')) {
         console.log(`[Middleware] Allowing unauthenticated access to /create-profile with cardId`);
         // Still return the original response to allow Supabase cookie handling
         return response;
     }
     console.log(`[Middleware] Redirecting unauthenticated user from ${pathname} to /login`);
     return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect authenticated users from login or root path
  if (isAuthenticated && (pathname === '/login' || pathname === '/')) {
     console.log(`[Middleware] Redirecting authenticated user from ${pathname} to /dashboard`);
     return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  // --- End Custom Logic ---

  return response // Return the response object (handles potential cookie updates)
} 