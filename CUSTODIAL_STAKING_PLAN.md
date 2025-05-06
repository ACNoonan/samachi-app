# Custodial USDC Staking Implementation Plan

This document outlines the plan to implement a simplified, custodial staking mechanism for the Samachi app, replacing the initially planned Anchor smart contract approach.

**Goal:** 
Users will register for Samachi by going to our *card/(CARD_ID)* endpoint where they sign up for a card with OTP magic link via Supabase, registering the Glownet gtag to their acount in Glownet as well.

Allow users to "stake" USDC by initiating a transfer to a platform-controlled wallet via their own wallet, and "unstake" by requesting a withdrawal of a specific amount via an API call, which the backend processes immediately by sending funds from the treasury wallet.

After a user is registered and staked, enable them to *Check In* to the venue, updating their state to be Checked-In at the venue and funding their Glownet gtag for the same amount as they have staked in USDC.

Then, a user will charge items to their gtag. We'll enable a Checked-In user to manually *Check out* which triggers the settlement process. We'll get their glownet balance (or amount spent) and subtract that amount from their available balance to withdrawal from the treasury wallet by creating a withdrawal record.

After this backend functionality is working, we'll implement the UI changes, copying the work our designers done in Figma.

**Core Components:**

1.  **Treasury Wallet: DEVNET**
    *   A standard Solana wallet (`Keypair`) generated and managed securely by the backend.
    *   Public Address (`TREASURY_WALLET_ADDRESS`) and Secret Key (`TREASURY_WALLET_SECRET_KEY`) stored securely in env vars.
    *   **(Completed)**

2.  **Database Tables:**
    *   **`custodial_stakes`:** Stores records of user deposits identified via webhook.
        *   Schema includes: `id`, `user_profile_id`, `amount_staked` (raw units - `numeric`/`bigint`), `deposit_transaction_signature`, `token_mint_address`, `timestamp`. Status field removed.
        *   **(Completed: Schema Applied & Types Generated)**
    *   **`custodial_withdrawals`:** Stores records of user withdrawals initiated via API.
        *   Schema includes: `id`, `user_profile_id`, `amount_withdrawn` (raw units - `numeric`/`bigint`), `withdrawal_transaction_signature`, `token_mint_address`, `timestamp`.
        *   **(Completed: Table created & Types Generated)**
    *   **`profiles`:** Central user table.
    *   **`memberships`:** Links users to venues, stores status (`active`, `checked-in`), Glownet IDs, potentially `last_check_in_at`, `last_funded_amount`.

3.  **Deposit Listener (Helius Webhook):**
    *   Utilizes Helius webhooks to monitor the `TREASURY_WALLET_ADDRESS` for incoming USDC transfers.
    *   Webhook points to `/api/staking/helius-webhook`.
    *   Filters set on Helius for USDC mint and `TRANSFER` type.
    *   **(Completed & Verified Working)**

4.  **API Routes:**
    *   `POST /api/staking/helius-webhook`:
        *   Receives webhook notifications from Helius.
        *   **(Completed & Verified Working):** Validates auth, identifies user, correctly uses `toWallet`/`fromWallet`, handles raw amount insertion (`BigInt`), checks idempotency, and has performance logging.
    *   `POST /api/staking/unstake`:
        *   **(Completed Implementation - Pending Test):** Authenticated endpoint using `createServerClient`. Accepts standard `{ amount: number }`.
        *   Correctly calculates available balance using `BigInt` arithmetic.
        *   Verifies `requestedAmountBigInt <= availableBalanceBigInt`.
        *   Uses Treasury secret key to send transfer with `BigInt` amount.
        *   Records withdrawal using `BigInt`. Returns success/error.
        *   *Note: Linter errors currently ignored in this file.* 
    *   `GET /api/staking/balance`:
        *   **(Completed & Verified Working):** Authenticated endpoint. Calculates and returns correct balance using `BigInt` internally, returns standard decimal units.
    *   `GET /api/staking/stakes`:
        *   **(Completed):** Authenticated endpoint to fetch deposit history (`custodial_stakes`) for the user.
    *   **(NEW) `POST /api/memberships/check-in`:** Handles venue check-in and Glownet funding.
    *   **(NEW) `POST /api/memberships/check-out`:** Handles venue check-out and settlement against staked balance.

5.  **Frontend (`SolanaContext`, `app/wallet/page.tsx`, Venue Pages):**
    *   `SolanaContext.tsx`:
        *   `stake(amount: number)` function: **(Completed & Verified Working)** Constructs transfer, sends via wallet, triggers balance refresh.
        *   `unstake(amount: number)` function: **(Completed)** Calls the `POST /api/staking/unstake` backend endpoint. Triggers balance refresh on success.
        *   `fetchCustodialBalance()` function: **(Completed & Verified Working)** Calls `GET /api/staking/balance`, updates context state.
    *   `app/wallet/page.tsx` (`WalletDashboard.tsx`):
        *   **(Completed & Verified Working):** UI for stake/unstake. Displays balance correctly (updates after stake). Buttons trigger context functions.
        *   **(Completed):** Treasury Address for manual deposit removed.
    *   **(NEW) Venue Pages / Components:** Need UI elements (e.g., Check-in/Check-out buttons) that call the new API routes.

---

## Implementation & Testing Phases

**Phase A: Core Staking/Unstaking (Completed & Verified)**
*   Summary: Users can stake USDC via wallet transfer, backend webhook processes deposit, users can unstake via API call, balance reflects changes correctly. Test Plan Sections A, B, C completed.

**Phase B: Check-in & Glownet Funding**

1.  **Backend API (`POST /api/memberships/check-in`):**
    *   **Input:** `{ venueId: string }`.
    *   **Auth:** Verify Supabase session (user authenticated via OTP).
    *   **Validation:** Check if user has sufficient staked balance (> 0) and an active (`status='active'`) membership for the `venueId`.
    *   **Fetch Data:** Get user profile, membership (`glownet_customer_id`, `glownet_event_id`), current available staked balance.
    *   **Glownet Call:** Fund the user's Glownet tag with the available staked balance. **(Requires specific Glownet API details)**.
    *   **DB Update:** If funding succeeds, update `memberships` set `status='checked-in'`, `last_check_in_at=now()`, `last_funded_amount=staked_balance`.
    *   **Response:** Success/error.
2.  **Frontend UI:**
    *   Add a "Check In" button on the relevant venue page/component.
    *   Button calls `POST /api/memberships/check-in` with the `venueId`.
    *   Display user's check-in status for the venue.
    *   Handle loading states and error/success toasts.
3.  **Testing:**
    *   **Success:** User is staked, active membership -> API returns 200, DB updated (`status='checked-in'`, `last_check_in_at`, `last_funded_amount`), Glownet tag funded (manual verification needed via Glownet tools if possible).
    *   **Failure:** User not staked (balance <= 0) -> API returns 400/error.
    *   **Failure:** User has no membership for venue -> API returns 404/error.
    *   **Failure:** Membership status not 'active' -> API returns 400/error.
    *   **Failure:** Already checked-in (`status='checked-in'`) -> API returns 400/error.
    *   **Failure:** Glownet API funding call fails -> API returns 500/error, DB *not* updated.

**Phase C: Settlement (Manual Check-out)**

1.  **Backend API (`POST /api/memberships/check-out`):**
    *   **Input:** `{ venueId: string }`.
    *   **Auth:** Verify Supabase session (user authenticated via OTP).
    *   **Validation:** Check if user has a membership for `venueId` with `status='checked-in'`.
    *   **Fetch Data:** Get user profile, membership (`glownet_customer_id`, `glownet_event_id`, `last_funded_amount`).
    *   **Glownet Call:** Get the amount spent or current balance for the user's tag since check-in. **(Requires specific Glownet API details)**.
    *   **(Optional Glownet Call):** Reset/zero out the tag balance. **(Requires specific Glownet API details)**.
    *   **Calculate Spent:** `spentAmount = last_funded_amount - current_balance` (or use direct 'spent' value from Glownet).
    *   **DB Update (Withdrawal):** If `spentAmount > 0`, insert into `custodial_withdrawals`: `user_profile_id`, `amount_withdrawn=spentAmount`, `withdrawal_transaction_signature='glownet_settlement_...'`, `token_mint_address`. Handle potential errors.
    *   **DB Update (Membership):** Update `memberships` set `status='active'`, clear `last_check_in_at`, `last_funded_amount`.
    *   **Response:** Success/error.
2.  **Frontend UI:**
    *   Add a "Check Out" button, visible only when checked-in.
    *   Button calls `POST /api/memberships/check-out` with `venueId`.
    *   Update display to show 'active' status after successful check-out.
    *   Handle loading states and error/success toasts.
    *   Wallet balance display should eventually refresh to show deduction.
3.  **Testing:**
    *   **Success (Spent):** User checked-in, spends via Glownet -> Check-out API returns 200, `custodial_withdrawals` has record for `spentAmount`, `memberships` status is 'active', `get /api/staking/balance` reflects deduction.
    *   **Success (No Spend):** User checks-in, doesn't spend -> Check-out API returns 200, NO record in `custodial_withdrawals`, `memberships` status is 'active', balance unchanged.
    *   **Failure:** User not checked-in (`status != 'checked-in'`) -> API returns 400/error.
    *   **Failure:** Glownet API call fails (get balance/spent) -> API returns 500/error, DB *not* updated.
    *   **Failure:** DB insert into `custodial_withdrawals` fails -> API returns 500/error, *potentially* need manual reconciliation (Glownet interaction might have succeeded). Log details.

**Phase D: User Onboarding & Card Registration Refinement**

**Goal:** Implement a robust user onboarding flow where a user scans a membership card's QR code, lands on `/card/[card_identifier]`, and can register for Samachi via Email OTP. This process must also claim the specific card for the user, provision a Glownet customer identity for them at the associated venue, and correctly populate all necessary database fields (notably `memberships.glownet_customer_id` and `membership_cards.user_id`).

**Prequisite for:** Full end-to-end testing of Phase B (Check-in) and Phase C (Check-out).

**CURRENT FOCUS: Emergency Auth Simplification & Troubleshooting Plan (Sub-Phase of Phase D)**

Due to issues with the OTP flow (specifically, getting stuck on "Loading..." screens), an emergency plan is currently active to simplify, isolate, and verify each step of the core Supabase OTP authentication before re-integrating card-specific logic.

*   **Overall Goal of Emergency Plan:** Fix the Supabase OTP email login flow, making it stable.
*   **Phase 0: Preparation & Clean Slate (Status: COMPLETED by user)**
    *   Tasks: Commit to Git, new branch (`emergency-auth-refactor`), clear browser data, verify environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`).
*   **Phase 1: Strip Down to Core OTP Login - Isolate Supabase & Middleware (Status: COMPLETED & VERIFIED)**
    *   **Objective:** Verify basic Supabase OTP login and session management works independently of card registration.
    *   **Tasks & Current Status:**
        *   **Minimal Login Page (`app/login/page.tsx`):**
            *   Adapted from existing login page to implement OTP (Magic Link) flow.
            *   Uses `supabase.auth.signInWithOtp` with `emailRedirectTo` pointing to `/auth/callback`. No `card_identifier` is sent for this generic login test.
            *   **Status: Code Updated. Awaiting user test.**
        *   **Minimal Protected Page (`app/dashboard/page.tsx`):**
            *   Intended to be used as the protected route for this test.
            *   Requires server-side authentication logic (e.g., using `createServerComponentClient` from `@supabase/ssr` or equivalent) to fetch user and redirect if unauthenticated.
            *   **Status: CORRECTED (Switched from `@supabase/auth-helpers-nextjs` to `@supabase/ssr` for `createServerClient`). VERIFIED WORKING.**
        *   **Middleware (`lib/supabase/middleware.ts` and root `middleware.ts`):**
            *   `lib/supabase/middleware.ts`: Revised to correctly refresh sessions for pages AND API routes, and to apply redirection logic appropriately. Cookie handling updated to `getAll`/`setAll`.
            *   Root `middleware.ts`: Corrected to include the necessary `config` object with the `matcher`.
            *   **Status: UPDATED & CORRECTED.**
        *   **Auth Callback (`app/auth/callback/route.ts`):**
            *   Modified to handle OTP callbacks *without* `card_identifier` in `user.user_metadata`. Cookie handling updated to `getAll`/`setAll`.
            *   If `card_identifier` is absent, redirects to `/dashboard?login=success`.
            *   If `card_identifier` is present, existing card claim logic proceeds.
            *   **Status: UPDATED.**
        *   **AuthContext (`app/context/AuthContext.tsx`):**
            *   Minor simplification applied (commented out a potentially redundant `useEffect` for profile fetching) to reduce complexity.
            *   **Status: UPDATED.**
        *   **Overall Phase 1 Test Flow:**
            1. User navigates to `/login`.
            2. Enters email, submits form (`signInWithOtp` is called).
            3. User receives OTP email, clicks the link.
            4. User is redirected to `/auth/callback`.
            5. Callback exchanges code, finds no `card_identifier` in metadata, redirects to `/dashboard`.
            6. User lands on `/dashboard` and is successfully logged in.
        *   **Overall Phase 1 Status: COMPLETED & VERIFIED.** (Core OTP login stable after fixing Supabase client initialization in `app/dashboard/page.tsx` and cookie handling in middleware/callback).
*   **Phase 2: Re-integrate Card Registration OTP Flow (Status: PENDING)**
    *   Once Phase 1 (core OTP login) is confirmed working, this phase will re-introduce the card registration specifics.
    *   Key Files & Tasks: `app/components/onboarding/CardLanding.tsx`, `app/api/auth/otp/register-and-claim/route.ts`, and further adjustments to `app/auth/callback/route.ts` for the card claim logic.
*   **Phase 3: Test & Iterate (Status: PENDING)**
    *   Full end-to-end testing of the `/card/[CARD_ID]` OTP registration flow.

---
**Original Phase D Plan (Details below will be resumed after Emergency Auth Plan is complete)**

**Step 1: Audit Existing Registration & Onboarding Code - Summary of Findings**

*   **Objective:** Understand current (potentially outdated or unused) registration mechanisms, identify reusable components/logic, and pinpoint areas for refactoring or replacement to support the new OTP flow and Glownet provisioning.
*   **Audit Conclusions:**
    *   **API Routes:**
        *   `app/api/card-status/route.ts`: **Reusable.** Effectively checks card registration status.
        *   `app/api/create-profile-and-claim/route.ts`: **Reference for Logic, Not Reusable Directly.** Contains useful patterns for database interactions (card validation, profile creation, membership record creation, card updates) and conceptual Glownet provisioning. However, its core email/password authentication mechanism is outdated for the OTP flow. Logic for deriving venue ID and Glownet interaction needs careful adaptation. (This file has since been deleted).
        *   `app/api/auth/magic-link/send/route.ts`: **Non-Existent.** Confirms OTP sending will be client-initiated, and backend logic for post-OTP verification and claiming needs to be built (likely in an auth callback handler). (Note: `app/api/auth/otp/register-and-claim/route.ts` now serves this purpose for new user registration).
    *   **Frontend Components:**
        *   `app/card/[card_id]/page.tsx`: **Reusable.** Serves as a simple server-side wrapper for `CardLanding.tsx`.
        *   `app/components/onboarding/CardLanding.tsx`: **Good Foundation, Needs Major Adaptation.** Handles card status display well. Needs significant changes to:
            *   Embed an inline OTP registration form (Email, optional Username) when a card is 'unregistered'.
            *   Call the new `POST /api/auth/otp/register-and-claim` API from this form.
            *   Remove navigation to the old `/create-profile` page for unregistered cards.
        *   `app/components/auth/CreateProfileForm.tsx`: **Example Form Structure.** Provides a good `react-hook-form` example but is tied to the old email/password flow via `/api/create-profile-and-claim`. Its structure can inform the new inline OTP form.
    *   **Libraries & Utilities:**
        *   `lib/auth.ts`: **Placeholder.** Currently minimal; can house future shared auth utilities.
        *   `lib/glownet.ts`: **Needs Enhancement.** Contains `glownetVirtualTopup` and `getGlownetCustomerDetails`. Critically requires the new `async function getOrCreateGlownetCustomer(...)` as defined in the development plan below.
    *   **Database Schema (`schema.sql`, `lib/database.types.ts`):** **Adequate.** The tables (`profiles`, `membership_cards`, `venues`, `memberships`) and their defined relationships (especially `membership_cards.glownet_event_id` linking to `venues.glownet_event_id`) support the planned onboarding flow. The `handle_new_user` trigger is crucial for initial profile creation via OTP metadata.

**Step 2: Development Plan for OTP-Based Card Registration & Glownet Provisioning**

*   **(COMPLETED) Develop Glownet Utility (`lib/glownet.ts`):**
    *   Task: Implemented `async function getOrCreateGlownetCustomer(glownetEventId: number | string, userProfile: { email?: string, username?: string }): Promise<number | null>`.
    *   Details: This function searches for an existing Glownet customer by email for the given event or creates a new one, returning the `glownet_customer_id`.
    *   Update: Modified to provide a placeholder for `last_name` during customer creation to satisfy Glownet API requirements.

*   **A. Frontend Flow (`/card/[card_identifier]` page & `CardLanding.tsx` component): (Status: PAUSED - Blocked by core auth issues)**
    1.  Fetches card status using `GET /api/card-status?card_id=[card_identifier]`.
    2.  **If Card Unregistered:**
        *   Displays an inline OTP registration form (Email only; username field removed) using `react-hook-form` and `zod`.
        *   On submit, calls `POST /api/auth/otp/register-and-claim`.
        *   Provides user feedback via toasts.
    3.  **If Card Registered:**
        *   Prompts for login.
    *   Update: Optional username field removed from form and schema. Detailed logging added to `CardLanding.tsx` to diagnose a persistent "Loading..." issue.

*   **B. Backend API Route (`POST /api/auth/otp/register-and-claim`): (Status: COMPLETED - Awaiting full flow test)**
    *   **File:** `app/api/auth/otp/register-and-claim/route.ts`
    *   **Input:** `{ email: string, cardIdentifier: string }` (username removed).
    *   **Processing:**
        1.  **Send OTP:** Calls Supabase `supabase.auth.signInWithOtp({ email, options: { data: { card_identifier: cardIdentifier }, shouldCreateUser: true, emailRedirectTo: '/auth/callback' } })`. (Username removed from `options.data`).
        2.  Returns a success message to the client.
    *   Update: Username removed from schema, request handling, and OTP options. Ensured `NEXT_PUBLIC_SITE_URL` is correctly used for `emailRedirectTo`.

*   **C. Backend Logic (Auth Callback Route Handler): (Status: PARTIALLY UPDATED - Core logic for card claim exists, adapted for minimal OTP flow. Full card claim flow testing pending)**
    *   **File:** `app/auth/callback/route.ts` (Handles `GET` requests)
    *   This logic executes after the user clicks the OTP link and is redirected.
    *   **Processing:**
        1.  **Session Verification & User Retrieval:** Exchanges auth code for a session, retrieves the Supabase user.
        2.  **Metadata Retrieval:** Extracts `card_identifier` from `user.user_metadata` (username no longer present).
        3.  **Fetch/Update User Profile:** (Username update step skipped as username is not collected).
        4.  **Validate Card.**
        5.  **Determine Venue Association.**
        6.  **Provision Glownet Customer ID.**
        7.  **Database Updates.**
        8.  **Redirects User.**
    *   Update: Logic confirmed to handle missing username in metadata gracefully. Middleware (`lib/supabase/middleware.ts`) updated to make `/auth/callback` a public route.

*   **(COMPLETED) Error Page (`/card/claim-error`):**
    *   A simple page to display error messages passed via query parameters from the auth callback.

**Current Status & Next Steps for Phase D (as of last interaction before emergency plan):**
1.  **Issue:** The `/card/[card_id]` page (`CardLanding.tsx`) gets stuck on "Loading..." after a previous failed OTP attempt or when navigating to any card URL directly. **(This is the primary issue the "Emergency Auth Simplification Plan" aims to unblock by first stabilizing core OTP.)**
2.  **Recent Actions (before emergency plan):**
    *   Removed optional username from OTP flow (frontend, backend API, callback).
    *   Resolved initial OTP errors (missing `NEXT_PUBLIC_SITE_URL`, middleware block for `/auth/callback`, Glownet `last_name` requirement).
    *   Added detailed logging to `CardLanding.tsx` to diagnose the "Loading..." state.
3.  **Immediate Next Step (after Emergency Auth Plan completion):**
    *   Return to diagnosing `CardLanding.tsx` using the insights gained from the simplified OTP flow.
    *   Analyze console logs from `CardLanding.tsx`.

Once these are done, Phase D will be fully complete, unblocking Phase B and C.