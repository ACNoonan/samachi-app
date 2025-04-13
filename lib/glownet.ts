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


// --- Specific API Function Examples (using Zod for validation) ---

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

/**
 * Fetches all events (venues) from Glownet.
 */
export async function getAllGlownetEvents(): Promise<GlownetEvent[]> {
  const events = await getGlownet<unknown[]>(`/api/v2/events`);
  // Validate the response structure
  return z.array(GlownetEventSchema).parse(events);
}


const GlownetCustomerSchema = z.object({
    id: z.number(), // Assuming ID is numeric, adjust if string
    first_name: z.string().optional().nullable(),
    last_name: z.string().optional().nullable(),
    email: z.string().email().optional().nullable(),
    // Add other fields as needed from docs
});

export type GlownetCustomer = z.infer<typeof GlownetCustomerSchema>;

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
    glownetEventId: number | string, // Can be ID or slug
    payload: CreateGlownetCustomerPayload
): Promise<GlownetCustomer> {
    // Note: API docs indicate 201 returns an *array* of customers, potentially just one.
    // Adjust parsing if necessary. Assuming it returns the single created customer object directly for simplicity here.
    const result = await postGlownet<GlownetCustomer>( // Adjust <GlownetCustomer> if it returns an array
        `/api/v2/events/${glownetEventId}/customers`,
        payload
    );
    // If it returns an array: return GlownetCustomerSchema.parse(result[0]);
    return GlownetCustomerSchema.parse(result);
}


// We might not need checkGlownetCardStatus directly anymore,
// as card linking might happen via Gtag lookup or customer creation.
// Removing the placeholder for now.

// export const checkGlownetCardStatus = async (cardId: string) => { ... }


// export {}; // No longer needed as we have named exports 