import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chkobba - Tunisian Card Game',
  description: 'Play Tunisian Chkobba with real-money betting, multiplayer matchmaking, and AI opponents',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
