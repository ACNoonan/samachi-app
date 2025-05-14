import os
import requests
import json
import time
import sys
from datetime import datetime
from dotenv import load_dotenv

# --- Configuration ---
script_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(script_dir)
dotenv_path = os.path.join(parent_dir, '.env.local')

print(f"Looking for .env.local at: {dotenv_path}")
if not os.path.exists(dotenv_path):
    print(f"Warning: .env.local not found at {dotenv_path}")
else:
    print(f"Found .env.local file")
    
load_dotenv(dotenv_path=dotenv_path)

GLOWNET_API_BASE_URL = os.getenv("GLOWNET_API_BASE_URL", "https://opera.glownet.com")
GLOWNET_API_KEY = os.getenv("GLOWNET_API_KEY")
GLOWNET_UNIT_MULTIPLIER = 100 # Assumed: 1 standard unit = 100 cents
GLOWNET_TOPUP_GATEWAY = 'samachi_stake_test' # Use a distinct gateway for testing

if not GLOWNET_API_KEY:
    print("Error: GLOWNET_API_KEY environment variable not set in .env.local")
    sys.exit(1)

HEADERS = {
    "Authorization": f"Token token={GLOWNET_API_KEY}",
    "Content-Type": "application/json",
    "Accept": "application/json"
}

# --- Helper Functions (Simplified from fetch_glownet_summary.py) ---

def handle_response(response, success_status_codes=(200, 201)):
    """Checks response status and returns JSON or raises error."""
    if response.status_code in success_status_codes:
        try:
            if response.text and len(response.text) > 0 : # Check if response text is not empty
                return response.json()
            else:
                print(f"Warning: Successful status ({response.status_code}) but response body is empty.")
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
        return None

def get_all_events():
    """Fetches all events from the Glownet API."""
    url = f"{GLOWNET_API_BASE_URL}/api/v2/events"
    print(f"Fetching all events from {url}...")
    all_events = []
    page = 1
    while True:
        try:
            params = {'page': page, 'per_page': 100}
            response = requests.get(url, headers=HEADERS, params=params)
            data = handle_response(response)
            if data is None or not isinstance(data, list):
                print(f"  Failed to fetch events page {page} or invalid data received. Stopping event fetch.")
                return None
            if not data:
                print(f"  Fetched {len(all_events)} events in total.")
                break
            all_events.extend(data)
            print(f"  Fetched page {page} ({len(data)} events). Total so far: {len(all_events)}.")
            page += 1
            time.sleep(0.1)
        except requests.exceptions.RequestException as e:
            print(f"  Network error fetching events (page {page}): {e}")
            return None
    return all_events

def get_customer_details(event_id, customer_id):
    """Retrieves details for a specific customer in an event."""
    url = f"{GLOWNET_API_BASE_URL}/api/v2/events/{event_id}/customers/{customer_id}"
    print(f"Fetching details for customer {customer_id} in event {event_id} from {url}...")
    try:
        response = requests.get(url, headers=HEADERS)
        return handle_response(response)
    except requests.exceptions.RequestException as e:
        print(f"Network error fetching customer details: {e}")
        return None

def virtual_topup(event_id, customer_id, amount_standard_units):
    """Performs a virtual top-up for a customer."""
    amount_in_cents = round(amount_standard_units * GLOWNET_UNIT_MULTIPLIER)
    if amount_in_cents <= 0:
        print(f"Top-up amount ({amount_standard_units}) results in zero or negative cents. Skipping.")
        return False

    url = f"{GLOWNET_API_BASE_URL}/api/v2/events/{event_id}/customers/{customer_id}/virtual_topup"
    payload = {
        "gateway": GLOWNET_TOPUP_GATEWAY,
        "credits": amount_in_cents,
        "send_email": False,
    }
    print(f"Attempting virtual top-up for customer {customer_id} in event {event_id} with {amount_in_cents} cents ({amount_standard_units} standard units) via {url}...")
    print(f"Payload: {json.dumps(payload)}")
    try:
        response = requests.post(url, headers=HEADERS, json=payload)
        # virtual_topup usually returns 201 with empty body or specific object on success
        # handle_response will return None for empty body success.
        result = handle_response(response, success_status_codes=(200, 201, 204)) 
        if response.status_code in (200, 201, 204): # Check for explicit success codes
             print(f"Virtual top-up request successful (Status: {response.status_code}).")
             return True
        else:
            print(f"Virtual top-up failed. Status: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"Network error during virtual top-up: {e}")
        return False

# --- Main Script ---
if __name__ == "__main__":
    print("Glownet Balance Unit Verification Script")
    print(f"API Base URL: {GLOWNET_API_BASE_URL}")
    print("-" * 40)

    events = get_all_events()
    if not events:
        print("No events found or failed to fetch events. Exiting.")
        sys.exit(1)

    print("\nAvailable Events:")
    for i, event in enumerate(events):
        event_name = event.get('name', 'N/A')
        event_identifier = event.get('slug') or event.get('id', 'N/A')
        print(f"  {i + 1}. {event_name} (Identifier: {event_identifier})")
    
    selected_event_id_for_api = None
    selected_event_name = "N/A"
    while True:
        try:
            choice = input("Enter the number of the event to use: ")
            choice_idx = int(choice) - 1
            if 0 <= choice_idx < len(events):
                selected_event = events[choice_idx]
                selected_event_id_for_api = str(selected_event.get('slug') or selected_event.get('id'))
                selected_event_name = selected_event.get('name', 'N/A')
                print(f"Using event: {selected_event_name} (API Identifier: {selected_event_id_for_api})")
                break
            else:
                print("Invalid selection.")
        except ValueError:
            print("Invalid input. Please enter a number.")
    
    print("-" * 40)
    
    customer_id_to_test = None
    while not customer_id_to_test:
        customer_id_input = input(f"Enter the Customer ID (numeric) or Customer UID (string) for event '{selected_event_name}' to test: ").strip()
        if customer_id_input: # Check if input is not empty
            customer_id_to_test = customer_id_input # Store as string, API will handle if it's numeric ID or string UID
            break 
        else:
            print("Customer identifier cannot be empty. Please enter a valid ID or UID.")

    topup_amount_standard = None
    while topup_amount_standard is None:
        try:
            topup_amount_input = input(f"Enter the amount in standard units (e.g., 10.50) to top-up for Customer {customer_id_to_test}: ")
            topup_amount_standard = float(topup_amount_input)
            if topup_amount_standard <= 0:
                print("Top-up amount must be positive.")
                topup_amount_standard = None
        except ValueError:
            print("Invalid amount. Please enter a number (e.g., 10.50).")

    print("-" * 40)
    print(f"Step 1: Performing virtual top-up of {topup_amount_standard} for Customer {customer_id_to_test} in Event {selected_event_name}...")
    
    topup_success = virtual_topup(selected_event_id_for_api, customer_id_to_test, topup_amount_standard)

    if not topup_success:
        print("Top-up failed. Cannot verify balance unit. Please check logs above for errors.")
        sys.exit(1)

    print("-" * 40)
    print(f"Step 2: Fetching customer details for Customer {customer_id_to_test} to check balance...")
    time.sleep(1) # Brief pause to allow Glownet to process the topup if there's any slight delay

    customer_details = get_customer_details(selected_event_id_for_api, customer_id_to_test)

    if not customer_details:
        print(f"Failed to fetch details for customer {customer_id_to_test}. Cannot verify balance unit.")
        sys.exit(1)
        
    print("-" * 40)
    print("Verification Results:")
    print(f"  Customer ID: {customer_details.get('id')}")
    print(f"  Customer Email: {customer_details.get('email')}")
    
    virtual_money_raw = customer_details.get('virtual_money')
    money_raw = customer_details.get('money') # Also check 'money' field for comparison if available

    print(f"  Raw 'virtual_money' field from API: {virtual_money_raw} (type: {type(virtual_money_raw).__name__})")
    print(f"  Raw 'money' field from API (if present): {money_raw} (type: {type(money_raw).__name__})")
    
    print("-" * 40)
    print("Analysis:")

    parsed_virtual_money = None
    if virtual_money_raw is not None:
        try:
            parsed_virtual_money = float(virtual_money_raw)
        except ValueError:
            print(f"  Error: Could not parse 'virtual_money' field ('{virtual_money_raw}') to a number.")
    
    if parsed_virtual_money is None: # Handles both original None and parsing failure
        print("  'virtual_money' is null, not present, or could not be parsed. Cannot determine unit. Possible issues with topup or customer data.")
    # No longer strictly checking for int, as API seems to return float-like strings "1000.0"
    # elif not isinstance(virtual_money_raw, int): 
    #     print(f"  Warning: 'virtual_money' is not an integer as expected by API docs (found {type(virtual_money_raw).__name__}). This might affect unit interpretation.")
    else:
        expected_cents = round(topup_amount_standard * GLOWNET_UNIT_MULTIPLIER)
        print(f"  You topped up {topup_amount_standard} standard units, which is {expected_cents} cents.")
        
        # Compare the parsed numeric value
        if abs(parsed_virtual_money - expected_cents) < 0.001: # Using a small tolerance for float comparison
            print(f"  SUCCESS: Parsed 'virtual_money' ({parsed_virtual_money}) matches the expected value in CENTS ({expected_cents}).")
            print("  CONFIRMED: Glownet returns 'virtual_money' in CENTS (or a string representing cents).")
            print(f"  Your current \\`getGlownetCustomerVirtualBalance\\` function in \\`lib/glownet.ts\\` (which divides by {GLOWNET_UNIT_MULTIPLIER}) is LIKELY CORRECT, but ensure it parses the string to a number.")
        elif abs(parsed_virtual_money - topup_amount_standard) < 0.001: # Check if it might be already standard units
             print(f"  POTENTIAL MISMATCH: Parsed 'virtual_money' ({parsed_virtual_money}) matches the value in STANDARD UNITS you topped up ({topup_amount_standard}).")
             print("  This suggests Glownet might return 'virtual_money' in STANDARD UNITS (or a string representing standard units), not cents.")
             print(f"  If so, your \\`getGlownetCustomerVirtualBalance\\` function in \\`lib/glownet.ts\\` should NOT divide by {GLOWNET_UNIT_MULTIPLIER} (after parsing the string to a number).")
        else:
            print(f"  UNCLEAR: Parsed 'virtual_money' ({parsed_virtual_money}) does NOT directly match topped up amount in cents ({expected_cents}) OR standard units ({topup_amount_standard}).")
            print("  Further investigation needed. Consider:")
            print("    - Latency in Glownet balance updates (though a 1s pause was added).")
            print("    - Previous balance on the tag if not zeroed out.")
            print("    - Different interpretation of 'credits' vs 'money_base' in topup payload.")
            print("    - Glownet's rounding/precision for virtual_money.")

    print("-" * 40)
    print("Script finished.") 