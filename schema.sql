




SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."sync_status_type" AS ENUM (
    'pending',
    'success',
    'failed'
);


ALTER TYPE "public"."sync_status_type" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  -- Insert a new row into public.profiles
  -- Extract data from the metadata passed during signup (NEW.raw_user_meta_data)
  INSERT INTO public.profiles (
      id,
      email,
      username, -- Required field
      twitter_handle,
      telegram_handle,
      wallet_address
      -- password_hash column is removed from the table
  )
  VALUES (
      NEW.id,
      NEW.email,
      NEW.raw_user_meta_data ->> 'username', -- Extract username
      NEW.raw_user_meta_data ->> 'twitter_handle', -- Extract twitter handle (or NULL if not provided)
      NEW.raw_user_meta_data ->> 'telegram_handle', -- Extract telegram handle (or NULL if not provided)
      NEW.raw_user_meta_data ->> 'wallet_address' -- Extract wallet address (or NULL if not provided)
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."membership_cards" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "card_identifier" "text" NOT NULL,
    "status" "text" DEFAULT 'unregistered'::"text" NOT NULL,
    "user_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "glownet_status" "text" DEFAULT 'ACTIVE'::"text",
    "sync_status" "text" DEFAULT 'pending'::"text",
    "last_sync_attempt" timestamp with time zone,
    "sync_error" "text",
    "glownet_event_id" integer,
    "last_synced" timestamp with time zone
);


ALTER TABLE "public"."membership_cards" OWNER TO "postgres";


COMMENT ON TABLE "public"."membership_cards" IS 'Represents physical membership cards and their status.';



COMMENT ON COLUMN "public"."membership_cards"."card_identifier" IS 'Unique identifier from the physical card.';



COMMENT ON COLUMN "public"."membership_cards"."user_id" IS 'Links to the user who claimed this card in the profiles table.';



CREATE TABLE IF NOT EXISTS "public"."memberships" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "venue_id" "uuid" NOT NULL,
    "card_id" "uuid",
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "subscription_type" "text",
    "glownet_customer_id" integer,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."memberships" OWNER TO "postgres";


COMMENT ON COLUMN "public"."memberships"."card_id" IS 'Which physical/digital card is linked to this specific membership';



COMMENT ON COLUMN "public"."memberships"."glownet_customer_id" IS 'Corresponding Customer ID from Glownet API for this user/venue combination';



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "username" "text" NOT NULL,
    "twitter_handle" "text",
    "telegram_handle" "text",
    "wallet_address" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "email" "text"
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


COMMENT ON TABLE "public"."profiles" IS 'Stores user profile information, independent of Supabase Auth.';



COMMENT ON COLUMN "public"."profiles"."wallet_address" IS 'Associated Solana wallet public key (optional at creation).';



COMMENT ON COLUMN "public"."profiles"."email" IS 'User email address, should match auth.users.email';



CREATE TABLE IF NOT EXISTS "public"."venues" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "glownet_event_id" integer,
    "address" "text",
    "image_url" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "currency" "text",
    "sync_status" "text",
    "last_sync_attempt" timestamp with time zone,
    "sync_error" "text",
    "last_synced" timestamp with time zone,
    "start_date" timestamp with time zone,
    "end_date" timestamp with time zone,
    "timezone" "text",
    "status" "text",
    "max_balance" numeric,
    "max_virtual_balance" numeric
);


ALTER TABLE "public"."venues" OWNER TO "postgres";


COMMENT ON COLUMN "public"."venues"."glownet_event_id" IS 'Corresponding Event ID from the Glownet API';



ALTER TABLE ONLY "public"."membership_cards"
    ADD CONSTRAINT "membership_cards_card_identifier_key" UNIQUE ("card_identifier");



ALTER TABLE ONLY "public"."membership_cards"
    ADD CONSTRAINT "membership_cards_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."memberships"
    ADD CONSTRAINT "memberships_card_id_key" UNIQUE ("card_id");



ALTER TABLE ONLY "public"."memberships"
    ADD CONSTRAINT "memberships_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."memberships"
    ADD CONSTRAINT "memberships_user_id_venue_id_key" UNIQUE ("user_id", "venue_id");



COMMENT ON CONSTRAINT "memberships_user_id_venue_id_key" ON "public"."memberships" IS 'Prevents duplicate membership entries for the same user at the same venue';



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_wallet_address_key" UNIQUE ("wallet_address");



ALTER TABLE ONLY "public"."venues"
    ADD CONSTRAINT "venues_glownet_event_id_key" UNIQUE ("glownet_event_id");



ALTER TABLE ONLY "public"."venues"
    ADD CONSTRAINT "venues_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_membership_cards_card_identifier" ON "public"."membership_cards" USING "btree" ("card_identifier");



CREATE INDEX "idx_membership_cards_glownet_event_id" ON "public"."membership_cards" USING "btree" ("glownet_event_id");



CREATE INDEX "idx_membership_cards_user_id" ON "public"."membership_cards" USING "btree" ("user_id");



CREATE INDEX "idx_profiles_username" ON "public"."profiles" USING "btree" ("username");



CREATE INDEX "idx_profiles_wallet_address" ON "public"."profiles" USING "btree" ("wallet_address");



CREATE INDEX "idx_venues_glownet_event_id" ON "public"."venues" USING "btree" ("glownet_event_id");



ALTER TABLE ONLY "public"."membership_cards"
    ADD CONSTRAINT "fk_membership_cards_venue" FOREIGN KEY ("glownet_event_id") REFERENCES "public"."venues"("glownet_event_id");



ALTER TABLE ONLY "public"."membership_cards"
    ADD CONSTRAINT "membership_cards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."memberships"
    ADD CONSTRAINT "memberships_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "public"."membership_cards"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."memberships"
    ADD CONSTRAINT "memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."memberships"
    ADD CONSTRAINT "memberships_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE RESTRICT;





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



























GRANT ALL ON TABLE "public"."membership_cards" TO "anon";
GRANT ALL ON TABLE "public"."membership_cards" TO "authenticated";
GRANT ALL ON TABLE "public"."membership_cards" TO "service_role";



GRANT ALL ON TABLE "public"."memberships" TO "anon";
GRANT ALL ON TABLE "public"."memberships" TO "authenticated";
GRANT ALL ON TABLE "public"."memberships" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."venues" TO "anon";
GRANT ALL ON TABLE "public"."venues" TO "authenticated";
GRANT ALL ON TABLE "public"."venues" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;

-- Enable Row Level Security for memberships
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read their own memberships
CREATE POLICY "Allow authenticated users to read their own memberships"
ON public.memberships
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Allow service_role to bypass RLS for memberships (optional, but common for admin tasks)
CREATE POLICY "Allow service_role to access all memberships"
ON public.memberships
FOR ALL
TO service_role
USING (true);


-- Enable Row Level Security for venues
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read all venues
CREATE POLICY "Allow authenticated users to read all venues"
ON public.venues
FOR SELECT
TO authenticated
USING (true);

-- Policy: Allow service_role to bypass RLS for venues (optional)
CREATE POLICY "Allow service_role to access all venues"
ON public.venues
FOR ALL
TO service_role
USING (true);
