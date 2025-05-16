import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { getGlownetEventDetailsByGtagUid } from '@/lib/glownet';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  try {
    // 1. Get the list of card identifiers to sync
    const { cardIds } = await request.json();

    if (!Array.isArray(cardIds)) {
      return NextResponse.json({ error: 'cardIds must be an array' }, { status: 400 });
    }

    console.log(`Syncing ${cardIds.length} cards with Glownet...`);

    const results = {
      total: cardIds.length,
      synced: 0,
      failed: 0,
      skipped: 0,
      details: [] as Array<{
        cardId: string;
        status: 'synced' | 'failed' | 'skipped';
        error?: string;
        glownetEventId?: number;
      }>
    };

    // 2. Process each card
    for (const cardId of cardIds) {
      console.log(`Processing card: ${cardId}`);
      try {
        // 2.1 Check if card exists in our system
        const { data: existingCard, error: cardError } = await supabase
          .from('membership_cards')
          .select('id, card_identifier, status')
          .eq('card_identifier', cardId)
          .single();

        if (cardError) {
          console.error(`Error checking card ${cardId}:`, cardError);
          results.failed++;
          results.details.push({
            cardId,
            status: 'failed',
            error: 'Database error checking card existence'
          });
          continue;
        }

        // 2.2 If card doesn't exist, verify with Glownet first
        if (!existingCard) {
          try {
            // Verify card exists in Glownet
            const glownetDetails = await getGlownetEventDetailsByGtagUid(cardId);
            
            // Create card record in our system
            const { data: newCard, error: createError } = await supabase
              .from('membership_cards')
              .insert({
                card_identifier: cardId,
                status: 'unregistered'
              })
              .select()
              .single();

            if (createError) {
              throw new Error(`Failed to create card record: ${createError.message}`);
            }

            results.synced++;
            results.details.push({
              cardId,
              status: 'synced',
              glownetEventId: glownetDetails.event_id
            });

          } catch (glownetError: any) {
            console.error(`Glownet verification failed for card ${cardId}:`, glownetError);
            results.failed++;
            results.details.push({
              cardId,
              status: 'failed',
              error: glownetError.message || 'Failed to verify card with Glownet'
            });
          }
        } else {
          // Card already exists in our system
          results.skipped++;
          results.details.push({
            cardId,
            status: 'skipped'
          });
        }

      } catch (cardProcessError: any) {
        console.error(`Error processing card ${cardId}:`, cardProcessError);
        results.failed++;
        results.details.push({
          cardId,
          status: 'failed',
          error: cardProcessError.message || 'Unknown error during processing'
        });
      }
    }

    // 3. Return summary
    return NextResponse.json({
      message: 'Card sync completed',
      results
    });

  } catch (error: any) {
    console.error('Card sync error:', error);
    return NextResponse.json({
      error: error.message || 'Internal server error during card sync'
    }, { status: 500 });
  }
} 