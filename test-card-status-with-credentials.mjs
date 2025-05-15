import http from 'http';
import url from 'url';
import { createClient } from '@supabase/supabase-js';

// Credentials directly in the file (for test purposes only)
const supabaseUrl = 'https://dawrwfmxqcpwbtaihjyu.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhd3J3Zm14cWNwd2J0YWloanl1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDI0MDk5OCwiZXhwIjoyMDU1ODE2OTk4fQ.TeYVWXpDutepUwB8jdnNATORF3uigQR0MlDCOZDr8yg';

// Initialize Supabase client
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