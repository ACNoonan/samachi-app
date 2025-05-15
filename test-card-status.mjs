import fetch from 'node-fetch';

// Test card ID
const cardId = 'test-card-123'; // Replace with an actual card ID if available

async function testCardStatusAPI() {
  try {
    // Make a request to the local API endpoint
    const response = await fetch(`http://localhost:3000/api/card-status?card_id=${cardId}`);
    const data = await response.json();
    
    console.log('API Response Status:', response.status);
    console.log('API Response Data:', data);
    
    return data;
  } catch (error) {
    console.error('Error testing card status API:', error);
  }
}

// Execute the test
testCardStatusAPI(); 