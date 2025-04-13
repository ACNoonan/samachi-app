import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAdminKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Admin Key

if (!supabaseUrl || !supabaseAdminKey) {
  console.error('Missing Supabase URL or Admin Key environment variables.');
}

const supabaseAdmin = createClient(supabaseUrl!, supabaseAdminKey!);
const SALT_ROUNDS = 10; // Standard for bcrypt

export async function POST(request: Request) {
  try {
    const {
      username,
      password,
      twitterHandle,
      telegramHandle,
      walletAddress,
      cardId
    } = await request.json();

    // 1. Validate Input
    if (!username || !password || !cardId) {
      return NextResponse.json({ error: 'Missing required fields: username, password, cardId' }, { status: 400 });
    }
    if (password.length < 6) { // Basic password length check
        return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    // 2. Check if username or wallet address already exists
    const { data: existingUser, error: findUserError } = await supabaseAdmin
        .from('profiles')
        .select('id, username, wallet_address')
        .or(`username.eq.${username},wallet_address.eq.${walletAddress ? walletAddress : 'null'}`) // Check both username and wallet if provided
        .maybeSingle(); // Use maybeSingle as walletAddress might be null

    if (findUserError) {
        console.error('Error checking for existing profile:', findUserError);
        throw new Error('Database error checking profile existence.');
    }

    if (existingUser) {
        if (existingUser.username === username) {
            return NextResponse.json({ error: 'Username already taken.' }, { status: 409 });
        }
        if (walletAddress && existingUser.wallet_address === walletAddress) {
            return NextResponse.json({ error: 'Wallet address already linked to another profile.' }, { status: 409 });
        }
        // If walletAddress was null and we found a match, it must be by username
        if (!walletAddress && existingUser.username === username) {
             return NextResponse.json({ error: 'Username already taken.' }, { status: 409 });
        }
    }


    // 3. Find the Membership Card and check its status
    const { data: cardData, error: cardError } = await supabaseAdmin
      .from('membership_cards')
      .select('id, user_id, status')
      .eq('card_identifier', cardId)
      .single(); // Expect exactly one card

    if (cardError || !cardData) {
        console.error('Error fetching card or card not found:', cardId, cardError);
        return NextResponse.json({ error: `Membership card with ID ${cardId} not found.` }, { status: 404 });
    }

    if (cardData.user_id) {
        console.warn(`Card ${cardId} already claimed by user ${cardData.user_id}`);
        return NextResponse.json({ error: 'This membership card has already been claimed.' }, { status: 409 }); // 409 Conflict
    }

    // 4. Hash Password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // 5. Create Profile
    const { data: newProfile, error: profileCreateError } = await supabaseAdmin
      .from('profiles')
      .insert({
        username: username,
        password_hash: passwordHash,
        twitter_handle: twitterHandle,
        telegram_handle: telegramHandle,
        wallet_address: walletAddress,
      })
      .select('id') // Select the ID of the newly created profile
      .single();

    if (profileCreateError || !newProfile) {
      console.error('Error creating profile:', profileCreateError);
      // Log sensitive info only server-side
      console.error('Failed profile data:', { username, twitterHandle, telegramHandle, walletAddress });
      throw new Error('Database error creating profile.');
    }
    const profileId = newProfile.id;
    console.log(`Profile created successfully: ${profileId} for username ${username}`);


    // 6. Link Card to Profile
    const { data: updateData, error: updateError } = await supabaseAdmin
      .from('membership_cards')
      .update({ user_id: profileId, status: 'registered' }) // Link to the new profile's ID
      .eq('card_identifier', cardId)
      .is('user_id', null) // Safety check: only update if user_id is still null
      .select('id')
      .single();

    if (updateError || !updateData) {
      console.error('Error updating membership card:', cardId, profileId, updateError);
      // CRITICAL: If card linking fails after profile creation, we have an orphaned profile.
      // Ideally, wrap profile creation and card update in a transaction (requires Supabase function).
      // For MVP, we log the error. Consider manual cleanup or a retry mechanism.
      // Attempting to delete the profile we just created might be complex if other operations depend on it.
      throw new Error('Database error linking card to profile. Profile was created but card linking failed.');
    }

    console.log(`Card ${cardId} successfully linked to profile ${profileId}`);

    // 7. Return Success (do not return profile data or password hash)
    return NextResponse.json({ message: 'Profile created and card claimed successfully!' });

  } catch (error: any) {
    // --- Enhanced Error Logging --- 
    console.error('-----------------------------------------');
    console.error('CREATE PROFILE API ROUTE CRITICAL ERROR:');
    console.error('Timestamp:', new Date().toISOString());
    // Log the specific error object
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    // Log incoming data (excluding password)
    try {
      const body = await request.clone().json().catch(() => ({}));
      delete body.password; // Remove password before logging
      console.error('Request Body (Filtered):', body);
    } catch (logError) {
        console.error('Error logging request body:', logError);
    }
    console.error('-----------------------------------------');

    // Avoid sending detailed internal errors to the client
    const message = error.message.includes('Database error') || error.message.includes('already taken') || error.message.includes('already linked')
        ? error.message
        : 'An internal server error occurred during profile creation.';
    // Determine status code based on common errors
    const status = error.message.includes('already taken') || error.message.includes('already linked') ? 409 
                 : error.message.includes('not found') ? 404 
                 : 500;
    return NextResponse.json({ error: message }, { status: status });
  }
} 