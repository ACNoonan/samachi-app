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
    *   **(Optional) `GET /api/staking/withdrawals`:** Fetch withdrawal/settlement history.

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
    *   **Auth:** Verify Supabase/JWT auth.
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
    *   **Auth:** Verify Supabase/JWT auth.
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

**Phase D: UI Refinement**
*   Implement frontend UI based on Figma designs after backend logic is verified.

**Phase E: Deployment**
*   Configure Helius webhook, environment variables (including Glownet keys) for production.
*   Ensure Production Treasury Wallet is funded (SOL & potentially USDC).

---

## Original Testing Plan Sections (Archive - Completed)

**(Original sections A, B, C for core staking/unstaking are archived here for reference but considered complete)**

---

**Future Considerations / Optional Improvements:** (No change from previous version)

*   Add `GET /api/staking/withdrawals` endpoint and frontend display for withdrawal history.
*   Implement robust error handling and user feedback (toasts) for all operations.
*   Add RLS policies to `custodial_stakes` and `custodial_withdrawals`.
*   GDPR Compliance
*   Anchor smart contract development and integration (Superseded by custodial approach)
*   Wallet creation & Credit card funding 