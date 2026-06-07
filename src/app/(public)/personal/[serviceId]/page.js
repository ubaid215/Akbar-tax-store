// src/app/(public)/personal/[serviceId]/page.jsx
// UPDATED — changes from previous version:
// 1. Added buildFAQSchema() — FAQPage JSON-LD per service (uses service.faqs)
// 2. Replaced single service.description paragraph with longDescription multi-paragraph renderer
// 3. Added "Who Needs This?" section (service.whoNeeds)
// 4. Added "What Happens If You Don't?" consequences section (service.consequences)
// 5. Added visible FAQ accordion section (service.faqs)
// 6. All new sections are optional-chained — pages without the new fields render exactly as before
// BreadcrumbList, Service schema, metadata, generateStaticParams — all unchanged.

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PERSONAL_SERVICES, SITE_CONFIG } from '@/constants';

const BASE_URL = 'https://www.akbartaxstore.com';

export async function generateStaticParams() {
  return PERSONAL_SERVICES.map((s) => ({ serviceId: s.id }));
}

export async function generateMetadata({ params }) {
  const { serviceId } = await params;
  const service = PERSONAL_SERVICES.find((s) => s.id === serviceId);
  if (!service) return { title: 'Service Not Found' };
  return {
    title: service.metaTitle,
    description: service.metaDesc,
    alternates: { canonical: `${BASE_URL}${service.href}` },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDesc,
      url: `${BASE_URL}${service.href}`,
    },
  };
}

// ── Service JSON-LD schema (unchanged) ───────────────────────────────────────
function buildServiceSchema(service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    url: `${BASE_URL}${service.href}`,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Akbar Tax Store',
      url: BASE_URL,
      telephone: SITE_CONFIG.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: SITE_CONFIG.address.street,
        addressLocality: SITE_CONFIG.address.city,
        addressRegion: SITE_CONFIG.address.region,
        addressCountry: 'PK',
      },
    },
    areaServed: { '@type': 'Country', name: 'Pakistan' },
    offers: {
      '@type': 'Offer',
      price: service.price,
      priceCurrency: 'PKR',
      availability: 'https://schema.org/InStock',
    },
  };
}

// ── BreadcrumbList schema (unchanged) ────────────────────────────────────────
function buildBreadcrumbSchema(service) {
  return {
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
        name: 'Personal Tax Services',
        item: `${BASE_URL}/personal`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: service.title,
        item: `${BASE_URL}${service.href}`,
      },
    ],
  };
}

// ── FAQPage schema (NEW) ──────────────────────────────────────────────────────
// Only injected when service.faqs exists and has entries.
// Targets PAA boxes and FAQ rich results in Google SERPs.
function buildFAQSchema(service) {
  if (!service.faqs?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  };
}

export default async function ServiceDetailPage({ params }) {
  const { serviceId } = await params;
  const service = PERSONAL_SERVICES.find((s) => s.id === serviceId);
  if (!service) notFound();

  const related = PERSONAL_SERVICES.filter((s) => s.id !== service.id).slice(0, 3);
  const faqSchema = buildFAQSchema(service);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildServiceSchema(service)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema(service)) }}
      />
      {/* FAQPage schema — only rendered when service has faqs array */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="min-h-screen bg-[#D9E8FF]">

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="relative bg-gradient-to-r from-[#072971] to-[#0040A8] text-white py-16">
          <div className="container mx-auto px-6">
            <Link
              href="/personal"
              className="inline-flex items-center text-[#D9E8FF] hover:text-white mb-6 text-sm"
            >
              <svg className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Personal Services
            </Link>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{service.h1}</h1>

            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-white text-[#0040A8] px-4 py-2 rounded-full text-lg font-semibold">
                PKR {service.price.toLocaleString()}
              </span>
              <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">
                ⏱ {service.duration}
              </span>
              <span className="text-[#D9E8FF] text-sm">{service.description}</span>
            </div>
          </div>
        </section>

        {/* ── Main content ───────────────────────────────────────────────── */}
        <div className="container mx-auto px-6 py-12">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* ── Left: all content sections ───────────────────────── */}
                <div className="lg:col-span-2">

                  {/* ── Service Overview ─────────────────────────────────
                      If longDescription exists: render each double-newline
                      separated paragraph. Falls back to single description. */}
                  <h2 className="text-2xl font-bold text-[#072971] mb-4">Service Overview</h2>
                  {service.longDescription
                    ? service.longDescription
                        .split('\n\n')
                        .map((para, i) => (
                          <p key={i} className="text-[#050505] mb-4 leading-relaxed">
                            {para.trim()}
                          </p>
                        ))
                    : (
                      <p className="text-[#050505] mb-8 leading-relaxed">
                        {service.description}
                      </p>
                    )
                  }

                  {/* ── Who Needs This? (NEW) ─────────────────────────── */}
                  {service.whoNeeds?.length > 0 && (
                    <div className="mb-8 mt-6">
                      <h2 className="text-xl font-semibold text-[#0040A8] mb-4">
                        Who Needs {service.title}?
                      </h2>
                      <ul className="space-y-2">
                        {service.whoNeeds.map((item, i) => (
                          <li key={i} className="flex items-start">
                            <span
                              className="font-bold mr-3 mt-0.5 flex-shrink-0 text-base leading-none"
                              style={{ color: '#0040A8' }}
                            >
                              →
                            </span>
                            <span className="text-[#050505] text-sm leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* ── Our Process (unchanged) ───────────────────────── */}
                  <h2 className="text-xl font-semibold text-[#0040A8] mb-4">Our Process</h2>
                  <ol className="mb-8 space-y-4">
                    {service.process.map((step, i) => (
                      <li key={i} className="flex items-start">
                        <span className="bg-[#0040A8] text-white font-bold rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-0.5 flex-shrink-0 text-sm">
                          {i + 1}
                        </span>
                        <span className="text-[#050505] leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>

                  {/* ── Key Benefits (unchanged) ──────────────────────── */}
                  <h2 className="text-xl font-semibold text-[#0040A8] mb-4">Key Benefits</h2>
                  <ul className="mb-8 space-y-3">
                    {service.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-green-500 mr-3 mt-0.5 text-lg leading-none">✓</span>
                        <span className="text-[#050505] leading-relaxed">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  {/* ── What Happens If You Don't? (NEW) ─────────────── */}
                  {service.consequences?.length > 0 && (
                    <div className="mb-8 p-5 bg-red-50 rounded-xl border border-red-100">
                      <h2 className="text-lg font-semibold text-red-800 mb-4">
                        What Happens Without {service.title}?
                      </h2>
                      <ul className="space-y-2">
                        {service.consequences.map((item, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-red-500 mr-3 mt-0.5 font-bold flex-shrink-0 leading-none">
                              ✕
                            </span>
                            <span className="text-red-700 text-sm leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* ── FAQ Section (NEW) ─────────────────────────────── */}
                  {service.faqs?.length > 0 && (
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold text-[#0040A8] mb-6">
                        Frequently Asked Questions
                      </h2>
                      <div className="space-y-4">
                        {service.faqs.map((faq, i) => (
                          <div
                            key={i}
                            className="p-5 bg-[#F7FAFF] rounded-xl border border-[#D9E8FF]"
                          >
                            <h3 className="font-semibold text-[#072971] mb-2 text-sm leading-snug">
                              {faq.q}
                            </h3>
                            <p className="text-[#050505] text-sm leading-relaxed">{faq.a}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* ── Right: Documents + CTAs (unchanged) ──────────────── */}
                <div>
                  <div className="bg-[#D9E8FF] rounded-lg p-6 sticky top-24">

                    <h2 className="text-xl font-bold text-[#072971] mb-4">Documents Required</h2>
                    <ul className="space-y-3 mb-6">
                      {service.requirements.map((req, i) => (
                        <li key={i} className="flex items-start">
                          <span className="bg-[#0040A8] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 text-xs font-bold">
                            {i + 1}
                          </span>
                          <span className="text-[#050505] text-sm leading-relaxed">{req}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="space-y-3 mb-6">
                      <Link
                        href={`/contact?service=${encodeURIComponent(service.title)}`}
                        className="block w-full bg-[#0040A8] hover:bg-[#072971] text-white font-bold py-3 px-6 rounded-lg text-center transition-colors"
                      >
                        Apply Now
                      </Link>
                      <a
                        href={SITE_CONFIG.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors"
                      >
                        📱 WhatsApp Now
                      </a>
                    </div>

                    <div className="pt-5 border-t border-[#0040A8]/30">
                      <h3 className="text-sm font-semibold text-[#072971] mb-3">Contact Information</h3>
                      <div className="space-y-2">
                        <a
                          href={SITE_CONFIG.phoneTel}
                          className="flex items-center text-sm text-[#050505] hover:text-[#0040A8] transition-colors"
                        >
                          <svg className="h-4 w-4 text-[#0040A8] mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          {SITE_CONFIG.phoneDisplay}
                        </a>
                        <a
                          href={`mailto:${SITE_CONFIG.email}`}
                          className="flex items-center text-sm text-[#050505] hover:text-[#0040A8] transition-colors"
                        >
                          <svg className="h-4 w-4 text-[#0040A8] mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          {SITE_CONFIG.email}
                        </a>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>

            {/* ── Related services (unchanged) ──────────────────────────── */}
            <div className="bg-[#F7FAFF] px-8 py-6 border-t border-[#D9E8FF]">
              <h2 className="text-xl font-bold text-[#072971] mb-4">Related Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {related.map((rel) => (
                  <Link
                    key={rel.id}
                    href={rel.href}
                    className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-[#D9E8FF]"
                  >
                    <h3 className="font-semibold text-[#0040A8] mb-1">{rel.title}</h3>
                    <p className="text-sm text-[#050505] mb-2">{rel.description}</p>
                    <p className="text-xs text-[#0040A8] font-semibold">
                      PKR {rel.price.toLocaleString()}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}