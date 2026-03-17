// src/app/(public)/services-fees/page.jsx

import ServicesClient from './ServicesClient';
import { PERSONAL_SERVICES, BUSINESS_SERVICES } from '@/constants';

// ── Page-level metadata ───────────────────────────────────────────────────────
export const metadata = {
  title: 'Tax & Business Registration Services Fees Pakistan',
  description:
    'Complete price list for FBR tax filing, NTN registration, SECP company registration, GST, PRA, and trademark services in Pakistan. Transparent fees — no hidden charges.',
  alternates: {
    canonical: 'https://www.akbartaxstore.com/services-fees',
  },
  openGraph: {
    title: 'Tax & Business Registration Services Fees Pakistan | Akbar Tax Store',
    description:
      'FBR tax filing from PKR 5,000. NTN registration PKR 4,000. SECP company registration PKR 50,000. Trademark PKR 80,000. Full transparent pricing — Akbar Tax Store Faisalabad.',
    url: 'https://www.akbartaxstore.com/services-fees',
  },
};

// ── ItemList JSON-LD ──────────────────────────────────────────────────────────
// Enables Google to show individual service names and PKR prices as rich
// results. Built here in the Server Component so it is always in the HTML
// delivered to the crawler — never dependent on JS execution.
const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Tax & Business Registration Services — Akbar Tax Store Pakistan',
  description:
    'Complete list of FBR tax and business registration services with transparent pricing.',
  url: 'https://www.akbartaxstore.com/services-fees',
  itemListElement: [
    ...PERSONAL_SERVICES.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: s.title,
        description: s.description,
        provider: { '@type': 'LocalBusiness', name: 'Akbar Tax Store' },
        offers: {
          '@type': 'Offer',
          price: s.price,
          priceCurrency: 'PKR',
          availability: 'https://schema.org/InStock',
        },
      },
    })),
    ...BUSINESS_SERVICES.map((s, i) => ({
      '@type': 'ListItem',
      position: PERSONAL_SERVICES.length + i + 1,
      item: {
        '@type': 'Service',
        name: s.title,
        description: s.description,
        provider: { '@type': 'LocalBusiness', name: 'Akbar Tax Store' },
        offers: {
          '@type': 'Offer',
          price: s.price,
          priceCurrency: 'PKR',
          availability: 'https://schema.org/InStock',
        },
      },
    })),
  ],
};

// ── Page ───────────────────────────────────────────────────────────────────────
export default function ServicesFeePage() {
  return (
    <>
      {/* JSON-LD injected into <head> by Next.js — always present for crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* All interactive UI lives in the Client Component */}
      <ServicesClient />
    </>
  );
}