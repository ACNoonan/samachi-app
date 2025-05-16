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
