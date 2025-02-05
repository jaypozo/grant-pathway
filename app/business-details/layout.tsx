import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Business Details - Grant Pathway',
  description: 'Tell us about your business to receive a personalized grant report. Find funding opportunities tailored to your Canadian business.',
  openGraph: {
    title: 'Business Details - Grant Pathway',
    description: 'Tell us about your business to receive a personalized grant report. Find funding opportunities tailored to your Canadian business.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Grant Pathway Business Details Form',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Details - Grant Pathway',
    description: 'Tell us about your business to receive a personalized grant report. Find funding opportunities tailored to your Canadian business.',
    images: ['/images/og-image.png'],
  },
};

export default function BusinessDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 