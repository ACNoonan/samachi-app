import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables are present
if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: Required environment variables are missing.');
  console.error('Make sure .env.local file exists with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function listTables() {
  try {
    // Query for table names
    const { data, error } = await supabase
      .rpc('list_tables');
      
    if (error) {
      console.error('Error listing tables:', error);
      
      // Try an alternative approach
      console.log('Trying to query specific tables instead...');
      
      // Check for some common tables
      const tables = ['venues', 'membership_cards', 'auth.users', 'members', 'profiles', 'users'];
      
      for (const table of tables) {
        try {
          console.log(`Checking table: ${table}`);
          const { count, error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });
          
          if (!error) {
            console.log(`✅ Table ${table} exists with ${count} rows`);
          } else {
            console.log(`❌ Table ${table} error:`, error.message);
          }
        } catch (err) {
          console.log(`❌ Error checking ${table}:`, err.message);
        }
      }
      
      return;
    }
    
    console.log('Available tables:');
    data.forEach(table => {
      console.log(`- ${table}`);
    });
  } catch (err) {
    console.error('Error:', err);
  }
}

listTables(); 