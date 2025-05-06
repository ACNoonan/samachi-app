import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Dashboard } from '@/app/components/home/Dashboard';
import DashboardLoading from './loading'; // Can be used by Dashboard or as a fallback
import { PageLayout } from '@/app/components/layout/PageLayout';

export default async function DashboardPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: import('@supabase/ssr').CookieOptions }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );

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