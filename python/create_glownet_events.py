# samachi-app/create_glownet_test_data.py
import os
import requests
import sys
from datetime import datetime, timedelta
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

GLOWNET_API_BASE_URL = os.getenv("GLOWNET_API_BASE_URL", "https://opera.glownet.com")
GLOWNET_API_KEY = os.getenv("GLOWNET_API_KEY")

if not GLOWNET_API_KEY:
    print("Error: GLOWNET_API_KEY environment variable not set in .env.local")
    sys.exit(1)

HEADERS = {
    "AUTHORIZATION": f"Token token={GLOWNET_API_KEY}",
    "Content-Type": "application/json",
    "Accept": "application/json"
}

# --- Helper Functions ---

def handle_response(response, success_status_codes=(200, 201)):
    """Checks response status and returns JSON or raises error."""
    if response.status_code in success_status_codes:
        try:
            if response.text:
                return response.json()
            else:
                return None # Success, but no JSON body
        except requests.exceptions.JSONDecodeError:
            print(f"Warning: Successful status ({response.status_code}) but could not decode JSON.")
            print(f"Response Text: {response.text}")
            return None
    else:
        print(f"Error: API returned status {response.status_code}")
        try:
            error_details = response.json()
            print(f"Response: {error_details}")
            message = error_details.get('error') or error_details.get('message') or str(error_details)
            print(f"API Error Details: {message}")
        except requests.exceptions.JSONDecodeError:
            print(f"Response Text (non-JSON): {response.text}")
        return None # Indicate failure

def ask_yes_no(prompt):
    """Asks a yes/no question and returns True for yes, False for no."""
    while True:
        response = input(f"{prompt} (y/n): ").lower().strip()
        if response == 'y':
            return True
        elif response == 'n':
            return False
        else:
            print("Invalid input. Please enter 'y' or 'n'.")

def create_event(name, start_date, end_date, timezone):
    """Creates a single event."""
    url = f"{GLOWNET_API_BASE_URL}/api/v2/events"
    payload = {
        "event": {
            "name": name,
            "start_date": start_date,
            "end_date": end_date,
            "timezone": timezone
        }
    }
    print(f"\nAttempting to create event: {name}...")
    print(f"Request URL: {url}")
    print(f"Request Headers: {HEADERS}")
    print(f"Request Payload: {payload}")
    
    try:
        response = requests.post(url, headers=HEADERS, json=payload)
        result = handle_response(response, success_status_codes=(201,))
        if result:
            print(f"Successfully created event:")
            print(f"  ID: {result.get('id')}")
            print(f"  Slug: {result.get('slug')}")
            print(f"  State: {result.get('state')}")
        return result
    except requests.exceptions.RequestException as e:
        print(f"  Network error creating event '{name}': {e}")
        return None

# --- Main Interactive Script ---
if __name__ == "__main__":
    print("--- Glownet Event Creator ---")
    print(f"API Base URL: {GLOWNET_API_BASE_URL}")
    print("-" * 40)

    while True:
        if not ask_yes_no("Do you want to create a new event?"):
            break

        event_name = input("Enter the name for the new event: ").strip()
        
        # Get dates from user or use defaults
        use_default_dates = ask_yes_no("Use default dates (today + 7 days)?")
        
        if use_default_dates:
            now = datetime.now()
            start_date = now.strftime("%d/%m/%Y %H:%M:%S")
            end_date = (now + timedelta(days=7)).strftime("%d/%m/%Y %H:%M:%S")
        else:
            print("Enter dates in format DD/MM/YYYY HH:MM:SS")
            start_date = input("Enter start date: ").strip()
            end_date = input("Enter end date: ").strip()

        timezone = input("Enter timezone (default: Madrid): ").strip() or "Madrid"

        created_event_info = create_event(event_name, start_date, end_date, timezone)
        
        if created_event_info:
            print("\nEvent created successfully!")
            print("You can now use create_glownet_assets.py to add customers and G-Tags to this event.")
        else:
            print(f"\nFailed to create event '{event_name}'.")
        
        print("-" * 40)

    print("\nEvent Creation Script finished.")
