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
  venueIds: ['1', '2', 'nonexistent-venue'],
  userIds: ['someUserId', 'nonexistent-user'], // Replace with actual test user IDs
  orgIds: ['1', 'nonexistent-org'], // Replace with actual test org IDs
  // Add more test data as needed
};

// Route implementations
const routes = {
  // Venue routes
  '/api/venue': async (req, res, query) => {
    try {
      const { data, error } = await supabase
        .from('venues')
        .select('*');
        
      if (error) {
        console.error('Supabase query error:', error);
        res.statusCode = 500;
        return { error: 'Error fetching venues', details: error.message };
      }
      
      return data || [];
    } catch (err) {
      console.error('Error:', err);
      res.statusCode = 500;
      return { error: 'Internal server error' };
    }
  },
  
  // Venue by ID route
  '/api/venue/:venueId': async (req, res, params) => {
    const venueId = params.venueId;
    
    if (!venueId) {
      res.statusCode = 400;
      return { error: 'Venue ID is required' };
    }
    
    try {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('id', venueId)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') {
          res.statusCode = 404;
          return { error: 'Venue not found' };
        }
        
        console.error('Supabase query error:', error);
        res.statusCode = 500;
        return { error: 'Error fetching venue', details: error.message };
      }
      
      return data;
    } catch (err) {
      console.error('Error:', err);
      res.statusCode = 500;
      return { error: 'Internal server error' };
    }
  },
  
  // User Account route
  '/api/user-account': async (req, res, query) => {
    const userId = query.user_id;
    
    if (!userId) {
      res.statusCode = 400;
      return { error: 'User ID is required' };
    }
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') {
          res.statusCode = 404;
          return { error: 'User not found' };
        }
        
        console.error('Supabase query error:', error);
        res.statusCode = 500;
        return { error: 'Error fetching user', details: error.message };
      }
      
      return data;
    } catch (err) {
      console.error('Error:', err);
      res.statusCode = 500;
      return { error: 'Internal server error' };
    }
  },
  
  // Checkin route
  '/api/checkin/:orgId': async (req, res, params, body) => {
    const orgId = params.orgId;
    const { userId, venueId } = body || {};
    
    if (!orgId) {
      res.statusCode = 400;
      return { error: 'Organization ID is required' };
    }
    
    if (!userId || !venueId) {
      res.statusCode = 400;
      return { error: 'User ID and Venue ID are required' };
    }
    
    try {
      // In a real implementation, this would create a checkin record
      // For testing, we'll just return success
      return {
        success: true,
        checkinId: 'test-checkin-id',
        timestamp: new Date().toISOString(),
        orgId,
        userId,
        venueId
      };
    } catch (err) {
      console.error('Error:', err);
      res.statusCode = 500;
      return { error: 'Internal server error' };
    }
  },
  
  // Register route
  '/api/register/:orgId': async (req, res, params, body) => {
    const orgId = params.orgId;
    const { userId, cardId } = body || {};
    
    if (!orgId) {
      res.statusCode = 400;
      return { error: 'Organization ID is required' };
    }
    
    if (!userId || !cardId) {
      res.statusCode = 400;
      return { error: 'User ID and Card ID are required' };
    }
    
    try {
      // In a real implementation, this would register a card to a user
      // For testing, we'll just return success
      return {
        success: true,
        registrationId: 'test-registration-id',
        timestamp: new Date().toISOString(),
        orgId,
        userId,
        cardId
      };
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
  let pathname = parsedUrl.pathname;
  const query = parsedUrl.query;
  
  // Set headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }
  
  // Read request body for POST/PUT requests
  let body = null;
  if (req.method === 'POST' || req.method === 'PUT') {
    body = await new Promise((resolve) => {
      let data = '';
      req.on('data', (chunk) => {
        data += chunk;
      });
      req.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({});
        }
      });
    });
  }
  
  // Parse dynamic route parameters
  const params = {};
  const routeKeys = Object.keys(routes);
  
  // Check for route matches with dynamic parameters
  let matchedRoute = null;
  
  for (const route of routeKeys) {
    if (route.includes(':')) {
      const routeParts = route.split('/');
      const pathParts = pathname.split('/');
      
      if (routeParts.length === pathParts.length) {
        let isMatch = true;
        
        for (let i = 0; i < routeParts.length; i++) {
          if (routeParts[i].startsWith(':')) {
            // Extract parameter
            const paramName = routeParts[i].substring(1);
            params[paramName] = pathParts[i];
          } else if (routeParts[i] !== pathParts[i]) {
            isMatch = false;
            break;
          }
        }
        
        if (isMatch) {
          matchedRoute = route;
          break;
        }
      }
    } else if (route === pathname) {
      matchedRoute = route;
      break;
    }
  }
  
  // Handle the route
  try {
    if (matchedRoute) {
      const data = await routes[matchedRoute](req, res, params, body, query);
      res.end(JSON.stringify(data));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'Route not found' }));
    }
  } catch (error) {
    console.error('Server error:', error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Server error', details: error.message }));
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
  
  // Test venue routes
  await testVenues();
  
  // Test venue by ID routes
  await testVenueById();
  
  // Test user account routes
  await testUserAccount();
  
  // Test checkin routes
  await testCheckin();
  
  // Test register routes
  await testRegister();
  
  console.log('\n=== All Tests Completed ===');
}

// Test functions
async function testVenues() {
  console.log('\n--- Testing /api/venue ---');
  await testEndpoint('/api/venue', 'GET', 'Venues list');
}

async function testVenueById() {
  console.log('\n--- Testing /api/venue/:venueId ---');
  
  // Test with existing venue ID
  await testEndpoint(`/api/venue/${testData.venueIds[0]}`, 'GET', 'Existing venue');
  
  // Test with nonexistent venue ID
  await testEndpoint(`/api/venue/${testData.venueIds[2]}`, 'GET', 'Nonexistent venue');
}

async function testUserAccount() {
  console.log('\n--- Testing /api/user-account ---');
  
  // Test with valid user ID
  await testEndpoint(`/api/user-account?user_id=${testData.userIds[0]}`, 'GET', 'Valid user');
  
  // Test with nonexistent user ID
  await testEndpoint(`/api/user-account?user_id=${testData.userIds[1]}`, 'GET', 'Nonexistent user');
  
  // Test without user ID
  await testEndpoint('/api/user-account', 'GET', 'Missing user ID');
}

async function testCheckin() {
  console.log('\n--- Testing /api/checkin/:orgId ---');
  
  // Test with valid data
  await testEndpoint(
    `/api/checkin/${testData.orgIds[0]}`,
    'POST',
    'Valid checkin',
    { userId: testData.userIds[0], venueId: testData.venueIds[0] }
  );
  
  // Test with missing user ID
  await testEndpoint(
    `/api/checkin/${testData.orgIds[0]}`,
    'POST',
    'Checkin missing user ID',
    { venueId: testData.venueIds[0] }
  );
  
  // Test with missing venue ID
  await testEndpoint(
    `/api/checkin/${testData.orgIds[0]}`,
    'POST',
    'Checkin missing venue ID',
    { userId: testData.userIds[0] }
  );
}

async function testRegister() {
  console.log('\n--- Testing /api/register/:orgId ---');
  
  // Test with valid data
  await testEndpoint(
    `/api/register/${testData.orgIds[0]}`,
    'POST',
    'Valid registration',
    { userId: testData.userIds[0], cardId: testData.cardIds[0] }
  );
  
  // Test with missing user ID
  await testEndpoint(
    `/api/register/${testData.orgIds[0]}`,
    'POST',
    'Registration missing user ID',
    { cardId: testData.cardIds[0] }
  );
  
  // Test with missing card ID
  await testEndpoint(
    `/api/register/${testData.orgIds[0]}`,
    'POST',
    'Registration missing card ID',
    { userId: testData.userIds[0] }
  );
}

// Helper function to test an endpoint
async function testEndpoint(path, method = 'GET', description, body = null) {
  try {
    console.log(`Testing: ${description} (${method} ${path})`);
    
    const options = {
      method,
      headers: {}
    };
    
    if (body) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`http://localhost:${PORT}${path}`, options);
    let data;
    
    try {
      data = await response.json();
    } catch (e) {
      data = { error: 'Failed to parse response as JSON' };
    }
    
    console.log(`Status: ${response.status}`);
    console.log('Response:', data);
    console.log(`✅ Test passed: ${description}`);
  } catch (error) {
    console.error(`❌ Test failed: ${description}`);
    console.error(error);
  }
} 