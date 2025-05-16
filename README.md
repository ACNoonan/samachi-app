# Samachi: The Experiential Finance Layer for Live Entertainment
![Samachi Logo](./public/samachi-logo-banner.png) 

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
<!-- Add other badges as relevant: build status, Supabase, Solana, etc. -->

Samachi is building the future of payments and engagement for live entertainment venues. Our core offering, the **Samachi Smart Tab**, aims to provide a premium, frictionless payment experience, enabling restaurant-style tabs at festival scale, coupled with personalized rewards designed to maximize venue revenue and enhance guest satisfaction.

We are the integration layer connecting consumer-facing applications, AI-driven personalization, and crypto solutions with on-site Point-of-Sale (PoS) systems at events, festivals, sports arenas, and entertainment venues.

## Table of Contents

*   [The Problem](#the-problem)
*   [Our Solution: The Samachi Smart Tab](#our-solution-the-samachi-smart-tab)
*   [Project History & Evolution](#project-history--evolution)
*   [Key Features](#key-features)
*   [Technical Architecture](#technical-architecture)
    *   [Current Stack](#current-stack)
    *   [Target Architecture](#target-architecture)
*   [How It Works: The User Journey](#how-it-works-the-user-journey)
*   [Technical Decisions: Why Solana?](#technical-decisions-why-solana)
*   [Current Status & Future Plans](#current-status--future-plans)
*   [Getting Started (For Developers)](#getting-started-for-developers)
*   [Contributing](#contributing)
*   [License](#license)
*   [Contact & Learn More](#contact--learn-more)

## The Problem

Live entertainment venues often struggle with:
*   Long queues for payment and RFID top ups, leading to lost sales and frustrated guests.
*   Generic experiences that fail to maximize per-customer revenue.
*   Complexities in integrating modern payment solutions (including crypto) with existing PoS systems.
*   Difficulty in offering personalized rewards and incentives in real-time.

## Our Solution: The Samachi Smart Tab

Samachi addresses these challenges by providing a backend integration service that powers the Smart Tab. This system:
*   **Eliminates Payment Friction:** Allows guests to open a tab (similar to a restaurant) and pay seamlessly from their phone.
*   **Boosts Venue Revenue:** Enables personalized, real-time rewards and recommendations to encourage spending and enhance customer experience.
*   **Offers Self-Managed Tabs:** Gives users control over their spending limits and payment methods, including crypto staking options.
*   **Integrates Seamlessly:** Acts as the bridge between consumer apps, AI, crypto, and existing on-site PoS systems.

## Project History & Evolution

This repository contains Samachi's submission for the **Colosseum Breakout Hackathon**. Initially, we envisioned a consumer-facing portal. However, recognizing a more significant market need and larger opportunity, we pivoted towards building a **backend integration service**.

This repository represents a **mid-point in that pivot**. It's currently a Next.js application, but its primary function has shifted to serving as an API-driven backend. While the frontend components from the initial hackathon concept may still exist in the codebase, the active development and future direction are focused on the API routes found in `app/api/` subdirectory and the underlying services they provide.

Our long-term vision is to evolve this into a robust, dedicated backend platform (likely Python-based, as per our initial backend design discussions) that serves as the core **experiential finance layer**.

## Key Features

*   **Seamless Onboarding:** Link on-site authentication (RFID, QR codes) to user profiles.
*   **Abstracted Wallet Management:** Easy fiat and Solana wallet connection via Magic Link, with auto-wallet creation for new users.
*   **Fiat-to-Crypto Staking:** Users can stake USDC (purchased with fiat or deposited on-chain) to increase their Smart Tab limit and earn rewards.
*   **Custom Solana Smart Contract:** Manages a self-custody staking pool for user assets.
*   **Smart Tab Activation:** Real-time communication with PoS systems (e.g., Glownet, Shift4) upon guest check-in to activate and fund the tab.
*   **RFID Tap-to-Pay:** Enabled via PoS integration.
*   **Personalized On-Site Rewards:** Delivered in real-time based on user behavior and preferences.
*   **Automated Off-Chain Ledger & On-Chain Settlement:** Spend is tracked off-chain for speed, with options for auto-settlement via fiat or by debiting staked crypto assets on-chain.

## Technical Architecture

Samachi aims to abstract the complexities of blockchain and payment integrations, providing a simple API for partners.

### Current Stack (Mid-Pivot Next.js API Service)

*   **Framework:** Next.js (primarily using API Routes for backend logic)
*   **Database (Off-Chain Storage):** Supabase
*   **Wallet Management:** Magic Link (for seamless user wallet creation and management)
*   **Blockchain:** Solana
*   **Smart Contracts:** Custom Anchor-based smart contract for staking pools.
    *   https://github.com/ACNoonan/samachi-contracts

### Target Architecture (Backend Integration Service)

While the current Next.js app serves API routes, the future vision includes a more specialized backend.
*   **Core Backend:** Python-based API Platform (or similar robust backend language/framework)
*   **Database (Off-Chain Storage):** Supabase (or other scalable database solutions)
*   **Wallet Management:** Magic Link
*   **Blockchain Interaction:** Direct integration with our Solana smart contracts.
*   **Real-time Recommendation:** Logic and model inference defining personalized promotion features.
*   **API Layer:** RESTful/GraphQL APIs for partner integrations.
*   **MCP Server:** MCP server developed for Agentic AI integrations.

`[TODO: Consider adding a simplified architecture diagram here, as mentioned in your demo script. This could be an image in the repo linked here.]`

## How It Works: The User Journey

1.  **Onboarding:**
    *   A guest's on-site authentication method (e.g., RFID wristband or card from an event) is linked to their Samachi user profile.
    *   Users connect traditional fiat payment methods and/or an existing Solana wallet. If no Solana wallet is provided, one is seamlessly created for them using Magic Link.
2.  **Funding & Staking (Optional but Recommended):**
    *   Users can stake USDC into a self-custody staking pool managed by our custom Solana smart contract. This can be done by purchasing USDC with fiat through Samachi or by depositing existing USDC.
    *   Staking increases their Smart Tab spending limit and unlocks rewards. Our API handles all smart contract interactions, making it a simple "Stake" button experience for the user.
3.  **Smart Tab Activation & Venue Check-in:**
    *   Upon checking into a venue, our API communicates with the on-site PoS system (e.g., Glownet, Shift4).
    *   Samachi activates their Smart Tab, enabling RFID tap-to-pay functionality and activating personalized, real-time rewards.
4.  **Spending & Rewards:**
    *   Guests use their RFID wristband/card to make purchases.
    *   Personalized offers and rewards can be triggered based on spending patterns or venue promotions.
5.  **Seamless Checkout & Settlement:**
    *   Instead of waiting in line, Samachi handles tab settlement.
    *   Our backend calculates the total spend. Users can opt for auto-settlement via either a) their linked fiat payment method or b) subtracting from their staked crypto assets.
    *   If crypto settlement is chosen, Samachi's backend service interacts with our Solana smart contract to debit the user's stake. The spent amount is 'locked,' and the balance is settled with the venue. The on-chain record accurately reflects their self-custodied balance.

## Technical Decisions: Why Solana?

We chose Solana for several key reasons:
*   **High Throughput & Low Fees:** Essential for managing the high volume of micro-transactions and state updates required for tab management at large-scale events.
*   **Developer Ecosystem & Culture:** Solana is known for being builder-friendly, fostering innovation in decentralized finance.
*   **Performance for User Experience:** Solana's speed allows us to abstract blockchain complexities and provide a simple, responsive UX, particularly for features like our self-custodial staking API.

Solana empowers us to offer novel payment solutions while maintaining performance and user-friendliness.

## Current Status & Future Plans

**Current Status:**
*   The project is currently a Next.js application serving as an API backend, a mid-point from our hackathon pivot.
*   Core functionalities for onboarding, wallet creation, staking (via API calls to a deployed smart contract), and basic PoS interaction logic are being developed.
*   Key API routes are located in `app/api/`.

**Future Plans:**
1.  **Full Backend Service Development:** Transition the API logic from Next.js to a dedicated, scalable backend service (e.g., Python/FastAPI).
2.  **Expand PoS Integrations:** Develop robust connectors for a wider range of PoS systems used in live entertainment.
3.  **Enhance Personalization Engine:** Integrate more sophisticated AI/ML models for personalized recommendations and rewards.
4.  **Develop Partner SDKs/API Documentation:** Provide clear tools and documentation for consumer-facing apps to integrate with Samachi.
5.  **Strengthen Smart Contract Features:** Explore utilizing additional on-chain assets for collateriziled Smart Tab.
6.  **Security Audits:** Conduct thorough security audits of smart contracts and backend systems.

## Getting Started (For Developers)

As this repository currently functions as a Next.js app with API routes:

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <your-repo-name>
    ```
2.  **Install dependencies:**
    ```bash
    pnpm install
    ```
3.  **Set up environment variables:**
    *   Create a `.env.local` file by copying `.env.example` (if one exists, otherwise create it).
    *   Populate it with necessary API keys and configuration values for:
        *   Supabase URL and Anon Key
        *   Magic Link API Key
        *   Solana RPC Endpoint
        *   Secret keys for JWT or session management
        *   `[TODO: List all required environment variables]`
4.  **Run the development server:**
    ```bash
    pnpm run dev
    ```
    The API routes will typically be accessible under `http://localhost:3000/api/...`.

5.  **Explore API Routes:**
    *   The core backend logic currently resides in the `app/api/` directory.

## Contributing

We welcome contributions! If you're interested in helping build the future of experiential finance, please:
1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact & Learn More

*   **Adam, Co-founder**
*   **Twitter:** https://x.com/0xSamachi
*   **Website/LinkedIn:** https://samachi.com
*   Catch us at **Solana Accelerate in NYC** or experience a live Samachi Smart Tab at **Noviciado Club in Madrid**!

---

We believe Samachi's backend service is the engine that will allow our partners to deliver incredibly smooth, rewarding, and secure experiences, abstracting complexity, fostering interoperability, and genuinely making experiential finance a reality. We're on a mission to provide low key, high vibes, everywhere.
