import fetch from 'node-fetch';

// Real card IDs from the database
const testCards = [
  'TESTU0001',  // Registered card
  'MNCA0001',   // Unregistered card
  'NONEXISTENT' // This should return a 404
];

async function testCardStatusAPI() {
  const PORT = 3333;
  
  for (const cardId of testCards) {
    try {
      console.log(`\nTesting with card ID: ${cardId}`);
      
      // Make a request to our test server
      const response = await fetch(`http://localhost:${PORT}/api/card-status?card_id=${cardId}`);
      const data = await response.json();
      
      console.log('API Response Status:', response.status);
      console.log('API Response Data:', data);
      
    } catch (error) {
      console.error(`Error testing card ID ${cardId}:`, error.message);
    }
  }
}

// Only run this if the server is already running
console.log('Testing card status API against test server...');
console.log('Make sure the test server is running with: node test-card-status-server.mjs');
setTimeout(() => {
  testCardStatusAPI();
}, 1000); // Give a small delay to see the instructions 