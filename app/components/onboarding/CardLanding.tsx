// src/components/onboarding/CardLanding.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
// import useAuth from '@/hooks/useAuth'; // Remove old auth hook
import { useAuth } from '@/app/context/AuthContext'; // Use the refactored context
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/app/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form';
import { toast } from 'sonner';

// Schema for the OTP registration form
const otpFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

// New schema for the login OTP form (identical for now, but semantically different)
const otpLoginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }), 
});

type OtpFormValues = z.infer<typeof otpFormSchema>;
type OtpLoginFormValues = z.infer<typeof otpLoginFormSchema>;

export const CardLanding = () => {
  const params = useParams();
  const router = useRouter();
  const card_id = params?.card_id as string | undefined;
  const { user, isLoading: authLoading, session } = useAuth(); // Added session for logging

  console.log('[CardLanding] Component Render:', { card_id, authLoading, userExists: !!user, sessionExists: !!session });

  // State for card status check
  const [cardStatus, setCardStatus] = useState<'initial' | 'loading' | 'unregistered' | 'registered' | 'not_found' | 'error'>('initial'); // Changed initial state
  const [cardError, setCardError] = useState<string | null>(null);
  const [isCheckingCardStatus, setIsCheckingCardStatus] = useState(false); // New state to prevent re-entry
  
  // State for OTP form submission
  const [isOtpSubmitting, setIsOtpSubmitting] = useState(false);
  const [otpMessage, setOtpMessage] = useState<string | null>(null);
  const [isOtpLoginSubmitting, setIsOtpLoginSubmitting] = useState(false);
  const [otpLoginMessage, setOtpLoginMessage] = useState<string | null>(null);

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const loginForm = useForm<OtpLoginFormValues>({
    resolver: zodResolver(otpLoginFormSchema),
    defaultValues: {
      email: '',
    },
  });

  useEffect(() => {
    console.log('[CardLanding] useEffect - Current authLoading state:', authLoading, 'User:', user, 'Session:', session);

    console.log('[CardLanding] useEffect triggered:', { card_id, authLoading, userExists: !!user, cardStatus, isCheckingCardStatus });
    const isLoggedIn = !!user;

    if (authLoading) {
      console.log('[CardLanding] useEffect: authLoading is true, returning.');
      return; 
    }
    
    // If user is logged in, and we are on this page, they should be redirected by middleware
    // or this page should show a message indicating they are logged in.
    // For now, we assume middleware handles redirection if necessary.
    // If user is logged in, we don't need to check card status here for registration/initial claim.
    if (isLoggedIn) {
      console.log('[CardLanding] useEffect: User is logged in. No card status check needed for registration flow.');
      // Potentially set cardStatus to 'idle' or some other state if user is logged in
      // For example, if this page might be revisited by a logged-in user for other reasons.
      // However, for a pure registration/claim page, this useEffect might not even run its main logic for logged-in users.
      // Let's assume for now that if a user IS logged in, this page's primary purpose (register/claim card) is bypassed.
      setCardStatus('initial'); // Or an appropriate state like 'user_logged_in'
      return;
    }

    // Only proceed if not logged in, auth is loaded, and card_id is present
    if (card_id && !isCheckingCardStatus && cardStatus !== 'registered' && cardStatus !== 'unregistered') { // Added more conditions
      console.log('[CardLanding] useEffect: Conditions met to check card status.');
      const checkCardStatus = async () => {
        console.log('[CardLanding] checkCardStatus: Called.', { card_id });
        setIsCheckingCardStatus(true); // Prevent re-entry
        setCardStatus('loading');     // Set to loading
        setCardError(null);
        setOtpMessage(null);
        try {
          console.log(`[CardLanding] checkCardStatus: Fetching /api/card-status?card_id=${card_id}`);
          const response = await fetch(`/api/card-status?card_id=${card_id}`);
          console.log('[CardLanding] checkCardStatus: Fetch response received.', { status: response.status, ok: response.ok });
          
          const responseCloneForText = response.clone();
          const responseText = await responseCloneForText.text();
          console.log('[CardLanding] checkCardStatus: API Response Text:', responseText);

          if (!response.ok) { // Check response.ok first
            const errorData = responseText ? JSON.parse(responseText) : { error: 'Failed to check card status. No error detail.' };
            console.error("[CardLanding] checkCardStatus: Card status API error:", errorData);
            setCardError(errorData.error || `API Error: ${response.status}`);
            setCardStatus(response.status === 404 ? 'not_found' : 'error');
          } else {
            const data = JSON.parse(responseText); // Parse from the text we already have
            console.log('[CardLanding] checkCardStatus: API Response JSON Parsed:', data);
            const isRegistered = data.isRegistered;
            console.log(`[CardLanding] checkCardStatus: API says isRegistered: ${isRegistered}`);
            setCardStatus(isRegistered ? 'registered' : 'unregistered');
          }
        } catch (error) {
          console.error("[CardLanding] checkCardStatus: Fetch card status error caught:", error);
          setCardError('An unexpected error occurred while checking card status.');
          setCardStatus('error');
        } finally {
          setIsCheckingCardStatus(false); // Allow re-entry if dependencies change later
          console.log('[CardLanding] checkCardStatus: Finished.');
        }
      };
      checkCardStatus();
    } else if (!card_id) {
      console.log('[CardLanding] useEffect: No card_id present.');
      setCardStatus('not_found');
      setCardError('No card identifier found in the URL.');
    } else if (isCheckingCardStatus) {
        console.log('[CardLanding] useEffect: Already checking card status.');
    } else {
        console.log('[CardLanding] useEffect: Conditions not met or status already final, card status:', cardStatus);
    }
  }, [authLoading, card_id, user, session, isCheckingCardStatus, cardStatus]); // Added session to dependency array because it's used in the new log

  const handleOtpFormSubmit = async (values: OtpFormValues) => {
    if (!card_id) {
      toast.error("Card ID is missing. Cannot proceed.");
      return;
    }
    setIsOtpSubmitting(true);
    setOtpMessage(null);

    try {
      const response = await fetch('/api/auth/otp/register-and-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.email,
          cardIdentifier: card_id, 
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || 'Failed to send OTP for registration. Please try again.');
      } else {
        toast.success(result.message || 'OTP sent successfully! Check your email to complete registration.');
        setOtpMessage(result.message || 'OTP sent successfully! Please check your email to complete registration.');
        form.reset(); 
      }
    } catch (error) {
      console.error('OTP registration submission error:', error);
      toast.error('An unexpected error occurred while sending OTP for registration.');
    }
    setIsOtpSubmitting(false);
  };

  const handleOtpLoginFormSubmit = async (values: OtpLoginFormValues) => {
    if (!card_id) {
      toast.error("Card ID is missing. Cannot proceed.");
      return;
    }
    setIsOtpLoginSubmitting(true);
    setOtpLoginMessage(null);

    try {
      // We reuse the same endpoint. Supabase signInWithOtp with shouldCreateUser: true 
      // will sign in an existing user or create one if they don't exist.
      // The callback will then verify if the logged-in user matches the card owner.
      const response = await fetch('/api/auth/otp/register-and-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.email,
          cardIdentifier: card_id, // card_id is still useful for the callback to know context
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || 'Failed to send OTP for login. Please try again.');
      } else {
        toast.success(result.message || 'OTP sent successfully! Check your email to sign in.');
        setOtpLoginMessage(result.message || 'OTP sent successfully! Check your email to sign in.');
        loginForm.reset();
      }
    } catch (error) {
      console.error('OTP login submission error:', error);
      toast.error('An unexpected error occurred while sending OTP for login.');
    }
    setIsOtpLoginSubmitting(false);
  };

  console.log('[CardLanding] Before render return:', { authLoading, userExists: !!user, cardStatus });
  if (authLoading || (cardStatus === 'initial' || cardStatus === 'loading')) {
    console.log('[CardLanding] Rendering LOADING screen.');
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }
  console.log('[CardLanding] Rendering main content or error for cardStatus:', cardStatus);

  // At this point, auth is loaded (authLoading is false) and user is null (not logged in)

  // Handle card check results before showing buttons
  if (cardStatus === 'not_found') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Invalid Card</h1>
        {/* Fixed visibility: Added text-black */}
        <p className="mb-6 text-center">Membership card ID (<span className="font-mono bg-gray-100 p-1 rounded text-black">{card_id}</span>) was not found.</p>
        <p className="text-xs text-gray-500">Please check the ID or contact support.</p>
      </div>
    );
  }

  if (cardStatus === 'error') {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
        <p className="mb-6 text-center">{cardError || 'Could not verify card status.'}</p>
        <p className="text-xs text-gray-500">Please try again later or contact support.</p>
      </div>
    );
  }

  // --- Render based on card status ---
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to Samachi!</h1>
      <p className="mb-6 text-center text-muted-foreground">
        Card ID: <span className="font-mono bg-gray-200 dark:bg-gray-700 p-1 rounded">{card_id}</span>
      </p>

      {cardStatus === 'unregistered' && (
        <div className="w-full max-w-sm space-y-6">
          {!otpMessage ? (
            <>
              <p className="text-center text-muted-foreground">
                This card is unregistered. Create your profile by entering your email below.
              </p>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleOtpFormSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isOtpSubmitting}>
                    {isOtpSubmitting ? 'Sending OTP...' : 'Send OTP & Register'}
                  </Button>
                </form>
              </Form>
            </>
          ) : (
            <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-md">
              <p className="text-green-700 dark:text-green-300">{otpMessage}</p>
              <p className="text-sm text-muted-foreground mt-2">Please follow the instructions in your email to complete registration.</p>
            </div>
          )}
        </div>
      )}

      {cardStatus === 'registered' && (
         <div className="w-full max-w-sm space-y-6">
          {!otpLoginMessage ? (
            <>
              <p className="text-muted-foreground mb-6 text-center">
                This card has already been claimed. Please sign in with OTP to access your membership.
              </p>
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleOtpLoginFormSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your.claimed@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isOtpLoginSubmitting}>
                    {isOtpLoginSubmitting ? 'Sending OTP...' : 'Sign In with OTP'}
                  </Button>
                </form>
              </Form>
            </>
          ) : (
            <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-md">
              <p className="text-green-700 dark:text-green-300">{otpLoginMessage}</p>
              <p className="text-sm text-muted-foreground mt-2">Please follow the instructions in your email to complete sign in.</p>
            </div>
          )}
        </div>
      )}

       <p className="mt-8 text-xs text-gray-500">Need help? Contact support.</p>
    </div>
  );
};