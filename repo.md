├── .gitignore
├── .sql
├── README.md
├── app
    ├── api
    │   ├── card-status
    │   │   └── route.ts
    │   ├── create-profile-and-claim
    │   │   └── route.ts
    │   └── login-profile
    │   │   └── route.ts
    ├── card
    │   └── [card_id]
    │   │   └── page.tsx
    ├── components
    │   ├── auth
    │   │   ├── ConnectWallet.tsx
    │   │   ├── CreateProfileForm.tsx
    │   │   ├── LoginForm.tsx
    │   │   └── SignIn.tsx
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
    │   └── wallet
    │   │   └── WalletDashboard.tsx
    ├── context
    │   └── AuthContext.tsx
    ├── create-profile
    │   └── page.tsx
    ├── dashboard
    │   └── page.tsx
    ├── favicon.ico
    ├── globals.css
    ├── layout.tsx
    ├── login
    │   └── page.tsx
    ├── page.tsx
    └── register
    │   └── page.tsx
├── hooks
    └── useAuth.ts
├── lib
    ├── auth.ts
    ├── glownet.ts
    ├── supabase.ts
    └── utils.ts
├── middleware.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── public
    ├── file.svg
    ├── globe.svg
    ├── next.svg
    ├── vercel.svg
    └── window.svg
└── tsconfig.json


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
 1 | This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
 2 | 
 3 | ## Getting Started
 4 | 
 5 | First, run the development server:
 6 | 
 7 | ```bash
 8 | npm run dev
 9 | # or
10 | yarn dev
11 | # or
12 | pnpm dev
13 | # or
14 | bun dev
15 | ```
16 | 
17 | Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
18 | 
19 | You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
20 | 
21 | This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
22 | 
23 | ## Learn More
24 | 
25 | To learn more about Next.js, take a look at the following resources:
26 | 
27 | - [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
28 | - [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
29 | 
30 | You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
31 | 
32 | ## Deploy on Vercel
33 | 
34 | The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
35 | 
36 | Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
37 | 


--------------------------------------------------------------------------------
/app/api/card-status/route.ts:
--------------------------------------------------------------------------------
 1 | import { NextRequest, NextResponse } from 'next/server';
 2 | import { supabase } from '@/lib/supabase'; // Import your initialized client
 3 | 
 4 | // Opt out of caching and force dynamic rendering for this route
 5 | export const dynamic = 'force-dynamic';
 6 | 
 7 | export async function GET(request: NextRequest) {
 8 |   const { searchParams } = new URL(request.url);
 9 |   const cardIdentifier = searchParams.get('card_id'); // Get the readable ID
10 | 
11 |   if (!cardIdentifier) {
12 |     return NextResponse.json({ error: 'Card ID is required' }, { status: 400 });
13 |   }
14 | 
15 |   console.log(`API: Checking status for card identifier: ${cardIdentifier}`);
16 | 
17 |   try {
18 |     // Query the membership_cards table
19 |     const { data, error } = await supabase
20 |       .from('membership_cards')
21 |       .select('status, user_id') // Select the status and if a user is linked
22 |       .eq('card_identifier', cardIdentifier) // Match the readable identifier
23 |       .single(); // Expect only one card with this identifier
24 | 
25 |     if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is okay
26 |       console.error('Supabase query error:', error);
27 |       return NextResponse.json({ error: 'Error checking card status', details: error.message }, { status: 500 });
28 |     }
29 | 
30 |     if (!data) {
31 |       // Card identifier doesn't exist in the table
32 |       console.log(`Card identifier ${cardIdentifier} not found.`);
33 |       return NextResponse.json({ error: 'Card not found' }, { status: 404 });
34 |     }
35 | 
36 |     // Determine registration status based on whether user_id is set
37 |     const isRegistered = !!data.user_id; // True if user_id is not null
38 |     const status = isRegistered ? 'registered' : 'unregistered';
39 | 
40 |     console.log(`Card ${cardIdentifier} status: ${status} (User ID: ${data.user_id})`);
41 | 
42 |     return NextResponse.json({ 
43 |       cardId: cardIdentifier, // Return the identifier that was checked
44 |       status: status, 
45 |       isRegistered: isRegistered // Explicit boolean might be useful on client
46 |     });
47 | 
48 |   } catch (err) {
49 |     console.error('API route error:', err);
50 |     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
51 |   }
52 | } 


--------------------------------------------------------------------------------
/app/api/create-profile-and-claim/route.ts:
--------------------------------------------------------------------------------
  1 | import { NextResponse } from 'next/server';
  2 | import { createClient } from '@supabase/supabase-js';
  3 | import bcrypt from 'bcryptjs';
  4 | 
  5 | const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  6 | const supabaseAdminKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Admin Key
  7 | 
  8 | if (!supabaseUrl || !supabaseAdminKey) {
  9 |   console.error('Missing Supabase URL or Admin Key environment variables.');
 10 | }
 11 | 
 12 | const supabaseAdmin = createClient(supabaseUrl!, supabaseAdminKey!);
 13 | const SALT_ROUNDS = 10; // Standard for bcrypt
 14 | 
 15 | export async function POST(request: Request) {
 16 |   try {
 17 |     const {
 18 |       username,
 19 |       password,
 20 |       twitterHandle,
 21 |       telegramHandle,
 22 |       walletAddress,
 23 |       cardId
 24 |     } = await request.json();
 25 | 
 26 |     // 1. Validate Input
 27 |     if (!username || !password || !cardId) {
 28 |       return NextResponse.json({ error: 'Missing required fields: username, password, cardId' }, { status: 400 });
 29 |     }
 30 |     if (password.length < 6) { // Basic password length check
 31 |         return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
 32 |     }
 33 | 
 34 |     // 2. Check if username or wallet address already exists
 35 |     const { data: existingUser, error: findUserError } = await supabaseAdmin
 36 |         .from('profiles')
 37 |         .select('id, username, wallet_address')
 38 |         .or(`username.eq.${username},wallet_address.eq.${walletAddress ? walletAddress : 'null'}`) // Check both username and wallet if provided
 39 |         .maybeSingle(); // Use maybeSingle as walletAddress might be null
 40 | 
 41 |     if (findUserError) {
 42 |         console.error('Error checking for existing profile:', findUserError);
 43 |         throw new Error('Database error checking profile existence.');
 44 |     }
 45 | 
 46 |     if (existingUser) {
 47 |         if (existingUser.username === username) {
 48 |             return NextResponse.json({ error: 'Username already taken.' }, { status: 409 });
 49 |         }
 50 |         if (walletAddress && existingUser.wallet_address === walletAddress) {
 51 |             return NextResponse.json({ error: 'Wallet address already linked to another profile.' }, { status: 409 });
 52 |         }
 53 |         // If walletAddress was null and we found a match, it must be by username
 54 |         if (!walletAddress && existingUser.username === username) {
 55 |              return NextResponse.json({ error: 'Username already taken.' }, { status: 409 });
 56 |         }
 57 |     }
 58 | 
 59 | 
 60 |     // 3. Find the Membership Card and check its status
 61 |     const { data: cardData, error: cardError } = await supabaseAdmin
 62 |       .from('membership_cards')
 63 |       .select('id, user_id, status')
 64 |       .eq('card_identifier', cardId)
 65 |       .single(); // Expect exactly one card
 66 | 
 67 |     if (cardError || !cardData) {
 68 |         console.error('Error fetching card or card not found:', cardId, cardError);
 69 |         return NextResponse.json({ error: `Membership card with ID ${cardId} not found.` }, { status: 404 });
 70 |     }
 71 | 
 72 |     if (cardData.user_id) {
 73 |         console.warn(`Card ${cardId} already claimed by user ${cardData.user_id}`);
 74 |         return NextResponse.json({ error: 'This membership card has already been claimed.' }, { status: 409 }); // 409 Conflict
 75 |     }
 76 | 
 77 |     // 4. Hash Password
 78 |     const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
 79 | 
 80 |     // 5. Create Profile
 81 |     const { data: newProfile, error: profileCreateError } = await supabaseAdmin
 82 |       .from('profiles')
 83 |       .insert({
 84 |         username: username,
 85 |         password_hash: passwordHash,
 86 |         twitter_handle: twitterHandle,
 87 |         telegram_handle: telegramHandle,
 88 |         wallet_address: walletAddress,
 89 |       })
 90 |       .select('id') // Select the ID of the newly created profile
 91 |       .single();
 92 | 
 93 |     if (profileCreateError || !newProfile) {
 94 |       console.error('Error creating profile:', profileCreateError);
 95 |       // Log sensitive info only server-side
 96 |       console.error('Failed profile data:', { username, twitterHandle, telegramHandle, walletAddress });
 97 |       throw new Error('Database error creating profile.');
 98 |     }
 99 |     const profileId = newProfile.id;
100 |     console.log(`Profile created successfully: ${profileId} for username ${username}`);
101 | 
102 | 
103 |     // 6. Link Card to Profile
104 |     const { data: updateData, error: updateError } = await supabaseAdmin
105 |       .from('membership_cards')
106 |       .update({ user_id: profileId, status: 'registered' }) // Link to the new profile's ID
107 |       .eq('card_identifier', cardId)
108 |       .is('user_id', null) // Safety check: only update if user_id is still null
109 |       .select('id')
110 |       .single();
111 | 
112 |     if (updateError || !updateData) {
113 |       console.error('Error updating membership card:', cardId, profileId, updateError);
114 |       // CRITICAL: If card linking fails after profile creation, we have an orphaned profile.
115 |       // Ideally, wrap profile creation and card update in a transaction (requires Supabase function).
116 |       // For MVP, we log the error. Consider manual cleanup or a retry mechanism.
117 |       // Attempting to delete the profile we just created might be complex if other operations depend on it.
118 |       throw new Error('Database error linking card to profile. Profile was created but card linking failed.');
119 |     }
120 | 
121 |     console.log(`Card ${cardId} successfully linked to profile ${profileId}`);
122 | 
123 |     // 7. Return Success (do not return profile data or password hash)
124 |     return NextResponse.json({ message: 'Profile created and card claimed successfully!' });
125 | 
126 |   } catch (error: any) {
127 |     // --- Enhanced Error Logging --- 
128 |     console.error('-----------------------------------------');
129 |     console.error('CREATE PROFILE API ROUTE CRITICAL ERROR:');
130 |     console.error('Timestamp:', new Date().toISOString());
131 |     // Log the specific error object
132 |     console.error('Error Name:', error.name);
133 |     console.error('Error Message:', error.message);
134 |     console.error('Error Stack:', error.stack);
135 |     // Log incoming data (excluding password)
136 |     try {
137 |       const body = await request.clone().json().catch(() => ({}));
138 |       delete body.password; // Remove password before logging
139 |       console.error('Request Body (Filtered):', body);
140 |     } catch (logError) {
141 |         console.error('Error logging request body:', logError);
142 |     }
143 |     console.error('-----------------------------------------');
144 | 
145 |     // Avoid sending detailed internal errors to the client
146 |     const message = error.message.includes('Database error') || error.message.includes('already taken') || error.message.includes('already linked')
147 |         ? error.message
148 |         : 'An internal server error occurred during profile creation.';
149 |     // Determine status code based on common errors
150 |     const status = error.message.includes('already taken') || error.message.includes('already linked') ? 409 
151 |                  : error.message.includes('not found') ? 404 
152 |                  : 500;
153 |     return NextResponse.json({ error: message }, { status: status });
154 |   }
155 | } 


--------------------------------------------------------------------------------
/app/api/login-profile/route.ts:
--------------------------------------------------------------------------------
 1 | import { NextResponse } from 'next/server';
 2 | import { createClient } from '@supabase/supabase-js';
 3 | import bcrypt from 'bcryptjs';
 4 | 
 5 | const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
 6 | const supabaseAdminKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Admin Key
 7 | 
 8 | if (!supabaseUrl || !supabaseAdminKey) {
 9 |   console.error('Missing Supabase URL or Admin Key environment variables.');
10 | }
11 | 
12 | const supabaseAdmin = createClient(supabaseUrl!, supabaseAdminKey!);
13 | 
14 | export async function POST(request: Request) {
15 |   try {
16 |     const { username, password } = await request.json();
17 | 
18 |     // 1. Validate Input
19 |     if (!username || !password) {
20 |       return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
21 |     }
22 | 
23 |     // 2. Find Profile by Username
24 |     const { data: profile, error: findError } = await supabaseAdmin
25 |       .from('profiles')
26 |       .select('id, username, password_hash') // Select the hash
27 |       .eq('username', username)
28 |       .single(); // Expect exactly one user with this username
29 | 
30 |     if (findError) {
31 |         // Add specific log for find error
32 |         console.error(`[API Login] Supabase find error for username ${username}:`, findError);
33 |         // Still return generic message to client
34 |         return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
35 |     }
36 |     if (!profile) {
37 |       console.warn(`[API Login] Login attempt failed for username: ${username}. User not found.`);
38 |       return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 }); // Unauthorized
39 |     }
40 | 
41 |     // Ensure password_hash is valid before comparing
42 |     if (!profile.password_hash || typeof profile.password_hash !== 'string') {
43 |         console.error(`[API Login] Invalid or missing password hash for username: ${username}. Profile ID: ${profile.id}`);
44 |         // This indicates a problem during profile creation/update
45 |         return NextResponse.json({ error: 'Account configuration error. Please contact support.' }, { status: 500 });
46 |     }
47 | 
48 |     // 3. Compare Password Hashes
49 |     console.log(`[API Login] Comparing password for username: ${username}`); // Log before compare
50 |     const passwordMatch = await bcrypt.compare(password, profile.password_hash);
51 |     console.log(`[API Login] Password match result for ${username}:`, passwordMatch); // Log after compare
52 | 
53 |     if (!passwordMatch) {
54 |       console.warn(`Login attempt failed for username: ${username}. Incorrect password.`);
55 |       return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 }); // Unauthorized
56 |     }
57 | 
58 |     // 4. Login Successful
59 |     console.log(`Login successful for username: ${username}, Profile ID: ${profile.id}`);
60 | 
61 |     // IMPORTANT: In a real app, you would generate a session token (e.g., JWT) here,
62 |     // store it (e.g., in httpOnly cookies), and return it to the client.
63 |     // The client would then use this token for subsequent authenticated requests.
64 |     // For MVP, we just return success and let the client update its local state.
65 | 
66 |     return NextResponse.json({
67 |         message: 'Signed in successfully!',
68 |         // Optionally return non-sensitive profile info if needed by the client immediately
69 |         // profile: { id: profile.id, username: profile.username }
70 |     });
71 | 
72 |   } catch (error: any) {
73 |     // --- Enhanced Error Logging --- 
74 |     console.error('-----------------------------------------');
75 |     console.error('LOGIN API ROUTE CRITICAL ERROR:');
76 |     console.error('Timestamp:', new Date().toISOString());
77 |     // Log the specific error object
78 |     console.error('Error Name:', error.name);
79 |     console.error('Error Message:', error.message);
80 |     console.error('Error Stack:', error.stack);
81 |     // Log request details if possible (be careful with sensitive data)
82 |     // const requestBody = await request.clone().json().catch(() => ({})); // Avoid logging raw password
83 |     // console.error('Request Body (Username only):', { username: requestBody.username });
84 |     console.error('-----------------------------------------');
85 |     // Return generic error to client
86 |     return NextResponse.json({ error: 'An internal server error occurred during login.' }, { status: 500 });
87 |   }
88 | } 


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
/app/components/auth/CreateProfileForm.tsx:
--------------------------------------------------------------------------------
  1 | 'use client';
  2 | 
  3 | import React, { useState, useEffect, useCallback } from 'react';
  4 | import { useRouter, useSearchParams } from 'next/navigation';
  5 | import { useWallet } from '@solana/wallet-adapter-react';
  6 | import { Button } from '@/app/components/ui/button';
  7 | import { Input } from '@/app/components/ui/input';
  8 | import { Label } from '@/app/components/ui/label';
  9 | import { toast } from 'sonner';
 10 | import { useSimpleAuth } from '@/app/context/AuthContext';
 11 | import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'; // Use the pre-built button for convenience
 12 | import { ArrowLeft } from 'lucide-react';
 13 | 
 14 | export const CreateProfileForm: React.FC = () => {
 15 |   console.log("[CreateProfileForm] Component rendering start.");
 16 | 
 17 |   const router = useRouter();
 18 |   const searchParams = useSearchParams();
 19 |   const { login } = useSimpleAuth();
 20 |   const { publicKey, connected, connecting } = useWallet();
 21 | 
 22 |   const cardIdFromQuery = searchParams.get('cardId');
 23 | 
 24 |   const [username, setUsername] = useState('');
 25 |   const [password, setPassword] = useState('');
 26 |   const [twitterHandle, setTwitterHandle] = useState('');
 27 |   const [telegramHandle, setTelegramHandle] = useState('');
 28 |   const [isLoading, setIsLoading] = useState(false);
 29 | 
 30 |   useEffect(() => {
 31 |     if (!cardIdFromQuery) {
 32 |       toast.error('Missing membership card ID. Please go back and scan the card again.');
 33 |       // Consider redirecting back or disabling the form
 34 |       // router.replace('/');
 35 |     } else {
 36 |         console.log('Create Profile page loaded for card:', cardIdFromQuery);
 37 |     }
 38 |   }, [cardIdFromQuery, router]);
 39 | 
 40 |   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
 41 |     event.preventDefault();
 42 |     if (!cardIdFromQuery) {
 43 |         toast.error('Cannot create profile without a card ID.');
 44 |         return;
 45 |     }
 46 |     if (!username || !password) {
 47 |       toast.error('Username and password are required.');
 48 |       return;
 49 |     }
 50 |     // Optional: Add password strength validation
 51 | 
 52 |     setIsLoading(true);
 53 |     console.log('Submitting profile creation:', { username, cardIdFromQuery, publicKey: publicKey?.toBase58() });
 54 | 
 55 |     try {
 56 |       const response = await fetch('/api/create-profile-and-claim', {
 57 |         method: 'POST',
 58 |         headers: {
 59 |           'Content-Type': 'application/json',
 60 |         },
 61 |         body: JSON.stringify({
 62 |           username,
 63 |           password, // Send plain text, backend will hash
 64 |           twitterHandle: twitterHandle || null,
 65 |           telegramHandle: telegramHandle || null,
 66 |           walletAddress: publicKey?.toBase58() || null, // Send connected wallet address or null
 67 |           cardId: cardIdFromQuery,
 68 |         }),
 69 |       });
 70 | 
 71 |       const data = await response.json();
 72 | 
 73 |       if (!response.ok) {
 74 |         throw new Error(data.error || 'Failed to create profile and claim card.');
 75 |       }
 76 | 
 77 |       toast.success(data.message || 'Profile created and card claimed successfully!');
 78 |       login(); // Set logged in state
 79 |       router.push('/dashboard'); // Redirect to dashboard
 80 | 
 81 |     } catch (error: any) {
 82 |       console.error('Profile creation API error:', error);
 83 |       toast.error(error.message || 'An error occurred during profile creation.');
 84 |     } finally {
 85 |       setIsLoading(false);
 86 |     }
 87 |   };
 88 | 
 89 |   return (
 90 |     <div className="flex flex-col min-h-screen p-6">
 91 |        <button
 92 |         onClick={() => router.back()} // Simple back navigation
 93 |         className="self-start mb-8 p-2 rounded-full hover:bg-black/5 transition-colors"
 94 |         aria-label="Go back"
 95 |       >
 96 |         <ArrowLeft className="h-6 w-6" />
 97 |       </button>
 98 | 
 99 |       <div className="mb-10">
100 |         <h1 className="text-3xl font-bold mb-2">Create Your Profile</h1>
101 |         <p className="text-muted-foreground">
102 |             Claiming Membership Card: <span className="font-mono text-sm bg-gray-100 p-1 rounded text-black">{cardIdFromQuery || 'N/A'}</span>
103 |         </p>
104 |       </div>
105 | 
106 |       <form onSubmit={handleSubmit} className="space-y-6">
107 |         {/* Username */}
108 |         <div className="space-y-2">
109 |           <Label htmlFor="username">Username <span className="text-red-500">*</span></Label>
110 |           <Input
111 |             id="username"
112 |             type="text"
113 |             value={username}
114 |             onChange={(e) => setUsername(e.target.value)}
115 |             placeholder="your_username"
116 |             required
117 |             disabled={isLoading}
118 |             className="bg-white/50 backdrop-blur-sm border-gray-200"
119 |           />
120 |         </div>
121 | 
122 |         {/* Password */}
123 |         <div className="space-y-2">
124 |           <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
125 |           <Input
126 |             id="password"
127 |             type="password"
128 |             value={password}
129 |             onChange={(e) => setPassword(e.target.value)}
130 |             placeholder="••••••••"
131 |             required
132 |             disabled={isLoading}
133 |             className="bg-white/50 backdrop-blur-sm border-gray-200"
134 |           />
135 |           {/* Add password requirements hint if needed */}
136 |         </div>
137 | 
138 |         {/* Twitter (Optional) */}
139 |         <div className="space-y-2">
140 |           <Label htmlFor="twitter">X / Twitter Handle (Optional)</Label>
141 |           <Input
142 |             id="twitter"
143 |             type="text"
144 |             value={twitterHandle}
145 |             onChange={(e) => setTwitterHandle(e.target.value)}
146 |             placeholder="@yourhandle"
147 |             disabled={isLoading}
148 |             className="bg-white/50 backdrop-blur-sm border-gray-200"
149 |           />
150 |         </div>
151 | 
152 |         {/* Telegram (Optional) */}
153 |         <div className="space-y-2">
154 |           <Label htmlFor="telegram">Telegram Handle (Optional)</Label>
155 |           <Input
156 |             id="telegram"
157 |             type="text"
158 |             value={telegramHandle}
159 |             onChange={(e) => setTelegramHandle(e.target.value)}
160 |             placeholder="@yourhandle"
161 |             disabled={isLoading}
162 |             className="bg-white/50 backdrop-blur-sm border-gray-200"
163 |           />
164 |         </div>
165 | 
166 |         {/* Wallet Connect (Optional) */}
167 |         <div className="space-y-2 border-t pt-6 mt-4">
168 |           <Label>Connect Wallet (Optional)</Label>
169 |            <p className="text-sm text-muted-foreground pb-2">
170 |             Connect your Solana wallet to link it to your profile.
171 |           </p>
172 |           {/* Use the pre-built UI button */}
173 |           <WalletMultiButton style={{ width: '100%', justifyContent: 'center' }} />
174 |           {connected && publicKey && (
175 |             <p className="text-xs text-green-600 pt-1">Wallet Connected: {publicKey.toBase58().substring(0, 4)}...{publicKey.toBase58().substring(publicKey.toBase58().length - 4)}</p>
176 |           )}
177 |         </div>
178 | 
179 |         {/* Submit Button */}
180 |         <Button
181 |           type="submit"
182 |           className="w-full glass-button mt-4"
183 |           disabled={isLoading || !cardIdFromQuery} // Disable if loading or no card ID
184 |         >
185 |           {isLoading ? 'Creating Profile...' : 'Create Profile & Claim Card'}
186 |         </Button>
187 |       </form>
188 |     </div>
189 |   );
190 | }; 


--------------------------------------------------------------------------------
/app/components/auth/LoginForm.tsx:
--------------------------------------------------------------------------------
  1 | 'use client';
  2 | 
  3 | import React, { useState } from 'react';
  4 | import { useRouter } from 'next/navigation';
  5 | import Link from 'next/link';
  6 | import { Button } from '@/app/components/ui/button';
  7 | import { Input } from '@/app/components/ui/input';
  8 | import { Label } from '@/app/components/ui/label';
  9 | import { toast } from 'sonner';
 10 | import { useSimpleAuth } from '@/app/context/AuthContext';
 11 | import { ArrowLeft } from 'lucide-react';
 12 | 
 13 | export const LoginForm: React.FC = () => {
 14 |   const router = useRouter();
 15 |   const { login } = useSimpleAuth();
 16 | 
 17 |   const [username, setUsername] = useState('');
 18 |   const [password, setPassword] = useState('');
 19 |   const [isLoading, setIsLoading] = useState(false);
 20 | 
 21 |   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
 22 |     event.preventDefault();
 23 |     if (!username || !password) {
 24 |       toast.error('Username and password are required.');
 25 |       return;
 26 |     }
 27 | 
 28 |     setIsLoading(true);
 29 | 
 30 |     try {
 31 |       const response = await fetch('/api/login-profile', {
 32 |         method: 'POST',
 33 |         headers: {
 34 |           'Content-Type': 'application/json',
 35 |         },
 36 |         body: JSON.stringify({ username, password }),
 37 |       });
 38 | 
 39 |       const data = await response.json();
 40 | 
 41 |       if (!response.ok) {
 42 |         throw new Error(data.error || 'Login failed.');
 43 |       }
 44 | 
 45 |       toast.success(data.message || 'Signed in successfully!');
 46 |       login(); // Update auth state
 47 |       router.push('/dashboard'); // Redirect
 48 | 
 49 |     } catch (error: any) {
 50 |       console.error('Login API error:', error);
 51 |       toast.error(error.message || 'An error occurred during login.');
 52 |     } finally {
 53 |       setIsLoading(false);
 54 |     }
 55 |   };
 56 | 
 57 |   return (
 58 |     <div className="flex flex-col min-h-screen p-6">
 59 |        <button
 60 |         onClick={() => router.back()}
 61 |         className="self-start mb-8 p-2 rounded-full hover:bg-black/5 transition-colors"
 62 |         aria-label="Go back"
 63 |       >
 64 |         <ArrowLeft className="h-6 w-6" />
 65 |       </button>
 66 | 
 67 |       <div className="mb-10">
 68 |         <h1 className="text-3xl font-bold mb-2">Sign In</h1>
 69 |         <p className="text-muted-foreground">Access your Samachi membership</p>
 70 |       </div>
 71 | 
 72 |       <form onSubmit={handleSubmit} className="space-y-6">
 73 |         <div className="space-y-2">
 74 |           <Label htmlFor="username">Username</Label>
 75 |           <Input
 76 |             id="username"
 77 |             type="text"
 78 |             value={username}
 79 |             onChange={(e) => setUsername(e.target.value)}
 80 |             placeholder="your_username"
 81 |             required
 82 |             disabled={isLoading}
 83 |             className="bg-white/50 backdrop-blur-sm border-gray-200"
 84 |             autoComplete="username"
 85 |           />
 86 |         </div>
 87 | 
 88 |         <div className="space-y-2">
 89 |           <Label htmlFor="password">Password</Label>
 90 |           <Input
 91 |             id="password"
 92 |             type="password"
 93 |             value={password}
 94 |             onChange={(e) => setPassword(e.target.value)}
 95 |             placeholder="••••••••"
 96 |             required
 97 |             disabled={isLoading}
 98 |             className="bg-white/50 backdrop-blur-sm border-gray-200"
 99 |             autoComplete="current-password"
100 |           />
101 |         </div>
102 | 
103 |         <Button
104 |           type="submit"
105 |           className="w-full glass-button"
106 |           disabled={isLoading}
107 |         >
108 |           {isLoading ? 'Signing In...' : 'Sign In'}
109 |         </Button>
110 | 
111 |         {/* Link to create profile if they landed here by mistake? Or is CardLanding the only entry? */}
112 |         {/* For MVP, maybe omit this link if flow is strictly Card -> Create or Card -> Login */}
113 |         {/* <p className="text-center text-sm">
114 |           Don't have an account? You need a membership card to sign up.
115 |           <Link href="/" className="text-primary font-medium hover:underline"> Learn More</Link> 
116 |         </p> */}
117 |       </form>
118 |     </div>
119 |   );
120 | }; 


--------------------------------------------------------------------------------
/app/components/discover/DiscoverVenues.tsx:
--------------------------------------------------------------------------------
 1 | 'use client';
 2 | 
 3 | import React, { useState } from 'react';
 4 | import { List, Map, Search } from 'lucide-react';
 5 | import { Input } from '@/app/components/ui/input';
 6 | import { VenueList } from './VenueList';
 7 | import { VenueMap } from './VenueMap';
 8 | 
 9 | export const DiscoverVenues: React.FC = () => {
10 |   const [view, setView] = useState<'list' | 'map'>('list');
11 |   const [searchQuery, setSearchQuery] = useState('');
12 | 
13 |   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
14 |     setSearchQuery(e.target.value);
15 |   };
16 | 
17 |   return (
18 |     <div className="flex flex-col pt-10 pb-20 px-6">
19 |       <div className="mb-6 animate-fade-in">
20 |         <h1 className="text-2xl font-bold mb-1">Search Venues & Festivals</h1>
21 |         <p className="text-muted-foreground">Access exclusive benefits worldwide</p>
22 |       </div>
23 | 
24 |       <div className="mb-6 animate-fade-in">
25 |         <div className="relative">
26 |           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
27 |           <Input
28 |             value={searchQuery}
29 |             onChange={handleSearchChange}
30 |             placeholder="Search venues..."
31 |             className="pl-10 bg-white/50 backdrop-blur-sm border-gray-200"
32 |           />
33 |         </div>
34 |       </div>
35 | 
36 |       <div className="mb-6 flex justify-center space-x-2 animate-fade-in">
37 |         <button
38 |           onClick={() => setView('list')}
39 |           className={`px-4 py-2 rounded-lg flex items-center ${
40 |             view === 'list' 
41 |               ? 'bg-primary text-white' 
42 |               : 'bg-white/50 text-muted-foreground'
43 |           }`}
44 |         >
45 |           <List className="h-4 w-4 mr-2" />
46 |           List
47 |         </button>
48 |         <button
49 |           onClick={() => setView('map')}
50 |           className={`px-4 py-2 rounded-lg flex items-center ${
51 |             view === 'map' 
52 |               ? 'bg-primary text-white' 
53 |               : 'bg-white/50 text-muted-foreground'
54 |           }`}
55 |         >
56 |           <Map className="h-4 w-4 mr-2" />
57 |           Map
58 |         </button>
59 |       </div>
60 | 
61 |       <div className="animate-fade-in">
62 |         {view === 'list' ? <VenueList searchQuery={searchQuery} /> : <VenueMap searchQuery={searchQuery} />}
63 |       </div>
64 |     </div>
65 |   );
66 | };
67 | 


--------------------------------------------------------------------------------
/app/components/discover/VenueList.tsx:
--------------------------------------------------------------------------------
 1 | 'use client';
 2 | 
 3 | import React, { useMemo } from 'react';
 4 | import { useRouter } from 'next/navigation';
 5 | import { MapPin, ExternalLink } from 'lucide-react';
 6 | 
 7 | // TODO: Replace with actual venues from the database
 8 | const venues = [
 9 |   {
10 |     id: '1',
11 |     name: 'El Noviciado',
12 |     location: 'Social Club, Madrid',
13 |     description: 'Exclusive social club with live music and intimate ambiance',
14 |     image: '/images/novi1.png',
15 |   },
16 |   {
17 |     id: '2',
18 |     name: 'Bloom Festival',
19 |     location: 'Festival, Malta',
20 |     description: 'High-energy festival featuring world-class DJs and performers',
21 |     image: '/images/bloom-festival.png',
22 |   },
23 |   {
24 |     id: '3',
25 |     name: 'Barrage Club',
26 |     location: 'Nightclub, Greece',
27 |     description: 'Beachfront club with stunning ocean views and premium service',
28 |     image: '/images/barrage-club.png',
29 |   },
30 |   {
31 |     id: '4',
32 |     name: 'Berhta Club',
33 |     location: 'Social Club, Washington D.C.',
34 |     description: 'Sophisticated venue with elegant design and premium atmosphere',
35 |     image: '/images/berhta-club.png',
36 |   },
37 | ];
38 | 
39 | // Define props including searchQuery
40 | interface VenueListProps {
41 |   searchQuery: string;
42 | }
43 | 
44 | export const VenueList: React.FC<VenueListProps> = ({ searchQuery }) => {
45 |   const router = useRouter();
46 | 
47 |   // Filter venues based on search query
48 |   const filteredVenues = useMemo(() => {
49 |     if (!searchQuery) {
50 |       return venues;
51 |     }
52 |     return venues.filter(venue => 
53 |       venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
54 |       venue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
55 |       venue.description.toLowerCase().includes(searchQuery.toLowerCase())
56 |     );
57 |   }, [searchQuery]);
58 | 
59 |   const handleVenueClick = (venueId: string) => {
60 |     router.push(`/venue/${venueId}`);
61 |   };
62 | 
63 |   return (
64 |     <div className="space-y-4">
65 |       {filteredVenues.map((venue) => (
66 |         <div 
67 |           key={venue.id} 
68 |           className="glass-card overflow-hidden cursor-pointer"
69 |           onClick={() => handleVenueClick(venue.id)}
70 |         >
71 |           <div className="h-48 relative overflow-hidden">
72 |             <img 
73 |               src={venue.image} 
74 |               alt={venue.name} 
75 |               className="w-full h-full object-cover"
76 |             />
77 |           </div>
78 |           
79 |           <div className="p-4">
80 |             <h3 className="text-lg font-semibold mb-1">{venue.name}</h3>
81 |             <p className="text-xs text-muted-foreground flex items-center mb-2">
82 |               <MapPin className="h-3 w-3 mr-1" />
83 |               {venue.location}
84 |             </p>
85 |             <p className="text-sm mb-3">{venue.description}</p>
86 |             <button className="text-primary text-sm font-medium flex items-center">
87 |               View Details 
88 |               <ExternalLink className="h-3 w-3 ml-1" />
89 |             </button>
90 |           </div>
91 |         </div>
92 |       ))}
93 |       {filteredVenues.length === 0 && (
94 |         <p className="text-center text-muted-foreground">No venues found matching your search.</p>
95 |       )}
96 |     </div>
97 |   );
98 | };
99 | 


--------------------------------------------------------------------------------
/app/components/discover/VenueMap.tsx:
--------------------------------------------------------------------------------
 1 | 'use client';
 2 | 
 3 | import React, { useMemo } from 'react';
 4 | 
 5 | // TODO: Replace with actual venues from the database, implement Map
 6 | const venues = [
 7 |   { id: '1', name: 'El Noviciado', location: 'Madrid', coords: { lat: 40.4168, lng: -3.7038 }, image: '/images/novi1.png' },
 8 |   { id: '2', name: 'Bloom Festival', location: 'Malta', coords: { lat: 35.9375, lng: 14.3754 }, image: '/images/bloom-festival.png' },
 9 |   { id: '3', name: 'Barrage Club', location: 'Greece', coords: { lat: 39.0742, lng: 21.8243 }, image: '/images/barrage-club.png' },
10 |   { id: '4', name: 'Berhta Club', location: 'Washington D.C.', coords: { lat: 38.9072, lng: -77.0369 }, image: '/images/berhta-club.png' },
11 | ];
12 | 
13 | // Define props including searchQuery
14 | interface VenueMapProps {
15 |   searchQuery: string;
16 | }
17 | 
18 | export const VenueMap: React.FC<VenueMapProps> = ({ searchQuery }) => {
19 | 
20 |   // Filter venues based on search query for map markers
21 |   const filteredVenues = useMemo(() => {
22 |     if (!searchQuery) {
23 |       return venues;
24 |     }
25 |     // Simple filter for map, adjust as needed
26 |     return venues.filter(venue => 
27 |       venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
28 |       venue.location.toLowerCase().includes(searchQuery.toLowerCase())
29 |     );
30 |   }, [searchQuery]);
31 | 
32 |   return (
33 |     <div className="glass-card h-96 relative overflow-hidden">
34 |       <div className="absolute inset-0 flex items-center justify-center">
35 |         <div className="w-full h-full bg-gray-100 relative">
36 |           {/* Simple map placeholder */}
37 |           <svg 
38 |             viewBox="0 0 1000 500" 
39 |             className="w-full h-full opacity-70"
40 |             xmlns="http://www.w3.org/2000/svg"
41 |           >
42 |             {/* Placeholder shapes */}
43 |             <path d="M100,100 h800 v300 h-800 Z" fill="#E5E7EB" stroke="#9CA3AF" /> 
44 |             {/* Basic World Representation (adjust as needed) */}
45 |             <text x="500" y="250" fontSize="20" textAnchor="middle" fill="#6B7280">
46 |               Map Area (Interactive Map Coming Soon)
47 |             </text>
48 |           </svg>
49 | 
50 |           {/* TODO: Integrate a real map library (Leaflet, Mapbox GL JS, Google Maps) */}
51 |           {/* For now, just indicate filtered results */}
52 |           <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md p-2 rounded shadow">
53 |             <p className="text-xs text-muted-foreground">
54 |               {filteredVenues.length} venue(s) found {searchQuery ? `matching "${searchQuery}"` : ''}
55 |             </p>
56 |           </div>
57 | 
58 |           {/* Placeholder for markers - replace with actual map markers */}
59 |           {/* These positions are arbitrary for the placeholder */}
60 |           {filteredVenues.map((venue, index) => (
61 |             <div 
62 |               key={venue.id}
63 |               className="absolute w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-md"
64 |               style={{ 
65 |                 left: `${20 + index * 10}%`, // Example positioning
66 |                 top: `${40 + (index % 2) * 20}%`, // Example positioning
67 |                }}
68 |               title={`${venue.name} - ${venue.location}`}
69 |             ></div>
70 |           ))}
71 | 
72 |         </div>
73 |       </div>
74 |     </div>
75 |   );
76 | };
77 | 


--------------------------------------------------------------------------------
/app/components/home/Dashboard.tsx:
--------------------------------------------------------------------------------
  1 | 'use client';
  2 | 
  3 | import React, { useState } from 'react';
  4 | import { useRouter } from 'next/navigation';
  5 | import Link from 'next/link';
  6 | import { Card } from '@/app/components/ui/card';
  7 | import { Button } from '@/app/components/ui/button';
  8 | import { CreditCard, MapPin, Plus, Wallet } from 'lucide-react';
  9 | import { StakingModal } from './StakingModal';
 10 | 
 11 | export const Dashboard: React.FC = () => {
 12 |   const router = useRouter();
 13 |   const [showStakingModal, setShowStakingModal] = useState(false);
 14 |   
 15 |   const featuredVenues = [
 16 |     { id: '1', name: 'El Noviciado', location: 'Social Club, Madrid', image: '/images/novi1.png' },
 17 |     { id: '2', name: 'Bloom Festival', location: 'Festival, Malta', image: '/images/bloom-festival.png' },
 18 |     { id: '3', name: 'Barrage Club', location: 'Nightclub, Greece', image: '/images/barrage-club.png' },
 19 |     { id: '4', name: 'Berhta Club', location: 'Social Club, Washington D.C.', image: '/images/berhta-club.png' },
 20 |   ];
 21 | 
 22 |   const stakedAmount = 1.25;
 23 |   const stakedSymbol = 'SOL';
 24 |   const availableCredit = 2500;
 25 |   const creditProgress = 80;
 26 | 
 27 |   return (
 28 |     <div className="flex flex-col pt-10 pb-20 px-6">
 29 |       <div className="mb-8 animate-fade-in">
 30 |         <h1 className="text-2xl font-bold mb-1">Samachi Membership</h1>
 31 |         <p className="text-muted-foreground">Your VIP access is ready</p>
 32 |       </div>
 33 | 
 34 |       <div className="glass-card p-6 mb-8 animate-fade-in">
 35 |         <div className="flex justify-between items-start mb-6">
 36 |           <div>
 37 |             <h2 className="text-lg font-medium mb-1">Your Credit Line</h2>
 38 |             <p className="text-sm text-muted-foreground">Available for all venues</p>
 39 |           </div>
 40 |           <CreditCard className="h-6 w-6 text-primary" />
 41 |         </div>
 42 |         
 43 |         <div className="mb-6">
 44 |           <div className="flex justify-between items-center mb-2">
 45 |             <span className="text-sm text-muted-foreground">Staked Amount</span>
 46 |             <span className="font-semibold">{stakedAmount} {stakedSymbol}</span>
 47 |           </div>
 48 |           <div className="flex justify-between items-center mb-2">
 49 |             <span className="text-sm text-muted-foreground">Available Credit</span>
 50 |             <span className="font-semibold text-lg">€{availableCredit.toLocaleString()}</span>
 51 |           </div>
 52 |           <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
 53 |             <div 
 54 |               className="h-full bg-primary rounded-full" 
 55 |               style={{ width: `${creditProgress}%` }}
 56 |             />
 57 |           </div>
 58 |         </div>
 59 |         
 60 |         <div className="flex gap-2">
 61 |           <Button 
 62 |             onClick={() => setShowStakingModal(true)}
 63 |             className="flex-1 glass-button"
 64 |           >
 65 |             <Plus className="mr-2 h-4 w-4" /> Stake More
 66 |           </Button>
 67 |           <Button 
 68 |             onClick={() => router.push('/wallet')}
 69 |             variant="outline"
 70 |             className="flex-1 bg-white/50 backdrop-blur-sm hover:bg-white/60"
 71 |           >
 72 |             <Wallet className="mr-2 h-4 w-4" /> Wallet
 73 |           </Button>
 74 |         </div>
 75 |       </div>
 76 | 
 77 |       <div className="mb-6 animate-fade-in">
 78 |         <div className="flex justify-between items-center mb-3">
 79 |           <h2 className="text-lg font-semibold">Featured Venues</h2>
 80 |           <Link href="/discover" className="text-primary text-sm font-medium">
 81 |             See All
 82 |           </Link>
 83 |         </div>
 84 |         
 85 |         <div className="flex overflow-x-auto pb-2 -mx-2 scrollbar-none">
 86 |           {featuredVenues.map((venue) => (
 87 |             <div key={venue.id} className="px-2 min-w-[250px]">
 88 |               <Link href={`/venue/${venue.id}`}>
 89 |                 <div 
 90 |                   className="glass-card h-48 overflow-hidden relative block cursor-pointer"
 91 |                 >
 92 |                   <img 
 93 |                     src={venue.image} 
 94 |                     alt={venue.name} 
 95 |                     className="h-full w-full object-cover"
 96 |                   />
 97 |                   <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/40 backdrop-blur-sm">
 98 |                     <h3 className="text-base font-semibold mb-1 text-white">{venue.name}</h3>
 99 |                     <p className="text-xs text-white/80 flex items-center">
100 |                       <MapPin className="h-3 w-3 mr-1" />
101 |                       {venue.location}
102 |                     </p>
103 |                   </div>
104 |                 </div>
105 |               </Link>
106 |             </div>
107 |           ))}
108 |         </div>
109 |       </div>
110 | 
111 |       {showStakingModal && (
112 |         <StakingModal onClose={() => setShowStakingModal(false)} />
113 |       )}
114 |     </div>
115 |   );
116 | };
117 | 


--------------------------------------------------------------------------------
/app/components/home/StakingModal.tsx:
--------------------------------------------------------------------------------
  1 | 'use client';
  2 | 
  3 | import React, { useState } from 'react';
  4 | import { Button } from '@/app/components/ui/button';
  5 | import { XCircle, ChevronDown, Check, ChevronRight } from 'lucide-react';
  6 | 
  7 | interface StakingModalProps {
  8 |   onClose: () => void;
  9 | }
 10 | 
 11 | const cryptoOptions = [
 12 |   { id: 'eth', name: 'Ethereum', symbol: 'ETH', icon: '🔷' },
 13 |   { id: 'usdt', name: 'Tether', symbol: 'USDT', icon: '💵' },
 14 |   { id: 'usdc', name: 'USD Coin', symbol: 'USDC', icon: '💰' },
 15 |   // Add SOL or other relevant cryptos if needed
 16 |   // { id: 'sol', name: 'Solana', symbol: 'SOL', icon: '☀️' }, 
 17 | ];
 18 | 
 19 | export const StakingModal: React.FC<StakingModalProps> = ({ onClose }) => {
 20 |   const [selectedCrypto, setSelectedCrypto] = useState(cryptoOptions[0]);
 21 |   const [showCryptoSelector, setShowCryptoSelector] = useState(false);
 22 |   const [amount, setAmount] = useState('');
 23 |   const [step, setStep] = useState(1);
 24 | 
 25 |   const handleStake = () => {
 26 |     setStep(2);
 27 |     // TODO: Add actual staking logic here (e.g., call backend/contract)
 28 |     console.log(`Simulating stake of ${amount} ${selectedCrypto.symbol}`);
 29 |     setTimeout(() => {
 30 |       // TODO: Update user balance/state after successful stake
 31 |       onClose();
 32 |     }, 2000);
 33 |   };
 34 | 
 35 |   // Type the event
 36 |   const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 37 |     setAmount(e.target.value);
 38 |   };
 39 | 
 40 |   return (
 41 |     <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 animate-fade-in">
 42 |       <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
 43 |       
 44 |       <div className="bottom-sheet max-w-md w-full z-10">
 45 |         <div className="flex justify-between items-center mb-4">
 46 |           <h2 className="text-xl font-semibold">
 47 |             {step === 1 ? 'Stake Crypto' : 'Confirming Stake'}
 48 |           </h2>
 49 |           <button 
 50 |             onClick={onClose}
 51 |             className="p-1 rounded-full hover:bg-black/5"
 52 |           >
 53 |             <XCircle className="h-6 w-6 text-gray-500" />
 54 |           </button>
 55 |         </div>
 56 |         
 57 |         {step === 1 ? (
 58 |           <>
 59 |             <p className="text-muted-foreground mb-6">
 60 |               Stake assets to increase your available credit line
 61 |             </p>
 62 | 
 63 |             <div className="mb-6">
 64 |               <label className="text-sm font-medium mb-2 block">
 65 |                 Select Asset
 66 |               </label>
 67 |               <button
 68 |                 onClick={() => setShowCryptoSelector(!showCryptoSelector)}
 69 |                 className="w-full p-3 rounded-xl bg-white flex items-center justify-between border border-gray-200"
 70 |               >
 71 |                 <div className="flex items-center">
 72 |                   <span className="text-2xl mr-2">{selectedCrypto.icon}</span>
 73 |                   <div>
 74 |                     <div className="font-medium">{selectedCrypto.name}</div>
 75 |                     <div className="text-xs text-muted-foreground">{selectedCrypto.symbol}</div>
 76 |                   </div>
 77 |                 </div>
 78 |                 <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${showCryptoSelector ? 'rotate-180' : ''}`} />
 79 |               </button>
 80 |               
 81 |               {showCryptoSelector && (
 82 |                 <div className="mt-1 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg">
 83 |                   {cryptoOptions.map((crypto) => (
 84 |                     <button
 85 |                       key={crypto.id}
 86 |                       onClick={() => {
 87 |                         setSelectedCrypto(crypto);
 88 |                         setShowCryptoSelector(false);
 89 |                       }}
 90 |                       className="w-full p-3 flex items-center justify-between hover:bg-gray-50"
 91 |                     >
 92 |                       <div className="flex items-center">
 93 |                         <span className="text-xl mr-2">{crypto.icon}</span>
 94 |                         <div className="font-medium">{crypto.name}</div>
 95 |                       </div>
 96 |                       {selectedCrypto.id === crypto.id && (
 97 |                         <Check className="h-5 w-5 text-primary" />
 98 |                       )}
 99 |                     </button>
100 |                   ))}
101 |                 </div>
102 |               )}
103 |             </div>
104 | 
105 |             <div className="mb-8">
106 |               <label className="text-sm font-medium mb-2 block">
107 |                 Amount
108 |               </label>
109 |               <div className="relative">
110 |                 <input 
111 |                   type="number"
112 |                   value={amount}
113 |                   // onChange={(e) => setAmount(e.target.value)} // Replace
114 |                   onChange={handleAmountChange} // Use typed handler
115 |                   placeholder="0.00"
116 |                   className="w-full p-3 pr-16 rounded-xl bg-white border border-gray-200 text-xl font-medium"
117 |                 />
118 |                 <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
119 |                   {selectedCrypto.symbol}
120 |                 </div>
121 |               </div>
122 |               <div className="mt-2 flex justify-between">
123 |                 <div className="text-xs text-muted-foreground">
124 |                   {/* TODO: Replace with actual available balance */}
125 |                   Available: 2.5 {selectedCrypto.symbol} 
126 |                 </div>
127 |                 <button className="text-xs text-primary font-medium">
128 |                   MAX
129 |                 </button>
130 |               </div>
131 |             </div>
132 | 
133 |             <Button 
134 |               onClick={handleStake}
135 |               disabled={!amount || parseFloat(amount) <= 0} // Add amount validation
136 |               className="w-full glass-button"
137 |             >
138 |               Stake {selectedCrypto.symbol}
139 |               <ChevronRight className="ml-2 h-4 w-4" />
140 |             </Button>
141 |           </>
142 |         ) : (
143 |           <div className="py-4 text-center">
144 |             <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
145 |               <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
146 |             </div>
147 |             <h3 className="text-lg font-medium mb-2">Processing Your Stake</h3>
148 |             <p className="text-muted-foreground mb-4">
149 |               Please wait while we process your {amount} {selectedCrypto.symbol} stake
150 |             </p>
151 |             <div className="text-sm text-muted-foreground">
152 |               This may take a few moments to complete
153 |             </div>
154 |           </div>
155 |         )}
156 |       </div>
157 |     </div>
158 |   );
159 | };
160 | 


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
/app/components/onboarding/CardLanding.tsx:
--------------------------------------------------------------------------------
  1 | // src/components/onboarding/CardLanding.tsx
  2 | 'use client';
  3 | 
  4 | import React, { useEffect, useState } from 'react';
  5 | import { useParams, useRouter } from 'next/navigation';
  6 | import { Button } from '@/app/components/ui/button';
  7 | // import useAuth from '@/hooks/useAuth'; // Remove old auth hook
  8 | import { useSimpleAuth } from '@/app/context/AuthContext'; // Import the new simple auth hook
  9 | 
 10 | export const CardLanding = () => {
 11 |   const params = useParams();
 12 |   const router = useRouter();
 13 |   const card_id = params?.card_id as string | undefined;
 14 |   // const { user, loading: authLoading, logout } = useAuth(); // Remove old auth state
 15 |   const { isLoggedIn } = useSimpleAuth(); // Use simple auth state
 16 | 
 17 |   // State for card status check
 18 |   const [cardStatus, setCardStatus] = useState<'loading' | 'unregistered' | 'registered' | 'not_found' | 'error'>('loading');
 19 |   const [cardError, setCardError] = useState<string | null>(null);
 20 | 
 21 |   useEffect(() => {
 22 |     // Redirect logged-in users immediately
 23 |     if (isLoggedIn) {
 24 |       console.log('CardLanding: User is logged in, redirecting to /dashboard');
 25 |       router.replace('/dashboard');
 26 |       return; // Don't proceed if already logged in
 27 |     }
 28 | 
 29 |     // Fetch card status only if not logged in and card_id is present
 30 |     if (!isLoggedIn && card_id) {
 31 |       const checkCardStatus = async () => {
 32 |         setCardStatus('loading');
 33 |         setCardError(null);
 34 |         try {
 35 |           // Fetch card status using the API (expects user_id to be null for unregistered)
 36 |           const response = await fetch(`/api/card-status?card_id=${card_id}`);
 37 |           const data = await response.json();
 38 | 
 39 |           if (!response.ok) {
 40 |             console.error("Card status API error:", data);
 41 |             setCardError(data.error || 'Failed to check card status.');
 42 |             setCardStatus(response.status === 404 ? 'not_found' : 'error');
 43 |           } else {
 44 |             console.log("Card status API success:", data); // Log the raw API response
 45 |             // Determine registration based on the API response
 46 |             const isRegistered = data.isRegistered; // Assuming API returns { isRegistered: boolean }
 47 |             console.log(`[CardLanding] API says isRegistered: ${isRegistered}`); // Log the determination
 48 |             setCardStatus(isRegistered ? 'registered' : 'unregistered');
 49 |           }
 50 |         } catch (error) {
 51 |           console.error("Fetch card status error:", error);
 52 |           setCardError('An unexpected error occurred.');
 53 |           setCardStatus('error');
 54 |         }
 55 |       };
 56 |       checkCardStatus();
 57 |     }
 58 |     // Dependencies updated: removed user, authLoading, added isLoggedIn
 59 |   }, [isLoggedIn, router, card_id]);
 60 | 
 61 |   const handleCreateProfile = () => {
 62 |     if (!card_id) return;
 63 |     const targetUrl = `/create-profile?cardId=${card_id}`;
 64 |     console.log(`[CardLanding] Navigating to Create Profile: ${targetUrl}`); // Log before navigating
 65 |     router.push(targetUrl);
 66 |   };
 67 | 
 68 |   const handleSignIn = () => {
 69 |     const targetUrl = `/login`;
 70 |     console.log(`[CardLanding] Navigating to Sign In: ${targetUrl}`); // Log before navigating
 71 |     router.push(targetUrl);
 72 |   };
 73 | 
 74 |   // Combined Loading State (only check cardStatus loading if not logged in)
 75 |   if (!isLoggedIn && cardStatus === 'loading') {
 76 |     return <div>Loading...</div>;
 77 |   }
 78 | 
 79 |   // Should be redirected if user is logged in
 80 |   if (isLoggedIn) {
 81 |     return null;
 82 |   }
 83 | 
 84 |   // Handle card check results before showing buttons
 85 |   if (cardStatus === 'not_found') {
 86 |     return (
 87 |       <div className="flex flex-col items-center justify-center min-h-screen p-4">
 88 |         <h1 className="text-2xl font-bold mb-4 text-red-600">Invalid Card</h1>
 89 |         {/* Fixed visibility: Added text-black */}
 90 |         <p className="mb-6 text-center">Membership card ID (<span className="font-mono bg-gray-100 p-1 rounded text-black">{card_id}</span>) was not found.</p>
 91 |         <p className="text-xs text-gray-500">Please check the ID or contact support.</p>
 92 |       </div>
 93 |     );
 94 |   }
 95 | 
 96 |   if (cardStatus === 'error') {
 97 |      return (
 98 |       <div className="flex flex-col items-center justify-center min-h-screen p-4">
 99 |         <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
100 |         <p className="mb-6 text-center">{cardError || 'Could not verify card status.'}</p>
101 |         <p className="text-xs text-gray-500">Please try again later or contact support.</p>
102 |       </div>
103 |     );
104 |   }
105 | 
106 |   // --- Render based on card status ---
107 |   return (
108 |     <div className="flex flex-col items-center justify-center min-h-screen p-4">
109 |       <h1 className="text-2xl font-bold mb-4">Welcome!</h1>
110 |       <p className="mb-6 text-center">
111 |         {/* Fixed visibility: Added text-black */}
112 |         Membership Card ID: <span className="font-mono bg-gray-100 p-1 rounded text-black">{card_id}</span>
113 |       </p>
114 | 
115 |       {cardStatus === 'unregistered' && (
116 |         <>
117 |           <p className="text-muted-foreground mb-6 text-center">
118 |             This card is ready to be claimed. Create a profile to activate your membership.
119 |           </p>
120 |           <div className="space-y-4 w-full max-w-xs">
121 |             {/* Changed button text and action */}
122 |             <Button onClick={handleCreateProfile} className="w-full">
123 |               Create Profile & Claim Card
124 |             </Button>
125 |             {/* Removed the Sign In button for unregistered cards in MVP */}
126 |             {/* <Button onClick={handleSignIn} variant="outline" className="w-full">
127 |               Already have an account? Sign In
128 |             </Button> */}
129 |           </div>
130 |         </>
131 |       )}
132 | 
133 |       {cardStatus === 'registered' && (
134 |          <>
135 |           <p className="text-muted-foreground mb-6 text-center">
136 |             This card has already been claimed. Please sign in to access your membership.
137 |           </p>
138 |           <div className="space-y-4 w-full max-w-xs">
139 |              {/* Sign In button navigates to /login */}
140 |             <Button onClick={handleSignIn} className="w-full">
141 |               Sign In
142 |             </Button>
143 |           </div>
144 |         </>
145 |       )}
146 | 
147 |        <p className="mt-4 text-xs text-gray-500">Need help? Contact support.</p>
148 |     </div>
149 |   );
150 | };


--------------------------------------------------------------------------------
/app/components/onboarding/OnboardingVideo.tsx:
--------------------------------------------------------------------------------
 1 | // samachi/frontend/samachi-vip-access/src/components/onboarding/OnboardingVideo.tsx
 2 | 'use client';
 3 | 
 4 | import React from "react";
 5 | import { useRouter } from "next/navigation";
 6 | import { Button } from "@/app/components/ui/button";
 7 | import useAuth from "@/hooks/useAuth";
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
 11 | import useAuth from '@/hooks/useAuth';
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
 25 |   const { user, logout } = useAuth();
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
 42 |           value: user?.walletAddress ? `${user.walletAddress.substring(0, 6)}...${user.walletAddress.substring(user.walletAddress.length - 4)}` : 'Not Connected',
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
114 |             {/* TODO: Use user initials or avatar */}
115 |             {user?.email ? user.email.charAt(0).toUpperCase() : 'S'}
116 |           </div>
117 |           <div>
118 |             {/* TODO: Display user name/email */}
119 |             <h2 className="text-xl font-semibold">{user?.name || user?.email || 'Samachi Member'}</h2>
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
  5 | import { buttonVariants } from "@/components/ui/button"
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
/app/components/ui/carousel.tsx:
--------------------------------------------------------------------------------
  1 | import * as React from "react"
  2 | import useEmblaCarousel, {
  3 |   type UseEmblaCarouselType,
  4 | } from "embla-carousel-react"
  5 | import { ArrowLeft, ArrowRight } from "lucide-react"
  6 | 
  7 | import { cn } from "@/lib/utils"
  8 | import { Button } from "@/components/ui/button"
  9 | 
 10 | type CarouselApi = UseEmblaCarouselType[1]
 11 | type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
 12 | type CarouselOptions = UseCarouselParameters[0]
 13 | type CarouselPlugin = UseCarouselParameters[1]
 14 | 
 15 | type CarouselProps = {
 16 |   opts?: CarouselOptions
 17 |   plugins?: CarouselPlugin
 18 |   orientation?: "horizontal" | "vertical"
 19 |   setApi?: (api: CarouselApi) => void
 20 | }
 21 | 
 22 | type CarouselContextProps = {
 23 |   carouselRef: ReturnType<typeof useEmblaCarousel>[0]
 24 |   api: ReturnType<typeof useEmblaCarousel>[1]
 25 |   scrollPrev: () => void
 26 |   scrollNext: () => void
 27 |   canScrollPrev: boolean
 28 |   canScrollNext: boolean
 29 | } & CarouselProps
 30 | 
 31 | const CarouselContext = React.createContext<CarouselContextProps | null>(null)
 32 | 
 33 | function useCarousel() {
 34 |   const context = React.useContext(CarouselContext)
 35 | 
 36 |   if (!context) {
 37 |     throw new Error("useCarousel must be used within a <Carousel />")
 38 |   }
 39 | 
 40 |   return context
 41 | }
 42 | 
 43 | const Carousel = React.forwardRef<
 44 |   HTMLDivElement,
 45 |   React.HTMLAttributes<HTMLDivElement> & CarouselProps
 46 | >(
 47 |   (
 48 |     {
 49 |       orientation = "horizontal",
 50 |       opts,
 51 |       setApi,
 52 |       plugins,
 53 |       className,
 54 |       children,
 55 |       ...props
 56 |     },
 57 |     ref
 58 |   ) => {
 59 |     const [carouselRef, api] = useEmblaCarousel(
 60 |       {
 61 |         ...opts,
 62 |         axis: orientation === "horizontal" ? "x" : "y",
 63 |       },
 64 |       plugins
 65 |     )
 66 |     const [canScrollPrev, setCanScrollPrev] = React.useState(false)
 67 |     const [canScrollNext, setCanScrollNext] = React.useState(false)
 68 | 
 69 |     const onSelect = React.useCallback((api: CarouselApi) => {
 70 |       if (!api) {
 71 |         return
 72 |       }
 73 | 
 74 |       setCanScrollPrev(api.canScrollPrev())
 75 |       setCanScrollNext(api.canScrollNext())
 76 |     }, [])
 77 | 
 78 |     const scrollPrev = React.useCallback(() => {
 79 |       api?.scrollPrev()
 80 |     }, [api])
 81 | 
 82 |     const scrollNext = React.useCallback(() => {
 83 |       api?.scrollNext()
 84 |     }, [api])
 85 | 
 86 |     const handleKeyDown = React.useCallback(
 87 |       (event: React.KeyboardEvent<HTMLDivElement>) => {
 88 |         if (event.key === "ArrowLeft") {
 89 |           event.preventDefault()
 90 |           scrollPrev()
 91 |         } else if (event.key === "ArrowRight") {
 92 |           event.preventDefault()
 93 |           scrollNext()
 94 |         }
 95 |       },
 96 |       [scrollPrev, scrollNext]
 97 |     )
 98 | 
 99 |     React.useEffect(() => {
100 |       if (!api || !setApi) {
101 |         return
102 |       }
103 | 
104 |       setApi(api)
105 |     }, [api, setApi])
106 | 
107 |     React.useEffect(() => {
108 |       if (!api) {
109 |         return
110 |       }
111 | 
112 |       onSelect(api)
113 |       api.on("reInit", onSelect)
114 |       api.on("select", onSelect)
115 | 
116 |       return () => {
117 |         api?.off("select", onSelect)
118 |       }
119 |     }, [api, onSelect])
120 | 
121 |     return (
122 |       <CarouselContext.Provider
123 |         value={{
124 |           carouselRef,
125 |           api: api,
126 |           opts,
127 |           orientation:
128 |             orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
129 |           scrollPrev,
130 |           scrollNext,
131 |           canScrollPrev,
132 |           canScrollNext,
133 |         }}
134 |       >
135 |         <div
136 |           ref={ref}
137 |           onKeyDownCapture={handleKeyDown}
138 |           className={cn("relative", className)}
139 |           role="region"
140 |           aria-roledescription="carousel"
141 |           {...props}
142 |         >
143 |           {children}
144 |         </div>
145 |       </CarouselContext.Provider>
146 |     )
147 |   }
148 | )
149 | Carousel.displayName = "Carousel"
150 | 
151 | const CarouselContent = React.forwardRef<
152 |   HTMLDivElement,
153 |   React.HTMLAttributes<HTMLDivElement>
154 | >(({ className, ...props }, ref) => {
155 |   const { carouselRef, orientation } = useCarousel()
156 | 
157 |   return (
158 |     <div ref={carouselRef} className="overflow-hidden">
159 |       <div
160 |         ref={ref}
161 |         className={cn(
162 |           "flex",
163 |           orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
164 |           className
165 |         )}
166 |         {...props}
167 |       />
168 |     </div>
169 |   )
170 | })
171 | CarouselContent.displayName = "CarouselContent"
172 | 
173 | const CarouselItem = React.forwardRef<
174 |   HTMLDivElement,
175 |   React.HTMLAttributes<HTMLDivElement>
176 | >(({ className, ...props }, ref) => {
177 |   const { orientation } = useCarousel()
178 | 
179 |   return (
180 |     <div
181 |       ref={ref}
182 |       role="group"
183 |       aria-roledescription="slide"
184 |       className={cn(
185 |         "min-w-0 shrink-0 grow-0 basis-full",
186 |         orientation === "horizontal" ? "pl-4" : "pt-4",
187 |         className
188 |       )}
189 |       {...props}
190 |     />
191 |   )
192 | })
193 | CarouselItem.displayName = "CarouselItem"
194 | 
195 | const CarouselPrevious = React.forwardRef<
196 |   HTMLButtonElement,
197 |   React.ComponentProps<typeof Button>
198 | >(({ className, variant = "outline", size = "icon", ...props }, ref) => {
199 |   const { orientation, scrollPrev, canScrollPrev } = useCarousel()
200 | 
201 |   return (
202 |     <Button
203 |       ref={ref}
204 |       variant={variant}
205 |       size={size}
206 |       className={cn(
207 |         "absolute  h-8 w-8 rounded-full",
208 |         orientation === "horizontal"
209 |           ? "-left-12 top-1/2 -translate-y-1/2"
210 |           : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
211 |         className
212 |       )}
213 |       disabled={!canScrollPrev}
214 |       onClick={scrollPrev}
215 |       {...props}
216 |     >
217 |       <ArrowLeft className="h-4 w-4" />
218 |       <span className="sr-only">Previous slide</span>
219 |     </Button>
220 |   )
221 | })
222 | CarouselPrevious.displayName = "CarouselPrevious"
223 | 
224 | const CarouselNext = React.forwardRef<
225 |   HTMLButtonElement,
226 |   React.ComponentProps<typeof Button>
227 | >(({ className, variant = "outline", size = "icon", ...props }, ref) => {
228 |   const { orientation, scrollNext, canScrollNext } = useCarousel()
229 | 
230 |   return (
231 |     <Button
232 |       ref={ref}
233 |       variant={variant}
234 |       size={size}
235 |       className={cn(
236 |         "absolute h-8 w-8 rounded-full",
237 |         orientation === "horizontal"
238 |           ? "-right-12 top-1/2 -translate-y-1/2"
239 |           : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
240 |         className
241 |       )}
242 |       disabled={!canScrollNext}
243 |       onClick={scrollNext}
244 |       {...props}
245 |     >
246 |       <ArrowRight className="h-4 w-4" />
247 |       <span className="sr-only">Next slide</span>
248 |     </Button>
249 |   )
250 | })
251 | CarouselNext.displayName = "CarouselNext"
252 | 
253 | export {
254 |   type CarouselApi,
255 |   Carousel,
256 |   CarouselContent,
257 |   CarouselItem,
258 |   CarouselPrevious,
259 |   CarouselNext,
260 | }
261 | 


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
/app/components/ui/context-menu.tsx:
--------------------------------------------------------------------------------
  1 | import * as React from "react"
  2 | import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"
  3 | import { Check, ChevronRight, Circle } from "lucide-react"
  4 | 
  5 | import { cn } from "@/lib/utils"
  6 | 
  7 | const ContextMenu = ContextMenuPrimitive.Root
  8 | 
  9 | const ContextMenuTrigger = ContextMenuPrimitive.Trigger
 10 | 
 11 | const ContextMenuGroup = ContextMenuPrimitive.Group
 12 | 
 13 | const ContextMenuPortal = ContextMenuPrimitive.Portal
 14 | 
 15 | const ContextMenuSub = ContextMenuPrimitive.Sub
 16 | 
 17 | const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup
 18 | 
 19 | const ContextMenuSubTrigger = React.forwardRef<
 20 |   React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
 21 |   React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
 22 |     inset?: boolean
 23 |   }
 24 | >(({ className, inset, children, ...props }, ref) => (
 25 |   <ContextMenuPrimitive.SubTrigger
 26 |     ref={ref}
 27 |     className={cn(
 28 |       "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
 29 |       inset && "pl-8",
 30 |       className
 31 |     )}
 32 |     {...props}
 33 |   >
 34 |     {children}
 35 |     <ChevronRight className="ml-auto h-4 w-4" />
 36 |   </ContextMenuPrimitive.SubTrigger>
 37 | ))
 38 | ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName
 39 | 
 40 | const ContextMenuSubContent = React.forwardRef<
 41 |   React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
 42 |   React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
 43 | >(({ className, ...props }, ref) => (
 44 |   <ContextMenuPrimitive.SubContent
 45 |     ref={ref}
 46 |     className={cn(
 47 |       "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
 48 |       className
 49 |     )}
 50 |     {...props}
 51 |   />
 52 | ))
 53 | ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName
 54 | 
 55 | const ContextMenuContent = React.forwardRef<
 56 |   React.ElementRef<typeof ContextMenuPrimitive.Content>,
 57 |   React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
 58 | >(({ className, ...props }, ref) => (
 59 |   <ContextMenuPrimitive.Portal>
 60 |     <ContextMenuPrimitive.Content
 61 |       ref={ref}
 62 |       className={cn(
 63 |         "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
 64 |         className
 65 |       )}
 66 |       {...props}
 67 |     />
 68 |   </ContextMenuPrimitive.Portal>
 69 | ))
 70 | ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName
 71 | 
 72 | const ContextMenuItem = React.forwardRef<
 73 |   React.ElementRef<typeof ContextMenuPrimitive.Item>,
 74 |   React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
 75 |     inset?: boolean
 76 |   }
 77 | >(({ className, inset, ...props }, ref) => (
 78 |   <ContextMenuPrimitive.Item
 79 |     ref={ref}
 80 |     className={cn(
 81 |       "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
 82 |       inset && "pl-8",
 83 |       className
 84 |     )}
 85 |     {...props}
 86 |   />
 87 | ))
 88 | ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName
 89 | 
 90 | const ContextMenuCheckboxItem = React.forwardRef<
 91 |   React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
 92 |   React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
 93 | >(({ className, children, checked, ...props }, ref) => (
 94 |   <ContextMenuPrimitive.CheckboxItem
 95 |     ref={ref}
 96 |     className={cn(
 97 |       "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
 98 |       className
 99 |     )}
100 |     checked={checked}
101 |     {...props}
102 |   >
103 |     <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
104 |       <ContextMenuPrimitive.ItemIndicator>
105 |         <Check className="h-4 w-4" />
106 |       </ContextMenuPrimitive.ItemIndicator>
107 |     </span>
108 |     {children}
109 |   </ContextMenuPrimitive.CheckboxItem>
110 | ))
111 | ContextMenuCheckboxItem.displayName =
112 |   ContextMenuPrimitive.CheckboxItem.displayName
113 | 
114 | const ContextMenuRadioItem = React.forwardRef<
115 |   React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
116 |   React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
117 | >(({ className, children, ...props }, ref) => (
118 |   <ContextMenuPrimitive.RadioItem
119 |     ref={ref}
120 |     className={cn(
121 |       "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
122 |       className
123 |     )}
124 |     {...props}
125 |   >
126 |     <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
127 |       <ContextMenuPrimitive.ItemIndicator>
128 |         <Circle className="h-2 w-2 fill-current" />
129 |       </ContextMenuPrimitive.ItemIndicator>
130 |     </span>
131 |     {children}
132 |   </ContextMenuPrimitive.RadioItem>
133 | ))
134 | ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName
135 | 
136 | const ContextMenuLabel = React.forwardRef<
137 |   React.ElementRef<typeof ContextMenuPrimitive.Label>,
138 |   React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
139 |     inset?: boolean
140 |   }
141 | >(({ className, inset, ...props }, ref) => (
142 |   <ContextMenuPrimitive.Label
143 |     ref={ref}
144 |     className={cn(
145 |       "px-2 py-1.5 text-sm font-semibold text-foreground",
146 |       inset && "pl-8",
147 |       className
148 |     )}
149 |     {...props}
150 |   />
151 | ))
152 | ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName
153 | 
154 | const ContextMenuSeparator = React.forwardRef<
155 |   React.ElementRef<typeof ContextMenuPrimitive.Separator>,
156 |   React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
157 | >(({ className, ...props }, ref) => (
158 |   <ContextMenuPrimitive.Separator
159 |     ref={ref}
160 |     className={cn("-mx-1 my-1 h-px bg-border", className)}
161 |     {...props}
162 |   />
163 | ))
164 | ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName
165 | 
166 | const ContextMenuShortcut = ({
167 |   className,
168 |   ...props
169 | }: React.HTMLAttributes<HTMLSpanElement>) => {
170 |   return (
171 |     <span
172 |       className={cn(
173 |         "ml-auto text-xs tracking-widest text-muted-foreground",
174 |         className
175 |       )}
176 |       {...props}
177 |     />
178 |   )
179 | }
180 | ContextMenuShortcut.displayName = "ContextMenuShortcut"
181 | 
182 | export {
183 |   ContextMenu,
184 |   ContextMenuTrigger,
185 |   ContextMenuContent,
186 |   ContextMenuItem,
187 |   ContextMenuCheckboxItem,
188 |   ContextMenuRadioItem,
189 |   ContextMenuLabel,
190 |   ContextMenuSeparator,
191 |   ContextMenuShortcut,
192 |   ContextMenuGroup,
193 |   ContextMenuPortal,
194 |   ContextMenuSub,
195 |   ContextMenuSubContent,
196 |   ContextMenuSubTrigger,
197 |   ContextMenuRadioGroup,
198 | }
199 | 


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
 14 | import { Label } from "@/components/ui/label"
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
/app/components/venue/CheckInModal.tsx:
--------------------------------------------------------------------------------
  1 | 'use client';
  2 | 
  3 | import React, { useState, useEffect } from 'react';
  4 | import { useRouter } from 'next/navigation';
  5 | import { Button } from '@/app/components/ui/button';
  6 | import { XCircle, Check, CreditCard } from 'lucide-react';
  7 | 
  8 | interface CheckInModalProps {
  9 |   venue: {
 10 |     id: string;
 11 |     name: string;
 12 |     location: string;
 13 |   };
 14 |   onClose: () => void;
 15 | }
 16 | 
 17 | export const CheckInModal: React.FC<CheckInModalProps> = ({ venue, onClose }) => {
 18 |   const router = useRouter();
 19 |   const [step, setStep] = useState<'confirm' | 'processing' | 'success'>('confirm');
 20 |   
 21 |   useEffect(() => {
 22 |     if (step === 'processing') {
 23 |       console.log(`Simulating check-in for venue: ${venue.id}`);
 24 |       const timer = setTimeout(() => {
 25 |         setStep('success');
 26 |       }, 2000);
 27 |       
 28 |       return () => clearTimeout(timer);
 29 |     }
 30 |   }, [step, venue.id]);
 31 | 
 32 |   const handleCheckIn = () => {
 33 |     setStep('processing');
 34 |   };
 35 | 
 36 |   const handleContinue = () => {
 37 |     onClose();
 38 |     router.push(`/venue/${venue.id}/credit`);
 39 |   };
 40 | 
 41 |   return (
 42 |     <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 animate-fade-in">
 43 |       <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
 44 |       
 45 |       <div className="bottom-sheet max-w-md w-full z-10">
 46 |         <div className="flex justify-between items-center mb-4">
 47 |           <h2 className="text-xl font-semibold">
 48 |             {step === 'confirm' && 'Check In'}
 49 |             {step === 'processing' && 'Processing'}
 50 |             {step === 'success' && 'Success!'}
 51 |           </h2>
 52 |           <button 
 53 |             onClick={onClose}
 54 |             className="p-1 rounded-full hover:bg-black/5"
 55 |             aria-label="Close modal"
 56 |           >
 57 |             <XCircle className="h-6 w-6 text-gray-500" />
 58 |           </button>
 59 |         </div>
 60 |         
 61 |         {step === 'confirm' && (
 62 |           <>
 63 |             <p className="text-muted-foreground mb-6">
 64 |               You're about to check in to {venue.name}
 65 |             </p>
 66 |             
 67 |             <div className="glass-card p-4 mb-6">
 68 |               <div className="flex justify-between items-start mb-4">
 69 |                 <div>
 70 |                   <h3 className="font-medium">{venue.name}</h3>
 71 |                   <p className="text-xs text-muted-foreground">{venue.location}</p>
 72 |                 </div>
 73 |                 <div className="bg-primary/10 p-2 rounded-full">
 74 |                   <CreditCard className="h-5 w-5 text-primary" />
 75 |                 </div>
 76 |               </div>
 77 |               
 78 |               <div className="space-y-1 mb-4">
 79 |                 <div className="flex justify-between">
 80 |                   <span className="text-sm text-muted-foreground">Credit Line</span>
 81 |                   <span className="font-medium">$2,500.00</span>
 82 |                 </div>
 83 |                 <div className="flex justify-between">
 84 |                   <span className="text-sm text-muted-foreground">Daily Limit</span>
 85 |                   <span className="font-medium">$1,000.00</span>
 86 |                 </div>
 87 |               </div>
 88 |               
 89 |               <div className="text-xs text-muted-foreground bg-secondary/50 p-2 rounded-lg">
 90 |                 Your crypto assets are staked as collateral for your credit line
 91 |               </div>
 92 |             </div>
 93 |             
 94 |             <Button 
 95 |               onClick={handleCheckIn}
 96 |               className="w-full glass-button"
 97 |             >
 98 |               Confirm Check In
 99 |               <Check className="ml-2 h-4 w-4" />
100 |             </Button>
101 |           </>
102 |         )}
103 |         
104 |         {step === 'processing' && (
105 |           <div className="py-8 text-center">
106 |             <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
107 |               <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
108 |             </div>
109 |             <h3 className="text-lg font-medium mb-2">Processing Check In</h3>
110 |             <p className="text-muted-foreground">
111 |               Please wait while we verify your membership
112 |             </p>
113 |           </div>
114 |         )}
115 |         
116 |         {step === 'success' && (
117 |           <div className="py-6 text-center">
118 |             <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
119 |               <Check className="h-8 w-8 text-green-600" />
120 |             </div>
121 |             <h3 className="text-lg font-medium mb-2">Check In Successful!</h3>
122 |             <p className="text-muted-foreground mb-6">
123 |               Your credit line is now active at {venue.name}
124 |             </p>
125 |             <Button 
126 |               onClick={handleContinue}
127 |               className="w-full glass-button"
128 |             >
129 |               Continue
130 |             </Button>
131 |           </div>
132 |         )}
133 |       </div>
134 |     </div>
135 |   );
136 | };
137 | 


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
/app/components/wallet/WalletDashboard.tsx:
--------------------------------------------------------------------------------
  1 | 'use client';
  2 | 
  3 | import React, { useState } from 'react';
  4 | import { 
  5 |   CreditCard, Wallet, RefreshCw, History, Eye, EyeOff 
  6 | } from 'lucide-react';
  7 | import { Button } from '@/app/components/ui/button';
  8 | import Link from 'next/link';
  9 | import { useRouter } from 'next/navigation';
 10 | 
 11 | // Mock wallet data - updated for Solana
 12 | const walletData = {
 13 |   connected: true,
 14 |   address: 'ABcd...XYz1',
 15 |   assets: [
 16 |     { id: 'sol', name: 'Solana', symbol: 'SOL', amount: 1.25, value: 125, staked: 1.0 },
 17 |     { id: 'usdc', name: 'USD Coin on Solana', symbol: 'USDC', amount: 750, value: 750, staked: 500 },
 18 |   ]
 19 | };
 20 | 
 21 | export const WalletDashboard: React.FC = () => {
 22 |   const router = useRouter();
 23 |   const [hideBalances, setHideBalances] = useState(false);
 24 |   const [refreshing, setRefreshing] = useState(false);
 25 | 
 26 |   const totalValue = walletData.assets.reduce((sum, asset) => sum + asset.value, 0);
 27 |   const totalStakedValue = walletData.assets.reduce((sum, asset) => {
 28 |     if (asset.id === 'sol') return sum + (asset.staked * 100); // Mock SOL price
 29 |     if (asset.id === 'usdc') return sum + asset.staked;
 30 |     return sum;
 31 |   }, 0);
 32 | 
 33 |   const handleRefresh = () => {
 34 |     setRefreshing(true);
 35 |     setTimeout(() => {
 36 |       setRefreshing(false);
 37 |     }, 1500);
 38 |   };
 39 | 
 40 |   const maskValue = (value: number) => {
 41 |     return hideBalances ? '••••••' : `€${value.toLocaleString()}`;
 42 |   };
 43 | 
 44 |   const maskAmount = (amount: number) => {
 45 |     return hideBalances ? '••••' : amount.toString();
 46 |   };
 47 | 
 48 |   return (
 49 |     <div className="flex flex-col pt-10 pb-20 px-6">
 50 |       <div className="mb-6 animate-fade-in">
 51 |         <div className="flex items-center justify-between">
 52 |           <h1 className="text-2xl font-bold mb-1">Wallet</h1>
 53 |           <button 
 54 |             onClick={() => setHideBalances(!hideBalances)}
 55 |             className="p-2 rounded-full hover:bg-black/5"
 56 |             aria-label={hideBalances ? "Show balances" : "Hide balances"}
 57 |           >
 58 |             {hideBalances ? (
 59 |               <EyeOff className="h-5 w-5 text-muted-foreground" />
 60 |             ) : (
 61 |               <Eye className="h-5 w-5 text-muted-foreground" />
 62 |             )}
 63 |           </button>
 64 |         </div>
 65 |         <p className="text-muted-foreground">Manage your Solana assets</p>
 66 |       </div>
 67 | 
 68 |       <div className="glass-card p-6 mb-8 animate-fade-in">
 69 |         <div className="flex justify-between items-start mb-6">
 70 |           <div>
 71 |             <h2 className="text-lg font-medium mb-1">Total Balance</h2>
 72 |             <p className="text-sm text-muted-foreground">Across all assets</p>
 73 |           </div>
 74 |           <Wallet className="h-6 w-6 text-primary" />
 75 |         </div>
 76 |         
 77 |         <div className="mb-4">
 78 |           <h3 className="text-3xl font-bold mb-2">{maskValue(totalValue)}</h3>
 79 |           <div className="flex items-center">
 80 |             <button
 81 |               onClick={handleRefresh}
 82 |               className={`p-1 rounded-full ${refreshing ? 'animate-spin' : 'hover:bg-black/5'}`}
 83 |               disabled={refreshing}
 84 |               aria-label="Refresh balances"
 85 |             >
 86 |               <RefreshCw className="h-4 w-4 text-muted-foreground" />
 87 |             </button>
 88 |             <span className="text-xs text-muted-foreground ml-1">Last updated just now</span>
 89 |           </div>
 90 |         </div>
 91 |       </div>
 92 | 
 93 |       <div className="glass-card p-6 mb-8 animate-fade-in">
 94 |         <div className="flex justify-between items-start mb-6">
 95 |           <div>
 96 |             <h2 className="text-lg font-medium mb-1">Staked Assets</h2>
 97 |             <p className="text-sm text-muted-foreground">Collateral for credit line</p>
 98 |           </div>
 99 |           <CreditCard className="h-6 w-6 text-primary" />
100 |         </div>
101 |         
102 |         <div className="mb-6">
103 |           <h3 className="text-2xl font-bold mb-1">{maskValue(totalStakedValue)}</h3>
104 |           <p className="text-sm text-muted-foreground">
105 |             Credit Line: {maskValue(totalStakedValue * 2)} <span className="text-xs">(2x collateral)</span>
106 |           </p>
107 |         </div>
108 |         
109 |         <Button 
110 |           className="w-full glass-button"
111 |           onClick={() => { console.log("Open staking modal or page"); /* router.push('/stake') or open modal */ }}
112 |         >
113 |           <span className="mr-2">+</span> Stake More Assets
114 |         </Button>
115 |       </div>
116 | 
117 |       <div className="mb-4 animate-fade-in">
118 |         <div className="flex justify-between items-center mb-3">
119 |           <h2 className="text-lg font-semibold">Your Assets</h2>
120 |           <Link href="/wallet/history" className="text-primary text-sm font-medium flex items-center">
121 |             <History className="h-4 w-4 mr-1" /> History
122 |           </Link>
123 |         </div>
124 |         
125 |         <div className="space-y-3">
126 |           {walletData.assets.map((asset) => (
127 |             <div key={asset.id} className="glass-card p-4">
128 |               <div className="flex justify-between items-center mb-2">
129 |                 <div className="flex items-center">
130 |                   <div className="w-8 h-8 rounded-full bg-solana-primary/20 flex items-center justify-center mr-3">
131 |                     <span className="text-sm font-bold text-solana-primary">{asset.symbol.charAt(0)}</span>
132 |                   </div>
133 |                   <div>
134 |                     <p className="font-medium">{asset.name}</p>
135 |                     <p className="text-xs text-muted-foreground">{asset.symbol}</p>
136 |                   </div>
137 |                 </div>
138 |                 <div className="text-right">
139 |                   <p className="font-medium">{maskValue(asset.value)}</p>
140 |                   <p className="text-xs text-muted-foreground">{maskAmount(asset.amount)} {asset.symbol}</p>
141 |                 </div>
142 |               </div>
143 |               
144 |               {asset.staked > 0 && (
145 |                 <div className="text-xs bg-solana-primary/10 p-2 rounded-lg text-solana-primary font-medium">
146 |                   {maskAmount(asset.staked)} {asset.symbol} staked for credit line
147 |                 </div>
148 |               )}
149 |             </div>
150 |           ))}
151 |         </div>
152 |       </div>
153 |     </div>
154 |   );
155 | };
156 | 


--------------------------------------------------------------------------------
/app/context/AuthContext.tsx:
--------------------------------------------------------------------------------
 1 | 'use client';
 2 | 
 3 | import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
 4 | 
 5 | interface AuthContextType {
 6 |   isLoggedIn: boolean;
 7 |   // In a real app, you might store profile info here too
 8 |   // profile: { id: string; username: string; } | null;
 9 |   login: () => void; // Simple login state setter
10 |   logout: () => void; // Simple logout state setter
11 | }
12 | 
13 | const AuthContext = createContext<AuthContextType | undefined>(undefined);
14 | 
15 | export const AuthProvider = ({ children }: { children: ReactNode }) => {
16 |   // For MVP, just track login state. No persistent session yet.
17 |   const [isLoggedIn, setIsLoggedIn] = useState(false);
18 | 
19 |   const login = () => {
20 |     console.log("AuthContext: Setting isLoggedIn to true");
21 |     setIsLoggedIn(true);
22 |     // In a real app: set session cookie/token here
23 |   };
24 | 
25 |   const logout = () => {
26 |     console.log("AuthContext: Setting isLoggedIn to false");
27 |     setIsLoggedIn(false);
28 |     // In a real app: clear session cookie/token here
29 |   };
30 | 
31 |   // Memoize context value to prevent unnecessary re-renders
32 |   const value = useMemo(() => ({
33 |     isLoggedIn,
34 |     login,
35 |     logout,
36 |   }), [isLoggedIn]);
37 | 
38 |   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
39 | };
40 | 
41 | export const useSimpleAuth = (): AuthContextType => {
42 |   const context = useContext(AuthContext);
43 |   if (context === undefined) {
44 |     throw new Error('useSimpleAuth must be used within an AuthProvider');
45 |   }
46 |   return context;
47 | }; 


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
/app/favicon.ico:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/ACNoonan/samachi-app/master/app/favicon.ico


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
/app/register/page.tsx:
--------------------------------------------------------------------------------
 1 | import { SignIn } from "@/app/components/auth/SignIn";
 2 | 
 3 | export default function RegisterPage() {
 4 |   // TODO: Potentially add onboarding video step here before showing the form,
 5 |   // based on original UX requirements.
 6 |   
 7 |   // Render the SignIn component. It will detect the '/register' pathname
 8 |   // and automatically display the Sign Up form.
 9 |   return <SignIn />;
10 | } 


--------------------------------------------------------------------------------
/hooks/useAuth.ts:
--------------------------------------------------------------------------------
 1 | 'use client';
 2 | 
 3 | import { useState, useEffect } from 'react';
 4 | 
 5 | // TODO: Implement actual authentication logic
 6 | export default function useAuth() {
 7 |   const [user, setUser] = useState<any>(null); // Replace 'any' with your user type
 8 |   const [loading, setLoading] = useState(true);
 9 | 
10 |   useEffect(() => {
11 |     // Check for existing session (e.g., from Supabase, local storage, etc.)
12 |     const checkSession = async () => {
13 |       // Replace with your actual session check
14 |       await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate async check
15 |       // Example: setUser(supabase.auth.user());
16 |       setUser(null); // Default to not logged in
17 |       setLoading(false);
18 |     };
19 |     checkSession();
20 |   }, []);
21 | 
22 |   const login = async (/* credentials */) => {
23 |     setLoading(true);
24 |     // Implement login logic (e.g., Supabase email/pass, wallet connect)
25 |     await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate async login
26 |     setUser({ name: 'Test User' }); // Example user object
27 |     setLoading(false);
28 |   };
29 | 
30 |   const logout = async () => {
31 |     setLoading(true);
32 |     // Implement logout logic
33 |     await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async logout
34 |     setUser(null);
35 |     setLoading(false);
36 |   };
37 | 
38 |   return { user, loading, login, logout };
39 | } 


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
/lib/glownet.ts:
--------------------------------------------------------------------------------
 1 | // TODO: Add functions for interacting with the Glownet API
 2 | 
 3 | export const checkGlownetCardStatus = async (cardId: string) => {
 4 |   // Placeholder function
 5 |   console.log(`Checking Glownet status for card: ${cardId}`);
 6 |   // Replace with actual API call
 7 |   await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
 8 |   return { registered: Math.random() > 0.5 }; // Example response
 9 | };
10 | 
11 | export {}; // Keep if no other named exports 


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
 1 | import { NextResponse } from 'next/server';
 2 | import type { NextRequest } from 'next/server';
 3 | 
 4 | // This function can be marked `async` if using `await` inside
 5 | export function middleware(request: NextRequest) {
 6 |   // TODO: Implement authentication check (e.g., check for session cookie or token)
 7 |   // For MVP, middleware might be disabled or rely solely on client-side checks/redirects
 8 |   // until proper session management is implemented.
 9 |   const isAuthenticated = false; // Replace with actual auth check logic (e.g., check cookie)
10 |   
11 |   // Add /create-profile and /dashboard to public paths for MVP
12 |   const publicPaths = ['/login', '/register', '/card/', '/create-profile', '/dashboard']; 
13 |   const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path)) || request.nextUrl.pathname === '/';
14 | 
15 |   // Redirect unauthenticated users trying to access protected routes to login
16 |   // This rule will now allow access to /dashboard even if isAuthenticated is false
17 |   if (!isAuthenticated && !isPublicPath) {
18 |     return NextResponse.redirect(new URL('/login', request.url));
19 |   }
20 | 
21 |   // Redirect authenticated users trying to access login/register/create-profile to dashboard
22 |   // We might want to prevent access to /create-profile if already logged in too
23 |   if (isAuthenticated && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register' || request.nextUrl.pathname === '/create-profile')) {
24 |      return NextResponse.redirect(new URL('/dashboard', request.url));
25 |   }
26 | 
27 |   return NextResponse.next();
28 | }
29 | 
30 | // See "Matching Paths" below to learn more
31 | export const config = {
32 |   matcher: [
33 |     /*
34 |      * Match all request paths except for the ones starting with:
35 |      * - api (API routes)
36 |      * - _next/static (static files)
37 |      * - _next/image (image optimization files)
38 |      * - favicon.ico (favicon file)
39 |      */
40 |     '/((?!api|_next/static|_next/image|favicon.ico).*)',
41 |   ],
42 | }; 


--------------------------------------------------------------------------------
/next.config.ts:
--------------------------------------------------------------------------------
1 | import type { NextConfig } from "next";
2 | 
3 | const nextConfig: NextConfig = {
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
12 |     "@radix-ui/react-label": "^2.1.3",
13 |     "@radix-ui/react-slot": "^1.2.0",
14 |     "@solana/wallet-adapter-base": "^0.9.24",
15 |     "@solana/wallet-adapter-react": "^0.15.36",
16 |     "@solana/wallet-adapter-react-ui": "^0.9.36",
17 |     "@solana/wallet-adapter-wallets": "^0.19.34",
18 |     "@solana/web3.js": "^1.98.0",
19 |     "@supabase/supabase-js": "^2.49.4",
20 |     "@types/bcryptjs": "^3.0.0",
21 |     "bcryptjs": "^3.0.2",
22 |     "class-variance-authority": "^0.7.1",
23 |     "clsx": "^2.1.1",
24 |     "lucide-react": "^0.487.0",
25 |     "next": "15.3.0",
26 |     "next-themes": "^0.4.6",
27 |     "pino-pretty": "^13.0.0",
28 |     "react": "^19.0.0",
29 |     "react-dom": "^19.0.0",
30 |     "sonner": "^2.0.3",
31 |     "tailwind-merge": "^3.2.0"
32 |   },
33 |   "devDependencies": {
34 |     "@tailwindcss/postcss": "^4",
35 |     "@types/node": "^20",
36 |     "@types/react": "^19",
37 |     "@types/react-dom": "^19",
38 |     "tailwindcss": "^4",
39 |     "typescript": "^5"
40 |   }
41 | }
42 | 


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
/public/vercel.svg:
--------------------------------------------------------------------------------
1 | <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1155 1000"><path d="m577.3 0 577.4 1000H0z" fill="#fff"/></svg>


--------------------------------------------------------------------------------
/public/window.svg:
--------------------------------------------------------------------------------
1 | <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 2.5h13v10a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1zM0 1h16v11.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 12.5zm3.75 4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M7 4.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" fill="#666"/></svg>


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