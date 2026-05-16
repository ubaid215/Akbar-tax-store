// src/app/layout.jsx  — Root Layout (Server Component)

import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import { ClerkProvider } from '@clerk/nextjs';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Providers from '@/context/Providers';
import BreadcrumbSchema from '@/app/components/schemas/BreadcrumbSchema';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

const BASE_URL = 'https://www.akbartaxstore.com';

// ── Metadata export ───────────────────────────────────────────────────────────
export const metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: 'Akbar Tax Store | FBR Tax Filing & NTN Registration Pakistan',
    template: '%s | Akbar Tax Store',
  },

  description:
    'Expert FBR tax filing, NTN registration, and SECP company registration in Faisalabad, Pakistan. Become an active filer in 24 hours. Trusted by 500+ clients across Pakistan.',

  openGraph: {
    title: 'Akbar Tax Store | FBR Tax Filing & Business Registration Pakistan',
    description:
      'Fast FBR tax filing, NTN registration, SECP company registration, and GST services in Pakistan. Results in 24 hours. Serving Faisalabad and all of Pakistan.',
    url: BASE_URL,
    siteName: 'Akbar Tax Store',
    images: [
      {
        url: '/images/og-image.jpg', 
        width: 1200,
        height: 630,
        alt: 'Akbar Tax Store — FBR Tax Filing & NTN Registration Pakistan',
      },
    ],
    type: 'website',
    locale: 'en_PK',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Akbar Tax Store | FBR Tax Filing & NTN Registration Pakistan',
    description:
      'Expert FBR tax filing, NTN registration, and company registration services in Faisalabad, Pakistan. Become a filer in 24 hours.',
    images: ['/images/og-image.jpg'],
  },

  alternates: {
    canonical: BASE_URL,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
};

// ── Structured Data (JSON-LD) ─────────────────────────────────────────────────
const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService', 'AccountingService'],
    '@id': `${BASE_URL}/#business`,
    name: 'Akbar Tax Store',
    alternateName: 'ATS Tax Services',
    url: BASE_URL,
    telephone: '+923407300408',
    email: 'info@akbartaxstore.com',
    foundingDate: '2024',
    currenciesAccepted: 'PKR',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'P 82/3 Al-Fayyaz Colony, Street No 4, Satiana Road',
      addressLocality: 'Faisalabad',
      addressRegion: 'Punjab',
      postalCode: '38000',
      addressCountry: 'PK',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 31.4504,
      longitude: 73.1350,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '21:00',
      },
    ],
    areaServed: [
      { '@type': 'Country', name: 'Pakistan' },
      { '@type': 'City', name: 'Faisalabad' },
      { '@type': 'City', name: 'Lahore' },
      { '@type': 'City', name: 'Karachi' },
      { '@type': 'City', name: 'Islamabad' },
      { '@type': 'City', name: 'Rawalpindi' },
      { '@type': 'City', name: 'Multan' },
      { '@type': 'City', name: 'Peshawar' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Tax & Business Registration Services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'NTN Registration' }, price: '4000', priceCurrency: 'PKR' },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'FBR Tax Return Filing' }, price: '5000', priceCurrency: 'PKR' },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'SECP Company Registration' }, price: '50000', priceCurrency: 'PKR' },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'GST Registration' }, price: '40000', priceCurrency: 'PKR' },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Trademark Registration' }, price: '80000', priceCurrency: 'PKR' },
      ],
    },
    priceRange: 'PKR 3,000 – PKR 80,000',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '50',
      bestRating: '5',
      worstRating: '1',
    },
    sameAs: [
      'https://www.instagram.com/_akbar_tax_store',
      'https://wa.me/923407300408',
    ],
    image: `${BASE_URL}/images/og-image.jpg`,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/logo.png`,
      width: 256,
      height: 256,
    },
  },
  // WebSite schema — enables Google Sitelinks Searchbox
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: 'Akbar Tax Store',
    description: 'FBR Tax Filing, NTN Registration & Business Services in Pakistan',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: { '@id': `${BASE_URL}/#business` },
  },
];

// ── Root Layout ───────────────────────────────────────────────────────────────
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Author */}
        <meta name="author" content="Akbar Tax Store" />

        {/* Geo tags — FIXED to Faisalabad (was Lahore) */}
        <meta name="geo.region" content="PK-PB" />
        <meta name="geo.placename" content="Faisalabad, Pakistan" />
        <meta name="geo.position" content="31.4504;73.1350" />
        <meta name="ICBM" content="31.4504, 73.1350" />

        {/* Theme */}
        <meta name="theme-color" content="#0040A8" />

        {/* PWA — Apple */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Akbar Tax Store" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0040A8" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Font preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* Structured Data — LocalBusiness + WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Service Worker */}
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function () {
                  navigator.serviceWorker
                    .register('/sw.js', { scope: '/' })
                    .catch(function (err) { console.warn('SW registration failed:', err); });
                });
              }
            `,
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ClerkProvider>
          <Providers>
            <BreadcrumbSchema />
            {children}
            <SpeedInsights />
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}