import './globals.css';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Grant Pathway - Find Grants for Your Canadian Business',
  description: 'Discover grants and funding opportunities for your Canadian business. Get a personalized report of grants you qualify for, delivered within 48 hours.',
  openGraph: {
    type: 'website',
    title: 'Grant Pathway - Find Grants for Your Canadian Business',
    description: 'Discover grants and funding opportunities for your Canadian business. Get a personalized report of grants you qualify for, delivered within 48 hours.',
    url: 'https://grantpathway.com',
    siteName: 'Grant Pathway',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Grant Pathway - Canadian Business Grant Finder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grant Pathway - Find Grants for Your Canadian Business',
    description: 'Discover grants and funding opportunities for your Canadian business. Get a personalized report of grants you qualify for, delivered within 48 hours.',
    images: ['/images/og-image.png'],
  },
  keywords: [
    'business grants',
    'canadian grants',
    'small business funding',
    'startup funding',
    'government grants',
    'business financing',
    'canadian business grants',
    'grant finder',
    'funding opportunities',
    'business support'
  ],
  authors: [{ name: 'Grant Pathway' }],
  creator: 'Grant Pathway',
  publisher: 'Grant Pathway',
  formatDetection: {
    email: false,
    telephone: false,
  },
  metadataBase: new URL('https://grantpathway.com'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
