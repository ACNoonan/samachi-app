import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useConnection, useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, TransactionMessage, VersionedTransaction, Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createTransferInstruction } from '@solana/spl-token';
import { toast } from 'sonner';
import type { Database } from '@/lib/database.types';
import { useAuth } from './AuthContext'; // <-- Import useAuth

// Assuming CustodialStake type is defined in database.types.ts
type CustodialStake = Database['public']['Tables']['custodial_stakes']['Row'];

// Define the program ID from environment variable - Keep for now, maybe needed for PDA calculation if reused? Or remove later.
const PROGRAM_ID_PLACEHOLDER = new PublicKey(process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID || "8VtCsstcdNp1vCoUA1epHXgar9tsKurPZ9eQhrieVrCX");

// USDC mint address
const USDC_MINT_ADDRESS = process.env.NEXT_PUBLIC_USDC_MINT_ADDRESS;
const USDC_MINT = USDC_MINT_ADDRESS ? new PublicKey(USDC_MINT_ADDRESS) : null;

// Admin treasury wallet address
const TREASURY_WALLET_ADDRESS = process.env.NEXT_PUBLIC_TREASURY_WALLET_ADDRESS;

// Define the UserState type based on your IDL/program - Removed
// interface UserStateInfo {
//   authority: PublicKey;
//   stakedAmount: BN; // Assuming u64 translates to BN
//   bump: number; // Assuming u8
// }

// --- Refactor SolanaContextType for Custodial Model ---
interface SolanaContextType {
  custodialStakeBalance: number | null; // <-- New state for custodial balance
  custodialStakes: CustodialStake[]; // <-- NEW: Add state for the list of stakes
  treasuryAddress: PublicKey | null; // <-- Expose treasury address
  loading: boolean;
  error: string | null;
  stake: (amount: number) => Promise<void>; // Stake function updated
  unstake: (amount: number) => Promise<void>; // Unstake function updated
  fetchCustodialBalance: () => Promise<void>; // <-- New function to get balance from API
  fetchCustodialStakes: () => Promise<void>; // <-- NEW: Add function to fetch stakes
  isWalletConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

const SolanaContext = createContext<SolanaContextType>({
  custodialStakeBalance: null,
  custodialStakes: [],
  treasuryAddress: null,
  loading: false,
  error: null,
  stake: async () => { console.warn("Stake function not implemented."); },
  unstake: async (amount: number) => { console.warn("Unstake function not implemented."); },
  fetchCustodialBalance: async () => { console.warn("fetchCustodialBalance not implemented."); },
  fetchCustodialStakes: async () => { console.warn("fetchCustodialStakes not implemented."); },
  isWalletConnected: false,
  connectWallet: async () => {},
  disconnectWallet: async () => {},
});

export function SolanaProvider({ children }: { children: React.ReactNode }) {
  const { user: authUser, isLoading: isAuthLoading } = useAuth(); // <-- Use AuthContext
  const { connection } = useConnection();
  const { connected, connect, disconnect, publicKey, sendTransaction, signMessage } = useWallet(); // Added sendTransaction & signMessage
  const anchorWallet = useAnchorWallet();

  const [custodialStakeBalance, setCustodialStakeBalance] = useState<number | null>(null);
  const [custodialStakes, setCustodialStakes] = useState<CustodialStake[]>([]);
  const [treasuryAddress, setTreasuryAddress] = useState<PublicKey | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const { toast } = useToast(); // Using sonner

  // --- Error Handling Helper ---
  const handleError = (message: string, error?: any) => {
    console.error(message, error);
    const displayMessage = error instanceof Error ? `${message}: ${error.message}` : message;
    setError(displayMessage);
    toast.error(message, { description: error instanceof Error ? error.message : undefined });
    setLoading(false);
  };

  // --- Fetch Custodial Stakes --- 
  const fetchCustodialStakes = useCallback(async () => {
    if (isAuthLoading || !authUser) {
      console.log("SolanaContext: Auth not ready, skipping fetchCustodialStakes.");
      setCustodialStakes([]);
      return;
    }
    if (!connected || !publicKey) {
      setCustodialStakes([]);
      return;
    }
    // setLoading(true); // Managed by fetchCustodialBalance
    try {
      const response = await fetch('/api/staking/stakes');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCustodialStakes(Array.isArray(data) ? data : []);
      console.log("SolanaContext: Fetched stakes:", data);
    } catch (err) {
      console.error("Error fetching custodial stakes:", err);
      setError((prev) => prev ? `${prev}\nFailed to fetch stakes.` : "Failed to fetch stakes.");
      setCustodialStakes([]);
    } finally {
      // setLoading(false); // Managed by fetchCustodialBalance
    }
  }, [isAuthLoading, authUser, connected, publicKey]);

  // --- Fetch Custodial Balance (and Stakes) --- 
  const fetchCustodialBalance = useCallback(async () => {
    if (isAuthLoading || !authUser) {
      console.log("SolanaContext: Auth not ready, skipping fetchCustodialBalance.");
      setCustodialStakeBalance(null);
      setCustodialStakes([]);
      setError(null);
      setLoading(false);
      return;
    }
    if (!connected || !publicKey) {
      setCustodialStakeBalance(null);
      setCustodialStakes([]);
      setError(null);
      setLoading(false); // Also ensure loading is false if wallet not connected
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const balanceResponse = await fetch('/api/staking/balance');
      if (!balanceResponse.ok) {
        const errorData = await balanceResponse.json().catch(() => ({}));
        throw new Error(`Balance fetch error: ${errorData.message || balanceResponse.statusText}`);
      }
      const balanceData = await balanceResponse.json();
      setCustodialStakeBalance(balanceData.balance ?? 0);
      console.log("SolanaContext: Fetched balance from API:", balanceData.balance);

      await fetchCustodialStakes(); // Fetch stakes after balance

    } catch (err) {
      handleError("Could not fetch staking data", err);
      setCustodialStakeBalance(null);
      setCustodialStakes([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthLoading, authUser, connected, publicKey, fetchCustodialStakes]);

  // --- Effect to Fetch Balance on Connect --- 
  useEffect(() => {
    if (!isAuthLoading && authUser && connected && publicKey) {
      console.log("SolanaContext: Auth ready, Wallet connected, fetching custodial balance & stakes...");
      fetchCustodialBalance();
    } else {
      console.log("SolanaContext: Conditions not met for initial balance fetch.", { isAuthLoading, hasAuthUser: !!authUser, connected, hasPublicKey: !!publicKey });
      setCustodialStakeBalance(null);
      setCustodialStakes([]);
      setError(null); // Clear error if conditions are not met
    }
  }, [isAuthLoading, authUser, connected, publicKey, fetchCustodialBalance]);

  // --- Stake Function (Client-Side SPL Transfer) --- 
  const stake = useCallback(async (amount: number) => {
    if (isAuthLoading || !authUser) {
      handleError("Cannot stake: User not authenticated.");
      return;
    }
    if (!connected || !publicKey || !connection || !treasuryAddress || !USDC_MINT || !sendTransaction) {
      handleError("Cannot stake: Wallet not connected, config missing, or cannot send transactions.");
      return;
    }
    if (amount <= 0) {
      toast.error("Invalid Amount", { description: "Stake amount must be positive." });
      return;
    }

    setLoading(true);
    setError(null);
    let signature = '';
    try {
      toast.info("Preparing Stake Transaction...", { description: `Amount: ${amount} USDC` });

      const userTokenAccount = await getAssociatedTokenAddress(USDC_MINT, publicKey);
      const treasuryTokenAccount = await getAssociatedTokenAddress(USDC_MINT, treasuryAddress);
      console.log("User ATA:", userTokenAccount.toString());
      console.log("Treasury ATA:", treasuryTokenAccount.toString());

      const userTokenAccountInfo = await connection.getAccountInfo(userTokenAccount);
      if (!userTokenAccountInfo) {
        throw new Error("Your USDC token account not found. Ensure you hold USDC.");
      }
      const treasuryTokenAccountInfo = await connection.getAccountInfo(treasuryTokenAccount);
       if (!treasuryTokenAccountInfo) {
           throw new Error("Staking destination account is not initialized. Please contact support.");
       }

      const decimals = 6; // TODO: Get dynamically?
      const amountRaw = BigInt(Math.round(amount * (10 ** decimals)));

      const transferInstruction = createTransferInstruction(
        userTokenAccount,
        treasuryTokenAccount,
        publicKey,
        amountRaw,
        [],
        TOKEN_PROGRAM_ID
      );

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: publicKey,
      }).add(transferInstruction);

      toast.loading("Action Required: Approve Transaction", { description: "Please approve the stake transaction in your wallet." });
      signature = await sendTransaction(transaction, connection);
      toast.dismiss(); // Dismiss loading toast
      toast.info("Transaction Sent", { description: `Signature: ${signature.substring(0, 10)}... Waiting for confirmation.` });
      console.log("Stake Transaction Signature:", signature);

      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
      }, 'confirmed');

      if (confirmation.value.err) {
        throw new Error(`Stake transaction failed to confirm: ${confirmation.value.err}`);
      }

      toast.success("Stake Successful!", {
        description: `Successfully staked ${amount} USDC. Balance will update shortly after processing.`,
        duration: 8000
      });

      setTimeout(() => {
        console.log("Triggering balance refresh after stake...");
        fetchCustodialBalance();
      }, 15000); // Adjust delay as needed

    } catch (err) {
      toast.dismiss(); // Ensure loading toast is dismissed on error
      handleError(`Stake failed${signature ? ` (Tx: ${signature.substring(0,10)}...)` : ''}`, err);
    } finally {
        // setLoading handled by handleError or end of try block
    }
  }, [isAuthLoading, authUser, connected, publicKey, connection, treasuryAddress, sendTransaction, fetchCustodialBalance]); // Dependencies

  // --- Unstake Function (Calls Backend API) --- 
  const unstake = useCallback(async (amount: number) => {
    if (isAuthLoading || !authUser) {
      handleError("Cannot unstake: User not authenticated.");
      return;
    }
    if (!connected) { // Wallet check still relevant for user experience, even if API auth is primary
      toast.error("Cannot Unstake", { description: "Wallet not connected." });
      return;
    }
    if (typeof amount !== 'number' || amount <= 0) {
      toast.error("Invalid Amount", { description: "Unstake amount must be positive." });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      toast.info("Requesting Unstake...", { description: `Amount: ${amount} USDC` });

      const response = await fetch('/api/staking/unstake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Unstake failed: ${response.statusText}`);
      }

      const result = await response.json();
      toast.success("Unstake Request Successful!", {
        description: result.message || `Successfully initiated unstake of ${amount} USDC. Balance will update shortly.`,
        duration: 8000
      });

      // Refresh balance after a short delay to allow backend processing
      setTimeout(() => {
        console.log("Triggering balance refresh after unstake...");
        fetchCustodialBalance();
      }, 5000); // Shorter delay for unstake as it might be faster

    } catch (err) {
      toast.dismiss(); // Dismiss loading toast if any
      handleError("Unstake failed", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthLoading, authUser, connected, fetchCustodialBalance]);

  // --- Wallet Connect/Disconnect Handlers --- 
  const connectWallet = useCallback(async () => {
    if (connected) return;
    try {
      await connect();
    } catch (error) {
      handleError("Failed to connect wallet", error);
    }
  }, [connected, connect]);

  const disconnectWallet = useCallback(async () => {
    if (!connected) return;
    try {
      await disconnect();
      setCustodialStakeBalance(null);
      setCustodialStakes([]);
      setError(null);
    } catch (error) {
      handleError("Failed to disconnect wallet", error);
    }
  }, [connected, disconnect]);

  // --- Initialize Treasury Address --- 
  useEffect(() => {
    if (TREASURY_WALLET_ADDRESS) {
      try {
        setTreasuryAddress(new PublicKey(TREASURY_WALLET_ADDRESS));
      } catch (e) {
        handleError("Invalid Treasury Address Configuration", e);
        setTreasuryAddress(null);
      }
    } else {
        handleError("Missing Treasury Address Configuration");
        setTreasuryAddress(null);
    }
    if (!USDC_MINT) {
        handleError("Missing USDC Mint Address Configuration");
    }
  }, []); // Run once on mount

  // --- Memoize Context Value --- 
  const value = useMemo(() => ({
    custodialStakeBalance,
    custodialStakes,
    treasuryAddress,
    loading,
    error,
    stake,
    unstake,
    fetchCustodialBalance,
    fetchCustodialStakes,
    isWalletConnected: connected,
    connectWallet,
    disconnectWallet,
  }), [
    custodialStakeBalance,
    custodialStakes,
    treasuryAddress,
    loading,
    error,
    stake, // useCallback dep
    unstake, // useCallback dep
    fetchCustodialBalance, // useCallback dep
    fetchCustodialStakes, // useCallback dep
    connected,
    connectWallet, // useCallback dep
    disconnectWallet, // useCallback dep
  ]);

  return <SolanaContext.Provider value={value}>{children}</SolanaContext.Provider>;
}

export const useSolana = () => useContext(SolanaContext); 