# samachi-app/create_glownet_test_data.py
import os
import requests
import time
import json
import sys
from faker import Faker
from dotenv import load_dotenv
from datetime import datetime, timedelta

# --- Configuration ---
# Construct the path to .env.local relative to this script file
script_dir = os.path.dirname(os.path.abspath(__file__))
dotenv_path = os.path.join(script_dir, '.env.local')
load_dotenv(dotenv_path=dotenv_path)

GLOWNET_API_BASE_URL = os.getenv("GLOWNET_API_BASE_URL", "https://opera.glownet.com")
GLOWNET_API_KEY = os.getenv("GLOWNET_API_KEY")

if not GLOWNET_API_KEY:
    print("Error: GLOWNET_API_KEY environment variable not set in .env.local")
    sys.exit(1)

HEADERS = {
    "Authorization": f"Token token={GLOWNET_API_KEY}",
    "Content-Type": "application/json",
    "Accept": "application/json"
}

FAKE = Faker()

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

def ask_int(prompt, min_val=0):
    """Asks for an integer input >= min_val."""
    while True:
        try:
            value = int(input(f"{prompt}: ").strip())
            if value >= min_val:
                return value
            else:
                print(f"Please enter a number greater than or equal to {min_val}.")
        except ValueError:
            print("Invalid input. Please enter a whole number.")

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
    try:
        response = requests.post(url, headers=HEADERS, json=payload)
        return handle_response(response, success_status_codes=(201,)) # Expect 201 Created
    except requests.exceptions.RequestException as e:
        print(f"  Network error creating event '{name}': {e}")
        return None

def create_customer(event_id):
    """Creates a single customer within the specified event."""
    url = f"{GLOWNET_API_BASE_URL}/api/v2/events/{event_id}/customers"
    payload = {
        "customer": {
            "first_name": FAKE.first_name(),
            "last_name": FAKE.last_name(),
            "email": FAKE.unique.email() # Use unique email
        }
    }
    print(f"  Creating customer: {payload['customer']['email']}...", end="", flush=True)
    try:
        FAKE.unique.clear()
        response = requests.post(url, headers=HEADERS, json=payload)
        result = handle_response(response, success_status_codes=(201,))
        if result and 'id' in result:
            print(f" Success (ID: {result['id']})")
            return result
        else:
            print(" Failed (Check API response above)")
            return None
    except requests.exceptions.RequestException as e:
        print(f" Failed (Network error: {e})")
        return None

def register_gtag(event_id, tag_uid, customer_id=None):
    """Registers a G-Tag within the specified event, optionally assigning it."""
    url = f"{GLOWNET_API_BASE_URL}/api/v2/events/{event_id}/gtags"
    payload = {"gtag": {"tag_uid": tag_uid}}
    log_message = f"  Registering G-Tag '{tag_uid}'"
    if customer_id:
        payload["gtag"]["customer_id"] = customer_id
        log_message += f" assigned to customer {customer_id}..."
    else:
        log_message += " (unassigned)..."
    print(log_message, end="", flush=True)

    try:
        response = requests.post(url, headers=HEADERS, json=payload)
        result = handle_response(response, success_status_codes=(201,))
        if result and 'id' in result:
            print(f" Success (ID: {result['id']})")
            return result
        else:
            print(" Failed (Check API response above)")
            return None
    except requests.exceptions.RequestException as e:
        print(f" Failed (Network error: {e})")
        return None

def topup_gtag(event_id, gtag_internal_id, credits):
    """Adds credits to a G-Tag within the specified event."""
    if not gtag_internal_id:
        print("  Error: Cannot topup - Missing internal G-Tag ID.")
        return None
    if credits <= 0:
        print(f"  Skipping topup for G-Tag ID {gtag_internal_id} (balance is 0 or less).")
        return None # Treat as success for summary, but don't call API

    url = f"{GLOWNET_API_BASE_URL}/api/v2/events/{event_id}/gtags/{gtag_internal_id}/topup"
    payload = {
        "credits": credits,
        "gateway": "api_script_interactive_test_data"
    }
    print(f"  Topping up G-Tag ID {gtag_internal_id} with {credits} credits...", end="", flush=True)
    try:
        response = requests.post(url, headers=HEADERS, json=payload)
        # Assume 201 is success for topup
        result = handle_response(response, success_status_codes=(201,))
        if result is not None: # API call succeeded (even if no body)
            print(" Success")
            return result
        else:
            print(" Failed (Check API response above)")
            return None
    except requests.exceptions.RequestException as e:
        print(f" Failed (Network error: {e})")
        return None

# --- Main Interactive Script ---
if __name__ == "__main__":
    print("--- Glownet Interactive Data Creator ---")
    print(f"API Base URL: {GLOWNET_API_BASE_URL}")
    print("-" * 40)

    target_event_id = None
    event_prefix = None
    created_event_info = None

    # 1. Determine Target Event
    if ask_yes_no("Do you want to create a NEW event?"):
        event_name = input("Enter the name for the new event: ").strip()
        # Add prefix length validation
        while True:
            event_prefix = input("Enter a short prefix (1-9 chars, e.g., 'fest') for G-Tags: ").strip().lower()
            if 1 <= len(event_prefix) <= 9:
                break
            else:
                print("Error: Prefix must be between 1 and 9 characters long.")
        # Use default dates/timezone for simplicity
        now = datetime.now()
        start_date = now.strftime("%d/%m/%Y %H:%M:%S")
        end_date = (now + timedelta(days=7)).strftime("%d/%m/%Y %H:%M:%S")
        timezone = "Madrid" # Or prompt user

        created_event_info = create_event(event_name, start_date, end_date, timezone)
        if created_event_info and ('id' in created_event_info or 'slug' in created_event_info):
            target_event_id = created_event_info.get('id') or created_event_info.get('slug')
            print(f"Successfully created event '{event_name}' with ID/Slug: {target_event_id}")
        else:
            print(f"Failed to create event '{event_name}'. Cannot proceed.")
            sys.exit(1)
    else:
        target_event_id = input("Enter the ID or Slug of the existing event to target: ").strip()
        # Add prefix length validation
        while True:
            event_prefix = input("Enter the short prefix (1-9 chars, e.g., 'fest') for new G-Tags: ").strip().lower()
            if 1 <= len(event_prefix) <= 9:
                break
            else:
                print("Error: Prefix must be between 1 and 9 characters long.")
        # Optionally add a check here to verify the event exists via get_event_details
        print(f"Targeting existing event: {target_event_id}")

    print("-" * 40)

    customer_ids = []
    assigned_gtag_internal_ids = []
    customers_to_create = 0
    assigned_gtags_to_create = 0
    unassigned_gtags_to_create = 0
    topup_balance = 0
    total_customers_succeeded = 0
    total_assigned_gtags_succeeded = 0
    total_unassigned_gtags_succeeded = 0
    total_topups_succeeded = 0

    # 2. Create Customers
    if ask_yes_no(f"Create customers for event '{target_event_id}'?"):
        customers_to_create = ask_int("How many customers to create?", min_val=1)
        print(f"\n--- Creating {customers_to_create} Customers ---")
        for i in range(customers_to_create):
            customer_info = create_customer(target_event_id)
            if customer_info and 'id' in customer_info:
                customer_ids.append(customer_info['id'])
                total_customers_succeeded += 1
            else:
                customer_ids.append(None) # Placeholder for failed creations
            time.sleep(0.2)
        print(f"Finished creating customers: {total_customers_succeeded} succeeded out of {customers_to_create}.")
        print("-" * 40)

    # 3. Register & Assign G-Tags (only if customers were created)
    if total_customers_succeeded > 0:
        if ask_yes_no(f"Create and assign G-Tags to the {total_customers_succeeded} new customers?"):
            max_assignable = total_customers_succeeded
            assigned_gtags_to_create = ask_int(f"How many assigned G-Tags to create (max {max_assignable})?", min_val=1)
            assigned_gtags_to_create = min(assigned_gtags_to_create, max_assignable) # Ensure we don't exceed customer count

            print(f"\n--- Registering and Assigning {assigned_gtags_to_create} G-Tags ---")
            valid_customer_ids = [cid for cid in customer_ids if cid is not None]
            for i in range(assigned_gtags_to_create):
                # Shortened UID format: {prefix}a{number:04d}
                tag_uid = f"{event_prefix}a{i+1:04d}" # Use 'a' for assigned
                customer_id = valid_customer_ids[i]

                gtag_info = register_gtag(target_event_id, tag_uid, customer_id=customer_id)
                if gtag_info and 'id' in gtag_info:
                    assigned_gtag_internal_ids.append(gtag_info['id'])
                    total_assigned_gtags_succeeded += 1
                time.sleep(0.2)
            print(f"Finished assigning G-Tags: {total_assigned_gtags_succeeded} succeeded out of {assigned_gtags_to_create}.")
            print("-" * 40)

            # 4. Topup Assigned G-Tags (only if assigned tags were created)
            if total_assigned_gtags_succeeded > 0:
                if ask_yes_no(f"Top up the {total_assigned_gtags_succeeded} newly assigned G-Tags?"):
                    topup_balance = ask_int("Enter the balance (in cents) to add to each tag", min_val=0)
                    if topup_balance > 0:
                        print(f"\n--- Topping Up {total_assigned_gtags_succeeded} Assigned G-Tags with {topup_balance} cents ---")
                        for gtag_id in assigned_gtag_internal_ids:
                            topup_result = topup_gtag(target_event_id, gtag_id, topup_balance)
                            if topup_result is not None:
                                total_topups_succeeded += 1
                            time.sleep(0.2)
                        print(f"Finished topping up: {total_topups_succeeded} succeeded out of {total_assigned_gtags_succeeded}.")
                    else:
                        print("Skipping topup as balance entered is 0.")
                    print("-" * 40)

    # 5. Register Unassigned G-Tags
    if ask_yes_no(f"Create unassigned G-Tags for event '{target_event_id}'?"):
        unassigned_gtags_to_create = ask_int("How many unassigned G-Tags to create?", min_val=1)
        print(f"\n--- Registering {unassigned_gtags_to_create} Unassigned G-Tags ---")
        for i in range(unassigned_gtags_to_create):
            # Shortened UID format: {prefix}u{number:04d}
            tag_uid = f"{event_prefix}u{i+1:04d}" # Use 'u' for unassigned
            gtag_info = register_gtag(target_event_id, tag_uid, customer_id=None)
            if gtag_info and 'id' in gtag_info:
                total_unassigned_gtags_succeeded += 1
            time.sleep(0.2)
        print(f"Finished registering unassigned G-Tags: {total_unassigned_gtags_succeeded} succeeded out of {unassigned_gtags_to_create}.")
        print("-" * 40)

    # 6. Final Summary
    print("\n" + "=" * 40)
    print("--- Data Creation Summary ---")
    print(f"Target Event ID/Slug: {target_event_id}")
    if created_event_info:
         print(f"Event Status: Newly Created")
    else:
         print(f"Event Status: Used Existing")

    if customers_to_create > 0:
        print(f"Customers: {total_customers_succeeded} / {customers_to_create} attempted")
    if assigned_gtags_to_create > 0:
        print(f"Assigned G-Tags: {total_assigned_gtags_succeeded} / {assigned_gtags_to_create} attempted")
    if topup_balance > 0 and assigned_gtags_to_create > 0:
        print(f"Topups: {total_topups_succeeded} / {total_assigned_gtags_succeeded} attempted with {topup_balance} cents each")
    if unassigned_gtags_to_create > 0:
        print(f"Unassigned G-Tags: {total_unassigned_gtags_succeeded} / {unassigned_gtags_to_create} attempted")

    if customers_to_create == 0 and assigned_gtags_to_create == 0 and unassigned_gtags_to_create == 0:
        print("No assets were requested to be created in this run.")

    print("=" * 40)
    print("Interactive Creation Script finished.")
