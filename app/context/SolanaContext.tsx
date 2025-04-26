import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, BN, Idl } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { useToast } from '@/app/components/ui/use-toast';
import { SamachiProgram, UserState } from '@/app/types/samachi-program';
import { SamachiStaking } from '@/app/types/samachi_staking';
import idlJson from '../idl/samachi_staking.json';

// Define the program ID from environment variable
const PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID || "8n1omncNHsRzUARf4w5jAqXjLJihiCCgESixrzj7EJSJ");

// USDC mint address (devnet)
const USDC_MINT = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAVERNBjziTuSfM4");

// Create a properly typed IDL
const idl = idlJson as unknown as SamachiStaking;

interface SolanaContextType {
  program: Program<Idl> | null;
  userState: UserState | null;
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
  const { publicKey, signTransaction, signAllTransactions, connect, disconnect, connected } = useWallet();
  const [program, setProgram] = useState<Program<Idl> | null>(null);
  const [userState, setUserState] = useState<UserState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize the program when wallet is connected
  useEffect(() => {
    // Ensure connection, wallet is fully connected, and methods are available
    if (!connection || !connected || !publicKey || !signTransaction || !signAllTransactions) {
      console.log('Program initialization dependencies not ready:', {
        connection: !!connection,
        connected,
        publicKey: !!publicKey,
        signTransaction: !!signTransaction,
        signAllTransactions: !!signAllTransactions,
      });
      setProgram(null);
      return;
    }

    try {
      // Simple console logging for debugging
      console.log('Starting program initialization with wallet:', publicKey.toString());
      console.log('Connection status:', connection ? 'Connected' : 'Not connected');
      console.log('Wallet connected status:', connected);
      console.log('signTransaction defined:', !!signTransaction);
      console.log('signAllTransactions defined:', !!signAllTransactions);
      
      // Create wallet adapter for AnchorProvider ONLY when dependencies are ready
      const wallet = {
        publicKey,
        signTransaction,
        signAllTransactions,
      };
      
      // Create provider with proper typing
      const provider = new AnchorProvider(
        connection,
        wallet, // Pass the wallet adapter
        { commitment: 'confirmed' } // Options
      );

      // Initialize the program with the IDL, Program ID, and Provider
      const program = new Program(
        idl as unknown as Idl,
        PROGRAM_ID,
        provider
      );
      
      console.log('Program initialized successfully');
      setProgram(program);
    } catch (err) {
      console.error("Error initializing program:", err);
      setError(`Failed to initialize program: ${err instanceof Error ? err.message : String(err)}`);
      toast({
        title: "Error",
        description: "Failed to initialize Solana program",
        variant: "destructive",
      });
    }
  }, [connection, publicKey, signTransaction, signAllTransactions, toast]);

  // Find the user state PDA
  const findUserStatePDA = async () => {
    if (!publicKey) return null;
    const [pda] = await PublicKey.findProgramAddress(
      [Buffer.from("user"), publicKey.toBuffer()],
      PROGRAM_ID
    );
    return pda;
  };

  // Find the vault PDA
  const findVaultPDA = async () => {
    const [pda] = await PublicKey.findProgramAddress(
      [Buffer.from("vault"), USDC_MINT.toBuffer()],
      PROGRAM_ID
    );
    return pda;
  };

  // Refresh user state
  const refreshUserState = async () => {
    if (!program || !publicKey) {
      setUserState(null);
      return;
    }

    try {
      setLoading(true);
      const userStatePDA = await findUserStatePDA();
      if (!userStatePDA) return;
      
      // Cast the program to any to access the account
      const userState = await (program as any).account.userState.fetch(userStatePDA) as UserState;
      setUserState(userState);
      setError(null);
    } catch (err) {
      console.error("Error fetching user state:", err);
      setError("Failed to fetch user state");
      toast({
        title: "Error",
        description: "Failed to fetch your staking status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Stake tokens
  const stake = async (amount: number) => {
    if (!program || !publicKey) {
      throw new Error("Wallet not connected");
    }

    try {
      setLoading(true);
      const userStatePDA = await findUserStatePDA();
      const vaultPDA = await findVaultPDA();
      if (!userStatePDA || !vaultPDA) return;

      const userTokenAccount = await getAssociatedTokenAddress(USDC_MINT, publicKey);

      const tx = await program.methods
        .stake(new BN(amount))
        .accounts({
          user_state: userStatePDA,
          vault_token_account: vaultPDA,
          user_token_account: userTokenAccount,
          mint: USDC_MINT,
          authority: publicKey,
          token_program: TOKEN_PROGRAM_ID,
        })
        .rpc();

      await refreshUserState();
      await connection.confirmTransaction(tx);
    } catch (err) {
      console.error("Error staking:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Unstake tokens
  const unstake = async (amount: number) => {
    if (!program || !publicKey) {
      throw new Error("Wallet not connected");
    }

    try {
      setLoading(true);
      const userStatePDA = await findUserStatePDA();
      const vaultPDA = await findVaultPDA();
      if (!userStatePDA || !vaultPDA) return;

      const userTokenAccount = await getAssociatedTokenAddress(USDC_MINT, publicKey);

      const tx = await program.methods
        .unstake(new BN(amount))
        .accounts({
          user_state: userStatePDA,
          vault_token_account: vaultPDA,
          user_token_account: userTokenAccount,
          mint: USDC_MINT,
          authority: publicKey,
          token_program: TOKEN_PROGRAM_ID,
        })
        .rpc();

      await refreshUserState();
      await connection.confirmTransaction(tx);
    } catch (err) {
      console.error("Error unstaking:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Connect wallet
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

  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      await disconnect();
      setUserState(null);
      toast({
        title: "Success",
        description: "Wallet disconnected successfully",
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

  // Refresh user state when program or public key changes
  useEffect(() => {
    if (connected && program && publicKey) {
      refreshUserState();
    } else {
      setUserState(null);
    }
  }, [program, publicKey, connected]);

  return (
    <SolanaContext.Provider
      value={{
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
      }}
    >
      {children}
    </SolanaContext.Provider>
  );
}

export const useSolana = () => useContext(SolanaContext); 