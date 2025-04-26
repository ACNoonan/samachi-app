'use client';

import { useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Dashboard } from '@/app/components/home/Dashboard';
import DashboardLoading from './loading';
import { PageLayout } from '@/app/components/layout/PageLayout';

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();

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
        <Dashboard />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <DashboardLoading />
    </PageLayout>
  );
} 