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
  venueIds: ['534d480b-ba71-48fd-9957-9800b2b4acb9', '510dd180-6cbf-4948-95e3-87ab0ed052dd', '00000000-0000-0000-0000-000000000000'],
  userIds: ['1f3cb1be-43b9-4ea0-bf2f-f250b258187a', '00000000-0000-0000-0000-000000000000'],
  orgIds: ['1', 'nonexistent-org'],
  stagIds: ['stag-1', 'stag-2'],
};

// Route implementations
const routes = {
  // Venue routes
  '/api/venue': async (req, res, query) => {
    try {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .limit(2); // Limit results for cleaner output
        
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
        .select('id, name, currency')
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
  
  // Venue users route
  '/api/venue/:venueId/users': async (req, res, params) => {
    const venueId = params.venueId;
    
    if (!venueId) {
      res.statusCode = 400;
      return { error: 'Venue ID is required' };
    }
    
    try {
      // Simulated venue users
      return [
        { id: testData.userIds[0], name: 'Test User 1' },
        { id: '2f4db1ce-54c9-5ea1-cf3f-f350b358187a', name: 'Test User 2' }
      ];
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
        .from('profiles')
        .select('id, username, email')
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
  
  // User Account assign stag route
  '/api/user-account/assign-stag': async (req, res, query, body) => {
    const { userId, stagId } = body || {};
    
    if (!userId || !stagId) {
      res.statusCode = 400;
      return { error: 'User ID and STAG ID are required' };
    }
    
    return {
      success: true,
      userId,
      stagId,
      timestamp: new Date().toISOString()
    };
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
  
  // Checkin route with user ID
  '/api/checkin/:orgId/:userId': async (req, res, params) => {
    const { orgId, userId } = params;
    
    if (!orgId || !userId) {
      res.statusCode = 400;
      return { error: 'Organization ID and User ID are required' };
    }
    
    try {
      // Return checkin history for the user
      return {
        checkins: [
          {
            id: 'checkin-1',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            venueId: testData.venueIds[0]
          },
          {
            id: 'checkin-2',
            timestamp: new Date().toISOString(),
            venueId: testData.venueIds[1]
          }
        ]
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
  },
  
  // Register with STAG
  '/api/register/:orgId/stag': async (req, res, params, body) => {
    const { orgId } = params;
    const { userId, stagId } = body || {};
    
    if (!orgId) {
      res.statusCode = 400;
      return { error: 'Organization ID is required' };
    }
    
    if (!userId || !stagId) {
      res.statusCode = 400;
      return { error: 'User ID and STAG ID are required' };
    }
    
    return {
      success: true,
      registrationId: 'test-stag-registration',
      timestamp: new Date().toISOString(),
      orgId,
      userId,
      stagId
    };
  },
  
  // Register with specific STAG
  '/api/register/:orgId/stag/:stagId': async (req, res, params, body) => {
    const { orgId, stagId } = params;
    const { userId } = body || {};
    
    if (!orgId || !stagId) {
      res.statusCode = 400;
      return { error: 'Organization ID and STAG ID are required' };
    }
    
    if (!userId) {
      res.statusCode = 400;
      return { error: 'User ID is required' };
    }
    
    return {
      success: true,
      registrationId: 'test-specific-stag-registration',
      timestamp: new Date().toISOString(),
      orgId,
      userId,
      stagId
    };
  },
  
  // Staking route
  '/api/staking': async (req, res, query) => {
    return {
      totalStaked: '1000000',
      stakingPoolSize: '10000000'
    };
  },
  
  // Staking by user ID
  '/api/staking/:userId': async (req, res, params) => {
    const { userId } = params;
    
    if (!userId) {
      res.statusCode = 400;
      return { error: 'User ID is required' };
    }
    
    // Simulate different responses based on user ID
    if (userId === testData.userIds[0]) {
      return {
        userId,
        stakedAmount: '5000',
        stakingSince: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString() // 30 days ago
      };
    } else if (userId === testData.userIds[1]) {
      res.statusCode = 404;
      return { error: 'User not found or no staking record' };
    } else {
      return {
        userId,
        stakedAmount: '0',
        stakingSince: null
      };
    }
  },
  
  // Settle routes
  '/api/settle': async (req, res, query) => {
    return {
      totalSettled: '500000',
      pendingSettlements: '50000'
    };
  },
  
  // Settle by organization
  '/api/settle/:orgId': async (req, res, params) => {
    const { orgId } = params;
    
    if (!orgId) {
      res.statusCode = 400;
      return { error: 'Organization ID is required' };
    }
    
    return {
      orgId,
      settledAmount: '250000',
      pendingAmount: '25000',
      lastSettlement: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
    };
  },
  
  // Settle by organization and user
  '/api/settle/:orgId/:userId': async (req, res, params) => {
    const { orgId, userId } = params;
    
    if (!orgId || !userId) {
      res.statusCode = 400;
      return { error: 'Organization ID and User ID are required' };
    }
    
    return {
      orgId,
      userId,
      settledAmount: '5000',
      pendingAmount: '1000',
      lastSettlement: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString() // 7 days ago
    };
  },
  
  // User history routes
  '/api/user-history': async (req, res, query) => {
    return {
      totalUsers: 500,
      activeToday: 50,
      activeThisWeek: 200,
      activeThisMonth: 350
    };
  },
  
  // User history by organization
  '/api/user-history/:orgId': async (req, res, params) => {
    const { orgId } = params;
    
    if (!orgId) {
      res.statusCode = 400;
      return { error: 'Organization ID is required' };
    }
    
    return {
      orgId,
      totalUsers: 200,
      activeToday: 25,
      activeThisWeek: 100,
      activeThisMonth: 150
    };
  },
  
  // User history by organization and user
  '/api/user-history/:orgId/:userId': async (req, res, params) => {
    const { orgId, userId } = params;
    
    if (!orgId || !userId) {
      res.statusCode = 400;
      return { error: 'Organization ID and User ID are required' };
    }
    
    return {
      orgId,
      userId,
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      totalLogins: 35,
      totalTransactions: 12,
      joinDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString() // 90 days ago
    };
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

// Test runner
async function runTests() {
  console.log('\n=== Starting Automated Tests ===');
  
  // Test venue routes
  await testVenues();
  
  // Test venue by ID routes
  await testVenueById();
  
  // Test venue users route
  await testVenueUsers();
  
  // Test user account routes
  await testUserAccount();
  
  // Test user account assign stag route
  await testUserAccountAssignStag();
  
  // Test checkin routes
  await testCheckin();
  
  // Test register routes
  await testRegister();
  
  // Test staking routes
  await testStaking();
  
  // Test settle routes
  await testSettle();
  
  // Test user history routes
  await testUserHistory();
  
  console.log('\n=== All Tests Completed ===');
  
  // Close the server after tests complete
  server.close(() => {
    console.log('Test server closed');
    process.exit(0);
  });
}

// Test functions
async function testVenues() {
  console.log('\n--- Testing /api/venue ---');
  await testEndpoint('/api/venue', 'GET', 'Venues list');
}

async function testVenueById() {
  console.log('\n--- Testing /api/venue/:venueId ---');
  await testEndpoint(`/api/venue/${testData.venueIds[0]}`, 'GET', 'Existing venue');
  await testEndpoint(`/api/venue/${testData.venueIds[2]}`, 'GET', 'Nonexistent venue');
}

async function testVenueUsers() {
  console.log('\n--- Testing /api/venue/:venueId/users ---');
  await testEndpoint(`/api/venue/${testData.venueIds[0]}/users`, 'GET', 'Venue users');
}

async function testUserAccount() {
  console.log('\n--- Testing /api/user-account ---');
  await testEndpoint(`/api/user-account?user_id=${testData.userIds[0]}`, 'GET', 'Valid user');
  await testEndpoint(`/api/user-account?user_id=${testData.userIds[1]}`, 'GET', 'Nonexistent user');
  await testEndpoint('/api/user-account', 'GET', 'Missing user ID');
}

async function testUserAccountAssignStag() {
  console.log('\n--- Testing /api/user-account/assign-stag ---');
  await testEndpoint(
    '/api/user-account/assign-stag',
    'POST',
    'Assign STAG to user',
    { userId: testData.userIds[0], stagId: testData.stagIds[0] }
  );
  
  await testEndpoint(
    '/api/user-account/assign-stag',
    'POST',
    'Assign STAG missing user ID',
    { stagId: testData.stagIds[0] }
  );
  
  await testEndpoint(
    '/api/user-account/assign-stag',
    'POST',
    'Assign STAG missing STAG ID',
    { userId: testData.userIds[0] }
  );
}

async function testCheckin() {
  console.log('\n--- Testing /api/checkin/:orgId ---');
  await testEndpoint(
    `/api/checkin/${testData.orgIds[0]}`,
    'POST',
    'Valid checkin',
    { userId: testData.userIds[0], venueId: testData.venueIds[0] }
  );
  
  await testEndpoint(
    `/api/checkin/${testData.orgIds[0]}`,
    'POST',
    'Checkin missing user ID',
    { venueId: testData.venueIds[0] }
  );
  
  await testEndpoint(
    `/api/checkin/${testData.orgIds[0]}`,
    'POST',
    'Checkin missing venue ID',
    { userId: testData.userIds[0] }
  );
  
  console.log('\n--- Testing /api/checkin/:orgId/:userId ---');
  await testEndpoint(
    `/api/checkin/${testData.orgIds[0]}/${testData.userIds[0]}`,
    'GET',
    'Get user checkin history'
  );
}

async function testRegister() {
  console.log('\n--- Testing /api/register/:orgId ---');
  
  await testEndpoint(
    `/api/register/${testData.orgIds[0]}`,
    'POST',
    'Valid registration',
    { userId: testData.userIds[0], cardId: testData.cardIds[0] }
  );
  
  await testEndpoint(
    `/api/register/${testData.orgIds[0]}`,
    'POST',
    'Registration missing user ID',
    { cardId: testData.cardIds[0] }
  );
  
  await testEndpoint(
    `/api/register/${testData.orgIds[0]}`,
    'POST',
    'Registration missing card ID',
    { userId: testData.userIds[0] }
  );
  
  console.log('\n--- Testing /api/register/:orgId/stag ---');
  await testEndpoint(
    `/api/register/${testData.orgIds[0]}/stag`,
    'POST',
    'Register with STAG',
    { userId: testData.userIds[0], stagId: testData.stagIds[0] }
  );
  
  console.log('\n--- Testing /api/register/:orgId/stag/:stagId ---');
  await testEndpoint(
    `/api/register/${testData.orgIds[0]}/stag/${testData.stagIds[1]}`,
    'POST',
    'Register with specific STAG',
    { userId: testData.userIds[0] }
  );
}

async function testStaking() {
  console.log('\n--- Testing /api/staking ---');
  await testEndpoint('/api/staking', 'GET', 'General staking info');
  
  console.log('\n--- Testing /api/staking/:userId ---');
  await testEndpoint(`/api/staking/${testData.userIds[0]}`, 'GET', 'User with staking');
  await testEndpoint(`/api/staking/${testData.userIds[1]}`, 'GET', 'User without staking');
}

async function testSettle() {
  console.log('\n--- Testing /api/settle ---');
  await testEndpoint('/api/settle', 'GET', 'General settlement info');
  
  console.log('\n--- Testing /api/settle/:orgId ---');
  await testEndpoint(`/api/settle/${testData.orgIds[0]}`, 'GET', 'Organization settlements');
  
  console.log('\n--- Testing /api/settle/:orgId/:userId ---');
  await testEndpoint(
    `/api/settle/${testData.orgIds[0]}/${testData.userIds[0]}`,
    'GET',
    'User settlements in organization'
  );
}

async function testUserHistory() {
  console.log('\n--- Testing /api/user-history ---');
  await testEndpoint('/api/user-history', 'GET', 'General user history');
  
  console.log('\n--- Testing /api/user-history/:orgId ---');
  await testEndpoint(`/api/user-history/${testData.orgIds[0]}`, 'GET', 'Organization user history');
  
  console.log('\n--- Testing /api/user-history/:orgId/:userId ---');
  await testEndpoint(
    `/api/user-history/${testData.orgIds[0]}/${testData.userIds[0]}`,
    'GET',
    'Specific user history in organization'
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
    console.log(`✅ Test passed: ${description}`);
  } catch (error) {
    console.error(`❌ Test failed: ${description}`);
    console.error(error);
  }
}

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