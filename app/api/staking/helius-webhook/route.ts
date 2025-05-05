import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // Import cookies
import { createClient } from '@/lib/supabase/server'; // Adjust path as needed
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
// import { Helius } from 'helius-sdk'; // We might not need the SDK if just verifying header
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Database } from '@/lib/database.types'; // Ensure this path is correct
import { Buffer } from 'buffer'; // Import Buffer
// We don't need crypto for direct header comparison
import crypto from 'crypto'; // Keep crypto import for now, might be needed elsewhere indirectly

// Environment Variables
const HELIUS_API_KEY = process.env.HELIUS_API_KEY; // Keep for now, might be used elsewhere
const HELIUS_WEBHOOK_SECRET = process.env.HELIUS_WEBHOOK_SECRET; // Now used for verification
const SOLANA_RPC_ENDPOINT = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST || 'https://api.mainnet-beta.solana.com'; // Or your preferred RPC
const TREASURY_WALLET_ADDRESS = process.env.NEXT_PUBLIC_TREASURY_WALLET_ADDRESS; // Use NEXT_PUBLIC_ consistently
const USDC_MINT_ADDRESS = process.env.NEXT_PUBLIC_USDC_MINT_ADDRESS || 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // Mainnet USDC

// Helper function to verify Helius signature MANUALLY - COMMENTED OUT
/*
async function verifyHeliusSignature(req: NextRequest, webhookSecret: string): Promise<boolean> {
  const receivedSignature = req.headers.get('helius-signature');
  if (!receivedSignature) {
    console.error('Helius signature missing from request header');
    return false;
  }

  try {
    const rawBody = await req.clone().text(); // Get raw body
    const bodyBuffer = Buffer.from(rawBody);

    // Calculate expected signature
    const hmac = crypto.createHmac('sha256', webhookSecret);
    const digest = Buffer.from(hmac.update(bodyBuffer).digest('hex'), 'utf8');
    const calculatedSignature = digest.toString();

    // Compare signatures using timingSafeEqual to prevent timing attacks
    // Ensure both buffers have the same length before comparing
    const receivedSignatureBuffer = Buffer.from(receivedSignature, 'utf8');
    if (receivedSignatureBuffer.length !== digest.length) {
        console.warn('Signature length mismatch.');
        return false;
    }

    const signaturesMatch = crypto.timingSafeEqual(digest, receivedSignatureBuffer);

    if (!signaturesMatch) {
        console.warn('Calculated signature does not match received signature.');
        console.log('Received:', receivedSignature);
        console.log('Calculated:', calculatedSignature);
    }

    return signaturesMatch;

  } catch (error) {
    console.error('Error verifying Helius signature manually:', error);
    return false;
  }
}
*/

type HeliusTransfer = {
    accountData: {
        account: string; // Recipient (Treasury Wallet)
        nativeBalanceChange: number;
        tokenBalanceChanges: {
            mint: string;
            rawTokenAmount: {
                decimals: number;
                tokenAmount: string; // Amount as string
            };
            userAccount: string; // Recipient's Token Account
        }[];
    }[];
    signature: string; // Transaction signature
    source: string; // Transaction source (e.g., TRANSFER)
    timestamp: number;
    type: string; // Transaction type (e.g., TRANSFER)
    tokenTransfers: {
        fromUserAccount: string | null; // Sender's Token Account (can be null for mints/burns)
        toUserAccount: string; // Recipient's Token Account
        fromWallet: string | null; // Sender's Wallet Address (IMPORTANT!)
        toWallet: string; // Recipient's Wallet Address (Treasury)
        mint: string; // Token Mint Address (USDC)
        tokenAmount: number; // Amount (already adjusted for decimals)
        tokenStandard: string;
    }[];
    // ... other fields might be present
};

export async function POST(request: NextRequest) {
  // Add a unique, timestamped log message right at the start
  console.log(`>>> EXECUTING LATEST WEBHOOK HANDLER v${Date.now()} <<<`);
  console.log('Received POST request on /api/staking/helius-webhook (Full Handler)');

  // REMOVED HELIUS_API_KEY Check - Secret is checked below
  // const heliusApiKey = process.env.HELIUS_API_KEY;
  // if (!heliusApiKey) {
  //   console.error("HELIUS_API_KEY environment variable not set.");
  //   return NextResponse.json({ error: 'Internal server configuration error' }, { status: 500 });
  // }

  // 1. Verify Helius Signature (Using manual verification) - COMMENTED OUT
  /*
  const isValidSignature = await verifyHeliusSignature(request, heliusApiKey);
  if (!isValidSignature) {
    console.warn('Invalid Helius signature received.');
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
  }
  console.log('Helius signature verified successfully.');
  */

  // NEW: Verify Authorization Header using HELIUS_WEBHOOK_SECRET
  const receivedAuthHeader = request.headers.get('Authorization');
  const expectedAuthSecret = process.env.HELIUS_WEBHOOK_SECRET;

  if (!expectedAuthSecret) {
      console.error("HELIUS_WEBHOOK_SECRET environment variable not set.");
      // Don't reveal internal config details in the error response
      return NextResponse.json({ error: 'Webhook configuration error' }, { status: 500 });
  }

  if (!receivedAuthHeader) {
      console.warn('Authorization header missing from Helius webhook request.');
      return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 });
  }

  // Direct comparison of the received header value and the expected secret
  if (receivedAuthHeader !== expectedAuthSecret) {
      console.warn('Invalid Authorization header received.');
      // Optional: Log the received header for debugging, but be careful with secrets
      // console.log('Received Auth:', receivedAuthHeader);
      return NextResponse.json({ error: 'Invalid authorization header' }, { status: 401 });
  }

  console.log('Helius webhook Authorization header verified successfully.');


  // 2. Parse the Webhook Payload
  let enhancedTransactions: HeliusTransfer[];
  try {
    // Can now safely parse the original request as verification didn't consume it
    enhancedTransactions = await request.json(); 
    if (!Array.isArray(enhancedTransactions) || enhancedTransactions.length === 0) {
      console.warn('Received empty or invalid payload from Helius.');
      return NextResponse.json({ message: 'Empty payload received' }, { status: 200 }); // Acknowledge Helius
    }
  } catch (error) {
    console.error('Error parsing Helius webhook payload:', error);
    return NextResponse.json({ error: 'Failed to parse webhook payload' }, { status: 400 });
  }

  // Get cookie store
  const cookieStore = cookies();
  // Pass cookie store to client
  const supabase = createClient(cookieStore);
  // Use non-prefixed env vars for server-side code
  const usdcMintAddress = process.env.USDC_MINT_ADDRESS;
  const treasuryAddress = process.env.TREASURY_WALLET_ADDRESS;

  if (!usdcMintAddress || !treasuryAddress) {
      console.error("Missing USDC_MINT_ADDRESS or TREASURY_WALLET_ADDRESS env vars.");
      return NextResponse.json({ error: 'Internal server configuration error' }, { status: 500 });
  }

  // Process the first transaction in the batch (Helius webhooks send arrays)
  // You might need more sophisticated logic if batching is common/expected
  const transaction = enhancedTransactions[0];

  // 3. Extract Relevant Transfer Information
  // Find the specific USDC transfer *to* the treasury wallet using correct Helius fields
  const usdcTransfer = transaction.tokenTransfers?.find(
      (t) =>
          t.mint === usdcMintAddress &&
          t.toUserAccount === treasuryAddress && // Use toUserAccount
          t.fromUserAccount // Use fromUserAccount to check sender exists
  );

  if (!usdcTransfer) {
    console.log(`No relevant USDC transfer to treasury (${treasuryAddress}) found in transaction ${transaction.signature}. Skipping.`);
    return NextResponse.json({ message: 'No relevant transfer found' }, { status: 200 });
  }

  // Use the correct field for the sender address
  const senderWalletAddress = usdcTransfer.fromUserAccount;
  const amountTransferred = usdcTransfer.tokenAmount; // Helius enhanced already adjusts decimals
  const transactionSignature = transaction.signature;

  if (!senderWalletAddress) {
      // This check might be redundant now if find condition ensures fromUserAccount exists
      console.log(`Sender wallet address missing in USDC transfer for tx ${transaction.signature}. Skipping.`);
      return NextResponse.json({ message: 'Sender address missing' }, { status: 200 });
  }

  console.log(`Processing deposit:
    Sender: ${senderWalletAddress}
    Amount: ${amountTransferred} USDC
    Tx Sig: ${transactionSignature}`);


  // 4. Find User Profile by Sender Wallet Address
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('wallet_address', senderWalletAddress)
    .single();

  if (profileError || !profile) {
    console.warn(`Profile not found for sender wallet address ${senderWalletAddress} in transaction ${transactionSignature}. Error: ${profileError?.message}`);
    // Still return 200 to Helius to prevent retries for unknown senders
    return NextResponse.json({ message: 'Sender profile not found' }, { status: 200 });
  }

  const userProfileId = profile.id;

  // 5. Check for Idempotency (Optional but Recommended)
  const { data: existingStake, error: existingStakeError } = await supabase
      .from('custodial_stakes')
      .select('id')
      .eq('deposit_transaction_signature', transactionSignature)
      .maybeSingle(); // Use maybeSingle as it's okay if it doesn't exist

  if (existingStakeError) {
      console.error(`Error checking for existing stake with sig ${transactionSignature}:`, existingStakeError);
      // Decide if you want to retry or just fail here. Returning 500 might cause Helius retries.
      return NextResponse.json({ error: 'Database error checking existing stake' }, { status: 500 });
  }

  if (existingStake) {
      console.log(`Stake with signature ${transactionSignature} already processed. Skipping duplicate.`);
      return NextResponse.json({ message: 'Duplicate transaction signature' }, { status: 200 });
  }


  // 6. Insert Stake Record into Database
  // Determine decimals from payload if possible, otherwise assume 6 for USDC
  const tokenBalanceChange = transaction.accountData
      ?.flatMap(ad => ad.tokenBalanceChanges)
      .find(tc => tc.mint === usdcMintAddress);

  const usdcDecimals = tokenBalanceChange?.rawTokenAmount.decimals ?? 6; // Default to 6 if not found

  // Store the raw amount (integer)
  // Use BigInt for safe handling of large integer values for token amounts
  const amountRaw = BigInt(Math.round(amountTransferred * (10 ** usdcDecimals)));


  type NewStake = Database['public']['Tables']['custodial_stakes']['Insert'];
  const newStakeData: NewStake = {
      user_profile_id: userProfileId,
      amount_staked: amountTransferred,
      deposit_transaction_signature: transactionSignature,
      status: 'staked',
      deposit_timestamp: new Date(transaction.timestamp * 1000).toISOString(), // Helius timestamp is in seconds
  };

  const { error: insertError } = await supabase
    .from('custodial_stakes')
    .insert(newStakeData);

  if (insertError) {
    console.error(`Failed to insert stake record for tx ${transactionSignature}:`, insertError);
    // Consider returning 500 to potentially trigger Helius retry if insertion fails
    return NextResponse.json({ error: 'Failed to record stake in database' }, { status: 500 });
  }

  console.log(`Successfully recorded stake for user ${userProfileId}, tx ${transactionSignature}`);

  // 7. Return Success Response to Helius
  return NextResponse.json({ message: 'Webhook processed successfully' }, { status: 200 });
}

// Optional: Add GET handler for simple verification or health check if needed
export async function GET() {
    return NextResponse.json({ message: 'Helius webhook endpoint is active.' });
} 