'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';

export default function CardClaimErrorPage() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('message') || 'An unknown error occurred during card claiming.';
  const cardId = searchParams.get('card_id'); // Optional: if you want to show the card ID

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-red-600">Card Claiming Failed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-700 dark:text-gray-300">
            {errorMessage}
          </p>
          {cardId && (
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
              Attempted Card ID: <span className="font-mono bg-gray-200 dark:bg-gray-700 p-1 rounded">{cardId}</span>
            </p>
          )}
          <div className="flex flex-col space-y-2">
            {cardId ? (
                 <Button asChild variant="outline">
                    <Link href={`/card/${cardId}`}>Try Again</Link>
                </Button>
            ) : (
                <Button asChild variant="outline">
                    <Link href="/">Go to Homepage</Link>
                </Button>
            )}
            <Button asChild variant="default">
              <Link href="/login">Login to Existing Account</Link>
            </Button>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              If the problem persists, please contact support.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 