# Custodial USDC Staking Implementation Plan

This document outlines the plan to implement a simplified, custodial staking mechanism for the Samachi app, replacing the initially planned Anchor smart contract approach. Remove any reference to or dependency on Anchor.

**Goal:** Allow users to "stake" USDC by sending it to a platform-controlled wallet and "unstake" by requesting a withdrawal, which the backend processes.

**Core Components:**

1.  **Treasury Wallet: DEVNET**
    *   A standard Solana wallet (`Keypair`) generated and managed securely by the backend.
    *   Public Address (`TREASURY_WALLET_ADDRESS`): Displayed to users for deposits.
    *   Secret Key (`TREASURY_WALLET_SECRET_KEY`): Stored securely (env var) for processing withdrawals.

    keypair file itself, which is stored as insecure plain text

Wrote new keypair to /Users/adamnoonan/.config/solana/samachi-treasury-devnet.json
==============================================================================
pubkey: 3SCwZqi4BWWaLGgW861UUgCUbhnJoschA4AiYbHzbr7C



2.  **Database (`custodial_stakes` Table):**
    *   Stores records of user deposits (stakes).
    *   Schema includes: `user_profile_id`, `amount_staked`, `deposit_transaction_signature`, `status` ('staked', 'unstaking_requested', 'unstaked'), timestamps, etc.
    *   Tracks the state of each deposit/stake.
    *   **(Schema Verified):** The `custodial_stakes` table, related functions (`get_current_user_profile_id`, `update_updated_at_column`), trigger (`update_custodial_stakes_updated_at`), RLS policy (`Allow users to view their own stakes`), and indexes are correctly implemented in Supabase as per `supabase/migrations/create_custodial_stakes.sql`.


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
5.  Develop/update the frontend components in `app/wallet/page.tsx`. --> **DONE**

**Next Steps:**

1.  **Generate Treasury Wallet & Set Secrets:** Use Solana CLI to create the keypair and store keys securely in environment variables (see instructions below).
2.  **Local Environment Setup:** Configure your `.env.local` file with all necessary secrets and addresses (see instructions below).
3.  **Configure Helius Webhook:** Set up the webhook in Helius pointing to your (ngrok tunneled) local endpoint (see instructions below).
4.  **Testing:** Execute the comprehensive test plan (see below).
5.  **Deployment:** Deploy the application and update Helius webhook URL for production.

**Future Considerations / Optional Improvements:**

*   **RLS on `membership_cards`:** Enable Row Level Security and define appropriate policies (e.g., allow public read of status, allow owner read/update) for the `membership_cards` table.
*   **`updated_at` Triggers:** Implement triggers using `public.update_updated_at_column` for the `venues` and `memberships` tables to automatically update their `updated_at` timestamps.

## 1. Generating the Treasury Wallet & Setting Secrets

This wallet will hold the staked USDC. **Keep the secret key absolutely secure.**

1.  **Install Solana CLI:** If you haven't already, install the Solana CLI tools: [https://docs.solana.com/cli/install](https://docs.solana.com/cli/install)
2.  **Set CLI to Devnet:** Ensure your Solana CLI is configured for Devnet:
    ```bash
    solana config set --url https://api.devnet.solana.com
    solana config get # Verify RPC URL is Devnet
    ```
3.  **Generate Keypair:** Open your terminal and run:
    ```bash
    solana-keygen new --outfile ~/.config/solana/samachi-treasury-devnet.json
    ```
    *   This creates a new keypair file at the specified path.
    *   **Important:** The command will output the `pubkey` (this is your `NEXT_PUBLIC_TREASURY_WALLET_ADDRESS`) and the `seed phrase`. **Save the seed phrase securely offline.** You don't directly use the seed phrase in the app, but it's your ultimate backup.
4.  **Get Public Key (Address):** Run the following command (using the path from step 3):
    ```bash
    solana-keygen pubkey ~/.config/solana/samachi-treasury-devnet.json
    ```
    *   Copy the output address. This is your `NEXT_PUBLIC_TREASURY_WALLET_ADDRESS`.
5.  **Get Secret Key (Byte Array):** The secret key needed for signing transactions in the backend is stored within the JSON file as a byte array. You can view it (carefully!) using:
    ```bash
    cat ~/.config/solana/samachi-treasury-devnet.json
    ```
    *   Copy the entire array of numbers (e.g., `[11, 22, 33, ..., 99]`). This is your `TREASURY_WALLET_SECRET_KEY`. **Do not share this or commit it to Git.**
6.  **Set Environment Variables:** Add the public key and secret key array to your `.env.local` file:
    ```dotenv
    # .env.local
    NEXT_PUBLIC_TREASURY_WALLET_ADDRESS=YOUR_DEVNET_PUBLIC_KEY_FROM_STEP_4
    TREASURY_WALLET_SECRET_KEY=[YOUR_DEVNET_SECRET_KEY_ARRAY_FROM_STEP_5]
    # ... other variables
    ```
7.  **Fund Treasury Wallet (Devnet):** You'll need some Devnet SOL in the treasury wallet to pay for transaction fees when processing unstakes. Use a Devnet faucet (e.g., [https://solfaucet.com/](https://solfaucet.com/)) to send SOL to the `NEXT_PUBLIC_TREASURY_WALLET_ADDRESS` (your new Devnet address). You might need 1-2 SOL.

## 2. Local Environment Setup

Ensure your `.env.local` file contains all necessary variables for local development and testing against **Devnet**.

```dotenv
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY # Used in backend routes

# Authentication (Magic Link is handled by Supabase keys)
# Phantom Auth JWT Secret (generate a strong random string)
JWT_SECRET=YOUR_STRONG_RANDOM_JWT_SECRET

# Solana Staking (Devnet)
# Use the devnet network identifier
NEXT_PUBLIC_SOLANA_NETWORK=devnet
# Use the official Devnet USDC mint address
NEXT_PUBLIC_USDC_MINT_ADDRESS=Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr
# Treasury wallet generated for Devnet in Step 1
NEXT_PUBLIC_TREASURY_WALLET_ADDRESS=YOUR_DEVNET_PUBLIC_KEY_FROM_SOLANA_CLI
TREASURY_WALLET_SECRET_KEY=[YOUR_DEVNET_SECRET_KEY_ARRAY_FROM_SOLANA_CLI]

# Helius (Needed for deposit webhook testing)
# Use your Helius API Key associated with Devnet if possible, or your general key.
HELIUS_API_KEY=YOUR_HELIUS_API_KEY
# Optional: If using custom Authorization header instead of Helius signature verification
# HELIUS_WEBHOOK_SECRET=YOUR_CHOSEN_WEBHOOK_SECRET

# Glownet (if applicable)
# GLOWNET_API_KEY=...
# GLOWNET_BASE_URL=...

# Other necessary variables...
```

**Note on Devnet USDC:** Testing the deposit flow via the Helius webhook will now work more directly. Point Helius to your internet-accessible endpoint (using `ngrok` or similar during local development) and trigger deposits by sending *real* Devnet USDC (obtainable from faucets like [https://spl-token-faucet.com/?token=USDC](https://spl-token-faucet.com/?token=USDC)) to your newly generated Devnet Treasury Wallet address. The backend webhook handler (`/api/staking/helius-webhook`) should receive the notification from Helius.

## 3. Helius Webhook Setup Instructions

Follow these steps to configure the Helius webhook needed to listen for USDC deposits to the treasury wallet:

1.  **Log in to Helius:** Go to [dev.helius.xyz](https://dev.helius.xyz/) and log in to your account.
2.  **Navigate to Webhooks:** In the dashboard, find the "Webhooks" section.
3.  **Create New Webhook:** Click on "Create Webhook" or similar.
4.  **Webhook URL:**
    *   Enter the **full URL** where your application will receive the webhook notifications. During local development, you'll need a tunneling service like `ngrok` or the `stripe listen` CLI to expose your local endpoint (`http://localhost:3000/api/staking/helius-webhook`) to the internet. For production, use your deployed API endpoint URL (e.g., `https://your-samachi-app.com/api/staking/helius-webhook`).
5.  **Transaction Types:**
    *   Select `ENHANCED` as the transaction type. This provides richer, parsed information.
6.  **Account Addresses:**
    *   Add the **Treasury Wallet Public Address** (`process.env.NEXT_PUBLIC_TREASURY_WALLET_ADDRESS`) to the "Account Addresses" to monitor. This ensures the webhook triggers only for transactions involving this address.
7.  **Filters (Crucial):**
    *   **Transaction Type:** Add a filter for `TRANSFER` transaction types.
    *   **Token Address (Mint Account):** Add a filter for the **USDC Mint Address** (`process.env.NEXT_PUBLIC_USDC_MINT_ADDRESS`). This ensures you only get notifications for USDC transfers, not SOL or other tokens.
    *   **Source (Optional but Recommended):** You might initially skip filtering by `Source` if you want *any* USDC transfer *to* the treasury. However, ensure your backend (`/api/staking/helius-webhook`) correctly identifies the *sender* from the transaction details Helius provides (`source` field in the webhook payload) to associate the stake with the correct user profile.
8.  **Webhook Secret (Authorization Header):**
    *   Helius automatically generates a secure signature for each webhook request, sent in the `helius-signature` header. Your backend (`/api/staking/helius-webhook`) **must** verify this signature using your Helius API key to ensure the request is genuinely from Helius.
    *   Alternatively, Helius allows setting a custom `Authorization` header value (like a secret token). If you use this, store this secret securely (e.g., `HELIUS_WEBHOOK_SECRET` env var) and validate it in your backend.
9.  **Create & Test:** Save the webhook. Helius usually provides a way to send a test payload to your configured URL. Use this to verify your endpoint receives and processes the data correctly.

**Important Considerations:**

*   **Environment Variables:** Ensure your treasury address and USDC mint address are correctly set in your environment variables (`.env.local` or production environment).
*   **Backend Validation:** The most critical step is **securely validating** the incoming webhook requests in your `/api/staking/helius-webhook` route using either the Helius signature or your custom Authorization header secret.
*   **Idempotency:** Design your webhook handler to be idempotent. If Helius sends the same event twice (rare, but possible), your handler shouldn't create duplicate stake entries. Check if a stake with the same `deposit_transaction_signature` already exists before inserting.

## 4. Comprehensive Testing Plan

Execute these tests **after** setting up the treasury wallet, environment variables, and Helius webhook. Use Phantom wallet connected to Devnet and funded with Devnet SOL and Devnet USDC.

**A. Deposit Flow (Webhook Triggered)**

1.  **Valid Deposit:**
    *   **Action:** Connect Phantom wallet (associated with a Samachi profile) to the app. Copy the Treasury Address from the Wallet page. Open Phantom and send a specific amount (e.g., 10 USDC) of Devnet USDC to the Treasury Address.
    *   **Verification (Webhook):** Check the ngrok terminal window (`http://localhost:4040` in browser) or Helius dashboard logs to confirm the webhook fired and received a `200 OK` response from your `/api/staking/helius-webhook` endpoint.
    *   **Verification (Database):** Check the `custodial_stakes` table in Supabase. A new record should exist with the correct `user_profile_id`, `amount_staked` (ensure correct decimals, likely 10 \* 10^6), the `deposit_transaction_signature`, and `status='staked'`.
    *   **Verification (Frontend):** Refresh the Wallet page in the app. The "Your Staked Balance" should update to reflect the deposited amount (e.g., 10 USDC).
2.  **Deposit from Unrecognized Wallet:**
    *   **Action:** Send Devnet USDC from a wallet *not* associated with any profile in your `profiles` table to the Treasury Address.
    *   **Verification (Webhook):** Webhook should fire. Check logs for your `/api/staking/helius-webhook` endpoint. It should ideally handle this gracefully (e.g., log an error "Sender wallet not found in profiles", return `200 OK` to Helius to prevent retries, but *not* create a stake record).
    *   **Verification (Database):** No new record should be created in `custodial_stakes`.
3.  **Incorrect Token Deposit:**
    *   **Action:** Send Devnet SOL (or another SPL token) to the Treasury Address.
    *   **Verification (Webhook):** The Helius webhook **should not** fire because of the Mint Address filter configured in Helius. Verify this in Helius logs.
4.  **Webhook Validation Failure (Simulation):**
    *   **Action (Manual):** Use `curl` or Postman to send a fake payload (missing or incorrect `helius-signature`/`Authorization` header) to your `/api/staking/helius-webhook` endpoint (via ngrok URL).
    *   **Verification (Webhook):** Your endpoint should return an error status (e.g., 401 or 403) and *not* process the fake deposit.
    *   **Verification (Database):** No new record should be created in `custodial_stakes`.
5.  **Idempotency Test:**
    *   **Action (Manual):** Re-send a valid Helius test payload (or a captured real payload) to your webhook endpoint multiple times.
    *   **Verification (Database):** Only *one* record should exist in `custodial_stakes` for that specific `deposit_transaction_signature`. Subsequent calls should be ignored or handled without creating duplicates.

**B. Unstake Request Flow**

1.  **Valid Unstake Request:**
    *   **Prerequisite:** Have a valid staked balance from Test A1.
    *   **Action:** On the Wallet page, click the "Request Unstake" button.
    *   **Verification (API):** Check browser network tools. A `POST` request to `/api/staking/request-unstake` should succeed (200 OK).
    *   **Verification (Database):** Find the relevant record(s) in `custodial_stakes` for the user. The `status` should change from `staked` to `unstaking_requested`.
    *   **Verification (Frontend):** A success toast should appear. The "Request Unstake" button might become disabled or show a pending state (depending on UI choice). The balance should *not* change yet.
2.  **Unstake with Zero/No Balance:**
    *   **Prerequisite:** User has no staked balance or wallet not connected.
    *   **Action:** The "Request Unstake" button should be disabled. If somehow enabled and clicked, the action should fail.
    *   **Verification (API):** Request to `/api/staking/request-unstake` should ideally be blocked by frontend, or fail with an appropriate error (e.g., 400 Bad Request) from the backend if reached.
    *   **Verification (Database):** No changes in `custodial_stakes`.
3.  **Unstake While Request Pending:**
    *   **Prerequisite:** An unstake request is already pending (`status='unstaking_requested'`).
    *   **Action:** The "Request Unstake" button should ideally be disabled, or clicking it again should have no effect or show an "already pending" message.
    *   **Verification (API/Database):** No new request should be processed; status remains `unstaking_requested`.

**C. Unstake Processing Flow (Manual/Admin)**

*Note: This requires manually triggering the `/api/staking/process-unstake` logic or running the background job.*

1.  **Process Valid Pending Request:**
    *   **Prerequisite:** A user has a stake with `status='unstaking_requested'`. The Treasury Wallet has sufficient Devnet USDC and SOL.
    *   **Action (Manual):** Trigger the unstake processing logic (e.g., call the `/api/staking/process-unstake` endpoint via `curl` or Postman, potentially with admin authentication if implemented, or run the background job if applicable).
    *   **Verification (Blockchain):** Check a Solana explorer (like explorer.solana.com using Devnet). A transaction should show the Treasury Wallet sending the correct USDC amount back to the user's wallet address associated with the profile.
    *   **Verification (Database):** The corresponding `custodial_stakes` record `status` should change to `unstaked`. The withdrawal transaction signature might be stored.
    *   **Verification (Frontend):** After the next balance refresh (`fetchCustodialBalance`), the user's staked balance should decrease accordingly (likely to 0 if they unstaked all).
2.  **Process Request - Insufficient Treasury Funds (USDC or SOL):**
    *   **Prerequisite:** A valid pending request exists, but the Treasury Wallet lacks enough USDC or SOL for fees.
    *   **Action (Manual):** Trigger the unstake processing logic.
    *   **Verification (Backend Logs):** The processing logic should fail when trying to send the transaction. Logs should indicate the reason (e.g., insufficient funds).
    *   **Verification (Database):** The `custodial_stakes` record `status` should remain `unstaking_requested`. No withdrawal transaction occurs.
3.  **Process Non-Pending Request:**
    *   **Action (Manual):** Attempt to trigger processing for a stake that is still `staked` or already `unstaked`.
    *   **Verification (Backend Logs/Database):** The processing logic should identify that the stake is not in the correct state (`unstaking_requested`) and should skip processing it. No changes to the record or blockchain transactions should occur.

## 5. Deployment Considerations

*   Update the Helius Webhook URL to point to your production API endpoint.
*   Ensure all environment variables (Supabase keys, JWT secret, Treasury Keys, Helius keys, Solana Network set to `mainnet-beta`, Mainnet USDC Mint address) are correctly configured in your production environment.
*   Securely manage the `TREASURY_WALLET_SECRET_KEY` in your deployment environment (e.g., using platform secrets management). **Never commit it to Git.**
*   Fund the **Production Treasury Wallet** with sufficient SOL for transaction fees and potentially initial USDC if needed for operations. 