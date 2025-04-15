import os
import requests
import json
import time
import sys
from datetime import datetime
from dotenv import load_dotenv

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

TARGET_EVENT_ID = "test1" # The specific event ID/slug to fetch
SUMMARY_FILE_PATH = os.path.join(script_dir, "glownet_test_data_summary.json")

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
        # Instead of raising, return None to indicate failure to the caller
        return None

def get_event_details(event_id):
    """Retrieves the full details for a single specific event."""
    url = f"{GLOWNET_API_BASE_URL}/api/v2/events/{event_id}"
    print(f"  Fetching Details for Event '{event_id}' from {url}...")
    try:
        response = requests.get(url, headers=HEADERS)
        return handle_response(response, success_status_codes=(200,))
    except requests.exceptions.RequestException as e:
        print(f"  Network error fetching event details for '{event_id}': {e}")
        return None

def get_event_customers(event_id):
    """Retrieves all customers for a specific event."""
    url = f"{GLOWNET_API_BASE_URL}/api/v2/events/{event_id}/customers"
    print(f"  Fetching Customers for Event '{event_id}' from {url}...")
    all_customers = []
    page = 1
    while True:
        try:
            params = {'page': page}
            response = requests.get(url, headers=HEADERS, params=params)
            data = handle_response(response, success_status_codes=(200,))

            if data is None:
                print(f"  Failed to fetch customer page {page}. Stopping customer fetch.")
                return None # Indicate overall failure

            if isinstance(data, list):
                if not data: # Empty list indicates end of pages
                    print(f"  Fetched {len(all_customers)} customers in total.")
                    break
                all_customers.extend(data)
                print(f"  Fetched page {page} ({len(data)} customers). Total so far: {len(all_customers)}.")
                page += 1
            else:
                print(f"  Error: Expected a list of customers but received type {type(data)}. Data: {data}")
                return None # Indicate failure

            time.sleep(0.1) # Be nice to the API

        except requests.exceptions.RequestException as e:
            print(f"  Network error fetching customers (page {page}) for '{event_id}': {e}")
            return None # Indicate overall failure

    return all_customers

def get_event_gtags(event_id):
    """Retrieves all G-Tags (assets) for a specific event."""
    url = f"{GLOWNET_API_BASE_URL}/api/v2/events/{event_id}/gtags"
    print(f"  Fetching G-Tags for Event '{event_id}' from {url}...")
    all_gtags = []
    page = 1
    while True:
        try:
            params = {'page': page}
            response = requests.get(url, headers=HEADERS, params=params)
            data = handle_response(response, success_status_codes=(200,))

            if data is None:
                print(f"  Failed to fetch G-Tag page {page}. Stopping G-Tag fetch.")
                return None # Indicate overall failure

            if isinstance(data, list):
                if not data: # Empty list indicates end of pages
                    print(f"  Fetched {len(all_gtags)} G-Tags in total.")
                    break
                all_gtags.extend(data)
                print(f"  Fetched page {page} ({len(data)} G-Tags). Total so far: {len(all_gtags)}.")
                page += 1
            else:
                print(f"  Error: Expected a list of G-Tags but received type {type(data)}. Data: {data}")
                return None # Indicate failure

            time.sleep(0.1) # Be nice to the API

        except requests.exceptions.RequestException as e:
            print(f"  Network error fetching G-Tags (page {page}) for '{event_id}': {e}")
            return None # Indicate overall failure

    return all_gtags

def print_formatted_summary(timestamp, event_details, customers_list, gtags_list, error_message):
    """Prints a formatted summary of the fetched data to the console."""
    print("\n" + "=" * 40)
    print(f"--- Summary of Fetched Data ({timestamp}) ---")
    print(f"Target Event: {TARGET_EVENT_ID}")
    print("-" * 40)

    if error_message:
        print(f"Error during fetch: {error_message}")
        print("No data to display.")
        print("=" * 40)
        return

    # Event Details
    if event_details:
        print("Event Details (1):")
        # Print selected event details, adjust keys as needed
        details_to_show = ['id', 'slug', 'name', 'status', 'start_date', 'end_date', 'timezone']
        for key in details_to_show:
            if key in event_details:
                 print(f"  {key}: {event_details[key]}")
            else:
                 print(f"  {key}: (Not available)")
    else:
        print("Event Details: Not Fetched")

    print("-" * 40)

    # Customers
    if customers_list is not None:
        print(f"Customers ({len(customers_list)}):")
        if customers_list:
            for customer in customers_list:
                cust_id = customer.get('id', 'N/A')
                fname = customer.get('first_name', '')
                lname = customer.get('last_name', '')
                email = customer.get('email', 'N/A')
                print(f"  - ID: {cust_id}, Name: {fname} {lname}, Email: {email}")
        else:
            print("  (No customers found for this event)")
    else:
        print("Customers: Not Fetched or Fetch Failed")

    print("-" * 40)

    # G-Tags
    if gtags_list is not None:
        print(f"G-Tags ({len(gtags_list)}):")
        if gtags_list:
            for gtag in gtags_list:
                gtag_id = gtag.get('id', 'N/A')
                tag_uid = gtag.get('tag_uid', 'N/A')
                status = gtag.get('status', 'N/A')
                balance = gtag.get('balance', {'cents': 'N/A'}).get('cents', 'N/A')
                cust_id = gtag.get('customer_id', 'None') # Show 'None' if unassigned
                print(f"  - ID: {gtag_id}, UID: {tag_uid}, Status: {status}, Balance: {balance}, Cust ID: {cust_id}")
        else:
             print("  (No G-Tags found for this event)")
    else:
        print("G-Tags: Not Fetched or Fetch Failed")

    print("=" * 40)

# --- Main Script ---
if __name__ == "__main__":
    print(f"Starting Glownet data summary fetch for Event: {TARGET_EVENT_ID}")
    print(f"API Base URL: {GLOWNET_API_BASE_URL}")
    print("-" * 30)

    fetch_timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    event_details = None
    customers_list = None
    gtags_list = None
    error_message = None

    # 1. Fetch data for the target event
    print(f"Fetching data for Event '{TARGET_EVENT_ID}'...")
    try:
        event_details = get_event_details(TARGET_EVENT_ID)
        if event_details is not None:
            # Only fetch children if event details were retrieved
            customers_list = get_event_customers(TARGET_EVENT_ID)
            gtags_list = get_event_gtags(TARGET_EVENT_ID)
            if customers_list is None or gtags_list is None:
                error_message = "Failed to retrieve customers or G-Tags."
        else:
            error_message = f"Failed to retrieve details for event '{TARGET_EVENT_ID}'. It might not exist or API error occurred."

    except Exception as e:
        # Catch any unexpected errors during the fetch process
        print(f"An unexpected error occurred during data fetch: {e}")
        error_message = f"Unexpected error: {str(e)}"

    # 2. Prepare the summary entry for this run
    current_summary_entry = {
        "timestamp": fetch_timestamp,
        "target_event_id": TARGET_EVENT_ID,
        "event_details": event_details, # Will be None if fetch failed
        "customers": customers_list, # Will be None if fetch failed
        "gtags": gtags_list, # Will be None if fetch failed
        "error": error_message # Will be None if everything succeeded
    }

    if error_message:
        print(f"Summary generation completed with errors: {error_message}")
    else:
        print("Summary generation completed successfully.")

    # 3. Load existing data and append the new entry
    print(f"Loading existing summary data from {SUMMARY_FILE_PATH}...")
    all_summaries = []
    try:
        # Check if file exists before trying to open
        if os.path.exists(SUMMARY_FILE_PATH):
            with open(SUMMARY_FILE_PATH, 'r', encoding='utf-8') as f:
                try:
                    all_summaries = json.load(f)
                    # Basic validation: Is it a list?
                    if not isinstance(all_summaries, list):
                        print(f"Warning: Existing summary file '{SUMMARY_FILE_PATH}' does not contain a valid JSON list. Starting fresh.")
                        all_summaries = []
                    else:
                        print(f"  Loaded {len(all_summaries)} existing summary entries.")
                except json.JSONDecodeError:
                    print(f"Warning: Could not decode JSON from '{SUMMARY_FILE_PATH}'. Starting fresh.")
                    all_summaries = []
        else:
             print("  Summary file does not exist. Creating a new one.")
             all_summaries = [] # Ensure it's a list if file doesn't exist

    except IOError as e:
        print(f"Error reading summary file '{SUMMARY_FILE_PATH}': {e}. Proceeding with empty data.")
        all_summaries = []
    except Exception as e:
        # Catch other potential errors during file loading
        print(f"An unexpected error occurred loading the summary file: {e}. Proceeding with empty data.")
        all_summaries = []

    # Append the new summary
    all_summaries.append(current_summary_entry)
    print(f"Appended new summary. Total entries now: {len(all_summaries)}")

    # 4. Write updated data back to the file
    print(f"Writing updated summary data to {SUMMARY_FILE_PATH}...")
    try:
        with open(SUMMARY_FILE_PATH, 'w', encoding='utf-8') as f:
            json.dump(all_summaries, f, indent=4, ensure_ascii=False)
        print("Successfully wrote updated summary.")
    except IOError as e:
        print(f"Error writing updated summary file: {e}")
    except Exception as e:
        print(f"An unexpected error occurred writing the summary file: {e}")

    # Print the formatted summary of the *current* fetch to the console
    print_formatted_summary(fetch_timestamp, event_details, customers_list, gtags_list, error_message)

    print("-" * 30)
    print("Summary Fetch Script finished.") 