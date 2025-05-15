import { cookies, headers } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { type Database } from '@/models/supabase-types/supabase'; // optional: if you’re using typed DB

export const createServerSupabaseClient = () => {
  console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
  return createServerComponentClient<Database>({
    cookies,
  });
};