'use client';

import { useState } from 'react';
import Head from 'next/head';

export default function PrivacyPolicy() {
  const [openSections, setOpenSections] = useState({
    1: true,
  });

  const toggleSection = (id) => {
    setOpenSections(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const sections = [
    {
      id: 1,
      title: '1. Introduction',
      content: (
        <p>
          At Akbar Tax Store, your privacy is very important to us. This Privacy Policy outlines how we collect, use, share, and protect your personal information when you visit or interact with our website or use our services.
          <br /><br />
          By using our services, you agree to the terms of this Privacy Policy.
        </p>
      ),
    },
    {
      id: 2,
      title: '2. Information We Collect',
      content: (
        <>
          <p>We collect two types of information:</p>
          <br />
          <p className="font-semibold">a. Personal Information</p>
          <p>You may voluntarily provide us with personal information when:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Filling out our contact or registration forms</li>
            <li>Booking a tax or business service</li>
            <li>Submitting documents or identification details</li>
            <li>Contacting us via WhatsApp, phone, or email</li>
          </ul>
          <p className="mt-2">Examples of personal information collected include:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Full Name</li>
            <li>WhatsApp Number</li>
            <li>Email Address</li>
            <li>CNIC / Business Registration Number</li>
            <li>Financial Documents or Tax Information</li>
            <li>Address (optional)</li>
          </ul>
          <br />
          <p className="font-semibold">b. Non-Personal Information</p>
          <p>We also collect non-personal data automatically through:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Cookies</li>
            <li>IP address</li>
            <li>Browser type</li>
            <li>Operating system</li>
            <li>Pages visited, time spent, etc.</li>
          </ul>
          <p className="mt-2">This data helps us improve our website performance and user experience.</p>
        </>
      ),
    },
    {
      id: 3,
      title: '3. How We Use Your Information',
      content: (
        <>
          <p>Your information is used for the following purposes:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>To provide tax, NTN, company registration, and other services</li>
            <li>To verify your identity and documents</li>
            <li>To respond to inquiries or support requests</li>
            <li>To send you updates regarding your application status</li>
            <li>To improve our services and customer experience</li>
            <li>To comply with legal obligations under Pakistani law</li>
          </ul>
          <p className="mt-2">We do not sell or rent your personal data to third parties.</p>
        </>
      ),
    },
    {
      id: 4,
      title: '4. Data Sharing and Disclosure',
      content: (
        <>
          <p>We only share your information when necessary and with trusted entities, including:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Government authorities (e.g., FBR, SECP, NADRA) – for submitting your applications</li>
            <li>Internal staff or partners – to process your order</li>
            <li>Third-party service providers – like cloud storage or email providers, strictly for operational use</li>
          </ul>
          <p className="mt-2">We ensure all third parties adhere to appropriate confidentiality and data protection measures.</p>
        </>
      ),
    },
    {
      id: 5,
      title: '5. Data Retention',
      content: (
        <>
          <p>We retain your personal data only for as long as required:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>To complete your requested services</li>
            <li>To fulfill legal or accounting requirements</li>
            <li>To maintain business records (as per FBR & SECP regulations)</li>
          </ul>
          <p className="mt-2">After that, your data is securely deleted or anonymized.</p>
        </>
      ),
    },
    {
      id: 6,
      title: '6. Your Rights',
      content: (
        <>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Request access to your personal data</li>
            <li>Request correction or deletion of inaccurate data</li>
            <li>Withdraw your consent (where applicable)</li>
            <li>Ask us to stop using your data for direct marketing</li>
          </ul>
          <p className="mt-2">
            To exercise these rights, email us at:
            <br />
            <a href="mailto:privacy@akbartaxstore.com" className="text-[#0040A8] hover:underline">📧 privacy@akbartaxstore.com</a>
          </p>
        </>
      ),
    },
    {
      id: 7,
      title: '7. Cookies & Tracking Technologies',
      content: (
        <>
          <p>We use cookies to:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Remember your preferences</li>
            <li>Improve website speed and performance</li>
            <li>Understand user behavior (via analytics tools)</li>
          </ul>
          <p className="mt-2">
            You can choose to disable cookies in your browser settings. However, some features of our website may not function properly without them.
          </p>
        </>
      ),
    },
    {
      id: 8,
      title: '8. Third-Party Links',
      content: (
        <p>
          Our website may contain links to external websites (e.g., FBR portal, SECP, or business registration resources). We are not responsible for the privacy practices or content of those websites. Please review their policies separately.
        </p>
      ),
    },
    {
      id: 9,
      title: '9. Data Security',
      content: (
        <>
          <p>We take appropriate technical and organizational measures to protect your personal information against:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Unauthorized access</li>
            <li>Loss or theft</li>
            <li>Misuse or alteration</li>
          </ul>
          <p className="mt-2">We use secure encryption, HTTPS, password protection, and data access control internally.</p>
        </>
      ),
    },
    {
      id: 10,
      title: '10. Privacy of Children',
      content: (
        <p>
          Our services are not intended for individuals under the age of 18. We do not knowingly collect personal data from children.
        </p>
      ),
    },
    {
      id: 11,
      title: '11. Changes to This Policy',
      content: (
        <>
          <p>We may update this Privacy Policy from time to time. The latest version will always be available on this page with the updated date.</p>
          <p className="mt-2">If changes are significant, we will notify users via email or website banner.</p>
        </>
      ),
    },
    {
      id: 12,
      title: '12. Contact Us',
      content: (
        <>
          <p>
            If you have any questions, concerns, or requests regarding your privacy, please contact us at:
          </p>
          <ul className="mt-2 space-y-1">
            <li><a href="mailto:hussnain@akbartaxstore.com" className="text-[#0040A8] hover:underline">📧 hussnain@akbartaxstore.com</a></li>
            <li>📞 +92 301-6832064</li>
            <li>🏢 Office Address: 348 E5 Street, Topaz Block, Park View City Multan Road<br />
                      Lahore, Pakistan</li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>Privacy Policy | Akbar Tax Store</title>
        <meta name="description" content="Privacy Policy for Akbar Tax Store" />
      </Head>

      <div className="min-h-screen bg-[#D9E8FF]">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-[#072971] p-6 text-white">
              <h1 className="text-2xl md:text-3xl font-bold">📜 Privacy Policy for Akbar Tax Store</h1>
              <div className="mt-2 text-[#D9E8FF]">
                <p>Effective Date: August 5, 2025</p>
                <p>Website: <a href="https://www.akbartaxstore.com" className="hover:underline">www.akbartaxstore.com</a></p>
                <p>Owner: Akbar Tax Store</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                {sections.map((section) => (
                  <div key={section.id} className="border-b border-[#D9E8FF] last:border-0 pb-4 last:pb-0">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex justify-between items-center text-left focus:outline-none"
                    >
                      <h2 className="text-xl font-semibold text-[#072971]">{section.title}</h2>
                      <svg
                        className={`w-5 h-5 text-[#0040A8] transition-transform duration-200 ${openSections[section.id] ? 'transform rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div
                      className={`mt-2 text-gray-700 leading-relaxed overflow-hidden transition-all duration-300 ${openSections[section.id] ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                      <div className="pb-2">{section.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}