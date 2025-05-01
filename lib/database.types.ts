export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      membership_cards: {
        Row: {
          card_identifier: string
          created_at: string
          glownet_event_id: number | null
          glownet_status: string | null
          id: string
          last_sync_attempt: string | null
          last_synced: string | null
          status: string
          sync_error: string | null
          sync_status: string | null
          user_id: string | null
        }
        Insert: {
          card_identifier: string
          created_at?: string
          glownet_event_id?: number | null
          glownet_status?: string | null
          id?: string
          last_sync_attempt?: string | null
          last_synced?: string | null
          status?: string
          sync_error?: string | null
          sync_status?: string | null
          user_id?: string | null
        }
        Update: {
          card_identifier?: string
          created_at?: string
          glownet_event_id?: number | null
          glownet_status?: string | null
          id?: string
          last_sync_attempt?: string | null
          last_synced?: string | null
          status?: string
          sync_error?: string | null
          sync_status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_membership_cards_venue"
            columns: ["glownet_event_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["glownet_event_id"]
          },
          {
            foreignKeyName: "membership_cards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          card_id: string | null
          created_at: string
          glownet_customer_id: number | null
          id: string
          status: string
          subscription_type: string | null
          updated_at: string
          user_id: string
          venue_id: string
        }
        Insert: {
          card_id?: string | null
          created_at?: string
          glownet_customer_id?: number | null
          id?: string
          status?: string
          subscription_type?: string | null
          updated_at?: string
          user_id: string
          venue_id: string
        }
        Update: {
          card_id?: string | null
          created_at?: string
          glownet_customer_id?: number | null
          id?: string
          status?: string
          subscription_type?: string | null
          updated_at?: string
          user_id?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: true
            referencedRelation: "membership_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          telegram_handle: string | null
          twitter_handle: string | null
          username: string
          wallet_address: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          telegram_handle?: string | null
          twitter_handle?: string | null
          username: string
          wallet_address?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          telegram_handle?: string | null
          twitter_handle?: string | null
          username?: string
          wallet_address?: string | null
        }
        Relationships: []
      }
      venues: {
        Row: {
          address: string | null
          created_at: string
          currency: string | null
          end_date: string | null
          glownet_event_id: number | null
          id: string
          image_url: string | null
          last_sync_attempt: string | null
          last_synced: string | null
          max_balance: number | null
          max_virtual_balance: number | null
          name: string
          start_date: string | null
          status: string | null
          sync_error: string | null
          sync_status: string | null
          timezone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          currency?: string | null
          end_date?: string | null
          glownet_event_id?: number | null
          id?: string
          image_url?: string | null
          last_sync_attempt?: string | null
          last_synced?: string | null
          max_balance?: number | null
          max_virtual_balance?: number | null
          name: string
          start_date?: string | null
          status?: string | null
          sync_error?: string | null
          sync_status?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          currency?: string | null
          end_date?: string | null
          glownet_event_id?: number | null
          id?: string
          image_url?: string | null
          last_sync_attempt?: string | null
          last_synced?: string | null
          max_balance?: number | null
          max_virtual_balance?: number | null
          name?: string
          start_date?: string | null
          status?: string | null
          sync_error?: string | null
          sync_status?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      sync_status_type: "pending" | "success" | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      sync_status_type: ["pending", "success", "failed"],
    },
  },
} as const
