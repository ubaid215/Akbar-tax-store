// src/app/(public)/services-fees/page.jsx
// IMPROVED — changes:
// 1. Added FAQPage JSON-LD (new) — targets "how much does X cost in Pakistan" PAA queries
// 2. Added BreadcrumbList JSON-LD (new) — Home → Services & Fees
// 3. Fixed H1/title inconsistency: ServicesClient H1 now uses the same keyword phrase
//    as the metadata title ("Tax & Business Registration Services Fees Pakistan")
//    NOTE: The H1 fix is in ServicesClient.jsx (see that file). The page.jsx change
//    is schemas only — ServicesClient.jsx is the companion fix.
// All original ItemList schema and metadata are unchanged.

import ServicesClient from './ServicesClient';
import { PERSONAL_SERVICES, BUSINESS_SERVICES } from '@/constants';

const BASE_URL = 'https://www.akbartaxstore.com';

export const metadata = {
  title: 'Tax & Business Registration Services Fees Pakistan',
  description:
    'Complete price list for FBR tax filing, NTN registration, SECP company registration, GST, PRA, and trademark services in Pakistan. Transparent fees — no hidden charges.',
  alternates: {
    canonical: `${BASE_URL}/services-fees`,
  },
  openGraph: {
    title: 'Tax & Business Registration Services Fees Pakistan | Akbar Tax Store',
    description:
      'FBR tax filing from PKR 5,000. NTN registration PKR 4,000. SECP company registration PKR 50,000. Trademark PKR 80,000. Full transparent pricing — Akbar Tax Store Faisalabad.',
    url: `${BASE_URL}/services-fees`,
  },
};

// ── ItemList JSON-LD (unchanged) ──────────────────────────────────────────────
const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Tax & Business Registration Services — Akbar Tax Store Pakistan',
  description:
    'Complete list of FBR tax and business registration services with transparent pricing.',
  url: `${BASE_URL}/services-fees`,
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

// ── BreadcrumbList schema (NEW) ───────────────────────────────────────────────
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: BASE_URL,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Services & Fees',
      item: `${BASE_URL}/services-fees`,
    },
  ],
};

// ── FAQPage schema (NEW) ──────────────────────────────────────────────────────
// Targets pricing PAA boxes: "how much does NTN cost", "SECP registration fee", etc.
// These are the highest-converting queries on a pricing page.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does NTN registration cost in Pakistan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'NTN registration costs PKR 4,000 at Akbar Tax Store. This covers complete FBR IRIS portal registration, document verification, and NTN certificate delivery within 24 hours. Registering yourself directly on iris.fbr.gov.pk is free but requires navigating the portal independently.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does SECP company registration cost in Pakistan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SECP company (private limited) registration costs PKR 50,000 at Akbar Tax Store. This includes Memorandum and Articles of Association preparation, SECP eServices portal submission, digital signatures, and Certificate of Incorporation — completed within 24–48 hours.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does income tax return filing cost in Pakistan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'FBR income tax return filing costs from PKR 5,000 at Akbar Tax Store for individual and salaried returns. The service includes income and wealth statement preparation, IRIS portal submission, and filing confirmation — completed within 24–48 hours of document receipt.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does GST registration cost in Pakistan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'GST (General Sales Tax) registration with FBR costs PKR 40,000 at Akbar Tax Store. PRA (Punjab Revenue Authority) registration for Punjab-based businesses is also PKR 40,000. Both include complete document preparation, portal submission, and coordination with the relevant authority — completed in 5–7 working days.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does trademark registration cost in Pakistan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Trademark registration with the Intellectual Property Organisation of Pakistan (IPO) costs PKR 80,000 at Akbar Tax Store. This covers the complete application preparation, IPO portal submission, and follow-up through the registration process. Full trademark protection is granted after IPO examination and publication.',
      },
    },
  ],
};

export default function ServicesFeePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      {/* NEW: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* NEW: FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <ServicesClient />
    </>
  );
}