import os
import sys
import json
import requests
from dotenv import load_dotenv
import time
from utils.paths import project_root, scripts_root

# --- Configuration ---
# Construct the path to .env.local relative to this script file
script_dir = scripts_root()
root_dir = project_root()  # Go up three levels to get to root
dotenv_path = root_dir / '.env.local'

print(f"Looking for .env.local at: {dotenv_path}")
if not dotenv_path.exists():
    print(f"Warning: .env.local not found at {dotenv_path}")
    
load_dotenv(dotenv_path=dotenv_path)

# App base URL will now point to the Next.js app
APP_BASE_URL = os.getenv("NEXT_PUBLIC_APP_URL", "http://localhost:3000")
GLOWNET_API_KEY = os.getenv("GLOWNET_API_KEY")

if not GLOWNET_API_KEY:
    print("Error: Required environment variables not set in .env.local")
    print("Required: GLOWNET_API_KEY")
    sys.exit(1)

def load_venue_images():
    """Load venue image mappings from JSON file"""
    image_file_path = script_dir / 'venue_images.json'
    try:
        with open(image_file_path, 'r') as f:
            data = json.load(f)
            return data.get('venue_images', {})
    except FileNotFoundError:
        print(f"Warning: venue_images.json not found at {image_file_path}")
        return {}
    except json.JSONDecodeError:
        print(f"Warning: venue_images.json at {image_file_path} is not valid JSON")
        return {}

def test_api_sync(sync_type="full", venue_images=None):
    """Tests the venues API sync endpoint."""
    url = f"{APP_BASE_URL}/api/venues/sync-glownet"
    
    headers = {
        "Content-Type": "application/json"
    }
    
    payload = {
        "type": sync_type,
        "venue_images": venue_images or {}
    }
    
    print(f"Testing Venue Sync API at: {url}")
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
            
            if 'data' in result:
                print(f"\nVenues synced: {len(result['data'])}")
                print("Synced venues:")
                for venue in result['data']:
                    print(f"- {venue.get('name', 'Unknown')} (ID: {venue.get('id', 'Unknown')})")
            
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
    """Tests the cron trigger endpoint for venues sync."""
    url = f"{APP_BASE_URL}/api/venues/sync-glownet"
    
    print(f"Testing Venue Sync Cron Trigger at: {url}")
    print("Note: This should return 401 Unauthorized since it's not coming from Vercel cron")
    
    try:
        response = requests.get(url)
        
        print("\n" + "=" * 50)
        print(f"Response Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("\nSync Results:")
            print(f"Message: {result.get('message', 'No message')}")
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
    print("=== Venue Sync API Test Tool ===")
    print(f"App Base URL: {APP_BASE_URL}")
    print("=" * 40)

    # Load venue images
    venue_images = load_venue_images()
    print(f"Loaded {len(venue_images)} venue image mappings")

    if len(sys.argv) > 1 and sys.argv[1] == "cron":
        # Test cron trigger endpoint
        test_cron_trigger()
    else:
        # Test sync endpoint with parameters
        sync_type = "full"
        
        # Parse command line arguments for sync_type
        if len(sys.argv) > 1:
            sync_type = sys.argv[1]
                
        test_api_sync(sync_type, venue_images)
        
    print("\nAPI test completed.") 