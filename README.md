# Samachi

[![Samachi Logo](placeholder.png)](https://samachi.com) 

**Samachi is the global VIP network; a "Gympass for clubs, resorts & festivals worldwide.**

Imagine tapping into exclusive venue experiences, managing your memberships effortlessly, and connecting with like-minded individuals – all starting with a simple scan of your membership card. Samachi makes this a reality.

We leverage RFID/NFC enabled membership cards with QR code technology for instant onboarding, Supabase for robust user & venue data management, and direct integration with venue systems (via the Glownet API) to provide real-time membership status and benefits. Utilizing Solana blockchain's fast, cheap and secure infrastructure for crypto-asset staking that enables a novel VIP, "restuarant-style" payment experience - Samachi aims to create a global network of festivals, clubs and resorts; the "Solana Social Layer".

## Core Features & Vision

*   **Instant Onboarding:** Scan your venue membership card\'s QR code (`/card/[cardId]`) to instantly sign up or sign in. No more cumbersome registration processes.
*   **Unified Profile:** Manage your profile, linked memberships across different venues, and on-chain + closed-loop assets all in one place.
*   **Real-time Venue Integration:** Connect directly with venue systems to:
    *   Verify membership status upon entry.
    *   Check cashless balances associated with your membership.
    *   Participate in venue-specific promotions or top-up accounts.
*   **Web3 Enabled:**
    *   Connect your Solana wallet (Phantom, Solflare, etc.) securely using the Solana Mobile Wallet Adapter.
    *   Enable staking mechanisms, token-gated experiences, or other blockchain-based loyalty features.
*   **Community Hub:** (Vision) Become the central point for venue announcements, member interactions, and exclusive content.

## Technology Powering Samachi

We\'ve built Samachi on a modern, scalable, and robust tech stack:

*   **Framework:** Next.js (App Router) for a fast, server-rendered React experience.
*   **Language:** TypeScript for type safety and developer efficiency.
*   **UI:** React, Tailwind CSS, and shadcn/ui for beautiful, accessible, and responsive interfaces.
*   **Backend:** Serverless functions via Next.js API Routes.
*   **Database & Auth:** Supabase handles user authentication, profile data, venue information, and membership linking with its integrated Postgres database.
*   **Wallet Integration:** Solana Mobile Wallet Adapter provides seamless and secure connection to the Solana ecosystem.
*   **Venue System Integration:** Direct communication with the Glownet API v2 for real-time membership and balance data.
*   **Package Manager:** pnpm for efficient dependency management.

## Getting Started (For Development / Judging)

### Prerequisites

*   Node.js (LTS)
*   pnpm (`npm install -g pnpm`)
*   Supabase Account & Project
*   (Optional) Smart PoS Account & API Key for testing live integration.

### Installation & Setup

1.  **Clone:** `git clone <your-repo-url> && cd samachi-app`
2.  **Install:** `pnpm install`
3.  **Environment:** Copy `.env.local.example` to `.env.local` and fill in your Supabase keys (public and service role). Add Smart PoS keys if testing that integration.
    ```ini
    # .env.local

    # Supabase
    NEXT_PUBLIC_SUPABASE_URL=<public_URL_for_your_Supabase_DB>
    NEXT_PUBLIC_SUPABASE_ANON_KEY=...
    SUPABASE_SERVICE_ROLE_KEY=... # Keep Secret!

    # Redirect URL used by Supabase - http://localhost:3000 is the default dev URL
    NEXT_PUBLIC_SITE_URL=http://localhost:3000

    # Glownet - Development
    GLOWNET_API_BASE_URL=https://opera.glownet.com/organization
    GLOWNET_API_KEY=... # Optional for judges

    # Solana
    NEXT_PUBLIC_SOLANA_PROGRAM_ID=...
    NEXT_PUBLIC_MAGIC_LINK_KEY=...

    # Solana Plan B: Localnet
    NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com # Or mainnet: https://api.mainnet-beta.solana.com
    NEXT_PUBLIC_SOLANA_NETWORK=devnet
    NEXT_PUBLIC_TREASURY_WALLET_ADDRESS=<wallet_address> # Devnet public treasury address
    NEXT_PUBLIC_USDC_MINT_ADDRESS=<mint_address> # Devnet USDC Mint Address

    TREASURY_WALLET_ADDRESS=<wallet_address> # Devnet public treasury address
    TREASURY_WALLET_SECRET_KEY=<wallet_secret_key>
    USDC_MINT_ADDRESS=<token_minting_address> # Devnet USDC Mint Address
    
    # Helius
    HELIUS_API_KEY=... # Add if you plan to use the Helius SDK directly later, not strictly needed for webhook secret verification
    HELIUS_WEBHOOK_SECRET=...
    ```
4.  **Database:** Ensure Supabase tables are set up (use `supabase/migrations` and `supabase db push` if available, or set up manually).

### Running Locally

```bash
pnpm dev
```

Access the app at `http://localhost:3000`.

## Future Enhancements

Beyond the core hackathon deliverable, Samachi has the potential to grow:

*   **Deeper Glownet Integration:** Implement transaction history, top-ups, and potentially direct purchases via the Samachi interface.
*   **Advanced Staking Models:** Introduce varied staking options and yields tied to membership levels or venue participation.
*   **Cross-Venue Promotions:** Continue facilitating partnerships and offers between participating venues.
*   **Social Features:** Build out community forums, event calendars, and member-to-member interactions.
*   **Venue Dashboard:** Provide tools for venues to manage their presence and promotions on Samachi.
*   **NFT Ticketing:** Control access with a tokenized entry, availble for resale on secondary markets.

---

*Samachi - Low Key, High Vibes, Everywhere.*
