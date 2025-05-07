/**
 * Glownet API Client Helpers
 */

const GLOWNET_API_BASE_URL = process.env.GLOWNET_API_BASE_URL || 'https://opera.glownet.com/api/v2';
const GLOWNET_API_KEY = process.env.GLOWNET_API_KEY;

// --- Configuration ---
// Assumed conversion: 1 standard unit (e.g., EUR, USDC) = 100 Glownet credits/money units (cents)
const GLOWNET_UNIT_MULTIPLIER = 100;
const GLOWNET_TOPUP_GATEWAY = 'samachi_stake'; // Custom identifier for our topups

interface GlownetErrorResponse {
  error?: string;
  errors?: Record<string, any>; // For validation errors
  message?: string;
}

async function makeGlownetRequest<T = any>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  body?: Record<string, any>
): Promise<T> {
  if (!GLOWNET_API_KEY) {
    console.error('[Glownet] CRITICAL: Glownet API key (GLOWNET_API_KEY) is not configured.');
    throw new Error('Glownet API key is not configured.');
  }

  const url = `${GLOWNET_API_BASE_URL}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      'Authorization': `Token token=${GLOWNET_API_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    // Add keepalive for potentially longer operations, consider timeout if needed
    // keepalive: true, 
  };

  if (body && (method === 'POST' || method === 'PATCH')) {
    options.body = JSON.stringify(body);
  }

  console.log(`[Glownet] Request: ${method} ${url}`, body ? `Body: ${JSON.stringify(body)}` : '');
  try {
    const response = await fetch(url, options);
    let responseText = await response.text(); // Read text early for all responses

    if (!response.ok) {
      let errorData: GlownetErrorResponse = {};
      try {
        errorData = JSON.parse(responseText);
      } catch (parseError) {
        console.warn(`[Glownet] API response for ${method} ${url} (Status: ${response.status}) was not valid JSON:`, responseText);
      }
      
      const errorMessage = 
        errorData.error || 
        errorData.message || 
        (errorData.errors ? JSON.stringify(errorData.errors) : null) || 
        responseText || 
        `Glownet API request failed with status ${response.status}`;
        
      console.error(`[Glownet] API Error: ${method} ${url} (Status: ${response.status}) Message: ${errorMessage}`, errorData);
      throw new Error(`Glownet API Error: ${errorMessage}`);
    }

    if (response.status === 201 || response.status === 204 || responseText.length === 0) {
        console.log(`[Glownet] Response: ${method} ${url} (Status: ${response.status}, No/Empty Content)`);
        return {} as T;
    }
    
    const responseData = JSON.parse(responseText); // Already have text, parse it
    console.log(`[Glownet] Response: ${method} ${url} (Status: ${response.status}) Data:`, responseData);
    return responseData as T;

  } catch (error: any) {
    console.error(`[Glownet] Network/Fetch Error: ${method} ${url}:`, error);
    if (error.message.startsWith('Glownet API Error:')) {
        throw error;
    }
    throw new Error(`Failed to communicate with Glownet API: ${error.message}`); 
  }
}

/**
 * Performs a virtual top-up for a customer.
 * @param eventId Glownet event ID or slug.
 * @param customerId Glownet customer ID.
 * @param amountStandardUnits Amount to top-up in standard currency units (e.g., 10.50).
 * @returns Promise<void>
 * @throws Error if API call fails
 */
export async function glownetVirtualTopup(
  eventId: number | string,
  customerId: number,
  amountStandardUnits: number
): Promise<void> {
  const amountInCents = Math.round(amountStandardUnits * GLOWNET_UNIT_MULTIPLIER);
  
  if (amountInCents <= 0) {
    console.warn(`[Glownet] glownetVirtualTopup: Attempted top-up with zero/negative amount (${amountStandardUnits}), skipping.`);
    return; 
  }

  const endpoint = `/events/${eventId}/customers/${customerId}/virtual_topup`;
  const payload = {
    gateway: GLOWNET_TOPUP_GATEWAY,
    credits: amountInCents,
    // money_base: amountInCents, // Still unclear if needed for virtual topup, omitting.
    send_email: false, 
  };

  try {
    await makeGlownetRequest<void>(endpoint, 'POST', payload);
    console.log(`[Glownet] Virtual top-up success: Customer ${customerId}, Event ${eventId}, Amount ${amountStandardUnits}`);
  } catch (error) {
      console.error(`[Glownet] Virtual top-up failed: Customer ${customerId}, Event ${eventId}, Amount ${amountStandardUnits}. Error:`, error);
      throw error; 
  }
}

// Interface for the relevant parts of the Glownet Customer response
export interface GlownetCustomer {
    id: number;
    virtual_money: number | null; 
    money?: number | null; 
    balances?: any; // Add balances, define more strictly if structure is known
    // Add other fields if needed (e.g., first_name, last_name for logging)
}

/**
 * Gets customer details from Glownet.
 * @param eventId Glownet event ID or slug.
 * @param customerId Glownet customer ID.
 * @returns Promise<GlownetCustomer> The customer\'s details.
 * @throws Error if API call fails.
 */
export async function getGlownetCustomerDetails(
    eventId: number | string,
    customerId: number
): Promise<GlownetCustomer> {
    const endpoint = `/events/${eventId}/customers/${customerId}`;
    console.log(`[Glownet] getGlownetCustomerDetails: Fetching for Event ${eventId}, Customer ${customerId}`);
    try {
        const customerData = await makeGlownetRequest<GlownetCustomer>(endpoint, 'GET');
        if (!customerData || typeof customerData.id === 'undefined') { // Check if id is undefined, as it should always be present
            console.error(`[Glownet] No valid data (or ID missing) from Glownet for customer ${customerId}, event ${eventId}. Response:`, customerData);
            throw new Error(`No valid data received from Glownet for customer ${customerId}, event ${eventId}.`);
        }
        console.log(`[Glownet] Customer details fetched: Event ${eventId}, Customer ${customerId}:`, customerData);
        return customerData;
    } catch (error) {
        console.error(`[Glownet] Failed to get customer details: Event ${eventId}, Customer ${customerId}. Error:`, error);
        throw error; 
    }
}

/**
 * Retrieves the virtual balance for a customer from Glownet and converts it to standard units.
 * Assumes virtual_money is returned in cents from Glownet.
 * @param eventId Glownet event ID or slug.
 * @param customerId Glownet customer ID.
 * @returns Promise<number> The customer\'s virtual balance in standard currency units.
 * @throws Error if API call fails or balance cannot be determined.
 */
export async function getGlownetCustomerVirtualBalance(
  eventId: number | string,
  customerId: number
): Promise<number> {
  console.log(`[Glownet] getGlownetCustomerVirtualBalance: Getting balance for Event ${eventId}, Customer ${customerId}`);
  try {
    const customerDetails = await getGlownetCustomerDetails(eventId, customerId);
    
    if (customerDetails.virtual_money === null || typeof customerDetails.virtual_money === 'undefined') {
      console.warn(`[Glownet] Virtual money is null or undefined for customer ${customerId}, event ${eventId}. Assuming 0 balance.`);
      return 0; // Or throw an error if this case is unexpected
    }

    // Assuming virtual_money from Glownet is in cents
    const balanceInStandardUnits = customerDetails.virtual_money / GLOWNET_UNIT_MULTIPLIER;
    console.log(`[Glownet] Retrieved virtual_money: ${customerDetails.virtual_money} (cents), Converted to standard units: ${balanceInStandardUnits}`);
    return balanceInStandardUnits;

  } catch (error) {
    console.error(`[Glownet] Failed to get virtual balance: Event ${eventId}, Customer ${customerId}. Error:`, error);
    // Re-throw the error to be handled by the calling route
    throw error; 
  }
}

// Add other Glownet helper functions as needed 

// Interface for Glownet API Customer (Subset of fields)
interface GlownetAPICustomer {
  id: number; // Actually a string in API docs, but example shows integer. Assuming number based on existing GlownetCustomer.id
  email?: string;
  first_name?: string;
  last_name?: string;
  // Add other fields if needed from Glownet API documentation
}

/**
 * Searches for a Glownet customer by email within a specific event.
 * @param glownetEventId Glownet event ID or slug.
 * @param email Email of the customer to search for.
 * @returns Promise<GlownetAPICustomer | null> The customer object if found, otherwise null.
 */
async function searchGlownetCustomerByEmail(
  glownetEventId: number | string,
  email: string
): Promise<GlownetAPICustomer | null> {
  const endpoint = `/events/${glownetEventId}/customers/search`;
  const payload = { email };
  console.log(`[Glownet] searchGlownetCustomerByEmail: Searching for email ${email} in Event ${glownetEventId}`);
  try {
    const customer = await makeGlownetRequest<GlownetAPICustomer>(endpoint, 'POST', payload);
    if (customer && customer.id) {
      console.log(`[Glownet] Customer found by email ${email} in Event ${glownetEventId}:`, customer);
      return customer;
    }
    console.log(`[Glownet] Customer with email ${email} NOT FOUND (or response invalid) in Event ${glownetEventId}. Response:`, customer);
    return null;
  } catch (error: any) {
    if (error.message && (error.message.includes('Status 404') || error.message.toLowerCase().includes('couldn\'t find resource') || error.message.toLowerCase().includes('not found'))) {
      console.log(`[Glownet] Customer with email ${email} not found in Event ${glownetEventId} (API 404).`);
      return null;
    }
    console.error(`[Glownet] Error searching customer by email ${email} in Event ${glownetEventId}:`, error);
    return null; 
  }
}

/**
 * Creates a new customer in Glownet for a specific event.
 * @param glownetEventId Glownet event ID or slug.
 * @param userProfile Object containing user details (email, username).
 * @returns Promise<GlownetAPICustomer | null> The created customer object, or null on failure.
 */
async function createGlownetCustomer(
  glownetEventId: number | string,
  userProfile: { email: string; username?: string }
): Promise<GlownetAPICustomer | null> {
  const endpoint = `/events/${glownetEventId}/customers`;
  console.log(`[Glownet] createGlownetCustomer: Attempting to create customer for email ${userProfile.email} in Event ${glownetEventId}`, userProfile);
  
  let firstName = '';
  let determinedLastName = '';

  if (userProfile.username && userProfile.username.trim()) {
    const nameParts = userProfile.username.trim().split(' ');
    firstName = nameParts[0];
    if (nameParts.length > 1) {
      determinedLastName = nameParts.slice(1).join(' ');
    }
  }
  
  if (!firstName) {
    firstName = userProfile.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') || 'User';
  }
  if (!determinedLastName) {
    determinedLastName = '-'; 
  }

  const payload = {
    customer: {
      email: userProfile.email,
      first_name: firstName,
      last_name: determinedLastName, 
      send_welcome_email: false,
    },
  };
  console.log(`[Glownet] Creating customer in Event ${glownetEventId} with payload:`, JSON.stringify(payload));

  try {
    const newCustomer = await makeGlownetRequest<GlownetAPICustomer>(endpoint, 'POST', payload);

    // If creation returned a 201 with an empty body, newCustomer might be {} (truthy) but newCustomer.id would be undefined.
    // In this case, try to immediately fetch the customer by email as they should now exist.
    if (newCustomer && !newCustomer.id) {
      console.log(`[Glownet] Customer creation POST returned 201 but no ID in response body. Attempting to re-fetch by email: ${userProfile.email}`);
      const fetchedCustomer = await searchGlownetCustomerByEmail(glownetEventId, userProfile.email);
      if (fetchedCustomer && fetchedCustomer.id) {
        console.log(`[Glownet] Successfully re-fetched customer by email after creation:`, fetchedCustomer);
        return fetchedCustomer;
      } else {
        console.error(`[Glownet] Failed to re-fetch customer by email after 201 creation. This is unexpected if creation was truly successful.`);
        return null; // Or handle as a more critical error if necessary
      }
    }

    if (newCustomer && newCustomer.id) {
      console.log(`[Glownet] Customer created successfully (ID from POST response) in Event ${glownetEventId}:`, newCustomer);
      return newCustomer;
    }
    
    console.log(`[Glownet] Failed to create customer (or response invalid/no ID) in Event ${glownetEventId}. Response:`, newCustomer);
    return null;
  } catch (error) {
    console.error(`[Glownet] Error during createGlownetCustomer for ${userProfile.email} in Event ${glownetEventId}:`, error);
    return null;
  }
}


/**
 * Gets an existing Glownet customer ID or creates a new one for the user.
 * @param glownetEventId Glownet event ID or slug (number or string).
 * @param userProfile Object containing user details like email and username.
 *                  `email` is required. `username` is used for first/last name if creating.
 * @returns Promise<number | null> The Glownet customer ID, or null if operation failed.
 */
export async function getOrCreateGlownetCustomer(
  glownetEventId: number | string,
  userProfile: { email?: string; username?: string }
): Promise<number | null> {
  console.log('[Glownet] getOrCreateGlownetCustomer called with:', { glownetEventId, userProfile });

  if (!userProfile.email || userProfile.email.trim() === '') {
    console.error('[Glownet] CRITICAL: getOrCreateGlownetCustomer called without a valid email.');
    return null;
  }
  const email = userProfile.email.trim();

  try {
    console.log(`[Glownet] Attempting to find existing customer by email: ${email} in Event: ${glownetEventId}`);
    let customer = await searchGlownetCustomerByEmail(glownetEventId, email);

    if (customer && customer.id) {
      console.log(`[Glownet] Found existing customer ID: ${customer.id} for email: ${email}`);
      return customer.id;
    }

    console.log(`[Glownet] No existing customer found for email: ${email}. Attempting to create new customer in Event: ${glownetEventId}`);
    const newCustomer = await createGlownetCustomer(glownetEventId, { ...userProfile, email }); // Pass full userProfile along with trimmed email

    if (newCustomer && newCustomer.id) {
      console.log(`[Glownet] Successfully created new customer ID: ${newCustomer.id} for email: ${email}`);
      return newCustomer.id;
    }
    
    console.error(`[Glownet] Failed to create new customer for email: ${email} after search also failed.`);
    return null;

  } catch (error) {
    console.error(`[Glownet] Unhandled error in getOrCreateGlownetCustomer for email ${email}, Event ${glownetEventId}:`, error);
    return null;
  }
} 

/**
 * Fetches the summary of Glownet events, customers, and cards.
 * This is an example and might need adjustment based on actual Glownet API capabilities.
 */
export async function getGlownetSummary(): Promise<any> {
  console.log('[Glownet] Attempting to fetch Glownet summary data...');
  try {
    // Example: Fetch list of events (if such an endpoint exists)
    // const events = await makeGlownetRequest<any[]>('/events', 'GET');
    // console.log('[Glownet] Fetched events:', events);

    // This function would need to be more specific based on what summary data is needed
    // and what the Glownet API offers. For now, it's a placeholder.
    console.warn('[Glownet] getGlownetSummary is a placeholder and does not fetch real summary data yet.');
    return {
      message: "Glownet summary data is not yet implemented.",
      // eventsCount: events?.length || 0,
      // Placeholder data
      activeCustomers: 0,
      totalNFCChips: 0,
    };
  } catch (error) {
    console.error('[Glownet] Error fetching Glownet summary:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

/**
 * Resets a customer's tag in Glownet (zeroes out balance and optionally clears products).
 * @param eventId Glownet event ID or slug.
 * @param customerId Glownet customer ID.
 * @returns Promise<void>
 * @throws Error if API call fails.
 */
export async function resetGlownetCustomerTag(
  eventId: number | string,
  customerId: number
): Promise<void> {
  const endpoint = `/events/${eventId}/customers/${customerId}/reset_tag`;
  console.log(`[Glownet] resetGlownetCustomerTag: Resetting tag for Event ${eventId}, Customer ${customerId}`);
  try {
    // According to some Glownet API docs, reset_tag might be a POST request
    // It might not have a request body or could have options like { clear_products: true }
    // Assuming no body for a simple reset here.
    await makeGlownetRequest<void>(endpoint, 'POST', {}); // Sending empty body as POST might require it
    console.log(`[Glownet] Customer tag reset successfully: Event ${eventId}, Customer ${customerId}`);
  } catch (error) {
    console.error(`[Glownet] Failed to reset customer tag: Event ${eventId}, Customer ${customerId}. Error:`, error);
    throw error;
  }
} 