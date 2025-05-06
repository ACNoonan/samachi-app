import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import nacl from 'tweetnacl';
import { PublicKey } from '@solana/web3.js';
import { Buffer } from 'buffer';

// Define the structure of the request body
interface LinkWalletRequest {
  signedMessage: string; // Assuming base58 encoded signature
  originalMessage: string; // The original message that was signed
  walletAddress: string;   // Public key of the wallet, base58 encoded
}

const CHALLENGE_MESSAGE_PREFIX = "Sign this message to link your wallet to your Samachi account: ";

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized. User not authenticated.' }, { status: 401 });
  }

  let reqBody: LinkWalletRequest;
  try {
    reqBody = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body. Expected JSON.' }, { status: 400 });
  }

  const { signedMessage, originalMessage, walletAddress } = reqBody;

  if (!signedMessage || !originalMessage || !walletAddress) {
    return NextResponse.json({ error: 'Missing required fields: signedMessage, originalMessage, walletAddress.' }, { status: 400 });
  }

  // 1. Verify the original message is the expected challenge
  // This typically includes a nonce or unique identifier fetched by client first, 
  // but for simplicity, we'll use a static prefix + user ID for now.
  // A more robust solution would involve generating and storing a nonce.
  const expectedMessage = `${CHALLENGE_MESSAGE_PREFIX}${user.id}`;
  if (originalMessage !== expectedMessage) {
    console.warn('Original message mismatch', { originalMessage, expectedMessage });
    return NextResponse.json({ error: 'Invalid original message. Possible replay attack attempt.' }, { status: 400 });
  }

  // 2. Verify the signature
  try {
    const messageBytes = new TextEncoder().encode(originalMessage);
    const publicKeyBytes = new PublicKey(walletAddress).toBytes();
    const signatureBytes = Buffer.from(signedMessage, 'base64'); // Wallet adapter often returns base64
    // If wallet returns hex or other, adjust Buffer.from accordingly.
    // For Phantom, signMessage typically returns Uint8Array, which client might base64 encode.

    const isVerified = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);

    if (!isVerified) {
      return NextResponse.json({ error: 'Signature verification failed.' }, { status: 403 });
    }
  } catch (error) {
    console.error('Error during signature verification:', error);
    return NextResponse.json({ error: 'Invalid signature or public key format.' }, { status: 400 });
  }

  // 3. Check if the wallet address is already linked to another profile
  const { data: existingProfile, error: fetchError } = await supabase
    .from('profiles')
    .select('id, wallet_address')
    .eq('wallet_address', walletAddress)
    .neq('id', user.id) // Exclude the current user's profile
    .maybeSingle();

  if (fetchError) {
    console.error('Error checking for existing wallet link:', fetchError);
    return NextResponse.json({ error: 'Database error while verifying wallet address.' }, { status: 500 });
  }

  if (existingProfile) {
    return NextResponse.json({ error: 'This wallet address is already linked to another account.' }, { status: 409 }); // 409 Conflict
  }

  // 4. Update the current user's profile with the wallet_address
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ wallet_address: walletAddress })
    .eq('id', user.id);

  if (updateError) {
    console.error('Error updating profile with wallet_address:', updateError);
    return NextResponse.json({ error: 'Failed to link wallet to profile.' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Wallet linked successfully.' }, { status: 200 });
} 