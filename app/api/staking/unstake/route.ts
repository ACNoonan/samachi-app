import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/lib/database.types';
import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import bs58 from 'bs58';

// TODO: Add necessary imports for balance calculation and error handling

export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.delete({ name, ...options })
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let requestedAmountStandard: number; // Use standard units for request validation
  try {
    const { amount } = await request.json();
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount specified.' }, { status: 400 });
    }
    // Amount from request is already standard units (e.g., 10.5)
    requestedAmountStandard = amount;

  } catch (error) {
    console.error('Error parsing request body:', error);
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  try {
    // 1. Get User Profile (including wallet address)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, wallet_address')
      .eq('id', user.id) // Use Supabase auth user ID
      .single();

    if (profileError || !profile || !profile.wallet_address) {
      console.error('Error fetching profile or missing wallet address:', profileError);
      return NextResponse.json({ error: 'User profile or wallet address not found.' }, { status: 404 });
    }
    const userWalletAddress = new PublicKey(profile.wallet_address);
    const userProfileId = profile.id;

    // 2. Calculate Current Available Balance (Using standard units from DB)
    // NOTE: Assumes 'amount_staked' and 'amount_withdrawn' are stored as standard decimal numbers (e.g., 10.5)
    const {
      data: stakeData,
      error: stakeError,
    } = await supabase
      .from('custodial_stakes')
      .select('amount_staked')
      .eq('user_profile_id', userProfileId);

    const {
        data: withdrawalData,
        error: withdrawalError,
    } = await supabase
      .from('custodial_withdrawals')
      .select('amount_withdrawn')
      .eq('user_profile_id', userProfileId);

    if (stakeError || withdrawalError) {
        console.error('Error fetching stake/withdrawal data:', stakeError, withdrawalError);
        return NextResponse.json({ error: 'Failed to calculate balance.' }, { status: 500 });
    }

    const totalStakedStandard = stakeData?.reduce((sum, stake) => sum + (stake.amount_staked ?? 0), 0) ?? 0;
    const totalWithdrawnStandard = withdrawalData?.reduce((sum, withdrawal) => sum + (withdrawal.amount_withdrawn ?? 0), 0) ?? 0;

    const availableBalanceStandard = totalStakedStandard - totalWithdrawnStandard;

    // --- BEGIN DEBUG LOGGING ---
    console.log(`[Unstake Balance Check] User: ${userProfileId}`);
    console.log(`  Total Staked (DB): ${totalStakedStandard}`);
    console.log(`  Total Withdrawn (DB): ${totalWithdrawnStandard}`);
    console.log(`  Calculated Available: ${availableBalanceStandard}`);
    console.log(`  Requested Amount: ${requestedAmountStandard}`);
    // --- END DEBUG LOGGING ---

    // 3. Check if sufficient balance (Compare standard units)
    if (requestedAmountStandard > availableBalanceStandard) {
        const decimals = 6; // For formatting error message
        return NextResponse.json({
            error: `Insufficient staked balance. Requested: ${requestedAmountStandard.toFixed(decimals)} USDC, Available: ${availableBalanceStandard.toFixed(decimals)} USDC`
        }, { status: 400 });
    }

    // 4. Get Treasury Wallet and Connection Details from Env Vars
    const treasurySecretKeyString = process.env.TREASURY_WALLET_SECRET_KEY;
    const usdcMintAddressString = process.env.NEXT_PUBLIC_USDC_MINT_ADDRESS;
    const solanaRpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL; // Ensure this env var exists

    if (!treasurySecretKeyString || !usdcMintAddressString || !solanaRpcUrl) {
      console.error('Missing required environment variables for unstaking.');
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    const connection = new Connection(solanaRpcUrl, 'confirmed');
    const usdcMintPublicKey = new PublicKey(usdcMintAddressString);

    // Parse the secret key string (assuming it's a JSON array string like '[1,2,3,...]')
    let treasurySecretKeyBytes: Uint8Array;
    try {
      treasurySecretKeyBytes = Uint8Array.from(JSON.parse(treasurySecretKeyString));
    } catch (e) {
      console.error('Failed to parse TREASURY_WALLET_SECRET_KEY:', e);
      return NextResponse.json({ error: 'Server configuration error (invalid secret key format).' }, { status: 500 });
    }
    const treasuryWallet = Keypair.fromSecretKey(treasurySecretKeyBytes);

    // 5. Prepare SPL Token Transfer Transaction
    const treasuryTokenAccount = await getAssociatedTokenAddress(usdcMintPublicKey, treasuryWallet.publicKey);
    const userTokenAccount = await getAssociatedTokenAddress(usdcMintPublicKey, userWalletAddress);

    // Convert requested standard amount to raw units *only* for the transaction
    const decimals = 6; // TODO: Get decimals dynamically or use env var consistently
    const requestedAmountUnits = Math.round(requestedAmountStandard * (10 ** decimals));

    const transaction = new Transaction().add(
      createTransferInstruction(
        treasuryTokenAccount, // Source
        userTokenAccount,      // Destination
        treasuryWallet.publicKey, // Source owner (treasury)
        requestedAmountUnits,     // << Use raw units for the on-chain transfer
        [],                    // Multi-signers
        TOKEN_PROGRAM_ID       // SPL Token Program ID
      )
    );

    // 6. Send and Confirm Transaction
    const signature = await connection.sendTransaction(transaction, [treasuryWallet]); // Sign with treasury key
    await connection.confirmTransaction(signature, 'confirmed');
    console.log(`Unstake successful. Transaction signature: ${signature}`);

    // 7. Record Withdrawal in Database
    const { error: insertError } = await supabase
      .from('custodial_withdrawals')
      .insert({
        user_profile_id: userProfileId,
        amount_withdrawn: requestedAmountStandard, // << Record standard units in DB
        withdrawal_transaction_signature: signature,
        token_mint_address: usdcMintAddressString,
        // withdrawal_timestamp is now handled by default value in DB
      });

    if (insertError) {
      console.error('Error inserting withdrawal record:', insertError);
      // Note: Transaction succeeded, but DB insert failed. Manual reconciliation might be needed.
      return NextResponse.json({ warning: 'Withdrawal sent but failed to record. Please contact support.', signature }, { status: 500 });
    }

    return NextResponse.json({ message: 'Unstake successful', signature }, { status: 200 });

  } catch (error) {
    console.error('Unstake process error:', error);
    // TODO: More specific error handling (e.g., insufficient SOL in treasury for fees)
    return NextResponse.json({ error: 'Failed to process unstake request.' }, { status: 500 });
  }
} 