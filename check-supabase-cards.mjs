import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Get credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkCards() {
  try {
    console.log('Checking for cards in the Supabase database...');
    
    // Fetch cards from the membership_cards table (limit to 10)
    const { data, error } = await supabase
      .from('membership_cards')
      .select('*')
      .limit(10);
      
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log('No cards found in the database');
      process.exit(0);
    }
    
    console.log(`Found ${data.length} cards:`);
    data.forEach((card, index) => {
      console.log(`${index + 1}. Card ID: ${card.card_identifier}, Status: ${card.status}, User ID: ${card.user_id || 'Not registered'}`);
    });
    
  } catch (error) {
    console.error('Error checking cards:', error);
  }
}

// Run the function
checkCards(); 