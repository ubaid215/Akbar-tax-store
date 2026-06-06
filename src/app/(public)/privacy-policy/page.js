// src/app/(public)/privacy-policy/page.js
// ✅ FIX 1: Converted to Server Component pattern (App Router compatible)
// ✅ FIX 2: Replaced <Head> (Pages Router) with metadata export (App Router)
// ✅ FIX 3: Added canonical URL
// ✅ FIX 4: Added OpenGraph tags for social sharing
// ✅ FIX 5: Interactive accordion moved to PrivacyClient (Client Component)

import PrivacyClient from './PrivacyClient';

const BASE_URL = 'https://www.akbartaxstore.com';

export const metadata = {
  title: 'Privacy Policy | Akbar Tax Store — Your Data is Safe With Us',
  description:
    'Read the Privacy Policy for Akbar Tax Store. Learn how we collect, use, and protect your personal data including CNIC, tax documents, and contact information. FBR-compliant data handling.',
  alternates: {
    canonical: `${BASE_URL}/privacy-policy`,
  },
  openGraph: {
    title: 'Privacy Policy | Akbar Tax Store',
    description:
      'How Akbar Tax Store protects your personal information, tax documents, and CNIC data. Compliant with Pakistani data protection standards.',
    url: `${BASE_URL}/privacy-policy`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyClient />;
}