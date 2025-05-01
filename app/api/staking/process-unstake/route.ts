import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { 
    Connection, 
    Keypair, 
    PublicKey, 
    Transaction, 
    sendAndConfirmTransaction,
    SystemProgram, // Although not directly used for transfer, good practice to import if needed elsewhere
} from '@solana/web3.js';
import { 
    getAssociatedTokenAddressSync, 
    createTransferCheckedInstruction, 
    TOKEN_PROGRAM_ID, 
} from '@solana/spl-token';
import bs58 from 'bs58';
import type { Database } from '@/lib/database.types';

// Ensure environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const processUnstakeSecret = process.env.PROCESS_UNSTAKE_SECRET;
const treasurySecretKeyStr = process.env.TREASURY_WALLET_SECRET_KEY;
const rpcEndpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT;
const usdcMintAddressStr = process.env.NEXT_PUBLIC_USDC_MINT_ADDRESS;

const USDC_DECIMALS = 6; // Standard for USDC

export async function POST(request: NextRequest) {
    console.log('Process Unstake endpoint hit');

    // 1. Authentication
    const authHeader = request.headers.get('Authorization');
    if (!processUnstakeSecret) {
        console.error('PROCESS_UNSTAKE_SECRET environment variable not set.');
        return NextResponse.json({ error: 'Internal Server Configuration Error' }, { status: 500 });
    }
    if (authHeader !== `Bearer ${processUnstakeSecret}`) {
        console.warn('Unauthorized attempt to process unstakes.');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Check necessary environment variables
    if (!supabaseUrl || !supabaseServiceRoleKey || !treasurySecretKeyStr || !rpcEndpoint || !usdcMintAddressStr) {
        console.error('Missing required environment variables for unstake processing.');
        return NextResponse.json({ error: 'Internal Server Configuration Error' }, { status: 500 });
    }

    // Use Service Role Key for backend operations
    const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceRoleKey);
    const connection = new Connection(rpcEndpoint, 'confirmed');
    const usdcMintPublicKey = new PublicKey(usdcMintAddressStr);

    let treasuryKeypair: Keypair;
    try {
        treasuryKeypair = Keypair.fromSecretKey(bs58.decode(treasurySecretKeyStr));
        console.log(`Treasury Wallet Address: ${treasuryKeypair.publicKey.toBase58()}`);
    } catch (error) {
        console.error('Failed to decode TREASURY_WALLET_SECRET_KEY:', error);
        return NextResponse.json({ error: 'Invalid treasury wallet configuration' }, { status: 500 });
    }

    let processedCount = 0;
    let failedCount = 0;
    const failedStakeIds: string[] = [];

    try {
        // 3. Fetch stakes requesting unstake
        const { data: stakesToProcess, error: fetchError } = await supabaseAdmin
            .from('custodial_stakes')
            .select(`
                id,
                amount_staked,
                user_profile_id,
                profiles ( wallet_address )
            `)
            .eq('status', 'unstaking_requested');

        if (fetchError) {
            console.error('Failed to fetch stakes for processing:', fetchError.message);
            return NextResponse.json({ error: 'Database error fetching stakes' }, { status: 500 });
        }

        if (!stakesToProcess || stakesToProcess.length === 0) {
            console.log('No stakes found with status unstaking_requested.');
            return NextResponse.json({ message: 'No stakes to process' });
        }

        console.log(`Found ${stakesToProcess.length} stakes to process.`);

        // 4. Iterate and Process each stake
        for (const stake of stakesToProcess) {
            const stakeId = stake.id;
            console.log(`Processing stake ID: ${stakeId}`);

            // Type guard for profile data
            if (!stake.profiles || typeof stake.profiles !== 'object' || !stake.profiles.wallet_address) {
                console.warn(`Skipping stake ${stakeId}: Missing profile or wallet_address.`);
                failedCount++;
                failedStakeIds.push(stakeId);
                continue;
            }

            const userWalletAddressStr = stake.profiles.wallet_address;
            const amountToUnstake = parseFloat(stake.amount_staked as any); // DB returns numeric which might be string

            if (isNaN(amountToUnstake) || amountToUnstake <= 0) {
                console.warn(`Skipping stake ${stakeId}: Invalid amount_staked (${stake.amount_staked}).`);
                failedCount++;
                failedStakeIds.push(stakeId);
                continue;
            }
            
            try {
                const userWalletPublicKey = new PublicKey(userWalletAddressStr);
                
                // Get ATAs (Associated Token Accounts)
                const sourceAta = getAssociatedTokenAddressSync(
                    usdcMintPublicKey, 
                    treasuryKeypair.publicKey
                );
                const destinationAta = getAssociatedTokenAddressSync(
                    usdcMintPublicKey, 
                    userWalletPublicKey
                );

                console.log(`   User Wallet: ${userWalletAddressStr}`);
                console.log(`   Amount (USDC): ${amountToUnstake}`);
                console.log(`   Source ATA: ${sourceAta.toBase58()}`);
                console.log(`   Destination ATA: ${destinationAta.toBase58()}`);

                // Amount in smallest unit (lamports for USDC)
                const amountInLamports = BigInt(Math.round(amountToUnstake * (10 ** USDC_DECIMALS)));

                const transaction = new Transaction().add(
                    createTransferCheckedInstruction(
                        sourceAta,          // from (treasury ATA)
                        usdcMintPublicKey,  // mint
                        destinationAta,     // to (user ATA)
                        treasuryKeypair.publicKey, // owner of source ATA
                        amountInLamports,   // amount, corrected for decimals
                        USDC_DECIMALS,      // decimals
                        [],                 // signer(s)
                        TOKEN_PROGRAM_ID
                    )
                );

                console.log(`   Sending ${amountToUnstake} USDC to ${userWalletAddressStr}...`);
                const signature = await sendAndConfirmTransaction(
                    connection,
                    transaction,
                    [treasuryKeypair] // Signer
                );
                console.log(`   Transaction successful! Signature: ${signature}`);

                // 5. Update stake status in DB on successful transfer
                const { error: updateError } = await supabaseAdmin
                    .from('custodial_stakes')
                    .update({
                        status: 'unstaked',
                        unstake_transaction_signature: signature,
                        unstake_timestamp: new Date().toISOString(),
                    })
                    .eq('id', stakeId);

                if (updateError) {
                    console.error(`   DB UPDATE FAILED for stake ${stakeId} after successful transfer ${signature}:`, updateError.message);
                    // Critical error: Transfer succeeded but DB update failed. Requires manual intervention.
                    failedCount++;
                    failedStakeIds.push(stakeId + ' (DB Update Failed)');
                } else {
                    console.log(`   Stake ${stakeId} successfully updated to 'unstaked'.`);
                    processedCount++;
                }

            } catch (error: any) {
                console.error(`   FAILED to process unstake for ${stakeId}:`, error.message || error);
                failedCount++;
                failedStakeIds.push(stakeId);
                // Optionally, update status to 'unstake_failed' if you add that status
            }
        } // End loop

        console.log(`Processing complete. Processed: ${processedCount}, Failed: ${failedCount}`);
        if (failedCount > 0) {
            console.warn('Failed stake IDs:', failedStakeIds);
        }

        return NextResponse.json({
            message: `Unstake processing finished. Processed: ${processedCount}, Failed: ${failedCount}`,
            processedCount,
            failedCount,
            failedStakeIds,
        });

    } catch (error: any) {
        console.error('Unexpected error during unstake processing:', error.message);
        return NextResponse.json({ error: 'Internal Server Error during processing' }, { status: 500 });
    }
} 