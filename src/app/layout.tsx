import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Be Healthy',
  description:
    'A wellness ecosystem bridging individual health tracking and professional oversight.',
};

export const viewport: Viewport = {
  themeColor: '#0E9F6E',
  width: 'device-width',
  initialScale: 1,
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
