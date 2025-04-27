import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useConnection, useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, BN, Idl } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { useToast } from '@/app/components/ui/use-toast';
import idlJson from '../idl/samachi_staking.json';
import type { SamachiStaking } from '@/app/types/samachi_staking';

// Define the program ID from environment variable
const PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID || "8VtCsstcdNp1vCoUA1epHXgar9tsKurPZ9eQhrieVrCX");

// USDC mint address (devnet)
const USDC_MINT = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAVERNBjziTuSfM4");

// Admin treasury wallet address (devnet)
const TREASURY_WALLET = new PublicKey(process.env.NEXT_PUBLIC_TREASURY_WALLET_ADDRESS || "DeXCrxjtX39N2BJ2tAVX4ECNtpYpMM1C1LZgnDiKtS1z");

// Define the UserState type based on your IDL/program
// Match the fields in your Rust `UserState` struct
interface UserStateInfo {
  authority: PublicKey;
  stakedAmount: BN; // Assuming u64 translates to BN
  bump: number; // Assuming u8
}

interface SolanaContextType {
  program: Program<SamachiStaking> | null;
  userState: UserStateInfo | null;
  loading: boolean;
  error: string | null;
  stake: (amount: number) => Promise<void>;
  unstake: (amount: number) => Promise<void>;
  refreshUserState: () => Promise<void>;
  isWalletConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

const SolanaContext = createContext<SolanaContextType>({
  program: null,
  userState: null,
  loading: false,
  error: null,
  stake: async () => {},
  unstake: async () => {},
  refreshUserState: async () => {},
  isWalletConnected: false,
  connectWallet: async () => {},
  disconnectWallet: async () => {},
});

export function SolanaProvider({ children }: { children: React.ReactNode }) {
  const { connection } = useConnection();
  const { connected, connect, disconnect } = useWallet();
  const anchorWallet = useAnchorWallet();
  const [program, setProgram] = useState<Program<SamachiStaking> | null>(null);
  const [userState, setUserState] = useState<UserStateInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize the program when wallet is connected
  useEffect(() => {
    if (!connection || !connected || !anchorWallet) {
      console.log('Program initialization dependencies not ready:', {
        connection: !!connection,
        connected,
        anchorWallet: !!anchorWallet,
      });
      setProgram(null);
      setUserState(null);
      return;
    }

    try {
      console.log('Starting program initialization with anchor wallet:', anchorWallet.publicKey.toString());
      console.log('Connection status:', connection ? 'Connected' : 'Not connected');
      console.log('Anchor Wallet connected status:', !!anchorWallet);

      const provider = new AnchorProvider(
        connection,
        anchorWallet,
        { commitment: 'confirmed' }
      );

      console.log("Initializing Program with loaded IDL JSON...");
      if (anchorWallet && provider) {
        try {
          // Log the IDL JSON structure just before using it
          console.log('Raw IDL JSON:', JSON.stringify(idlJson, null, 2));
          // Optional: Log types if debugging IDL issues
          // console.log('IDL JSON types array:', JSON.stringify(idlJson?.types, null, 2));

          // Ensure we have a clean JS object from the imported JSON
          const cleanIdlObject = JSON.parse(JSON.stringify(idlJson));
          // console.log('Cleaned IDL object:', cleanIdlObject);

          // Initialize Program, casting IDL to Idl (imported from anchor)
          // @ts-ignore
          const samachiProgram = new Program<SamachiStaking>(
            cleanIdlObject as Idl,
            PROGRAM_ID,
            provider
          );
          setProgram(samachiProgram);
          console.log('Program initialized successfully:', samachiProgram.programId.toString());
        } catch (error) {
          console.error('Error initializing program:', error);
          setError(`Program Initialization Error: ${error instanceof Error ? error.message : String(error)}`);
          setProgram(null);
        }
      } else {
        console.log('Program initialization failed: anchorWallet or provider is null');
        setProgram(null);
      }
    } catch (err) {
      console.error("Unhandled error during program initialization:", err);
      setError(`Initialization Error: ${err instanceof Error ? err.message : String(err)}`);
      toast({
        title: "Error",
        description: "Failed to initialize Solana program connection",
        variant: "destructive",
      });
    }
  }, [connection, connected, anchorWallet, toast]);

  // Derive UserState PDA
  const findUserStatePDA = async (): Promise<PublicKey | null> => {
    if (!anchorWallet?.publicKey) return null;
    const [pda] = await PublicKey.findProgramAddress(
      [Buffer.from("user_state"), anchorWallet.publicKey.toBuffer()],
      PROGRAM_ID
    );
    return pda;
  };

  // Derive Vault Token Account PDA
  const findVaultTokenAccountPDA = async (): Promise<PublicKey | null> => {
    const [pda] = await PublicKey.findProgramAddress(
      [Buffer.from("vault_tokens"), USDC_MINT.toBuffer()],
      PROGRAM_ID
    );
    return pda;
  };

  // Derive Vault Authority PDA
  const findVaultAuthorityPDA = async (): Promise<PublicKey | null> => {
    const [pda] = await PublicKey.findProgramAddress(
      [Buffer.from("vault_authority"), USDC_MINT.toBuffer()],
      PROGRAM_ID
    );
    return pda;
  };

  // Function to fetch/refresh user state
  const refreshUserState = async () => {
    if (!program || !anchorWallet?.publicKey) {
      setUserState(null);
      return;
    }

    const userStatePDA = await findUserStatePDA();
    if (!userStatePDA) {
      console.log("Refresh User State: Could not derive UserState PDA");
      setUserState(null);
      return;
    }

    try {
      setLoading(true);
      const fetchedState = await program.account.userState.fetch(userStatePDA) as UserStateInfo;
      setUserState(fetchedState);
      setError(null);
    } catch (err) {
      if (err instanceof Error && err.message.includes("Account does not exist")) {
        setUserState(null);
      } else {
        console.error("Error fetching user state:", err);
        setError("Failed to fetch user staking status.");
        toast({
          title: "Error",
          description: "Could not fetch your staking status. Please try refreshing.",
          variant: "destructive",
        });
        setUserState(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch user state when program is initialized or wallet changes
  useEffect(() => {
    if (program && anchorWallet?.publicKey) {
      console.log("Program initialized and wallet connected, refreshing user state...");
      refreshUserState();
    } else {
      setUserState(null);
    }
  }, [program, anchorWallet?.publicKey]);

  // Stake function
  const stake = async (amount: number) => {
    console.log('Stake called. Amount:', amount, 'Checking state:', {
      isProgramInitialized: !!program,
      isAnchorWalletAvailable: !!anchorWallet,
      anchorWalletPublicKey: anchorWallet?.publicKey?.toString(),
      isConnectedViaUseWallet: connected
    });

    if (!program || !anchorWallet?.publicKey || !connection) {
      toast({ title: "Error", description: "Wallet not connected or program not ready.", variant: "destructive"});
      throw new Error("Wallet not connected or program not ready");
    }
    if (amount <= 0) {
      toast({ title: "Error", description: "Stake amount must be positive.", variant: "destructive"});
      throw new Error("Stake amount must be positive.");
    }

    setLoading(true);
    setError(null);
    try {
      const userStatePDA = await findUserStatePDA();
      const vaultTokenAccountPDA = await findVaultTokenAccountPDA();
      const vaultAuthorityPDA = await findVaultAuthorityPDA();

      if (!userStatePDA || !vaultTokenAccountPDA || !vaultAuthorityPDA) {
        throw new Error("Required PDAs could not be derived.");
      }

      const userTokenAccount = await getAssociatedTokenAddress(USDC_MINT, anchorWallet.publicKey);
      console.log("Stake Accounts:", {
          userState: userStatePDA.toString(),
          vaultTokenAccount: vaultTokenAccountPDA.toString(),
          vaultAuthority: vaultAuthorityPDA.toString(),
          userTokenAccount: userTokenAccount.toString(),
          mint: USDC_MINT.toString(),
          authority: anchorWallet.publicKey.toString(),
          tokenProgram: TOKEN_PROGRAM_ID.toString(),
      });

      let userStateExists = false;
      try {
        await program.account.userState.fetch(userStatePDA);
        userStateExists = true;
        console.log("User state account exists.");
      } catch (err) {
        if (err instanceof Error && err.message.includes("Account does not exist")) {
          console.log("User state account does not exist. Initializing...");
          userStateExists = false;
        } else {
          throw err;
        }
      }

      const instructions = [];
      if (!userStateExists) {
        instructions.push(
          await program.methods
            .initializeUser()
            // @ts-ignore
            .accounts({
              userState: userStatePDA,
              authority: anchorWallet.publicKey,
              systemProgram: SystemProgram.programId,
            })
            .instruction()
        );
        console.log("Added initializeUser instruction.");
      }

      instructions.push(
        await program.methods
          .stake(new BN(amount * 1_000_000))
          // @ts-ignore
          .accounts({
            userState: userStatePDA,
            vaultTokenAccount: vaultTokenAccountPDA,
            vaultAuthority: vaultAuthorityPDA,
            userTokenAccount: userTokenAccount,
            mint: USDC_MINT,
            authority: anchorWallet.publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .instruction()
      );
      console.log("Added stake instruction.");

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      const message = new TransactionMessage({
          payerKey: anchorWallet.publicKey,
          recentBlockhash: blockhash,
          instructions,
      }).compileToV0Message();

      const transaction = new VersionedTransaction(message);

      console.log("Sending stake transaction...");
      const signedTransaction = await anchorWallet.signTransaction(transaction);
      const txSignature = await connection.sendTransaction(signedTransaction);
      console.log("Stake transaction sent:", txSignature);

      await connection.confirmTransaction({
          signature: txSignature,
          blockhash,
          lastValidBlockHeight
      });
      console.log("Stake transaction confirmed:", txSignature);

      toast({ title: "Success", description: `Successfully staked ${amount} USDC.` });
      await refreshUserState();

    } catch (err) {
      console.error("Error staking:", err);
       const errorMsg = err instanceof Error ? err.message : String(err);
      setError(`Staking failed: ${errorMsg}`);
      toast({ title: "Error", description: `Staking failed: ${errorMsg}`, variant: "destructive"});
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Unstake function
  const unstake = async (amount: number) => {
     console.log('Unstake called. Amount:', amount, 'Checking state:', {
      isProgramInitialized: !!program,
      isAnchorWalletAvailable: !!anchorWallet,
      anchorWalletPublicKey: anchorWallet?.publicKey?.toString(),
      isConnectedViaUseWallet: connected
    });

    if (!program || !anchorWallet?.publicKey || !connection) {
       toast({ title: "Error", description: "Wallet not connected or program not ready.", variant: "destructive"});
      throw new Error("Wallet not connected or program not ready");
    }
     if (amount <= 0) {
      toast({ title: "Error", description: "Unstake amount must be positive.", variant: "destructive"});
      throw new Error("Unstake amount must be positive.");
    }

    setLoading(true);
    setError(null);
    try {
      const userStatePDA = await findUserStatePDA();
      const vaultTokenAccountPDA = await findVaultTokenAccountPDA();
      const vaultAuthorityPDA = await findVaultAuthorityPDA();

      if (!userStatePDA || !vaultTokenAccountPDA || !vaultAuthorityPDA) {
        throw new Error("Required PDAs could not be derived.");
      }

      const userTokenAccount = await getAssociatedTokenAddress(USDC_MINT, anchorWallet.publicKey);

       console.log("Unstake Accounts:", {
          userState: userStatePDA.toString(),
          vaultTokenAccount: vaultTokenAccountPDA.toString(),
          vaultAuthority: vaultAuthorityPDA.toString(),
          userTokenAccount: userTokenAccount.toString(),
          mint: USDC_MINT.toString(),
          authority: anchorWallet.publicKey.toString(),
          tokenProgram: TOKEN_PROGRAM_ID.toString(),
      });

      // Use program.methods for consistency and type safety
      const txSignature = await program.methods
        .unstake(new BN(amount * 1_000_000))
        // @ts-ignore
        .accounts({
          userState: userStatePDA,
          vaultTokenAccount: vaultTokenAccountPDA,
          vaultAuthority: vaultAuthorityPDA,
          userTokenAccount: userTokenAccount,
          mint: USDC_MINT,
          authority: anchorWallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();

      console.log("Unstake transaction sent:", txSignature);

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
          signature: txSignature,
          blockhash,
          lastValidBlockHeight
      });
       console.log("Unstake transaction confirmed:", txSignature);

      toast({ title: "Success", description: `Successfully unstaked ${amount} USDC.` });
      await refreshUserState();

    } catch (err) {
      console.error("Error unstaking:", err);
       const errorMsg = err instanceof Error ? err.message : String(err);
      setError(`Unstaking failed: ${errorMsg}`);
      toast({ title: "Error", description: `Unstaking failed: ${errorMsg}`, variant: "destructive"});
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Expose connect/disconnect from useWallet
  const connectWallet = async () => {
    try {
      await connect();
      toast({
        title: "Success",
        description: "Wallet connected successfully",
      });
    } catch (err) {
      console.error("Error connecting wallet:", err);
      toast({
        title: "Error",
        description: "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const disconnectWallet = async () => {
    try {
      await disconnect();
       setProgram(null);
      setUserState(null);
      toast({
        title: "Success",
        description: "Wallet disconnected",
      });
    } catch (err) {
      console.error("Error disconnecting wallet:", err);
      toast({
        title: "Error",
        description: "Failed to disconnect wallet",
        variant: "destructive",
      });
    }
  };

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    program,
    userState,
    loading,
    error,
    stake,
    unstake,
    refreshUserState,
    isWalletConnected: connected,
    connectWallet,
    disconnectWallet,
  }), [program, userState, loading, error, connected, connectWallet, disconnectWallet]);

  return (
    <SolanaContext.Provider value={value}>
      {children}
    </SolanaContext.Provider>
  );
}

export const useSolana = () => useContext(SolanaContext); 