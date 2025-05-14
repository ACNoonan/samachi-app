import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { type CookieOptions, createServerClient } from '@supabase/ssr';
import type { Database } from '@/lib/database.types';
import { getOrCreateGlownetCustomer } from '@/lib/glownet';

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const requestUrl = new URL(request.url);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  let cardIdentifierForRedirect: string | undefined; // Used for error redirection if available

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error('[AuthCallback] ERROR: NEXT_PUBLIC_SUPABASE_URL environment variable is not set.');
    return NextResponse.redirect(`${siteUrl}/?error_message=${encodeURIComponent("Server configuration error. Please contact support.")}`);
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('[AuthCallback] ERROR: NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is not set.');
    return NextResponse.redirect(`${siteUrl}/?error_message=${encodeURIComponent("Server configuration error. Please contact support.")}`);
  }

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              console.log('[AuthCallback] supabase.cookies.setAll CALLED for:', 
                { 
                  name,
                  value, // Log the raw value from Supabase
                  options_from_supabase: { ...options } // Log options from Supabase
                }
              );
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // Handle potential errors during cookie setting
            console.error('[AuthCallback] Error in setAll cookies:', error);
          }
        }
      },
    }
  );

  const code = requestUrl.searchParams.get('code');

  if (!code) {
    console.error('[AuthCallback] Error: Auth code not found in callback URL.');
    // cardIdentifier is not known here yet.
    return NextResponse.redirect(`${siteUrl}/?error_message=${encodeURIComponent("Authentication failed: Authorization code missing.")}`);
  }

  try {
    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
    if (sessionError) {
      console.error('[AuthCallback] Error exchanging code for session:', sessionError);
      // cardIdentifier is not known here yet.
      return NextResponse.redirect(`${siteUrl}/?error_message=${encodeURIComponent(`Authentication failed: ${sessionError.message}`)}`);
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('[AuthCallback] Error fetching user after session exchange:', userError);
      // cardIdentifier is not known here yet.
      return NextResponse.redirect(`${siteUrl}/?error_message=${encodeURIComponent("Authentication failed: Could not retrieve user session.")}`);
    }

    console.log('[AuthCallback] User authenticated:', user.id, user.email);

    const cardIdentifierFromMetadata = user.user_metadata?.card_identifier as string | undefined;
    cardIdentifierForRedirect = cardIdentifierFromMetadata; // Set for potential error redirect

    // Username from metadata is no longer used/set at registration time.
    // let username = user.user_metadata?.username as string | undefined; // REMOVED

    if (!cardIdentifierFromMetadata) {
      // This handles the minimal login flow (no card involved)
      // or any generic login not tied to a card registration.
      console.log('[AuthCallback] No card_identifier in user_metadata. Redirecting to dashboard (minimal login flow).');
      return NextResponse.redirect(`${siteUrl}/dashboard?login=success`); 
    }

    // If cardIdentifierFromMetadata IS present, proceed with the existing card claim logic:
    console.log('[AuthCallback] Retrieved from user_metadata:', { cardIdentifier: cardIdentifierFromMetadata });

    // REMOVE block for updating username from metadata
    // if (username) {
    //     const { error: profileUpdateError } = await supabase
    //         .from('profiles')
    //         .update({ username: username })
    //         .eq('id', user.id);
    //     if (profileUpdateError) {
    //         console.warn('[AuthCallback] Warning: Failed to update username in profiles table:', profileUpdateError.message);
    //     }
    // }

    const { data: cardData, error: cardError } = await supabase
      .from('membership_cards')
      .select('id, glownet_event_id, status, user_id')
      .eq('card_identifier', cardIdentifierFromMetadata)
      .single();

    if (cardError) {
      console.error('[AuthCallback] Error fetching membership card:', cardError.message);
      return NextResponse.redirect(`${siteUrl}/card/${cardIdentifierForRedirect}?error_message=${encodeURIComponent("Error accessing card details. Please try again.")}`);
    }
    if (!cardData) {
      console.error('[AuthCallback] Error: Card not found for identifier:', cardIdentifierFromMetadata);
      return NextResponse.redirect(`${siteUrl}/card/${cardIdentifierForRedirect}?error_message=${encodeURIComponent("Invalid card identifier. Please check the card and try again.")}`);
    }
    // If card is already registered to THIS user, redirect to dashboard (this is a login scenario)
    if (cardData.status === 'registered' && cardData.user_id === user.id) {
        console.log('[AuthCallback] Card already registered by this user. Redirecting to dashboard.');
        return NextResponse.redirect(`${siteUrl}/dashboard?message=${encodeURIComponent("Successfully signed in. Card already linked to your account.")}`);
    }
    // If card is registered to ANOTHER user
    if (cardData.status === 'registered' && cardData.user_id !== user.id) {
      console.error('[AuthCallback] Error: Card already registered by another user.', { cardIdentifier: cardIdentifierFromMetadata, cardUserId: cardData.user_id, currentUserId: user.id });
      return NextResponse.redirect(`${siteUrl}/card/${cardIdentifierForRedirect}?error_message=${encodeURIComponent("This card is already claimed by another account.")}`);
    }
    // If card is not in 'unregistered' state (and not caught by the above specific 'registered' cases)
    // This case handles if a user somehow tries to claim a card that's in a state like 'revoked', 'lost', etc.
    // and it's not yet assigned to them.
    if (cardData.status !== 'unregistered') {
      console.error('[AuthCallback] Error: Card is not in a claimable state (unregistered). Status:', cardData.status);
      return NextResponse.redirect(`${siteUrl}/card/${cardIdentifierForRedirect}?error_message=${encodeURIComponent(`This card is not eligible for claiming (Status: ${cardData.status}).`)}`);
    }

    const glownetEventId = cardData.glownet_event_id;
    if (!glownetEventId) {
        console.error('[AuthCallback] Error: glownet_event_id is missing on the membership_card record:', cardIdentifierFromMetadata);
        return NextResponse.redirect(`${siteUrl}/card/${cardIdentifierForRedirect}?error_message=${encodeURIComponent("Card configuration error. Please contact support. (Code: GEID_MISSING)")}`);
    }
    console.log('[AuthCallback] Card validated:', { cardId: cardData.id, glownetEventId });

    const { data: venueData, error: venueError } = await supabase
      .from('venues')
      .select('id, name')
      .eq('glownet_event_id', glownetEventId)
      .single();

    if (venueError) {
      console.error('[AuthCallback] Error fetching venue by glownet_event_id:', glownetEventId, venueError.message);
      return NextResponse.redirect(`${siteUrl}/card/${cardIdentifierForRedirect}?error_message=${encodeURIComponent("Venue configuration error. Please contact support. (Code: VENUE_FETCH_FAIL)")}`);
    }
    if (!venueData) {
      console.error('[AuthCallback] Error: No venue found for glownet_event_id:', glownetEventId);
      return NextResponse.redirect(`${siteUrl}/card/${cardIdentifierForRedirect}?error_message=${encodeURIComponent("No matching venue found for this card. Please contact support. (Code: VENUE_NOT_FOUND)")}`);
    }
    const venueId = venueData.id;
    console.log('[AuthCallback] Venue associated:', { venueId, venueName: venueData.name });

    if (!user.email) {
        console.error('[AuthCallback] Critical Error: User email is missing, cannot provision Glownet customer.');
        return NextResponse.redirect(`${siteUrl}/card/${cardIdentifierForRedirect}?error_message=${encodeURIComponent("User email is missing for Glownet provisioning. Please contact support.")}`);
    }
    // Username for Glownet: Fetch from profile if available, otherwise fallback to email part.
    // Since handle_new_user trigger populates profile.id and profile.email,
    // we should fetch the profile to see if a username was set by user elsewhere or by trigger.
    const { data: userProfile, error: profileFetchError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();
    
    if (profileFetchError && profileFetchError.code !== 'PGRST116') { // PGRST116 = single row not found, which is ok if profile is new
        console.warn('[AuthCallback] Warning fetching profile for Glownet username:', profileFetchError.message);
    }

    const glownetUsername = userProfile?.username || user.email?.split('@')[0] || 'User'; // Ensure a fallback
    const glownetUserProfile = { email: user.email, username: glownetUsername }; 
    
    const glownetCustomerId = await getOrCreateGlownetCustomer(glownetEventId, glownetUserProfile);

    if (!glownetCustomerId) {
      console.error('[AuthCallback] Critical Error: Failed to get or create Glownet customer ID.', { glownetEventId, userEmail: user.email });
      return NextResponse.redirect(`${siteUrl}/card/${cardIdentifierForRedirect}?error_message=${encodeURIComponent("Failed to set up your venue account. Please contact support. (Code: GLOWNET_CID_FAIL)")}`);
    }
    console.log('[AuthCallback] Glownet Customer ID provisioned:', glownetCustomerId);

    // ---BEGIN MODIFICATION: Add retry logic for profile existence ---
    let profileExists = false;
    const MAX_PROFILE_FETCH_RETRIES = 5; // Increased retries slightly
    const PROFILE_FETCH_RETRY_DELAY_MS = 1200; // Increased delay slightly

    for (let i = 0; i < MAX_PROFILE_FETCH_RETRIES; i++) {
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id') // Only need to check for existence
        .eq('id', user.id)
        .maybeSingle(); // Use maybeSingle to handle 0 or 1 row without erroring on 0

      if (existingProfile) {
        profileExists = true;
        console.log(`[AuthCallback] Profile found for user ${user.id} in 'profiles' table on attempt ${i + 1}.`);
        break;
      }

      if (profileError) {
          // Log unexpected errors, but continue retrying for "not found" scenarios
          console.error(`[AuthCallback] Error fetching profile (attempt ${i + 1}/${MAX_PROFILE_FETCH_RETRIES}):`, profileError.message);
          // If it's a critical error other than not found, might consider breaking early
          // For now, we'll let it retry up to MAX_PROFILE_FETCH_RETRIES
      }
      
      if (i < MAX_PROFILE_FETCH_RETRIES - 1) {
        console.log(`[AuthCallback] Profile not yet found for user ${user.id} in 'profiles' table (attempt ${i + 1}/${MAX_PROFILE_FETCH_RETRIES}). Retrying in ${PROFILE_FETCH_RETRY_DELAY_MS}ms...`);
        await new Promise(resolve => setTimeout(resolve, PROFILE_FETCH_RETRY_DELAY_MS));
      }
    }

    if (!profileExists) {
      console.error(`[AuthCallback] CRITICAL: Profile not found for user ${user.id} in 'profiles' table after ${MAX_PROFILE_FETCH_RETRIES} retries. The handle_new_user trigger likely failed or is severely delayed. Aborting card claim.`);
      return NextResponse.redirect(`${siteUrl}/card/${cardIdentifierForRedirect}?error_message=${encodeURIComponent("Profile creation failed. Your account setup is incomplete. Please contact support. (Code: PROFILE_TRIGGER_FAIL)")}`);
    }
    // ---END MODIFICATION ---

    const { error: updateCardError } = await supabase
      .from('membership_cards')
      .update({ user_id: user.id, status: 'registered' })
      .eq('card_identifier', cardIdentifierFromMetadata)
      .eq('status', 'unregistered'); // Important: only update if still unregistered

    if (updateCardError) {
      console.error('[AuthCallback] Error updating membership_card status:', updateCardError.message);
      return NextResponse.redirect(`${siteUrl}/card/${cardIdentifierForRedirect}?error_message=${encodeURIComponent("Failed to update card registration status. Please try again. (Code: CARD_UPDATE_FAIL)")}`);
    }
    console.log('[AuthCallback] Membership card updated successfully:', cardIdentifierFromMetadata);

    const { error: createMembershipError } = await supabase
      .from('memberships')
      .insert({
        user_id: user.id,
        venue_id: venueId,
        card_id: cardData.id, // Use the UUID of the membership_cards record
        glownet_customer_id: glownetCustomerId,
        status: 'active',
      });

    if (createMembershipError) {
      console.error('[AuthCallback] Error creating membership record:', createMembershipError.message);
      // Potentially, here we might want to revert the card update if possible, or flag for reconciliation.
      // For now, a clear error message.
      return NextResponse.redirect(`${siteUrl}/card/${cardIdentifierForRedirect}?error_message=${encodeURIComponent("Failed to create your venue membership. Please contact support. (Code: MEMBERSHIP_CREATE_FAIL)")}`);
    }
    console.log('[AuthCallback] Membership record created successfully for user:', user.id, 'venue:', venueId);

    console.log('[AuthCallback] Successfully processed OTP registration and card claim for user:', user.id, 'card:', cardIdentifierFromMetadata);
    return NextResponse.redirect(`${siteUrl}/dashboard?registration=success&card_id=${cardIdentifierFromMetadata}`); // Added card_id for context

  } catch (error: any) {
    console.error('[AuthCallback] Unhandled exception in callback:', error);
    const redirectUrl = cardIdentifierForRedirect 
        ? `${siteUrl}/card/${cardIdentifierForRedirect}?error_message=${encodeURIComponent("An unexpected error occurred. Please try again. (Code: UNHANDLED_EX)")}`
        : `${siteUrl}/?error_message=${encodeURIComponent("An unexpected error occurred during authentication. Please try again. (Code: UNHANDLED_EX_AUTH)")}`;
    return NextResponse.redirect(redirectUrl);
  }
} 