import { createClient } from '@supabase/supabase-js';
import http from 'http';
import url from 'url';
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

// Test data
const testData = {
  // Known existing IDs from database
  cardIds: ['TESTU0001', 'MNCA0001', 'NONEXISTENT'],
  // Add more test data for other routes as needed
};

// Route implementations
const routes = {
  // Card Status route
  '/api/card-status': async (req, res, query) => {
    const cardIdentifier = query.card_id;
    
    if (!cardIdentifier) {
      res.statusCode = 400;
      return { error: 'Card ID is required' };
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
        return { error: 'Error checking card status', details: error.message };
      }
      
      if (!data) {
        console.log(`Card identifier ${cardIdentifier} not found.`);
        res.statusCode = 404;
        return { error: 'Card not found' };
      }
      
      // Determine registration status based on whether user_id is set
      const isRegistered = !!data.user_id;
      const status = isRegistered ? 'registered' : 'unregistered';
      
      console.log(`Card ${cardIdentifier} status: ${status} (User ID: ${data.user_id})`);
      
      return {
        cardId: cardIdentifier,
        status: status,
        isRegistered: isRegistered
      };
    } catch (err) {
      console.error('Error:', err);
      res.statusCode = 500;
      return { error: 'Internal server error' };
    }
  },
  
  // Add more route implementations as needed
  '/api/venues': async (req, res, query) => {
    try {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .limit(5);
        
      if (error) {
        console.error('Supabase query error:', error);
        res.statusCode = 500;
        return { error: 'Error fetching venues', details: error.message };
      }
      
      return { venues: data || [] };
    } catch (err) {
      console.error('Error:', err);
      res.statusCode = 500;
      return { error: 'Internal server error' };
    }
  },
  
  // Example route for memberships
  '/api/memberships': async (req, res, query) => {
    const userId = query.user_id;
    
    if (!userId) {
      res.statusCode = 400;
      return { error: 'User ID is required' };
    }
    
    try {
      const { data, error } = await supabase
        .from('membership_cards')
        .select('*')
        .eq('user_id', userId);
        
      if (error) {
        console.error('Supabase query error:', error);
        res.statusCode = 500;
        return { error: 'Error fetching memberships', details: error.message };
      }
      
      return { memberships: data || [] };
    } catch (err) {
      console.error('Error:', err);
      res.statusCode = 500;
      return { error: 'Internal server error' };
    }
  }
};

// Create test server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;
  
  // Set headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Check if we have a handler for this route
  if (routes[pathname]) {
    try {
      const data = await routes[pathname](req, res, query);
      res.end(JSON.stringify(data));
    } catch (error) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Server error', details: error.message }));
    }
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
});

// Start server
const PORT = 3333;
server.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log('\nAvailable test routes:');
  Object.keys(routes).forEach(route => {
    console.log(`- ${route}`);
  });
  
  // Run automated tests
  runTests();
});

// Test runner
async function runTests() {
  console.log('\n=== Starting Automated Tests ===');
  
  // Test card-status endpoint
  await testCardStatus();
  
  // Test venues endpoint
  await testVenues();
  
  // Add more test functions as needed
  
  console.log('\n=== All Tests Completed ===');
}

// Test functions
async function testCardStatus() {
  console.log('\n--- Testing /api/card-status ---');
  
  // Test with registered card
  await testEndpoint('/api/card-status?card_id=TESTU0001', 'Registered card');
  
  // Test with unregistered card
  await testEndpoint('/api/card-status?card_id=MNCA0001', 'Unregistered card');
  
  // Test with nonexistent card
  await testEndpoint('/api/card-status?card_id=NONEXISTENT', 'Nonexistent card');
  
  // Test with missing card ID
  await testEndpoint('/api/card-status', 'Missing card ID');
}

async function testVenues() {
  console.log('\n--- Testing /api/venues ---');
  await testEndpoint('/api/venues', 'Venues list');
}

// Helper function to test an endpoint
async function testEndpoint(path, description) {
  try {
    console.log(`Testing: ${description}`);
    const response = await fetch(`http://localhost:${PORT}${path}`);
    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log('Response:', data);
    console.log(`✅ Test passed: ${description}`);
  } catch (error) {
    console.error(`❌ Test failed: ${description}`);
    console.error(error);
  }
} 