├── .env.local.example
├── .gitignore
├── CUSTODIAL_STAKING_PLAN.md
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
    │   ├── staking
    │   │   ├── balance
    │   │   │   └── route.ts
    │   │   ├── helius-webhook
    │   │   │   └── route.ts
    │   │   ├── process-unstake
    │   │   │   └── route.ts
    │   │   ├── request-unstake
    │   │   │   └── route.ts
    │   │   └── stakes
    │   │   │   └── route.ts
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
    │   │   └── CreateProfileForm.tsx
    │   ├── debug
    │   │   └── AuthDebug.tsx
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
    │   │   └── CardLanding.tsx
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
    │   ├── AuthContext.tsx
    │   └── SolanaContext.tsx
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
    ├── hooks
    │   └── use-toast.ts
    ├── layout.tsx
    ├── login
    │   └── page.tsx
    ├── page.tsx
    ├── profile
    │   ├── loading.tsx
    │   └── page.tsx
    ├── providers.tsx
    ├── venue
    │   └── [venueId]
    │   │   └── page.tsx
    └── wallet
    │   ├── loading.tsx
    │   └── page.tsx
├── lib
    ├── auth.ts
    ├── database.types.ts
    ├── glownet.ts
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
├── pnpm-workspace.yaml
├── postcss.config.mjs
├── public
    ├── barrage-club.png
    ├── berhta-club.png
    ├── bloom-festival.png
    ├── file.svg
    ├── fonts
    │   ├── Glancyr-Bold.woff2
    │   ├── Glancyr-BoldItalic.woff2
    │   ├── Glancyr-ExtraLight.woff2
    │   ├── Glancyr-ExtraLightItalic.woff2
    │   ├── Glancyr-Italic.woff2
    │   ├── Glancyr-Light.woff2
    │   ├── Glancyr-LightItalic.woff2
    │   ├── Glancyr-Medium.woff2
    │   ├── Glancyr-MediumItalic.woff2
    │   ├── Glancyr-Regular.woff2
    │   ├── Glancyr-SemiBold.woff2
    │   ├── Glancyr-SemiBoldItalic.woff2
    │   ├── Glancyr-Thin.woff2
    │   └── Glancyr-ThinItalic.woff2
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
├── repo-planb.md
├── repo.md
├── schema.sql
├── scripts
    ├── sync-cards.ts
    └── sync-venues.ts
├── supabase_schema_dump.sql
├── tests
    └── auth.test.ts
├── tsconfig.json
└── vercel.json