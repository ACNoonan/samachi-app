'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';

export const SignIn: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isWalletConnecting, setIsWalletConnecting] = useState(false);
  
  const isSignUpMode = pathname === '/register';
  const cardIdFromQuery = searchParams.get('cardId');
  const showWalletConnect = isSignUpMode && !!cardIdFromQuery;

  const pageTitle = isSignUpMode ? 'Create Account' : 'Sign In';
  const buttonText = isSignUpMode ? 'Sign Up' : 'Sign In';
  const buttonActionText = showWalletConnect ? 'Connect Wallet & Claim Card' : (isSignUpMode ? 'Sign Up with Email' : 'Sign In');

  const { publicKey, connect, connecting, connected, select, wallet } = useWallet();

  useEffect(() => {
    if (isSignUpMode && cardIdFromQuery) {
      console.log('Registration page loaded for claiming card:', cardIdFromQuery);
    }
  }, [isSignUpMode, cardIdFromQuery]);

  useEffect(() => {
    if (showWalletConnect && connected && publicKey && cardIdFromQuery) {
      console.log('Wallet connected with public key:', publicKey.toBase58());
      setIsWalletConnecting(false);
      setIsLoading(true);

      const registerWallet = async () => {
        try {
          const response = await fetch('/api/register-wallet', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              walletAddress: publicKey.toBase58(),
              cardId: cardIdFromQuery,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Failed to register wallet and claim card.');
          }

          toast.success(data.message || 'Wallet connected and card claimed successfully!');
          router.push('/dashboard');
        } catch (error: any) {
          console.error('Wallet registration API error:', error);
          toast.error(error.message || 'An error occurred during wallet registration.');
        } finally {
          setIsLoading(false);
        }
      };
      registerWallet();
    }
  }, [connected, publicKey, cardIdFromQuery, router, showWalletConnect]);

  const handleConnectWallet = useCallback(async () => {
    if (connecting || connected) return;
    setIsWalletConnecting(true);
    try {
      if (!wallet) {
        select(null);
      } else {
        await connect();
      }
    } catch (error: any) {
      console.error("Wallet connect error:", error);
      toast.error(error.message || 'Could not connect wallet. Please try again.');
      setIsWalletConnecting(false);
    }
  }, [connect, connecting, connected, wallet, select]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUpMode) {
        if (showWalletConnect) {
            console.warn("Email form submitted unexpectedly in wallet connect mode.");
            toast.warning("Please connect your wallet to claim the card.");
            setIsLoading(false);
            return;
        }

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          throw signUpError;
        }

        if (signUpData.user && cardIdFromQuery) {
            console.log(`User ${signUpData.user.id} signed up. Attempting to link card ${cardIdFromQuery} directly.`);

            const { data: updateData, error: updateError } = await supabase
              .from('membership_cards')
              .update({ user_id: signUpData.user.id, status: 'registered' })
              .eq('card_identifier', cardIdFromQuery)
              .is('user_id', null)
              .select()
              .single();

            if (updateError) {
              console.error('Error linking card:', updateError);
              console.error('Detailed error linking card:', JSON.stringify(updateError, null, 2));
              if (updateError.message.includes('violates row-level security policy')) {
                 toast.error('Account created, but failed to link card due to permissions. Please contact support.');
              } else if (updateError.code === '23505') {
                 toast.warning('Account created, but this card might already be claimed.');
              } else {
                 toast.error('Account created, but failed to link membership card. Please contact support.');
              }
            } else if (!updateData) {
               console.warn(`Card ${cardIdFromQuery} not found or already claimed during EMAIL signup link (no data returned).`);
               toast.warning('Account created, but this card may already be claimed or was not found.');
            } else {
               console.log(`Card ${cardIdFromQuery} successfully linked to user ${signUpData.user.id}`);
               toast.success('Account created and card claimed! Check email for confirmation.');
               router.push('/dashboard');
            }

            const { data: { session: currentSession } } = await supabase.auth.getSession();
            if (!currentSession?.user?.email_confirmed_at && signUpData.user?.email_confirmed_at === null) {
               toast.info('Please check your email to confirm your account.');
            }

        } else if (signUpData.user) {
            toast.success('Account created! Check email for confirmation.');
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            if (!currentSession?.user?.email_confirmed_at && signUpData.user?.email_confirmed_at === null) {
                toast.info('Please check your email to confirm your account.');
             }
            router.push('/dashboard');
        } else {
            console.warn("SignUp completed without error but no user data returned.");
            toast.warning("Account creation initiated. Please check your email.");
        }

      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          throw signInError;
        }
        
        toast.success('Signed in successfully!');
        router.push('/dashboard'); 
      }

    } catch (error: any) {
      console.error('Authentication error:', error);
      toast.error(error.error_description || error.message || 'An authentication error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen p-6">
      <button 
        onClick={() => router.back()}
        className="self-start mb-8 p-2 rounded-full hover:bg-black/5 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      <div className="mb-10 animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">{pageTitle}</h1>
        <p className="text-muted-foreground">Access your Samachi membership</p>
      </div>

      {showWalletConnect ? (
        <div className="space-y-6 animate-fade-in">
          <p className="text-center text-muted-foreground">
             To claim your membership card <span className="font-mono bg-gray-100 p-1 rounded text-sm">{cardIdFromQuery}</span>, please connect your Solana wallet.
          </p>
          <Button 
            onClick={handleConnectWallet}
            className="w-full glass-button"
            disabled={isWalletConnecting || connecting || isLoading}
          >
            {isWalletConnecting || connecting ? 'Connecting...' : (isLoading ? 'Processing...' : buttonActionText)}
          </Button>
          <p className="text-center text-sm">
            Already have an account linked to this card? <Link href={`/login?cardId=${cardIdFromQuery}`} className="text-primary font-medium hover:underline">Sign In</Link>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="you@example.com"
              required
              disabled={isLoading}
              className="bg-white/50 backdrop-blur-sm border-gray-200"
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                required
                disabled={isLoading}
                className="bg-white/50 backdrop-blur-sm border-gray-200 pr-10"
                autoComplete={isSignUpMode ? "new-password" : "current-password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <Button 
            type="submit"
            className="w-full glass-button"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (isSignUpMode ? 'Sign Up with Email' : 'Sign In')}
          </Button>

          <p className="text-center text-sm">
            {isSignUpMode ? (
              <>Already have an account? <Link href={`/login${cardIdFromQuery ? `?cardId=${cardIdFromQuery}` : ''}`} className="text-primary font-medium hover:underline">Sign In</Link></>
            ) : (
              <>Don't have an account? <Link href={`/register${cardIdFromQuery ? `?cardId=${cardIdFromQuery}` : ''}`} className="text-primary font-medium hover:underline">Sign Up</Link></>
            )}
          </p>
        </form>
      )}
    </div>
  );
};
