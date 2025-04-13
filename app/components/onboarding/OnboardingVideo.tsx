// samachi/frontend/samachi-vip-access/src/components/onboarding/OnboardingVideo.tsx
'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import useAuth from "@/hooks/useAuth";

export const OnboardingVideo = () => {
  // const navigate = useNavigate();
  const router = useRouter();
  // Assuming useAuth hook provides a way to mark onboarding as complete,
  // or you handle this state update elsewhere after navigation.
  // const { markOnboardingComplete } = useAuth();

  const handleContinue = async () => {
    // TODO: Add API call to mark onboarding as complete for the user if needed
    // if (markOnboardingComplete) {
    //   await markOnboardingComplete();
    // }
    console.log("Onboarding video watched, navigating to dashboard.");
    router.push("/dashboard"); // Navigate to the main dashboard
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome to Samachi!</h1>
        <p className="mb-6 text-gray-600">Watch this short video to get started.</p>

        <div className="w-full aspect-video bg-gray-200 border-4 border-gray-300 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
          {/* TODO: Embed actual video player (e.g., YouTube iframe, Vimeo, custom player) */}
          <span className="text-gray-500 font-medium p-4 text-center">
            Onboarding video placeholder
          </span>
        </div>

        <Button onClick={handleContinue} className="w-full py-3 text-lg font-semibold">
          Continue to App
        </Button>
      </div>
    </div>
  );
};