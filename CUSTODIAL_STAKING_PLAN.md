# Custodial USDC Staking Implementation Plan

This document outlines the plan to implement a simplified, custodial staking mechanism for the Samachi app, replacing the initially planned Anchor smart contract approach. Remove any reference to or dependency on Anchor.

**Goal:** Allow users to "stake" USDC by sending it to a platform-controlled wallet and "unstake" by requesting a withdrawal, which the backend processes.

**Core Components:**

1.  **Treasury Wallet:**
    *   A standard Solana wallet (`Keypair`) generated and managed securely by the backend.
    *   Public Address (`TREASURY_WALLET_ADDRESS`): Displayed to users for deposits.
    *   Secret Key (`TREASURY_WALLET_SECRET_KEY`): Stored securely (env var) for processing withdrawals.

2.  **Database (`custodial_stakes` Table):**
    *   Stores records of user deposits (stakes).
    *   Schema includes: `user_profile_id`, `amount_staked`, `deposit_transaction_signature`, `status` ('staked', 'unstaking_requested', 'unstaked'), timestamps, etc.
    *   Tracks the state of each deposit/stake.
    *   *(Schema defined, needs applying)*

3.  **Deposit Listener (Helius Webhook):**
    *   Utilizes Helius webhooks to monitor the `TREASURY_WALLET_ADDRESS` for incoming USDC transfers.
    *   Webhook points to `api/staking/helius-webhook`.
    *   Filters are set on Helius to only trigger for the specific USDC mint address.
    *   *(Helius config needed)*

4.  **API Routes:**
    *   `POST /api/staking/helius-webhook`:
        *   Receives webhook notifications from Helius.
        *   Validates the webhook signature/secret.
        *   Identifies the user profile based on the sender's wallet address (`source`).
        *   Inserts a record into `custodial_stakes` with `status='staked'`.
        *   *(Initial structure created)*
    *   `POST /api/staking/request-unstake`:
        *   Authenticated endpoint for users to request withdrawals.
        *   Validates user's available staked balance.
        *   Updates `custodial_stakes` record status to `unstaking_requested`.
        *   *(To be created)*
    *   `POST /api/staking/process-unstake` (or background job):
        *   Internal/admin-triggered process.
        *   Queries for `unstaking_requested` stakes.
        *   Uses `TREASURY_WALLET_SECRET_KEY` to send USDC back to the user.
        *   Updates `custodial_stakes` record status to `unstaked` on success.
        *   *(To be created)*
    *   `GET /api/staking/balance`:
        *   Authenticated endpoint.
        *   Returns the user's total current staked balance from `custodial_stakes`.
        *   *(Created, blocked by missing Supabase types)*

5.  **Frontend (`SolanaContext`, `app/wallet/page.tsx`):**
    *   `SolanaContext.tsx` refactored to remove Anchor dependencies and add placeholders for custodial actions (`fetchCustodialBalance`, `stake`, `unstake`).
    *   Wallet page components needed to display balance, treasury address, and initiate stake/unstake actions.
    *   *(Context refactored, UI components to be created/updated)*

**Current Status:**

*   Anchor dependencies removed.
*   `custodial_stakes` table schema defined (needs applying to DB).
*   Treasury wallet generated (needs securing and funding).
*   Helius webhook configuration pending.
*   Initial `/api/staking/helius-webhook` route created.
*   `SolanaContext` refactored.
*   `/api/staking/balance` route created, but blocked by missing Supabase types file (`@/lib/database.types`).
*  Ran `supabase gen types typescript --project-id <your-project-ref> --schema public > lib/database.types.ts` 
*  Apply the `custodial_stakes` table schema to the Supabase database. --> **DONE**
2.5. Implement `GET /api/staking/stakes` to fetch all stakes for the authenticated user. **DONE**
3.  Implement the `POST /api/staking/request-unstake` route. --> **DONE**
4.  Implement the `POST /api/staking/process-unstake` route. --> **DONE**

**Next Steps:**

5.  Develop/update the frontend components in `app/wallet/page.tsx`.
6.  Securely store secrets (`TREASURY_WALLET_SECRET_KEY`, `HELIUS_WEBHOOK_SECRET`).
7.  Test the deposit flow with Helius/manual simulation.
8.  Test the unstake request flow.
9.  Test the unstake processing flow. 