#!/bin/bash

# Create backup directory
mkdir -p backup-ui

# UI Component folders to move
echo "Moving UI components to backup folder..."

# Main UI component directories
mv app/components backup-ui/ 2>/dev/null || true

# Page components (excluding API routes)
mv app/profile backup-ui/ 2>/dev/null || true
mv app/venue backup-ui/ 2>/dev/null || true
mv app/wallet backup-ui/ 2>/dev/null || true
mv app/login backup-ui/ 2>/dev/null || true
mv app/create-profile backup-ui/ 2>/dev/null || true
mv app/dashboard backup-ui/ 2>/dev/null || true
mv app/discover backup-ui/ 2>/dev/null || true
mv app/card backup-ui/ 2>/dev/null || true

# UI-specific files
mv app/providers.tsx backup-ui/ 2>/dev/null || true
mv app/globals.css backup-ui/ 2>/dev/null || true

# If we want to keep a minimal page.tsx and layout.tsx, create them
echo "Creating minimal app/page.tsx..."
cat > app/page.tsx << 'EOL'
export default function Home() {
  return (
    <div>
      <h1>Samachi Backend Service</h1>
      <p>API-only mode active. UI components are disabled.</p>
    </div>
  );
}
EOL

echo "Creating minimal app/layout.tsx..."
cat > app/layout.tsx << 'EOL'
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Samachi Backend Service',
  description: 'API-only mode',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
EOL

echo "UI components moved to backup-ui/ folder"
echo "You can now commit the backend-only version" 