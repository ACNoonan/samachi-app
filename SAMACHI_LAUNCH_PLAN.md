# Samachi App - Soft Launch MVP Plan

**Primary Goal:** For the soft launch on Saturday, users must be able to complete the full flow:
1.  Register for Samachi using a physical card (QR code) via OTP Magic Link.
2.  Stake USDC (Devnet) into their Samachi account.
3.  Check into a venue, funding their Glownet card (gtag) with their staked amount.
4.  (Simulate) Making a purchase using the Glownet card.
5.  Check out of the venue, with the spent amount deducted from their staked balance.

---

## I. Completed Components & Milestones

We have made significant progress on the backend and foundational elements:

1.  **Core User Authentication & Onboarding:**
    *   **OTP Magic Link Registration:** Fully functional. Users can register via email OTP when landing on `/card/[card_identifier]`.
        *   `POST /api/auth/otp/register-and-claim`: Successfully sends OTP with `card_identifier` embedded.
        *   `app/auth/callback/route.ts`: Robustly handles OTP verification, Supabase user creation (via `handle_new_user` trigger), and populates the `profiles` table.
    *   **Card Claiming & Glownet Provisioning:**
        *   The auth callback successfully validates the card, associates it with the correct venue via `glownet_event_id`.
        *   `lib/glownet.ts` (`getOrCreateGlownetCustomer`): Successfully searches for or creates a Glownet customer, returning their `glownet_customer_id`.
        *   Database Updates:
            *   `membership_cards`: `user_id` is linked, and `status` is updated to 'registered'.
            *   `memberships`: A new record is correctly created linking the `user_id`, `venue_id`, `card_id`, and `glownet_customer_id` with `status: 'active'`.

2.  **Custodial Staking Backend (USDC Devnet):**
    *   **Treasury Wallet:** Devnet wallet (`TREASURY_WALLET_ADDRESS`, `TREASURY_WALLET_SECRET_KEY`) configured.
    *   **Database Tables:** `custodial_stakes` and `custodial_withdrawals` are in place.
    *   **API Routes (Core Staking Logic):**
        *   `POST /api/staking/helius-webhook`: Verified working for listening to USDC deposits to the treasury wallet and recording them in `custodial_stakes`.
        *   `POST /api/staking/unstake`: Backend logic implemented for processing withdrawals from treasury and recording in `custodial_withdrawals`. (Full flow testing pending).
        *   `GET /api/staking/balance`: Verified working for calculating and returning user's available staked balance.
        *   `GET /api/staking/stakes`: Implemented for fetching user's deposit history.

3.  **Custodial Staking Frontend (SolanaContext & Wallet Page):**
    *   `SolanaContext.tsx`:
        *   `stake(amount)`: Verified working for constructing and sending USDC transfer to treasury.
        *   `unstake(amount)`: Calls the backend `/api/staking/unstake` route.
        *   `fetchCustodialBalance()`: Verified working for fetching and displaying balance.
    *   `app/wallet/page.tsx` (`WalletDashboard.tsx`): Basic UI implemented for staking, unstaking, and displaying balance.

---

## II. Iterative Plan for Soft Launch MVP (Tuesday Night -> Saturday)

Focus on UI implementation and integrating the check-in/check-out flow.

**Phase 1: UI Implementation & Refinement (Critical Path - Figma Designs)**

*   **Objective:** Implement user-facing screens based on Figma designs to ensure a smooth and intuitive experience for the core flow.
*   **Tasks:**
    1.  **Card Onboarding & Registration (`/card/[card_identifier]`):**
        *   Update `app/components/onboarding/CardLanding.tsx` to match Figma designs for:
            *   Unregistered card: Inline OTP form (email input, submit button).
            *   Registered card: Clear login prompts (OTP / Phantom placeholders if not fully styled).
        *   Ensure user-friendly display of success/error messages passed via query parameters.
    2.  **Wallet & Staking Dashboard (`app/wallet/page.tsx`):**
        *   Refine UI for staking/unstaking actions to align with Figma.
        *   Clear display of current staked balance.
        *   (If in Figma & feasible) Display transaction history (stakes/unstakes/settlements).
    3.  **Venue Interaction Pages/Components:**
        *   Design and implement UI elements (buttons, status displays) for "Check-In" and "Check-Out" on relevant venue detail pages, based on Figma.
        *   Display current check-in status and available "tab" balance (amount funded to Glownet tag).
    4.  **Global UI (Navbar, Layout):**
        *   Ensure `Navbar.tsx` dynamically reflects user authentication state (e.g., display username/email).
        *   (If in Figma) Prominently display staking balance or quick access to wallet.

**Phase 2: Backend for Venue Check-in/Check-out & Glownet Tag Interaction**

*   **Objective:** Enable users to "activate" their staked balance at a venue by funding their Glownet tag, and "settle" their tab upon check-out.
*   **Tasks:**
    1.  **Develop `POST /api/memberships/check-in`:**
        *   **Input:** `{ venueId: string }` (or derive from user's active membership if unambiguous).
        *   **Auth:** Requires authenticated Supabase user.
        *   **Validation:**
            *   User has an active `membership` for the `venueId`.
            *   User has a staked balance > 0 (`GET /api/staking/balance`).
            *   User is not already `checked-in` for this membership.
        *   **Logic:**
            1.  Fetch current available staked balance for the user.
            2.  **CRITICAL: Glownet API Call:** Fund the user's Glownet tag (`glownet_customer_id` from `memberships` table, for the `glownet_event_id` associated with the `venueId`) with the `staked_balance`.
                *   *Action Item:* Confirm exact Glownet API endpoint and request/response for "fund tag" or "top-up virtual balance".
            3.  If Glownet funding is successful, update the `memberships` table:
                *   Set `status = 'checked-in'`.
                *   Set `last_check_in_at = now()`.
                *   Set `last_funded_amount = staked_balance`.
        *   **Response:** Success or error message.
    2.  **Develop `POST /api/memberships/check-out` (Settlement):**
        *   **Input:** `{ venueId: string }`.
        *   **Auth:** Requires authenticated Supabase user.
        *   **Validation:** User has a `membership` for `venueId` with `status = 'checked-in'`.
        *   **Logic:**
            1.  Fetch the `membership` record to get `glownet_customer_id`, associated `glownet_event_id`, and `last_funded_amount`.
            2.  **CRITICAL: Glownet API Call:** Get the amount spent OR current balance for the user's tag since check-in.
                *   *Action Item:* Confirm exact Glownet API endpoint and request/response for "get tag balance" or "get amount spent".
            3.  Calculate `spentAmount`. Example: `spentAmount = last_funded_amount - current_glownet_balance`.
            4.  If `spentAmount > 0`:
                *   Insert a record into `custodial_withdrawals`:
                    *   `user_profile_id = user.id`
                    *   `amount_withdrawn = spentAmount` (ensure correct units)
                    *   `withdrawal_transaction_signature = 'glownet_settlement_venue_[venueId]_checkout_[timestamp]'` (or similar unique identifier)
                    *   `token_mint_address = USDC_MINT_ADDRESS`
            5.  **CRITICAL (Optional but Recommended): Glownet API Call:** Zero out/reset the user's Glownet tag balance for the event.
                *   *Action Item:* Confirm Glownet API for this.
            6.  Update the `memberships` table:
                *   Set `status = 'active'`.
                *   Optionally clear `last_funded_amount`, `last_check_in_at`.
        *   **Response:** Success or error message.

**Phase 3: Frontend Integration for Check-in/Check-out**

*   **Objective:** Connect the new UI elements to the backend APIs.
*   **Tasks:**
    1.  Wire "Check-In" button to call `POST /api/memberships/check-in`.
    2.  Wire "Check-Out" button to call `POST /api/memberships/check-out`.
    3.  Implement loading states for these actions.
    4.  Display success/error feedback to the user (e.g., using Toasts).
    5.  Ensure user's overall staked balance (from `SolanaContext`) refreshes after check-out to reflect settlement.

**Phase 4: Full End-to-End Testing & Refinement**

*   **Objective:** Rigorously test the complete user journey.
*   **Test Scenarios (Minimum):**
    1.  **New User Full Flow:**
        *   Visit `/card/[new_card_id]`.
        *   Register with new email via OTP.
        *   Redirect to dashboard/wallet page.
        *   Stake USDC. Verify balance updates.
        *   Navigate to a Venue page.
        *   Click "Check-In". Verify success, UI update, (manual Glownet check if possible).
        *   (Simulate spending at venue - this will be based on Glownet API for getting spent amount).
        *   Click "Check-Out". Verify success, UI update.
        *   Verify overall staked balance in wallet reflects the "spent" amount.
    2.  **Error Paths:**
        *   Attempt check-in with zero stake.
        *   Attempt check-in if already checked-in.
        *   Attempt check-out if not checked-in.
        *   (If possible) Simulate Glownet API errors during check-in/check-out and verify graceful handling.

**Phase 5: Deployment Preparation & Go-Live (Vercel)**

*   **Objective:** Prepare for and deploy the application for the soft launch.
*   **Tasks:**
    1.  **Environment Variables:**
        *   Ensure all necessary environment variables are present in `.env.local` for final local testing.
        *   Add/verify all environment variables in Vercel project settings (for Preview and Production):
            *   `NEXT_PUBLIC_SUPABASE_URL`
            *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
            *   `SUPABASE_SERVICE_ROLE_KEY` (if used in any backend routes securely)
            *   `GLOWNET_API_KEY` / `GLOWNET_API_SECRET` (or equivalent auth)
            *   `TREASURY_WALLET_ADDRESS`
            *   `TREASURY_WALLET_SECRET_KEY`
            *   `NEXT_PUBLIC_SITE_URL` (set to the production Vercel URL)
            *   Any other relevant keys (Helius API key if webhook needs it).
    2.  **Build & Test on Vercel Preview:**
        *   Push changes to a Git branch and let Vercel create a preview deployment.
        *   Thoroughly test the entire flow on the preview deployment URL.
    3.  **Production Deployment:**
        *   Merge changes to the main branch (or your production branch).
        *   Trigger/monitor the Vercel production deployment.
        *   Perform a final smoke test on the live production URL.

**Contingency / Simplification if Time is Tight:**

*   **UI:** If full Figma fidelity is challenging, prioritize functional, clear UI over pixel-perfection for the MVP.
*   **Glownet Settlement:** If getting the *exact* spent amount from Glownet is too complex by Saturday, a simplified check-out could:
    *   Assume the entire `last_funded_amount` was spent.
    *   Record this full amount in `custodial_withdrawals`.
    *   Still attempt to zero-out the Glownet tag.
    *   This is less accurate for the user's balance but ensures the "settlement" part of the flow is demonstrated.

---
*This plan prioritizes getting the core user experience functional for the soft launch. Good luck!* 