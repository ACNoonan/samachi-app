'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useSolana } from '@/app/context/SolanaContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';

export function AuthDebug() {
  const { session, user, profile, isLoading: authLoading } = useAuth();
  const { isWalletConnected, userState, loading: solanaLoading } = useSolana();

  return (
    <Card className="fixed top-20 right-4 w-96 bg-background/80 backdrop-blur-sm z-50">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span>Auth Status:</span>
            <Badge variant={session ? "default" : "destructive"}>
              {session ? "Signed In" : "Signed Out"}
            </Badge>
          </div>
          {session && (
            <>
              <div className="text-xs text-muted-foreground">
                User ID: {user?.id}
              </div>
              <div className="text-xs text-muted-foreground">
                Email: {user?.email}
              </div>
            </>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span>Wallet Status:</span>
            <Badge variant={isWalletConnected ? "default" : "destructive"}>
              {isWalletConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
          {isWalletConnected && userState && (
            <div className="text-xs text-muted-foreground">
              Staked Amount: {userState.stakedAmount.toString()}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span>Loading States:</span>
            <div className="space-x-2">
              <Badge variant={authLoading ? "secondary" : "outline"}>
                Auth: {authLoading ? "Loading" : "Ready"}
              </Badge>
              <Badge variant={solanaLoading ? "secondary" : "outline"}>
                Solana: {solanaLoading ? "Loading" : "Ready"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 