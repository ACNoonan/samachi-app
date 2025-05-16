import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export interface Membership {
  id: string;
  user_id: string;
  venue_id: string;
  status: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}