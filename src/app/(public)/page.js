// src/app/page.jsx

import Link from 'next/link';
import Image from 'next/image';
import HomepageClient from '@/app/components/HomepageClient';
import {
  HOME_STATS,
  HOME_SERVICES,
  HOME_FEATURES,
  HOME_FAQS,
  HOME_GUIDES,
  SITE_CONFIG,
} from '@/constants';

// ── Page-level metadata ───────────────────────────────────────────────────────
// Overrides root layout for this route only.
// Rendered title: "FBR Tax Filing & NTN Registration Services in Pakistan | Akbar Tax Store"
export const metadata = {
  title: 'FBR Tax Filing & NTN Registration Services in Pakistan',
  description:
    'Akbar Tax Store — expert FBR tax filing, NTN registration, and SECP company registration in Faisalabad, Pakistan. Become an active filer in 24 hours. 500+ happy clients.',
  alternates: {
    canonical: 'https://www.akbartaxstore.com',
  },
  openGraph: {
    title: 'FBR Tax Filing & NTN Registration Services in Pakistan | Akbar Tax Store',
    description:
      'Professional FBR tax filing, NTN registration, SECP company registration, GST and trademark services in Pakistan. Get results in 24 hours.',
    url: 'https://www.akbartaxstore.com',
  },
};

// ── FAQPage schema builder ────────────────────────────────────────────────────
// Reads from HOME_FAQS so the visible FAQ section and schema stay in sync.
// Any edit to HOME_FAQS in constants/index.js updates both automatically.
const buildFaqSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a },
  })),
});

// ─────────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      {/* FAQPage schema injected into <head> by Next.js */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema(HOME_FAQS)) }}
      />

      {/* ════════════════════════════════════════════════════════════════════
          HERO
          H1 = primary keyword target ("FBR Tax Filing" + "NTN Registration")
          Brand tagline sits below as a sub-heading — personality preserved
          without wasting the H1 on an unsearchable phrase.
      ════════════════════════════════════════════════════════════════════ */}
      <section
        className="pt-16 pb-16 px-4 sm:px-6 lg:px-8"
        style={{ background: 'linear-gradient(135deg, #D9E8FF 0%, #FFFFFF 100%)' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
            style={{ color: '#050505' }}
          >
            <span style={{ color: '#0040A8' }}>FBR Tax Filing</span> &amp;{' '}
            <span style={{ color: '#0040A8' }}>NTN Registration</span>{' '}
            Services in Pakistan
          </h1>

          <p className="text-xl sm:text-2xl mb-4 font-medium" style={{ color: '#072971' }}>
            {SITE_CONFIG.name} — {SITE_CONFIG.tagline}
          </p>

          <p className="text-lg mb-8 max-w-2xl mx-auto leading-relaxed" style={{ color: '#4B5563' }}>
            Professional FBR tax filing, NTN registration, SECP company registration, GST,
            and trademark services across Pakistan. Become an active filer in 24 hours —
            all from the comfort of your home.
          </p>

          {/* Typing animation — client-only, decorative, not crawled by Google */}
          <HomepageClient section="hero-typing" />

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Link
              href="/personal"
              className="w-full sm:w-auto text-[#0040A8] border-2 border-[#0040A8] px-8 py-4 rounded-lg font-semibold hover:bg-[#0040A8] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
            >
              Personal Tax Services
            </Link>
            <Link
              href="/business"
              className="w-full sm:w-auto bg-[#0040A8] text-white border-2 border-[#0040A8] px-8 py-4 rounded-lg font-semibold hover:bg-[#072971] transition-all duration-300 flex items-center justify-center gap-2"
            >
              Business Tax Services
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          ABOUT
          H2 = local keyword ("Tax Consultant in Faisalabad, Pakistan")
          Body copy includes FBR, IRIS, ATL, NTN, SECP — real search terms.
          Stats: static HTML values visible to Google; animations applied
          on top via HomepageClient (client-side only).
      ════════════════════════════════════════════════════════════════════ */}
      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{ color: '#050505' }}>
                Trusted{' '}
                <span style={{ color: '#0040A8' }}>Tax Consultant in Faisalabad</span>,
                Pakistan
              </h2>

              <p className="text-lg mb-5 leading-relaxed" style={{ color: '#072971' }}>
                Akbar Tax Store is a modern tax consultancy based in Faisalabad, Pakistan.
                We specialise in helping individuals, freelancers, and businesses file their
                FBR income tax returns, obtain an NTN (National Tax Number), and appear on
                the Active Taxpayer List (ATL) — all handled directly on the FBR IRIS portal
                by our certified team.
              </p>
              <p className="text-lg mb-8 leading-relaxed" style={{ color: '#072971' }}>
                From SECP company registration and GST enrollment to trademark registration
                and bookkeeping, we handle all government portal submissions and legal
                paperwork so you can focus on growing your business. Our clients across
                Pakistan receive results in as little as 24 hours.
              </p>

              <div className="p-6 rounded-lg mb-8" style={{ backgroundColor: '#D9E8FF' }}>
                <p className="font-semibold mb-1" style={{ color: '#0040A8' }}>
                  Free consultation — no obligations.
                </p>
                <p style={{ color: '#072971' }}>
                  Talk to a tax expert today in Urdu or English.
                </p>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors"
                style={{ backgroundColor: '#0040A8' }}
              >
                Contact Now →
              </Link>
            </div>

            {/* Stats — static values rendered in HTML (visible to Google crawler).
                Counter animation fires on scroll-into-view via HomepageClient. */}
            <div className="grid grid-cols-2 gap-6">
              {HOME_STATS.map((stat) => (
                <div
                  key={stat.id}
                  className="p-6 rounded-lg text-center"
                  style={{ backgroundColor: '#D9E8FF' }}
                >
                  <div
                    id={stat.id}
                    className="text-3xl font-bold mb-2"
                    style={{ color: '#0040A8' }}
                  >
                    {stat.value}
                  </div>
                  <div style={{ color: '#072971' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Mounts the IntersectionObserver for counter animation — renders nothing */}
            <HomepageClient section="counters" />

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SERVICES
          H2 contains primary + location keywords.
          Cards link to individual SEO landing pages, not the generic
          /services-fees page, so each service can rank on its own.
      ════════════════════════════════════════════════════════════════════ */}
      <section
        id="services"
        className="py-16 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: '#D9E8FF' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#050505' }}>
              FBR Tax &amp;{' '}
              <span style={{ color: '#0040A8' }}>Business Registration Services</span>{' '}
              in Pakistan
            </h2>
            <p className="text-xl" style={{ color: '#072971' }}>
              Complete tax compliance and business setup solutions — for individuals and
              companies across Pakistan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {HOME_SERVICES.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 max-w-sm mx-auto w-full block"
              >
                <div className="h-32 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.alt}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#050505' }}>
                    {service.title}
                  </h3>
                  <p className="mb-4 leading-relaxed text-sm line-clamp-3" style={{ color: '#072971' }}>
                    {service.description}
                  </p>
                  <span
                    className="inline-block w-full text-center text-white px-3 py-2 rounded-md text-sm font-medium"
                    style={{ backgroundColor: '#0040A8' }}
                  >
                    Learn More →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/services-fees"
              className="inline-flex items-center justify-center gap-2 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: '#072971' }}
            >
              View All Services &amp; Fees
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          WHY CHOOSE US
          E-E-A-T trust signals — required for YMYL pages (tax/finance).
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#050505' }}>
              Why 500+ Clients Choose{' '}
              <span style={{ color: '#0040A8' }}>Akbar Tax Store</span>
            </h2>
            <p className="text-xl" style={{ color: '#072971' }}>
              FBR-verified processes. Transparent pricing. Results in 24 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {HOME_FEATURES.map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-xl border"
                style={{ borderColor: '#D9E8FF', backgroundColor: '#FAFCFF' }}
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#050505' }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#4B5563' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          FAQ
          Schema built dynamically from HOME_FAQS — visible content and
          JSON-LD always in sync. <details>/<summary> renders without JS.
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F8FAFF' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#050505' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: '#072971' }}>
              Common questions about FBR tax filing and business registration in Pakistan.
            </p>
          </div>

          <div className="space-y-4">
            {HOME_FAQS.map((faq, i) => (
              <details
                key={i}
                className="group rounded-xl border p-5 cursor-pointer"
                style={{ borderColor: '#D9E8FF', backgroundColor: '#FFFFFF' }}
              >
                <summary
                  className="font-semibold text-base list-none flex justify-between items-center"
                  style={{ color: '#050505' }}
                >
                  {faq.q}
                  <span className="ml-4 text-xl font-light text-[#0040A8] group-open:rotate-45 transition-transform inline-block">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: '#4B5563' }}>
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          GUIDE LINKS
          Internal <Link>s from the homepage pass PageRank to guide pages.
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: '#050505' }}>
            Free Guides &amp;{' '}
            <span style={{ color: '#0040A8' }}>Tax Resources</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOME_GUIDES.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="p-4 rounded-lg border text-sm font-medium hover:border-blue-400 transition-colors"
                style={{ borderColor: '#D9E8FF', color: '#0040A8', backgroundColor: '#F8FAFF' }}
              >
                📄 {guide.title} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          CTA
          Internal route → Link. External WhatsApp URL → <a>.
      ════════════════════════════════════════════════════════════════════ */}
      <section
        className="py-16 px-4 sm:px-6 lg:px-8"
        style={{ background: 'linear-gradient(135deg, #0040A8 0%, #072971 100%)' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            File Your FBR Tax Return Today
          </h2>
          <p className="text-xl mb-8 leading-relaxed" style={{ color: '#D9E8FF' }}>
            No queues. No paperwork stress. Just fast, reliable FBR tax filing and NTN
            registration services — for individuals and businesses across Pakistan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/services-fees"
              className="w-full sm:w-auto bg-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center justify-center gap-2"
              style={{ color: '#0040A8' }}
            >
              Explore Services &amp; Fees
            </Link>
            {/* External URL — <a> is correct, not Link */}
            <a
              href={SITE_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#0040A8] transition-colors flex items-center justify-center gap-2"
            >
              WhatsApp Us Now
            </a>
          </div>
        </div>
      </section>
    </>
  );
}