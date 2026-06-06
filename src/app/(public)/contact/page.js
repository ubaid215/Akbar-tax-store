// src/app/(public)/contact/page.js — Server Component
// ✅ EXISTING: metadata export already correct (no change needed)
// ✅ EXISTING: canonical, OG, Twitter already present
// ✅ FIX 1: Added LocalBusiness + ContactPoint JSON-LD schema
//           → Enables Google local pack appearance and Contact rich result
// ✅ FIX 2: Added OpeningHoursSpecification
//           → Shows business hours in knowledge panel
// ✅ FIX 3: Added FAQPage schema with top conversion FAQs
//           → Targets PAA boxes for 'tax consultant Faisalabad' queries

import ContactClient from './ContactClient';

const BASE_URL = 'https://www.akbartaxstore.com';

export const metadata = {
  title: 'Contact Akbar Tax Store | WhatsApp 0340-7300408',
  description:
    'Free tax consultation. WhatsApp us at 0340-7300408. NTN registration, FBR tax filing & SECP company registration in Pakistan. Fast 24-hour service.',
  alternates: { canonical: `${BASE_URL}/contact` },
  openGraph: {
    title: 'Contact Akbar Tax Store | Free Tax Consultation Pakistan',
    description:
      'Get a free tax consultation. WhatsApp 0340-7300408. NTN registration, FBR tax filing, and SECP registration in 24 hours.',
    url: `${BASE_URL}/contact`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Akbar Tax Store | WhatsApp 0340-7300408',
    description:
      'Contact us for free tax consultation. WhatsApp 0340-7300408. NTN, FBR tax filing, SECP registration in 24 hours across Pakistan.',
  },
};

// ─── LocalBusiness + ContactPoint Schema ─────────────────────────────────────
// Enables: Google Maps local pack, Contact rich result, business knowledge panel
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${BASE_URL}/#localbusiness`,
  name: 'Akbar Tax Store',
  description:
    'FBR-verified tax consultancy in Pakistan offering NTN registration, income tax return filing, SECP company registration, GST registration, and business compliance services.',
  url: BASE_URL,
  telephone: '+92-301-6832064',
  email: 'info@akbartaxstore.com',
  image: `${BASE_URL}/og-image.jpg`,
  priceRange: 'PKR 4,000 – PKR 80,000',
  currenciesAccepted: 'PKR',
  paymentAccepted: 'Cash, Bank Transfer, JazzCash, EasyPaisa',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '348 E5 Street, Topaz Block, Park View City Multan Road',
    addressLocality: 'Lahore',
    addressRegion: 'Punjab',
    postalCode: '54000',
    addressCountry: 'PK',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '31.4697',
    longitude: '74.3048',
  },
  areaServed: [
    { '@type': 'City', name: 'Lahore' },
    { '@type': 'City', name: 'Faisalabad' },
    { '@type': 'Country', name: 'Pakistan' },
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday'],
      opens: '10:00',
      closes: '15:00',
    },
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+92-301-6832064',
    contactType: 'customer service',
    contactOption: 'TollFree',
    areaServed: 'PK',
    availableLanguage: ['English', 'Urdu'],
    hoursAvailable: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00',
    },
  },
  sameAs: [
    'https://www.facebook.com/akbartaxstore',
    'https://wa.me/923017300408',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Tax & Business Registration Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'NTN Registration',
          description: 'FBR NTN registration for individuals and businesses in Pakistan',
        },
        price: '4000',
        priceCurrency: 'PKR',
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Income Tax Return Filing',
          description: 'FBR income tax return filing for salaried, business, and freelance individuals',
        },
        price: '5000',
        priceCurrency: 'PKR',
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'SECP Company Registration',
          description: 'Private Limited Company registration with SECP Pakistan',
        },
        price: '15000',
        priceCurrency: 'PKR',
      },
    ],
  },
};

// ─── FAQPage Schema ───────────────────────────────────────────────────────────
// Targets PAA boxes for local + service queries
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does NTN registration cost in Pakistan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Akbar Tax Store charges PKR 4,000 for NTN registration. This includes complete IRIS portal registration, document verification, and NTN certificate delivery within 24 hours. WhatsApp 0340-7300408 to get started.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does tax return filing take at Akbar Tax Store?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Akbar Tax Store completes FBR income tax return filing within 24 hours of receiving your documents via WhatsApp. You receive your filed return confirmation the same day in most cases. Tax return filing starts from PKR 5,000.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Akbar Tax Store offer services online across Pakistan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Akbar Tax Store provides all services 100% online via WhatsApp (0340-7300408). You can submit your documents from anywhere in Pakistan — Karachi, Lahore, Islamabad, Faisalabad, or abroad. No in-person visit required.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the WhatsApp number for Akbar Tax Store?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can reach Akbar Tax Store on WhatsApp at 0340-7300408 or 0301-6832064. Our team responds Monday to Saturday, 9am to 6pm Pakistan Standard Time. You can also use the contact form on this page.',
      },
    },
  ],
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ContactClient />
    </>
  );
}