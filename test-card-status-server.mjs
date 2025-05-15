import http from 'http';
import url from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Supabase client for testing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables in .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Create a server to simulate the API route
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  // Only handle GET requests to our test endpoint
  if (req.method === 'GET' && parsedUrl.pathname === '/api/card-status') {
    const cardIdentifier = parsedUrl.query.card_id;
    
    // Set CORS headers to allow testing
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    if (!cardIdentifier) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Card ID is required' }));
      return;
    }
    
    console.log(`Checking status for card identifier: ${cardIdentifier}`);
    
    try {
      // Query the membership_cards table
      const { data, error } = await supabase
        .from('membership_cards')
        .select('status, user_id')
        .eq('card_identifier', cardIdentifier)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error('Supabase query error:', error);
        res.statusCode = 500;
        res.end(JSON.stringify({ 
          error: 'Error checking card status', 
          details: error.message 
        }));
        return;
      }
      
      if (!data) {
        console.log(`Card identifier ${cardIdentifier} not found.`);
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Card not found' }));
        return;
      }
      
      // Determine registration status based on whether user_id is set
      const isRegistered = !!data.user_id;
      const status = isRegistered ? 'registered' : 'unregistered';
      
      console.log(`Card ${cardIdentifier} status: ${status} (User ID: ${data.user_id})`);
      
      res.statusCode = 200;
      res.end(JSON.stringify({
        cardId: cardIdentifier,
        status: status,
        isRegistered: isRegistered
      }));
      
    } catch (err) {
      console.error('Error:', err);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

// Start the server
const PORT = 3333;
server.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}`);
  console.log(`Test the card-status endpoint with: http://localhost:${PORT}/api/card-status?card_id=YOUR_TEST_ID`);
}); 