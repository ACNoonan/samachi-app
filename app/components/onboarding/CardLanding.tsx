// src/components/onboarding/CardLanding.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
// import useAuth from '@/hooks/useAuth'; // Remove old auth hook
import { useAuth } from '@/app/context/AuthContext'; // Use the refactored context

export const CardLanding = () => {
  const params = useParams();
  const router = useRouter();
  const card_id = params?.card_id as string | undefined;
  // Use the refactored hook - user is Supabase user, isLoading covers auth+profile
  const { user, isLoading: authLoading } = useAuth(); 

  // State for card status check
  const [cardStatus, setCardStatus] = useState<'loading' | 'unregistered' | 'registered' | 'not_found' | 'error'>('loading');
  const [cardError, setCardError] = useState<string | null>(null);

  useEffect(() => {
    // Determine if user is logged in based on the presence of user data
    const isLoggedIn = !!user;

    // Redirect logged-in users immediately
    if (!authLoading && isLoggedIn) {
      console.log('CardLanding: User is logged in, redirecting to /dashboard');
      router.replace('/dashboard');
      return; // Don't proceed if already logged in
    }

    // Fetch card status only if not logged in and card_id is present
    if (!authLoading && !isLoggedIn && card_id) {
      const checkCardStatus = async () => {
        setCardStatus('loading');
        setCardError(null);
        try {
          // Fetch card status using the API (expects user_id to be null for unregistered)
          const response = await fetch(`/api/card-status?card_id=${card_id}`);
          const data = await response.json();

          if (!response.ok) {
            console.error("Card status API error:", data);
            setCardError(data.error || 'Failed to check card status.');
            setCardStatus(response.status === 404 ? 'not_found' : 'error');
          } else {
            console.log("Card status API success:", data); // Log the raw API response
            // Determine registration based on the API response
            const isRegistered = data.isRegistered; // Assuming API returns { isRegistered: boolean }
            console.log(`[CardLanding] API says isRegistered: ${isRegistered}`); // Log the determination
            setCardStatus(isRegistered ? 'registered' : 'unregistered');
          }
        } catch (error) {
          console.error("Fetch card status error:", error);
          setCardError('An unexpected error occurred.');
          setCardStatus('error');
        }
      };
      checkCardStatus();
    }
    // Dependencies updated: removed user, authLoading, added isLoggedIn
  }, [authLoading, router, card_id, user]);

  const handleCreateProfile = () => {
    if (!card_id) return;
    const targetUrl = `/create-profile?cardId=${card_id}`;
    console.log(`[CardLanding] Navigating to Create Profile: ${targetUrl}`); // Log before navigating
    router.push(targetUrl);
  };

  const handleSignIn = () => {
    const targetUrl = `/login`;
    console.log(`[CardLanding] Navigating to Sign In: ${targetUrl}`); // Log before navigating
    router.push(targetUrl);
  };

  // Combined Loading State: Show loading if either auth or card status is loading
  if (authLoading || (!user && cardStatus === 'loading')) {
    // Display a simple loading indicator while checking auth or card status
    // Ensure this div takes up space and is visible (e.g., using min-h-screen or similar)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

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
      <h1 className="text-2xl font-bold mb-4">Welcome!</h1>
      <p className="mb-6 text-center">
        {/* Fixed visibility: Added text-black */}
        Membership Card ID: <span className="font-mono bg-gray-100 p-1 rounded text-black">{card_id}</span>
      </p>

      {cardStatus === 'unregistered' && (
        <>
          <p className="text-muted-foreground mb-6 text-center">
            This card is ready to be claimed. Create a profile to activate your membership.
          </p>
          <div className="space-y-4 w-full max-w-xs">
            {/* Changed button text and action */}
            <Button onClick={handleCreateProfile} className="w-full">
              Create Profile & Claim Card
            </Button>
            {/* Removed the Sign In button for unregistered cards in MVP */}
            {/* <Button onClick={handleSignIn} variant="outline" className="w-full">
              Already have an account? Sign In
            </Button> */}
          </div>
        </>
      )}

      {cardStatus === 'registered' && (
         <>
          <p className="text-muted-foreground mb-6 text-center">
            This card has already been claimed. Please sign in to access your membership.
          </p>
          <div className="space-y-4 w-full max-w-xs">
             {/* Sign In button navigates to /login */}
            <Button onClick={handleSignIn} className="w-full">
              Sign In
            </Button>
          </div>
        </>
      )}

       <p className="mt-4 text-xs text-gray-500">Need help? Contact support.</p>
    </div>
  );
};