'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { toast } from 'sonner';
import { useSimpleAuth } from '@/app/context/AuthContext';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'; // Use the pre-built button for convenience
import { ArrowLeft } from 'lucide-react';

export const CreateProfileForm: React.FC = () => {
  console.log("[CreateProfileForm] Component rendering start.");

  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useSimpleAuth();
  const { publicKey, connected, connecting } = useWallet();

  const cardIdFromQuery = searchParams.get('cardId');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');
  const [telegramHandle, setTelegramHandle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!cardIdFromQuery) {
      toast.error('Missing membership card ID. Please go back and scan the card again.');
      // Consider redirecting back or disabling the form
      // router.replace('/');
    } else {
        console.log('Create Profile page loaded for card:', cardIdFromQuery);
    }
  }, [cardIdFromQuery, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cardIdFromQuery) {
        toast.error('Cannot create profile without a card ID.');
        return;
    }
    if (!username || !password) {
      toast.error('Username and password are required.');
      return;
    }
    // Optional: Add password strength validation

    setIsLoading(true);
    console.log('Submitting profile creation:', { username, cardIdFromQuery, publicKey: publicKey?.toBase58() });

    try {
      const response = await fetch('/api/create-profile-and-claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password, // Send plain text, backend will hash
          twitterHandle: twitterHandle || null,
          telegramHandle: telegramHandle || null,
          walletAddress: publicKey?.toBase58() || null, // Send connected wallet address or null
          cardId: cardIdFromQuery,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create profile and claim card.');
      }

      toast.success(data.message || 'Profile created and card claimed successfully!');
      login(); // Set logged in state
      router.push('/dashboard'); // Redirect to dashboard

    } catch (error: any) {
      console.error('Profile creation API error:', error);
      toast.error(error.message || 'An error occurred during profile creation.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-6">
       <button
        onClick={() => router.back()} // Simple back navigation
        className="self-start mb-8 p-2 rounded-full hover:bg-black/5 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Create Your Profile</h1>
        <p className="text-muted-foreground">
            Claiming Membership Card: <span className="font-mono text-sm bg-gray-100 p-1 rounded text-black">{cardIdFromQuery || 'N/A'}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username */}
        <div className="space-y-2">
          <Label htmlFor="username">Username <span className="text-red-500">*</span></Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your_username"
            required
            disabled={isLoading}
            className="bg-white/50 backdrop-blur-sm border-gray-200"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={isLoading}
            className="bg-white/50 backdrop-blur-sm border-gray-200"
          />
          {/* Add password requirements hint if needed */}
        </div>

        {/* Twitter (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="twitter">X / Twitter Handle (Optional)</Label>
          <Input
            id="twitter"
            type="text"
            value={twitterHandle}
            onChange={(e) => setTwitterHandle(e.target.value)}
            placeholder="@yourhandle"
            disabled={isLoading}
            className="bg-white/50 backdrop-blur-sm border-gray-200"
          />
        </div>

        {/* Telegram (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="telegram">Telegram Handle (Optional)</Label>
          <Input
            id="telegram"
            type="text"
            value={telegramHandle}
            onChange={(e) => setTelegramHandle(e.target.value)}
            placeholder="@yourhandle"
            disabled={isLoading}
            className="bg-white/50 backdrop-blur-sm border-gray-200"
          />
        </div>

        {/* Wallet Connect (Optional) */}
        <div className="space-y-2 border-t pt-6 mt-4">
          <Label>Connect Wallet (Optional)</Label>
           <p className="text-sm text-muted-foreground pb-2">
            Connect your Solana wallet to link it to your profile.
          </p>
          {/* Use the pre-built UI button */}
          <WalletMultiButton style={{ width: '100%', justifyContent: 'center' }} />
          {connected && publicKey && (
            <p className="text-xs text-green-600 pt-1">Wallet Connected: {publicKey.toBase58().substring(0, 4)}...{publicKey.toBase58().substring(publicKey.toBase58().length - 4)}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full glass-button mt-4"
          disabled={isLoading || !cardIdFromQuery} // Disable if loading or no card ID
        >
          {isLoading ? 'Creating Profile...' : 'Create Profile & Claim Card'}
        </Button>
      </form>
    </div>
  );
}; 