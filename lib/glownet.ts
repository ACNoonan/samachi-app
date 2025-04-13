import { z } from 'zod';

const GLOWNET_BASE_URL = process.env.GLOWNET_BASE_URL;
const GLOWNET_API_KEY = process.env.GLOWNET_API_KEY;

if (!GLOWNET_BASE_URL) {
  throw new Error('Missing GLOWNET_BASE_URL environment variable');
}
if (!GLOWNET_API_KEY) {
  throw new Error('Missing GLOWNET_API_KEY environment variable');
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

/**
 * Generic fetch function for interacting with the Glownet API.
 * Handles adding authentication headers and base URL.
 * Throws an error for non-2xx responses.
 * @param endpoint - The API endpoint (e.g., '/api/v2/events')
 * @param options - Fetch options (method, body, headers, etc.)
 * @returns The parsed JSON response.
 */
async function fetchGlownet<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = new URL(endpoint, GLOWNET_BASE_URL);

  if (options.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  const { params, ...fetchOptions } = options; // Remove custom 'params' option

  const response = await fetch(url.toString(), {
    ...fetchOptions,
    headers: {
      'Authorization': `Token token=${GLOWNET_API_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...fetchOptions.headers,
    },
  });

  if (!response.ok) {
    let errorBody;
    try {
      errorBody = await response.json();
    } catch (e) {
      errorBody = await response.text();
    }
    console.error('Glownet API Error:', response.status, response.statusText, errorBody);
    throw new Error(
      `Glownet API request failed to ${endpoint}: ${response.status} ${response.statusText}`
    );
  }

  // Handle cases with empty response bodies (e.g., 201 Created, 204 No Content)
  if (response.status === 201 || response.status === 204) {
      return {} as T; // Return an empty object or adjust as needed
  }

  // Only attempt to parse JSON if there's content
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
      try {
          return (await response.json()) as T;
      } catch (e) {
          console.error('Failed to parse Glownet JSON response:', e);
          throw new Error(`Failed to parse JSON response from ${endpoint}`);
      }
  }

  // If not JSON or no content, return an empty object or handle appropriately
  return {} as T;
}

// --- Helper Functions ---

/**
 * Performs a GET request to the Glownet API.
 */
export function getGlownet<T = unknown>(
  endpoint: string,
  params?: Record<string, string | number | boolean>,
  options: FetchOptions = {}
): Promise<T> {
  return fetchGlownet<T>(endpoint, { ...options, method: 'GET', params });
}

/**
 * Performs a POST request to the Glownet API.
 */
export function postGlownet<T = unknown>(
  endpoint: string,
  body: any,
  options: FetchOptions = {}
): Promise<T> {
  return fetchGlownet<T>(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * Performs a PATCH request to the Glownet API.
 */
export function patchGlownet<T = unknown>(
  endpoint: string,
  body: any,
  options: FetchOptions = {}
): Promise<T> {
  return fetchGlownet<T>(endpoint, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

/**
 * Performs a DELETE request to the Glownet API.
 */
export function deleteGlownet<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  return fetchGlownet<T>(endpoint, { ...options, method: 'DELETE' });
}


// --- Zod Schemas ---

const GlownetEventSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string().optional().nullable(),
  start_date: z.string(),
  end_date: z.string(),
  timezone: z.string(),
  // Add other relevant fields based on glownet_api_docs.json
});

export type GlownetEvent = z.infer<typeof GlownetEventSchema>;

const GlownetCustomerSchema = z.object({
    id: z.number(), // Changed from string based on API response for POST/PATCH
    first_name: z.string().optional().nullable(),
    last_name: z.string().optional().nullable(),
    email: z.string().email().optional().nullable(),
    phone: z.string().optional().nullable(),
    birthdate: z.string().optional().nullable(),
    postcode: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    country: z.string().optional().nullable(),
    gender: z.string().optional().nullable(),
    virtual_money: z.number().optional().nullable(), // Added
    money: z.number().optional().nullable(),         // Added
    global_refundable_money: z.number().optional().nullable(), // Added
    balances: z.record(z.any()).optional().nullable(), // Added (object type)
    locale: z.string().optional().nullable(),
    anonymous: z.boolean().optional().nullable(),
    refundable: z.boolean().optional().nullable(),
    family_id: z.string().optional().nullable(), // Assuming string ID
    family_owner: z.boolean().optional().nullable(),
    // Omit nested gtags, tickets, orders for this specific schema if not needed for check-in
    // gtags: z.array(z.any()).optional(), // Example if needed later
    // tickets: z.array(z.any()).optional(),
    // orders: z.array(z.any()).optional(),
});

export type GlownetCustomer = z.infer<typeof GlownetCustomerSchema>;

// Schema for the /api/v2/events/lookup endpoint response
const GlownetLookupResponseSchema = z.object({
    event_id: z.number(),
    gtag_id: z.number(),
    customer_id: z.number().nullable(),
    "gtag_active?": z.boolean(), // Note the key name with question mark
});
export type GlownetLookupResponse = z.infer<typeof GlownetLookupResponseSchema>;


// --- Specific API Functions ---

/**
 * Fetches all events (venues) from Glownet.
 */
export async function getAllGlownetEvents(): Promise<GlownetEvent[]> {
  const events = await getGlownet<unknown[]>(`/api/v2/events`);
  // Validate the response structure
  return z.array(GlownetEventSchema).parse(events);
}

interface CreateGlownetCustomerPayload {
    customer: {
        first_name?: string;
        last_name?: string;
        email?: string;
        phone?: string;
        birthdate?: string; // "YYYY-MM-DD" format? Docs example uses "2019-01-01"
        // Add other fields as needed/supported by POST /api/v2/events/{event_id}/customers
    };
}

/**
 * Creates a new customer for a specific Glownet event.
 */
export async function createGlownetCustomer(
    glownetEventId: number | string,
    payload: CreateGlownetCustomerPayload
): Promise<GlownetCustomer> {
    console.log(`Attempting to create Glownet customer for event ${glownetEventId}...`);
    // Docs indicate 201 returns an array of customers.
    // We expect only one customer to be created and returned in the array.
    const result = await postGlownet<unknown[]>(
        `/api/v2/events/${glownetEventId}/customers`,
        payload
    );

    // Validate the response structure (expecting an array)
    try {
        const parsedArray = z.array(GlownetCustomerSchema).parse(result);
        if (parsedArray.length > 0) {
            console.log(`Glownet customer created successfully for event ${glownetEventId}. ID: ${parsedArray[0].id}`);
            return parsedArray[0]; // Return the first customer object from the array
        } else {
            console.error(`Glownet customer creation for event ${glownetEventId} returned an empty array.`);
            throw new Error('Glownet customer creation returned empty array.');
        }
    } catch (error) {
        console.error(`Failed to parse Glownet customer creation response for event ${glownetEventId}:`, error);
        console.error('Raw response received from Glownet create customer:', result);
        throw new Error(`Invalid response structure from Glownet create customer API.`);
    }
}

/**
 * Looks up Glownet event and customer details based on a Gtag UID.
 * @param gtagUid The UID of the gtag (card identifier).
 * @returns The parsed lookup response containing event_id, gtag_id, etc.
 */
export async function getGlownetEventDetailsByGtagUid(gtagUid: string): Promise<GlownetLookupResponse> {
    console.log(`Looking up Glownet event details for gtag_uid: ${gtagUid}`);
    const result = await getGlownet<unknown>('/api/v2/events/lookup', { gtag_uid: gtagUid });

    // Validate the response structure
    try {
        const parsed = GlownetLookupResponseSchema.parse(result);
        console.log(`Glownet lookup successful for gtag_uid ${gtagUid}:`, parsed);
        return parsed;
    } catch (error) {
        console.error(`Failed to parse Glownet lookup response for gtag_uid ${gtagUid}:`, error);
        console.error('Raw response received from Glownet:', result); // Log raw response on parse failure
        throw new Error(`Invalid response structure from Glownet lookup API for gtag ${gtagUid}.`);
    }
}

/**
 * Assigns a specific Gtag UID to a Glownet customer within a specific event.
 * @param glownetEventId The ID or slug of the Glownet event.
 * @param glownetCustomerId The ID of the Glownet customer.
 * @param gtagUid The UID of the gtag (card identifier) to assign.
 * @returns The updated Glownet customer object.
 */
export async function assignGlownetGtagToCustomer(
    glownetEventId: number | string,
    glownetCustomerId: number,
    gtagUid: string
): Promise<GlownetCustomer> { // Assuming it returns the customer object
    console.log(`Assigning gtag_uid ${gtagUid} to Glownet customer ${glownetCustomerId} in event ${glownetEventId}...`);

    const payload = {
        tag_uid: gtagUid
    };

    // The API docs suggest this returns the Customer object on 201 Created.
    const result = await postGlownet<unknown>(
        `/api/v2/events/${glownetEventId}/customers/${glownetCustomerId}/assign_gtag`,
        payload
    );

    // Validate the response assuming it's a Customer object
    try {
        const parsedCustomer = GlownetCustomerSchema.parse(result);
        console.log(`Successfully assigned gtag ${gtagUid} to customer ${glownetCustomerId}.`);
        return parsedCustomer;
    } catch (error) {
        console.error(`Failed to parse response after assigning gtag ${gtagUid} to customer ${glownetCustomerId}:`, error);
        console.error('Raw response received from Glownet assign_gtag:', result);
        // Even if parsing fails, the assignment might have succeeded (e.g., if API returns slightly different structure).
        // Consider if we need to handle this differently - for now, throw error.
        throw new Error(`Invalid response structure from Glownet assign_gtag API.`);
    }
}

/**
 * Fetches detailed information for a specific Glownet customer within an event.
 * @param glownetEventId The ID or slug of the Glownet event.
 * @param glownetCustomerId The ID of the Glownet customer.
 * @returns The detailed Glownet customer object, including balances.
 */
export async function getGlownetCustomerDetails(
    glownetEventId: number | string,
    glownetCustomerId: number
): Promise<GlownetCustomer> {
    console.log(`Fetching details for Glownet customer ${glownetCustomerId} in event ${glownetEventId}...`);

    const result = await getGlownet<unknown>(
        `/api/v2/events/${glownetEventId}/customers/${glownetCustomerId}`
    );

    // Validate the response using the enhanced schema
    try {
        const parsedCustomer = GlownetCustomerSchema.parse(result);
        console.log(`Successfully fetched details for customer ${glownetCustomerId}.`);
        return parsedCustomer;
    } catch (error) {
        console.error(`Failed to parse customer details response for customer ${glownetCustomerId}:`, error);
        console.error('Raw response received from Glownet get customer details:', result);
        throw new Error(`Invalid response structure from Glownet get customer details API.`);
    }
}


// We might not need checkGlownetCardStatus directly anymore,
// as card linking might happen via Gtag lookup or customer creation.
// Removing the placeholder for now.

// export const checkGlownetCardStatus = async (cardId: string) => { ... }


// export {}; // No longer needed as we have named exports 