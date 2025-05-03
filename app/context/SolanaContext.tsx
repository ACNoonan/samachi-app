import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useConnection, useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { useToast } from '@/app/components/ui/use-toast';

// Define the program ID from environment variable - Keep for now, maybe needed for PDA calculation if reused? Or remove later.
const PROGRAM_ID_PLACEHOLDER = new PublicKey(process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID || "8VtCsstcdNp1vCoUA1epHXgar9tsKurPZ9eQhrieVrCX");

// USDC mint address (devnet) - Keep, useful for transfers
const USDC_MINT = new PublicKey(process.env.NEXT_PUBLIC_USDC_MINT_ADDRESS || "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"); // Using Devnet USDC

// Admin treasury wallet address (devnet) - Keep, useful for target address
const TREASURY_WALLET = new PublicKey(process.env.NEXT_PUBLIC_TREASURY_WALLET_ADDRESS || "DeXCrxjtX39N2BJ2tAVX4ECNtpYpMM1C1LZgnDiKtS1z"); // Using Devnet Treasury

// Define the UserState type based on your IDL/program - Removed
// interface UserStateInfo {
//   authority: PublicKey;
//   stakedAmount: BN; // Assuming u64 translates to BN
//   bump: number; // Assuming u8
// }

// --- Refactor SolanaContextType for Custodial Model ---
interface SolanaContextType {
  // program: Program<SamachiStaking> | null; // <-- Removed program
  // userState: UserStateInfo | null; // <-- Removed userState
  custodialStakeBalance: number | null; // <-- New state for custodial balance
  treasuryAddress: PublicKey | null; // <-- Expose treasury address
  loading: boolean;
  error: string | null;
  stake: (amount: number) => Promise<void>; // Signature kept, implementation needs change
  unstake: () => Promise<void>; // Signature updated, amount not needed for request
  // refreshUserState: () => Promise<void>; // <-- Removed state refresh
  fetchCustodialBalance: () => Promise<void>; // <-- New function to get balance from API
  isWalletConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

const SolanaContext = createContext<SolanaContextType>({
  // program: null, // <-- Removed
  // userState: null, // <-- Removed
  custodialStakeBalance: null, // <-- New default
  treasuryAddress: null, // <-- New default
  loading: false,
  error: null,
  stake: async () => { console.warn("Stake function not implemented for custodial model."); },
  unstake: async () => { console.warn("Unstake function not implemented for custodial model."); },
  // refreshUserState: async () => {}, // <-- Removed
  fetchCustodialBalance: async () => { console.warn("fetchCustodialBalance not implemented."); },
  isWalletConnected: false,
  connectWallet: async () => {},
  disconnectWallet: async () => {},
});

export function SolanaProvider({ children }: { children: React.ReactNode }) {
  const { connection } = useConnection();
  const { connected, connect, disconnect, publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();
  // const [program, setProgram] = useState<Program<SamachiStaking> | null>(null); // <-- Removed program state
  // const [userState, setUserState] = useState<UserStateInfo | null>(null); // <-- Removed user state
  const [custodialStakeBalance, setCustodialStakeBalance] = useState<number | null>(null); // <-- New balance state
  const [treasuryAddress, setTreasuryAddress] = useState<PublicKey | null>(null); // <-- New treasury address state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // --- Remove Anchor Program Initialization Effect --- 
  // useEffect(() => {
  //   if (!connection || !connected || !anchorWallet) {
  //     console.log('Program initialization dependencies not ready:', {
  //       connection: !!connection,
  //       connected,
  //       anchorWallet: !!anchorWallet,
  //     });
  //     // setProgram(null);
  //     // setUserState(null);
  //     return;
  //   }
  // 
  //   try {
  //     console.log('Starting program initialization with anchor wallet:', anchorWallet.publicKey.toString());
  //     console.log('Connection status:', connection ? 'Connected' : 'Not connected');
  //     console.log('Anchor Wallet connected status:', !!anchorWallet);
  // 
  //     const provider = new AnchorProvider(
  //       connection,
  //       anchorWallet,
  //       { commitment: 'confirmed' }
  //     );
  // 
  //     console.log("Initializing Program with loaded IDL JSON...");
  //     if (anchorWallet && provider) {
  //       try {
  //         console.log('Raw IDL JSON:', JSON.stringify(idlJson, null, 2));
  // 
  //         const cleanIdlObject = JSON.parse(JSON.stringify(idlJson));
  // 
  //         const samachiProgram = new Program<SamachiStaking>(
  //           cleanIdlObject as Idl,
  //           PROGRAM_ID_PLACEHOLDER, // Use placeholder
  //           provider
  //         );
  //         // setProgram(samachiProgram);
  //         console.log('Program initialized successfully:', samachiProgram.programId.toString());
  //       } catch (error) {
  //         console.error('Error initializing program:', error);
  //         setError(`Program Initialization Error: ${error instanceof Error ? error.message : String(error)}`);
  //         // setProgram(null);
  //       }
  //     } else {
  //       console.log('Program initialization failed: anchorWallet or provider is null');
  //       // setProgram(null);
  //     }
  //   } catch (err) {
  //     console.error("Unhandled error during program initialization:", err);
  //     setError(`Initialization Error: ${err instanceof Error ? err.message : String(err)}`);
  //     toast({
  //       title: "Error",
  //       description: "Failed to initialize Solana program connection",
  //       variant: "destructive",
  //     });
  //   }
  // }, [connection, connected, anchorWallet, toast]);

  // --- Remove PDA Derivations --- 
  // const findUserStatePDA = async (): Promise<PublicKey | null> => {
  //   if (!publicKey) return null;
  //   const [pda] = await PublicKey.findProgramAddress(
  //     [Buffer.from("user_state"), publicKey.toBuffer()],
  //     PROGRAM_ID_PLACEHOLDER
  //   );
  //   return pda;
  // };
  // 
  // const findVaultTokenAccountPDA = async (): Promise<PublicKey | null> => {
  //   const [pda] = await PublicKey.findProgramAddress(
  //     [Buffer.from("vault_tokens"), USDC_MINT.toBuffer()],
  //     PROGRAM_ID_PLACEHOLDER
  //   );
  //   return pda;
  // };
  // 
  // const findVaultAuthorityPDA = async (): Promise<PublicKey | null> => {
  //   const [pda] = await PublicKey.findProgramAddress(
  //     [Buffer.from("vault_authority"), USDC_MINT.toBuffer()],
  //     PROGRAM_ID_PLACEHOLDER
  //   );
  //   return pda;
  // };

  // --- Remove User State Fetching --- 
  // const refreshUserState = async () => {
  //   // ... (implementation removed) ...
  // };
  // 
  // useEffect(() => {
  //   // ... (effect removed) ...
  // }, [/* dependencies removed */]);

  // --- New function to fetch custodial balance --- 
  const fetchCustodialBalance = async () => {
    if (!connected || !publicKey) {
      setCustodialStakeBalance(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Assume API requires authentication (middleware handles this)
      const response = await fetch('/api/staking/balance');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCustodialStakeBalance(data.balance || 0);
    } catch (err: any) {
      console.error("Error fetching custodial stake balance:", err);
      setError("Failed to fetch staking balance.");
      setCustodialStakeBalance(null);
      toast({
        title: "Error",
        description: err.message || "Could not fetch your staking balance.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch balance when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      console.log("Wallet connected, fetching custodial balance...");
      fetchCustodialBalance();
    } else {
      setCustodialStakeBalance(null); // Clear balance if wallet disconnects
    }
  }, [connected, publicKey]);

  // --- Update Stake function ---
  // Stake is now purely informational - user sends funds manually.
  const stake = async (amount: number) => {
    console.info(`Please send ${amount} USDC to the treasury address: ${TREASURY_WALLET.toString()}`);
    toast({
        title: "Stake Instruction",
        description: `To stake, please send USDC to the treasury address: ${TREASURY_WALLET.toString()}. Your balance will update after the transaction is confirmed and processed. You may need to refresh manually.`,
        duration: 10000 // Show for 10 seconds
    });
  };

  // --- Update Unstake function ---
  // Calls the backend API to request unstaking. Amount is not needed as API likely processes all 'staked' records for the user.
  const unstake = async () => {
    if (!connected) {
      toast({ title: "Error", description: "Wallet not connected.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/staking/request-unstake', {
        method: 'POST',
        // No body needed as the API identifies user via session/token
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Try to parse error, default to empty object
        throw new Error(errorData.message || `Failed to request unstake: ${response.statusText}`);
      }

      const result = await response.json();
      toast({
        title: "Unstake Requested",
        description: result.message || "Your unstake request has been submitted. Processing may take some time.",
      });
      // Optionally: Refresh balance after a delay, though it won't change until processed
      // setTimeout(fetchCustodialBalance, 5000);

    } catch (err: any) {
      console.error("Error requesting unstake:", err);
      setError(err.message || "Failed to request unstake.");
      toast({
        title: "Unstake Error",
        description: err.message || "An error occurred while requesting unstake.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Wallet connect/disconnect handlers (from useWallet)
  const connectWallet = async () => {
    if (connected) return;
    try {
      await connect();
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to connect wallet.",
        variant: "destructive",
      });
    }
  };

  const disconnectWallet = async () => {
    if (!connected) return;
    try {
      await disconnect();
      setCustodialStakeBalance(null); // Clear balance on disconnect
    } catch (error: any) {
      console.error("Failed to disconnect wallet:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to disconnect wallet.",
        variant: "destructive",
      });
    }
  };

  // Memoize the context value
  const value = useMemo(() => ({
    // program, // <-- Removed
    // userState, // <-- Removed
    custodialStakeBalance,
    treasuryAddress: TREASURY_WALLET, // <-- Expose treasury address
    loading,
    error,
    stake,
    unstake,
    // refreshUserState, // <-- Removed
    fetchCustodialBalance,
    isWalletConnected: connected,
    connectWallet,
    disconnectWallet,
  }), [
    // program, // <-- Removed
    // userState, // <-- Removed
    custodialStakeBalance,
    loading,
    error,
    connected,
    // refreshUserState, // <-- Removed
    fetchCustodialBalance,
    connectWallet,
    disconnectWallet,
    stake,
    unstake
  ]);

  return <SolanaContext.Provider value={value}>{children}</SolanaContext.Provider>;
}

export const useSolana = () => useContext(SolanaContext); 