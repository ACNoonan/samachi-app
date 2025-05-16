import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export interface Venue {
  id: string;
  name: string;
  address: string | null;
  glownet_venue_id: string | null;
  primary_contact?: string | null;
  secondary_contact?: string;
  created_at: string; // should be an ISO 8601 string
  updated_at: string; // should be an ISO 8601 string
}