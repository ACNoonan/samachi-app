import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Import your initialized client

// Opt out of caching and force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cardIdentifier = searchParams.get('card_id'); // Get the readable ID

  if (!cardIdentifier) {
    return NextResponse.json({ error: 'Card ID is required' }, { status: 400 });
  }

  console.log(`API: Checking status for card identifier: ${cardIdentifier}`);

  try {
    // Query the membership_cards table
    const { data, error } = await supabase
      .from('membership_cards')
      .select('status, user_id') // Select the status and if a user is linked
      .eq('card_identifier', cardIdentifier) // Match the readable identifier
      .single(); // Expect only one card with this identifier

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is okay
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: 'Error checking card status', details: error.message }, { status: 500 });
    }

    if (!data) {
      // Card identifier doesn't exist in the table
      console.log(`Card identifier ${cardIdentifier} not found.`);
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // Determine registration status based on whether user_id is set
    const isRegistered = !!data.user_id; // True if user_id is not null
    const status = isRegistered ? 'registered' : 'unregistered';

    console.log(`Card ${cardIdentifier} status: ${status} (User ID: ${data.user_id})`);

    return NextResponse.json({ 
      cardId: cardIdentifier, // Return the identifier that was checked
      status: status, 
      isRegistered: isRegistered // Explicit boolean might be useful on client
    });

  } catch (err) {
    console.error('API route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 