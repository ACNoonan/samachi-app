-- Create the membership_cards table
CREATE TABLE public.membership_cards (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    card_identifier text NOT NULL,
    status text DEFAULT 'unregistered'::text NOT NULL,
    user_id uuid NULL, -- Initially NULL, linked upon registration
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT membership_cards_pkey PRIMARY KEY (id),
    CONSTRAINT membership_cards_card_identifier_key UNIQUE (card_identifier),
    CONSTRAINT membership_cards_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL -- Or ON DELETE CASCADE if preferred
);

-- Enable Row Level Security on the table
ALTER TABLE public.membership_cards ENABLE ROW LEVEL SECURITY;

-- Add comments to columns for clarity (Optional)
COMMENT ON COLUMN public.membership_cards.card_identifier IS 'Unique human-readable identifier for the membership card (e.g., from QR code)';
COMMENT ON COLUMN public.membership_cards.status IS 'Current status of the card (e.g., unregistered, registered, disabled)';
COMMENT ON COLUMN public.membership_cards.user_id IS 'Link to the authenticated user who has claimed this card';

-- Add index for faster lookups by card_identifier
CREATE INDEX idx_membership_cards_card_identifier ON public.membership_cards USING btree (card_identifier);

-- Add index for faster lookups by user_id
CREATE INDEX idx_membership_cards_user_id ON public.membership_cards USING btree (user_id);


-- POLICY: Allow public anonymous read access to check card status (identifier and status only)
-- Needed for the initial check when a user scans a card before logging in.
CREATE POLICY "Allow public read access to card status"
ON public.membership_cards
FOR SELECT
USING (true); -- Allows selecting any row, but column permissions are handled elsewhere (or rely on API selecting specific cols)


-- POLICY: Allow authenticated users to read their own card details
CREATE POLICY "Allow users to read their own card"
ON public.membership_cards
FOR SELECT
USING (auth.uid() = user_id);


-- POLICY: Allow authenticated users to "claim" an unregistered card
-- This allows updating user_id and status *only if* user_id is currently NULL.
-- IMPORTANT: Use this policy with caution. Ideally, claiming should be done via a secure function.
CREATE POLICY "Allow users to claim an unregistered card"
ON public.membership_cards
FOR UPDATE
USING (auth.uid() IS NOT NULL AND user_id IS NULL) -- Can only update if the card's user_id is NULL
WITH CHECK (auth.uid() = user_id); -- Ensures the user_id being set matches the authenticated user

-- SEED DATA
INSERT INTO public.membership_cards (card_identifier, status, user_id)
VALUES
    -- 6 Unregistered Cards
    ('card-test-001', DEFAULT, NULL),
    ('card-test-002', DEFAULT, NULL),
    ('card-test-003', DEFAULT, NULL),
    ('card-test-004', DEFAULT, NULL),
    ('card-test-005', DEFAULT, NULL),
    ('card-test-006', DEFAULT, NULL)