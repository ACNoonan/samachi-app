# samachi-app/delete_glownet_data.py
import os
import requests
import sys
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
    "Authorization": f"Token token={GLOWNET_API_KEY}",
    "Accept": "application/json" # Content-Type not usually needed for DELETE
}

# --- Helper Functions ---

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

def delete_event(event_id):
    """Deletes a specific event by its ID or Slug."""
    url = f"{GLOWNET_API_BASE_URL}/api/v2/events/{event_id}"
    print(f"\nAttempting to DELETE event: {event_id} from {url}...", end="", flush=True)
    try:
        response = requests.delete(url, headers=HEADERS)
        return handle_delete_response(response) # Use specific handler for DELETE
    except requests.exceptions.RequestException as e:
        print(f" Failed (Network error: {e})")
        return False

# --- Main Interactive Script ---
if __name__ == "__main__":
    print("--- Glownet Event Deletion Tool ---")
    print("*** WARNING: This action is IRREVERSIBLE! ***")
    print(f"API Base URL: {GLOWNET_API_BASE_URL}")
    print("-" * 40)

    event_id_to_delete = input("Enter the ID or Slug of the event you want to delete: ").strip()

    if not event_id_to_delete:
        print("No event ID/Slug entered. Exiting.")
        sys.exit(0)

    print("\n" + "*" * 40)
    print(f"You are about to delete the event with ID/Slug: '{event_id_to_delete}'")
    print("This will permanently remove the event and potentially associated data.")
    print("*" * 40 + "\n")

    if ask_yes_no(f"ARE YOU ABSOLUTELY SURE you want to delete event '{event_id_to_delete}'?"):
        success = delete_event(event_id_to_delete)
        print("-" * 40)
        if success:
            print(f"Deletion command for event '{event_id_to_delete}' sent successfully.")
            print("(Check Glownet dashboard to confirm removal)")
        else:
            print(f"Failed to delete event '{event_id_to_delete}'. Check error messages above.")
    else:
        print("Deletion cancelled by user.")

    print("\nDeletion Script finished.") 