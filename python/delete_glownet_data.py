# samachi-app/delete_glownet_data.py
import os
import requests
import sys
import json
from dotenv import load_dotenv
from typing import List, Dict, Optional

# --- Configuration ---
# Construct the path to .env.local relative to this script file
script_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(script_dir)  # Go up one level
dotenv_path = os.path.join(parent_dir, '.env.local')

print(f"Looking for .env.local at: {dotenv_path}")
if not os.path.exists(dotenv_path):
    print(f"Warning: .env.local not found at {dotenv_path}")
    
load_dotenv(dotenv_path=dotenv_path)

# Get base URL from env or use default, ensure it doesn't end with a slash
base_url = os.getenv("GLOWNET_API_BASE_URL", "https://opera.glownet.com").rstrip('/')
GLOWNET_API_BASE_URL = f"{base_url}/api/v2"  # Add API version path
GLOWNET_API_KEY = os.getenv("GLOWNET_API_KEY")

if not GLOWNET_API_KEY:
    print("Error: GLOWNET_API_KEY environment variable not set in .env.local")
    sys.exit(1)

HEADERS = {
    "AUTHORIZATION": f"Token token={GLOWNET_API_KEY}",
    "Accept": "application/json",
    "Content-Type": "application/json"
}

# --- Helper Functions ---

def get_all_events() -> List[Dict]:
    """Fetches all events from the Glownet API."""
    url = f"{GLOWNET_API_BASE_URL}/events"
    try:
        response = requests.get(url, headers=HEADERS)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error fetching events: API returned status {response.status_code}")
            try:
                error_details = response.json()
                print(f"Error details: {error_details}")
            except:
                print(f"Response text: {response.text}")
            return []
    except requests.exceptions.RequestException as e:
        print(f"Network error while fetching events: {e}")
        return []

def display_events(events: List[Dict]) -> None:
    """Displays a numbered list of events."""
    print("\n--- Available Events ---")
    for idx, event in enumerate(events, 1):
        print(f"{idx}. Name: {event.get('name', 'N/A')}")
        print(f"   ID: {event.get('id', 'N/A')}")
        print(f"   Slug: {event.get('slug', 'N/A')}")
        print(f"   State: {event.get('state', 'N/A')}")
        print("-" * 40)

def select_event(events: List[Dict]) -> Optional[Dict]:
    """Let user select an event from the list."""
    while True:
        try:
            choice = input("\nEnter the number of the event to delete (or 'q' to quit): ")
            if choice.lower() == 'q':
                return None
            
            idx = int(choice) - 1
            if 0 <= idx < len(events):
                return events[idx]
            else:
                print("Invalid selection. Please try again.")
        except ValueError:
            print("Please enter a valid number or 'q' to quit.")

def handle_delete_response(response, success_status_codes=(200, 204)):
    """Checks response status for DELETE operations and returns True/False."""
    if response.status_code in success_status_codes:
        print(f"Success: API returned status {response.status_code} (Event likely deleted).")
        return True
    else:
        print(f"Error: API returned status {response.status_code}")
        try:
            error_details = response.json()
            print(f"Response: {error_details}")
            message = error_details.get('error') or error_details.get('message') or str(error_details)
            print(f"API Error Details: {message}")
        except requests.exceptions.JSONDecodeError:
            # DELETE might return error messages not in JSON format
            print(f"Response Text (non-JSON): {response.text}")
        except Exception as e:
             print(f"An error occurred processing the error response: {e}")
        return False # Indicate failure

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

def check_event_state(event_data: Dict) -> bool:
    """Check if event is in a state that allows deletion."""
    state = event_data.get('state')
    print(f"\nEvent state: {state}")
    # According to docs, events can't be deleted once launched
    if state == 'launched':
        print("Warning: Cannot delete event that is already launched")
        return False
    return True

def delete_event(event_data: Dict):
    """Deletes a specific event by trying different identifier formats."""
    if not check_event_state(event_data):
        return False

    attempts = [
        (str(event_data.get('id')), 'numeric ID'),  # Try plain ID first
        (event_data.get('slug'), 'slug'),  # Then try slug
        (f"event_{event_data.get('id')}", 'event_id format'),
        (f"event-{event_data.get('id')}", 'event-id format'),
    ]

    print("\nEvent data from API:")
    print(json.dumps(event_data, indent=2))

    for identifier, id_type in attempts:
        if not identifier:
            continue
            
        url = f"{GLOWNET_API_BASE_URL}/events/{identifier}"
        print(f"\nAttempting to DELETE event with {id_type} '{identifier}'...")
        print(f"Request URL: {url}")
        print(f"Request Headers: {HEADERS}")
        
        try:
            response = requests.delete(url, headers=HEADERS)
            if response.status_code in (200, 204):
                print(f"Success with {id_type}!")
                return True
            print(f"{id_type} attempt failed with status {response.status_code}")
            try:
                error_details = response.json()
                print(f"Error details: {error_details}")
            except:
                print(f"Response text: {response.text}")
                if response.status_code == 403:
                    print("Got 403 Forbidden - This might be a permissions issue with the API key")
                elif response.status_code == 404:
                    print("Got 404 Not Found - The event might not exist or we might not have access to it")
        except requests.exceptions.RequestException as e:
            print(f"Failed with {id_type} (Network error: {e})")
    
    print("\nAll deletion attempts failed")
    print("Possible issues:")
    print("1. The API key might not have deletion permissions")
    print("2. The event might be in a state that doesn't allow deletion")
    print("3. The event might belong to a different organization")
    return False

# --- Main Interactive Script ---
if __name__ == "__main__":
    print("--- Glownet Event Deletion Tool ---")
    print("*** WARNING: This action is IRREVERSIBLE! ***")
    print(f"API Base URL: {GLOWNET_API_BASE_URL}")
    print("-" * 40)

    # Fetch all events
    print("\nFetching available events...")
    events = get_all_events()
    
    if not events:
        print("No events found or error occurred while fetching events.")
        sys.exit(1)

    # Display events and let user select one
    display_events(events)
    selected_event = select_event(events)

    if not selected_event:
        print("\nOperation cancelled by user.")
        sys.exit(0)

    # Confirm deletion
    print("\n" + "*" * 40)
    print(f"You are about to delete the following event:")
    print(f"Name: {selected_event.get('name')}")
    print(f"ID: {selected_event.get('id')}")
    print(f"Slug: {selected_event.get('slug')}")
    print("This will permanently remove the event and all associated data.")
    print("*" * 40 + "\n")

    if ask_yes_no(f"ARE YOU ABSOLUTELY SURE you want to delete this event?"):
        success = delete_event(selected_event)
        print("-" * 40)
        if success:
            print(f"Deletion command for event '{selected_event.get('name')}' sent successfully.")
            print("(Check Glownet dashboard to confirm removal)")
        else:
            print(f"Failed to delete event '{selected_event.get('name')}'. Check error messages above.")
    else:
        print("Deletion cancelled by user.")

    print("\nDeletion Script finished.") 