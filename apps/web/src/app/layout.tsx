import { ThemeProvider } from '@/components/theme-provider';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import React, { Suspense } from 'react';
import { PageViewTracker } from './components/page-view-tracker';
import './globals.css';
import MicrosoftClarity from './components/clarity';

const baseUrl = 'https://unbuilt.app';
const clarityProjectId = process.env.CLARITY_PROJECT_ID;

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'Unbuilt.app',
  applicationName: 'Unbuilt',
  description:
    'Website analyzer - See the exact technologies powering any web app',
  authors: [{ url: 'https://yavorsky.org', name: 'Artem Yavorskyi' }],
  creator: 'Artem Yavorskyi',
  openGraph: {
    title: 'Unbuilt.app',
    description:
      'Website analyzer - See the exact technologies powering any web app',
    url: baseUrl,
    siteName: 'Unbuilt.app',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${baseUrl}/api/og`,
        width: 1200,
        height: 630,
      },
    ],
  },
  icons: {
    // Favicon
    icon: [
      {
        url: '/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/favicon.ico',
        rel: 'shortcut icon',
      },
    ],
    // Apple Touch Icon
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <MicrosoftClarity projectId={clarityProjectId} />
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
