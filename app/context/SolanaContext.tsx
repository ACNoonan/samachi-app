import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useConnection, useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, BN, Idl } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { useToast } from '@/app/components/ui/use-toast';
import { UserState } from '@/app/types/samachi-program';
import idlJson from '../idl/samachi_staking.json';

// Define the program ID from environment variable
const PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID || "GeJd3Em3sfV7LZZDiwmXdJWeDas8ea5GTGvSmX1F4Wkk");

// USDC mint address (devnet)
const USDC_MINT = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAVERNBjziTuSfM4");

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
  const { connected } = useWallet();
  const anchorWallet = useAnchorWallet();
  const [program, setProgram] = useState<Program<Idl> | null>(null);
  const [userState, setUserState] = useState<UserState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  /*
  // TEMPORARILY COMMENTED OUT TO ISOLATE AUTH FLOW
  // Initialize the program when wallet is connected
  useEffect(() => {
    if (!connection || !connected || !anchorWallet) { 
      console.log('Program initialization dependencies not ready:', {
        connection: !!connection,
        connected,
        anchorWallet: !!anchorWallet, 
      });
      setProgram(null);
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
      const program = new Program(
        idlJson,    // Raw IDL JSON object
        PROGRAM_ID, // Program ID PublicKey
        provider    // AnchorProvider
      );
      
      console.log('Program initialized successfully.'); 
      setProgram(program); // Set state with Program<Idl>

    } catch (err) {
      console.error("Error initializing program:", err);
      setError(`Failed to initialize program: ${err instanceof Error ? err.message : String(err)}`);
      toast({
        title: "Error",
        description: "Failed to initialize Solana program",
        variant: "destructive",
      });
    }
  }, [connection, connected, anchorWallet, toast]); 
  */

  const findUserStatePDA = async () => {
    if (!anchorWallet?.publicKey) return null;
    const [pda] = await PublicKey.findProgramAddress(
      [Buffer.from("user"), anchorWallet.publicKey.toBuffer()],
      PROGRAM_ID
    );
    return pda;
  };

  const findVaultPDA = async () => {
    const [pda] = await PublicKey.findProgramAddress(
      [Buffer.from("vault"), USDC_MINT.toBuffer()],
      PROGRAM_ID
    );
    return pda;
  };

  const refreshUserState = async () => {
    if (!program || !anchorWallet?.publicKey) {
      setUserState(null);
      return;
    }

    try {
      setLoading(true);
      const userStatePDA = await findUserStatePDA();
      if (!userStatePDA) return;
      
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

  const stake = async (amount: number) => {
    if (!program || !anchorWallet?.publicKey) {
      throw new Error("Wallet not connected");
    }

    try {
      setLoading(true);
      const userStatePDA = await findUserStatePDA();
      const vaultPDA = await findVaultPDA();
      if (!userStatePDA || !vaultPDA) return;

      const userTokenAccount = await getAssociatedTokenAddress(USDC_MINT, anchorWallet.publicKey);

      const tx = await program.methods
        .stake(new BN(amount))
        .accounts({
          user_state: userStatePDA,
          vault_token_account: vaultPDA,
          user_token_account: userTokenAccount,
          mint: USDC_MINT,
          authority: anchorWallet.publicKey,
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

  const unstake = async (amount: number) => {
    if (!program || !anchorWallet?.publicKey) {
      throw new Error("Wallet not connected");
    }

    try {
      setLoading(true);
      const userStatePDA = await findUserStatePDA();
      const vaultPDA = await findVaultPDA();
      if (!userStatePDA || !vaultPDA) return;

      const userTokenAccount = await getAssociatedTokenAddress(USDC_MINT, anchorWallet.publicKey);

      const tx = await program.methods
        .unstake(new BN(amount))
        .accounts({
          user_state: userStatePDA,
          vault_token_account: vaultPDA,
          user_token_account: userTokenAccount,
          mint: USDC_MINT,
          authority: anchorWallet.publicKey,
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

  const { connect } = useWallet();
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

  const { disconnect } = useWallet();
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

  useEffect(() => {
    if (connected && program && anchorWallet?.publicKey) {
      refreshUserState();
    } else {
      setUserState(null);
    }
  }, [program, anchorWallet, connected]);

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