import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { type Database } from '@/models/supabase-types/supabase';

export const createTestSupabaseClient = (useAnon: boolean = true): SupabaseClient<Database> => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error('Missing key value: NEXT_PUBLIC_SUPABASE_URL');

  const key = useAnon ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error(`Missing key value: ${useAnon ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY' : 'SUPABASE_SERVER_ROLE_KEY'}`);

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};