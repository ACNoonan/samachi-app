export interface Organization {
  id: string;
  name: string;
  address: string | null;
  primary_contact: string;
  secondary_contact?: string;
}