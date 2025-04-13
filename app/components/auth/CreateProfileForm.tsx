'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { toast } from 'sonner';
import { useSimpleAuth } from '@/app/context/AuthContext';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form';

// 1. Define Zod Schema
const profileFormSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters.' })
                  .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  twitterHandle: z.string().optional().or(z.literal('')), // Optional, allow empty string
  telegramHandle: z.string().optional().or(z.literal('')), // Optional, allow empty string
  // Note: cardId and walletAddress are not direct form fields managed by RHF here
});

export const CreateProfileForm: React.FC = () => {
  console.log("[CreateProfileForm] Component rendering start.");

  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useSimpleAuth();
  const { publicKey, connected } = useWallet();

  const cardIdFromQuery = searchParams.get('cardId');

  // 2. Initialize react-hook-form
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: '',
      password: '',
      twitterHandle: '',
      telegramHandle: '',
    },
  });

  useEffect(() => {
    if (!cardIdFromQuery) {
      toast.error('Missing membership card ID. Please go back and scan the card again.');
      // Consider disabling form or redirecting earlier
      // router.replace('/');
    } else {
        console.log('Create Profile page loaded for card:', cardIdFromQuery);
    }
  }, [cardIdFromQuery, router]);

  // 3. Define onSubmit handler using form data
  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    if (!cardIdFromQuery) {
      toast.error('Cannot create profile without a card ID.');
      return;
    }

    console.log('Submitting profile creation:', { ...values, cardIdFromQuery, publicKey: publicKey?.toBase58() });

    try {
      const response = await fetch('/api/create-profile-and-claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
          twitterHandle: values.twitterHandle || null,
          telegramHandle: values.telegramHandle || null,
          walletAddress: publicKey?.toBase58() || null, // Get current wallet state on submit
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
    }
    // isSubmitting is handled by react-hook-form
  }

  return (
    <div className="flex flex-col min-h-screen p-6">
       <button
        onClick={() => router.back()} // Simple back navigation
        className="self-start mb-8 p-2 rounded-full hover:bg-black/5 transition-colors"
        aria-label="Go back"
        disabled={form.formState.isSubmitting}
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Create Your Profile</h1>
        <p className="text-muted-foreground">
            Claiming Membership Card: <span className="font-mono text-sm bg-gray-100 p-1 rounded text-black">{cardIdFromQuery || 'N/A'}</span>
        </p>
      </div>

      {/* 4. Use Form component */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input
                    placeholder="your_username"
                    className="bg-white/50 backdrop-blur-sm border-gray-200"
                    disabled={form.formState.isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="bg-white/50 backdrop-blur-sm border-gray-200"
                    disabled={form.formState.isSubmitting}
                    {...field}
                  />
                </FormControl>
                 {/* Add password requirements hint if needed - could use FormDescription */}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Twitter (Optional) */}
           <FormField
            control={form.control}
            name="twitterHandle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>X / Twitter Handle (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="@yourhandle"
                    className="bg-white/50 backdrop-blur-sm border-gray-200"
                    disabled={form.formState.isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Telegram (Optional) */}
          <FormField
            control={form.control}
            name="telegramHandle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telegram Handle (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="@yourhandle"
                    className="bg-white/50 backdrop-blur-sm border-gray-200"
                    disabled={form.formState.isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Wallet Connect (Optional) - Stays outside RHF as it's not a direct form input */}
          <div className="space-y-2 border-t pt-6 mt-4">
            <FormLabel>Connect Wallet (Optional)</FormLabel>
             <p className="text-sm text-muted-foreground pb-2">
              Connect your Solana wallet to link it to your profile.
            </p>
            <WalletMultiButton style={{ width: '100%', justifyContent: 'center' }} disabled={form.formState.isSubmitting} />
            {connected && publicKey && (
              <p className="text-xs text-green-600 pt-1">Wallet Connected: {publicKey.toBase58().substring(0, 4)}...{publicKey.toBase58().substring(publicKey.toBase58().length - 4)}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full glass-button mt-4"
            disabled={form.formState.isSubmitting || !cardIdFromQuery} // Disable if loading or no card ID
          >
            {form.formState.isSubmitting ? 'Creating Profile...' : 'Create Profile & Claim Card'}
          </Button>
        </form>
      </Form>
    </div>
  );
}; 