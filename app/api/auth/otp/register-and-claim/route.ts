import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { z } from 'zod';

const otpRequestSchema = z.object({
  email: z.string().email('Invalid email address.'),
  cardIdentifier: z.string().min(1, 'Card identifier is required.'),
  // username: z.string().optional(), // REMOVED: Username can be optional at this stage
});

export async function POST(request: Request) {
  const cookieStore = cookies();
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error('ERROR: NEXT_PUBLIC_SUPABASE_URL environment variable is not set.');
    return NextResponse.json({ error: 'Server configuration error: Missing Supabase URL.' }, { status: 500 });
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('ERROR: NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is not set.');
    return NextResponse.json({ error: 'Server configuration error: Missing Supabase Anon Key.' }, { status: 500 });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Next.js's cookieStore.set uses a different options structure name directly
          // but the properties like path, maxAge, etc. are compatible.
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          // For Next.js App Router, use delete or set with empty value and past expiry
          cookieStore.delete({ name, ...options });
          // Alternatively, some prefer: cookieStore.set({ name, value: '', ...options, maxAge: 0 });
        },
      },
    }
  );

  let requestData;
  try {
    requestData = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body. Expected JSON.' }, { status: 400 });
  }

  const parsed = otpRequestSchema.safeParse(requestData);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input.', details: parsed.error.flatten() }, { status: 400 });
  }

  // const { email, cardIdentifier, username } = parsed.data; // OLD
  const { email, cardIdentifier } = parsed.data; // NEW: username removed

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    console.error('ERROR: NEXT_PUBLIC_SITE_URL environment variable is not set.');
    return NextResponse.json({ error: 'Server configuration error. Ensure NEXT_PUBLIC_SITE_URL is set.' }, { status: 500 });
  }
  
  const emailRedirectTo = new URL('/auth/callback', siteUrl).toString();

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: emailRedirectTo,
      data: {
        card_identifier: cardIdentifier,
        // username: username, // REMOVED
      },
    },
  });

  if (error) {
    console.error('Supabase signInWithOtp error:', error);
    // Supabase errors often have a `status` property that can be used for HTTP status code
    return NextResponse.json({ error: error.message || 'Failed to send OTP.', details: error.cause }, { status: (error as any).status || 500 });
  }

  // console.log('OTP sent successfully to:', email, 'for card:', cardIdentifier, 'with username:', username, 'Supabase response data:', data); // OLD
  console.log('OTP sent successfully to:', email, 'for card:', cardIdentifier, 'Supabase response data:', data); // NEW: username removed from log
  // It's good practice not to return the full user object or session here, 
  // as the OTP flow isn't complete yet. Just a success message.
  return NextResponse.json({ message: 'OTP sent successfully. Please check your email.' }, { status: 200 });
} 