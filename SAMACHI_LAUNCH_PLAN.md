# Samachi App - Soft Launch MVP Plan

**Primary Goal:** For the soft launch on Saturday, users must be able to complete the full flow:
1.  Register for Samachi using a physical card (QR code) via OTP Magic Link.
2.  Stake USDC (Devnet) into their Samachi account.
3.  Check into a venue, funding their Glownet card (gtag) with their staked amount.
4.  (Simulate) Making a purchase using the Glownet card.
5.  Check out of the venue, with the spent amount deducted from their staked balance.

---

## I. Completed / In Progress Components & Milestones

We have made significant progress on the backend and foundational elements:

1.  **Core User Authentication & Onboarding:** [Mostly Complete, Minor Fixes/Testing Ongoing]
    *   **OTP Magic Link Registration:** Functional. Users can register via email OTP when landing on `/card/[card_identifier]`. Issues related to profile creation (duplicate usernames) and cookie handling identified and addressed during testing.
        *   `POST /api/auth/otp/register-and-claim`: Verified working.
        *   `app/auth/callback/route.ts`: Verified working. Handles OTP verification, user creation, profile creation (via trigger), card validation, Glownet customer provisioning, and membership creation.
    *   **Card Claiming & Glownet Provisioning:** Verified working as part of the OTP callback flow.
        *   `lib/glownet.ts` (`getOrCreateGlownetCustomer`): Verified working.
        *   Database Updates (`membership_cards`, `memberships`): Verified working during OTP callback.
    *   **Venue Sync (`scripts/sync-venues.ts`):** [COMPLETED & TESTED]
    *   **Card Sync (`scripts/sync-cards.ts`):** [COMPLETED & TESTED] - Initial issue fixed where `glownet_event_id` was not set. Script now correctly populates this field.

2.  **Custodial Staking Backend (USDC Devnet):** [Mostly Complete, Minor Fixes/Testing Ongoing]
    *   **Treasury Wallet:** Configured.
    *   **Database Tables:** In place.
    *   **API Routes (Core Staking Logic):**
        *   `POST /api/staking/helius-webhook`: Verified receiving transactions via Helius. **Blocked:** Cannot create `custodial_stakes` record because user profile isn't linked to the sending wallet address yet (i.e., `profiles.wallet_address` is not populated before the webhook processes the transaction).
        *   `POST /api/staking/unstake`: Backend logic implemented. (Full flow testing pending).
        *   `GET /api/staking/balance`: Verified working. Returns 0 correctly when no stakes recorded.
        *   `GET /api/staking/stakes`: Verified working. Returns empty array correctly.

3.  **Custodial Staking Frontend (SolanaContext & Wallet Page):** [In Progress]
    *   `SolanaContext.tsx`:\n        *   `stake(amount)`: Verified working for constructing and sending USDC transfer to treasury.\n        *   `unstake(amount)`: Calls the backend `/api/staking/unstake` route.\n        *   `fetchCustodialBalance()`, `fetchCustodialStakes()`: Verified working for fetching and displaying balance/stakes (currently 0).\n    *   `app/wallet/page.tsx` (`WalletDashboard.tsx`): Basic UI implemented for staking, unstaking, and displaying balance. Stake transaction initiated successfully from UI.
    *   **Issue 1 (Helius Webhook):** Frontend balance doesn't update as the Helius webhook fails to link the incoming transaction to a user profile. This is because `profiles.wallet_address` is not set *before* the stake transaction occurs and the webhook is notified (see "Custodial Staking Backend" point 2 above).
    *   **Issue 2 (Profile Loading):** Attempts to implement pre-stake wallet linking logic within `SolanaContext.tsx` (to resolve Issue 1) have surfaced a new error: "Cannot stake: User profile not loaded or user not authenticated." This indicates that the `profile` data from `AuthContext` is not reliably available when the staking process is initiated in `WalletDashboard.tsx` (which calls `stake()` in `SolanaContext.tsx`).
    *   **CURRENT FOCUS:**
        1.  **Resolving the "User profile not loaded" error:** Ensuring that `profile` data from `AuthContext` is fully loaded and available in `WalletDashboard.tsx` and `SolanaContext.tsx` before staking or wallet-linking actions are attempted.
        2.  **Implementing pre-stake wallet linking:** Once profile data is reliably available, successfully implement logic within `SolanaContext.tsx` to link the connected wallet address (`publicKey`) to the user's `profiles.wallet_address` (via a call to `/api/profile/link-wallet`) *before* the actual stake Solana transaction is constructed and sent. This is critical to unblock the Helius webhook.

4.  **Venue Check-in/Check-out Backend:** [Partially Implemented / Reviewed]
    *   `POST /api/memberships/check-in`: Code reviewed, logic seems mostly correct. **Partially Tested:** Fails correctly with 400 Bad Request when staked balance is 0. Full test pending successful staking. Requires `glownetVirtualTopup`.
    *   `POST /api/memberships/check-out` (Settlement): Logic designed (see Phase 2 below). Implementation pending. Requires Glownet API calls for spent amount and potentially zeroing out tag.
    *   `lib/glownet.ts` (`glownetVirtualTopup`): Reviewed. Logic seems correct (handles cents conversion). Full test pending successful check-in attempt.

---

## II. Iterative Plan for Soft Launch MVP (Current Status -> Saturday)

**Current Blocker:**
*   The primary issue preventing end-to-end staking is that the Helius webhook (`POST /api/staking/helius-webhook`) cannot associate incoming USDC transactions with a Samachi user profile. This is because the `profiles.wallet_address` field for the user is not populated with their staking wallet address *before* the stake transaction is sent and subsequently processed by the webhook.
*   Attempts to resolve this by adding pre-stake wallet linking logic in `SolanaContext.tsx` (which would call `/api/profile/link-wallet`) have surfaced a secondary, critical blocker: an error stating "Cannot stake: User profile not loaded or user not authenticated." This error occurs when `WalletDashboard.tsx` calls the `stake` function in `SolanaContext.tsx`, indicating that the `profile` object (expected from `AuthContext`) is not reliably available at that point. This is likely due to timing or race conditions related to asynchronous profile fetching after login.

**Next Steps (Following Current Blocker):**

**Phase 1: Resolve Profile Loading, Implement Wallet Linking, & Test Staking/Check-in**
*   **Objective:** Ensure profile data is reliably loaded and available, implement robust pre-stake wallet linking, enable successful end-to-end staking, and then test the check-in API.
*   **Tasks:**
    1.  **[CRITICAL URGENT FIX - Focus: `AuthContext.tsx`, `WalletDashboard.tsx`, `SolanaContext.tsx`]**
        *   Investigate and resolve the "User profile not loaded" error that occurs when initiating the staking process.
        *   Ensure that `WalletDashboard.tsx` only enables staking actions or calls the `stake` function in `SolanaContext.tsx` *after* it's certain that `AuthContext` has finished loading and provides a valid `profile` object (containing `user_id`, `wallet_address`, etc.).
        *   This might involve:
            *   Verifying `AuthContext` correctly fetches and updates its `profile` state.
            *   Ensuring `WalletDashboard.tsx` and `SolanaContext.tsx` correctly observe `isAuthLoading` (or a similar flag for profile loading status) and the `profile` state from `AuthContext` before proceeding with operations that depend on it.
    2.  **[IMPLEMENT/VERIFY - Focus: `SolanaContext.tsx`, `/api/profile/link-wallet`]** Once profile loading is stable and the `profile` object is reliably available in `SolanaContext.tsx`:
        *   Implement or re-verify the wallet linking logic within the `stake` function in `SolanaContext.tsx`. This logic must execute *before* the Solana transaction for staking is prepared and sent.
        *   **Detailed Steps for Wallet Linking in `stake()`:**
            *   Confirm `authUser` (from `AuthContext`) and `publicKey` (from `useWallet`) are available.
            *   Access the (now reliably loaded) `profile` from `AuthContext`.
            *   Check if `profile.wallet_address` is null/empty or different from `publicKey.toBase58()`.
            *   If linking is required:
                1.  Construct a challenge message (e.g., "Link wallet to Samachi profile ID: {authUser.id}").
                2.  Use `signMessage` (from `useWallet`) to prompt the user to sign this message with their connected wallet.
                3.  Send the original message, the base64-encoded signature, and `publicKey.toBase58()` to the `POST /api/profile/link-wallet` endpoint.
                4.  Handle the API response:
                    *   If linking fails (e.g., user cancels signature, API error), display an error toast to the user and abort the staking process.
                    *   If linking succeeds, call `fetchProfile(authUser.id)` (from `AuthContext`) to ensure the context's `profile` state is immediately updated with the newly linked `wallet_address`. Then, proceed to the staking transaction.
    3.  **Test Staking (End-to-End):**
        *   **Scenario:** Log in with a user whose `profiles.wallet_address` in Supabase is NULL or set to a different wallet address than the one to be used for staking.
        *   Connect the correct Phantom wallet for staking.
        *   Attempt to stake an amount from `WalletDashboard.tsx`.
        *   **Expected Behavior & Verification:**
            *   User should first be prompted by Phantom to sign the "link wallet" message.
            *   After successfully signing the link message, user should then be prompted by Phantom for the actual stake transaction signature.
            *   Verify that the `profiles` table in Supabase for the user now has the correct `wallet_address` populated.
            *   Verify that the Helius webhook (`/api/staking/helius-webhook`) successfully processes the transaction, finds the user's profile by the (now linked) `wallet_address`, and correctly creates a `custodial_stakes` record.
            *   Verify that the staked balance display on the frontend (`WalletDashboard.tsx`) updates correctly after the stake is confirmed and data is refreshed.
    4.  **Test Check-in:** With a non-zero staked balance confirmed:
        *   Attempt to check into a venue using the UI, which should trigger `POST /api/memberships/check-in`.
        *   Verify a successful API response.
        *   Verify the `memberships` table is updated correctly (e.g., `status` to 'checked-in', `last_check_in_at`, `last_funded_amount`).
        *   **Verify Glownet Call:** Confirm (e.g., via Glownet portal, logs, or mock if necessary) that `glownetVirtualTopup` in `lib/glownet.ts` was called successfully and the Glownet card was funded.
    5.  **(Optional but Recommended)** Review and refine the `calculateStakedBalance` helper function (likely in `lib/` or a relevant context/hook) to ensure it accurately reflects all stakes and withdrawals, especially if its current implementation is basic.

**Phase 2: Implement Check-out & UI Refinements (Based on Figma)**

*   **Objective:** Implement check-out functionality and refine UI based on Figma designs.
*   **Tasks:**
    1.  **Implement `POST /api/memberships/check-out`:** [Backend]
        *   Implement logic as outlined below (fetching membership, Glownet calls for spent amount, updating `custodial_withdrawals`, updating membership status).
        *   **CRITICAL: Glownet API Calls:** Determine and integrate actual Glownet API calls for getting spent amount/tag balance and zeroing out tag.
    2.  **Implement Check-out UI & Logic:** [Frontend]
        *   Connect "Check-Out" button to the API (`VenueDetail.tsx` or similar).
        *   Add loading states and user feedback.
        *   Ensure staked balance display refreshes after successful checkout.
    3.  **UI Implementation & Refinement (Figma):** [Frontend]
        *   Update `CardLanding.tsx` UI for onboarding.
        *   Refine `WalletDashboard.tsx` UI for staking/history.
        *   Implement venue page UI for check-in/out status and funded amount display.
        *   Update `Navbar.tsx` for auth state and potentially balance display.

**Phase 3: Full End-to-End Testing & Refinement**
*   **Objective:** Rigorously test the complete user journey.
*   **Test Scenarios (Minimum):** (As previously outlined)
    *   New User Full Flow (Register -> Stake -> Check-In -> Check-Out -> Verify Balance).
    *   Error Paths (Zero stake check-in, double check-in, etc.).

**Phase 4: Deployment Preparation & Go-Live (Vercel)**
*   **Objective:** Prepare for and deploy the application.
*   **Tasks:** (As previously outlined)
    *   Environment Variables in Vercel.
    *   Build & Test on Vercel Preview.
    *   Production Deployment & Smoke Test.

---
## Detailed Plan Sections (Reference)

### Phase 2 Details: Backend Check-in/Check-out

*   **`POST /api/memberships/check-in`:**
    *   **Input:** `{ venueId: string }`
    *   **Auth:** Requires authenticated Supabase user.
    *   **Validation:** Active membership, balance > 0, not already checked-in.
    *   **Logic:** Fetch balance, call `glownetVirtualTopup`, update `memberships` status, `last_check_in_at`, `last_funded_amount`.
    *   **Response:** Success/error.

*   **`POST /api/memberships/check-out` (Settlement):**
    *   **Input:** `{ venueId: string }`.
    *   **Auth:** Requires authenticated Supabase user.
    *   **Validation:** Membership status is `checked-in`.
    *   **Logic:**
        1.  Fetch membership (`glownet_customer_id`, `glownet_event_id`, `last_funded_amount`).
        2.  **Glownet API Call:** Get amount spent OR current balance.
        3.  Calculate `spentAmount`.
        4.  If `spentAmount > 0`, insert into `custodial_withdrawals`.
        5.  **(Optional) Glownet API Call:** Zero out tag balance.
        6.  Update `memberships` status to `active`.
    *   **Response:** Success/error.

### Phase 5 Details: Deployment Prep

*   **Environment Variables:** Ensure all keys (Supabase, Glownet, Treasury, Helius) are in Vercel settings for Preview and Production.
*   **Testing:** Thoroughly test on Vercel Preview before merging to Production.

### Contingency / Simplification

*   **UI:** Prioritize functional UI if Figma details are time-consuming.
*   **Glownet Settlement:** If getting exact spent amount is hard, assume full `last_funded_amount` was spent for MVP settlement calculation, but still attempt tag zero-out.

---
*This plan prioritizes getting the core user experience functional for the soft launch. Good luck!* 