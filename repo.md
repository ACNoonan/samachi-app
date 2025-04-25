├── .gitignore
├── .sql
├── README.md
├── app
    ├── api
    │   ├── card-status
    │   │   └── route.ts
    │   ├── cards
    │   │   └── sync-glownet
    │   │   │   └── route.ts
    │   ├── create-profile-and-claim
    │   │   └── route.ts
    │   ├── memberships
    │   │   ├── [membershipId]
    │   │   │   └── check-in-status
    │   │   │   │   └── route.ts
    │   │   └── route.ts
    │   ├── sync
    │   │   └── cards
    │   │   │   └── route.ts
    │   ├── venues
    │   │   ├── [venueId]
    │   │   │   └── route.ts
    │   │   ├── route.ts
    │   │   └── sync-glownet
    │   │   │   └── route.ts
    │   └── wallet
    │   │   └── glownet-details
    │   │       └── route.ts
    ├── card
    │   └── [card_id]
    │   │   └── page.tsx
    ├── components
    │   ├── auth
    │   │   ├── ConnectWallet.tsx
    │   │   ├── CreateProfileForm.tsx
    │   │   └── LoginForm.tsx
    │   ├── discover
    │   │   ├── DiscoverVenues.tsx
    │   │   ├── VenueList.tsx
    │   │   └── VenueMap.tsx
    │   ├── home
    │   │   ├── Dashboard.tsx
    │   │   └── StakingModal.tsx
    │   ├── layout
    │   │   ├── Navbar.tsx
    │   │   └── PageLayout.tsx
    │   ├── onboarding
    │   │   ├── CardLanding.tsx
    │   │   └── OnboardingVideo.tsx
    │   ├── profile
    │   │   └── ProfileSettings.tsx
    │   ├── ui
    │   │   ├── accordion.tsx
    │   │   ├── alert-dialog.tsx
    │   │   ├── alert.tsx
    │   │   ├── aspect-ratio.tsx
    │   │   ├── avatar.tsx
    │   │   ├── badge.tsx
    │   │   ├── breadcrumb.tsx
    │   │   ├── button.tsx
    │   │   ├── calendar.tsx
    │   │   ├── card.tsx
    │   │   ├── carousel.tsx
    │   │   ├── chart.tsx
    │   │   ├── checkbox.tsx
    │   │   ├── collapsible.tsx
    │   │   ├── command.tsx
    │   │   ├── context-menu.tsx
    │   │   ├── dialog.tsx
    │   │   ├── drawer.tsx
    │   │   ├── dropdown-menu.tsx
    │   │   ├── form.tsx
    │   │   ├── hover-card.tsx
    │   │   ├── input-otp.tsx
    │   │   ├── input.tsx
    │   │   ├── label.tsx
    │   │   ├── menubar.tsx
    │   │   ├── navigation-menu.tsx
    │   │   ├── pagination.tsx
    │   │   ├── popover.tsx
    │   │   ├── progress.tsx
    │   │   ├── radio-group.tsx
    │   │   ├── resizable.tsx
    │   │   ├── scroll-area.tsx
    │   │   ├── select.tsx
    │   │   ├── separator.tsx
    │   │   ├── sheet.tsx
    │   │   ├── sidebar.tsx
    │   │   ├── skeleton.tsx
    │   │   ├── slider.tsx
    │   │   ├── sonner.tsx
    │   │   ├── switch.tsx
    │   │   ├── table.tsx
    │   │   ├── tabs.tsx
    │   │   ├── textarea.tsx
    │   │   ├── toast.tsx
    │   │   ├── toaster.tsx
    │   │   ├── toggle-group.tsx
    │   │   ├── toggle.tsx
    │   │   ├── tooltip.tsx
    │   │   └── use-toast.ts
    │   ├── venue
    │   │   ├── CheckInModal.tsx
    │   │   ├── CreditLine.tsx
    │   │   ├── PurchaseModal.tsx
    │   │   └── VenueDetail.tsx
    │   ├── venues
    │   │   └── VenueImageUpload.tsx
    │   └── wallet
    │   │   └── WalletDashboard.tsx
    ├── context
    │   └── AuthContext.tsx
    ├── create-profile
    │   └── page.tsx
    ├── dashboard
    │   ├── loading.tsx
    │   └── page.tsx
    ├── discover
    │   ├── loading.tsx
    │   └── page.tsx
    ├── favicon.ico
    ├── globals.css
    ├── layout.tsx
    ├── login
    │   └── page.tsx
    ├── page.tsx
    ├── profile
    │   ├── loading.tsx
    │   └── page.tsx
    ├── venue
    │   └── [venueId]
    │   │   └── page.tsx
    └── wallet
    │   ├── loading.tsx
    │   └── page.tsx
├── lib
    ├── auth.ts
    ├── glownet.ts
    ├── supabase.ts
    ├── supabase
    │   ├── client.ts
    │   ├── middleware.ts
    │   └── server.ts
    └── utils.ts
├── middleware.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── public
    ├── barrage-club.png
    ├── berhta-club.png
    ├── bloom-festival.png
    ├── file.svg
    ├── globe.svg
    ├── next.svg
    ├── novi1.png
    ├── vercel.svg
    └── window.svg
├── python
    ├── create_glownet_assets.py
    ├── create_glownet_events.py
    ├── delete_glownet_data.py
    ├── fetch_glownet_summary.py
    ├── glownet_test_data_summary.json
    ├── sync_cards.py
    ├── sync_venues.py
    └── venue_images.json
├── repo.md
├── scripts
    ├── sync-cards.ts
    └── sync-venues.ts
├── tsconfig.json
└── vercel.json


/.gitignore:
--------------------------------------------------------------------------------
 1 | # See https://help.github.com/articles/ignoring-files/ for more about ignoring files.
 2 | 
 3 | # dependencies
 4 | /node_modules
 5 | /.pnp
 6 | .pnp.*
 7 | .yarn/*
 8 | !.yarn/patches
 9 | !.yarn/plugins
10 | !.yarn/releases
11 | !.yarn/versions
12 | 
13 | # testing
14 | /coverage
15 | 
16 | # next.js
17 | /.next/
18 | /out/
19 | 
20 | # production
21 | /build
22 | 
23 | # misc
24 | .DS_Store
25 | *.pem
26 | 
27 | # debug
28 | npm-debug.log*
29 | yarn-debug.log*
30 | yarn-error.log*
31 | .pnpm-debug.log*
32 | 
33 | # env files (can opt-in for committing if needed)
34 | .env*
35 | 
36 | # vercel
37 | .vercel
38 | 
39 | # typescript
40 | *.tsbuildinfo
41 | next-env.d.ts
42 | 
43 | # AI instructions
44 | repo.md
45 | 
46 | #supabase
47 | supabase/
48 | 


--------------------------------------------------------------------------------
/.sql:
--------------------------------------------------------------------------------
 1 | -- Create the membership_cards table
 2 | CREATE TABLE public.membership_cards (
 3 |     id uuid DEFAULT gen_random_uuid() NOT NULL,
 4 |     card_identifier text NOT NULL,
 5 |     status text DEFAULT 'unregistered'::text NOT NULL,
 6 |     user_id uuid NULL, -- Initially NULL, linked upon registration
 7 |     created_at timestamp with time zone DEFAULT now() NOT NULL,
 8 |     CONSTRAINT membership_cards_pkey PRIMARY KEY (id),
 9 |     CONSTRAINT membership_cards_card_identifier_key UNIQUE (card_identifier),
10 |     CONSTRAINT membership_cards_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL -- Or ON DELETE CASCADE if preferred
11 | );
12 | 
13 | -- Enable Row Level Security on the table
14 | ALTER TABLE public.membership_cards ENABLE ROW LEVEL SECURITY;
15 | 
16 | -- Add comments to columns for clarity (Optional)
17 | COMMENT ON COLUMN public.membership_cards.card_identifier IS 'Unique human-readable identifier for the membership card (e.g., from QR code)';
18 | COMMENT ON COLUMN public.membership_cards.status IS 'Current status of the card (e.g., unregistered, registered, disabled)';
19 | COMMENT ON COLUMN public.membership_cards.user_id IS 'Link to the authenticated user who has claimed this card';
20 | 
21 | -- Add index for faster lookups by card_identifier
22 | CREATE INDEX idx_membership_cards_card_identifier ON public.membership_cards USING btree (card_identifier);
23 | 
24 | -- Add index for faster lookups by user_id
25 | CREATE INDEX idx_membership_cards_user_id ON public.membership_cards USING btree (user_id);
26 | 
27 | 
28 | -- POLICY: Allow public anonymous read access to check card status (identifier and status only)
29 | -- Needed for the initial check when a user scans a card before logging in.
30 | CREATE POLICY "Allow public read access to card status"
31 | ON public.membership_cards
32 | FOR SELECT
33 | USING (true); -- Allows selecting any row, but column permissions are handled elsewhere (or rely on API selecting specific cols)
34 | 
35 | 
36 | -- POLICY: Allow authenticated users to read their own card details
37 | CREATE POLICY "Allow users to read their own card"
38 | ON public.membership_cards
39 | FOR SELECT
40 | USING (auth.uid() = user_id);
41 | 
42 | 
43 | -- POLICY: Allow authenticated users to "claim" an unregistered card
44 | -- This allows updating user_id and status *only if* user_id is currently NULL.
45 | -- IMPORTANT: Use this policy with caution. Ideally, claiming should be done via a secure function.
46 | CREATE POLICY "Allow users to claim an unregistered card"
47 | ON public.membership_cards
48 | FOR UPDATE
49 | USING (auth.uid() IS NOT NULL AND user_id IS NULL) -- Can only update if the card's user_id is NULL
50 | WITH CHECK (auth.uid() = user_id); -- Ensures the user_id being set matches the authenticated user
51 | 
52 | -- SEED DATA
53 | INSERT INTO public.membership_cards (card_identifier, status, user_id)
54 | VALUES
55 |     -- 6 Unregistered Cards
56 |     ('card-test-001', DEFAULT, NULL),
57 |     ('card-test-002', DEFAULT, NULL),
58 |     ('card-test-003', DEFAULT, NULL),
59 |     ('card-test-004', DEFAULT, NULL),
60 |     ('card-test-005', DEFAULT, NULL),
61 |     ('card-test-006', DEFAULT, NULL)


--------------------------------------------------------------------------------
/README.md:
--------------------------------------------------------------------------------
 1 | # Samachi
 2 | 
 3 | [![Samachi Logo](placeholder.png)](https://samachi.com) 
 4 | 
 5 | **Samachi is the global VIP network; a "Gympass for clubs, resorts & festivals worldwide.**
 6 | 
 7 | Imagine tapping into exclusive venue experiences, managing your memberships effortlessly, and connecting with like-minded individuals – all starting with a simple scan of your membership card. Samachi makes this a reality.
 8 | 
 9 | We leverage RFID/NFC enabled membership cards with QR code technology for instant onboarding, Supabase for robust user & venue data management, and direct integration with venue systems (via the Glownet API) to provide real-time membership status and benefits. Utilizing Solana blockchain's fast, cheap and secure infrastructure for crypto-asset staking that enables a novel VIP, "restuarant-style" payment experience - Samachi aims to create a global network of festivals, clubs and resorts; the "Solana Social Layer".
10 | 
11 | ## Core Features & Vision
12 | 
13 | *   **Instant Onboarding:** Scan your venue membership card\'s QR code (`/card/[cardId]`) to instantly sign up or sign in. No more cumbersome registration processes.
14 | *   **Unified Profile:** Manage your profile, linked memberships across different venues, and on-chain + closed-loop assets all in one place.
15 | *   **Real-time Venue Integration:** Connect directly with venue systems to:
16 |     *   Verify membership status upon entry.
17 |     *   Check cashless balances associated with your membership.
18 |     *   Participate in venue-specific promotions or top-up accounts.
19 | *   **Web3 Enabled:**
20 |     *   Connect your Solana wallet (Phantom, Solflare, etc.) securely using the Solana Mobile Wallet Adapter.
21 |     *   Enable staking mechanisms, token-gated experiences, or other blockchain-based loyalty features.
22 | *   **Community Hub:** (Vision) Become the central point for venue announcements, member interactions, and exclusive content.
23 | 
24 | ## Technology Powering Samachi
25 | 
26 | We\'ve built Samachi on a modern, scalable, and robust tech stack:
27 | 
28 | *   **Framework:** Next.js (App Router) for a fast, server-rendered React experience.
29 | *   **Language:** TypeScript for type safety and developer efficiency.
30 | *   **UI:** React, Tailwind CSS, and shadcn/ui for beautiful, accessible, and responsive interfaces.
31 | *   **Backend:** Serverless functions via Next.js API Routes.
32 | *   **Database & Auth:** Supabase handles user authentication, profile data, venue information, and membership linking with its integrated Postgres database.
33 | *   **Wallet Integration:** Solana Mobile Wallet Adapter provides seamless and secure connection to the Solana ecosystem.
34 | *   **Venue System Integration:** Direct communication with the Glownet API v2 for real-time membership and balance data.
35 | *   **Package Manager:** pnpm for efficient dependency management.
36 | 
37 | ## Getting Started (For Development / Judging)
38 | 
39 | ### Prerequisites
40 | 
41 | *   Node.js (LTS)
42 | *   pnpm (`npm install -g pnpm`)
43 | *   Supabase Account & Project
44 | *   (Optional) Smart PoS Account & API Key for testing live integration.
45 | 
46 | ### Installation & Setup
47 | 
48 | 1.  **Clone:** `git clone <your-repo-url> && cd samachi-app`
49 | 2.  **Install:** `pnpm install`
50 | 3.  **Environment:** Copy `.env.local.example` to `.env.local` and fill in your Supabase keys (public and service role). Add Smart PoS keys if testing that integration.
51 |     ```ini
52 |     # .env.local
53 |     NEXT_PUBLIC_SUPABASE_URL=...
54 |     NEXT_PUBLIC_SUPABASE_ANON_KEY=...
55 |     SUPABASE_SERVICE_ROLE_KEY=... # Keep Secret!
56 |     GLOWNET_API_BASE_URL=https://opera.glownet.com/organization
57 |     GLOWNET_API_KEY=... # Optional for judges
58 |     ```
59 | 4.  **Database:** Ensure Supabase tables are set up (use `supabase/migrations` and `supabase db push` if available, or set up manually).
60 | 
61 | ### Running Locally
62 | 
63 | ```bash
64 | pnpm dev
65 | ```
66 | 
67 | Access the app at `http://localhost:3000`.
68 | 
69 | ## Future Enhancements
70 | 
71 | Beyond the core hackathon deliverable, Samachi has the potential to grow:
72 | 
73 | *   **Deeper Glownet Integration:** Implement transaction history, top-ups, and potentially direct purchases via the Samachi interface.
74 | *   **Advanced Staking Models:** Introduce varied staking options and yields tied to membership levels or venue participation.
75 | *   **Cross-Venue Promotions:** Continue facilitating partnerships and offers between participating venues.
76 | *   **Social Features:** Build out community forums, event calendars, and member-to-member interactions.
77 | *   **Venue Dashboard:** Provide tools for venues to manage their presence and promotions on Samachi.
78 | *   **NFT Ticketing:** Control access with a tokenized entry, availble for resale on secondary markets.
79 | 
80 | ---
81 | 
82 | *Samachi - Low Key, High Vibes, Everywhere.*
83 | 


--------------------------------------------------------------------------------
/app/api/card-status/route.ts:
--------------------------------------------------------------------------------
 1 | import { NextRequest, NextResponse } from 'next/server';
 2 | // import { supabase } from '@/lib/supabase'; // Remove old client import
 3 | import { cookies } from 'next/headers'; // Add cookies import
 4 | import { createClient } from '@/lib/supabase/server'; // Import server client creator
 5 | 
 6 | // Opt out of caching and force dynamic rendering for this route
 7 | export const dynamic = 'force-dynamic';
 8 | 
 9 | export async function GET(request: NextRequest) {
10 |   const { searchParams } = new URL(request.url);
11 |   const cardIdentifier = searchParams.get('card_id'); // Get the readable ID
12 | 
13 |   if (!cardIdentifier) {
14 |     return NextResponse.json({ error: 'Card ID is required' }, { status: 400 });
15 |   }
16 | 
17 |   console.log(`API: Checking status for card identifier: ${cardIdentifier}`);
18 | 
19 |   // Create server client instance
20 |   const cookieStore = cookies();
21 |   const supabase = createClient(cookieStore);
22 | 
23 |   try {
24 |     // Query the membership_cards table
25 |     const { data, error } = await supabase
26 |       .from('membership_cards')
27 |       .select('status, user_id') // Select the status and if a user is linked
28 |       .eq('card_identifier', cardIdentifier) // Match the readable identifier
29 |       .single(); // Expect only one card with this identifier
30 | 
31 |     if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is okay
32 |       console.error('Supabase query error:', error);
33 |       return NextResponse.json({ error: 'Error checking card status', details: error.message }, { status: 500 });
34 |     }
35 | 
36 |     if (!data) {
37 |       // Card identifier doesn't exist in the table
38 |       console.log(`Card identifier ${cardIdentifier} not found.`);
39 |       return NextResponse.json({ error: 'Card not found' }, { status: 404 });
40 |     }
41 | 
42 |     // Determine registration status based on whether user_id is set
43 |     const isRegistered = !!data.user_id; // True if user_id is not null
44 |     const status = isRegistered ? 'registered' : 'unregistered';
45 | 
46 |     console.log(`Card ${cardIdentifier} status: ${status} (User ID: ${data.user_id})`);
47 | 
48 |     return NextResponse.json({ 
49 |       cardId: cardIdentifier, // Return the identifier that was checked
50 |       status: status, 
51 |       isRegistered: isRegistered // Explicit boolean might be useful on client
52 |     });
53 | 
54 |   } catch (err) {
55 |     console.error('API route error:', err);
56 |     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
57 |   }
58 | } 


--------------------------------------------------------------------------------
/app/api/memberships/[membershipId]/check-in-status/route.ts:
--------------------------------------------------------------------------------
  1 | import { NextRequest, NextResponse } from 'next/server';
  2 | // import { cookies } from 'next/headers'; // Commented out
  3 | // import { createClient } from '@/lib/supabase/server'; // Commented out
  4 | // import { getGlownetCustomerDetails, type GlownetCustomer } from '@/lib/glownet'; // Commented out
  5 | 
  6 | // // Define the expected structure for the Supabase query result - Commented out
  7 | // type MembershipWithVenue = {
  8 | //   id: string; 
  9 | //   user_id: string; 
 10 | //   venue_id: string; 
 11 | //   glownet_customer_id: number | null;
 12 | //   status: string; 
 13 | //   venues: { 
 14 | //     glownet_event_id: number | null;
 15 | //   } | null;
 16 | // };
 17 | 
 18 | export async function GET(
 19 |   request: NextRequest,
 20 |   context: { params: { membershipId: string } }
 21 | ) {
 22 |   const membershipId = context.params.membershipId;
 23 |   console.log("Minimal GET handler called for membershipId:", membershipId);
 24 |   return NextResponse.json({ success: true, membershipId });
 25 | 
 26 | /* // Comment out the entire previous logic block
 27 |   // console.log(`Simplified GET handler for /api/memberships/${membershipId}/check-in`); // Comment out the simplified log
 28 |   // return NextResponse.json({ message: "Handler simplified for testing", membershipId }); // Comment out the simplified return
 29 | 
 30 |   // Original logic commented out for testing
 31 |   const cookieStore = await cookies();
 32 |   const supabase = createClient(cookieStore);
 33 | 
 34 |   try {
 35 |     // 1. Authenticate User using Supabase Auth
 36 |     const { data: { user }, error: authError } = await supabase.auth.getUser();
 37 | 
 38 |     if (authError || !user) {
 39 |       console.error('Auth Error in check-in route:', authError);
 40 |       return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
 41 |     }
 42 |     const userId = user.id; // Get user ID from Supabase session
 43 | 
 44 |     // 2. Fetch Membership and Venue Details from Supabase, ensuring it belongs to the authenticated user
 45 |     console.log(`Fetching membership ${membershipId} for user ${userId}...`);
 46 |     const { data: membership, error: membershipError } = await supabase
 47 |       .from('memberships')
 48 |       .select(`
 49 |         id,
 50 |         user_id,
 51 |         venue_id,
 52 |         glownet_customer_id,
 53 |         status,
 54 |         venues ( glownet_event_id )
 55 |       `)
 56 |       .eq('id', membershipId)
 57 |       .eq('user_id', userId)
 58 |       .single<MembershipWithVenue>();
 59 | 
 60 |     if (membershipError) {
 61 |       console.error(`Error fetching membership ${membershipId} for user ${userId}:`, membershipError);
 62 |       // Check if error is due to no rows found (PGRST116)
 63 |        if (membershipError.code === 'PGRST116') {
 64 |           return NextResponse.json({ error: 'Membership not found or access denied.' }, { status: 404 });
 65 |       }
 66 |       return NextResponse.json({ error: 'Failed to retrieve membership details.' }, { status: 500 });
 67 |     }
 68 | 
 69 |     // Note: No need for explicit !membership check if .single() throws on no rows
 70 | 
 71 |     // 3. Validate required Glownet IDs
 72 |     const glownetCustomerId = membership.glownet_customer_id;
 73 |     // Type guard for nested venue data
 74 |     const glownetEventId = membership.venues?.glownet_event_id;
 75 | 
 76 |     if (!glownetCustomerId) {
 77 |       console.error(`Membership ${membershipId} is missing Glownet Customer ID.`);
 78 |       return NextResponse.json({ error: 'Membership is not correctly linked to Glownet.' }, { status: 409 });
 79 |     }
 80 | 
 81 |     if (typeof glownetEventId !== 'number') {
 82 |         console.error(`Venue data or Glownet Event ID missing for membership ${membershipId}.`);
 83 |         return NextResponse.json({ error: 'Associated venue information is missing or incomplete.' }, { status: 409 });
 84 |     }
 85 | 
 86 |     // 4. Fetch Glownet Customer Details (Check-in status)
 87 |     console.log(`Fetching Glownet details for customer ${glownetCustomerId}, event ${glownetEventId}...`);
 88 |     const glownetData: GlownetCustomer = await getGlownetCustomerDetails(glownetEventId, glownetCustomerId);
 89 | 
 90 |     // 5. Return Relevant Glownet Data (e.g., check-in status, balance, etc.)
 91 |     // Adapt the response based on what getGlownetCustomerDetails returns
 92 |     return NextResponse.json({
 93 |       membershipId: membership.id,
 94 |       userId: membership.user_id,
 95 |       status: membership.status,
 96 |       glownetBalances: glownetData.balances,
 97 |       // Include other relevant fields from glownetData
 98 |     });
 99 | 
100 |   } catch (error: any) {
101 |     console.error(`Error in GET /api/memberships/[membershipId]/check-in:`, error);
102 |     // Distinguish between Glownet API errors and other errors if possible
103 |     return NextResponse.json({ error: error.message || 'Internal server error during check-in process.' }, { status: 500 });
104 |   }
105 |   // End of commented out logic
106 | */
107 | } 


--------------------------------------------------------------------------------
/app/api/memberships/route.ts:
--------------------------------------------------------------------------------
 1 | import { NextRequest, NextResponse } from 'next/server';
 2 | import { cookies } from 'next/headers';
 3 | import { createClient } from '@/lib/supabase/server';
 4 | 
 5 | // Define types for cleaner code (adjust based on actual schema)
 6 | interface Venue {
 7 |   id: string;
 8 |   name: string;
 9 |   address?: string | null;
10 |   image_url?: string | null;
11 |   glownet_event_id: number;
12 | }
13 | 
14 | interface MembershipWithVenue {
15 |   id: string;
16 |   status: string;
17 |   glownet_customer_id: number;
18 |   created_at: string;
19 |   venues: Venue | null; // Relationship can be null if venue deleted
20 | }
21 | 
22 | export async function GET(request: NextRequest) {
23 |   const cookieStore = await cookies();
24 |   const supabase = createClient(cookieStore);
25 | 
26 |   try {
27 |     // 1. Authenticate User using Supabase Auth
28 |     const { data: { user }, error: authError } = await supabase.auth.getUser();
29 | 
30 |     if (authError || !user) {
31 |       console.error('Auth Error fetching memberships:', authError);
32 |       return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
33 |     }
34 |     const userId = user.id; // Get user ID from Supabase session
35 | 
36 |     // 2. Fetch Memberships with Venue Details for the authenticated user
37 |     console.log(`Fetching memberships for user ID: ${userId}`);
38 |     const { data: memberships, error } = await supabase
39 |       .from('memberships')
40 |       .select(`
41 |         id,
42 |         status,
43 |         created_at,
44 |         user_id,
45 |         venues (
46 |           id,
47 |           name,
48 |           address,
49 |           image_url
50 |         )
51 |       `)
52 |       .eq('user_id', userId) // Filter by the authenticated user ID
53 |       .order('created_at', { ascending: false })
54 |       .returns<MembershipWithVenue[]>(); // Use the defined type
55 | 
56 |     if (error) {
57 |       console.error(`Error fetching memberships for user ${userId}:`, error);
58 |       return NextResponse.json({ error: 'Database error fetching memberships.' }, { status: 500 });
59 |     }
60 | 
61 |     if (!memberships) {
62 |       console.log(`No memberships found for user ${userId}. Returning empty array.`);
63 |       return NextResponse.json([]);
64 |     }
65 | 
66 |     console.log(`Successfully fetched ${memberships.length} memberships for user ${userId}.`);
67 |     // Filter out memberships where the related venue might have been deleted
68 |     const validMemberships = memberships.filter((m: MembershipWithVenue) => m.venues !== null);
69 |     return NextResponse.json(validMemberships);
70 | 
71 |   } catch (err: any) {
72 |      console.error('Unexpected error in GET /api/memberships:', err);
73 |      return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
74 |   }
75 | } 


--------------------------------------------------------------------------------
/app/api/sync/cards/route.ts:
--------------------------------------------------------------------------------
  1 | import { NextResponse } from 'next/server';
  2 | import { cookies } from 'next/headers';
  3 | import { createClient } from '@/lib/supabase/server';
  4 | import { getGlownetEventDetailsByGtagUid } from '@/lib/glownet';
  5 | 
  6 | export async function POST(request: Request) {
  7 |   const cookieStore = await cookies();
  8 |   const supabase = createClient(cookieStore);
  9 | 
 10 |   try {
 11 |     // 1. Get the list of card identifiers to sync
 12 |     const { cardIds } = await request.json();
 13 | 
 14 |     if (!Array.isArray(cardIds)) {
 15 |       return NextResponse.json({ error: 'cardIds must be an array' }, { status: 400 });
 16 |     }
 17 | 
 18 |     console.log(`Syncing ${cardIds.length} cards with Glownet...`);
 19 | 
 20 |     const results = {
 21 |       total: cardIds.length,
 22 |       synced: 0,
 23 |       failed: 0,
 24 |       skipped: 0,
 25 |       details: [] as Array<{
 26 |         cardId: string;
 27 |         status: 'synced' | 'failed' | 'skipped';
 28 |         error?: string;
 29 |         glownetEventId?: number;
 30 |       }>
 31 |     };
 32 | 
 33 |     // 2. Process each card
 34 |     for (const cardId of cardIds) {
 35 |       console.log(`Processing card: ${cardId}`);
 36 |       try {
 37 |         // 2.1 Check if card exists in our system
 38 |         const { data: existingCard, error: cardError } = await supabase
 39 |           .from('membership_cards')
 40 |           .select('id, card_identifier, status')
 41 |           .eq('card_identifier', cardId)
 42 |           .single();
 43 | 
 44 |         if (cardError) {
 45 |           console.error(`Error checking card ${cardId}:`, cardError);
 46 |           results.failed++;
 47 |           results.details.push({
 48 |             cardId,
 49 |             status: 'failed',
 50 |             error: 'Database error checking card existence'
 51 |           });
 52 |           continue;
 53 |         }
 54 | 
 55 |         // 2.2 If card doesn't exist, verify with Glownet first
 56 |         if (!existingCard) {
 57 |           try {
 58 |             // Verify card exists in Glownet
 59 |             const glownetDetails = await getGlownetEventDetailsByGtagUid(cardId);
 60 |             
 61 |             // Create card record in our system
 62 |             const { data: newCard, error: createError } = await supabase
 63 |               .from('membership_cards')
 64 |               .insert({
 65 |                 card_identifier: cardId,
 66 |                 status: 'unregistered'
 67 |               })
 68 |               .select()
 69 |               .single();
 70 | 
 71 |             if (createError) {
 72 |               throw new Error(`Failed to create card record: ${createError.message}`);
 73 |             }
 74 | 
 75 |             results.synced++;
 76 |             results.details.push({
 77 |               cardId,
 78 |               status: 'synced',
 79 |               glownetEventId: glownetDetails.event_id
 80 |             });
 81 | 
 82 |           } catch (glownetError: any) {
 83 |             console.error(`Glownet verification failed for card ${cardId}:`, glownetError);
 84 |             results.failed++;
 85 |             results.details.push({
 86 |               cardId,
 87 |               status: 'failed',
 88 |               error: glownetError.message || 'Failed to verify card with Glownet'
 89 |             });
 90 |           }
 91 |         } else {
 92 |           // Card already exists in our system
 93 |           results.skipped++;
 94 |           results.details.push({
 95 |             cardId,
 96 |             status: 'skipped'
 97 |           });
 98 |         }
 99 | 
100 |       } catch (cardProcessError: any) {
101 |         console.error(`Error processing card ${cardId}:`, cardProcessError);
102 |         results.failed++;
103 |         results.details.push({
104 |           cardId,
105 |           status: 'failed',
106 |           error: cardProcessError.message || 'Unknown error during processing'
107 |         });
108 |       }
109 |     }
110 | 
111 |     // 3. Return summary
112 |     return NextResponse.json({
113 |       message: 'Card sync completed',
114 |       results
115 |     });
116 | 
117 |   } catch (error: any) {
118 |     console.error('Card sync error:', error);
119 |     return NextResponse.json({
120 |       error: error.message || 'Internal server error during card sync'
121 |     }, { status: 500 });
122 |   }
123 | } 


--------------------------------------------------------------------------------
/app/api/venues/[venueId]/route.ts:
--------------------------------------------------------------------------------
 1 | import { NextResponse } from 'next/server';
 2 | import { createClient } from '@/lib/supabase/server';
 3 | import { cookies } from 'next/headers';
 4 | 
 5 | export async function GET(
 6 |   request: Request,
 7 |   { params }: { params: { venueId: string } }
 8 | ) {
 9 |   const venueId = params.venueId;
10 |   const cookieStore = await cookies();
11 |   const supabase = createClient(cookieStore);
12 | 
13 |   // Validate if venueId looks like a UUID (basic check)
14 |   if (!venueId || !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(venueId)) {
15 |       return NextResponse.json({ error: 'Invalid Venue ID format.' }, { status: 400 });
16 |   }
17 | 
18 |   try {
19 |     console.log(`Fetching venue details for ID: ${venueId}`);
20 |     const { data: venue, error } = await supabase
21 |       .from('venues')
22 |       .select(`
23 |         id,
24 |         name,
25 |         glownet_event_id,
26 |         address,
27 |         image_url,
28 |         created_at,
29 |         updated_at
30 |       `)
31 |       .eq('id', venueId)
32 |       .single();
33 | 
34 |     if (error) {
35 |       console.error(`Error fetching venue ${venueId}:`, error);
36 |       // Check if the error is because the venue was not found
37 |       if (error.code === 'PGRST116') { // PostgREST code for "relation does not contain row"
38 |          return NextResponse.json({ error: 'Venue not found.' }, { status: 404 });
39 |       }
40 |       return NextResponse.json({ error: 'Database error fetching venue.' }, { status: 500 });
41 |     }
42 | 
43 |     if (!venue) {
44 |       // This case might be redundant due to .single() throwing error, but good safety check
45 |       return NextResponse.json({ error: 'Venue not found.' }, { status: 404 });
46 |     }
47 | 
48 |     console.log(`Successfully fetched venue: ${venue.name}`);
49 |     return NextResponse.json(venue);
50 | 
51 |   } catch (error: any) {
52 |     console.error('----------------------------------------');
53 |     console.error('FETCH VENUE DETAIL API ERROR:');
54 |     console.error('Venue ID:', venueId);
55 |     console.error('Timestamp:', new Date().toISOString());
56 |     console.error('Error Name:', error.name);
57 |     console.error('Error Message:', error.message);
58 |     console.error('Error Stack:', error.stack);
59 |     console.error('----------------------------------------');
60 | 
61 |     return NextResponse.json({ error: 'Internal server error fetching venue details.' }, { status: 500 });
62 |   }
63 | } 


--------------------------------------------------------------------------------
/app/api/venues/route.ts:
--------------------------------------------------------------------------------
 1 | import { cookies } from "next/headers";
 2 | import { NextRequest, NextResponse } from "next/server";
 3 | import { createClient } from "@/lib/supabase/server"; // Use the server-side client
 4 | 
 5 | export const dynamic = 'force-dynamic'; // Force dynamic execution, disable caching
 6 | 
 7 | export async function GET(request: NextRequest) {
 8 |   // Await the cookies() call to get the actual store
 9 |   const cookieStore = await cookies();
10 |   const supabase = createClient(cookieStore); // Now pass the resolved store
11 | 
12 |   try {
13 |     // Fetch all venues from the 'venues' table
14 |     const { data: venues, error } = await supabase
15 |       .from("venues")
16 |       .select("id, name, address, image_url, glownet_event_id") // Adjust columns as needed
17 |       .order("name", { ascending: true }); // Optional: order by name
18 | 
19 |     if (error) {
20 |       console.error("Error fetching venues:", error);
21 |       return NextResponse.json(
22 |         { error: "Failed to fetch venues", details: error.message },
23 |         { status: 500 }
24 |       );
25 |     }
26 | 
27 |     return NextResponse.json(venues || []);
28 |   } catch (err) {
29 |     console.error("Unexpected error in /api/venues:", err);
30 |     const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
31 |     return NextResponse.json(
32 |       { error: "An unexpected server error occurred", details: errorMessage },
33 |       { status: 500 }
34 |     );
35 |   }
36 | } 


--------------------------------------------------------------------------------
/app/api/venues/sync-glownet/route.ts:
--------------------------------------------------------------------------------
  1 | import { NextResponse } from 'next/server';
  2 | import { cookies } from 'next/headers';
  3 | import { createClient } from '@/lib/supabase/server';
  4 | import { getAllGlownetEvents, type GlownetEvent } from '@/lib/glownet';
  5 | 
  6 | // Rate limiting setup
  7 | const RATE_LIMIT = 10; // requests per minute
  8 | const rateLimitStore = new Map<string, number[]>();
  9 | 
 10 | // Environment variable for security
 11 | const API_KEY = process.env.GLOWNET_API_KEY;
 12 | 
 13 | // Sync types
 14 | type SyncType = 'full' | 'incremental';
 15 | type SyncStatus = 'pending' | 'success' | 'failed';
 16 | 
 17 | // Track sync status in Supabase
 18 | async function trackSyncStatus(supabase: any, venueId: string, status: SyncStatus, error?: string) {
 19 |   await supabase
 20 |     .from('venues')
 21 |     .update({ 
 22 |       sync_status: status,
 23 |       last_sync_attempt: new Date().toISOString(),
 24 |       sync_error: error
 25 |     })
 26 |     .eq('id', venueId);
 27 | }
 28 | 
 29 | // Main sync logic
 30 | async function syncVenues(type: SyncType = 'full', venueImages: Record<string, { image_url: string, image_alt: string }> = {}) {
 31 |   const cookieStore = await cookies();
 32 |   const supabase = createClient(cookieStore);
 33 |   
 34 |   try {
 35 |     console.log(`Starting ${type} Glownet venue sync...`);
 36 |     const glownetEvents: GlownetEvent[] = await getAllGlownetEvents();
 37 |     
 38 |     if (!glownetEvents?.length) {
 39 |       console.log('No Glownet events found to sync.');
 40 |       return { message: 'No events to sync', status: 200 };
 41 |     }
 42 | 
 43 |     // Prepare venue data with enhanced fields
 44 |     const venuesToUpsert = glownetEvents.map((event) => {
 45 |       // Get image data if available
 46 |       const imageData = venueImages[event.id.toString()] || {};
 47 |       
 48 |       return {
 49 |         glownet_event_id: event.id,
 50 |         name: event.name,
 51 |         status: event.state,
 52 |         start_date: event.start_date,
 53 |         end_date: event.end_date,
 54 |         timezone: event.timezone,
 55 |         currency: event.currency,
 56 |         image_url: imageData.image_url || null,
 57 |         max_balance: event.maximum_gtag_standard_balance,
 58 |         max_virtual_balance: event.maximum_gtag_virtual_balance,
 59 |         last_synced: new Date().toISOString(),
 60 |         sync_status: 'success' as SyncStatus
 61 |       };
 62 |     });
 63 | 
 64 |     // Perform upsert
 65 |     const { data, error } = await supabase
 66 |       .from('venues')
 67 |       .upsert(venuesToUpsert, {
 68 |         onConflict: 'glownet_event_id',
 69 |         ignoreDuplicates: false,
 70 |       })
 71 |       .select('id, name, glownet_event_id');
 72 | 
 73 |     if (error) throw error;
 74 | 
 75 |     // Track sync status for each venue
 76 |     for (const venue of data || []) {
 77 |       await trackSyncStatus(supabase, venue.id, 'success');
 78 |     }
 79 | 
 80 |     return {
 81 |       message: `Successfully synced ${data?.length ?? 0} venues`,
 82 |       data,
 83 |       status: 200
 84 |     };
 85 | 
 86 |   } catch (error: any) {
 87 |     console.error('----------------------------------------');
 88 |     console.error('VENUE SYNC ERROR:');
 89 |     console.error('Timestamp:', new Date().toISOString());
 90 |     console.error('Error:', error);
 91 |     console.error('----------------------------------------');
 92 | 
 93 |     // Track failed status if possible
 94 |     if (error.venue_id) {
 95 |       await trackSyncStatus(supabase, error.venue_id, 'failed', error.message);
 96 |     }
 97 | 
 98 |     return {
 99 |       error: error.message || 'Sync failed',
100 |       status: error.status || 500
101 |     };
102 |   }
103 | }
104 | 
105 | // Activation Points:
106 | 
107 | // 1. Manual Sync via API endpoint
108 | export async function POST(request: Request) {
109 |   // Security check using GLOWNET_API_KEY
110 |   const API_KEY = process.env.GLOWNET_API_KEY;
111 | 
112 |   if (!API_KEY) {
113 |     console.error('GLOWNET_API_KEY is not set in environment variables.');
114 |     return NextResponse.json({ error: 'Internal server configuration error.' }, { status: 500 });
115 |   }
116 | 
117 |   // Rate limiting
118 |   const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
119 |   const now = Date.now();
120 |   const recentRequests = rateLimitStore.get(clientIP) || [];
121 |   const validRequests = recentRequests.filter(time => now - time < 60000);
122 |   
123 |   if (validRequests.length >= RATE_LIMIT) {
124 |     return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
125 |   }
126 |   
127 |   rateLimitStore.set(clientIP, [...validRequests, now]);
128 | 
129 |   // Get sync type and venue images from request
130 |   const { type = 'full', venue_images = {} } = await request.json();
131 |   const result = await syncVenues(type as SyncType, venue_images);
132 |   
133 |   return NextResponse.json(
134 |     result.error ? { error: result.error } : { message: result.message, data: result.data },
135 |     { status: result.status }
136 |   );
137 | }
138 | 
139 | // 2. Scheduled Sync via Vercel Cron
140 | 
141 | // Use separate exports for Route Segment Config
142 | export const runtime = 'edge';
143 | export const preferredRegion = 'iad1'; 
144 | // Note: 'regions' is deprecated, use 'preferredRegion' or 'dynamic = "force-dynamic"' if applicable
145 | // See: https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
146 | 
147 | /* // Remove the old config object
148 | export const config = {
149 |   runtime: 'edge',
150 |   regions: ['iad1'],  // Specify regions if needed
151 | };
152 | */
153 | 
154 | // This function is triggered by Vercel Cron
155 | // Configure in vercel.json:
156 | // {
157 | //   "crons": [{
158 | //     "path": "/api/venues/sync-glownet",
159 | //     "schedule": "0 */6 * * *"
160 | //   }]
161 | // }
162 | export async function GET(request: Request) {
163 |   // Only allow requests from Vercel Cron
164 |   const isCron = request.headers.get('x-vercel-cron') === 'true';
165 |   
166 |   if (!isCron) {
167 |     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
168 |   }
169 | 
170 |   const result = await syncVenues('incremental');
171 |   return NextResponse.json(
172 |     result.error ? { error: result.error } : { message: result.message },
173 |     { status: result.status }
174 |   );
175 | } 


--------------------------------------------------------------------------------
/app/api/wallet/glownet-details/route.ts:
--------------------------------------------------------------------------------
 1 | import { NextResponse } from 'next/server';
 2 | import { cookies } from 'next/headers';
 3 | import { createClient } from '@/lib/supabase/server';
 4 | import { getGlownetCustomerDetails, type GlownetCustomer } from '@/lib/glownet';
 5 | 
 6 | export async function GET(request: Request) {
 7 |   try {
 8 |     // 1. Authenticate User
 9 |     const cookieStore = await cookies();
10 |     const supabase = createClient(cookieStore);
11 | 
12 |     const { data: { user }, error: authError } = await supabase.auth.getUser();
13 | 
14 |     if (authError || !user) {
15 |       console.error('Auth Error in glownet-details route:', authError);
16 |       return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
17 |     }
18 |     const userId = user.id;
19 | 
20 |     // 2. Fetch the first active membership for the user to get Glownet IDs
21 |     //    We join with venues to get the glownet_event_id
22 |     console.log(`Fetching first active membership for user ${userId} to get Glownet IDs...`);
23 |     const { data: membership, error: membershipError } = await supabase
24 |       .from('memberships')
25 |       .select(`
26 |         glownet_customer_id,
27 |         venues ( glownet_event_id )
28 |       `)
29 |       .eq('user_id', userId)
30 |       .eq('status', 'active') // Assuming 'active' is the status for current memberships
31 |       .limit(1)
32 |       .maybeSingle();
33 | 
34 |     if (membershipError) {
35 |       console.error(`Error fetching membership for user ${userId}:`, membershipError);
36 |       return NextResponse.json({ error: 'Failed to retrieve membership details.' }, { status: 500 });
37 |     }
38 | 
39 |     // Check for missing data more robustly
40 |     let glownetEventId: number | undefined | null = null;
41 |     if (membership?.venues) {
42 |       if (Array.isArray(membership.venues) && membership.venues.length > 0) {
43 |           glownetEventId = membership.venues[0].glownet_event_id;
44 |       } else if (typeof membership.venues === 'object' && !Array.isArray(membership.venues)) {
45 |           // Handle case where venues is an object (e.g., many-to-one)
46 |           glownetEventId = (membership.venues as any).glownet_event_id; 
47 |       }
48 |     }
49 | 
50 |     if (!membership || !membership.glownet_customer_id || typeof glownetEventId !== 'number') {
51 |         console.warn(`No active membership with required Glownet IDs found for user ${userId}. CustomerID: ${membership?.glownet_customer_id}, EventID: ${glownetEventId}`);
52 |         return NextResponse.json({
53 |             message: 'No active Glownet-linked membership found.',
54 |             glownetData: null
55 |          });
56 |     }
57 | 
58 |     const glownetCustomerId = membership.glownet_customer_id;
59 |     // glownetEventId is now guaranteed to be a number here
60 | 
61 |     // 3. Fetch Glownet Customer Details
62 |     console.log(`Fetching Glownet details for customer ${glownetCustomerId} in event ${glownetEventId}...`);
63 |     const glownetData: GlownetCustomer = await getGlownetCustomerDetails(
64 |       glownetEventId,
65 |       glownetCustomerId
66 |     );
67 | 
68 |     // 4. Return relevant data
69 |     //    Select only the fields needed by the frontend to minimize data transfer
70 |     const relevantData = {
71 |         money: glownetData.money,
72 |         virtual_money: glownetData.virtual_money,
73 |         balances: glownetData.balances,
74 |         // Add other fields from GlownetCustomer if needed later
75 |     };
76 | 
77 |     console.log(`Successfully fetched Glownet details for user ${userId}.`);
78 |     return NextResponse.json({ glownetData: relevantData });
79 | 
80 |   } catch (error: any) {
81 |     console.error('Error fetching Glownet wallet details:', error);
82 |     // Distinguish Glownet API errors from others if possible
83 |     let errorMessage = 'An unexpected error occurred.';
84 |     if (error instanceof Error && error.message.includes('Glownet API request failed')) {
85 |         errorMessage = 'Failed to retrieve data from Glownet.';
86 |         // Consider specific status codes based on Glownet error if available
87 |          return NextResponse.json({ error: errorMessage }, { status: 502 }); // Bad Gateway
88 |     }
89 |     return NextResponse.json({ error: errorMessage }, { status: 500 });
90 |   }
91 | } 


--------------------------------------------------------------------------------
/app/card/[card_id]/page.tsx:
--------------------------------------------------------------------------------
 1 | import { CardLanding } from '@/app/components/onboarding/CardLanding'; 
 2 | 
 3 | // The Page component receives params asynchronously
 4 | export default function CardPage({ params }: { params: { card_id: string } }) {
 5 |   
 6 |   // Option 1 (Recommended): Render the Client Component directly.
 7 |   // The CardLanding component uses `useParams` hook which works correctly
 8 |   // on the client-side to get the card_id.
 9 |   return <CardLanding />;
10 | 
11 |   // Option 2 (If you needed card_id in the Server Component):
12 |   // You can access the card_id directly from the passed params object.
13 |   // const cardId = params.card_id; 
14 |   // return (
15 |   //   <div>
16 |   //     <h1>Card ID (from Server Component): {cardId}</h1>
17 |   //     {/* You would still likely render CardLanding or similar here */}
18 |   //     {/* <CardLanding /> */} 
19 |   //   </div>
20 |   // );
21 | }


--------------------------------------------------------------------------------
/app/components/auth/ConnectWallet.tsx:
--------------------------------------------------------------------------------
 1 | 'use client';
 2 | 
 3 | import React, { FC } from 'react';
 4 | import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
 5 | // You might not need the specific hooks here if just using the button
 6 | // import { useWallet } from '@solana/wallet-adapter-react';
 7 | 
 8 | // This component now simply renders the pre-built button from the UI library
 9 | // which handles the modal and connection logic.
10 | export const SolanaConnectButton: FC = () => {
11 | 
12 |   // const { connected } = useWallet(); // Example: You could conditionally render based on connection status
13 | 
14 |   return (
15 |       <WalletMultiButton />
16 |   );
17 | };
18 | 
19 | // If you need more customization than WalletMultiButton offers, 
20 | // you can use WalletModalButton and other hooks:
21 | // import { useWalletModal } from '@solana/wallet-adapter-react-ui';
22 | // import { Button } from '@/app/components/ui/button';
23 | // 
24 | // export const CustomConnectWallet: FC = () => {
25 | //   const { setVisible } = useWalletModal();
26 | //   const { wallet, connect, connected, connecting } = useWallet();
27 | // 
28 | //   const handleConnectClick = () => {
29 | //       setVisible(true);
30 | //   };
31 | // 
32 | //   if (connected) {
33 | //     return <p>Connected to {wallet?.adapter.name}</p>;
34 | //   }
35 | // 
36 | //   return (
37 | //     <Button onClick={handleConnectClick} disabled={connecting}>
38 | //       {connecting ? 'Connecting...' : 'Connect Solana Wallet'}
39 | //     </Button>
40 | //   );
41 | // };
42 | 


--------------------------------------------------------------------------------
/app/components/auth/LoginForm.tsx:
--------------------------------------------------------------------------------
  1 | 'use client';
  2 | 
  3 | import React from 'react';
  4 | import { useRouter } from 'next/navigation';
  5 | import { Button } from '@/app/components/ui/button';
  6 | import { Input } from '@/app/components/ui/input';
  7 | import { Label } from '@/app/components/ui/label';
  8 | import { toast } from 'sonner';
  9 | import { useAuth } from '@/app/context/AuthContext';
 10 | import { ArrowLeft } from 'lucide-react';
 11 | import { useForm } from 'react-hook-form';
 12 | import { zodResolver } from '@hookform/resolvers/zod';
 13 | import * as z from 'zod';
 14 | import {
 15 |   Form,
 16 |   FormControl,
 17 |   FormField,
 18 |   FormItem,
 19 |   FormLabel,
 20 |   FormMessage,
 21 | } from '@/app/components/ui/form';
 22 | import Link from 'next/link';
 23 | 
 24 | // 1. Define Zod Schema
 25 | const formSchema = z.object({
 26 |   email: z.string().email({ message: 'Invalid email address.' }),
 27 |   password: z.string().min(1, { message: 'Password is required.' }),
 28 | });
 29 | 
 30 | export const LoginForm: React.FC = () => {
 31 |   const router = useRouter();
 32 |   const { supabase } = useAuth();
 33 | 
 34 |   // 2. Initialize react-hook-form
 35 |   const form = useForm<z.infer<typeof formSchema>>({
 36 |     resolver: zodResolver(formSchema),
 37 |     defaultValues: {
 38 |       email: '',
 39 |       password: '',
 40 |     },
 41 |   });
 42 | 
 43 |   // 3. Define onSubmit handler using Supabase auth
 44 |   async function onSubmit(values: z.infer<typeof formSchema>) {
 45 |     console.log('Login attempt with:', values.email);
 46 | 
 47 |     try {
 48 |       // Use Supabase client to sign in
 49 |       const { error } = await supabase.auth.signInWithPassword({
 50 |         email: values.email,
 51 |         password: values.password,
 52 |       });
 53 | 
 54 |       if (error) {
 55 |         throw error; // Throw Supabase error
 56 |       }
 57 | 
 58 |       toast.success('Signed in successfully!');
 59 |       // No need to call login() from context anymore
 60 |       // Redirect is handled by middleware or can be done explicitly
 61 |       router.push('/dashboard'); // Or router.refresh() if middleware handles redirect
 62 | 
 63 |     } catch (error: any) {
 64 |       console.error('Supabase login error:', error);
 65 |       toast.error(error.message || 'Login failed. Please check your credentials.');
 66 |     }
 67 |     // isSubmitting is handled by react-hook-form
 68 |   }
 69 | 
 70 |   return (
 71 |     <div className="flex flex-col min-h-screen p-6">
 72 |        <button
 73 |         onClick={() => router.back()}
 74 |         className="self-start mb-8 p-2 rounded-full hover:bg-black/5 transition-colors"
 75 |         aria-label="Go back"
 76 |         disabled={form.formState.isSubmitting}
 77 |       >
 78 |         <ArrowLeft className="h-6 w-6" />
 79 |       </button>
 80 | 
 81 |       <div className="mb-10">
 82 |         <h1 className="text-3xl font-bold mb-2">Sign In</h1>
 83 |         <p className="text-muted-foreground">Access your Samachi membership</p>
 84 |       </div>
 85 | 
 86 |       <Form {...form}>
 87 |         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
 88 |           {/* Email Field */}
 89 |           <FormField
 90 |             control={form.control}
 91 |             name="email"
 92 |             render={({ field }) => (
 93 |               <FormItem>
 94 |                 <FormLabel>Email</FormLabel>
 95 |                 <FormControl>
 96 |                   <Input
 97 |                     type="email"
 98 |                     placeholder="your@email.com"
 99 |                     autoComplete="email"
100 |                     className="bg-white/50 backdrop-blur-sm border-gray-200"
101 |                     disabled={form.formState.isSubmitting}
102 |                     {...field}
103 |                   />
104 |                 </FormControl>
105 |                 <FormMessage />
106 |               </FormItem>
107 |             )}
108 |           />
109 | 
110 |           {/* Password Field */}
111 |           <FormField
112 |             control={form.control}
113 |             name="password"
114 |             render={({ field }) => (
115 |               <FormItem>
116 |                 <FormLabel>Password</FormLabel>
117 |                 <FormControl>
118 |                   <Input
119 |                     type="password"
120 |                     placeholder="••••••••"
121 |                     autoComplete="current-password"
122 |                     className="bg-white/50 backdrop-blur-sm border-gray-200"
123 |                     disabled={form.formState.isSubmitting}
124 |                     {...field}
125 |                   />
126 |                 </FormControl>
127 |                 <FormMessage />
128 |                 <div className="text-right">
129 |                   <Link href="/forgot-password"
130 |                     className="text-sm text-primary hover:underline">
131 |                     Forgot Password?
132 |                   </Link>
133 |                 </div>
134 |               </FormItem>
135 |             )}
136 |           />
137 | 
138 |           <Button
139 |             type="submit"
140 |             className="w-full glass-button"
141 |             disabled={form.formState.isSubmitting}
142 |           >
143 |             {form.formState.isSubmitting ? 'Signing In...' : 'Sign In'}
144 |           </Button>
145 | 
146 |           {/* Comments remain the same */}
147 |           {/* Link to create profile if they landed here by mistake? Or is CardLanding the only entry? */}
148 |           {/* For MVP, maybe omit this link if flow is strictly Card -> Create or Card -> Login */}
149 |           {/* <p className="text-center text-sm">
150 |             Don't have an account? You need a membership card to sign up.
151 |             <Link href="/" className="text-primary font-medium hover:underline"> Learn More</Link> 
152 |           </p> */}
153 |         </form>
154 |       </Form>
155 |     </div>
156 |   );
157 | }; 


--------------------------------------------------------------------------------
/app/components/discover/DiscoverVenues.tsx:
--------------------------------------------------------------------------------
  1 | 'use client';
  2 | 
  3 | import React, { useState, useEffect } from 'react';
  4 | import { List, Map, Search } from 'lucide-react';
  5 | import { Input } from '@/app/components/ui/input';
  6 | import { VenueList } from './VenueList';
  7 | import { VenueMap } from './VenueMap';
  8 | import { Skeleton } from '@/app/components/ui/skeleton';
  9 | import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
 10 | import { Terminal } from "lucide-react";
 11 | 
 12 | // Define the expected structure of a Venue from Supabase
 13 | interface Venue {
 14 |   id: string;
 15 |   name: string;
 16 |   description: string | null;
 17 |   address: string | null;
 18 |   image_url: string | null;
 19 |   glownet_event_id: number | null;
 20 | }
 21 | 
 22 | export function DiscoverVenues() {
 23 |   const [view, setView] = useState<'list' | 'map'>('list');
 24 |   const [searchQuery, setSearchQuery] = useState('');
 25 |   const [venues, setVenues] = useState<Venue[]>([]);
 26 |   const [isLoading, setIsLoading] = useState(true);
 27 |   const [error, setError] = useState<string | null>(null);
 28 | 
 29 |   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 30 |     setSearchQuery(e.target.value);
 31 |   };
 32 | 
 33 |   useEffect(() => {
 34 |     const fetchVenues = async () => {
 35 |       setIsLoading(true);
 36 |       setError(null);
 37 |       try {
 38 |         const response = await fetch('/api/venues');
 39 |         if (!response.ok) {
 40 |           const errorData = await response.json().catch(() => ({ error: 'Failed to fetch venues' }));
 41 |           throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
 42 |         }
 43 |         const data: Venue[] = await response.json();
 44 |         console.log(`DiscoverVenues: Fetched ${data.length} venues from Supabase.`);
 45 |         setVenues(data || []);
 46 |       } catch (err: any) {
 47 |         console.error("Error fetching venues:", err);
 48 |         setError(err.message || 'An unexpected error occurred.');
 49 |         setVenues([]);
 50 |       } finally {
 51 |         setIsLoading(false);
 52 |       }
 53 |     };
 54 | 
 55 |     fetchVenues();
 56 |   }, []);
 57 | 
 58 |   // Filter venues based on search query
 59 |   const filteredVenues = venues.filter(venue =>
 60 |     (venue.name && venue.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
 61 |     (venue.address && venue.address.toLowerCase().includes(searchQuery.toLowerCase()))
 62 |   );
 63 | 
 64 |   if (isLoading) {
 65 |     return (
 66 |       <div className="space-y-4 p-4 md:p-6">
 67 |         <Skeleton className="h-10 w-1/4 mb-4" />
 68 |         <Skeleton className="h-8 w-full mb-2" />
 69 |         <Skeleton className="h-8 w-5/6" />
 70 |       </div>
 71 |     );
 72 |   }
 73 | 
 74 |   const noVenuesToShow = filteredVenues.length === 0;
 75 | 
 76 |   return (
 77 |     <div className="p-4 md:p-6">
 78 |       <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center md:text-left">Discover</h1>
 79 | 
 80 |       {error && (
 81 |           <Alert variant="destructive" className="mb-4">
 82 |              <Terminal className="h-4 w-4" />
 83 |              <AlertTitle>Error Fetching Venues</AlertTitle>
 84 |              <AlertDescription>{error}</AlertDescription>
 85 |          </Alert>
 86 |       )}
 87 | 
 88 |       <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
 89 |         <div className="relative w-full md:w-auto md:flex-grow max-w-md">
 90 |             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
 91 |             <Input
 92 |                 type="search"
 93 |                 placeholder="Search venues by name or location..."
 94 |                 value={searchQuery}
 95 |                 onChange={handleSearchChange}
 96 |                 className="pl-10 w-full"
 97 |             />
 98 |         </div>
 99 |         <div className="flex items-center space-x-2 shrink-0">
100 |            <button
101 |              onClick={() => setView('list')}
102 |              className={`px-3 py-1.5 rounded-md flex items-center text-sm transition-colors ${ view === 'list' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground' }`}
103 |            >
104 |              <List className="h-4 w-4 mr-1.5" />
105 |              List
106 |            </button>
107 |            <button
108 |              onClick={() => setView('map')}
109 |               className={`px-3 py-1.5 rounded-md flex items-center text-sm transition-colors ${ view === 'map' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground' }`}
110 |            >
111 |              <Map className="h-4 w-4 mr-1.5" />
112 |              Map
113 |            </button>
114 |         </div>
115 |       </div>
116 | 
117 |       {noVenuesToShow ? (
118 |              <Alert className="mt-4">
119 |                 <Terminal className="h-4 w-4" />
120 |                 <AlertTitle>No Venues Found</AlertTitle>
121 |                 <AlertDescription>
122 |                     {searchQuery ? `No venues match your search "${searchQuery}".` : "No venues available."}
123 |                 </AlertDescription>
124 |             </Alert>
125 |         ) : (
126 |             <div className="animate-fade-in">
127 |                 {view === 'list' ? <VenueList venues={filteredVenues} /> : <VenueMap venues={filteredVenues} />}
128 |             </div>
129 |         )}
130 |     </div>
131 |   );
132 | }
133 | 


--------------------------------------------------------------------------------
/app/components/discover/VenueList.tsx:
--------------------------------------------------------------------------------
 1 | 'use client';
 2 | 
 3 | import React from 'react';
 4 | import { useRouter } from 'next/navigation';
 5 | import { MapPin, ExternalLink, Building } from 'lucide-react';
 6 | 
 7 | // Define venue interface consistently with DiscoverVenues
 8 | interface Venue {
 9 |   id: string;
10 |   name: string;
11 |   description: string | null;
12 |   address: string | null;
13 |   image_url: string | null;
14 |   glownet_event_id: number | null;
15 | }
16 | 
17 | interface VenueListProps {
18 |   venues: Venue[];
19 | }
20 | 
21 | export function VenueList({ venues }: VenueListProps) {
22 |   const router = useRouter();
23 | 
24 |   const handleVenueClick = (venueId: string) => {
25 |     router.push(`/venue/${venueId}`);
26 |   };
27 | 
28 |   if (venues.length === 0) {
29 |     return <p className="text-center text-muted-foreground">No venues to display.</p>;
30 |   }
31 | 
32 |   return (
33 |     <div className="space-y-4">
34 |       {venues.map((venue) => (
35 |         <div
36 |           key={venue.id}
37 |           className="glass-card overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
38 |           onClick={() => handleVenueClick(venue.id)}
39 |         >
40 |           <div className="h-48 relative overflow-hidden bg-gray-200">
41 |             {venue.image_url ? (
42 |                 <img
43 |                 src={venue.image_url}
44 |                 alt={venue.name || 'Venue image'}
45 |                 className="w-full h-full object-cover"
46 |                 />
47 |             ) : (
48 |                 <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
49 |                     <Building className="h-12 w-12 mb-2 text-gray-400"/>
50 |                     <span>No Image</span>
51 |                 </div>
52 |             )}
53 |           </div>
54 | 
55 |           <div className="p-4">
56 |             <h3 className="text-lg font-semibold mb-1">{venue.name || 'Unnamed Venue'}</h3>
57 |             <p className="text-xs text-muted-foreground flex items-center mb-2">
58 |               <MapPin className="h-3 w-3 mr-1" />
59 |               {venue.address || 'Location not specified'}
60 |             </p>
61 |             <p className="text-sm mb-3">{venue.description || 'No description available.'}</p>
62 |             <button className="text-primary text-sm font-medium flex items-center hover:underline">
63 |               View Details
64 |               <ExternalLink className="h-3 w-3 ml-1" />
65 |             </button>
66 |           </div>
67 |         </div>
68 |       ))}
69 |     </div>
70 |   );
71 | }
72 | 


--------------------------------------------------------------------------------
/app/components/discover/VenueMap.tsx:
--------------------------------------------------------------------------------
 1 | 'use client';
 2 | 
 3 | import React from 'react';
 4 | import { Building } from 'lucide-react';
 5 | 
 6 | // Align Venue type with DiscoverVenues.tsx
 7 | interface Venue {
 8 |   id: string;
 9 |   name: string;
10 |   description: string | null;
11 |   address: string | null;
12 |   location?: string | null; // Optional field from mock data
13 |   image_url: string | null;
14 |   image?: string | null; // Optional field from mock data
15 |   glownet_event_id?: number | null; // Make optional/nullable
16 |   coords?: { lat: number; lng: number }; // Keep coords if needed for map
17 | }
18 | 
19 | // Update props to accept the filtered venues array
20 | interface VenueMapProps {
21 |   venues: Venue[];
22 | }
23 | 
24 | // Remove React.FC typing for consistency, destructure venues prop
25 | export function VenueMap({ venues }: VenueMapProps) {
26 | 
27 |   // Filtering is now done in the parent component
28 |   // Removed useMemo and filteredVenues logic
29 | 
30 |   // Handle case where the filtered list passed from parent is empty
31 |   if (venues.length === 0) {
32 |      // Potentially show a simplified map or a message
33 |      return (
34 |          <div className="glass-card h-96 relative overflow-hidden flex items-center justify-center">
35 |              <p className="text-muted-foreground">No venues to display on the map.</p>
36 |          </div>
37 |      );
38 |   }
39 | 
40 |   // TODO: Implement actual map rendering using the 'venues' prop
41 |   // - Use a library like Leaflet, Mapbox GL JS, or Google Maps React component.
42 |   // - Iterate over 'venues' to place markers (using venue.coords if available).
43 |   // - Add popups or interactions on marker click.
44 | 
45 |   return (
46 |     <div className="glass-card h-96 relative overflow-hidden">
47 |       <div className="absolute inset-0 flex items-center justify-center">
48 |         <div className="w-full h-full bg-gray-100 relative">
49 |           {/* Simple map placeholder - REMAINS PLACEHOLDER */}
50 |           <svg
51 |             viewBox="0 0 1000 500"
52 |             className="w-full h-full opacity-70"
53 |             xmlns="http://www.w3.org/2000/svg"
54 |           >
55 |             <path d="M100,100 h800 v300 h-800 Z" fill="#E5E7EB" stroke="#9CA3AF" />
56 |             <text x="500" y="250" fontSize="20" textAnchor="middle" fill="#6B7280">
57 |               Map Area (Interactive Map Coming Soon)
58 |             </text>
59 |           </svg>
60 | 
61 |           {/* Display count based on passed venues */}
62 |           <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md p-2 rounded shadow">
63 |             <p className="text-xs text-muted-foreground">
64 |               Displaying {venues.length} venue(s)
65 |             </p>
66 |           </div>
67 | 
68 |           {/* Placeholder for markers - using passed venues */}
69 |           {venues.map((venue, index) => (
70 |             <div
71 |               key={venue.id}
72 |               className="absolute w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-md cursor-pointer hover:scale-125 transition-transform"
73 |               style={{
74 |                 // Use actual coords if available, otherwise fallback to random-ish positions
75 |                 left: venue.coords ? `${(venue.coords.lng + 180) / 3.6}%` : `${20 + index * 10}%`, // Basic scaling for demo
76 |                 top: venue.coords ? `${90 - (venue.coords.lat + 90) / 1.8}%` : `${40 + (index % 2) * 20}%`, // Basic scaling for demo
77 |                }}
78 |                // Use address or location for title
79 |               title={`${venue.name || 'Venue'} - ${venue.address || venue.location || 'Location N/A'}`}
80 |               // TODO: Add onClick to show popup or navigate
81 |             ></div>
82 |           ))}
83 | 
84 |         </div>
85 |       </div>
86 |     </div>
87 |   );
88 | }
89 | 


--------------------------------------------------------------------------------
/app/components/layout/Navbar.tsx:
--------------------------------------------------------------------------------
 1 | 'use client';
 2 | 
 3 | import React from 'react';
 4 | import Link from 'next/link';
 5 | import { usePathname } from 'next/navigation';
 6 | import { Compass, CreditCard, Home, User } from 'lucide-react';
 7 | 
 8 | export const Navbar: React.FC = () => {
 9 |   const pathname = usePathname();
10 |   
11 |   const navItems = [
12 |     { path: '/dashboard', icon: Home, label: 'Home' },
13 |     { path: '/discover', icon: Compass, label: 'Discover' },
14 |     { path: '/wallet', icon: CreditCard, label: 'Wallet' },
15 |     { path: '/profile', icon: User, label: 'Profile' }
16 |   ];
17 | 
18 |   return (
19 |     <nav className="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-lg border-t border-gray-200 shadow-lg py-2 px-4 z-50">
20 |       <div className="flex justify-around items-center max-w-md mx-auto">
21 |         {navItems.map((item) => {
22 |           const isActive = pathname === item.path;
23 |           return (
24 |             <Link
25 |               key={item.path}
26 |               href={item.path}
27 |               className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
28 |                 isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
29 |               }`}
30 |             >
31 |               <item.icon size={20} />
32 |               <span className="text-xs mt-1">{item.label}</span>
33 |             </Link>
34 |           );
35 |         })}
36 |       </div>
37 |     </nav>
38 |   );
39 | };
40 | 


--------------------------------------------------------------------------------
/app/components/layout/PageLayout.tsx:
--------------------------------------------------------------------------------
 1 | 
 2 | import React, { ReactNode } from 'react';
 3 | import { Navbar } from './Navbar';
 4 | 
 5 | interface PageLayoutProps {
 6 |   children: ReactNode;
 7 |   hideNavbar?: boolean;
 8 | }
 9 | 
10 | export const PageLayout: React.FC<PageLayoutProps> = ({ children, hideNavbar = false }) => {
11 |   return (
12 |     <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/80">
13 |       <main className="flex-1 w-full max-w-md mx-auto pb-20">
14 |         {children}
15 |       </main>
16 |       {!hideNavbar && <Navbar />}
17 |     </div>
18 |   );
19 | };
20 | 


--------------------------------------------------------------------------------
/app/components/onboarding/OnboardingVideo.tsx:
--------------------------------------------------------------------------------
 1 | // samachi/frontend/samachi-vip-access/src/components/onboarding/OnboardingVideo.tsx
 2 | 'use client';
 3 | 
 4 | import React from "react";
 5 | import { useRouter } from "next/navigation";
 6 | import { Button } from "@/app/components/ui/button";
 7 | // import useAuth from "@/hooks/useAuth"; // Removed as per user request
 8 | 
 9 | export const OnboardingVideo = () => {
10 |   // const navigate = useNavigate();
11 |   const router = useRouter();
12 |   // Assuming useAuth hook provides a way to mark onboarding as complete,
13 |   // or you handle this state update elsewhere after navigation.
14 |   // const { markOnboardingComplete } = useAuth();
15 | 
16 |   const handleContinue = async () => {
17 |     // TODO: Add API call to mark onboarding as complete for the user if needed
18 |     // if (markOnboardingComplete) {
19 |     //   await markOnboardingComplete();
20 |     // }
21 |     console.log("Onboarding video watched, navigating to dashboard.");
22 |     router.push("/dashboard"); // Navigate to the main dashboard
23 |   };
24 | 
25 |   return (
26 |     <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-100 to-purple-100">
27 |       <div className="bg-white shadow-xl rounded-lg p-8 max-w-lg w-full text-center">
28 |         <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome to Samachi!</h1>
29 |         <p className="mb-6 text-gray-600">Watch this short video to get started.</p>
30 | 
31 |         <div className="w-full aspect-video bg-gray-200 border-4 border-gray-300 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
32 |           {/* TODO: Embed actual video player (e.g., YouTube iframe, Vimeo, custom player) */}
33 |           <span className="text-gray-500 font-medium p-4 text-center">
34 |             Onboarding video placeholder
35 |           </span>
36 |         </div>
37 | 
38 |         <Button onClick={handleContinue} className="w-full py-3 text-lg font-semibold">
39 |           Continue to App
40 |         </Button>
41 |       </div>
42 |     </div>
43 |   );
44 | };


--------------------------------------------------------------------------------
/app/components/profile/ProfileSettings.tsx:
--------------------------------------------------------------------------------
  1 | 'use client';
  2 | 
  3 | import React, { useState } from 'react';
  4 | import { useRouter } from 'next/navigation';
  5 | import { 
  6 |   User, Wallet, Bell, Globe, Shield, HelpCircle, LogOut, 
  7 |   ChevronRight, Moon, Sun
  8 | } from 'lucide-react';
  9 | import { Button } from '@/app/components/ui/button';
 10 | import { Switch } from '@/app/components/ui/switch';
 11 | import { useAuth } from '@/app/context/AuthContext';
 12 | 
 13 | // Define a more specific type for settings items
 14 | type SettingItem = {
 15 |   icon: React.ElementType;
 16 |   label: string;
 17 |   onClick?: () => void;
 18 |   value?: string | boolean;
 19 |   toggle?: boolean;
 20 |   onChange?: (checked: boolean) => void;
 21 | };
 22 | 
 23 | export const ProfileSettings: React.FC = () => {
 24 |   const router = useRouter();
 25 |   const { user, profile, logout } = useAuth();
 26 |   const [darkMode, setDarkMode] = useState(false);
 27 |   const [notifications, setNotifications] = useState(true);
 28 |   
 29 |   // Use the defined type
 30 |   const settingGroups: { title: string; items: SettingItem[] }[] = [
 31 |     {
 32 |       title: 'Account',
 33 |       items: [
 34 |         {
 35 |           icon: User, 
 36 |           label: 'Personal Information',
 37 |           onClick: () => { console.log("Navigate to personal info"); /* TODO: router.push('/profile/info') */ },
 38 |         },
 39 |         {
 40 |           icon: Wallet, 
 41 |           label: 'Connected Wallet',
 42 |           value: profile?.walletAddress ? `${profile.walletAddress.substring(0, 6)}...${profile.walletAddress.substring(profile.walletAddress.length - 4)}` : 'Not Connected',
 43 |           onClick: () => router.push('/connect-wallet'),
 44 |         },
 45 |       ]
 46 |     },
 47 |     {
 48 |       title: 'Preferences',
 49 |       items: [
 50 |         {
 51 |           icon: Bell, 
 52 |           label: 'Notifications',
 53 |           toggle: true,
 54 |           value: notifications,
 55 |           onChange: (checked) => setNotifications(checked),
 56 |         },
 57 |         {
 58 |           icon: Globe, 
 59 |           label: 'Language',
 60 |           value: 'English',
 61 |           onClick: () => { console.log("Change language"); /* TODO: Implement language change */ },
 62 |         },
 63 |         {
 64 |           icon: darkMode ? Moon : Sun, 
 65 |           label: 'Dark Mode',
 66 |           toggle: true,
 67 |           value: darkMode,
 68 |           onChange: (checked) => setDarkMode(checked),
 69 |         },
 70 |       ]
 71 |     },
 72 |     {
 73 |       title: 'Support',
 74 |       items: [
 75 |         {
 76 |           icon: Shield, 
 77 |           label: 'Privacy & Security',
 78 |           onClick: () => { console.log("Navigate to privacy"); /* TODO: router.push('/privacy') */ },
 79 |         },
 80 |         {
 81 |           icon: HelpCircle, 
 82 |           label: 'Help & Support',
 83 |           onClick: () => { console.log("Navigate to support"); /* TODO: router.push('/support') */ },
 84 |         },
 85 |       ]
 86 |     },
 87 |   ];
 88 | 
 89 |   const handleLogout = async () => {
 90 |     if (logout) {
 91 |       try {
 92 |         await logout();
 93 |         // Assuming logout in useAuth handles clearing state and potentially redirecting
 94 |         // If not, uncomment the line below:
 95 |         // router.push('/login'); 
 96 |       } catch (error) {
 97 |         console.error("Logout failed:", error);
 98 |         // TODO: Show error toast to user
 99 |       }
100 |     } else {
101 |       console.error("Logout function not available from useAuth");
102 |     }
103 |   };
104 | 
105 |   return (
106 |     <div className="flex flex-col pt-10 pb-20 px-6">
107 |       <div className="mb-8 animate-fade-in">
108 |         <h1 className="text-2xl font-bold">Profile</h1>
109 |       </div>
110 |       
111 |       <div className="glass-card p-6 mb-8 animate-fade-in">
112 |         <div className="flex items-center">
113 |           <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mr-4">
114 |             {/* Use profile username or user email initial */}
115 |             {profile?.username ? profile.username.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'S')}
116 |           </div>
117 |           <div>
118 |             {/* Display profile name/username or user email */}
119 |             <h2 className="text-xl font-semibold">{profile?.name || profile?.username || user?.email || 'Samachi Member'}</h2>
120 |           </div>
121 |         </div>
122 |       </div>
123 | 
124 |       {settingGroups.map((group, groupIndex) => (
125 |         <div key={groupIndex} className="mb-8 animate-fade-in">
126 |           <h2 className="text-lg font-semibold mb-3">{group.title}</h2>
127 |           
128 |           <div className="glass-card divide-y divide-gray-100/50 overflow-hidden">
129 |             {group.items.map((item, itemIndex) => (
130 |               <div 
131 |                 key={itemIndex} 
132 |                 className={`p-4 flex justify-between items-center ${
133 |                   !item.toggle && item.onClick ? 'cursor-pointer hover:bg-white/60' : '' // Adjust condition
134 |                 }`}
135 |                 onClick={!item.toggle && item.onClick ? item.onClick : undefined}
136 |               >
137 |                 <div className="flex items-center">
138 |                   <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
139 |                     <item.icon className="h-4 w-4 text-primary" />
140 |                   </div>
141 |                   <span className="font-medium">{item.label}</span>
142 |                 </div>
143 |                 
144 |                 <div className="flex items-center">
145 |                   {item.value && typeof item.value === 'string' && !item.toggle && (
146 |                     <span className="text-sm text-muted-foreground mr-2">{item.value}</span>
147 |                   )}
148 |                   
149 |                   {item.toggle && typeof item.onChange === 'function' ? (
150 |                     <Switch 
151 |                       checked={item.value as boolean} 
152 |                       onCheckedChange={item.onChange}
153 |                     />
154 |                   ) : (
155 |                     item.onClick && <ChevronRight className="h-5 w-5 text-muted-foreground" /> // Only show chevron if clickable
156 |                   )}
157 |                 </div>
158 |               </div>
159 |             ))}
160 |           </div>
161 |         </div>
162 |       ))}
163 |       
164 |       <Button 
165 |         onClick={handleLogout}
166 |         variant="destructive"
167 |         className="w-full bg-red-500/90 backdrop-blur-sm hover:bg-red-600/80 animate-fade-in"
168 |       >
169 |         <LogOut className="mr-2 h-4 w-4" /> Log Out
170 |       </Button>
171 |     </div>
172 |   );
173 | };
174 | 


--------------------------------------------------------------------------------
/app/components/ui/accordion.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | import * as AccordionPrimitive from "@radix-ui/react-accordion"
 3 | import { ChevronDown } from "lucide-react"
 4 | 
 5 | import { cn } from "@/lib/utils"
 6 | 
 7 | const Accordion = AccordionPrimitive.Root
 8 | 
 9 | const AccordionItem = React.forwardRef<
10 |   React.ElementRef<typeof AccordionPrimitive.Item>,
11 |   React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
12 | >(({ className, ...props }, ref) => (
13 |   <AccordionPrimitive.Item
14 |     ref={ref}
15 |     className={cn("border-b", className)}
16 |     {...props}
17 |   />
18 | ))
19 | AccordionItem.displayName = "AccordionItem"
20 | 
21 | const AccordionTrigger = React.forwardRef<
22 |   React.ElementRef<typeof AccordionPrimitive.Trigger>,
23 |   React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
24 | >(({ className, children, ...props }, ref) => (
25 |   <AccordionPrimitive.Header className="flex">
26 |     <AccordionPrimitive.Trigger
27 |       ref={ref}
28 |       className={cn(
29 |         "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
30 |         className
31 |       )}
32 |       {...props}
33 |     >
34 |       {children}
35 |       <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
36 |     </AccordionPrimitive.Trigger>
37 |   </AccordionPrimitive.Header>
38 | ))
39 | AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName
40 | 
41 | const AccordionContent = React.forwardRef<
42 |   React.ElementRef<typeof AccordionPrimitive.Content>,
43 |   React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
44 | >(({ className, children, ...props }, ref) => (
45 |   <AccordionPrimitive.Content
46 |     ref={ref}
47 |     className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
48 |     {...props}
49 |   >
50 |     <div className={cn("pb-4 pt-0", className)}>{children}</div>
51 |   </AccordionPrimitive.Content>
52 | ))
53 | 
54 | AccordionContent.displayName = AccordionPrimitive.Content.displayName
55 | 
56 | export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
57 | 


--------------------------------------------------------------------------------
/app/components/ui/alert-dialog.tsx:
--------------------------------------------------------------------------------
  1 | import * as React from "react"
  2 | import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
  3 | 
  4 | import { cn } from "@/lib/utils"
  5 | import { buttonVariants } from "@/app/components/ui/button"
  6 | 
  7 | const AlertDialog = AlertDialogPrimitive.Root
  8 | 
  9 | const AlertDialogTrigger = AlertDialogPrimitive.Trigger
 10 | 
 11 | const AlertDialogPortal = AlertDialogPrimitive.Portal
 12 | 
 13 | const AlertDialogOverlay = React.forwardRef<
 14 |   React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
 15 |   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
 16 | >(({ className, ...props }, ref) => (
 17 |   <AlertDialogPrimitive.Overlay
 18 |     className={cn(
 19 |       "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
 20 |       className
 21 |     )}
 22 |     {...props}
 23 |     ref={ref}
 24 |   />
 25 | ))
 26 | AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName
 27 | 
 28 | const AlertDialogContent = React.forwardRef<
 29 |   React.ElementRef<typeof AlertDialogPrimitive.Content>,
 30 |   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
 31 | >(({ className, ...props }, ref) => (
 32 |   <AlertDialogPortal>
 33 |     <AlertDialogOverlay />
 34 |     <AlertDialogPrimitive.Content
 35 |       ref={ref}
 36 |       className={cn(
 37 |         "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
 38 |         className
 39 |       )}
 40 |       {...props}
 41 |     />
 42 |   </AlertDialogPortal>
 43 | ))
 44 | AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName
 45 | 
 46 | const AlertDialogHeader = ({
 47 |   className,
 48 |   ...props
 49 | }: React.HTMLAttributes<HTMLDivElement>) => (
 50 |   <div
 51 |     className={cn(
 52 |       "flex flex-col space-y-2 text-center sm:text-left",
 53 |       className
 54 |     )}
 55 |     {...props}
 56 |   />
 57 | )
 58 | AlertDialogHeader.displayName = "AlertDialogHeader"
 59 | 
 60 | const AlertDialogFooter = ({
 61 |   className,
 62 |   ...props
 63 | }: React.HTMLAttributes<HTMLDivElement>) => (
 64 |   <div
 65 |     className={cn(
 66 |       "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
 67 |       className
 68 |     )}
 69 |     {...props}
 70 |   />
 71 | )
 72 | AlertDialogFooter.displayName = "AlertDialogFooter"
 73 | 
 74 | const AlertDialogTitle = React.forwardRef<
 75 |   React.ElementRef<typeof AlertDialogPrimitive.Title>,
 76 |   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
 77 | >(({ className, ...props }, ref) => (
 78 |   <AlertDialogPrimitive.Title
 79 |     ref={ref}
 80 |     className={cn("text-lg font-semibold", className)}
 81 |     {...props}
 82 |   />
 83 | ))
 84 | AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName
 85 | 
 86 | const AlertDialogDescription = React.forwardRef<
 87 |   React.ElementRef<typeof AlertDialogPrimitive.Description>,
 88 |   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
 89 | >(({ className, ...props }, ref) => (
 90 |   <AlertDialogPrimitive.Description
 91 |     ref={ref}
 92 |     className={cn("text-sm text-muted-foreground", className)}
 93 |     {...props}
 94 |   />
 95 | ))
 96 | AlertDialogDescription.displayName =
 97 |   AlertDialogPrimitive.Description.displayName
 98 | 
 99 | const AlertDialogAction = React.forwardRef<
100 |   React.ElementRef<typeof AlertDialogPrimitive.Action>,
101 |   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
102 | >(({ className, ...props }, ref) => (
103 |   <AlertDialogPrimitive.Action
104 |     ref={ref}
105 |     className={cn(buttonVariants(), className)}
106 |     {...props}
107 |   />
108 | ))
109 | AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName
110 | 
111 | const AlertDialogCancel = React.forwardRef<
112 |   React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
113 |   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
114 | >(({ className, ...props }, ref) => (
115 |   <AlertDialogPrimitive.Cancel
116 |     ref={ref}
117 |     className={cn(
118 |       buttonVariants({ variant: "outline" }),
119 |       "mt-2 sm:mt-0",
120 |       className
121 |     )}
122 |     {...props}
123 |   />
124 | ))
125 | AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName
126 | 
127 | export {
128 |   AlertDialog,
129 |   AlertDialogPortal,
130 |   AlertDialogOverlay,
131 |   AlertDialogTrigger,
132 |   AlertDialogContent,
133 |   AlertDialogHeader,
134 |   AlertDialogFooter,
135 |   AlertDialogTitle,
136 |   AlertDialogDescription,
137 |   AlertDialogAction,
138 |   AlertDialogCancel,
139 | }
140 | 


--------------------------------------------------------------------------------
/app/components/ui/alert.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | import { cva, type VariantProps } from "class-variance-authority"
 3 | 
 4 | import { cn } from "@/lib/utils"
 5 | 
 6 | const alertVariants = cva(
 7 |   "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
 8 |   {
 9 |     variants: {
10 |       variant: {
11 |         default: "bg-background text-foreground",
12 |         destructive:
13 |           "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
14 |       },
15 |     },
16 |     defaultVariants: {
17 |       variant: "default",
18 |     },
19 |   }
20 | )
21 | 
22 | const Alert = React.forwardRef<
23 |   HTMLDivElement,
24 |   React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
25 | >(({ className, variant, ...props }, ref) => (
26 |   <div
27 |     ref={ref}
28 |     role="alert"
29 |     className={cn(alertVariants({ variant }), className)}
30 |     {...props}
31 |   />
32 | ))
33 | Alert.displayName = "Alert"
34 | 
35 | const AlertTitle = React.forwardRef<
36 |   HTMLParagraphElement,
37 |   React.HTMLAttributes<HTMLHeadingElement>
38 | >(({ className, ...props }, ref) => (
39 |   <h5
40 |     ref={ref}
41 |     className={cn("mb-1 font-medium leading-none tracking-tight", className)}
42 |     {...props}
43 |   />
44 | ))
45 | AlertTitle.displayName = "AlertTitle"
46 | 
47 | const AlertDescription = React.forwardRef<
48 |   HTMLParagraphElement,
49 |   React.HTMLAttributes<HTMLParagraphElement>
50 | >(({ className, ...props }, ref) => (
51 |   <div
52 |     ref={ref}
53 |     className={cn("text-sm [&_p]:leading-relaxed", className)}
54 |     {...props}
55 |   />
56 | ))
57 | AlertDescription.displayName = "AlertDescription"
58 | 
59 | export { Alert, AlertTitle, AlertDescription }
60 | 


--------------------------------------------------------------------------------
/app/components/ui/aspect-ratio.tsx:
--------------------------------------------------------------------------------
1 | import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"
2 | 
3 | const AspectRatio = AspectRatioPrimitive.Root
4 | 
5 | export { AspectRatio }
6 | 


--------------------------------------------------------------------------------
/app/components/ui/avatar.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | import * as AvatarPrimitive from "@radix-ui/react-avatar"
 3 | 
 4 | import { cn } from "@/lib/utils"
 5 | 
 6 | const Avatar = React.forwardRef<
 7 |   React.ElementRef<typeof AvatarPrimitive.Root>,
 8 |   React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
 9 | >(({ className, ...props }, ref) => (
10 |   <AvatarPrimitive.Root
11 |     ref={ref}
12 |     className={cn(
13 |       "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
14 |       className
15 |     )}
16 |     {...props}
17 |   />
18 | ))
19 | Avatar.displayName = AvatarPrimitive.Root.displayName
20 | 
21 | const AvatarImage = React.forwardRef<
22 |   React.ElementRef<typeof AvatarPrimitive.Image>,
23 |   React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
24 | >(({ className, ...props }, ref) => (
25 |   <AvatarPrimitive.Image
26 |     ref={ref}
27 |     className={cn("aspect-square h-full w-full", className)}
28 |     {...props}
29 |   />
30 | ))
31 | AvatarImage.displayName = AvatarPrimitive.Image.displayName
32 | 
33 | const AvatarFallback = React.forwardRef<
34 |   React.ElementRef<typeof AvatarPrimitive.Fallback>,
35 |   React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
36 | >(({ className, ...props }, ref) => (
37 |   <AvatarPrimitive.Fallback
38 |     ref={ref}
39 |     className={cn(
40 |       "flex h-full w-full items-center justify-center rounded-full bg-muted",
41 |       className
42 |     )}
43 |     {...props}
44 |   />
45 | ))
46 | AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName
47 | 
48 | export { Avatar, AvatarImage, AvatarFallback }
49 | 


--------------------------------------------------------------------------------
/app/components/ui/badge.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | import { cva, type VariantProps } from "class-variance-authority"
 3 | 
 4 | import { cn } from "@/lib/utils"
 5 | 
 6 | const badgeVariants = cva(
 7 |   "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
 8 |   {
 9 |     variants: {
10 |       variant: {
11 |         default:
12 |           "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
13 |         secondary:
14 |           "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
15 |         destructive:
16 |           "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
17 |         outline: "text-foreground",
18 |       },
19 |     },
20 |     defaultVariants: {
21 |       variant: "default",
22 |     },
23 |   }
24 | )
25 | 
26 | export interface BadgeProps
27 |   extends React.HTMLAttributes<HTMLDivElement>,
28 |     VariantProps<typeof badgeVariants> {}
29 | 
30 | function Badge({ className, variant, ...props }: BadgeProps) {
31 |   return (
32 |     <div className={cn(badgeVariants({ variant }), className)} {...props} />
33 |   )
34 | }
35 | 
36 | export { Badge, badgeVariants }
37 | 


--------------------------------------------------------------------------------
/app/components/ui/breadcrumb.tsx:
--------------------------------------------------------------------------------
  1 | import * as React from "react"
  2 | import { Slot } from "@radix-ui/react-slot"
  3 | import { ChevronRight, MoreHorizontal } from "lucide-react"
  4 | 
  5 | import { cn } from "@/lib/utils"
  6 | 
  7 | const Breadcrumb = React.forwardRef<
  8 |   HTMLElement,
  9 |   React.ComponentPropsWithoutRef<"nav"> & {
 10 |     separator?: React.ReactNode
 11 |   }
 12 | >(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />)
 13 | Breadcrumb.displayName = "Breadcrumb"
 14 | 
 15 | const BreadcrumbList = React.forwardRef<
 16 |   HTMLOListElement,
 17 |   React.ComponentPropsWithoutRef<"ol">
 18 | >(({ className, ...props }, ref) => (
 19 |   <ol
 20 |     ref={ref}
 21 |     className={cn(
 22 |       "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
 23 |       className
 24 |     )}
 25 |     {...props}
 26 |   />
 27 | ))
 28 | BreadcrumbList.displayName = "BreadcrumbList"
 29 | 
 30 | const BreadcrumbItem = React.forwardRef<
 31 |   HTMLLIElement,
 32 |   React.ComponentPropsWithoutRef<"li">
 33 | >(({ className, ...props }, ref) => (
 34 |   <li
 35 |     ref={ref}
 36 |     className={cn("inline-flex items-center gap-1.5", className)}
 37 |     {...props}
 38 |   />
 39 | ))
 40 | BreadcrumbItem.displayName = "BreadcrumbItem"
 41 | 
 42 | const BreadcrumbLink = React.forwardRef<
 43 |   HTMLAnchorElement,
 44 |   React.ComponentPropsWithoutRef<"a"> & {
 45 |     asChild?: boolean
 46 |   }
 47 | >(({ asChild, className, ...props }, ref) => {
 48 |   const Comp = asChild ? Slot : "a"
 49 | 
 50 |   return (
 51 |     <Comp
 52 |       ref={ref}
 53 |       className={cn("transition-colors hover:text-foreground", className)}
 54 |       {...props}
 55 |     />
 56 |   )
 57 | })
 58 | BreadcrumbLink.displayName = "BreadcrumbLink"
 59 | 
 60 | const BreadcrumbPage = React.forwardRef<
 61 |   HTMLSpanElement,
 62 |   React.ComponentPropsWithoutRef<"span">
 63 | >(({ className, ...props }, ref) => (
 64 |   <span
 65 |     ref={ref}
 66 |     role="link"
 67 |     aria-disabled="true"
 68 |     aria-current="page"
 69 |     className={cn("font-normal text-foreground", className)}
 70 |     {...props}
 71 |   />
 72 | ))
 73 | BreadcrumbPage.displayName = "BreadcrumbPage"
 74 | 
 75 | const BreadcrumbSeparator = ({
 76 |   children,
 77 |   className,
 78 |   ...props
 79 | }: React.ComponentProps<"li">) => (
 80 |   <li
 81 |     role="presentation"
 82 |     aria-hidden="true"
 83 |     className={cn("[&>svg]:size-3.5", className)}
 84 |     {...props}
 85 |   >
 86 |     {children ?? <ChevronRight />}
 87 |   </li>
 88 | )
 89 | BreadcrumbSeparator.displayName = "BreadcrumbSeparator"
 90 | 
 91 | const BreadcrumbEllipsis = ({
 92 |   className,
 93 |   ...props
 94 | }: React.ComponentProps<"span">) => (
 95 |   <span
 96 |     role="presentation"
 97 |     aria-hidden="true"
 98 |     className={cn("flex h-9 w-9 items-center justify-center", className)}
 99 |     {...props}
100 |   >
101 |     <MoreHorizontal className="h-4 w-4" />
102 |     <span className="sr-only">More</span>
103 |   </span>
104 | )
105 | BreadcrumbEllipsis.displayName = "BreadcrumbElipssis"
106 | 
107 | export {
108 |   Breadcrumb,
109 |   BreadcrumbList,
110 |   BreadcrumbItem,
111 |   BreadcrumbLink,
112 |   BreadcrumbPage,
113 |   BreadcrumbSeparator,
114 |   BreadcrumbEllipsis,
115 | }
116 | 


--------------------------------------------------------------------------------
/app/components/ui/button.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | import { Slot } from "@radix-ui/react-slot"
 3 | import { cva, type VariantProps } from "class-variance-authority"
 4 | 
 5 | import { cn } from "@/lib/utils"
 6 | 
 7 | const buttonVariants = cva(
 8 |   "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
 9 |   {
10 |     variants: {
11 |       variant: {
12 |         default: "bg-primary text-primary-foreground hover:bg-primary/90",
13 |         destructive:
14 |           "bg-destructive text-destructive-foreground hover:bg-destructive/90",
15 |         outline:
16 |           "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
17 |         secondary:
18 |           "bg-secondary text-secondary-foreground hover:bg-secondary/80",
19 |         ghost: "hover:bg-accent hover:text-accent-foreground",
20 |         link: "text-primary underline-offset-4 hover:underline",
21 |       },
22 |       size: {
23 |         default: "h-10 px-4 py-2",
24 |         sm: "h-9 rounded-md px-3",
25 |         lg: "h-11 rounded-md px-8",
26 |         icon: "h-10 w-10",
27 |       },
28 |     },
29 |     defaultVariants: {
30 |       variant: "default",
31 |       size: "default",
32 |     },
33 |   }
34 | )
35 | 
36 | export interface ButtonProps
37 |   extends React.ButtonHTMLAttributes<HTMLButtonElement>,
38 |     VariantProps<typeof buttonVariants> {
39 |   asChild?: boolean
40 | }
41 | 
42 | const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
43 |   ({ className, variant, size, asChild = false, ...props }, ref) => {
44 |     const Comp = asChild ? Slot : "button"
45 |     return (
46 |       <Comp
47 |         className={cn(buttonVariants({ variant, size, className }))}
48 |         ref={ref}
49 |         {...props}
50 |       />
51 |     )
52 |   }
53 | )
54 | Button.displayName = "Button"
55 | 
56 | export { Button, buttonVariants }
57 | 


--------------------------------------------------------------------------------
/app/components/ui/calendar.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react";
 2 | import { ChevronLeft, ChevronRight } from "lucide-react";
 3 | import { DayPicker } from "react-day-picker";
 4 | 
 5 | import { cn } from "@/lib/utils";
 6 | import { buttonVariants } from "@/components/ui/button";
 7 | 
 8 | export type CalendarProps = React.ComponentProps<typeof DayPicker>;
 9 | 
10 | function Calendar({
11 |   className,
12 |   classNames,
13 |   showOutsideDays = true,
14 |   ...props
15 | }: CalendarProps) {
16 |   return (
17 |     <DayPicker
18 |       showOutsideDays={showOutsideDays}
19 |       className={cn("p-3", className)}
20 |       classNames={{
21 |         months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
22 |         month: "space-y-4",
23 |         caption: "flex justify-center pt-1 relative items-center",
24 |         caption_label: "text-sm font-medium",
25 |         nav: "space-x-1 flex items-center",
26 |         nav_button: cn(
27 |           buttonVariants({ variant: "outline" }),
28 |           "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
29 |         ),
30 |         nav_button_previous: "absolute left-1",
31 |         nav_button_next: "absolute right-1",
32 |         table: "w-full border-collapse space-y-1",
33 |         head_row: "flex",
34 |         head_cell:
35 |           "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
36 |         row: "flex w-full mt-2",
37 |         cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
38 |         day: cn(
39 |           buttonVariants({ variant: "ghost" }),
40 |           "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
41 |         ),
42 |         day_range_end: "day-range-end",
43 |         day_selected:
44 |           "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
45 |         day_today: "bg-accent text-accent-foreground",
46 |         day_outside:
47 |           "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
48 |         day_disabled: "text-muted-foreground opacity-50",
49 |         day_range_middle:
50 |           "aria-selected:bg-accent aria-selected:text-accent-foreground",
51 |         day_hidden: "invisible",
52 |         ...classNames,
53 |       }}
54 |       components={{
55 |         IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
56 |         IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
57 |       }}
58 |       {...props}
59 |     />
60 |   );
61 | }
62 | Calendar.displayName = "Calendar";
63 | 
64 | export { Calendar };
65 | 


--------------------------------------------------------------------------------
/app/components/ui/card.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | 
 3 | import { cn } from "@/lib/utils"
 4 | 
 5 | const Card = React.forwardRef<
 6 |   HTMLDivElement,
 7 |   React.HTMLAttributes<HTMLDivElement>
 8 | >(({ className, ...props }, ref) => (
 9 |   <div
10 |     ref={ref}
11 |     className={cn(
12 |       "rounded-lg border bg-card text-card-foreground shadow-sm",
13 |       className
14 |     )}
15 |     {...props}
16 |   />
17 | ))
18 | Card.displayName = "Card"
19 | 
20 | const CardHeader = React.forwardRef<
21 |   HTMLDivElement,
22 |   React.HTMLAttributes<HTMLDivElement>
23 | >(({ className, ...props }, ref) => (
24 |   <div
25 |     ref={ref}
26 |     className={cn("flex flex-col space-y-1.5 p-6", className)}
27 |     {...props}
28 |   />
29 | ))
30 | CardHeader.displayName = "CardHeader"
31 | 
32 | const CardTitle = React.forwardRef<
33 |   HTMLParagraphElement,
34 |   React.HTMLAttributes<HTMLHeadingElement>
35 | >(({ className, ...props }, ref) => (
36 |   <h3
37 |     ref={ref}
38 |     className={cn(
39 |       "text-2xl font-semibold leading-none tracking-tight",
40 |       className
41 |     )}
42 |     {...props}
43 |   />
44 | ))
45 | CardTitle.displayName = "CardTitle"
46 | 
47 | const CardDescription = React.forwardRef<
48 |   HTMLParagraphElement,
49 |   React.HTMLAttributes<HTMLParagraphElement>
50 | >(({ className, ...props }, ref) => (
51 |   <p
52 |     ref={ref}
53 |     className={cn("text-sm text-muted-foreground", className)}
54 |     {...props}
55 |   />
56 | ))
57 | CardDescription.displayName = "CardDescription"
58 | 
59 | const CardContent = React.forwardRef<
60 |   HTMLDivElement,
61 |   React.HTMLAttributes<HTMLDivElement>
62 | >(({ className, ...props }, ref) => (
63 |   <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
64 | ))
65 | CardContent.displayName = "CardContent"
66 | 
67 | const CardFooter = React.forwardRef<
68 |   HTMLDivElement,
69 |   React.HTMLAttributes<HTMLDivElement>
70 | >(({ className, ...props }, ref) => (
71 |   <div
72 |     ref={ref}
73 |     className={cn("flex items-center p-6 pt-0", className)}
74 |     {...props}
75 |   />
76 | ))
77 | CardFooter.displayName = "CardFooter"
78 | 
79 | export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
80 | 


--------------------------------------------------------------------------------
/app/components/ui/checkbox.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
 3 | import { Check } from "lucide-react"
 4 | 
 5 | import { cn } from "@/lib/utils"
 6 | 
 7 | const Checkbox = React.forwardRef<
 8 |   React.ElementRef<typeof CheckboxPrimitive.Root>,
 9 |   React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
10 | >(({ className, ...props }, ref) => (
11 |   <CheckboxPrimitive.Root
12 |     ref={ref}
13 |     className={cn(
14 |       "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
15 |       className
16 |     )}
17 |     {...props}
18 |   >
19 |     <CheckboxPrimitive.Indicator
20 |       className={cn("flex items-center justify-center text-current")}
21 |     >
22 |       <Check className="h-4 w-4" />
23 |     </CheckboxPrimitive.Indicator>
24 |   </CheckboxPrimitive.Root>
25 | ))
26 | Checkbox.displayName = CheckboxPrimitive.Root.displayName
27 | 
28 | export { Checkbox }
29 | 


--------------------------------------------------------------------------------
/app/components/ui/collapsible.tsx:
--------------------------------------------------------------------------------
 1 | import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
 2 | 
 3 | const Collapsible = CollapsiblePrimitive.Root
 4 | 
 5 | const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger
 6 | 
 7 | const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent
 8 | 
 9 | export { Collapsible, CollapsibleTrigger, CollapsibleContent }
10 | 


--------------------------------------------------------------------------------
/app/components/ui/command.tsx:
--------------------------------------------------------------------------------
  1 | import * as React from "react"
  2 | import { type DialogProps } from "@radix-ui/react-dialog"
  3 | import { Command as CommandPrimitive } from "cmdk"
  4 | import { Search } from "lucide-react"
  5 | 
  6 | import { cn } from "@/lib/utils"
  7 | import { Dialog, DialogContent } from "@/components/ui/dialog"
  8 | 
  9 | const Command = React.forwardRef<
 10 |   React.ElementRef<typeof CommandPrimitive>,
 11 |   React.ComponentPropsWithoutRef<typeof CommandPrimitive>
 12 | >(({ className, ...props }, ref) => (
 13 |   <CommandPrimitive
 14 |     ref={ref}
 15 |     className={cn(
 16 |       "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
 17 |       className
 18 |     )}
 19 |     {...props}
 20 |   />
 21 | ))
 22 | Command.displayName = CommandPrimitive.displayName
 23 | 
 24 | interface CommandDialogProps extends DialogProps {}
 25 | 
 26 | const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
 27 |   return (
 28 |     <Dialog {...props}>
 29 |       <DialogContent className="overflow-hidden p-0 shadow-lg">
 30 |         <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
 31 |           {children}
 32 |         </Command>
 33 |       </DialogContent>
 34 |     </Dialog>
 35 |   )
 36 | }
 37 | 
 38 | const CommandInput = React.forwardRef<
 39 |   React.ElementRef<typeof CommandPrimitive.Input>,
 40 |   React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
 41 | >(({ className, ...props }, ref) => (
 42 |   <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
 43 |     <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
 44 |     <CommandPrimitive.Input
 45 |       ref={ref}
 46 |       className={cn(
 47 |         "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
 48 |         className
 49 |       )}
 50 |       {...props}
 51 |     />
 52 |   </div>
 53 | ))
 54 | 
 55 | CommandInput.displayName = CommandPrimitive.Input.displayName
 56 | 
 57 | const CommandList = React.forwardRef<
 58 |   React.ElementRef<typeof CommandPrimitive.List>,
 59 |   React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
 60 | >(({ className, ...props }, ref) => (
 61 |   <CommandPrimitive.List
 62 |     ref={ref}
 63 |     className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
 64 |     {...props}
 65 |   />
 66 | ))
 67 | 
 68 | CommandList.displayName = CommandPrimitive.List.displayName
 69 | 
 70 | const CommandEmpty = React.forwardRef<
 71 |   React.ElementRef<typeof CommandPrimitive.Empty>,
 72 |   React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
 73 | >((props, ref) => (
 74 |   <CommandPrimitive.Empty
 75 |     ref={ref}
 76 |     className="py-6 text-center text-sm"
 77 |     {...props}
 78 |   />
 79 | ))
 80 | 
 81 | CommandEmpty.displayName = CommandPrimitive.Empty.displayName
 82 | 
 83 | const CommandGroup = React.forwardRef<
 84 |   React.ElementRef<typeof CommandPrimitive.Group>,
 85 |   React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
 86 | >(({ className, ...props }, ref) => (
 87 |   <CommandPrimitive.Group
 88 |     ref={ref}
 89 |     className={cn(
 90 |       "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
 91 |       className
 92 |     )}
 93 |     {...props}
 94 |   />
 95 | ))
 96 | 
 97 | CommandGroup.displayName = CommandPrimitive.Group.displayName
 98 | 
 99 | const CommandSeparator = React.forwardRef<
100 |   React.ElementRef<typeof CommandPrimitive.Separator>,
101 |   React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
102 | >(({ className, ...props }, ref) => (
103 |   <CommandPrimitive.Separator
104 |     ref={ref}
105 |     className={cn("-mx-1 h-px bg-border", className)}
106 |     {...props}
107 |   />
108 | ))
109 | CommandSeparator.displayName = CommandPrimitive.Separator.displayName
110 | 
111 | const CommandItem = React.forwardRef<
112 |   React.ElementRef<typeof CommandPrimitive.Item>,
113 |   React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
114 | >(({ className, ...props }, ref) => (
115 |   <CommandPrimitive.Item
116 |     ref={ref}
117 |     className={cn(
118 |       "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50",
119 |       className
120 |     )}
121 |     {...props}
122 |   />
123 | ))
124 | 
125 | CommandItem.displayName = CommandPrimitive.Item.displayName
126 | 
127 | const CommandShortcut = ({
128 |   className,
129 |   ...props
130 | }: React.HTMLAttributes<HTMLSpanElement>) => {
131 |   return (
132 |     <span
133 |       className={cn(
134 |         "ml-auto text-xs tracking-widest text-muted-foreground",
135 |         className
136 |       )}
137 |       {...props}
138 |     />
139 |   )
140 | }
141 | CommandShortcut.displayName = "CommandShortcut"
142 | 
143 | export {
144 |   Command,
145 |   CommandDialog,
146 |   CommandInput,
147 |   CommandList,
148 |   CommandEmpty,
149 |   CommandGroup,
150 |   CommandItem,
151 |   CommandShortcut,
152 |   CommandSeparator,
153 | }
154 | 


--------------------------------------------------------------------------------
/app/components/ui/dialog.tsx:
--------------------------------------------------------------------------------
  1 | import * as React from "react"
  2 | import * as DialogPrimitive from "@radix-ui/react-dialog"
  3 | import { X } from "lucide-react"
  4 | 
  5 | import { cn } from "@/lib/utils"
  6 | 
  7 | const Dialog = DialogPrimitive.Root
  8 | 
  9 | const DialogTrigger = DialogPrimitive.Trigger
 10 | 
 11 | const DialogPortal = DialogPrimitive.Portal
 12 | 
 13 | const DialogClose = DialogPrimitive.Close
 14 | 
 15 | const DialogOverlay = React.forwardRef<
 16 |   React.ElementRef<typeof DialogPrimitive.Overlay>,
 17 |   React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
 18 | >(({ className, ...props }, ref) => (
 19 |   <DialogPrimitive.Overlay
 20 |     ref={ref}
 21 |     className={cn(
 22 |       "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
 23 |       className
 24 |     )}
 25 |     {...props}
 26 |   />
 27 | ))
 28 | DialogOverlay.displayName = DialogPrimitive.Overlay.displayName
 29 | 
 30 | const DialogContent = React.forwardRef<
 31 |   React.ElementRef<typeof DialogPrimitive.Content>,
 32 |   React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
 33 | >(({ className, children, ...props }, ref) => (
 34 |   <DialogPortal>
 35 |     <DialogOverlay />
 36 |     <DialogPrimitive.Content
 37 |       ref={ref}
 38 |       className={cn(
 39 |         "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
 40 |         className
 41 |       )}
 42 |       {...props}
 43 |     >
 44 |       {children}
 45 |       <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
 46 |         <X className="h-4 w-4" />
 47 |         <span className="sr-only">Close</span>
 48 |       </DialogPrimitive.Close>
 49 |     </DialogPrimitive.Content>
 50 |   </DialogPortal>
 51 | ))
 52 | DialogContent.displayName = DialogPrimitive.Content.displayName
 53 | 
 54 | const DialogHeader = ({
 55 |   className,
 56 |   ...props
 57 | }: React.HTMLAttributes<HTMLDivElement>) => (
 58 |   <div
 59 |     className={cn(
 60 |       "flex flex-col space-y-1.5 text-center sm:text-left",
 61 |       className
 62 |     )}
 63 |     {...props}
 64 |   />
 65 | )
 66 | DialogHeader.displayName = "DialogHeader"
 67 | 
 68 | const DialogFooter = ({
 69 |   className,
 70 |   ...props
 71 | }: React.HTMLAttributes<HTMLDivElement>) => (
 72 |   <div
 73 |     className={cn(
 74 |       "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
 75 |       className
 76 |     )}
 77 |     {...props}
 78 |   />
 79 | )
 80 | DialogFooter.displayName = "DialogFooter"
 81 | 
 82 | const DialogTitle = React.forwardRef<
 83 |   React.ElementRef<typeof DialogPrimitive.Title>,
 84 |   React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
 85 | >(({ className, ...props }, ref) => (
 86 |   <DialogPrimitive.Title
 87 |     ref={ref}
 88 |     className={cn(
 89 |       "text-lg font-semibold leading-none tracking-tight",
 90 |       className
 91 |     )}
 92 |     {...props}
 93 |   />
 94 | ))
 95 | DialogTitle.displayName = DialogPrimitive.Title.displayName
 96 | 
 97 | const DialogDescription = React.forwardRef<
 98 |   React.ElementRef<typeof DialogPrimitive.Description>,
 99 |   React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
100 | >(({ className, ...props }, ref) => (
101 |   <DialogPrimitive.Description
102 |     ref={ref}
103 |     className={cn("text-sm text-muted-foreground", className)}
104 |     {...props}
105 |   />
106 | ))
107 | DialogDescription.displayName = DialogPrimitive.Description.displayName
108 | 
109 | export {
110 |   Dialog,
111 |   DialogPortal,
112 |   DialogOverlay,
113 |   DialogClose,
114 |   DialogTrigger,
115 |   DialogContent,
116 |   DialogHeader,
117 |   DialogFooter,
118 |   DialogTitle,
119 |   DialogDescription,
120 | }
121 | 


--------------------------------------------------------------------------------
/app/components/ui/drawer.tsx:
--------------------------------------------------------------------------------
  1 | import * as React from "react"
  2 | import { Drawer as DrawerPrimitive } from "vaul"
  3 | 
  4 | import { cn } from "@/lib/utils"
  5 | 
  6 | const Drawer = ({
  7 |   shouldScaleBackground = true,
  8 |   ...props
  9 | }: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
 10 |   <DrawerPrimitive.Root
 11 |     shouldScaleBackground={shouldScaleBackground}
 12 |     {...props}
 13 |   />
 14 | )
 15 | Drawer.displayName = "Drawer"
 16 | 
 17 | const DrawerTrigger = DrawerPrimitive.Trigger
 18 | 
 19 | const DrawerPortal = DrawerPrimitive.Portal
 20 | 
 21 | const DrawerClose = DrawerPrimitive.Close
 22 | 
 23 | const DrawerOverlay = React.forwardRef<
 24 |   React.ElementRef<typeof DrawerPrimitive.Overlay>,
 25 |   React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
 26 | >(({ className, ...props }, ref) => (
 27 |   <DrawerPrimitive.Overlay
 28 |     ref={ref}
 29 |     className={cn("fixed inset-0 z-50 bg-black/80", className)}
 30 |     {...props}
 31 |   />
 32 | ))
 33 | DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName
 34 | 
 35 | const DrawerContent = React.forwardRef<
 36 |   React.ElementRef<typeof DrawerPrimitive.Content>,
 37 |   React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
 38 | >(({ className, children, ...props }, ref) => (
 39 |   <DrawerPortal>
 40 |     <DrawerOverlay />
 41 |     <DrawerPrimitive.Content
 42 |       ref={ref}
 43 |       className={cn(
 44 |         "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
 45 |         className
 46 |       )}
 47 |       {...props}
 48 |     >
 49 |       <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
 50 |       {children}
 51 |     </DrawerPrimitive.Content>
 52 |   </DrawerPortal>
 53 | ))
 54 | DrawerContent.displayName = "DrawerContent"
 55 | 
 56 | const DrawerHeader = ({
 57 |   className,
 58 |   ...props
 59 | }: React.HTMLAttributes<HTMLDivElement>) => (
 60 |   <div
 61 |     className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
 62 |     {...props}
 63 |   />
 64 | )
 65 | DrawerHeader.displayName = "DrawerHeader"
 66 | 
 67 | const DrawerFooter = ({
 68 |   className,
 69 |   ...props
 70 | }: React.HTMLAttributes<HTMLDivElement>) => (
 71 |   <div
 72 |     className={cn("mt-auto flex flex-col gap-2 p-4", className)}
 73 |     {...props}
 74 |   />
 75 | )
 76 | DrawerFooter.displayName = "DrawerFooter"
 77 | 
 78 | const DrawerTitle = React.forwardRef<
 79 |   React.ElementRef<typeof DrawerPrimitive.Title>,
 80 |   React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
 81 | >(({ className, ...props }, ref) => (
 82 |   <DrawerPrimitive.Title
 83 |     ref={ref}
 84 |     className={cn(
 85 |       "text-lg font-semibold leading-none tracking-tight",
 86 |       className
 87 |     )}
 88 |     {...props}
 89 |   />
 90 | ))
 91 | DrawerTitle.displayName = DrawerPrimitive.Title.displayName
 92 | 
 93 | const DrawerDescription = React.forwardRef<
 94 |   React.ElementRef<typeof DrawerPrimitive.Description>,
 95 |   React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
 96 | >(({ className, ...props }, ref) => (
 97 |   <DrawerPrimitive.Description
 98 |     ref={ref}
 99 |     className={cn("text-sm text-muted-foreground", className)}
100 |     {...props}
101 |   />
102 | ))
103 | DrawerDescription.displayName = DrawerPrimitive.Description.displayName
104 | 
105 | export {
106 |   Drawer,
107 |   DrawerPortal,
108 |   DrawerOverlay,
109 |   DrawerTrigger,
110 |   DrawerClose,
111 |   DrawerContent,
112 |   DrawerHeader,
113 |   DrawerFooter,
114 |   DrawerTitle,
115 |   DrawerDescription,
116 | }
117 | 


--------------------------------------------------------------------------------
/app/components/ui/form.tsx:
--------------------------------------------------------------------------------
  1 | import * as React from "react"
  2 | import * as LabelPrimitive from "@radix-ui/react-label"
  3 | import { Slot } from "@radix-ui/react-slot"
  4 | import {
  5 |   Controller,
  6 |   ControllerProps,
  7 |   FieldPath,
  8 |   FieldValues,
  9 |   FormProvider,
 10 |   useFormContext,
 11 | } from "react-hook-form"
 12 | 
 13 | import { cn } from "@/lib/utils"
 14 | import { Label } from "@/app/components/ui/label"
 15 | 
 16 | const Form = FormProvider
 17 | 
 18 | type FormFieldContextValue<
 19 |   TFieldValues extends FieldValues = FieldValues,
 20 |   TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
 21 | > = {
 22 |   name: TName
 23 | }
 24 | 
 25 | const FormFieldContext = React.createContext<FormFieldContextValue>(
 26 |   {} as FormFieldContextValue
 27 | )
 28 | 
 29 | const FormField = <
 30 |   TFieldValues extends FieldValues = FieldValues,
 31 |   TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
 32 | >({
 33 |   ...props
 34 | }: ControllerProps<TFieldValues, TName>) => {
 35 |   return (
 36 |     <FormFieldContext.Provider value={{ name: props.name }}>
 37 |       <Controller {...props} />
 38 |     </FormFieldContext.Provider>
 39 |   )
 40 | }
 41 | 
 42 | const useFormField = () => {
 43 |   const fieldContext = React.useContext(FormFieldContext)
 44 |   const itemContext = React.useContext(FormItemContext)
 45 |   const { getFieldState, formState } = useFormContext()
 46 | 
 47 |   const fieldState = getFieldState(fieldContext.name, formState)
 48 | 
 49 |   if (!fieldContext) {
 50 |     throw new Error("useFormField should be used within <FormField>")
 51 |   }
 52 | 
 53 |   const { id } = itemContext
 54 | 
 55 |   return {
 56 |     id,
 57 |     name: fieldContext.name,
 58 |     formItemId: `${id}-form-item`,
 59 |     formDescriptionId: `${id}-form-item-description`,
 60 |     formMessageId: `${id}-form-item-message`,
 61 |     ...fieldState,
 62 |   }
 63 | }
 64 | 
 65 | type FormItemContextValue = {
 66 |   id: string
 67 | }
 68 | 
 69 | const FormItemContext = React.createContext<FormItemContextValue>(
 70 |   {} as FormItemContextValue
 71 | )
 72 | 
 73 | const FormItem = React.forwardRef<
 74 |   HTMLDivElement,
 75 |   React.HTMLAttributes<HTMLDivElement>
 76 | >(({ className, ...props }, ref) => {
 77 |   const id = React.useId()
 78 | 
 79 |   return (
 80 |     <FormItemContext.Provider value={{ id }}>
 81 |       <div ref={ref} className={cn("space-y-2", className)} {...props} />
 82 |     </FormItemContext.Provider>
 83 |   )
 84 | })
 85 | FormItem.displayName = "FormItem"
 86 | 
 87 | const FormLabel = React.forwardRef<
 88 |   React.ElementRef<typeof LabelPrimitive.Root>,
 89 |   React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
 90 | >(({ className, ...props }, ref) => {
 91 |   const { error, formItemId } = useFormField()
 92 | 
 93 |   return (
 94 |     <Label
 95 |       ref={ref}
 96 |       className={cn(error && "text-destructive", className)}
 97 |       htmlFor={formItemId}
 98 |       {...props}
 99 |     />
100 |   )
101 | })
102 | FormLabel.displayName = "FormLabel"
103 | 
104 | const FormControl = React.forwardRef<
105 |   React.ElementRef<typeof Slot>,
106 |   React.ComponentPropsWithoutRef<typeof Slot>
107 | >(({ ...props }, ref) => {
108 |   const { error, formItemId, formDescriptionId, formMessageId } = useFormField()
109 | 
110 |   return (
111 |     <Slot
112 |       ref={ref}
113 |       id={formItemId}
114 |       aria-describedby={
115 |         !error
116 |           ? `${formDescriptionId}`
117 |           : `${formDescriptionId} ${formMessageId}`
118 |       }
119 |       aria-invalid={!!error}
120 |       {...props}
121 |     />
122 |   )
123 | })
124 | FormControl.displayName = "FormControl"
125 | 
126 | const FormDescription = React.forwardRef<
127 |   HTMLParagraphElement,
128 |   React.HTMLAttributes<HTMLParagraphElement>
129 | >(({ className, ...props }, ref) => {
130 |   const { formDescriptionId } = useFormField()
131 | 
132 |   return (
133 |     <p
134 |       ref={ref}
135 |       id={formDescriptionId}
136 |       className={cn("text-sm text-muted-foreground", className)}
137 |       {...props}
138 |     />
139 |   )
140 | })
141 | FormDescription.displayName = "FormDescription"
142 | 
143 | const FormMessage = React.forwardRef<
144 |   HTMLParagraphElement,
145 |   React.HTMLAttributes<HTMLParagraphElement>
146 | >(({ className, children, ...props }, ref) => {
147 |   const { error, formMessageId } = useFormField()
148 |   const body = error ? String(error?.message) : children
149 | 
150 |   if (!body) {
151 |     return null
152 |   }
153 | 
154 |   return (
155 |     <p
156 |       ref={ref}
157 |       id={formMessageId}
158 |       className={cn("text-sm font-medium text-destructive", className)}
159 |       {...props}
160 |     >
161 |       {body}
162 |     </p>
163 |   )
164 | })
165 | FormMessage.displayName = "FormMessage"
166 | 
167 | export {
168 |   useFormField,
169 |   Form,
170 |   FormItem,
171 |   FormLabel,
172 |   FormControl,
173 |   FormDescription,
174 |   FormMessage,
175 |   FormField,
176 | }
177 | 


--------------------------------------------------------------------------------
/app/components/ui/hover-card.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | import * as HoverCardPrimitive from "@radix-ui/react-hover-card"
 3 | 
 4 | import { cn } from "@/lib/utils"
 5 | 
 6 | const HoverCard = HoverCardPrimitive.Root
 7 | 
 8 | const HoverCardTrigger = HoverCardPrimitive.Trigger
 9 | 
10 | const HoverCardContent = React.forwardRef<
11 |   React.ElementRef<typeof HoverCardPrimitive.Content>,
12 |   React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
13 | >(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
14 |   <HoverCardPrimitive.Content
15 |     ref={ref}
16 |     align={align}
17 |     sideOffset={sideOffset}
18 |     className={cn(
19 |       "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
20 |       className
21 |     )}
22 |     {...props}
23 |   />
24 | ))
25 | HoverCardContent.displayName = HoverCardPrimitive.Content.displayName
26 | 
27 | export { HoverCard, HoverCardTrigger, HoverCardContent }
28 | 


--------------------------------------------------------------------------------
/app/components/ui/input-otp.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | import { OTPInput, OTPInputContext } from "input-otp"
 3 | import { Dot } from "lucide-react"
 4 | 
 5 | import { cn } from "@/lib/utils"
 6 | 
 7 | const InputOTP = React.forwardRef<
 8 |   React.ElementRef<typeof OTPInput>,
 9 |   React.ComponentPropsWithoutRef<typeof OTPInput>
10 | >(({ className, containerClassName, ...props }, ref) => (
11 |   <OTPInput
12 |     ref={ref}
13 |     containerClassName={cn(
14 |       "flex items-center gap-2 has-[:disabled]:opacity-50",
15 |       containerClassName
16 |     )}
17 |     className={cn("disabled:cursor-not-allowed", className)}
18 |     {...props}
19 |   />
20 | ))
21 | InputOTP.displayName = "InputOTP"
22 | 
23 | const InputOTPGroup = React.forwardRef<
24 |   React.ElementRef<"div">,
25 |   React.ComponentPropsWithoutRef<"div">
26 | >(({ className, ...props }, ref) => (
27 |   <div ref={ref} className={cn("flex items-center", className)} {...props} />
28 | ))
29 | InputOTPGroup.displayName = "InputOTPGroup"
30 | 
31 | const InputOTPSlot = React.forwardRef<
32 |   React.ElementRef<"div">,
33 |   React.ComponentPropsWithoutRef<"div"> & { index: number }
34 | >(({ index, className, ...props }, ref) => {
35 |   const inputOTPContext = React.useContext(OTPInputContext)
36 |   const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]
37 | 
38 |   return (
39 |     <div
40 |       ref={ref}
41 |       className={cn(
42 |         "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
43 |         isActive && "z-10 ring-2 ring-ring ring-offset-background",
44 |         className
45 |       )}
46 |       {...props}
47 |     >
48 |       {char}
49 |       {hasFakeCaret && (
50 |         <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
51 |           <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
52 |         </div>
53 |       )}
54 |     </div>
55 |   )
56 | })
57 | InputOTPSlot.displayName = "InputOTPSlot"
58 | 
59 | const InputOTPSeparator = React.forwardRef<
60 |   React.ElementRef<"div">,
61 |   React.ComponentPropsWithoutRef<"div">
62 | >(({ ...props }, ref) => (
63 |   <div ref={ref} role="separator" {...props}>
64 |     <Dot />
65 |   </div>
66 | ))
67 | InputOTPSeparator.displayName = "InputOTPSeparator"
68 | 
69 | export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
70 | 


--------------------------------------------------------------------------------
/app/components/ui/input.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | 
 3 | import { cn } from "@/lib/utils"
 4 | 
 5 | const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
 6 |   ({ className, type, ...props }, ref) => {
 7 |     return (
 8 |       <input
 9 |         type={type}
10 |         className={cn(
11 |           "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
12 |           className
13 |         )}
14 |         ref={ref}
15 |         {...props}
16 |       />
17 |     )
18 |   }
19 | )
20 | Input.displayName = "Input"
21 | 
22 | export { Input }
23 | 


--------------------------------------------------------------------------------
/app/components/ui/label.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | import * as LabelPrimitive from "@radix-ui/react-label"
 3 | import { cva, type VariantProps } from "class-variance-authority"
 4 | 
 5 | import { cn } from "@/lib/utils"
 6 | 
 7 | const labelVariants = cva(
 8 |   "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
 9 | )
10 | 
11 | const Label = React.forwardRef<
12 |   React.ElementRef<typeof LabelPrimitive.Root>,
13 |   React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
14 |     VariantProps<typeof labelVariants>
15 | >(({ className, ...props }, ref) => (
16 |   <LabelPrimitive.Root
17 |     ref={ref}
18 |     className={cn(labelVariants(), className)}
19 |     {...props}
20 |   />
21 | ))
22 | Label.displayName = LabelPrimitive.Root.displayName
23 | 
24 | export { Label }
25 | 


--------------------------------------------------------------------------------
/app/components/ui/navigation-menu.tsx:
--------------------------------------------------------------------------------
  1 | import * as React from "react"
  2 | import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
  3 | import { cva } from "class-variance-authority"
  4 | import { ChevronDown } from "lucide-react"
  5 | 
  6 | import { cn } from "@/lib/utils"
  7 | 
  8 | const NavigationMenu = React.forwardRef<
  9 |   React.ElementRef<typeof NavigationMenuPrimitive.Root>,
 10 |   React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
 11 | >(({ className, children, ...props }, ref) => (
 12 |   <NavigationMenuPrimitive.Root
 13 |     ref={ref}
 14 |     className={cn(
 15 |       "relative z-10 flex max-w-max flex-1 items-center justify-center",
 16 |       className
 17 |     )}
 18 |     {...props}
 19 |   >
 20 |     {children}
 21 |     <NavigationMenuViewport />
 22 |   </NavigationMenuPrimitive.Root>
 23 | ))
 24 | NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName
 25 | 
 26 | const NavigationMenuList = React.forwardRef<
 27 |   React.ElementRef<typeof NavigationMenuPrimitive.List>,
 28 |   React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
 29 | >(({ className, ...props }, ref) => (
 30 |   <NavigationMenuPrimitive.List
 31 |     ref={ref}
 32 |     className={cn(
 33 |       "group flex flex-1 list-none items-center justify-center space-x-1",
 34 |       className
 35 |     )}
 36 |     {...props}
 37 |   />
 38 | ))
 39 | NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName
 40 | 
 41 | const NavigationMenuItem = NavigationMenuPrimitive.Item
 42 | 
 43 | const navigationMenuTriggerStyle = cva(
 44 |   "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
 45 | )
 46 | 
 47 | const NavigationMenuTrigger = React.forwardRef<
 48 |   React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
 49 |   React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
 50 | >(({ className, children, ...props }, ref) => (
 51 |   <NavigationMenuPrimitive.Trigger
 52 |     ref={ref}
 53 |     className={cn(navigationMenuTriggerStyle(), "group", className)}
 54 |     {...props}
 55 |   >
 56 |     {children}{" "}
 57 |     <ChevronDown
 58 |       className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
 59 |       aria-hidden="true"
 60 |     />
 61 |   </NavigationMenuPrimitive.Trigger>
 62 | ))
 63 | NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName
 64 | 
 65 | const NavigationMenuContent = React.forwardRef<
 66 |   React.ElementRef<typeof NavigationMenuPrimitive.Content>,
 67 |   React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
 68 | >(({ className, ...props }, ref) => (
 69 |   <NavigationMenuPrimitive.Content
 70 |     ref={ref}
 71 |     className={cn(
 72 |       "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ",
 73 |       className
 74 |     )}
 75 |     {...props}
 76 |   />
 77 | ))
 78 | NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName
 79 | 
 80 | const NavigationMenuLink = NavigationMenuPrimitive.Link
 81 | 
 82 | const NavigationMenuViewport = React.forwardRef<
 83 |   React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
 84 |   React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
 85 | >(({ className, ...props }, ref) => (
 86 |   <div className={cn("absolute left-0 top-full flex justify-center")}>
 87 |     <NavigationMenuPrimitive.Viewport
 88 |       className={cn(
 89 |         "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
 90 |         className
 91 |       )}
 92 |       ref={ref}
 93 |       {...props}
 94 |     />
 95 |   </div>
 96 | ))
 97 | NavigationMenuViewport.displayName =
 98 |   NavigationMenuPrimitive.Viewport.displayName
 99 | 
100 | const NavigationMenuIndicator = React.forwardRef<
101 |   React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
102 |   React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
103 | >(({ className, ...props }, ref) => (
104 |   <NavigationMenuPrimitive.Indicator
105 |     ref={ref}
106 |     className={cn(
107 |       "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
108 |       className
109 |     )}
110 |     {...props}
111 |   >
112 |     <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
113 |   </NavigationMenuPrimitive.Indicator>
114 | ))
115 | NavigationMenuIndicator.displayName =
116 |   NavigationMenuPrimitive.Indicator.displayName
117 | 
118 | export {
119 |   navigationMenuTriggerStyle,
120 |   NavigationMenu,
121 |   NavigationMenuList,
122 |   NavigationMenuItem,
123 |   NavigationMenuContent,
124 |   NavigationMenuTrigger,
125 |   NavigationMenuLink,
126 |   NavigationMenuIndicator,
127 |   NavigationMenuViewport,
128 | }
129 | 


--------------------------------------------------------------------------------
/app/components/ui/pagination.tsx:
--------------------------------------------------------------------------------
  1 | import * as React from "react"
  2 | import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
  3 | 
  4 | import { cn } from "@/lib/utils"
  5 | import { ButtonProps, buttonVariants } from "@/components/ui/button"
  6 | 
  7 | const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  8 |   <nav
  9 |     role="navigation"
 10 |     aria-label="pagination"
 11 |     className={cn("mx-auto flex w-full justify-center", className)}
 12 |     {...props}
 13 |   />
 14 | )
 15 | Pagination.displayName = "Pagination"
 16 | 
 17 | const PaginationContent = React.forwardRef<
 18 |   HTMLUListElement,
 19 |   React.ComponentProps<"ul">
 20 | >(({ className, ...props }, ref) => (
 21 |   <ul
 22 |     ref={ref}
 23 |     className={cn("flex flex-row items-center gap-1", className)}
 24 |     {...props}
 25 |   />
 26 | ))
 27 | PaginationContent.displayName = "PaginationContent"
 28 | 
 29 | const PaginationItem = React.forwardRef<
 30 |   HTMLLIElement,
 31 |   React.ComponentProps<"li">
 32 | >(({ className, ...props }, ref) => (
 33 |   <li ref={ref} className={cn("", className)} {...props} />
 34 | ))
 35 | PaginationItem.displayName = "PaginationItem"
 36 | 
 37 | type PaginationLinkProps = {
 38 |   isActive?: boolean
 39 | } & Pick<ButtonProps, "size"> &
 40 |   React.ComponentProps<"a">
 41 | 
 42 | const PaginationLink = ({
 43 |   className,
 44 |   isActive,
 45 |   size = "icon",
 46 |   ...props
 47 | }: PaginationLinkProps) => (
 48 |   <a
 49 |     aria-current={isActive ? "page" : undefined}
 50 |     className={cn(
 51 |       buttonVariants({
 52 |         variant: isActive ? "outline" : "ghost",
 53 |         size,
 54 |       }),
 55 |       className
 56 |     )}
 57 |     {...props}
 58 |   />
 59 | )
 60 | PaginationLink.displayName = "PaginationLink"
 61 | 
 62 | const PaginationPrevious = ({
 63 |   className,
 64 |   ...props
 65 | }: React.ComponentProps<typeof PaginationLink>) => (
 66 |   <PaginationLink
 67 |     aria-label="Go to previous page"
 68 |     size="default"
 69 |     className={cn("gap-1 pl-2.5", className)}
 70 |     {...props}
 71 |   >
 72 |     <ChevronLeft className="h-4 w-4" />
 73 |     <span>Previous</span>
 74 |   </PaginationLink>
 75 | )
 76 | PaginationPrevious.displayName = "PaginationPrevious"
 77 | 
 78 | const PaginationNext = ({
 79 |   className,
 80 |   ...props
 81 | }: React.ComponentProps<typeof PaginationLink>) => (
 82 |   <PaginationLink
 83 |     aria-label="Go to next page"
 84 |     size="default"
 85 |     className={cn("gap-1 pr-2.5", className)}
 86 |     {...props}
 87 |   >
 88 |     <span>Next</span>
 89 |     <ChevronRight className="h-4 w-4" />
 90 |   </PaginationLink>
 91 | )
 92 | PaginationNext.displayName = "PaginationNext"
 93 | 
 94 | const PaginationEllipsis = ({
 95 |   className,
 96 |   ...props
 97 | }: React.ComponentProps<"span">) => (
 98 |   <span
 99 |     aria-hidden
100 |     className={cn("flex h-9 w-9 items-center justify-center", className)}
101 |     {...props}
102 |   >
103 |     <MoreHorizontal className="h-4 w-4" />
104 |     <span className="sr-only">More pages</span>
105 |   </span>
106 | )
107 | PaginationEllipsis.displayName = "PaginationEllipsis"
108 | 
109 | export {
110 |   Pagination,
111 |   PaginationContent,
112 |   PaginationEllipsis,
113 |   PaginationItem,
114 |   PaginationLink,
115 |   PaginationNext,
116 |   PaginationPrevious,
117 | }
118 | 


--------------------------------------------------------------------------------
/app/components/ui/popover.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | import * as PopoverPrimitive from "@radix-ui/react-popover"
 3 | 
 4 | import { cn } from "@/lib/utils"
 5 | 
 6 | const Popover = PopoverPrimitive.Root
 7 | 
 8 | const PopoverTrigger = PopoverPrimitive.Trigger
 9 | 
10 | const PopoverContent = React.forwardRef<
11 |   React.ElementRef<typeof PopoverPrimitive.Content>,
12 |   React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
13 | >(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
14 |   <PopoverPrimitive.Portal>
15 |     <PopoverPrimitive.Content
16 |       ref={ref}
17 |       align={align}
18 |       sideOffset={sideOffset}
19 |       className={cn(
20 |         "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
21 |         className
22 |       )}
23 |       {...props}
24 |     />
25 |   </PopoverPrimitive.Portal>
26 | ))
27 | PopoverContent.displayName = PopoverPrimitive.Content.displayName
28 | 
29 | export { Popover, PopoverTrigger, PopoverContent }
30 | 


--------------------------------------------------------------------------------
/app/components/ui/progress.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | import * as ProgressPrimitive from "@radix-ui/react-progress"
 3 | 
 4 | import { cn } from "@/lib/utils"
 5 | 
 6 | const Progress = React.forwardRef<
 7 |   React.ElementRef<typeof ProgressPrimitive.Root>,
 8 |   React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
 9 | >(({ className, value, ...props }, ref) => (
10 |   <ProgressPrimitive.Root
11 |     ref={ref}
12 |     className={cn(
13 |       "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
14 |       className
15 |     )}
16 |     {...props}
17 |   >
18 |     <ProgressPrimitive.Indicator
19 |       className="h-full w-full flex-1 bg-primary transition-all"
20 |       style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
21 |     />
22 |   </ProgressPrimitive.Root>
23 | ))
24 | Progress.displayName = ProgressPrimitive.Root.displayName
25 | 
26 | export { Progress }
27 | 


--------------------------------------------------------------------------------
/app/components/ui/radio-group.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
 3 | import { Circle } from "lucide-react"
 4 | 
 5 | import { cn } from "@/lib/utils"
 6 | 
 7 | const RadioGroup = React.forwardRef<
 8 |   React.ElementRef<typeof RadioGroupPrimitive.Root>,
 9 |   React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
10 | >(({ className, ...props }, ref) => {
11 |   return (
12 |     <RadioGroupPrimitive.Root
13 |       className={cn("grid gap-2", className)}
14 |       {...props}
15 |       ref={ref}
16 |     />
17 |   )
18 | })
19 | RadioGroup.displayName = RadioGroupPrimitive.Root.displayName
20 | 
21 | const RadioGroupItem = React.forwardRef<
22 |   React.ElementRef<typeof RadioGroupPrimitive.Item>,
23 |   React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
24 | >(({ className, ...props }, ref) => {
25 |   return (
26 |     <RadioGroupPrimitive.Item
27 |       ref={ref}
28 |       className={cn(
29 |         "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
30 |         className
31 |       )}
32 |       {...props}
33 |     >
34 |       <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
35 |         <Circle className="h-2.5 w-2.5 fill-current text-current" />
36 |       </RadioGroupPrimitive.Indicator>
37 |     </RadioGroupPrimitive.Item>
38 |   )
39 | })
40 | RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName
41 | 
42 | export { RadioGroup, RadioGroupItem }
43 | 


--------------------------------------------------------------------------------
/app/components/ui/resizable.tsx:
--------------------------------------------------------------------------------
 1 | import { GripVertical } from "lucide-react"
 2 | import * as ResizablePrimitive from "react-resizable-panels"
 3 | 
 4 | import { cn } from "@/lib/utils"
 5 | 
 6 | const ResizablePanelGroup = ({
 7 |   className,
 8 |   ...props
 9 | }: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
10 |   <ResizablePrimitive.PanelGroup
11 |     className={cn(
12 |       "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
13 |       className
14 |     )}
15 |     {...props}
16 |   />
17 | )
18 | 
19 | const ResizablePanel = ResizablePrimitive.Panel
20 | 
21 | const ResizableHandle = ({
22 |   withHandle,
23 |   className,
24 |   ...props
25 | }: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
26 |   withHandle?: boolean
27 | }) => (
28 |   <ResizablePrimitive.PanelResizeHandle
29 |     className={cn(
30 |       "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
31 |       className
32 |     )}
33 |     {...props}
34 |   >
35 |     {withHandle && (
36 |       <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
37 |         <GripVertical className="h-2.5 w-2.5" />
38 |       </div>
39 |     )}
40 |   </ResizablePrimitive.PanelResizeHandle>
41 | )
42 | 
43 | export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
44 | 


--------------------------------------------------------------------------------
/app/components/ui/scroll-area.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
 3 | 
 4 | import { cn } from "@/lib/utils"
 5 | 
 6 | const ScrollArea = React.forwardRef<
 7 |   React.ElementRef<typeof ScrollAreaPrimitive.Root>,
 8 |   React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
 9 | >(({ className, children, ...props }, ref) => (
10 |   <ScrollAreaPrimitive.Root
11 |     ref={ref}
12 |     className={cn("relative overflow-hidden", className)}
13 |     {...props}
14 |   >
15 |     <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
16 |       {children}
17 |     </ScrollAreaPrimitive.Viewport>
18 |     <ScrollBar />
19 |     <ScrollAreaPrimitive.Corner />
20 |   </ScrollAreaPrimitive.Root>
21 | ))
22 | ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName
23 | 
24 | const ScrollBar = React.forwardRef<
25 |   React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
26 |   React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
27 | >(({ className, orientation = "vertical", ...props }, ref) => (
28 |   <ScrollAreaPrimitive.ScrollAreaScrollbar
29 |     ref={ref}
30 |     orientation={orientation}
31 |     className={cn(
32 |       "flex touch-none select-none transition-colors",
33 |       orientation === "vertical" &&
34 |         "h-full w-2.5 border-l border-l-transparent p-[1px]",
35 |       orientation === "horizontal" &&
36 |         "h-2.5 flex-col border-t border-t-transparent p-[1px]",
37 |       className
38 |     )}
39 |     {...props}
40 |   >
41 |     <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
42 |   </ScrollAreaPrimitive.ScrollAreaScrollbar>
43 | ))
44 | ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName
45 | 
46 | export { ScrollArea, ScrollBar }
47 | 


--------------------------------------------------------------------------------
/app/components/ui/select.tsx:
--------------------------------------------------------------------------------
  1 | import * as React from "react"
  2 | import * as SelectPrimitive from "@radix-ui/react-select"
  3 | import { Check, ChevronDown, ChevronUp } from "lucide-react"
  4 | 
  5 | import { cn } from "@/lib/utils"
  6 | 
  7 | const Select = SelectPrimitive.Root
  8 | 
  9 | const SelectGroup = SelectPrimitive.Group
 10 | 
 11 | const SelectValue = SelectPrimitive.Value
 12 | 
 13 | const SelectTrigger = React.forwardRef<
 14 |   React.ElementRef<typeof SelectPrimitive.Trigger>,
 15 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
 16 | >(({ className, children, ...props }, ref) => (
 17 |   <SelectPrimitive.Trigger
 18 |     ref={ref}
 19 |     className={cn(
 20 |       "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
 21 |       className
 22 |     )}
 23 |     {...props}
 24 |   >
 25 |     {children}
 26 |     <SelectPrimitive.Icon asChild>
 27 |       <ChevronDown className="h-4 w-4 opacity-50" />
 28 |     </SelectPrimitive.Icon>
 29 |   </SelectPrimitive.Trigger>
 30 | ))
 31 | SelectTrigger.displayName = SelectPrimitive.Trigger.displayName
 32 | 
 33 | const SelectScrollUpButton = React.forwardRef<
 34 |   React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
 35 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
 36 | >(({ className, ...props }, ref) => (
 37 |   <SelectPrimitive.ScrollUpButton
 38 |     ref={ref}
 39 |     className={cn(
 40 |       "flex cursor-default items-center justify-center py-1",
 41 |       className
 42 |     )}
 43 |     {...props}
 44 |   >
 45 |     <ChevronUp className="h-4 w-4" />
 46 |   </SelectPrimitive.ScrollUpButton>
 47 | ))
 48 | SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName
 49 | 
 50 | const SelectScrollDownButton = React.forwardRef<
 51 |   React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
 52 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
 53 | >(({ className, ...props }, ref) => (
 54 |   <SelectPrimitive.ScrollDownButton
 55 |     ref={ref}
 56 |     className={cn(
 57 |       "flex cursor-default items-center justify-center py-1",
 58 |       className
 59 |     )}
 60 |     {...props}
 61 |   >
 62 |     <ChevronDown className="h-4 w-4" />
 63 |   </SelectPrimitive.ScrollDownButton>
 64 | ))
 65 | SelectScrollDownButton.displayName =
 66 |   SelectPrimitive.ScrollDownButton.displayName
 67 | 
 68 | const SelectContent = React.forwardRef<
 69 |   React.ElementRef<typeof SelectPrimitive.Content>,
 70 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
 71 | >(({ className, children, position = "popper", ...props }, ref) => (
 72 |   <SelectPrimitive.Portal>
 73 |     <SelectPrimitive.Content
 74 |       ref={ref}
 75 |       className={cn(
 76 |         "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
 77 |         position === "popper" &&
 78 |           "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
 79 |         className
 80 |       )}
 81 |       position={position}
 82 |       {...props}
 83 |     >
 84 |       <SelectScrollUpButton />
 85 |       <SelectPrimitive.Viewport
 86 |         className={cn(
 87 |           "p-1",
 88 |           position === "popper" &&
 89 |             "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
 90 |         )}
 91 |       >
 92 |         {children}
 93 |       </SelectPrimitive.Viewport>
 94 |       <SelectScrollDownButton />
 95 |     </SelectPrimitive.Content>
 96 |   </SelectPrimitive.Portal>
 97 | ))
 98 | SelectContent.displayName = SelectPrimitive.Content.displayName
 99 | 
100 | const SelectLabel = React.forwardRef<
101 |   React.ElementRef<typeof SelectPrimitive.Label>,
102 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
103 | >(({ className, ...props }, ref) => (
104 |   <SelectPrimitive.Label
105 |     ref={ref}
106 |     className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
107 |     {...props}
108 |   />
109 | ))
110 | SelectLabel.displayName = SelectPrimitive.Label.displayName
111 | 
112 | const SelectItem = React.forwardRef<
113 |   React.ElementRef<typeof SelectPrimitive.Item>,
114 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
115 | >(({ className, children, ...props }, ref) => (
116 |   <SelectPrimitive.Item
117 |     ref={ref}
118 |     className={cn(
119 |       "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
120 |       className
121 |     )}
122 |     {...props}
123 |   >
124 |     <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
125 |       <SelectPrimitive.ItemIndicator>
126 |         <Check className="h-4 w-4" />
127 |       </SelectPrimitive.ItemIndicator>
128 |     </span>
129 | 
130 |     <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
131 |   </SelectPrimitive.Item>
132 | ))
133 | SelectItem.displayName = SelectPrimitive.Item.displayName
134 | 
135 | const SelectSeparator = React.forwardRef<
136 |   React.ElementRef<typeof SelectPrimitive.Separator>,
137 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
138 | >(({ className, ...props }, ref) => (
139 |   <SelectPrimitive.Separator
140 |     ref={ref}
141 |     className={cn("-mx-1 my-1 h-px bg-muted", className)}
142 |     {...props}
143 |   />
144 | ))
145 | SelectSeparator.displayName = SelectPrimitive.Separator.displayName
146 | 
147 | export {
148 |   Select,
149 |   SelectGroup,
150 |   SelectValue,
151 |   SelectTrigger,
152 |   SelectContent,
153 |   SelectLabel,
154 |   SelectItem,
155 |   SelectSeparator,
156 |   SelectScrollUpButton,
157 |   SelectScrollDownButton,
158 | }
159 | 


--------------------------------------------------------------------------------
/app/components/ui/separator.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | import * as SeparatorPrimitive from "@radix-ui/react-separator"
 3 | 
 4 | import { cn } from "@/lib/utils"
 5 | 
 6 | const Separator = React.forwardRef<
 7 |   React.ElementRef<typeof SeparatorPrimitive.Root>,
 8 |   React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
 9 | >(
10 |   (
11 |     { className, orientation = "horizontal", decorative = true, ...props },
12 |     ref
13 |   ) => (
14 |     <SeparatorPrimitive.Root
15 |       ref={ref}
16 |       decorative={decorative}
17 |       orientation={orientation}
18 |       className={cn(
19 |         "shrink-0 bg-border",
20 |         orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
21 |         className
22 |       )}
23 |       {...props}
24 |     />
25 |   )
26 | )
27 | Separator.displayName = SeparatorPrimitive.Root.displayName
28 | 
29 | export { Separator }
30 | 


--------------------------------------------------------------------------------
/app/components/ui/sheet.tsx:
--------------------------------------------------------------------------------
  1 | import * as SheetPrimitive from "@radix-ui/react-dialog"
  2 | import { cva, type VariantProps } from "class-variance-authority"
  3 | import { X } from "lucide-react"
  4 | import * as React from "react"
  5 | 
  6 | import { cn } from "@/lib/utils"
  7 | 
  8 | const Sheet = SheetPrimitive.Root
  9 | 
 10 | const SheetTrigger = SheetPrimitive.Trigger
 11 | 
 12 | const SheetClose = SheetPrimitive.Close
 13 | 
 14 | const SheetPortal = SheetPrimitive.Portal
 15 | 
 16 | const SheetOverlay = React.forwardRef<
 17 |   React.ElementRef<typeof SheetPrimitive.Overlay>,
 18 |   React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
 19 | >(({ className, ...props }, ref) => (
 20 |   <SheetPrimitive.Overlay
 21 |     className={cn(
 22 |       "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
 23 |       className
 24 |     )}
 25 |     {...props}
 26 |     ref={ref}
 27 |   />
 28 | ))
 29 | SheetOverlay.displayName = SheetPrimitive.Overlay.displayName
 30 | 
 31 | const sheetVariants = cva(
 32 |   "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
 33 |   {
 34 |     variants: {
 35 |       side: {
 36 |         top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
 37 |         bottom:
 38 |           "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
 39 |         left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
 40 |         right:
 41 |           "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
 42 |       },
 43 |     },
 44 |     defaultVariants: {
 45 |       side: "right",
 46 |     },
 47 |   }
 48 | )
 49 | 
 50 | interface SheetContentProps
 51 |   extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
 52 |   VariantProps<typeof sheetVariants> { }
 53 | 
 54 | const SheetContent = React.forwardRef<
 55 |   React.ElementRef<typeof SheetPrimitive.Content>,
 56 |   SheetContentProps
 57 | >(({ side = "right", className, children, ...props }, ref) => (
 58 |   <SheetPortal>
 59 |     <SheetOverlay />
 60 |     <SheetPrimitive.Content
 61 |       ref={ref}
 62 |       className={cn(sheetVariants({ side }), className)}
 63 |       {...props}
 64 |     >
 65 |       {children}
 66 |       <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
 67 |         <X className="h-4 w-4" />
 68 |         <span className="sr-only">Close</span>
 69 |       </SheetPrimitive.Close>
 70 |     </SheetPrimitive.Content>
 71 |   </SheetPortal>
 72 | ))
 73 | SheetContent.displayName = SheetPrimitive.Content.displayName
 74 | 
 75 | const SheetHeader = ({
 76 |   className,
 77 |   ...props
 78 | }: React.HTMLAttributes<HTMLDivElement>) => (
 79 |   <div
 80 |     className={cn(
 81 |       "flex flex-col space-y-2 text-center sm:text-left",
 82 |       className
 83 |     )}
 84 |     {...props}
 85 |   />
 86 | )
 87 | SheetHeader.displayName = "SheetHeader"
 88 | 
 89 | const SheetFooter = ({
 90 |   className,
 91 |   ...props
 92 | }: React.HTMLAttributes<HTMLDivElement>) => (
 93 |   <div
 94 |     className={cn(
 95 |       "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
 96 |       className
 97 |     )}
 98 |     {...props}
 99 |   />
100 | )
101 | SheetFooter.displayName = "SheetFooter"
102 | 
103 | const SheetTitle = React.forwardRef<
104 |   React.ElementRef<typeof SheetPrimitive.Title>,
105 |   React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
106 | >(({ className, ...props }, ref) => (
107 |   <SheetPrimitive.Title
108 |     ref={ref}
109 |     className={cn("text-lg font-semibold text-foreground", className)}
110 |     {...props}
111 |   />
112 | ))
113 | SheetTitle.displayName = SheetPrimitive.Title.displayName
114 | 
115 | const SheetDescription = React.forwardRef<
116 |   React.ElementRef<typeof SheetPrimitive.Description>,
117 |   React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
118 | >(({ className, ...props }, ref) => (
119 |   <SheetPrimitive.Description
120 |     ref={ref}
121 |     className={cn("text-sm text-muted-foreground", className)}
122 |     {...props}
123 |   />
124 | ))
125 | SheetDescription.displayName = SheetPrimitive.Description.displayName
126 | 
127 | export {
128 |   Sheet, SheetClose,
129 |   SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetOverlay, SheetPortal, SheetTitle, SheetTrigger
130 | }
131 | 
132 | 


--------------------------------------------------------------------------------
/app/components/ui/skeleton.tsx:
--------------------------------------------------------------------------------
 1 | import { cn } from "@/lib/utils"
 2 | 
 3 | function Skeleton({
 4 |   className,
 5 |   ...props
 6 | }: React.HTMLAttributes<HTMLDivElement>) {
 7 |   return (
 8 |     <div
 9 |       className={cn("animate-pulse rounded-md bg-muted", className)}
10 |       {...props}
11 |     />
12 |   )
13 | }
14 | 
15 | export { Skeleton }
16 | 


--------------------------------------------------------------------------------
/app/components/ui/slider.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | import * as SliderPrimitive from "@radix-ui/react-slider"
 3 | 
 4 | import { cn } from "@/lib/utils"
 5 | 
 6 | const Slider = React.forwardRef<
 7 |   React.ElementRef<typeof SliderPrimitive.Root>,
 8 |   React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
 9 | >(({ className, ...props }, ref) => (
10 |   <SliderPrimitive.Root
11 |     ref={ref}
12 |     className={cn(
13 |       "relative flex w-full touch-none select-none items-center",
14 |       className
15 |     )}
16 |     {...props}
17 |   >
18 |     <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
19 |       <SliderPrimitive.Range className="absolute h-full bg-primary" />
20 |     </SliderPrimitive.Track>
21 |     <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
22 |   </SliderPrimitive.Root>
23 | ))
24 | Slider.displayName = SliderPrimitive.Root.displayName
25 | 
26 | export { Slider }
27 | 


--------------------------------------------------------------------------------
/app/components/ui/sonner.tsx:
--------------------------------------------------------------------------------
 1 | import { useTheme } from "next-themes"
 2 | import { Toaster as Sonner } from "sonner"
 3 | 
 4 | type ToasterProps = React.ComponentProps<typeof Sonner>
 5 | 
 6 | const Toaster = ({ ...props }: ToasterProps) => {
 7 |   const { theme = "system" } = useTheme()
 8 | 
 9 |   return (
10 |     <Sonner
11 |       theme={theme as ToasterProps["theme"]}
12 |       className="toaster group"
13 |       toastOptions={{
14 |         classNames: {
15 |           toast:
16 |             "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
17 |           description: "group-[.toast]:text-muted-foreground",
18 |           actionButton:
19 |             "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
20 |           cancelButton:
21 |             "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
22 |         },
23 |       }}
24 |       {...props}
25 |     />
26 |   )
27 | }
28 | 
29 | export { Toaster }
30 | 


--------------------------------------------------------------------------------
/app/components/ui/switch.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | import * as SwitchPrimitives from "@radix-ui/react-switch"
 3 | 
 4 | import { cn } from "@/lib/utils"
 5 | 
 6 | const Switch = React.forwardRef<
 7 |   React.ElementRef<typeof SwitchPrimitives.Root>,
 8 |   React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
 9 | >(({ className, ...props }, ref) => (
10 |   <SwitchPrimitives.Root
11 |     className={cn(
12 |       "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
13 |       className
14 |     )}
15 |     {...props}
16 |     ref={ref}
17 |   >
18 |     <SwitchPrimitives.Thumb
19 |       className={cn(
20 |         "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
21 |       )}
22 |     />
23 |   </SwitchPrimitives.Root>
24 | ))
25 | Switch.displayName = SwitchPrimitives.Root.displayName
26 | 
27 | export { Switch }
28 | 


--------------------------------------------------------------------------------
/app/components/ui/table.tsx:
--------------------------------------------------------------------------------
  1 | import * as React from "react"
  2 | 
  3 | import { cn } from "@/lib/utils"
  4 | 
  5 | const Table = React.forwardRef<
  6 |   HTMLTableElement,
  7 |   React.HTMLAttributes<HTMLTableElement>
  8 | >(({ className, ...props }, ref) => (
  9 |   <div className="relative w-full overflow-auto">
 10 |     <table
 11 |       ref={ref}
 12 |       className={cn("w-full caption-bottom text-sm", className)}
 13 |       {...props}
 14 |     />
 15 |   </div>
 16 | ))
 17 | Table.displayName = "Table"
 18 | 
 19 | const TableHeader = React.forwardRef<
 20 |   HTMLTableSectionElement,
 21 |   React.HTMLAttributes<HTMLTableSectionElement>
 22 | >(({ className, ...props }, ref) => (
 23 |   <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
 24 | ))
 25 | TableHeader.displayName = "TableHeader"
 26 | 
 27 | const TableBody = React.forwardRef<
 28 |   HTMLTableSectionElement,
 29 |   React.HTMLAttributes<HTMLTableSectionElement>
 30 | >(({ className, ...props }, ref) => (
 31 |   <tbody
 32 |     ref={ref}
 33 |     className={cn("[&_tr:last-child]:border-0", className)}
 34 |     {...props}
 35 |   />
 36 | ))
 37 | TableBody.displayName = "TableBody"
 38 | 
 39 | const TableFooter = React.forwardRef<
 40 |   HTMLTableSectionElement,
 41 |   React.HTMLAttributes<HTMLTableSectionElement>
 42 | >(({ className, ...props }, ref) => (
 43 |   <tfoot
 44 |     ref={ref}
 45 |     className={cn(
 46 |       "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
 47 |       className
 48 |     )}
 49 |     {...props}
 50 |   />
 51 | ))
 52 | TableFooter.displayName = "TableFooter"
 53 | 
 54 | const TableRow = React.forwardRef<
 55 |   HTMLTableRowElement,
 56 |   React.HTMLAttributes<HTMLTableRowElement>
 57 | >(({ className, ...props }, ref) => (
 58 |   <tr
 59 |     ref={ref}
 60 |     className={cn(
 61 |       "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
 62 |       className
 63 |     )}
 64 |     {...props}
 65 |   />
 66 | ))
 67 | TableRow.displayName = "TableRow"
 68 | 
 69 | const TableHead = React.forwardRef<
 70 |   HTMLTableCellElement,
 71 |   React.ThHTMLAttributes<HTMLTableCellElement>
 72 | >(({ className, ...props }, ref) => (
 73 |   <th
 74 |     ref={ref}
 75 |     className={cn(
 76 |       "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
 77 |       className
 78 |     )}
 79 |     {...props}
 80 |   />
 81 | ))
 82 | TableHead.displayName = "TableHead"
 83 | 
 84 | const TableCell = React.forwardRef<
 85 |   HTMLTableCellElement,
 86 |   React.TdHTMLAttributes<HTMLTableCellElement>
 87 | >(({ className, ...props }, ref) => (
 88 |   <td
 89 |     ref={ref}
 90 |     className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
 91 |     {...props}
 92 |   />
 93 | ))
 94 | TableCell.displayName = "TableCell"
 95 | 
 96 | const TableCaption = React.forwardRef<
 97 |   HTMLTableCaptionElement,
 98 |   React.HTMLAttributes<HTMLTableCaptionElement>
 99 | >(({ className, ...props }, ref) => (
100 |   <caption
101 |     ref={ref}
102 |     className={cn("mt-4 text-sm text-muted-foreground", className)}
103 |     {...props}
104 |   />
105 | ))
106 | TableCaption.displayName = "TableCaption"
107 | 
108 | export {
109 |   Table,
110 |   TableHeader,
111 |   TableBody,
112 |   TableFooter,
113 |   TableHead,
114 |   TableRow,
115 |   TableCell,
116 |   TableCaption,
117 | }
118 | 


--------------------------------------------------------------------------------
/app/components/ui/tabs.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | import * as TabsPrimitive from "@radix-ui/react-tabs"
 3 | 
 4 | import { cn } from "@/lib/utils"
 5 | 
 6 | const Tabs = TabsPrimitive.Root
 7 | 
 8 | const TabsList = React.forwardRef<
 9 |   React.ElementRef<typeof TabsPrimitive.List>,
10 |   React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
11 | >(({ className, ...props }, ref) => (
12 |   <TabsPrimitive.List
13 |     ref={ref}
14 |     className={cn(
15 |       "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
16 |       className
17 |     )}
18 |     {...props}
19 |   />
20 | ))
21 | TabsList.displayName = TabsPrimitive.List.displayName
22 | 
23 | const TabsTrigger = React.forwardRef<
24 |   React.ElementRef<typeof TabsPrimitive.Trigger>,
25 |   React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
26 | >(({ className, ...props }, ref) => (
27 |   <TabsPrimitive.Trigger
28 |     ref={ref}
29 |     className={cn(
30 |       "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
31 |       className
32 |     )}
33 |     {...props}
34 |   />
35 | ))
36 | TabsTrigger.displayName = TabsPrimitive.Trigger.displayName
37 | 
38 | const TabsContent = React.forwardRef<
39 |   React.ElementRef<typeof TabsPrimitive.Content>,
40 |   React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
41 | >(({ className, ...props }, ref) => (
42 |   <TabsPrimitive.Content
43 |     ref={ref}
44 |     className={cn(
45 |       "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
46 |       className
47 |     )}
48 |     {...props}
49 |   />
50 | ))
51 | TabsContent.displayName = TabsPrimitive.Content.displayName
52 | 
53 | export { Tabs, TabsList, TabsTrigger, TabsContent }
54 | 


--------------------------------------------------------------------------------
/app/components/ui/textarea.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | 
 3 | import { cn } from "@/lib/utils"
 4 | 
 5 | export interface TextareaProps
 6 |   extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
 7 | 
 8 | const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
 9 |   ({ className, ...props }, ref) => {
10 |     return (
11 |       <textarea
12 |         className={cn(
13 |           "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
14 |           className
15 |         )}
16 |         ref={ref}
17 |         {...props}
18 |       />
19 |     )
20 |   }
21 | )
22 | Textarea.displayName = "Textarea"
23 | 
24 | export { Textarea }
25 | 


--------------------------------------------------------------------------------
/app/components/ui/toast.tsx:
--------------------------------------------------------------------------------
  1 | import * as React from "react"
  2 | import * as ToastPrimitives from "@radix-ui/react-toast"
  3 | import { cva, type VariantProps } from "class-variance-authority"
  4 | import { X } from "lucide-react"
  5 | 
  6 | import { cn } from "@/lib/utils"
  7 | 
  8 | const ToastProvider = ToastPrimitives.Provider
  9 | 
 10 | const ToastViewport = React.forwardRef<
 11 |   React.ElementRef<typeof ToastPrimitives.Viewport>,
 12 |   React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
 13 | >(({ className, ...props }, ref) => (
 14 |   <ToastPrimitives.Viewport
 15 |     ref={ref}
 16 |     className={cn(
 17 |       "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
 18 |       className
 19 |     )}
 20 |     {...props}
 21 |   />
 22 | ))
 23 | ToastViewport.displayName = ToastPrimitives.Viewport.displayName
 24 | 
 25 | const toastVariants = cva(
 26 |   "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
 27 |   {
 28 |     variants: {
 29 |       variant: {
 30 |         default: "border bg-background text-foreground",
 31 |         destructive:
 32 |           "destructive group border-destructive bg-destructive text-destructive-foreground",
 33 |       },
 34 |     },
 35 |     defaultVariants: {
 36 |       variant: "default",
 37 |     },
 38 |   }
 39 | )
 40 | 
 41 | const Toast = React.forwardRef<
 42 |   React.ElementRef<typeof ToastPrimitives.Root>,
 43 |   React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
 44 |     VariantProps<typeof toastVariants>
 45 | >(({ className, variant, ...props }, ref) => {
 46 |   return (
 47 |     <ToastPrimitives.Root
 48 |       ref={ref}
 49 |       className={cn(toastVariants({ variant }), className)}
 50 |       {...props}
 51 |     />
 52 |   )
 53 | })
 54 | Toast.displayName = ToastPrimitives.Root.displayName
 55 | 
 56 | const ToastAction = React.forwardRef<
 57 |   React.ElementRef<typeof ToastPrimitives.Action>,
 58 |   React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
 59 | >(({ className, ...props }, ref) => (
 60 |   <ToastPrimitives.Action
 61 |     ref={ref}
 62 |     className={cn(
 63 |       "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
 64 |       className
 65 |     )}
 66 |     {...props}
 67 |   />
 68 | ))
 69 | ToastAction.displayName = ToastPrimitives.Action.displayName
 70 | 
 71 | const ToastClose = React.forwardRef<
 72 |   React.ElementRef<typeof ToastPrimitives.Close>,
 73 |   React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
 74 | >(({ className, ...props }, ref) => (
 75 |   <ToastPrimitives.Close
 76 |     ref={ref}
 77 |     className={cn(
 78 |       "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
 79 |       className
 80 |     )}
 81 |     toast-close=""
 82 |     {...props}
 83 |   >
 84 |     <X className="h-4 w-4" />
 85 |   </ToastPrimitives.Close>
 86 | ))
 87 | ToastClose.displayName = ToastPrimitives.Close.displayName
 88 | 
 89 | const ToastTitle = React.forwardRef<
 90 |   React.ElementRef<typeof ToastPrimitives.Title>,
 91 |   React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
 92 | >(({ className, ...props }, ref) => (
 93 |   <ToastPrimitives.Title
 94 |     ref={ref}
 95 |     className={cn("text-sm font-semibold", className)}
 96 |     {...props}
 97 |   />
 98 | ))
 99 | ToastTitle.displayName = ToastPrimitives.Title.displayName
100 | 
101 | const ToastDescription = React.forwardRef<
102 |   React.ElementRef<typeof ToastPrimitives.Description>,
103 |   React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
104 | >(({ className, ...props }, ref) => (
105 |   <ToastPrimitives.Description
106 |     ref={ref}
107 |     className={cn("text-sm opacity-90", className)}
108 |     {...props}
109 |   />
110 | ))
111 | ToastDescription.displayName = ToastPrimitives.Description.displayName
112 | 
113 | type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>
114 | 
115 | type ToastActionElement = React.ReactElement<typeof ToastAction>
116 | 
117 | export {
118 |   type ToastProps,
119 |   type ToastActionElement,
120 |   ToastProvider,
121 |   ToastViewport,
122 |   Toast,
123 |   ToastTitle,
124 |   ToastDescription,
125 |   ToastClose,
126 |   ToastAction,
127 | }
128 | 


--------------------------------------------------------------------------------
/app/components/ui/toaster.tsx:
--------------------------------------------------------------------------------
 1 | import { useToast } from "@/hooks/use-toast"
 2 | import {
 3 |   Toast,
 4 |   ToastClose,
 5 |   ToastDescription,
 6 |   ToastProvider,
 7 |   ToastTitle,
 8 |   ToastViewport,
 9 | } from "@/components/ui/toast"
10 | 
11 | export function Toaster() {
12 |   const { toasts } = useToast()
13 | 
14 |   return (
15 |     <ToastProvider>
16 |       {toasts.map(function ({ id, title, description, action, ...props }) {
17 |         return (
18 |           <Toast key={id} {...props}>
19 |             <div className="grid gap-1">
20 |               {title && <ToastTitle>{title}</ToastTitle>}
21 |               {description && (
22 |                 <ToastDescription>{description}</ToastDescription>
23 |               )}
24 |             </div>
25 |             {action}
26 |             <ToastClose />
27 |           </Toast>
28 |         )
29 |       })}
30 |       <ToastViewport />
31 |     </ToastProvider>
32 |   )
33 | }
34 | 


--------------------------------------------------------------------------------
/app/components/ui/toggle-group.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
 3 | import { type VariantProps } from "class-variance-authority"
 4 | 
 5 | import { cn } from "@/lib/utils"
 6 | import { toggleVariants } from "@/components/ui/toggle"
 7 | 
 8 | const ToggleGroupContext = React.createContext<
 9 |   VariantProps<typeof toggleVariants>
10 | >({
11 |   size: "default",
12 |   variant: "default",
13 | })
14 | 
15 | const ToggleGroup = React.forwardRef<
16 |   React.ElementRef<typeof ToggleGroupPrimitive.Root>,
17 |   React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
18 |     VariantProps<typeof toggleVariants>
19 | >(({ className, variant, size, children, ...props }, ref) => (
20 |   <ToggleGroupPrimitive.Root
21 |     ref={ref}
22 |     className={cn("flex items-center justify-center gap-1", className)}
23 |     {...props}
24 |   >
25 |     <ToggleGroupContext.Provider value={{ variant, size }}>
26 |       {children}
27 |     </ToggleGroupContext.Provider>
28 |   </ToggleGroupPrimitive.Root>
29 | ))
30 | 
31 | ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName
32 | 
33 | const ToggleGroupItem = React.forwardRef<
34 |   React.ElementRef<typeof ToggleGroupPrimitive.Item>,
35 |   React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
36 |     VariantProps<typeof toggleVariants>
37 | >(({ className, children, variant, size, ...props }, ref) => {
38 |   const context = React.useContext(ToggleGroupContext)
39 | 
40 |   return (
41 |     <ToggleGroupPrimitive.Item
42 |       ref={ref}
43 |       className={cn(
44 |         toggleVariants({
45 |           variant: context.variant || variant,
46 |           size: context.size || size,
47 |         }),
48 |         className
49 |       )}
50 |       {...props}
51 |     >
52 |       {children}
53 |     </ToggleGroupPrimitive.Item>
54 |   )
55 | })
56 | 
57 | ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName
58 | 
59 | export { ToggleGroup, ToggleGroupItem }
60 | 


--------------------------------------------------------------------------------
/app/components/ui/toggle.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | import * as TogglePrimitive from "@radix-ui/react-toggle"
 3 | import { cva, type VariantProps } from "class-variance-authority"
 4 | 
 5 | import { cn } from "@/lib/utils"
 6 | 
 7 | const toggleVariants = cva(
 8 |   "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
 9 |   {
10 |     variants: {
11 |       variant: {
12 |         default: "bg-transparent",
13 |         outline:
14 |           "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
15 |       },
16 |       size: {
17 |         default: "h-10 px-3",
18 |         sm: "h-9 px-2.5",
19 |         lg: "h-11 px-5",
20 |       },
21 |     },
22 |     defaultVariants: {
23 |       variant: "default",
24 |       size: "default",
25 |     },
26 |   }
27 | )
28 | 
29 | const Toggle = React.forwardRef<
30 |   React.ElementRef<typeof TogglePrimitive.Root>,
31 |   React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
32 |     VariantProps<typeof toggleVariants>
33 | >(({ className, variant, size, ...props }, ref) => (
34 |   <TogglePrimitive.Root
35 |     ref={ref}
36 |     className={cn(toggleVariants({ variant, size, className }))}
37 |     {...props}
38 |   />
39 | ))
40 | 
41 | Toggle.displayName = TogglePrimitive.Root.displayName
42 | 
43 | export { Toggle, toggleVariants }
44 | 


--------------------------------------------------------------------------------
/app/components/ui/tooltip.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | import * as TooltipPrimitive from "@radix-ui/react-tooltip"
 3 | 
 4 | import { cn } from "@/lib/utils"
 5 | 
 6 | const TooltipProvider = TooltipPrimitive.Provider
 7 | 
 8 | const Tooltip = TooltipPrimitive.Root
 9 | 
10 | const TooltipTrigger = TooltipPrimitive.Trigger
11 | 
12 | const TooltipContent = React.forwardRef<
13 |   React.ElementRef<typeof TooltipPrimitive.Content>,
14 |   React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
15 | >(({ className, sideOffset = 4, ...props }, ref) => (
16 |   <TooltipPrimitive.Content
17 |     ref={ref}
18 |     sideOffset={sideOffset}
19 |     className={cn(
20 |       "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
21 |       className
22 |     )}
23 |     {...props}
24 |   />
25 | ))
26 | TooltipContent.displayName = TooltipPrimitive.Content.displayName
27 | 
28 | export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
29 | 


--------------------------------------------------------------------------------
/app/components/ui/use-toast.ts:
--------------------------------------------------------------------------------
1 | import { useToast, toast } from "@/hooks/use-toast";
2 | 
3 | export { useToast, toast };
4 | 


--------------------------------------------------------------------------------
/app/components/venue/CreditLine.tsx:
--------------------------------------------------------------------------------
  1 | 'use client';
  2 | 
  3 | import React, { useState } from 'react';
  4 | import { useParams, useRouter } from 'next/navigation';
  5 | import { 
  6 |   ArrowLeft, CreditCard, Clock, DollarSign, TrendingDown,
  7 |   CheckCircle
  8 | } from 'lucide-react';
  9 | import { Button } from '@/app/components/ui/button';
 10 | import { PurchaseModal } from './PurchaseModal';
 11 | 
 12 | // TODO: Replace with actual venues from the database
 13 | const venueData = {
 14 |   '1': {
 15 |     id: '1',
 16 |     name: 'Silk Club London',
 17 |     location: 'London, UK',
 18 |   },
 19 |   '2': {
 20 |     id: '2',
 21 |     name: 'Azure Lounge Miami',
 22 |     location: 'Miami, FL',
 23 |   },
 24 |   '3': {
 25 |     id: '3',
 26 |     name: 'Crystal Tokyo',
 27 |     location: 'Tokyo, Japan',
 28 |   },
 29 |   '4': {
 30 |     id: '4',
 31 |     name: 'Celestial Berlin',
 32 |     location: 'Berlin, Germany',
 33 |   },
 34 | };
 35 | 
 36 | // TODO: Replace with actual transaction data from the database
 37 | const transactionData = [
 38 |   { id: 't1', description: 'Premium Cocktail', amount: 24.00, time: '10 minutes ago' },
 39 |   { id: 't2', description: 'VIP Seating Fee', amount: 150.00, time: '25 minutes ago' },
 40 |   { id: 't3', description: 'Bottle Service', amount: 320.00, time: '1 hour ago' },
 41 | ];
 42 | 
 43 | export const CreditLine: React.FC = () => {
 44 |   const params = useParams();
 45 |   const router = useRouter();
 46 |   const venueId = params.venueId as string;
 47 |   const [showPurchaseModal, setShowPurchaseModal] = useState(false);
 48 |   const [transactions, setTransactions] = useState(transactionData);
 49 |   const [creditUsed, setCreditUsed] = useState(494);
 50 |   const [dailyLimit] = useState(1000);
 51 |   
 52 |   // Safety check
 53 |   const venue = venueId ? venueData[venueId as keyof typeof venueData] : null;
 54 | 
 55 |   if (!venue) {
 56 |     return (
 57 |       <div className="flex flex-col items-center justify-center min-h-screen p-6">
 58 |         <p className="text-xl font-medium mb-4">Venue not found or loading...</p>
 59 |         <Button onClick={() => router.push('/discover')}>
 60 |           Back to Discover
 61 |         </Button>
 62 |       </div>
 63 |     );
 64 |   }
 65 |   
 66 |   const addTransaction = (description: string, amount: number) => {
 67 |     const newTransaction = {
 68 |       id: `t${Math.random().toString(36).substring(7)}`,
 69 |       description,
 70 |       amount,
 71 |       time: 'Just now'
 72 |     };
 73 |     
 74 |     setTransactions([newTransaction, ...transactions]);
 75 |     setCreditUsed(creditUsed + amount);
 76 |     console.log(`Recorded purchase: ${description} for ${amount}`);
 77 |   };
 78 | 
 79 |   return (
 80 |     <div className="flex flex-col min-h-screen pt-10 pb-20 px-6">
 81 |       <div className="mb-6 animate-fade-in">
 82 |         <button 
 83 |           onClick={() => router.push(`/venue/${venueId}`)}
 84 |           className="flex items-center text-muted-foreground mb-4"
 85 |         >
 86 |           <ArrowLeft className="h-4 w-4 mr-1" />
 87 |           Back to Venue
 88 |         </button>
 89 |         
 90 |         <h1 className="text-2xl font-bold mb-1">Active Credit</h1>
 91 |         <div className="flex items-center">
 92 |           <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
 93 |           <p className="text-sm text-muted-foreground">
 94 |             Checked in at {venue.name}
 95 |           </p>
 96 |         </div>
 97 |       </div>
 98 | 
 99 |       <div className="glass-card p-6 mb-8 animate-fade-in">
100 |         <div className="flex justify-between items-start mb-4">
101 |           <div>
102 |             <h2 className="text-lg font-medium mb-1">Daily Credit</h2>
103 |             <p className="text-sm text-muted-foreground">Available until check-out</p>
104 |           </div>
105 |           <CreditCard className="h-6 w-6 text-primary" />
106 |         </div>
107 |         
108 |         <div className="mb-3">
109 |           <div className="flex justify-between items-end mb-1">
110 |             <span className="text-xs text-muted-foreground">Used</span>
111 |             <span className="font-medium">${creditUsed.toFixed(2)}</span>
112 |           </div>
113 |           <div className="flex justify-between items-end mb-1">
114 |             <span className="text-xs text-muted-foreground">Daily Limit</span>
115 |             <span className="font-medium text-lg">${dailyLimit.toFixed(2)}</span>
116 |           </div>
117 |           <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
118 |             <div 
119 |               className="h-full bg-primary rounded-full" 
120 |               style={{ width: `${dailyLimit > 0 ? (creditUsed / dailyLimit) * 100 : 0}%` }}
121 |             />
122 |           </div>
123 |           <div className="flex justify-between items-center mt-1">
124 |             <span className="text-xs text-muted-foreground">
125 |               <Clock className="h-3 w-3 inline mr-1" />
126 |               Auto-reset at midnight
127 |             </span>
128 |             <span className="text-xs font-medium text-primary">
129 |               ${(dailyLimit - creditUsed).toFixed(2)} remaining
130 |             </span>
131 |           </div>
132 |         </div>
133 |         
134 |         <Button 
135 |           onClick={() => setShowPurchaseModal(true)}
136 |           className="w-full glass-button"
137 |         >
138 |           Make a Purchase
139 |           <DollarSign className="ml-2 h-4 w-4" />
140 |         </Button>
141 |       </div>
142 | 
143 |       <div className="mb-6 animate-fade-in">
144 |         <h2 className="text-lg font-semibold mb-3">Recent Transactions</h2>
145 |         
146 |         <div className="space-y-3">
147 |           {transactions.map((transaction) => (
148 |             <div key={transaction.id} className="glass-card p-4 flex justify-between items-center">
149 |               <div>
150 |                 <p className="font-medium">{transaction.description}</p>
151 |                 <p className="text-xs text-muted-foreground">{transaction.time}</p>
152 |               </div>
153 |               <div className="flex items-center">
154 |                 <TrendingDown className="h-4 w-4 text-primary mr-2" />
155 |                 <span className="font-medium">${transaction.amount.toFixed(2)}</span>
156 |               </div>
157 |             </div>
158 |           ))}
159 |           {transactions.length === 0 && (
160 |              <p className="text-center text-muted-foreground">No transactions yet.</p>
161 |           )}
162 |         </div>
163 |       </div>
164 |       
165 |       {showPurchaseModal && (
166 |         <PurchaseModal 
167 |           onClose={() => setShowPurchaseModal(false)} 
168 |           onPurchase={addTransaction}
169 |           remainingCredit={dailyLimit - creditUsed}
170 |         />
171 |       )}
172 |     </div>
173 |   );
174 | };
175 | 


--------------------------------------------------------------------------------
/app/components/venues/VenueImageUpload.tsx:
--------------------------------------------------------------------------------
 1 | import { useState } from 'react'
 2 | import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
 3 | import { Button } from '@/components/ui/button'
 4 | import { Input } from '@/components/ui/input'
 5 | import { Label } from '@/components/ui/label'
 6 | import { toast } from 'sonner'
 7 | 
 8 | interface VenueImageUploadProps {
 9 |   venueId: string
10 |   currentImageUrl?: string
11 |   onImageUploaded: (url: string) => void
12 | }
13 | 
14 | export function VenueImageUpload({ venueId, currentImageUrl, onImageUploaded }: VenueImageUploadProps) {
15 |   const [uploading, setUploading] = useState(false)
16 |   const supabase = createClientComponentClient()
17 | 
18 |   const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
19 |     try {
20 |       setUploading(true)
21 | 
22 |       if (!event.target.files || event.target.files.length === 0) {
23 |         throw new Error('You must select an image to upload.')
24 |       }
25 | 
26 |       const file = event.target.files[0]
27 |       const fileExt = file.name.split('.').pop()
28 |       const filePath = `${venueId}-${Math.random()}.${fileExt}`
29 | 
30 |       // Upload image to Supabase Storage
31 |       const { error: uploadError, data } = await supabase.storage
32 |         .from('venue-images')
33 |         .upload(filePath, file)
34 | 
35 |       if (uploadError) {
36 |         throw uploadError
37 |       }
38 | 
39 |       // Get public URL
40 |       const { data: { publicUrl } } = supabase.storage
41 |         .from('venue-images')
42 |         .getPublicUrl(filePath)
43 | 
44 |       // Update venue record with new image URL
45 |       const { error: updateError } = await supabase
46 |         .from('venues')
47 |         .update({
48 |           image_url: publicUrl,
49 |           image_bucket_path: filePath
50 |         })
51 |         .eq('id', venueId)
52 | 
53 |       if (updateError) {
54 |         throw updateError
55 |       }
56 | 
57 |       onImageUploaded(publicUrl)
58 |       toast.success('Venue image updated successfully')
59 |     } catch (error) {
60 |       toast.error('Error uploading image')
61 |       console.error('Error uploading image:', error)
62 |     } finally {
63 |       setUploading(false)
64 |     }
65 |   }
66 | 
67 |   return (
68 |     <div className="flex flex-col gap-4">
69 |       <div className="grid w-full max-w-sm items-center gap-1.5">
70 |         <Label htmlFor="image">Venue Image</Label>
71 |         <Input
72 |           id="image"
73 |           type="file"
74 |           accept="image/*"
75 |           onChange={uploadImage}
76 |           disabled={uploading}
77 |         />
78 |       </div>
79 |       {currentImageUrl && (
80 |         <div className="relative w-full max-w-sm aspect-video">
81 |           {/* eslint-disable-next-line @next/next/no-img-element */}
82 |           <img
83 |             src={currentImageUrl}
84 |             alt="Venue"
85 |             className="rounded-lg object-cover w-full h-full"
86 |           />
87 |         </div>
88 |       )}
89 |     </div>
90 |   )
91 | } 


--------------------------------------------------------------------------------
/app/create-profile/page.tsx:
--------------------------------------------------------------------------------
 1 | import { CreateProfileForm } from '@/app/components/auth/CreateProfileForm';
 2 | import { Suspense } from 'react';
 3 | 
 4 | // Use Suspense because CreateProfileForm uses useSearchParams
 5 | function CreateProfileContent() {
 6 |   return <CreateProfileForm />;
 7 | }
 8 | 
 9 | export default function CreateProfilePage() {
10 |   return (
11 |     <Suspense fallback={<div>Loading profile form...</div>}> {
12 |       /* Wrap CreateProfileContent with Suspense */}
13 |       <CreateProfileContent />
14 |     </Suspense>
15 |   );
16 | } 


--------------------------------------------------------------------------------
/app/dashboard/loading.tsx:
--------------------------------------------------------------------------------
1 | export default function Loading() {
2 |   // You can add any UI inside Loading, including a Skeleton.
3 |   return <div>Loading Dashboard...</div>;
4 | } 


--------------------------------------------------------------------------------
/app/dashboard/page.tsx:
--------------------------------------------------------------------------------
 1 | import { PageLayout } from '@/app/components/layout/PageLayout';
 2 | import { Dashboard } from '@/app/components/home/Dashboard';
 3 | 
 4 | export default function DashboardPage() {
 5 |   return (
 6 |     <PageLayout>
 7 |       <Dashboard />
 8 |     </PageLayout>
 9 |   );
10 | } 


--------------------------------------------------------------------------------
/app/discover/loading.tsx:
--------------------------------------------------------------------------------
1 | export default function Loading() {
2 |   // You can add any UI inside Loading, including a Skeleton.
3 |   return <div>Loading Discover...</div>;
4 | } 


--------------------------------------------------------------------------------
/app/discover/page.tsx:
--------------------------------------------------------------------------------
 1 | import { PageLayout } from '@/app/components/layout/PageLayout';
 2 | import { DiscoverVenues } from '@/app/components/discover/DiscoverVenues';
 3 | 
 4 | export default function DiscoverPage() {
 5 |   return (
 6 |     <PageLayout>
 7 |       <DiscoverVenues />
 8 |     </PageLayout>
 9 |   );
10 | } 


--------------------------------------------------------------------------------
/app/favicon.ico:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/ACNoonan/samachi-app/ea5c59baec35c409b87c879e36c5c87228db64fe/app/favicon.ico


--------------------------------------------------------------------------------
/app/globals.css:
--------------------------------------------------------------------------------
 1 | @import "tailwindcss";
 2 | 
 3 | :root {
 4 |   --background: #ffffff;
 5 |   --foreground: #171717;
 6 | }
 7 | 
 8 | @theme inline {
 9 |   --color-background: var(--background);
10 |   --color-foreground: var(--foreground);
11 |   --font-sans: var(--font-geist-sans);
12 |   --font-mono: var(--font-geist-mono);
13 | }
14 | 
15 | @media (prefers-color-scheme: dark) {
16 |   :root {
17 |     --background: #0a0a0a;
18 |     --foreground: #ededed;
19 |   }
20 | }
21 | 
22 | body {
23 |   background: var(--background);
24 |   color: var(--foreground);
25 |   font-family: Arial, Helvetica, sans-serif;
26 | }
27 | 


--------------------------------------------------------------------------------
/app/layout.tsx:
--------------------------------------------------------------------------------
 1 | 'use client'; // Root layout needs to be a client component for providers
 2 | 
 3 | import type { Metadata } from "next";
 4 | import { Inter } from "next/font/google";
 5 | import "./globals.css";
 6 | import React, { useMemo } from 'react'; // Add React and useMemo
 7 | 
 8 | // Solana Wallet Adapter imports
 9 | import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
10 | import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
11 | import {
12 |     PhantomWalletAdapter, 
13 |     SolflareWalletAdapter, 
14 |     // Add other adapters you want to support
15 | } from '@solana/wallet-adapter-wallets';
16 | import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
17 | import { clusterApiUrl } from '@solana/web3.js';
18 | 
19 | // Import the new Auth Provider
20 | import { AuthProvider } from './context/AuthContext';
21 | // Import Toaster for notifications
22 | import { Toaster } from "@/app/components/ui/sonner"
23 | // Theme Provider
24 | import { ThemeProvider } from "next-themes"
25 | 
26 | // Default styles that can be overridden by your app
27 | require('@solana/wallet-adapter-react-ui/styles.css');
28 | 
29 | const inter = Inter({ subsets: ["latin"] });
30 | 
31 | // No need for metadata export in a client component layout root
32 | // export const metadata: Metadata = {
33 | //   title: "Samachi App",
34 | //   description: "Samachi Membership Access",
35 | // };
36 | 
37 | export default function RootLayout({
38 |   children,
39 | }: Readonly<{
40 |   children: React.ReactNode;
41 | }>) {
42 |   // Set Solana network
43 |   const network = WalletAdapterNetwork.Devnet; // Or Mainnet-beta, Testnet
44 |   const endpoint = useMemo(() => clusterApiUrl(network), [network]);
45 | 
46 |   // Initialize wallet adapters
47 |   const wallets = useMemo(
48 |     () => [
49 |         new PhantomWalletAdapter(),
50 |         new SolflareWalletAdapter({ network }),
51 |         // Add other adapters...
52 |     ],
53 |     [network]
54 |   );
55 | 
56 |   return (
57 |     <html lang="en" suppressHydrationWarning>
58 |       <body className={`${inter.className} bg-background text-foreground`}>
59 |         <ThemeProvider
60 |             attribute="class"
61 |             defaultTheme="system"
62 |             enableSystem
63 |             disableTransitionOnChange
64 |           >
65 |           <AuthProvider>
66 |             <ConnectionProvider endpoint={endpoint}>
67 |               <WalletProvider wallets={wallets} autoConnect>
68 |                 <WalletModalProvider>
69 |                   {/* Your existing layout structure, e.g., Navbar, PageWrapper */} 
70 |                   {children} 
71 |                   <Toaster richColors position="top-center" /> { /* Add Toaster */ }
72 |                 </WalletModalProvider>
73 |               </WalletProvider>
74 |             </ConnectionProvider>
75 |           </AuthProvider>
76 |         </ThemeProvider>
77 |       </body>
78 |     </html>
79 |   );
80 | }
81 | 


--------------------------------------------------------------------------------
/app/login/page.tsx:
--------------------------------------------------------------------------------
1 | import { LoginForm } from '@/app/components/auth/LoginForm';
2 | 
3 | export default function LoginPage() {
4 |   return <LoginForm />;
5 | } 


--------------------------------------------------------------------------------
/app/page.tsx:
--------------------------------------------------------------------------------
 1 | import Image from "next/image";
 2 | 
 3 | export default function HomePage() {
 4 |   return (
 5 |     <main>
 6 |       <h1>Welcome to Samachi</h1>
 7 |       {/* Placeholder for homepage content */}
 8 |     </main>
 9 |   );
10 | }
11 | 


--------------------------------------------------------------------------------
/app/profile/loading.tsx:
--------------------------------------------------------------------------------
1 | export default function Loading() {
2 |   // You can add any UI inside Loading, including a Skeleton.
3 |   return <div>Loading Profile...</div>;
4 | } 


--------------------------------------------------------------------------------
/app/profile/page.tsx:
--------------------------------------------------------------------------------
 1 | import { PageLayout } from '@/app/components/layout/PageLayout';
 2 | import { ProfileSettings } from '@/app/components/profile/ProfileSettings';
 3 | 
 4 | export default function ProfilePage() {
 5 |   return (
 6 |     <PageLayout>
 7 |       <ProfileSettings />
 8 |     </PageLayout>
 9 |   );
10 | } 


--------------------------------------------------------------------------------
/app/venue/[venueId]/page.tsx:
--------------------------------------------------------------------------------
1 | 'use client';
2 | 
3 | import React from 'react';
4 | import { VenueDetail } from '@/app/components/venue/VenueDetail';
5 | 
6 | export default function VenueDetailPage() {
7 |   // The VenueDetail component itself handles fetching data based on URL params
8 |   return <VenueDetail />;
9 | } 


--------------------------------------------------------------------------------
/app/wallet/loading.tsx:
--------------------------------------------------------------------------------
1 | export default function Loading() {
2 |   // You can add any UI inside Loading, including a Skeleton.
3 |   return <div>Loading Wallet...</div>;
4 | } 


--------------------------------------------------------------------------------
/app/wallet/page.tsx:
--------------------------------------------------------------------------------
 1 | import { PageLayout } from '@/app/components/layout/PageLayout';
 2 | import { WalletDashboard } from '@/app/components/wallet/WalletDashboard';
 3 | 
 4 | export default function WalletPage() {
 5 |   return (
 6 |     <PageLayout>
 7 |       <WalletDashboard />
 8 |     </PageLayout>
 9 |   );
10 | } 


--------------------------------------------------------------------------------
/lib/auth.ts:
--------------------------------------------------------------------------------
1 | // TODO: Add shared authentication utility functions
2 | // e.g., functions for Supabase Auth, wallet connection logic
3 | 
4 | export const exampleAuthUtil = () => {
5 |   console.log("Shared auth utility function called");
6 | };
7 | 
8 | export {}; // Placeholder 


--------------------------------------------------------------------------------
/lib/supabase.ts:
--------------------------------------------------------------------------------
 1 | // src/lib/supabaseClient.ts
 2 | import { createClient } from '@supabase/supabase-js';
 3 | 
 4 | // Ensure these are set in your environment variables (.env file)
 5 | const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
 6 | const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 7 | 
 8 | if (!supabaseUrl) {
 9 |   throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
10 | }
11 | if (!supabaseAnonKey) {
12 |   throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
13 | }
14 | 
15 | export const supabase = createClient(supabaseUrl, supabaseAnonKey);


--------------------------------------------------------------------------------
/lib/supabase/client.ts:
--------------------------------------------------------------------------------
 1 | import { createBrowserClient } from '@supabase/ssr';
 2 | 
 3 | // Define a function to create a Supabase client for client-side operations
 4 | export function createClient() {
 5 |   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
 6 |   const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 7 | 
 8 |   if (!supabaseUrl) {
 9 |     throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
10 |   }
11 |   if (!supabaseAnonKey) {
12 |     throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
13 |   }
14 | 
15 |   return createBrowserClient(
16 |     supabaseUrl,
17 |     supabaseAnonKey
18 |   );
19 | } 


--------------------------------------------------------------------------------
/lib/supabase/middleware.ts:
--------------------------------------------------------------------------------
 1 | // lib/supabase/middleware.ts
 2 | import { createServerClient, type CookieOptions } from '@supabase/ssr'
 3 | import { NextResponse, type NextRequest } from 'next/server'
 4 | 
 5 | export async function updateSession(request: NextRequest) {
 6 |   let response = NextResponse.next({
 7 |     request: {
 8 |       headers: request.headers,
 9 |     },
10 |   })
11 | 
12 |   const supabase = createServerClient(
13 |     process.env.NEXT_PUBLIC_SUPABASE_URL!,
14 |     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
15 |     {
16 |       cookies: {
17 |         get(name: string) {
18 |           return request.cookies.get(name)?.value
19 |         },
20 |         set(name: string, value: string, options: CookieOptions) {
21 |           request.cookies.set({ name, value, ...options })
22 |           response = NextResponse.next({ request: { headers: request.headers } })
23 |           response.cookies.set({ name, value, ...options })
24 |         },
25 |         remove(name: string, options: CookieOptions) {
26 |           request.cookies.set({ name, value: '', ...options })
27 |           response = NextResponse.next({ request: { headers: request.headers } })
28 |           response.cookies.set({ name, value: '', ...options })
29 |         },
30 |       },
31 |     }
32 |   )
33 | 
34 |   // Refresh session if expired - important!
35 |   const { data: { user } } = await supabase.auth.getUser();
36 | 
37 |   // --- Your Custom Logic Here (Copied from previous plan) ---
38 |   const { pathname } = request.nextUrl;
39 |   const isAuthenticated = !!user;
40 | 
41 |   console.log(`[Middleware] Path: ${pathname}, Auth User: ${isAuthenticated ? user.id : 'None'}`);
42 | 
43 |   const publicPaths = ['/login', '/card/'];
44 |   const isPublicPath = publicPaths.some(path => pathname.startsWith(path)) || pathname === '/';
45 | 
46 |   // Redirect unauthenticated users from protected paths
47 |   if (!isAuthenticated && !isPublicPath) {
48 |      // Allow create-profile only if coming from card scan
49 |      if (pathname === '/create-profile' && request.nextUrl.searchParams.has('cardId')) {
50 |          console.log(`[Middleware] Allowing unauthenticated access to /create-profile with cardId`);
51 |          // Still return the original response to allow Supabase cookie handling
52 |          return response;
53 |      }
54 |      console.log(`[Middleware] Redirecting unauthenticated user from ${pathname} to /login`);
55 |      return NextResponse.redirect(new URL('/login', request.url));
56 |   }
57 | 
58 |   // Redirect authenticated users from login or root path
59 |   if (isAuthenticated && (pathname === '/login' || pathname === '/')) {
60 |      console.log(`[Middleware] Redirecting authenticated user from ${pathname} to /dashboard`);
61 |      return NextResponse.redirect(new URL('/dashboard', request.url));
62 |   }
63 |   // --- End Custom Logic ---
64 | 
65 |   return response // Return the response object (handles potential cookie updates)
66 | } 


--------------------------------------------------------------------------------
/lib/supabase/server.ts:
--------------------------------------------------------------------------------
 1 | import { createServerClient, type CookieOptions } from '@supabase/ssr';
 2 | import { cookies } from 'next/headers';
 3 | import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
 4 | 
 5 | // Define a function to create a Supabase client for server-side operations
 6 | export function createClient(cookieStore: ReadonlyRequestCookies) {
 7 |   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
 8 |   const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Service Role Key for server actions
 9 | 
10 |   if (!supabaseUrl) {
11 |     throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
12 |   }
13 |   if (!supabaseServiceRoleKey) {
14 |     throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY');
15 |   }
16 | 
17 |   return createServerClient(supabaseUrl, supabaseServiceRoleKey, {
18 |     cookies: {
19 |       get(name: string) {
20 |         const cookie = cookieStore.get(name);
21 |         return cookie?.value;
22 |       },
23 |       set(name: string, value: string, options: CookieOptions) {
24 |         try {
25 |           cookieStore.set({ name, value, ...options });
26 |         } catch (error) {
27 |           // The `set` method was called from a Server Component.
28 |           // This can be ignored if you have middleware refreshing
29 |           // user sessions.
30 |         }
31 |       },
32 |       remove(name: string, options: CookieOptions) {
33 |         try {
34 |           cookieStore.set({ name, value: '', ...options });
35 |         } catch (error) {
36 |           // The `delete` method was called from a Server Component.
37 |           // This can be ignored if you have middleware refreshing
38 |           // user sessions.
39 |         }
40 |       },
41 |     },
42 |     // It's generally recommended to use the service role key for server-side operations
43 |     // that need to bypass RLS or perform admin tasks.
44 |     auth: {
45 |       // Required for supabase-ssr
46 |       persistSession: true,
47 |       autoRefreshToken: true,
48 |       detectSessionInUrl: false,
49 |     },
50 |   });
51 | } 


--------------------------------------------------------------------------------
/lib/utils.ts:
--------------------------------------------------------------------------------
1 | import { type ClassValue, clsx } from "clsx"
2 | import { twMerge } from "tailwind-merge"
3 | 
4 | export function cn(...inputs: ClassValue[]) {
5 |   return twMerge(clsx(inputs))
6 | }


--------------------------------------------------------------------------------
/middleware.ts:
--------------------------------------------------------------------------------
 1 | import { updateSession } from '@/lib/supabase/middleware'
 2 | import { NextRequest, NextResponse } from 'next/server'
 3 | 
 4 | // Define the same secure cookie name
 5 | const SESSION_COOKIE_NAME = 'auth_session';
 6 | 
 7 | // This function can be marked `async` if using `await` inside
 8 | export async function middleware(request: NextRequest) {
 9 |   // updateSession handles session refresh and contains your redirect logic
10 |   return await updateSession(request)
11 | }
12 | 
13 | // See "Matching Paths" below to learn more
14 | export const config = {
15 |   matcher: [
16 |     /*
17 |      * Match all request paths except for the ones starting with:
18 |      * - api (API routes)
19 |      * - _next/static (static files)
20 |      * - _next/image (image optimization files)
21 |      * - favicon.ico (favicon file)
22 |      * Feel free to modify this pattern to include more paths.
23 |      */
24 |     '/((?!api|_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
25 |   ],
26 | }; 


--------------------------------------------------------------------------------
/next.config.mjs:
--------------------------------------------------------------------------------
1 | // import type { NextConfig } from "next";
2 | 
3 | const nextConfig = {
4 |   /* config options here */
5 | };
6 | 
7 | export default nextConfig;
8 | 


--------------------------------------------------------------------------------
/package.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "name": "samachi-app",
 3 |   "version": "0.1.0",
 4 |   "private": true,
 5 |   "scripts": {
 6 |     "dev": "next dev",
 7 |     "build": "next build",
 8 |     "start": "next start",
 9 |     "lint": "next lint"
10 |   },
11 |   "dependencies": {
12 |     "@hookform/resolvers": "^5.0.1",
13 |     "@radix-ui/react-accordion": "^1.2.4",
14 |     "@radix-ui/react-alert-dialog": "^1.1.7",
15 |     "@radix-ui/react-label": "^2.1.3",
16 |     "@radix-ui/react-separator": "^1.1.3",
17 |     "@radix-ui/react-slot": "^1.2.0",
18 |     "@radix-ui/react-switch": "^1.1.4",
19 |     "@solana/wallet-adapter-base": "^0.9.24",
20 |     "@solana/wallet-adapter-react": "^0.15.36",
21 |     "@solana/wallet-adapter-react-ui": "^0.9.36",
22 |     "@solana/wallet-adapter-wallets": "^0.19.34",
23 |     "@solana/web3.js": "^1.98.0",
24 |     "@supabase/ssr": "^0.6.1",
25 |     "@supabase/supabase-js": "^2.49.4",
26 |     "@types/bcryptjs": "^3.0.0",
27 |     "@types/dotenv": "^8.2.3",
28 |     "axios": "^1.8.4",
29 |     "bcryptjs": "^3.0.2",
30 |     "class-variance-authority": "^0.7.1",
31 |     "clsx": "^2.1.1",
32 |     "dotenv": "^16.5.0",
33 |     "framer-motion": "^12.7.3",
34 |     "lucide-react": "^0.487.0",
35 |     "next": "14.2.28",
36 |     "next-themes": "^0.4.6",
37 |     "pino-pretty": "^13.0.0",
38 |     "react": "^18.3.1",
39 |     "react-dom": "^18.3.1",
40 |     "react-hook-form": "^7.55.0",
41 |     "sonner": "^2.0.3",
42 |     "tailwind-merge": "^3.2.0",
43 |     "zod": "^3.24.2"
44 |   },
45 |   "devDependencies": {
46 |     "@tailwindcss/postcss": "^4",
47 |     "@types/node": "^20",
48 |     "@types/react": "^18.3.20",
49 |     "@types/react-dom": "^18.3.6",
50 |     "tailwindcss": "^4",
51 |     "typescript": "^5"
52 |   }
53 | }
54 | 


--------------------------------------------------------------------------------
/postcss.config.mjs:
--------------------------------------------------------------------------------
1 | const config = {
2 |   plugins: ["@tailwindcss/postcss"],
3 | };
4 | 
5 | export default config;
6 | 


--------------------------------------------------------------------------------
/public/barrage-club.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/ACNoonan/samachi-app/ea5c59baec35c409b87c879e36c5c87228db64fe/public/barrage-club.png


--------------------------------------------------------------------------------
/public/berhta-club.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/ACNoonan/samachi-app/ea5c59baec35c409b87c879e36c5c87228db64fe/public/berhta-club.png


--------------------------------------------------------------------------------
/public/bloom-festival.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/ACNoonan/samachi-app/ea5c59baec35c409b87c879e36c5c87228db64fe/public/bloom-festival.png


--------------------------------------------------------------------------------
/public/file.svg:
--------------------------------------------------------------------------------
1 | <svg fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 13.5V5.41a1 1 0 0 0-.3-.7L9.8.29A1 1 0 0 0 9.08 0H1.5v13.5A2.5 2.5 0 0 0 4 16h8a2.5 2.5 0 0 0 2.5-2.5m-1.5 0v-7H8v-5H3v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1M9.5 5V2.12L12.38 5zM5.13 5h-.62v1.25h2.12V5zm-.62 3h7.12v1.25H4.5zm.62 3h-.62v1.25h7.12V11z" clip-rule="evenodd" fill="#666" fill-rule="evenodd"/></svg>


--------------------------------------------------------------------------------
/public/globe.svg:
--------------------------------------------------------------------------------
1 | <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g clip-path="url(#a)"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1" fill="#666"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs></svg>


--------------------------------------------------------------------------------
/public/next.svg:
--------------------------------------------------------------------------------
1 | <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80"><path fill="#000" d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"/><path fill="#000" d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z"/></svg>


--------------------------------------------------------------------------------
/public/novi1.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/ACNoonan/samachi-app/ea5c59baec35c409b87c879e36c5c87228db64fe/public/novi1.png


--------------------------------------------------------------------------------
/public/vercel.svg:
--------------------------------------------------------------------------------
1 | <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1155 1000"><path d="m577.3 0 577.4 1000H0z" fill="#fff"/></svg>


--------------------------------------------------------------------------------
/public/window.svg:
--------------------------------------------------------------------------------
1 | <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 2.5h13v10a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1zM0 1h16v11.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 12.5zm3.75 4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M7 4.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" fill="#666"/></svg>


--------------------------------------------------------------------------------
/python/create_glownet_events.py:
--------------------------------------------------------------------------------
  1 | # samachi-app/create_glownet_test_data.py
  2 | import os
  3 | import requests
  4 | import sys
  5 | from datetime import datetime, timedelta
  6 | from dotenv import load_dotenv
  7 | 
  8 | # --- Configuration ---
  9 | # Construct the path to .env.local relative to this script file
 10 | script_dir = os.path.dirname(os.path.abspath(__file__))
 11 | parent_dir = os.path.dirname(script_dir)  # Go up one level
 12 | dotenv_path = os.path.join(parent_dir, '.env.local')
 13 | 
 14 | print(f"Looking for .env.local at: {dotenv_path}")
 15 | if not os.path.exists(dotenv_path):
 16 |     print(f"Warning: .env.local not found at {dotenv_path}")
 17 |     
 18 | load_dotenv(dotenv_path=dotenv_path)
 19 | 
 20 | GLOWNET_API_BASE_URL = os.getenv("GLOWNET_API_BASE_URL", "https://opera.glownet.com")
 21 | GLOWNET_API_KEY = os.getenv("GLOWNET_API_KEY")
 22 | 
 23 | if not GLOWNET_API_KEY:
 24 |     print("Error: GLOWNET_API_KEY environment variable not set in .env.local")
 25 |     sys.exit(1)
 26 | 
 27 | HEADERS = {
 28 |     "AUTHORIZATION": f"Token token={GLOWNET_API_KEY}",
 29 |     "Content-Type": "application/json",
 30 |     "Accept": "application/json"
 31 | }
 32 | 
 33 | # --- Helper Functions ---
 34 | 
 35 | def handle_response(response, success_status_codes=(200, 201)):
 36 |     """Checks response status and returns JSON or raises error."""
 37 |     if response.status_code in success_status_codes:
 38 |         try:
 39 |             if response.text:
 40 |                 return response.json()
 41 |             else:
 42 |                 return None # Success, but no JSON body
 43 |         except requests.exceptions.JSONDecodeError:
 44 |             print(f"Warning: Successful status ({response.status_code}) but could not decode JSON.")
 45 |             print(f"Response Text: {response.text}")
 46 |             return None
 47 |     else:
 48 |         print(f"Error: API returned status {response.status_code}")
 49 |         try:
 50 |             error_details = response.json()
 51 |             print(f"Response: {error_details}")
 52 |             message = error_details.get('error') or error_details.get('message') or str(error_details)
 53 |             print(f"API Error Details: {message}")
 54 |         except requests.exceptions.JSONDecodeError:
 55 |             print(f"Response Text (non-JSON): {response.text}")
 56 |         return None # Indicate failure
 57 | 
 58 | def ask_yes_no(prompt):
 59 |     """Asks a yes/no question and returns True for yes, False for no."""
 60 |     while True:
 61 |         response = input(f"{prompt} (y/n): ").lower().strip()
 62 |         if response == 'y':
 63 |             return True
 64 |         elif response == 'n':
 65 |             return False
 66 |         else:
 67 |             print("Invalid input. Please enter 'y' or 'n'.")
 68 | 
 69 | def create_event(name, start_date, end_date, timezone):
 70 |     """Creates a single event."""
 71 |     url = f"{GLOWNET_API_BASE_URL}/api/v2/events"
 72 |     payload = {
 73 |         "event": {
 74 |             "name": name,
 75 |             "start_date": start_date,
 76 |             "end_date": end_date,
 77 |             "timezone": timezone
 78 |         }
 79 |     }
 80 |     print(f"\nAttempting to create event: {name}...")
 81 |     print(f"Request URL: {url}")
 82 |     print(f"Request Headers: {HEADERS}")
 83 |     print(f"Request Payload: {payload}")
 84 |     
 85 |     try:
 86 |         response = requests.post(url, headers=HEADERS, json=payload)
 87 |         result = handle_response(response, success_status_codes=(201,))
 88 |         if result:
 89 |             print(f"Successfully created event:")
 90 |             print(f"  ID: {result.get('id')}")
 91 |             print(f"  Slug: {result.get('slug')}")
 92 |             print(f"  State: {result.get('state')}")
 93 |         return result
 94 |     except requests.exceptions.RequestException as e:
 95 |         print(f"  Network error creating event '{name}': {e}")
 96 |         return None
 97 | 
 98 | # --- Main Interactive Script ---
 99 | if __name__ == "__main__":
100 |     print("--- Glownet Event Creator ---")
101 |     print(f"API Base URL: {GLOWNET_API_BASE_URL}")
102 |     print("-" * 40)
103 | 
104 |     while True:
105 |         if not ask_yes_no("Do you want to create a new event?"):
106 |             break
107 | 
108 |         event_name = input("Enter the name for the new event: ").strip()
109 |         
110 |         # Get dates from user or use defaults
111 |         use_default_dates = ask_yes_no("Use default dates (today + 7 days)?")
112 |         
113 |         if use_default_dates:
114 |             now = datetime.now()
115 |             start_date = now.strftime("%d/%m/%Y %H:%M:%S")
116 |             end_date = (now + timedelta(days=7)).strftime("%d/%m/%Y %H:%M:%S")
117 |         else:
118 |             print("Enter dates in format DD/MM/YYYY HH:MM:SS")
119 |             start_date = input("Enter start date: ").strip()
120 |             end_date = input("Enter end date: ").strip()
121 | 
122 |         timezone = input("Enter timezone (default: Madrid): ").strip() or "Madrid"
123 | 
124 |         created_event_info = create_event(event_name, start_date, end_date, timezone)
125 |         
126 |         if created_event_info:
127 |             print("\nEvent created successfully!")
128 |             print("You can now use create_glownet_assets.py to add customers and G-Tags to this event.")
129 |         else:
130 |             print(f"\nFailed to create event '{event_name}'.")
131 |         
132 |         print("-" * 40)
133 | 
134 |     print("\nEvent Creation Script finished.")
135 | 


--------------------------------------------------------------------------------
/python/sync_cards.py:
--------------------------------------------------------------------------------
  1 | import os
  2 | import sys
  3 | import requests
  4 | import time
  5 | import json
  6 | from dotenv import load_dotenv
  7 | 
  8 | # --- Configuration ---
  9 | # Construct the path to .env.local relative to this script file
 10 | script_dir = os.path.dirname(os.path.abspath(__file__))
 11 | parent_dir = os.path.dirname(script_dir)  # Go up one level
 12 | dotenv_path = os.path.join(parent_dir, '.env.local')
 13 | 
 14 | print(f"Looking for .env.local at: {dotenv_path}")
 15 | if not os.path.exists(dotenv_path):
 16 |     print(f"Warning: .env.local not found at {dotenv_path}")
 17 |     
 18 | load_dotenv(dotenv_path=dotenv_path)
 19 | 
 20 | # App base URL will now point to the Next.js app
 21 | APP_BASE_URL = os.getenv("NEXT_PUBLIC_APP_URL", "http://localhost:3000")
 22 | GLOWNET_API_KEY = os.getenv("GLOWNET_API_KEY")
 23 | 
 24 | if not GLOWNET_API_KEY:
 25 |     print("Error: Required environment variables not set in .env.local")
 26 |     print("Required: GLOWNET_API_KEY")
 27 |     sys.exit(1)
 28 | 
 29 | def test_api_sync(sync_type="full", batch_size=50):
 30 |     """Tests the cards API sync endpoint."""
 31 |     url = f"{APP_BASE_URL}/api/cards/sync-glownet"
 32 |     
 33 |     headers = {
 34 |         "Content-Type": "application/json"
 35 |     }
 36 |     
 37 |     payload = {
 38 |         "type": sync_type,
 39 |         "batchSize": batch_size
 40 |     }
 41 |     
 42 |     print(f"Testing Card Sync API at: {url}")
 43 |     print(f"Parameters: {json.dumps(payload, indent=2)}")
 44 |     
 45 |     try:
 46 |         start_time = time.time()
 47 |         response = requests.post(url, json=payload, headers=headers)
 48 |         elapsed_time = time.time() - start_time
 49 |         
 50 |         print("\n" + "=" * 50)
 51 |         print(f"Response Status: {response.status_code}")
 52 |         print(f"Time taken: {elapsed_time:.2f} seconds")
 53 |         
 54 |         if response.status_code == 200:
 55 |             result = response.json()
 56 |             print("\nSync Results:")
 57 |             print(f"Message: {result.get('message', 'No message')}")
 58 |             
 59 |             if 'stats' in result:
 60 |                 stats = result['stats']
 61 |                 print(f"\nTotal cards processed: {stats.get('total', 0)}")
 62 |                 print(f"Synced: {stats.get('synced', 0)}")
 63 |                 print(f"Failed: {stats.get('failed', 0)}")
 64 |             
 65 |             return result
 66 |         else:
 67 |             print(f"Error: API returned status {response.status_code}")
 68 |             try:
 69 |                 error_details = response.json()
 70 |                 print(f"Error details: {json.dumps(error_details, indent=2)}")
 71 |             except:
 72 |                 print(f"Response text: {response.text}")
 73 |             return None
 74 |             
 75 |     except requests.exceptions.RequestException as e:
 76 |         print(f"Network error while testing API: {e}")
 77 |         return None
 78 | 
 79 | def test_cron_trigger():
 80 |     """Tests the cron trigger endpoint for cards sync."""
 81 |     url = f"{APP_BASE_URL}/api/cards/sync-glownet"
 82 |     
 83 |     print(f"Testing Card Sync Cron Trigger at: {url}")
 84 |     print("Note: This should return 401 Unauthorized since it's not coming from Vercel cron")
 85 |     
 86 |     try:
 87 |         response = requests.get(url)
 88 |         
 89 |         print("\n" + "=" * 50)
 90 |         print(f"Response Status: {response.status_code}")
 91 |         
 92 |         if response.status_code == 200:
 93 |             result = response.json()
 94 |             print("\nSync Results:")
 95 |             print(f"Message: {result.get('message', 'No message')}")
 96 |             
 97 |             if 'stats' in result:
 98 |                 stats = result['stats']
 99 |                 print(f"\nTotal cards processed: {stats.get('total', 0)}")
100 |                 print(f"Synced: {stats.get('synced', 0)}")
101 |                 print(f"Failed: {stats.get('failed', 0)}")
102 |                 
103 |             return result
104 |         else:
105 |             print(f"Expected error response: {response.status_code}")
106 |             try:
107 |                 error_details = response.json()
108 |                 print(f"Response details: {json.dumps(error_details, indent=2)}")
109 |             except:
110 |                 print(f"Response text: {response.text}")
111 |             return None
112 |             
113 |     except requests.exceptions.RequestException as e:
114 |         print(f"Network error while testing cron trigger: {e}")
115 |         return None
116 | 
117 | # --- Main Script ---
118 | if __name__ == "__main__":
119 |     print("=== Card Sync API Test Tool ===")
120 |     print(f"App Base URL: {APP_BASE_URL}")
121 |     print("=" * 40)
122 | 
123 |     if len(sys.argv) > 1 and sys.argv[1] == "cron":
124 |         # Test cron trigger endpoint
125 |         test_cron_trigger()
126 |     else:
127 |         # Test sync endpoint with parameters
128 |         sync_type = "full"
129 |         batch_size = 50
130 |         
131 |         # Parse command line arguments for sync_type and batch_size
132 |         if len(sys.argv) > 1:
133 |             sync_type = sys.argv[1]
134 |         if len(sys.argv) > 2:
135 |             try:
136 |                 batch_size = int(sys.argv[2])
137 |             except ValueError:
138 |                 print(f"Invalid batch size: {sys.argv[2]}, using default: 50")
139 |                 
140 |         test_api_sync(sync_type, batch_size)
141 |         
142 |     print("\nAPI test completed.") 


--------------------------------------------------------------------------------
/python/sync_venues.py:
--------------------------------------------------------------------------------
  1 | import os
  2 | import sys
  3 | import json
  4 | import requests
  5 | from dotenv import load_dotenv
  6 | import time
  7 | 
  8 | # --- Configuration ---
  9 | # Construct the path to .env.local relative to this script file
 10 | script_dir = os.path.dirname(os.path.abspath(__file__))
 11 | parent_dir = os.path.dirname(script_dir)  # Go up one level
 12 | dotenv_path = os.path.join(parent_dir, '.env.local')
 13 | 
 14 | print(f"Looking for .env.local at: {dotenv_path}")
 15 | if not os.path.exists(dotenv_path):
 16 |     print(f"Warning: .env.local not found at {dotenv_path}")
 17 |     
 18 | load_dotenv(dotenv_path=dotenv_path)
 19 | 
 20 | # App base URL will now point to the Next.js app
 21 | APP_BASE_URL = os.getenv("NEXT_PUBLIC_APP_URL", "http://localhost:3000")
 22 | GLOWNET_API_KEY = os.getenv("GLOWNET_API_KEY")
 23 | 
 24 | if not GLOWNET_API_KEY:
 25 |     print("Error: Required environment variables not set in .env.local")
 26 |     print("Required: GLOWNET_API_KEY")
 27 |     sys.exit(1)
 28 | 
 29 | def load_venue_images():
 30 |     """Load venue image mappings from JSON file"""
 31 |     image_file_path = os.path.join(script_dir, 'venue_images.json')
 32 |     try:
 33 |         with open(image_file_path, 'r') as f:
 34 |             data = json.load(f)
 35 |             return data.get('venue_images', {})
 36 |     except FileNotFoundError:
 37 |         print(f"Warning: venue_images.json not found at {image_file_path}")
 38 |         return {}
 39 |     except json.JSONDecodeError:
 40 |         print(f"Warning: venue_images.json at {image_file_path} is not valid JSON")
 41 |         return {}
 42 | 
 43 | def test_api_sync(sync_type="full", venue_images=None):
 44 |     """Tests the venues API sync endpoint."""
 45 |     url = f"{APP_BASE_URL}/api/venues/sync-glownet"
 46 |     
 47 |     headers = {
 48 |         "Content-Type": "application/json"
 49 |     }
 50 |     
 51 |     payload = {
 52 |         "type": sync_type,
 53 |         "venue_images": venue_images or {}
 54 |     }
 55 |     
 56 |     print(f"Testing Venue Sync API at: {url}")
 57 |     print(f"Parameters: {json.dumps(payload, indent=2)}")
 58 |     
 59 |     try:
 60 |         start_time = time.time()
 61 |         response = requests.post(url, json=payload, headers=headers)
 62 |         elapsed_time = time.time() - start_time
 63 |         
 64 |         print("\n" + "=" * 50)
 65 |         print(f"Response Status: {response.status_code}")
 66 |         print(f"Time taken: {elapsed_time:.2f} seconds")
 67 |         
 68 |         if response.status_code == 200:
 69 |             result = response.json()
 70 |             print("\nSync Results:")
 71 |             print(f"Message: {result.get('message', 'No message')}")
 72 |             
 73 |             if 'data' in result:
 74 |                 print(f"\nVenues synced: {len(result['data'])}")
 75 |                 print("Synced venues:")
 76 |                 for venue in result['data']:
 77 |                     print(f"- {venue.get('name', 'Unknown')} (ID: {venue.get('id', 'Unknown')})")
 78 |             
 79 |             return result
 80 |         else:
 81 |             print(f"Error: API returned status {response.status_code}")
 82 |             try:
 83 |                 error_details = response.json()
 84 |                 print(f"Error details: {json.dumps(error_details, indent=2)}")
 85 |             except:
 86 |                 print(f"Response text: {response.text}")
 87 |             return None
 88 |             
 89 |     except requests.exceptions.RequestException as e:
 90 |         print(f"Network error while testing API: {e}")
 91 |         return None
 92 | 
 93 | def test_cron_trigger():
 94 |     """Tests the cron trigger endpoint for venues sync."""
 95 |     url = f"{APP_BASE_URL}/api/venues/sync-glownet"
 96 |     
 97 |     print(f"Testing Venue Sync Cron Trigger at: {url}")
 98 |     print("Note: This should return 401 Unauthorized since it's not coming from Vercel cron")
 99 |     
100 |     try:
101 |         response = requests.get(url)
102 |         
103 |         print("\n" + "=" * 50)
104 |         print(f"Response Status: {response.status_code}")
105 |         
106 |         if response.status_code == 200:
107 |             result = response.json()
108 |             print("\nSync Results:")
109 |             print(f"Message: {result.get('message', 'No message')}")
110 |             return result
111 |         else:
112 |             print(f"Expected error response: {response.status_code}")
113 |             try:
114 |                 error_details = response.json()
115 |                 print(f"Response details: {json.dumps(error_details, indent=2)}")
116 |             except:
117 |                 print(f"Response text: {response.text}")
118 |             return None
119 |             
120 |     except requests.exceptions.RequestException as e:
121 |         print(f"Network error while testing cron trigger: {e}")
122 |         return None
123 | 
124 | # --- Main Script ---
125 | if __name__ == "__main__":
126 |     print("=== Venue Sync API Test Tool ===")
127 |     print(f"App Base URL: {APP_BASE_URL}")
128 |     print("=" * 40)
129 | 
130 |     # Load venue images
131 |     venue_images = load_venue_images()
132 |     print(f"Loaded {len(venue_images)} venue image mappings")
133 | 
134 |     if len(sys.argv) > 1 and sys.argv[1] == "cron":
135 |         # Test cron trigger endpoint
136 |         test_cron_trigger()
137 |     else:
138 |         # Test sync endpoint with parameters
139 |         sync_type = "full"
140 |         
141 |         # Parse command line arguments for sync_type
142 |         if len(sys.argv) > 1:
143 |             sync_type = sys.argv[1]
144 |                 
145 |         test_api_sync(sync_type, venue_images)
146 |         
147 |     print("\nAPI test completed.") 


--------------------------------------------------------------------------------
/python/venue_images.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "venue_images": {
 3 |     "802": {
 4 |       "image_url": "/novi1.png",
 5 |       "image_alt": "Noviciado"
 6 |     },
 7 |     "803": {
 8 |       "image_url": "/barrage-club.png",
 9 |       "image_alt": "Barrage Club"
10 |     },
11 |     "808": {
12 |       "image_url": "/berhta-club.png",
13 |       "image_alt": "Berhta Club"  
14 |     },
15 |     "804": {
16 |       "image_url": "/bloom-festival.png",
17 |       "image_alt": "Bloom Festival"
18 |     }
19 |   }
20 | } 


--------------------------------------------------------------------------------
/tsconfig.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "compilerOptions": {
 3 |     "target": "ES2017",
 4 |     "lib": ["dom", "dom.iterable", "esnext"],
 5 |     "allowJs": true,
 6 |     "skipLibCheck": true,
 7 |     "strict": true,
 8 |     "noEmit": true,
 9 |     "esModuleInterop": true,
10 |     "module": "esnext",
11 |     "moduleResolution": "bundler",
12 |     "resolveJsonModule": true,
13 |     "isolatedModules": true,
14 |     "jsx": "preserve",
15 |     "incremental": true,
16 |     "plugins": [
17 |       {
18 |         "name": "next"
19 |       }
20 |     ],
21 |     "paths": {
22 |       "@/*": ["./*"]
23 |     }
24 |   },
25 |   "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
26 |   "exclude": ["node_modules"]
27 | }
28 | 


--------------------------------------------------------------------------------
/vercel.json:
--------------------------------------------------------------------------------
 1 | {
 2 |     "crons": [
 3 |         {
 4 |             "path": "/api/venues/sync-glownet", 
 5 |             "schedule": "0 0 * * *"
 6 |         },
 7 |         {
 8 |             "path": "/api/cards/sync-glownet",
 9 |             "schedule": "30 0 * * *"
10 |         }
11 |     ]
12 | }


--------------------------------------------------------------------------------