// src/app/(public)/contact/page.js  — Server Component
// Exports metadata so Google's crawler sees the correct title/description in SSR.
// The interactive form lives in ContactClient.jsx (client component).

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
    title: 'Contact Akbar Tax Store | WhatsApp 0340-7300408',
    description:
      'Contact us for free tax consultation. WhatsApp 0340-7300408. NTN, FBR tax filing, SECP registration in 24 hours across Pakistan.',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
