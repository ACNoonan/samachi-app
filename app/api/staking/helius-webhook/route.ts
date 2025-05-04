import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers'; // Import cookies
import { createClient } from '@/lib/supabase/server'; // Adjust path as needed
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { Helius } from 'helius-sdk'; // We'll need to install this: pnpm add helius-sdk

// TODO: Add environment variables for these
const HELIUS_API_KEY = process.env.HELIUS_API_KEY;
const HELIUS_WEBHOOK_SECRET = process.env.HELIUS_WEBHOOK_SECRET;
const SOLANA_RPC_ENDPOINT = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST || 'https://api.mainnet-beta.solana.com'; // Or your preferred RPC
const TREASURY_WALLET_ADDRESS = process.env.TREASURY_WALLET_ADDRESS;
const USDC_MINT_ADDRESS = process.env.USDC_MINT_ADDRESS || 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // Mainnet USDC

// Type definition for the expected Helius webhook payload (simplified)
// Refer to Helius docs for the full structure: https://docs.helius.xyz/webhooks/webhook-types/enhanced-transaction-webhook
interface HeliusTransferPayload {
    signature: string;
    timestamp: number;
    transaction: {
      message: {
        accountKeys: { pubkey: string; signer: boolean; writer: boolean }[];
      };
      meta: {
        err: any; // null if successful
        logMessages: string[]; // Useful for debugging SPL transfers
      };
    };
    events: {
      transfer?: { // Check if transfer event exists
        source: string;
        destination: string;
        amount: number; // This amount is in the smallest unit (e.g., 1,000,000 for 1 USDC if decimals=6)
        tokenMint: string;
      };
    };
    type: string; // Should be TRANSFER
    source: string; // e.g., "SYSTEM_PROGRAM" or "TOKEN_PROGRAM" depending on transfer type
}

export async function POST(req: NextRequest) {
    console.log('Received POST request on /api/staking/helius-webhook (Simplified Handler)');

    // --- TEMPORARILY COMMENTED OUT FOR TIMEOUT TESTING --- 
/*
    // 1. Verify Helius Signature/Secret
    // Helius includes a signature in the `Authorization` header: "Signature <signature>"
    // You need to verify this signature against the payload and your HELIUS_WEBHOOK_SECRET
    // See Helius docs: https://docs.helius.xyz/webhooks/verify-webhook-signatures
    const authorization = req.headers.get('Authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
        console.error('Missing or invalid Authorization header');
        return NextResponse.json({ error: 'Unauthorized: Missing header' }, { status: 401 });
    }
    const receivedSecret = authorization.split(' ')[1];
    if (receivedSecret !== HELIUS_WEBHOOK_SECRET) {
        console.error('Invalid webhook secret');
        return NextResponse.json({ error: 'Unauthorized: Invalid secret' }, { status: 401 });
    }
    // Note: A more robust verification would involve checking a signature hash,
    // but Helius' basic auth header approach relies on comparing secrets directly.
    // Ensure your webhook URL is HTTPS and the secret is strong.

    let payloads: HeliusTransferPayload[];
    try {
        payloads = await req.json();
        if (!Array.isArray(payloads) || payloads.length === 0) {
            console.warn('Received empty or non-array payload');
            return NextResponse.json({ message: 'Empty payload received' }, { status: 200 });
        }
        console.log(`Received ${payloads.length} webhook events.`);
    } catch (error) {
        console.error('Failed to parse webhook payload:', error);
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const cookieStore = cookies(); // Get cookie store
    const supabase = createClient(cookieStore); // Pass cookie store to client
    const connection = new Connection(SOLANA_RPC_ENDPOINT, 'confirmed');
    const processedSignatures: string[] = [];
    const errors: string[] = [];

    for (const payload of payloads) {
        try {
            console.log(`Processing transaction signature: ${payload.signature}`);

            // 2. Basic Payload Validation
            if (payload.transaction.meta.err) {
                console.log(`Skipping failed transaction: ${payload.signature}`);
                continue; // Skip failed transactions
            }

            if (payload.type !== 'TRANSFER' || !payload.events.transfer) {
                 console.log(`Skipping non-transfer or missing event data: ${payload.signature}`);
                continue; // Ensure it's a transfer we care about
            }

            const transferEvent = payload.events.transfer;

            // 3. Verify it's a USDC transfer *to* our treasury wallet
            if (transferEvent.destination !== TREASURY_WALLET_ADDRESS) {
                console.log(`Skipping transfer not to treasury: ${payload.signature} (Destination: ${transferEvent.destination})`);
                continue;
            }
            if (transferEvent.tokenMint !== USDC_MINT_ADDRESS) {
                console.log(`Skipping non-USDC transfer: ${payload.signature} (Mint: ${transferEvent.tokenMint})`);
                continue;
            }

            const depositAmountRaw = transferEvent.amount; // Amount in smallest units
            const senderAddress = transferEvent.source;
            const transactionSignature = payload.signature;

            // TODO: Get USDC decimals dynamically if needed, assume 6 for standard USDC
            const usdcDecimals = 6;
            const depositAmountDecimal = depositAmountRaw / Math.pow(10, usdcDecimals);

            console.log(`Potential USDC deposit detected:
                Signature: ${transactionSignature}
                Sender: ${senderAddress}
                Amount (raw): ${depositAmountRaw}
                Amount (decimal): ${depositAmountDecimal}
                Destination: ${transferEvent.destination}`);

            // 4. Idempotency Check: Ensure we haven't processed this deposit before
            const { data: existingStake, error: checkError } = await supabase
                .from('custodial_stakes')
                .select('id')
                .eq('deposit_transaction_signature', transactionSignature)
                .maybeSingle();

            if (checkError) {
                throw new Error(`Supabase check error: ${checkError.message}`);
            }
            if (existingStake) {
                console.log(`Deposit already processed: ${transactionSignature}`);
                continue; // Skip already processed transaction
            }

            // 5. Find User Profile by Sender Wallet Address
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('id')
                .eq('wallet_address', senderAddress)
                .single(); // Expect only one profile per wallet address

            if (profileError || !profile) {
                 console.warn(`No profile found for sender wallet ${senderAddress} in transaction ${transactionSignature}. Skipping.`);
                 // Optional: Store these in a separate table for manual review/association?
                 continue;
            }

            const userProfileId = profile.id;

            // 6. Insert into custodial_stakes table
            const { error: insertError } = await supabase
                .from('custodial_stakes')
                .insert({
                    user_profile_id: userProfileId,
                    amount_staked: depositAmountDecimal,
                    deposit_transaction_signature: transactionSignature,
                    usdc_mint_address: USDC_MINT_ADDRESS,
                    status: 'staked',
                    deposit_timestamp: new Date(payload.timestamp * 1000).toISOString(), // Helius timestamp is in seconds
                });

            if (insertError) {
                throw new Error(`Failed to insert stake into DB: ${insertError.message}`);
            }

            console.log(`Successfully recorded stake for user ${userProfileId} from tx ${transactionSignature}`);
            processedSignatures.push(transactionSignature);

        } catch (error: any) {
            console.error(`Error processing webhook payload for signature ${payload.signature}:`, error);
            errors.push(`Sig ${payload.signature}: ${error.message || error}`);
        }
    }

    if (errors.length > 0) {
        // Decide if partial success warrants a 2xx or if any error means 500
        console.error("Errors occurred during webhook processing:", errors);
        // Returning 200 anyway so Helius doesn't retry potentially problematic ones,
        // but log indicates issues. Consider alerting here.
        return NextResponse.json({
            message: 'Webhook processed with errors',
            processed: processedSignatures,
            errors: errors
        }, { status: 200 });
    }

    console.log('Webhook processed successfully.');
    return NextResponse.json({ message: 'Webhook processed successfully', processed: processedSignatures }, { status: 200 });
*/
    // --- END OF TEMPORARILY COMMENTED OUT SECTION ---

    // Immediately return success to prevent timeout
    console.log('Simplified handler returning 200 OK immediately.');
    return NextResponse.json({ message: 'Webhook received by simplified handler' }, { status: 200 });
}

// Optional: Add GET handler for simple verification or health check if needed
export async function GET() {
    return NextResponse.json({ message: 'Helius webhook endpoint is active.' });
} 