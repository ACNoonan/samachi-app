import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';
import { AuthDebug } from './components/debug/AuthDebug';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Samachi App",
  description: "Samachi Membership Access",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground`}>
        <Providers>
          {children}
          {process.env.NODE_ENV === 'development' && <AuthDebug />}
        </Providers>
      </body>
    </html>
  );
}
