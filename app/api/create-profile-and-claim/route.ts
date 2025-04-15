import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { createClient as createServerSupabaseClient } from '@/lib/supabase/server'; // Use server client
import {
    createGlownetCustomer,
    getGlownetEventDetailsByGtagUid, // Import the new lookup function
    assignGlownetGtagToCustomer, // <-- Import the new function
    type GlownetLookupResponse,
    type GlownetCustomer      // <-- Import Customer type if needed for response
} from '@/lib/glownet';
import { cookies } from 'next/headers'; // Needed for server client

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAdminKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Admin Key

if (!supabaseUrl || !supabaseAdminKey) {
  console.error('Missing Supabase URL or Admin Key environment variables.');
}

const supabaseAdmin = createClient(supabaseUrl!, supabaseAdminKey!);
const SALT_ROUNDS = 10; // Standard for bcrypt

// Define the same secure cookie name
const SESSION_COOKIE_NAME = 'auth_session';

export async function POST(request: Request) {
  // Await the cookies() call
  const cookieStore = await cookies();
  // Ensure you initialize the Supabase client correctly for Route Handlers
  const supabase = createServerSupabaseClient(cookieStore);

  try {
    const {
      username,
      password,
      twitterHandle,
      telegramHandle,
      walletAddress,
      cardId, // This is the Glownet gtag_uid
      email // Now used for Supabase Auth signup
    } = await request.json();

    // 1. Validate Input (Now includes email for auth)
    if (!email || !password || !cardId || !username) { // username needed for metadata/profile
      return NextResponse.json({ error: 'Missing required fields: email, password, username, cardId' }, { status: 400 });
    }
    if (password.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    // 2. Lookup Glownet Event ID using Gtag UID (cardId) - PAUSED
    /*
    let glownetLookupData: GlownetLookupResponse;
    try {
        glownetLookupData = await getGlownetEventDetailsByGtagUid(cardId);
    } catch (lookupError: any) {
        console.error(`Glownet lookup failed for cardId (gtag_uid: ${cardId}):`, lookupError);
        // Check for 404 specifically from Glownet API error message if possible
        if (lookupError.message?.includes('404')) {
             return NextResponse.json({ error: `Card identifier (gtag) '${cardId}' not found in Glownet.` }, { status: 404 });
        }
         // TEMPORARILY treat Glownet errors as non-blocking for development
        console.warn(`Glownet lookup failed, proceeding with registration anyway (TEMPORARY): ${lookupError.message}`);
        // return NextResponse.json({ error: 'Failed to verify card identifier with Glownet.' }, { status: 503 }); // Use 503 Service Unavailable
    }
    const glownetEventId = glownetLookupData?.event_id; // May be undefined if lookup failed
    console.log(`Glownet lookup successful: Found event_id ${glownetEventId} for card ${cardId}`);
    */

    // 3. Find Corresponding Samachi Venue in Supabase - PAUSED / MODIFIED
    // We need a venue ID to create the membership link.
    // TEMPORARY: Fetch the first available venue as a placeholder.
    // IMPORTANT: Assumes at least one venue exists in the 'venues' table.
    let samachiVenueId: string | null = null;
    const { data: defaultVenueData, error: defaultVenueError } = await supabase
        .from('venues')
        .select('id')
        .limit(1) // Get the first one
        .maybeSingle();

    if (defaultVenueError || !defaultVenueData) {
        console.error("CRITICAL: Could not fetch a default venue ID from Supabase.", defaultVenueError);
        return NextResponse.json({ error: 'System configuration error: No default venue found.' }, { status: 500 });
    }
    samachiVenueId = defaultVenueData.id;
    console.log(`TEMPORARY: Using default venue ID: ${samachiVenueId}`);

    /* // Original venue lookup based on glownetEventId
    const { data: venueData, error: venueError } = await supabase
        .from('venues')
        .select('id, name, glownet_event_id') // Select venue UUID and name
        .eq('glownet_event_id', glownetEventId) // This line depends on the Glownet lookup
        .maybeSingle(); // Could be single or null

    if (venueError) {
        console.error(`Error querying Supabase venues for glownet_event_id ${glownetEventId}:`, venueError);
        return NextResponse.json({ error: 'Database error finding associated venue.' }, { status: 500 });
    }
    if (!venueData) {
        console.error(`No Samachi venue found in Supabase for glownet_event_id ${glownetEventId}. Venue might need syncing.`);
         // TEMPORARILY allow proceeding even if venue not found based on glownet ID
        console.warn(`No Samachi venue found for glownet_event_id ${glownetEventId}, but proceeding (TEMPORARY).`);
        // return NextResponse.json({ error: 'Associated venue not found in our system. Please sync venues.' }, { status: 404 });
    }
     samachiVenueId = venueData?.id; // May be null if not found and we are proceeding temporarily
    // console.log(`Found matching Samachi venue: ID ${samachiVenueId}, Name: ${venueData?.name}`);
     if (!samachiVenueId) {
         console.error("CRITICAL: Proceeding without a valid samachiVenueId. Membership link will fail.");
         // This case should ideally not happen if we enforce finding a venue or using a default
         return NextResponse.json({ error: 'Could not determine target venue.' }, { status: 500 });
     }
    */


    // 4. Find the Membership Card in Supabase and check its status
    const { data: cardRecord, error: cardRecordError } = await supabase
      .from('membership_cards')
      .select('id, user_id, status') // Select the UUID (id)
      .eq('card_identifier', cardId) // Match on the scanned ID
      .single();

    if (cardRecordError || !cardRecord) {
        console.error('Error fetching card record from Supabase or card not found:', cardId, cardRecordError);
        // This implies the card exists in Glownet but not Supabase - potentially needs adding first?
        // For now, treat as not found in our system.
        return NextResponse.json({ error: `Membership card '${cardId}' not registered in Samachi system.` }, { status: 404 });
    }

    if (cardRecord.user_id) {
        console.warn(`Samachi Card Record ${cardId} (ID: ${cardRecord.id}) already claimed by user ${cardRecord.user_id}`);
        return NextResponse.json({ error: 'This membership card has already been claimed.' }, { status: 409 });
    }
    const supabaseCardId = cardRecord.id; // The UUID of the membership_cards record

    // 5. Check if email is already taken (Supabase handles username conflicts via trigger/RLS if needed)
    // Supabase signUp will handle email uniqueness check. We might still want to check walletAddress uniqueness.
    if (walletAddress) {
        const { data: existingWalletProfile, error: findWalletError } = await supabase
            .from('profiles')
            .select('id')
            .eq('wallet_address', walletAddress)
            .maybeSingle();

        if (findWalletError) {
            console.error('Error checking for existing wallet address:', findWalletError);
            // Decide if this is fatal or just a warning
        }
        if (existingWalletProfile) {
             return NextResponse.json({ error: 'Wallet address already linked to another profile.' }, { status: 409 });
        }
    }

    // --- Start Process ---

    // 6. Sign up user with Supabase Auth
    console.log(`Attempting Supabase Auth signup for email: ${email}`);
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        // Data passed to the handle_new_user trigger
        data: {
          username: username,
          twitter_handle: twitterHandle,
          telegram_handle: telegramHandle,
          wallet_address: walletAddress,
        },
      },
    });

    if (signUpError) {
      console.error('Supabase signUp error:', signUpError);
      if (signUpError.message.includes('User already registered') || signUpError.status === 400 || signUpError.status === 422) {
           return NextResponse.json({ error: 'Email address already registered.' }, { status: 409 });
      }
      return NextResponse.json({ error: signUpError.message || 'Failed to create user account.' }, { status: signUpError.status || 500 });
    }

    if (!signUpData.user) {
      console.error('Supabase signUp success but did not return a user object.');
      // This case might indicate email confirmation is required, but we need the user ID to proceed.
      // If email confirmation is enabled and you need to proceed immediately, handle this state.
      // For now, assume immediate user creation or handle later.
      return NextResponse.json({ error: 'User account creation pending confirmation or failed unexpectedly.' }, { status: 500 });
    }

    const userId = signUpData.user.id;
    console.log(`Supabase user created successfully: ${userId} for email ${email}`);

    // NOTE: The trigger 'handle_new_user' has automatically created the profile in public.profiles.

    // 7. Create Glownet Customer & Assign Tag - PAUSED
    /*
    let glownetCustomerId: number | null = null;
    try {
      console.log(`Creating Glownet customer for user ${userId} at event ${glownetEventId}...`); // glownetEventId might be undefined here now
      if (!glownetEventId) { throw new Error("Glownet Event ID is missing, cannot create Glownet customer."); } // Add check

      const glownetCustomer = await createGlownetCustomer(glownetEventId, {
        customer: { first_name: username, email: email }
      });

      if (!glownetCustomer || typeof glownetCustomer.id !== 'number') {
        console.error(`CRITICAL ERROR: Glownet customer created for user ${userId} but ID not found/invalid.`, glownetCustomer);
        throw new Error('Failed to retrieve Glownet customer ID after creation.');
      }
      glownetCustomerId = glownetCustomer.id;
      console.log(`Glownet customer created: ID ${glownetCustomerId}. Assigning tag ${cardId}...`);

      await assignGlownetGtagToCustomer(glownetEventId, glownetCustomerId, cardId);
      console.log(`Successfully assigned gtag ${cardId} to Glownet customer ${glownetCustomerId}.`);

    } catch (glownetError: any) {
      console.error(`NON-CRITICAL ERROR (TEMPORARY): Glownet sync failed for user ${userId}. Will need manual/background sync later.`, glownetError);
      // TEMPORARILY DO NOT ROLL BACK USER CREATION
      // Log this failure prominently for later debugging/syncing.
      // Consider adding a flag to the user profile or membership record indicating Glownet sync is needed.

      // // Original Rollback logic:
      // console.error(`CRITICAL ERROR creating Glownet customer/assigning tag for user ${userId}. Manual cleanup needed.`, glownetError);
      // // Attempt to delete the Supabase user since the Glownet part failed
      // try {
      //   const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
      //   if (deleteError) console.error(`Failed to delete Supabase user ${userId} after Glownet error:`, deleteError);
      //   else console.log(`Successfully deleted Supabase user ${userId} due to Glownet error.`);
      // } catch (adminDeleteError) {
      //   console.error(`Exception during Supabase user cleanup for ${userId}:`, adminDeleteError);
      // }
      // return NextResponse.json({ error: 'Failed to setup Glownet account. User creation rolled back.' }, { status: 500 });
    }
    */

    // 8. Create Membership Record in Supabase
    let membershipId: string | null = null;
    try {
      console.log(`Creating membership record for user ${userId}, venue ${samachiVenueId}, card ${supabaseCardId}`);
       if (!samachiVenueId) {
          console.error("CRITICAL ERROR: Cannot create membership record without a valid venue ID.");
          throw new Error("Missing venue ID for membership creation."); // Throw to trigger cleanup below
       }

      const { data: newMembership, error: membershipError } = await supabase
          .from('memberships')
          .insert({
              user_id: userId,
              venue_id: samachiVenueId, // Use the (potentially default) venue ID
              card_id: supabaseCardId,
              // glownet_customer_id: glownetCustomerId, // Omit Glownet ID for now
              status: 'active'
              // Omit glownet_event_id, card_identifier, glownet_sync_status for now
           })
          .select('id')
          .single();

      if (membershipError || !newMembership) {
        console.error(`CRITICAL ERROR creating membership record for user ${userId}. Manual cleanup needed.`, membershipError);
        throw new Error('Failed to link profile to venue membership.'); // Throw to trigger cleanup
      }
      membershipId = newMembership.id;
      console.log(`Membership record created successfully: ID ${membershipId}`);

    } catch (membershipCatchError: any) {
      console.error(`CRITICAL ERROR during membership record creation for user ${userId}. Attempting cleanup.`, membershipCatchError);
      // Attempt to delete Supabase user and potentially Glownet customer
      try {
        const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
        if (deleteError) console.error(`Failed to delete Supabase user ${userId} after membership error:`, deleteError);
        else console.log(`Successfully deleted Supabase user ${userId} due to membership error.`);
        // Add Glownet customer deletion here if possible/needed
      } catch (cleanupError) {
         console.error(`Exception during cleanup for user ${userId} after membership error:`, cleanupError);
      }
      return NextResponse.json({ error: 'An unexpected error occurred while creating membership link.' }, { status: 500 });
    }

    // 9. Link Card to Profile (Update membership_cards)
    try {
      console.log(`Linking card ${supabaseCardId} to user ${userId}`);
      const { data: updateData, error: updateError } = await supabase
        .from('membership_cards')
        .update({ user_id: userId, status: 'registered' })
        .eq('id', supabaseCardId)
        .is('user_id', null)
        .select('id')
        .single();

      if (updateError || !updateData) {
        console.error(`CRITICAL ERROR updating membership_cards record ${supabaseCardId} for user ${userId}. Manual cleanup needed.`, updateError);
        // This is less critical than the steps above, maybe don't roll back user?
        // Log prominently and perhaps flag the user/card for manual review.
        throw new Error('Failed to link card record to user profile.'); // Throw to trigger cleanup
      }
      console.log(`Card record ${supabaseCardId} successfully linked to user ${userId}`);

    } catch (cardLinkError: any) {
      console.error(`CRITICAL ERROR during card linking for user ${userId}. Attempting cleanup.`, cardLinkError);
      // Attempt cleanup (delete Supabase user, Glownet customer, membership)
      try {
        const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
        if (deleteError) console.error(`Failed to delete Supabase user ${userId} after card link error:`, deleteError);
        else console.log(`Successfully deleted Supabase user ${userId} due to card link error.`);
        // Add Glownet/Membership cleanup if necessary
      } catch (cleanupError) {
        console.error(`Exception during cleanup for user ${userId} after card link error:`, cleanupError);
      }
      return NextResponse.json({ error: 'Failed to finalize card link.' }, { status: 500 });
    }

    // --- End Process ---

    // 10. Success Response
    console.log(`Successfully completed create-profile-and-claim for user ${userId}`);
    // Supabase client library + middleware handle session cookies automatically.
    return NextResponse.json({
      message: 'Account created, card claimed, and venue membership established successfully!',
      userId: userId,
      membershipId: membershipId // Return new membership ID
    });

  } catch (error: any) {
    console.error('----------------------------------------');
    console.error('CREATE PROFILE API ERROR:', error.message);
    console.error('Timestamp:', new Date().toISOString());
    if (error.stack) {
        console.error('Stack Trace:', error.stack);
    }
    console.error('----------------------------------------');
    return NextResponse.json({ error: error.message || 'Internal server error during profile creation.' }, { status: 500 });
  }
} 