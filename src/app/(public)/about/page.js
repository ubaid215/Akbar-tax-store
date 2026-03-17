// src/app/(public)/about/page.jsx

import AboutClient from './AboutClient';
import { SITE_CONFIG } from '@/constants';

const BASE_URL = 'https://www.akbartaxstore.com';

export const metadata = {
  title: 'About Akbar Tax Store — Tax Consultant in Faisalabad, Pakistan',
  description:
    'Akbar Tax Store is a trusted FBR tax consultancy based in Faisalabad, Pakistan. 500+ clients, 5+ years experience. Expert NTN registration, FBR tax filing, and SECP company registration services.',
  alternates: { canonical: `${BASE_URL}/about` },
  openGraph: {
    title: 'About Akbar Tax Store — Tax Consultant in Faisalabad, Pakistan',
    description:
      'Trusted FBR tax consultant in Faisalabad. 500+ clients served, 5+ years experience. NTN registration, income tax filing, SECP company registration — all online.',
    url: `${BASE_URL}/about`,
  },
};

// ── Structured data ───────────────────────────────────────────────────────────
// Two schemas on the About page:
// 1. AboutPage — tells Google this page is the authoritative "about" source
// 2. LocalBusiness — reinforces business entity data (E-E-A-T)
// 3. BreadcrumbList — improves navigation rich results in SERPs
const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${BASE_URL}/about#webpage`,
    url: `${BASE_URL}/about`,
    name: 'About Akbar Tax Store — Tax Consultant in Faisalabad, Pakistan',
    description:
      'Akbar Tax Store is a modern FBR tax consultancy based in Faisalabad, Pakistan, specialising in NTN registration, income tax return filing, and SECP company registration.',
    isPartOf: { '@id': `${BASE_URL}/#website` },
    about: { '@id': `${BASE_URL}/#business` },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BASE_URL}/#business`,
    name: SITE_CONFIG.name,
    url: BASE_URL,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    foundingDate: '2019',
    description:
      'Akbar Tax Store is a modern tax consultancy in Faisalabad, Pakistan. We specialise in FBR tax filing, NTN registration, SECP company registration, GST, PRA, and trademark services.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.address.street,
      addressLocality: SITE_CONFIG.address.city,
      addressRegion: SITE_CONFIG.address.region,
      postalCode: SITE_CONFIG.address.postalCode,
      addressCountry: 'PK',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 31.4504, longitude: 73.1350 },
    areaServed: [
      { '@type': 'City', name: 'Faisalabad' },
      { '@type': 'Country', name: 'Pakistan' },
    ],
    numberOfEmployees: { '@type': 'QuantitativeValue', value: 5 },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '50',
      bestRating: '5',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',  item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'About', item: `${BASE_URL}/about` },
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <AboutClient />
    </>
  );
}