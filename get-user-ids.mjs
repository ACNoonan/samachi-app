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

async function getUserIds() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email')
      .limit(5);
      
    if (error) {
      console.error('Supabase query error:', error);
      return;
    }
    
    console.log('User IDs:');
    data.forEach(user => {
      console.log(`${user.email || 'No email'}: ${user.id}`);
    });

    // Output test data format
    console.log('\nTest data for userIds:');
    console.log(`userIds: ['${data[0]?.id || ''}', '00000000-0000-0000-0000-000000000000'],`);
  } catch (err) {
    console.error('Error:', err);
  }
}

getUserIds(); 