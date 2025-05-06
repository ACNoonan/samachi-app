import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Dashboard } from '@/app/components/home/Dashboard';
import DashboardLoading from './loading'; // Can be used by Dashboard or as a fallback
import { PageLayout } from '@/app/components/layout/PageLayout';

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login'); // Or your preferred login page
  }

  // The Dashboard component will now be responsible for any client-side
  // logic that was previously in DashboardPage, including using useAuth if needed.
  // It should be a 'use client' component.
  return (
    <PageLayout>
      <Dashboard />
    </PageLayout>
  );
} 