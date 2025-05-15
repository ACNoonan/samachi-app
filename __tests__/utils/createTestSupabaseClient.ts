import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { type Database } from '@/models/supabase-types/supabase';

export const createTestSupabaseClient = (): SupabaseClient<Database> => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};