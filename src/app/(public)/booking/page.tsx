// src/app/book/page.tsx
// ✅ FIX 1: Converted to Server Component wrapper pattern
// ✅ FIX 2: Added metadata export — booking page is now indexable by Google
// ✅ FIX 3: Added canonical URL
// ✅ FIX 4: Added OpenGraph + Twitter cards
// ✅ FIX 5: Added Service + LocalBusiness JSON-LD schema
//           → Enables Google's "Booking" rich result and appointment actions
// ✅ FIX 6: Original BookPage UI moved to BookClient.tsx (no changes to UI logic)

import BookClient from './BookClient';

const BASE_URL = 'https://www.akbartaxstore.com';

export const metadata = {
  title: 'Book a Tax Consultation — Akbar Tax Store | 24-Hour Service',
  description:
    'Book an online tax consultation with Akbar Tax Store. NTN registration, FBR tax return filing, SECP company registration — schedule your appointment in 2 minutes. Service from PKR 4,000.',
  alternates: {
    canonical: `${BASE_URL}/book`,
  },
  openGraph: {
    title: 'Book a Tax Consultation — Akbar Tax Store',
    description:
      'Schedule a tax consultation with our FBR-verified team. NTN, tax filing, SECP registration. Fast 24-hour service starting from PKR 4,000.',
    url: `${BASE_URL}/book`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book a Tax Consultation — Akbar Tax Store',
    description:
      'Book your NTN registration or FBR tax return filing appointment online. 24-hour turnaround. From PKR 4,000.',
  },
};

// JSON-LD: Service schema + Reservation action
// Enables Google to show booking options directly in search results
const bookingSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Tax Consultation Booking — Akbar Tax Store',
  description:
    'Book an online appointment with Akbar Tax Store for NTN registration, FBR income tax return filing, SECP company registration, GST registration, and other tax services in Pakistan.',
  provider: {
    '@type': 'LocalBusiness',
    name: 'Akbar Tax Store',
    url: BASE_URL,
    telephone: '+92-301-6832064',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '348 E5 Street, Topaz Block, Park View City Multan Road',
      addressLocality: 'Lahore',
      addressCountry: 'PK',
    },
  },
  areaServed: {
    '@type': 'Country',
    name: 'Pakistan',
  },
  offers: [
    {
      '@type': 'Offer',
      name: 'NTN Registration',
      price: '4000',
      priceCurrency: 'PKR',
      availability: 'https://schema.org/InStock',
    },
    {
      '@type': 'Offer',
      name: 'Income Tax Return Filing',
      price: '5000',
      priceCurrency: 'PKR',
      availability: 'https://schema.org/InStock',
    },
    {
      '@type': 'Offer',
      name: 'SECP Company Registration',
      price: '15000',
      priceCurrency: 'PKR',
      availability: 'https://schema.org/InStock',
    },
  ],
  potentialAction: {
    '@type': 'ReserveAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/book`,
      actionPlatform: [
        'http://schema.org/DesktopWebPlatform',
        'http://schema.org/MobileWebPlatform',
      ],
    },
    result: {
      '@type': 'Reservation',
      name: 'Tax Consultation Appointment',
    },
  },
};

export default function BookPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookingSchema) }}
      />
      <BookClient />
    </>
  );
}