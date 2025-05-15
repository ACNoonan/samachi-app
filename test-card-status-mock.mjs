import http from 'http';
import url from 'url';

// Mock data for simulating responses
const mockCards = {
  'test-card-123': { status: 'active', user_id: 'user-456' },
  'unregistered-card': { status: 'active', user_id: null },
  'invalid-card': null
};

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
      // Simulate database query with our mock data
      const cardData = mockCards[cardIdentifier];
      
      if (!cardData) {
        console.log(`Card identifier ${cardIdentifier} not found.`);
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Card not found' }));
        return;
      }
      
      // Determine registration status based on whether user_id is set
      const isRegistered = !!cardData.user_id;
      const status = isRegistered ? 'registered' : 'unregistered';
      
      console.log(`Card ${cardIdentifier} status: ${status} (User ID: ${cardData.user_id})`);
      
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
  console.log('\nAvailable test card IDs:');
  console.log('- test-card-123 (registered card)');
  console.log('- unregistered-card (unregistered card)');
  console.log('- invalid-card (card not found)');
  console.log('- Any request without card_id will return a 400 error\n');
}); 