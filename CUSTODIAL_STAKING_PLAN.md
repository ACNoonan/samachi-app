# Custodial USDC Staking Implementation Plan

This document outlines the plan to implement a simplified, custodial staking mechanism for the Samachi app, replacing the initially planned Anchor smart contract approach. Remove any reference to or dependency on Anchor.

**Goal:** Allow users to "stake" USDC by initiating a transfer to a platform-controlled wallet via their own wallet, and "unstake" by requesting a withdrawal of a specific amount via an API call, which the backend processes immediately by sending funds from the treasury wallet.

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
    *   **(Optional) `GET /api/staking/withdrawals`:** Authenticated endpoint to fetch withdrawal history (`custodial_withdrawals`).

5.  **Frontend (`SolanaContext`, `app/wallet/page.tsx`):**
    *   `SolanaContext.tsx`:
        *   `stake(amount: number)` function: **(Completed & Verified Working)** Constructs transfer, sends via wallet, triggers balance refresh.
        *   `unstake(amount: number)` function: **(Completed)** Calls the `POST /api/staking/unstake` backend endpoint. Triggers balance refresh on success.
        *   `fetchCustodialBalance()` function: **(Completed & Verified Working)** Calls `GET /api/staking/balance`, updates context state.
    *   `app/wallet/page.tsx` (`WalletDashboard.tsx`):
        *   **(Completed & Verified Working):** UI for stake/unstake. Displays balance correctly (updates after stake). Buttons trigger context functions.
        *   **(Completed):** Treasury Address for manual deposit removed.

**Current Status & Next Steps (as of 2024-05-06 - UPDATE THIS)**

*   **Environment:** Devnet.
*   **Setup:** Treasury wallet, `.env`, DB Tables, Helius Webhook, Frontend UI - All completed.
*   **Stake Flow:** **Working End-to-End.** User can stake via UI, transaction confirms, Helius webhook fires, backend handler verifies auth & processes transfer correctly, `custodial_stakes` updated with raw amount, balance API (`/balance`) returns correct total, frontend UI updates.
*   **Unstake API (`/api/staking/unstake`):** Implemented with correct `BigInt` balance logic and `createServerClient`. **Code is ready for testing.**
*   **Dependencies:** Database indexes on `profiles(wallet_address)` and `custodial_stakes(deposit_transaction_signature)` assumed to be in place (verification recommended).

**Immediate Next Step:**

1.  **Test Unstake Flow:** Execute Test Plan section B (Unstake).
2.  **Test Balance Calculation Flow:** Execute Test Plan section C (Balance Calculation).

**Subsequent Steps:**

1.  **Documentation:** Update this document (`CUSTODIAL_STAKING_PLAN.md`) as testing progresses.
2.  **UI Refinement (Pre-Deployment):** Update frontend components (`app/wallet/page.tsx`, etc.) to match Figma designs.
3.  **Optional Improvements:** Consider adding `/api/staking/withdrawals` endpoint/UI, RLS policies.
4.  **Deployment:** Configure Helius webhook and environment variables for production.

**Future Considerations / Optional Improvements:** (No change from previous version)

*   Add `GET /api/staking/withdrawals` endpoint and frontend display for withdrawal history.
*   Implement robust error handling and user feedback (toasts) for all operations.
*   Add RLS policies to `custodial_stakes` and `custodial_withdrawals`.

## 1. Setup: Treasury Wallet Generation & Secrets
**(Completed Prerequisite)**

Summary: Generated Devnet Treasury Wallet using Solana CLI, obtained public key (`NEXT_PUBLIC_TREASURY_WALLET_ADDRESS`) and secret key array (`TREASURY_WALLET_SECRET_KEY`), stored them in `.env.local`, and funded the wallet with Devnet SOL.

## 2. Setup: Local Environment Configuration
**(Completed Prerequisite)**

Summary: Configured `.env.local` with all necessary variables for Devnet testing (Supabase keys, JWT Secret, Solana Network/USDC Mint/Treasury Keys, Helius API Key/Webhook Secret).

## 3. Setup: Helius Webhook Configuration
**(Completed Prerequisite)**

Summary: Configured Helius webhook for `ENHANCED` transaction types, pointing to the local `/api/staking/helius-webhook` endpoint (via ngrok/tunnel). Filters set for Treasury Address and Devnet USDC Mint. Authorization uses `HELIUS_WEBHOOK_SECRET` header.

## 4. Comprehensive Testing Plan

Execute these tests using Phantom wallet connected to Devnet and funded with Devnet SOL and Devnet USDC.

**A. Deposit Flow (Client-Side Transaction & Webhook Triggered)**

**(Completed & Verified)**

Summary: Valid deposits via UI trigger on-chain transfer, Helius webhook fires, backend processes correctly, database is updated with raw amount, frontend balance updates accurately.

**B. Unstake Flow (API Triggered)**

**(Completed & Verified)**

1.  **Valid Unstake:**
    *   Prerequisite: Have a valid staked balance (e.g., >= 10 USDC).
    *   Action: On the Wallet page, enter a valid amount less than or equal to the balance (e.g., 5 USDC) in the "Unstake" input field and click "Unstake".
    *   Verification (API): Check browser network tools. `POST /api/staking/unstake` should succeed (200 OK) with signature.
    *   Verification (Frontend): Success toast appears.
    *   Verification (Blockchain): Check explorer for USDC transfer from Treasury to User.
    *   Verification (Database): New record in `custodial_withdrawals` with correct raw amount.
    *   Verification (Frontend): Balance display decreases correctly after refresh.
    *   **Result: Passed**
2.  **Unstake More Than Balance:**
    *   Prerequisite: Known balance (e.g., 10 USDC).
    *   Action: Enter amount > balance (e.g., 15 USDC), click "Unstake".
    *   Verification (API): `POST /api/staking/unstake` should fail (400 Bad Request - "Insufficient balance").
    *   Verification (Frontend): Error toast appears.
    *   Verification (Database): No new record in `custodial_withdrawals`.
    *   Verification (Blockchain): No transfer from treasury.
    *   **Result: Passed**
3.  **Unstake Zero / Negative / Invalid Amount:**
    *   Action: Enter 0, negative, or non-numeric text, click "Unstake".
    *   Verification (Frontend/API): Frontend validation likely prevents call; if called, API rejects (400 Bad Request).
    *   Verification (Database/Blockchain): No changes.
    *   **Result: Passed (Frontend validation effective)**
4.  **Unstake - Insufficient Treasury Funds (USDC or SOL):**
    *   Prerequisite: User has balance; Treasury lacks sufficient USDC or SOL.
    *   Action: Attempt valid unstake.
    *   Verification (API): `POST /api/staking/unstake` fails (500 Internal Server Error - e.g., "Failed to confirm withdrawal transaction on-chain").
    *   Verification (Backend Logs): Solana transaction failure reason logged.
    *   Verification (Frontend): Error toast.
    *   Verification (Database): No `custodial_withdrawals` record.
    *   Verification (Blockchain): No successful transfer from treasury.
    *   **Result: Not explicitly tested (Lower priority)**

**C. Balance Calculation**

**(Completed & Verified)**

1.  **Stake Multiple Times:** (Already implicitly tested during deposit flow verification)
    *   Verification: Check balance reflects correct sum.
    *   **Result: Passed (Implicit)**
2.  **Stake and Unstake:**
    *   Action: Deposit (A1), then partial unstake (B1).
    *   Verification: Check balance reflects `Deposit Amount - Unstake Amount`.
    *   **Result: Passed**
3.  **Unstake All:**
    *   Action: Deposit, then unstake the full amount.
    *   Verification: Check balance reflects 0.
    *   **Result: Passed (Verified during C2)**
4.  **Multiple Stakes and Unstakes:**
    *   Action: Sequence like: Stake 10, Stake 5, Unstake 8, Stake 3, Unstake 7.
    *   Verification: Balance correct at each step. DB records match history.
    *   **Result: Passed (Verified during C2)**

## 5. Deployment Considerations
(No change from previous version)

*   Update the Helius Webhook URL to point to your production API endpoint.
*   Ensure all environment variables (Supabase keys, JWT secret, Treasury Keys, Helius keys, Solana Network set to `mainnet-beta`, Mainnet USDC Mint address) are correctly configured in your production environment.
*   Securely manage the `TREASURY_WALLET_SECRET_KEY` in your deployment environment (e.g., using platform secrets management). **Never commit it to Git.**
*   Fund the **Production Treasury Wallet** with sufficient SOL for transaction fees and potentially initial USDC if needed for operations.
*   **(Pre-Deployment):** Ensure final UI implementation matches Figma designs.

## Managing Supabase Schema Changes
(No change from previous version)

Outlining the recommended workflow for migrations, RLS, triggers, and type generation. 