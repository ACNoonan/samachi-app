import React, { createContext, useContext, useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { useToast } from '@/app/components/ui/use-toast';
import { SamachiProgram, UserState } from '@/app/types/samachi-program';
import idl from '../idl/samachi_staking.json';

// Define the program ID from your deployed contract
const PROGRAM_ID = new PublicKey("BAxhgSfwjWh5z6SMU6kVvgdEAkmqbipWeCKVuG4xMYFF");

// USDC mint address (devnet)
const USDC_MINT = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAVERNBjziTuSfM4");

interface SolanaContextType {
  program: Program<any> | null;
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
  const [program, setProgram] = useState<Program<any> | null>(null);
  const [userState, setUserState] = useState<UserState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize the program when wallet is connected
  useEffect(() => {
    if (!connection || !publicKey || !signTransaction || !signAllTransactions) {
      setProgram(null);
      return;
    }

    try {
      const provider = new AnchorProvider(
        connection,
        { publicKey, signTransaction, signAllTransactions },
        { commitment: "confirmed" }
      );

      const program = new Program(idl as any, PROGRAM_ID, provider);
      setProgram(program);
    } catch (err) {
      console.error("Error initializing program:", err);
      setError("Failed to initialize program");
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
      
      const userState = await program.account.userState.fetch(userStatePDA);
      setUserState(userState as UserState);
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
          userState: userStatePDA,
          userTokenAccount,
          vault: vaultPDA,
          mint: USDC_MINT,
          authority: publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
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
          userState: userStatePDA,
          userTokenAccount,
          vault: vaultPDA,
          mint: USDC_MINT,
          authority: publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
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