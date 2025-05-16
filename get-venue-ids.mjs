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

async function getVenueIds() {
  try {
    const { data, error } = await supabase
      .from('venues')
      .select('id, name')
      .limit(5);
      
    if (error) {
      console.error('Supabase query error:', error);
      return;
    }
    
    console.log('Venue IDs:');
    data.forEach(venue => {
      console.log(`${venue.name}: ${venue.id}`);
    });

    // Output test data format
    console.log('\nTest data for venueIds:');
    console.log(`venueIds: ['${data[0]?.id || ''}', '${data[1]?.id || ''}', 'nonexistent-venue'],`);
  } catch (err) {
    console.error('Error:', err);
  }
}

getVenueIds(); 