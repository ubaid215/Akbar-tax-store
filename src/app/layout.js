// src/app/layout.jsx  — Root Layout (Server Component)
import { Geist, Geist_Mono } from 'next/font/google';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Providers from '@/context/Providers';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') return 'http://localhost:3000';
  return 'https://www.akbartaxstore.com';
};

const baseUrl = getBaseUrl();

export const metadata = {
  title: 'Akbar Tax Store | Tax Filing, NTN & Company Registration Pakistan',
  description:
    'Trusted tax consultant in Faisalabad for income tax filing, NTN registration, SECP company registration, and business setup. Become a filer and save taxes today!',
  keywords: [
    'income tax filing Pakistan', 'tax filing services Pakistan', 'tax return Pakistan',
    'income tax return filing', 'tax consultant Faisalabad', 'tax advisor Pakistan',
    'filer status Pakistan', 'non filer to filer', 'NTN registration Pakistan',
    'SECP company registration', 'business registration Pakistan',
    'company registration Faisalabad', 'tax services Faisalabad',
  ].join(', '),
  openGraph: {
    title: 'Akbar Tax Store | Expert Tax Filing & Business Registration Services Pakistan',
    description: 'Leading tax consultant in Faisalabad offering income tax filing, NTN registration, SECP company registration & business services. Trusted by 1000+ clients.',
    url: baseUrl,
    siteName: 'Akbar Tax Store',
    images: [{ url: `${baseUrl}/images/og-image.jpg`, width: 1200, height: 630, alt: 'Akbar Tax Store' }],
    type: 'website',
    locale: 'en_PK',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Akbar Tax Store | Tax Filing & Business Registration Pakistan',
    description: 'Expert tax consultant in Lahore. Income tax filing, NTN registration, SECP company registration.',
    images: [`${baseUrl}/images/og-image.jpg`],
  },
  alternates: { canonical: baseUrl },
};

export default async function RootLayout({ children }) {
  // Fetch session server-side — avoids auth flicker on hydration
  const session = await getServerSession(authOptions);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}/#business`,
    name: 'Akbar Tax Store',
    url: baseUrl,
    telephone: '+92-301-6832064',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '348 E5 Street, Topaz Block, Park View City Multan Road',
      addressLocality: 'Lahore',
      addressRegion: 'Punjab',
      postalCode: '54000',
      addressCountry: 'PK',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '150',
    },
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="author" content="Akbar Tax Store" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="theme-color" content="#0040A8" />
        <meta name="geo.region" content="PK-PB" />
        <meta name="geo.placename" content="Lahore, Pakistan" />
        <meta name="geo.position" content="31.5204;74.3587" />
        <meta name="ICBM" content="31.5204, 74.3587" />
        {/* PWA — Apple */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ATS" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0040A8" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* Service Worker registration */}
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js', { scope: '/' })
                .catch(function(err) { console.warn('SW registration failed:', err); });
            });
          }
        ` }} />
      </head>
     <body className="antialiased">
  <Providers session={session}>
    {children}
    <SpeedInsights />
  </Providers>
</body>

    </html>
  );
}