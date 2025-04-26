'use client';

import { useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { WalletDashboard } from '@/app/components/wallet/WalletDashboard';
import DashboardLoading from './loading';
import { PageLayout } from '@/app/components/layout/PageLayout';

export default function DashboardPage() {
  const { user, profile, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      console.log('DashboardPage: No authenticated user found after loading. Forcing logout and redirect.');
      logout().catch(error => {
        console.error("DashboardPage: Error during forced logout:", error);
      });
    }
  }, [isLoading, user, logout]);

  if (isLoading) {
    return (
      <PageLayout>
        <DashboardLoading />
      </PageLayout>
    );
  }

  if (user) {
    return (
      <PageLayout>
        <WalletDashboard />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <DashboardLoading />
    </PageLayout>
  );
} 