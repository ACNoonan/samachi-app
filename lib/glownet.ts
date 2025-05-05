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
    console.error('CRITICAL: Glownet API key (GLOWNET_API_KEY) is not configured in environment variables.');
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

  try {
    console.log(`Making Glownet Request: ${method} ${url}`, body ? `with body: ${JSON.stringify(body)}` : '');
    const response = await fetch(url, options);

    if (!response.ok) {
      let errorData: GlownetErrorResponse = {};
      let responseText = '';
      try {
        // Try to read response text first for better debugging
        responseText = await response.text();
        errorData = JSON.parse(responseText);
      } catch (parseError) {
        // Ignore if response body is not JSON, use the text
        console.warn(`Glownet API response for ${method} ${url} was not valid JSON:`, responseText);
      }
      
      const errorMessage = 
        errorData.error || 
        errorData.message || 
        (errorData.errors ? JSON.stringify(errorData.errors) : null) || 
        responseText || // Use raw text if no specific error field found
        `Glownet API request failed with status ${response.status}`;
        
      console.error(`Glownet API Error (${method} ${url}): Status ${response.status}, Message: ${errorMessage}`, errorData);
      // Throw a new error with the specific message
      throw new Error(`Glownet API Error: ${errorMessage}`);
    }

    // Handle potential empty response for success codes like 201/204
    if (response.status === 201 || response.status === 204 || response.headers.get('Content-Length') === '0') {
        console.log(`Glownet Response (${method} ${url}): Status ${response.status} (No Content or Created)`);
        return {} as T; // Return an empty object or appropriate type
    }
    
    // Try parsing JSON only if there's content
    const responseData = await response.json();
    console.log(`Glownet Response (${method} ${url}):`, responseData);
    return responseData as T;

  } catch (error: any) {
    // Log the specific error encountered during fetch or processing
    console.error(`Error during Glownet API call to ${method} ${url}:`, error);
    // Re-throw the specific error message if it was already processed, otherwise create a generic one
    if (error.message.startsWith('Glownet API Error:')) {
        throw error; // Re-throw the specific API error
    }
    // Throw a more generic error for network issues etc.
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
    console.warn(`glownetVirtualTopup: Attempted top-up with zero or negative amount (${amountStandardUnits}), skipping API call.`);
    // Consider if throwing an error is more appropriate for negative amounts
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
    console.log(`Glownet virtual top-up successful for customer ${customerId}, event ${eventId}, amount ${amountStandardUnits} (Sent as ${amountInCents} credits)`);
  } catch (error) {
      console.error(`Failed Glownet virtual top-up for customer ${customerId}, event ${eventId}, amount ${amountStandardUnits}. Error:`, error);
      // Re-throw to allow calling function to handle failure (e.g., prevent DB update)
      throw error; 
  }
}

// Interface for the relevant parts of the Glownet Customer response
interface GlownetCustomerResponse {
    id: number;
    virtual_money: number | null; // Can be null according to some API responses? Handle null.
    money?: number | null; 
    // Add other fields if needed (e.g., first_name, last_name for logging)
}

/**
 * Gets the virtual balance for a customer from Glownet.
 * @param eventId Glownet event ID or slug.
 * @param customerId Glownet customer ID.
 * @returns Promise<number> The customer's virtual balance in standard currency units (e.g., 1.50).
 * @throws Error if API call fails or virtual_money is missing/unexpected.
 */
export async function getGlownetCustomerVirtualBalance(
    eventId: number | string,
    customerId: number
): Promise<number> {
    const endpoint = `/events/${eventId}/customers/${customerId}`;
    
    try {
        const customerData = await makeGlownetRequest<GlownetCustomerResponse>(endpoint, 'GET');

        // Explicitly check for null or undefined
        if (customerData.virtual_money === undefined || customerData.virtual_money === null) {
            console.error(`Glownet customer ${customerId} response for event ${eventId} is missing or has null 'virtual_money' field.`);
            // Decide on behavior: throw error or return 0? Throwing is safer to indicate data issue.
            throw new Error(`Could not retrieve valid virtual balance for Glownet customer ${customerId}.`); 
        }

        const balanceInCents = customerData.virtual_money;
        // Ensure it's a valid number before division
        if (typeof balanceInCents !== 'number') {
            throw new Error(`Invalid virtual balance type received from Glownet for customer ${customerId}: ${typeof balanceInCents}`);
        }
        
        const balanceStandardUnits = balanceInCents / GLOWNET_UNIT_MULTIPLIER;

        console.log(`Glownet virtual balance fetched for customer ${customerId}, event ${eventId}: ${balanceStandardUnits} (Received as ${balanceInCents})`);
        return balanceStandardUnits;

    } catch (error) {
        console.error(`Failed to get Glownet virtual balance for customer ${customerId}, event ${eventId}. Error:`, error);
        // Re-throw to allow calling function to handle failure
        throw error; 
    }
}

// Add other Glownet helper functions as needed 