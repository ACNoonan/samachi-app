#!/usr/bin/env python3
import os
import requests
import json
import time
import sys
from dotenv import load_dotenv

# --- Configuration ---
script_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(script_dir)
dotenv_path = os.path.join(parent_dir, '.env.local')

print(f"Looking for .env.local at: {dotenv_path}")
if not os.path.exists(dotenv_path):
    print(f"Warning: .env.local not found at {dotenv_path}. API calls may fail.")
else:
    print(f"Found .env.local file.")
    
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

# --- Helper Functions ---

def handle_response(response, success_status_codes=(200, 201, 204)):
    """Checks response status and returns JSON or raises error/returns None."""
    if response.status_code in success_status_codes:
        try:
            if response.text and len(response.text) > 0:
                return response.json()
            else: # Success, but no JSON body (e.g., 204 No Content)
                return None 
        except requests.exceptions.JSONDecodeError:
            print(f"Warning: Successful status ({response.status_code}) but could not decode JSON.")
            print(f"Response Text: {response.text}")
            return None # Still success, just no parsable body
    else:
        print(f"Error: API returned status {response.status_code}")
        try:
            error_details = response.json()
            print(f"Response: {json.dumps(error_details, indent=2)}")
            message = error_details.get('error') or error_details.get('message') or str(error_details)
            print(f"API Error Details: {message}")
        except requests.exceptions.JSONDecodeError:
            print(f"Response Text (non-JSON): {response.text}")
        return "API_ERROR" # Indicate a specific error state

def get_all_events():
    """Fetches all events from the Glownet API."""
    url = f"{GLOWNET_API_BASE_URL}/api/v2/events"
    print(f"Fetching all events from {url}...")
    all_events = []
    page = 1
    while True:
        try:
            params = {'page': page, 'per_page': 100} # Max per_page usually 100
            response = requests.get(url, headers=HEADERS, params=params)
            data = handle_response(response)
            if data == "API_ERROR":
                print(f"  Failed to fetch events page {page}. Stopping event fetch.")
                return None
            if not isinstance(data, list) or not data: # Empty list means no more pages
                print(f"  Fetched {len(all_events)} events in total.")
                break
            all_events.extend(data)
            print(f"  Fetched page {page} ({len(data)} events). Total so far: {len(all_events)}.")
            if len(data) < 100: # Last page
                print(f"  Fetched {len(all_events)} events in total.")
                break
            page += 1
            time.sleep(0.1) # Be nice to the API
        except requests.exceptions.RequestException as e:
            print(f"  Network error fetching events (page {page}): {e}")
            return None
    return all_events

def get_all_customers_for_event(event_api_id):
    """Fetches all customers for a specific event, handling pagination."""
    url = f"{GLOWNET_API_BASE_URL}/api/v2/events/{event_api_id}/customers"
    print(f"Fetching all customers for event '{event_api_id}' from {url}...")
    all_customers = []
    page = 1
    while True:
        try:
            params = {'page': page, 'per_page': 100}
            response = requests.get(url, headers=HEADERS, params=params)
            data = handle_response(response)
            
            if data == "API_ERROR":
                print(f"  Failed to fetch customers page {page} for event '{event_api_id}'. Stopping.")
                return None # Indicate failure
            if not isinstance(data, list) or not data: # Empty list means no more pages or no customers
                print(f"  Fetched {len(all_customers)} customers in total for event '{event_api_id}'.")
                break
            
            all_customers.extend(data)
            print(f"  Fetched page {page} ({len(data)} customers). Total so far: {len(all_customers)} for event '{event_api_id}'.")
            
            if len(data) < 100: # Last page
                print(f"  Fetched {len(all_customers)} customers in total for event '{event_api_id}'.")
                break
            page += 1
            time.sleep(0.1) 
        except requests.exceptions.RequestException as e:
            print(f"  Network error fetching customers for event '{event_api_id}' (page {page}): {e}")
            return None # Indicate failure
    return all_customers
    
def get_customer_details(event_api_id, customer_id):
    """Retrieves details (including balances) for a specific customer in an event."""
    url = f"{GLOWNET_API_BASE_URL}/api/v2/events/{event_api_id}/customers/{customer_id}"
    # print(f"Fetching details for customer {customer_id} in event {event_api_id}...")
    try:
        response = requests.get(url, headers=HEADERS)
        # Allow 404 as a possible outcome, return None instead of "API_ERROR" for it
        if response.status_code == 404:
            print(f"  Warning: Customer {customer_id} not found (404).")
            return None 
        return handle_response(response) # handle_response checks for other errors
    except requests.exceptions.RequestException as e:
        print(f"Network error fetching customer details for {customer_id}: {e}")
        return None

def attempt_customer_refund(event_api_id, customer_id, gateway="samachi_settlement"):
    """Attempts to perform a refund operation for a customer, potentially zeroing balance."""
    url = f"{GLOWNET_API_BASE_URL}/api/v2/events/{event_api_id}/customers/{customer_id}/refund"
    payload = {
        "gateway": gateway,
        "send_email": False  # Explicitly set to false
    }
    print(f"Attempting refund/settlement for customer {customer_id} in event {event_api_id} via {url}...")
    print(f"Payload: {json.dumps(payload)}")
    try:
        response = requests.post(url, headers=HEADERS, json=payload)
        
        # Check common success codes for creation/action (200, 201, 204)
        result = handle_response(response, success_status_codes=(200, 201, 204)) 
        
        if result != "API_ERROR" and response.status_code in (200, 201, 204):
            print(f"  Successfully sent refund/settlement request for customer {customer_id}. Status: {response.status_code}. Response body: {response.text[:150]}...")
            return True
        else:
            # Specific handling for 422 if it means "no balance to refund" vs other errors
            if response.status_code == 422:
                 print(f"  Refund/Settlement failed for customer {customer_id} (Status: 422). This might indicate no refundable balance or other validation error.")
            else:
                 print(f"  Refund/Settlement failed for customer {customer_id}. Status: {response.status_code}.")
            return False
    except requests.exceptions.RequestException as e:
        print(f"  Network error during refund/settlement for customer {customer_id}: {e}")
        return False

# --- Main Script ---
if __name__ == "__main__":
    print("\nGlownet Customer Balance Reset Script")
    print(f"API Base URL: {GLOWNET_API_BASE_URL}")
    print("WARNING: This script will attempt to reset (zero out) balances on Glownet tags.")
    print("Ensure you are targeting the correct event and understand the implications.")
    print("-" * 50)

    events = get_all_events()
    if not events:
        print("No events found or failed to fetch events. Exiting.")
        sys.exit(1)

    print("\nAvailable Events:")
    for i, event in enumerate(events):
        event_name = event.get('name', 'N/A')
        event_identifier = event.get('slug') or event.get('id', 'N/A') # Prefer slug if available
        print(f"  {i + 1}. {event_name} (Identifier: {event_identifier}, ID: {event.get('id')})")
    
    selected_event_obj = None
    selected_event_api_id = None # This will be the slug or ID for API calls
    while True:
        try:
            choice = input("Enter the number of the event to process: ")
            choice_idx = int(choice) - 1
            if 0 <= choice_idx < len(events):
                selected_event_obj = events[choice_idx]
                # Use slug for API calls if available, otherwise fall back to id
                selected_event_api_id = str(selected_event_obj.get('slug') or selected_event_obj.get('id'))
                print(f"You selected event: '{selected_event_obj.get('name', 'N/A')}' (Using API Identifier: '{selected_event_api_id}')")
                break
            else:
                print("Invalid selection.")
        except ValueError:
            print("Invalid input. Please enter a number.")
    
    print("-" * 50)
    print(f"Fetching customers for event '{selected_event_obj.get('name', 'N/A')}' to check balances...")
    
    customers = get_all_customers_for_event(selected_event_api_id)
    if customers is None: # Indicates an error during fetch
        print(f"Could not retrieve customers for event '{selected_event_api_id}'. Exiting.")
        sys.exit(1)
    if not customers:
        print(f"No customers found for event '{selected_event_api_id}'. Nothing to do.")
        sys.exit(0)

    customers_with_balance = []
    print("Checking customer balances (this might take a moment for many customers)...")
    for i, cust_summary in enumerate(customers):
        customer_id = cust_summary.get('id')
        if not customer_id:
            print(f"  Skipping customer entry with no ID: {cust_summary}")
            continue

        # Fetch full details to get accurate balances, as summary might not have them or they might be stale.
        # The summary 'virtual_money' and 'money' are often strings and might be 0.0 even with balance.
        # Need to check 'balances' object from detailed customer view typically.
        
        # For this script, let's primarily check 'virtual_money' from the summary
        # and then confirm with detailed view if it looks non-zero, or if 'balances' object indicates value.
        
        vm_summary_str = str(cust_summary.get('virtual_money', '0')).strip()
        m_summary_str = str(cust_summary.get('money', '0')).strip()
        
        try:
            vm_summary_val = float(vm_summary_str)
            m_summary_val = float(m_summary_str)
        except ValueError:
            # print(f"  Could not parse summary balance for customer {customer_id}. Fetching details.")
            vm_summary_val = 0.0
            m_summary_val = 0.0
            
        has_any_balance = False
        if vm_summary_val > 0 or m_summary_val > 0:
            has_any_balance = True
        
        # Also check the 'balances' object if present in summary, as it might be more accurate
        # Glownet 'balances' object keys are usually credit type IDs (as strings)
        balances_summary = cust_summary.get('balances')
        if isinstance(balances_summary, dict):
            for credit_type_id, balance_val_str in balances_summary.items():
                try:
                    if float(str(balance_val_str)) > 0:
                        has_any_balance = True
                        break
                except ValueError:
                    continue # ignore unparsable balance values

        if has_any_balance:
            # To be sure, fetch full details as summary balances can be tricky
            print(f"  Customer {customer_id} (Summary VM: {vm_summary_str}, M: {m_summary_str}) might have a balance. Fetching details...")
            details = get_customer_details(selected_event_api_id, customer_id)
            if details:
                detailed_vm_str = str(details.get('virtual_money', '0')).strip()
                detailed_m_str = str(details.get('money', '0')).strip()
                detailed_balances = details.get('balances') # This is the most reliable
                
                display_vm = "0"
                display_m = "0"
                actual_balance_found = False

                try: # Check detailed virtual_money
                    if float(detailed_vm_str) > 0:
                        display_vm = detailed_vm_str
                        actual_balance_found = True
                except ValueError: pass
                
                try: # Check detailed money
                    if float(detailed_m_str) > 0:
                        display_m = detailed_m_str
                        actual_balance_found = True
                except ValueError: pass

                # More robust check using the 'balances' dictionary
                if isinstance(detailed_balances, dict):
                    for b_id, b_val_str in detailed_balances.items():
                        try:
                            if float(str(b_val_str)) > 0:
                                actual_balance_found = True
                                # Update display strings if these are more specific and non-zero
                                # This part might need refinement based on which balance you prioritize showing
                                if b_id == str(selected_event_obj.get('virtual_credit', {}).get('id')):
                                    display_vm = str(b_val_str)
                                elif b_id == str(selected_event_obj.get('credit', {}).get('id')):
                                    display_m = str(b_val_str)
                                break # Found a non-zero balance in the dict
                        except ValueError:
                            continue
                
                if actual_balance_found:
                    name = f"{details.get('first_name', '')} {details.get('last_name', '')}".strip() or "N/A"
                    email = details.get('email', 'N/A')
                    customers_with_balance.append({
                        "id": customer_id,
                        "name": name,
                        "email": email,
                        "virtual_money": display_vm, # Show from details
                        "money": display_m, # Show from details
                        "balances_obj": detailed_balances # Store for reference
                    })
                    print(f"    -> Confirmed balance for Customer ID: {customer_id}, Name: {name}, Email: {email}, Virtual: {display_vm}, Standard: {display_m}")
            else:
                print(f"  Could not fetch details for customer {customer_id} to confirm balance.")
        
        if (i + 1) % 10 == 0: # Progress update
            print(f"  Checked {i+1}/{len(customers)} customers...")

    if not customers_with_balance:
        print("\nNo customers found with a non-zero virtual or standard money balance in their detailed view for this event.")
        sys.exit(0)

    print("\nCustomers with detected non-zero balances:")
    print("-" * 50)
    for idx, cust_info in enumerate(customers_with_balance):
        print(f"  {idx + 1}. ID: {cust_info['id']}, Name: {cust_info['name']}, Email: {cust_info['email']}")
        print(f"     Virtual Money: {cust_info['virtual_money']}, Standard Money: {cust_info['money']}")
        if cust_info['balances_obj']:
             print(f"     Balances Object: {json.dumps(cust_info['balances_obj'])}")
        print("-" * 20)

    print("\nProceed with resetting tags for these customers?")
    confirm_all = input("Reset ALL listed customers? (yes/no): ").strip().lower()

    reset_count = 0
    if confirm_all == 'yes':
        print("\n--- Processing ALL listed customers ---")
        for cust_info in customers_with_balance:
            print(f"Attempting refund/settlement for Customer ID: {cust_info['id']}...")
            # *** Use the new refund function ***
            if attempt_customer_refund(selected_event_api_id, cust_info['id']):
                reset_count += 1
            else:
                 print(f"  Failed or skipped for Customer ID: {cust_info['id']}.")
            time.sleep(0.3) # API niceness - slightly increased delay
    else:
        print("You chose not to reset all. Please confirm for each customer.")
        for cust_info in customers_with_balance:
            confirm_individual = input(f"Attempt refund/settlement for Customer ID: {cust_info['id']} ({cust_info['name']})? (yes/no): ").strip().lower()
            if confirm_individual == 'yes':
                print(f"Attempting refund/settlement for Customer ID: {cust_info['id']}...")
                 # *** Use the new refund function ***
                if attempt_customer_refund(selected_event_api_id, cust_info['id']):
                    reset_count +=1
                else:
                    print(f"  Failed or skipped for Customer ID: {cust_info['id']}.")
                time.sleep(0.3) # API niceness
            else:
                print(f"  Skipping refund/settlement for customer {cust_info['id']}.")

    print("-" * 50)
    print(f"Script finished. Attempted refund/settlement for {reset_count} customer(s).")
    print("IMPORTANT: Please manually verify the balances and check for any refund records in Glownet for the processed customers.") 