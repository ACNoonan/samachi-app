import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | undefined;

// Define a function to get a singleton Supabase client for client-side operations
export function getSupabaseBrowserClient() {
  if (client) {
    return client;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // TEMPORARY DEBUG LOGS (can be removed later)
  console.log('[SupabaseClient] Initializing new client instance with URL:', supabaseUrl);
  console.log('[SupabaseClient] Anon Key is present for new instance:', !!supabaseAnonKey);

  if (!supabaseUrl || supabaseUrl.trim() === '') {
    throw new Error('Missing or empty env.NEXT_PUBLIC_SUPABASE_URL');
  }
  if (!supabaseAnonKey || supabaseAnonKey.trim() === '') {
    throw new Error('Missing or empty env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  client = createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  );
  return client;
} 