'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageLayout } from '@/app/components/layout/PageLayout';
import { useAuth } from '@/app/context/AuthContext';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useSolana } from '@/app/context/SolanaContext';
import { Button } from '@/app/components/ui/button'; // Assuming you have this
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card'; // Assuming you have these
import { Input } from '@/app/components/ui/input'; // Assuming you have this
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Ticket, Link2, CheckCircle2, AlertCircle, Loader2, Coins, MinusCircle, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Buffer } from 'buffer';

interface MembershipWithVenue {
  id: string;
  venue_id: string;
  status: string;
  venues: {
    name: string;
  } | null;
}

export default function NewWalletPage() {
  const { user, profile, fetchProfile, isLoading: authLoading } = useAuth();
  const { publicKey, connected, signMessage, wallet } = useWallet();
  const { custodialStakeBalance, stake, unstake, loading: solanaLoading } = useSolana();

  const [memberships, setMemberships] = useState<MembershipWithVenue[]>([]);
  const [isLoadingMemberships, setIsLoadingMemberships] = useState(false);
  const [isWalletLinked, setIsWalletLinked] = useState(false);
  const [isLinkingInProgress, setIsLinkingInProgress] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  const [stakeInputAmount, setStakeInputAmount] = useState('');
  const [unstakeInputAmount, setUnstakeInputAmount] = useState('');

  // Fetch Memberships
  const fetchMemberships = useCallback(async () => {
    if (!user) return;
    setIsLoadingMemberships(true);
    try {
      const response = await fetch('/api/memberships');
      if (!response.ok) {
        throw new Error('Failed to fetch memberships');
      }
      const data = await response.json();
      setMemberships(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching memberships:", error);
      toast.error("Could not load your memberships.");
      setMemberships([]);
    } finally {
      setIsLoadingMemberships(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMemberships();
  }, [fetchMemberships]);

  // Check wallet link status
  useEffect(() => {
    if (connected && publicKey && profile) {
      setIsWalletLinked(profile.wallet_address === publicKey.toBase58());
    } else {
      setIsWalletLinked(false);
    }
  }, [connected, publicKey, profile]);

  const handleLinkWallet = async () => {
    if (!user || !publicKey || !signMessage) {
      toast.error("Cannot link wallet: User not authenticated or wallet not fully connected.");
      return;
    }
    setIsLinkingInProgress(true);
    setLinkError(null);
    try {
      const message = `Sign this message to link your wallet to your Samachi account: ${user.id}`;
      console.log("Client-side original message for signing:", message); // For debugging

      const messageBytes = new TextEncoder().encode(message);
      const signature = await signMessage(messageBytes);
      const signatureBase64 = Buffer.from(signature).toString('base64');

      const response = await fetch('/api/profile/link-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signedMessage: signatureBase64,
          originalMessage: message,
          walletAddress: publicKey.toBase58(),
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Server error during wallet linking.');
      }
      toast.success("Wallet linked successfully!");
      await fetchProfile(user.id); // Re-fetch profile to update wallet_address
    } catch (error: any) {
      console.error("Error linking wallet:", error);
      const errMsg = error.message || "An unexpected error occurred during linking.";
      setLinkError(errMsg);
      toast.error("Failed to link wallet", { description: errMsg });
    } finally {
      setIsLinkingInProgress(false);
    }
  };
  
  const handleStake = async () => {
    if (!stakeInputAmount || parseFloat(stakeInputAmount) <= 0) {
      toast.error("Invalid Stake Amount", { description: "Please enter a positive number to stake." });
      return;
    }
    if (!isWalletLinked) {
      toast.error("Wallet Not Linked", { description: "Please link your wallet before staking." });
      return;
    }
    const amount = parseFloat(stakeInputAmount);
    await stake(amount); // stake function in SolanaContext handles toasts and loading
    setStakeInputAmount('');
  };

  const handleUnstake = async () => {
    if (!unstakeInputAmount || parseFloat(unstakeInputAmount) <= 0) {
      toast.error("Invalid Unstake Amount", { description: "Please enter a positive number to unstake." });
      return;
    }
    if (!isWalletLinked) { // Should not happen if UI is correct, but good check
      toast.error("Wallet Not Linked", { description: "Cannot unstake without a linked wallet." });
      return;
    }
    if (custodialStakeBalance === null || custodialStakeBalance === 0) {
        toast.error("No Balance to Unstake");
        return;
    }
    const amount = parseFloat(unstakeInputAmount);
    if (amount > (custodialStakeBalance || 0)) {
        toast.error("Unstake amount exceeds balance.");
        return;
    }
    await unstake(amount); // unstake function in SolanaContext handles toasts and loading
    setUnstakeInputAmount('');
  };

  const isLoading = authLoading || solanaLoading;

  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4 space-y-8">
        <h1 className="text-3xl font-bold">My Wallet</h1>

        {/* Section 1: Active Memberships */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Ticket className="mr-2 h-5 w-5" />Active Memberships</CardTitle>
            <CardDescription>Your current venue memberships.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingMemberships && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
            {!isLoadingMemberships && memberships.length === 0 && (
              <p className="text-sm text-muted-foreground">No active venue memberships found.</p>
            )}
            {!isLoadingMemberships && memberships.length > 0 && (
              <ul className="space-y-2">
                {memberships.map((mem) => (
                  <li key={mem.id} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-muted/50">
                    <span>{mem.venues?.name || 'Venue details missing'}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${mem.status === 'active' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'}`}>
                      {mem.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Section 2: Wallet Connection & Linking */}
        <Card>
          <CardHeader>
            <CardTitle>Wallet Management</CardTitle>
            <CardDescription>Connect and link your Solana wallet.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <WalletMultiButton />
            </div>
            {connected && publicKey && user && !isWalletLinked && (
              <div className="pt-4 border-t">
                <p className="text-sm text-center text-orange-600 dark:text-orange-400 mb-3">
                  Your wallet (<span className="font-mono text-xs">{publicKey.toBase58()}</span>) is connected but not linked to your Samachi account.
                </p>
                <Button 
                  onClick={handleLinkWallet} 
                  disabled={isLinkingInProgress || authLoading}
                  className="w-full"
                >
                  {isLinkingInProgress ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Linking Wallet...</>
                  ) : (
                    <><Link2 className="h-4 w-4 mr-2" /> Link This Wallet to Account</>
                  )}
                </Button>
                {linkError && (
                  <p className="text-xs text-red-600 mt-2 text-center flex items-center justify-center">
                    <AlertCircle className="h-3 w-3 mr-1" /> {linkError}
                  </p>
                )}
              </div>
            )}
            {isWalletLinked && publicKey && (
              <div className="pt-4 border-t flex items-center justify-center text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-5 w-5 mr-2" /> 
                <span>Wallet (<span className="font-mono text-xs">{publicKey.toBase58()}</span>) Linked</span>
              </div>
            )}
            {!connected && user && (
                <p className="text-sm text-center text-muted-foreground pt-4 border-t">Connect your wallet to proceed.</p>
            )}
          </CardContent>
        </Card>

        {/* Section 3: Staking (Visible if wallet connected AND linked) */}
        {connected && isWalletLinked && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Coins className="mr-2 h-5 w-5 text-green-600" />USDC Staking</CardTitle>
              <CardDescription>Manage your staked USDC balance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Your Staked Balance</p>
                {solanaLoading && custodialStakeBalance === null ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                    <p className="text-2xl font-semibold">
                        {custodialStakeBalance !== null ? custodialStakeBalance.toFixed(2) : '0.00'} USDC
                    </p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="stake-amount" className="text-sm font-medium">Stake USDC</label>
                <div className="flex items-center gap-2">
                  <Input
                    id="stake-amount"
                    type="number"
                    placeholder="Amount (e.g., 10.5)"
                    value={stakeInputAmount}
                    onChange={(e) => setStakeInputAmount(e.target.value)}
                    disabled={isLoading || isLinkingInProgress}
                    className="flex-grow"
                    min="0"
                  />
                  <Button
                    onClick={handleStake}
                    disabled={isLoading || isLinkingInProgress || !stakeInputAmount || parseFloat(stakeInputAmount) <= 0}
                  >
                    <PlusCircle className="h-5 w-5 mr-2 sm:hidden" />
                    <PlusCircle className="h-5 w-5 mr-2 hidden sm:inline" />
                    <span className="hidden sm:inline">Stake</span>
                    <span className="sm:hidden">Stake</span>
                  </Button>
                </div>
              </div>

              {custodialStakeBalance !== null && custodialStakeBalance > 0 && (
                <div className="space-y-2">
                  <label htmlFor="unstake-amount" className="text-sm font-medium">Unstake USDC</label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="unstake-amount"
                      type="number"
                      placeholder="Amount (e.g., 5)"
                      value={unstakeInputAmount}
                      onChange={(e) => setUnstakeInputAmount(e.target.value)}
                      disabled={isLoading || isLinkingInProgress}
                      className="flex-grow"
                      min="0"
                      max={custodialStakeBalance || 0}
                    />
                    <Button
                      onClick={handleUnstake}
                      disabled={isLoading || isLinkingInProgress || !unstakeInputAmount || parseFloat(unstakeInputAmount) <= 0 || parseFloat(unstakeInputAmount) > (custodialStakeBalance || 0)}
                      variant="outline"
                    >
                      <MinusCircle className="h-5 w-5 mr-2 sm:hidden" />
                      <MinusCircle className="h-5 w-5 mr-2 hidden sm:inline" />
                      <span className="hidden sm:inline">Unstake</span>
                      <span className="sm:hidden">Unstake</span>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Section 4: Venue Check-in (Visible if connected, linked, AND staked) */}
        {connected && isWalletLinked && custodialStakeBalance !== null && custodialStakeBalance > 0 && (
          <Card>
            <CardHeader>
                <CardTitle>Venue Check-in</CardTitle>
                <CardDescription>Use your staked balance at supported venues.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* TODO: Implement Venue Selection and Check-in Button */}
              <p className="text-muted-foreground">Venue check-in functionality coming soon. You have {custodialStakeBalance.toFixed(2)} USDC available to fund your tab.</p>
              <Button disabled className="mt-4">Select Venue & Check-in (Coming Soon)</Button>
            </CardContent>
          </Card>
        )}

        {/* Status Indicators Section - Can be refined or removed if UI is clear enough */}
        {/* ... */}

      </div>
    </PageLayout>
  );
} 