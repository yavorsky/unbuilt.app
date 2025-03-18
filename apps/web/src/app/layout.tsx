import { ThemeProvider } from '@/components/theme-provider';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { GoogleAnalytics } from '@next/third-parties/google';
import React from 'react';
import { PageViewTracker } from './components/page-view-tracker';
import './globals.css';

const baseUrl = 'https://unbuilt.app';

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
  authors: [{ url: 'https://github.com/yavorsky', name: 'Artem Yavorskyi' }],
  creator: 'Artem Yavorskyi',
  openGraph: {
    title: 'Unbuilt.app',
    description:
      'Website analyzer - See the exact technologies powering any web app',
    url: baseUrl,
    siteName: 'Unbuilt.app',
    locale: 'en_US',
    type: 'website',
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

const gaId = process.env.NODE_ENV === 'production' && process.env.GA_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {gaId && <GoogleAnalytics gaId={gaId} />}
        <PageViewTracker />
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
