import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def sync_venues(sync_type='full'):
    """
    Trigger venue sync from Glownet
    
    Args:
        sync_type (str): Type of sync - 'full' or 'incremental'
    """
    # URL - change this to your deployment URL when not testing locally
    base_url = os.getenv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000')
    endpoint = f"{base_url}/api/venues/sync-glownet"
    
    # Request data
    data = {
        "type": sync_type
    }
    
    try:
        # Make the POST request
        response = requests.post(endpoint, json=data)
        
        # Check if request was successful
        response.raise_for_status()
        
        # Print response
        result = response.json()
        if 'error' in result:
            print(f"Error: {result['error']}")
        else:
            print(f"Success: {result['message']}")
            if 'data' in result:
                print(f"Synced venues: {len(result['data'])}")
                
    except requests.exceptions.RequestException as e:
        print(f"Failed to sync venues: {str(e)}")
        if hasattr(e.response, 'text'):
            print(f"Response: {e.response.text}")

if __name__ == "__main__":
    import sys
    
    # Get sync type from command line argument, default to 'full'
    sync_type = sys.argv[1] if len(sys.argv) > 1 else 'full'
    
    if sync_type not in ['full', 'incremental']:
        print("Error: sync_type must be either 'full' or 'incremental'")
        sys.exit(1)
        
    print(f"Starting {sync_type} venue sync...")
    sync_venues(sync_type) 