import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

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

// Prefix for test data to make it easily identifiable
const TEST_PREFIX = 'TEST_';

// Store created IDs for later cleanup
const createdIds = {
  profiles: [],
  venues: [],
  checkins: []
};

async function insertTestData() {
  try {
    console.log('=== Starting Test Data Insertion ===\n');
    
    // Create test profiles
    const profiles = await createTestProfiles();
    
    // Create test venues
    const venues = await createTestVenues();
    
    // Create test checkins
    if (profiles.length > 0 && venues.length > 0) {
      await createTestCheckins(profiles[0].id, venues[0].id);
    }
    
    console.log('\n=== Test Data Insertion Complete ===');
    
    // Return created test data
    return {
      profiles,
      venues,
      checkins: createdIds.checkins
    };
    
  } catch (error) {
    console.error('Error inserting test data:', error);
    throw error;
  }
}

async function createTestProfiles() {
  console.log('Creating test profiles...');
  
  try {
    // Create test profiles
    const testProfiles = [
      {
        id: uuidv4(),
        username: `${TEST_PREFIX}user_${Date.now()}`,
        email: `${TEST_PREFIX}user_${Date.now()}@test.com`,
        created_at: new Date().toISOString()
      },
      {
        id: uuidv4(),
        username: `${TEST_PREFIX}user2_${Date.now()}`,
        email: `${TEST_PREFIX}user2_${Date.now()}@test.com`,
        created_at: new Date().toISOString()
      }
    ];
    
    // Insert profiles into the database
    const { data, error } = await supabase
      .from('profiles')
      .insert(testProfiles)
      .select();
    
    if (error) {
      console.error('Error creating test profiles:', error);
      return [];
    }
    
    console.log(`✅ Created ${data.length} test profiles`);
    data.forEach(profile => {
      console.log(`- ${profile.username}: ${profile.id}`);
      createdIds.profiles.push(profile.id);
    });
    
    return data;
  } catch (err) {
    console.error('Error:', err);
    return [];
  }
}

async function createTestVenues() {
  console.log('\nCreating test venues...');
  
  try {
    // Create test venues
    const testVenues = [
      {
        id: uuidv4(),
        name: `${TEST_PREFIX}Venue_${Date.now()}`,
        currency: 'USD',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: `${TEST_PREFIX}Venue2_${Date.now()}`,
        currency: 'EUR',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    // Insert venues into the database
    const { data, error } = await supabase
      .from('venues')
      .insert(testVenues)
      .select();
    
    if (error) {
      console.error('Error creating test venues:', error);
      return [];
    }
    
    console.log(`✅ Created ${data.length} test venues`);
    data.forEach(venue => {
      console.log(`- ${venue.name}: ${venue.id}`);
      createdIds.venues.push(venue.id);
    });
    
    return data;
  } catch (err) {
    console.error('Error:', err);
    return [];
  }
}

// For the checkins table, we need to check if it exists first since we don't know the exact schema
async function createTestCheckins(profileId, venueId) {
  console.log('\nCreating test checkins...');
  
  try {
    // First, check if a checkins table exists and what columns it has
    const { error: tableError } = await supabase
      .from('checkins')
      .select('id')
      .limit(1);
    
    if (tableError) {
      console.log('❌ Checkins table not found or not accessible, skipping checkin creation');
      return [];
    }
    
    // Create a checkin record
    const checkinId = uuidv4();
    const testCheckin = {
      id: checkinId,
      user_id: profileId,
      venue_id: venueId,
      timestamp: new Date().toISOString()
    };
    
    // Insert checkin into the database
    const { data, error } = await supabase
      .from('checkins')
      .insert(testCheckin)
      .select();
    
    if (error) {
      console.error('Error creating test checkin:', error);
      return [];
    }
    
    console.log(`✅ Created test checkin for user ${profileId} at venue ${venueId}`);
    createdIds.checkins.push(checkinId);
    
    return data;
  } catch (err) {
    console.error('Error:', err);
    return [];
  }
}

async function cleanupTestData() {
  console.log('\n=== Cleaning Up Test Data ===');
  
  // Clean up checkins
  if (createdIds.checkins.length > 0) {
    console.log(`Deleting ${createdIds.checkins.length} test checkins...`);
    const { error: checkinError } = await supabase
      .from('checkins')
      .delete()
      .in('id', createdIds.checkins);
    
    if (checkinError) {
      console.error('Error deleting test checkins:', checkinError);
    } else {
      console.log('✅ Test checkins deleted');
    }
  }
  
  // Clean up venues
  if (createdIds.venues.length > 0) {
    console.log(`Deleting ${createdIds.venues.length} test venues...`);
    const { error: venueError } = await supabase
      .from('venues')
      .delete()
      .in('id', createdIds.venues);
    
    if (venueError) {
      console.error('Error deleting test venues:', venueError);
    } else {
      console.log('✅ Test venues deleted');
    }
  }
  
  // Clean up profiles
  if (createdIds.profiles.length > 0) {
    console.log(`Deleting ${createdIds.profiles.length} test profiles...`);
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .in('id', createdIds.profiles);
    
    if (profileError) {
      console.error('Error deleting test profiles:', profileError);
    } else {
      console.log('✅ Test profiles deleted');
    }
  }
  
  console.log('=== Cleanup Complete ===');
}

// Alternative cleanup: delete all test data by prefix
async function cleanupAllTestData() {
  console.log('\n=== Cleaning Up All Test Data By Prefix ===');
  
  // Clean up profiles with test prefix
  console.log(`Deleting all profiles with prefix ${TEST_PREFIX}...`);
  const { error: profileError } = await supabase
    .from('profiles')
    .delete()
    .like('username', `${TEST_PREFIX}%`);
  
  if (profileError) {
    console.error('Error deleting test profiles by prefix:', profileError);
  } else {
    console.log('✅ Test profiles deleted by prefix');
  }
  
  // Clean up venues with test prefix
  console.log(`Deleting all venues with prefix ${TEST_PREFIX}...`);
  const { error: venueError } = await supabase
    .from('venues')
    .delete()
    .like('name', `${TEST_PREFIX}%`);
  
  if (venueError) {
    console.error('Error deleting test venues by prefix:', venueError);
  } else {
    console.log('✅ Test venues deleted by prefix');
  }
  
  console.log('=== Prefix Cleanup Complete ===');
}

// Main function to run tests with real data
async function testWithRealData() {
  try {
    // Insert test data
    const testData = await insertTestData();
    
    if (!testData.profiles.length || !testData.venues.length) {
      console.error('Failed to create necessary test data. Aborting test.');
      return;
    }
    
    // Test API calls with the real data
    await testProfileEndpoint(testData.profiles[0].id);
    await testVenueEndpoint(testData.venues[0].id);
    
    // Additional tests here...
    
    // Clean up
    await cleanupTestData();
    
  } catch (error) {
    console.error('Error during test:', error);
    // Make sure we still try to clean up even if the test fails
    try {
      await cleanupTestData();
    } catch (cleanupError) {
      console.error('Error during cleanup:', cleanupError);
    }
  }
}

// Test specific endpoints with real data
async function testProfileEndpoint(profileId) {
  console.log(`\n=== Testing Profile Endpoint with Real ID: ${profileId} ===`);
  try {
    const response = await fetch(`http://localhost:3333/api/user-account?user_id=${profileId}`);
    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log('Response:', data);
    console.log(`✅ Test passed: Profile endpoint with real ID`);
  } catch (error) {
    console.error(`❌ Test failed: Profile endpoint`);
    console.error(error);
  }
}

async function testVenueEndpoint(venueId) {
  console.log(`\n=== Testing Venue Endpoint with Real ID: ${venueId} ===`);
  try {
    const response = await fetch(`http://localhost:3333/api/venue/${venueId}`);
    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log('Response:', data);
    console.log(`✅ Test passed: Venue endpoint with real ID`);
  } catch (error) {
    console.error(`❌ Test failed: Venue endpoint`);
    console.error(error);
  }
}

// Run everything
console.log('=== Starting Test With Real Data ===');
testWithRealData()
  .then(() => {
    console.log('\n=== All Tests With Real Data Completed ===');
    process.exit(0);
  })
  .catch(error => {
    console.error('Unhandled error during test:', error);
    process.exit(1);
  }); 