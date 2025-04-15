import os
import sys
import requests
import time
import json
from dotenv import load_dotenv

# --- Configuration ---
# Construct the path to .env.local relative to this script file
script_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(script_dir)  # Go up one level
dotenv_path = os.path.join(parent_dir, '.env.local')

print(f"Looking for .env.local at: {dotenv_path}")
if not os.path.exists(dotenv_path):
    print(f"Warning: .env.local not found at {dotenv_path}")
    
load_dotenv(dotenv_path=dotenv_path)

# App base URL will now point to the Next.js app
APP_BASE_URL = os.getenv("NEXT_PUBLIC_APP_URL", "http://localhost:3000")
GLOWNET_API_KEY = os.getenv("GLOWNET_API_KEY")

if not GLOWNET_API_KEY:
    print("Error: Required environment variables not set in .env.local")
    print("Required: GLOWNET_API_KEY")
    sys.exit(1)

def test_api_sync(sync_type="full", batch_size=50):
    """Tests the cards API sync endpoint."""
    url = f"{APP_BASE_URL}/api/cards/sync-glownet"
    
    headers = {
        "Content-Type": "application/json"
    }
    
    payload = {
        "type": sync_type,
        "batchSize": batch_size
    }
    
    print(f"Testing Card Sync API at: {url}")
    print(f"Parameters: {json.dumps(payload, indent=2)}")
    
    try:
        start_time = time.time()
        response = requests.post(url, json=payload, headers=headers)
        elapsed_time = time.time() - start_time
        
        print("\n" + "=" * 50)
        print(f"Response Status: {response.status_code}")
        print(f"Time taken: {elapsed_time:.2f} seconds")
        
        if response.status_code == 200:
            result = response.json()
            print("\nSync Results:")
            print(f"Message: {result.get('message', 'No message')}")
            
            if 'stats' in result:
                stats = result['stats']
                print(f"\nTotal cards processed: {stats.get('total', 0)}")
                print(f"Synced: {stats.get('synced', 0)}")
                print(f"Failed: {stats.get('failed', 0)}")
            
            return result
        else:
            print(f"Error: API returned status {response.status_code}")
            try:
                error_details = response.json()
                print(f"Error details: {json.dumps(error_details, indent=2)}")
            except:
                print(f"Response text: {response.text}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"Network error while testing API: {e}")
        return None

def test_cron_trigger():
    """Tests the cron trigger endpoint for cards sync."""
    url = f"{APP_BASE_URL}/api/cards/sync-glownet"
    
    print(f"Testing Card Sync Cron Trigger at: {url}")
    print("Note: This should return 401 Unauthorized since it's not coming from Vercel cron")
    
    try:
        response = requests.get(url)
        
        print("\n" + "=" * 50)
        print(f"Response Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("\nSync Results:")
            print(f"Message: {result.get('message', 'No message')}")
            
            if 'stats' in result:
                stats = result['stats']
                print(f"\nTotal cards processed: {stats.get('total', 0)}")
                print(f"Synced: {stats.get('synced', 0)}")
                print(f"Failed: {stats.get('failed', 0)}")
                
            return result
        else:
            print(f"Expected error response: {response.status_code}")
            try:
                error_details = response.json()
                print(f"Response details: {json.dumps(error_details, indent=2)}")
            except:
                print(f"Response text: {response.text}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"Network error while testing cron trigger: {e}")
        return None

# --- Main Script ---
if __name__ == "__main__":
    print("=== Card Sync API Test Tool ===")
    print(f"App Base URL: {APP_BASE_URL}")
    print("=" * 40)

    if len(sys.argv) > 1 and sys.argv[1] == "cron":
        # Test cron trigger endpoint
        test_cron_trigger()
    else:
        # Test sync endpoint with parameters
        sync_type = "full"
        batch_size = 50
        
        # Parse command line arguments for sync_type and batch_size
        if len(sys.argv) > 1:
            sync_type = sys.argv[1]
        if len(sys.argv) > 2:
            try:
                batch_size = int(sys.argv[2])
            except ValueError:
                print(f"Invalid batch size: {sys.argv[2]}, using default: 50")
                
        test_api_sync(sync_type, batch_size)
        
    print("\nAPI test completed.") 