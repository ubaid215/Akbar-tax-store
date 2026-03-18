// src/app/international-financial-services/page.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Server Component — no 'use client'.
//
// TARGET AUDIENCE: USA, UK, Australia, Canada startups and SMEs looking to
// outsource financial modeling, pitch decks, fractional CFO, and FP&A work
// to a cost-effective Pakistan-based team.
//
// INTERNATIONAL SEO STRATEGY:
// - Title targets "financial modeling services" + "outsource" — high-intent
//   transactional keywords searched by international clients
// - H1 targets "outsourced financial modeling services" — $2.36B market
// - Individual service H2s match exact phrases clients type on Google/Upwork
// - ProfessionalService + ItemList JSON-LD for rich results internationally
// - Price in USD (not PKR) for international audience
// - "Pakistan" mentioned strategically as cost advantage, not limitation
// - No mention of FBR/IRIS/NTN — this page is a completely separate brand
//   proposition targeting international B2B clients
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link';
import { SITE_CONFIG } from '@/constants';

const BASE_URL = 'https://www.akbartaxstore.com';

export const metadata = {
  title: 'Outsourced Financial Modeling & CFO Services | Akbar Tax Store',
  description:
    'Expert outsourced financial modeling, pitch deck creation, fractional CFO, and FP&A services for startups and SMEs in USA, UK, Australia, and Canada. CPA-grade quality at 60% lower cost. Based in Pakistan.',
  alternates: { canonical: `${BASE_URL}/international-financial-services` },
  openGraph: {
    title: 'Outsourced Financial Modeling & CFO Services | Akbar Tax Store',
    description:
      'Financial models, investor pitch decks, fractional CFO, business valuation, and FP&A for international startups. Expert team, USD pricing, fast turnaround.',
    url: `${BASE_URL}/international-financial-services`,
  },
};

// ── Structured data ───────────────────────────────────────────────────────────
const schema = [
  {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${BASE_URL}/international-financial-services#service`,
    name: 'Akbar Tax Store — International Financial Services',
    url: `${BASE_URL}/international-financial-services`,
    description:
      'Outsourced financial modeling, pitch deck creation, fractional CFO, FP&A, and business valuation services for startups and SMEs in USA, UK, Australia, and Canada.',
    provider: {
      '@type': 'Organization',
      name: 'Akbar Tax Store',
      url: BASE_URL,
      telephone: SITE_CONFIG.phone,
      email: SITE_CONFIG.email,
    },
    areaServed: [
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'United Kingdom' },
      { '@type': 'Country', name: 'Australia' },
      { '@type': 'Country', name: 'Canada' },
      { '@type': 'Country', name: 'United Arab Emirates' },
    ],
    serviceType: [
      'Financial Modeling',
      'Pitch Deck Creation',
      'Fractional CFO Services',
      'Business Valuation',
      'FP&A Services',
      'Business Plan Writing',
    ],
    priceRange: '$500 - $5,000',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'International Financial Services — Akbar Tax Store',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Financial Modeling', url: `${BASE_URL}/international-financial-services#financial-modeling` },
      { '@type': 'ListItem', position: 2, name: 'Investor Pitch Deck', url: `${BASE_URL}/international-financial-services#pitch-deck` },
      { '@type': 'ListItem', position: 3, name: 'Fractional CFO Services', url: `${BASE_URL}/international-financial-services#fractional-cfo` },
      { '@type': 'ListItem', position: 4, name: 'Business Valuation', url: `${BASE_URL}/international-financial-services#valuation` },
      { '@type': 'ListItem', position: 5, name: 'FP&A Services', url: `${BASE_URL}/international-financial-services#fpa` },
      { '@type': 'ListItem', position: 6, name: 'Business Plan Writing', url: `${BASE_URL}/international-financial-services#business-plan` },
    ],
  },
];

// ── Service data ──────────────────────────────────────────────────────────────
const SERVICES = [
  {
    id: 'financial-modeling',
    icon: '📊',
    title: 'Financial Modeling',
    tagline: 'Investor-grade models built in Excel & Google Sheets',
    description:
      'Custom 3-statement financial models (P&L, Balance Sheet, Cash Flow), LBO models, DCF valuations, scenario analysis, and sensitivity tables. Built to the standards expected by VCs, PE firms, and investment banks.',
    deliverables: [
      '3-statement integrated financial model',
      'Revenue and cost driver assumptions',
      'Scenario and sensitivity analysis',
      'KPI dashboard and charts',
      'Fully unlocked Excel/Sheets file',
    ],
    price: 'From $800',
    timeline: '3–7 business days',
    bestFor: 'Startups raising Seed to Series B, M&A targets, PE-backed companies',
    accent: '#0040A8',
  },
  {
    id: 'pitch-deck',
    icon: '🎯',
    title: 'Investor Pitch Deck',
    tagline: 'Decks that get meetings with investors',
    description:
      'Compelling investor pitch decks covering problem, solution, market size (TAM/SAM/SOM), business model, traction, financials, team, and ask. Includes financial summary slides with cohort analysis and unit economics.',
    deliverables: [
      '12–16 slide narrative-driven deck',
      'Financial projections slides (3–5 year)',
      'Market sizing and competitive analysis',
      'Unit economics and cohort analysis',
      'Editable PowerPoint + PDF delivery',
    ],
    price: 'From $600',
    timeline: '5–7 business days',
    bestFor: 'Pre-seed to Series A fundraising, demo days, VC meetings',
    accent: '#0040A8',
  },
  {
    id: 'fractional-cfo',
    icon: '👔',
    title: 'Fractional CFO Services',
    tagline: 'Senior financial leadership without the $200K salary',
    description:
      'Virtual CFO support for startups and growing SMEs. Includes financial strategy, monthly management reporting, board meeting preparation, fundraising support, cash flow management, and investor relations.',
    deliverables: [
      'Monthly financial close and management pack',
      'Cash flow forecasting and runway analysis',
      'Board deck preparation and attendance',
      'KPI tracking and variance analysis',
      'Fundraising financial due diligence support',
    ],
    price: 'From $1,500/month',
    timeline: 'Ongoing monthly engagement',
    bestFor: 'Startups post-Seed, SMEs scaling to $1M–$10M ARR',
    accent: '#0040A8',
  },
  {
    id: 'valuation',
    icon: '💰',
    title: 'Business Valuation',
    tagline: 'Defensible valuations for investors, M&A, and legal',
    description:
      'Comprehensive business valuation reports using DCF, comparable company analysis (CCA), and precedent transaction analysis. Suitable for VC negotiations, M&A due diligence, ESOP setup, and legal proceedings.',
    deliverables: [
      'Full valuation report (20–40 pages)',
      'DCF analysis with WACC calculation',
      'Comparable company analysis (10+ comps)',
      'Precedent transaction benchmarking',
      'Executive summary and concluded value range',
    ],
    price: 'From $1,200',
    timeline: '5–10 business days',
    bestFor: 'M&A transactions, VC term sheet negotiations, ESOP/409A, legal disputes',
    accent: '#0040A8',
  },
  {
    id: 'fpa',
    icon: '📈',
    title: 'FP&A Services',
    tagline: 'Financial planning and analysis for data-driven decisions',
    description:
      'Ongoing financial planning and analysis — budget vs. actual reporting, rolling forecasts, department-level P&L analysis, cohort analysis, and executive dashboards. Replaces the need for an in-house FP&A analyst.',
    deliverables: [
      'Annual budget and quarterly rolling forecast',
      'Monthly budget vs. actual variance reports',
      'Department and product-level P&L breakdowns',
      'SaaS metrics (MRR, ARR, churn, LTV, CAC)',
      'Excel or Tableau dashboard delivery',
    ],
    price: 'From $1,000/month',
    timeline: 'Ongoing monthly engagement',
    bestFor: 'SaaS companies, e-commerce, funded startups with $500K+ ARR',
    accent: '#0040A8',
  },
  {
    id: 'business-plan',
    icon: '📝',
    title: 'Business Plan Writing',
    tagline: 'Comprehensive plans for bank loans, visas, and investors',
    description:
      'Professional business plans for bank financing, SBA loans, visa applications (E-2, EB-5, UK Innovator), and investor presentations. Includes executive summary, market research, competitive analysis, operations plan, and 5-year financial projections.',
    deliverables: [
      'Complete business plan (30–50 pages)',
      'Executive summary (2-page)',
      'Market research and competitive analysis',
      '5-year financial projections with assumptions',
      'Operations and implementation plan',
    ],
    price: 'From $700',
    timeline: '5–10 business days',
    bestFor: 'Bank loan applications, SBA loans, UK/USA/Canada visa applications, investor decks',
    accent: '#0040A8',
  },
];

const STATS = [
  { value: '60%', label: 'Cost saving vs US/UK firms' },
  { value: '48hr', label: 'Average turnaround' },
  { value: '500+', label: 'Projects delivered' },
  { value: 'CPA', label: 'Qualified team' },
];

const CLIENTS = ['USA', 'UK', 'UAE', 'AUS', 'CAN'];

const FAQS = [
  {
    q: 'How do you ensure quality at this price point?',
    a: 'Our team holds CPA, ACCA, and MBA qualifications with experience at Big 4 firms. Pakistan\'s lower cost of living — not lower quality standards — enables competitive pricing. We follow the same Excel modeling best practices as top investment banks.',
  },
  {
    q: 'What software and standards do you use?',
    a: 'Excel, Google Sheets, PowerPoint, and Google Slides for deliverables. We build models following FAST (Flexible, Appropriate, Structured, Transparent) modeling standards. Financial statements are prepared to GAAP/IFRS standards as required.',
  },
  {
    q: 'How do we communicate and share files?',
    a: 'All projects are managed via email, WhatsApp, or Slack. Files are shared via Google Drive or Dropbox. We schedule weekly video calls (Zoom/Teams) for ongoing engagements. We work across all time zones — our team covers GMT+5 and overlaps with both US and UK business hours.',
  },
  {
    q: 'Do you sign NDAs?',
    a: 'Yes, we sign NDAs before any project commences. Client confidentiality is fundamental to our practice. All financial data and business information shared with us remains strictly confidential.',
  },
  {
    q: 'What industries do you serve internationally?',
    a: 'Technology and SaaS, e-commerce, real estate, healthcare, manufacturing, professional services, and consumer goods. Our team has built models and valuations for clients across these industries in the USA, UK, UAE, Australia, and Canada.',
  },
];

export default function InternationalServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="min-h-screen bg-white">

        {/* ════════════════════════════════════════════════════════════════
            HERO
            Design: dark, authoritative, premium — contrasts sharply with
            the Pakistani-market blue pages. This page speaks to CFOs and
            founders in New York, London, Sydney. Tone = global firm.
        ════════════════════════════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden py-20 sm:py-28 px-4 sm:px-6 lg:px-12"
          style={{ background: 'linear-gradient(135deg, #050F2E 0%, #0A1940 50%, #050F2E 100%)' }}
        >
          {/* Subtle grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          {/* Glow accents */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
               style={{ background: 'radial-gradient(circle, #0040A8, transparent)', transform: 'translate(30%, -30%)' }} />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-8"
               style={{ background: 'radial-gradient(circle, #3B82F6, transparent)', transform: 'translate(-30%, 30%)' }} />

          <div className="relative max-w-6xl mx-auto">

            {/* Country badges */}
            <div className="flex flex-wrap gap-2 mb-8">
              {CLIENTS.map((c) => (
                <span
                  key={c}
                  className="text-xs font-bold px-3 py-1 rounded-full border"
                  style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', backgroundColor: 'rgba(255,255,255,0.06)' }}
                >
                  {c}
                </span>
              ))}
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ backgroundColor: '#0040A8', color: '#fff' }}
              >
                + 15 more countries
              </span>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                {/* Eyebrow */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-px bg-blue-400" />
                  <span className="text-xs font-semibold tracking-widest uppercase text-blue-300">
                    International Financial Services
                  </span>
                </div>

                {/* H1 — primary keyword for international SEO */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                  Outsourced Financial Modeling &amp; CFO Services
                  <span className="block mt-2 text-blue-400">
                    for Startups &amp; SMEs
                  </span>
                </h1>

                <p className="text-base sm:text-lg leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.72)' }}>
                  CPA-qualified financial analysts building investor-grade models,
                  pitch decks, and strategic financial plans for companies in the USA,
                  UK, Australia, and Canada — at 60% less than local firm rates.
                </p>

                <div className="flex flex-wrap gap-3 mb-10">
                  {['Financial Modeling', 'Pitch Decks', 'Fractional CFO', 'Business Valuation', 'FP&A'].map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1.5 rounded-full font-medium"
                      style={{ backgroundColor: 'rgba(0,64,168,0.3)', color: '#93C5FD', border: '1px solid rgba(0,64,168,0.5)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={SITE_CONFIG.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90"
                    style={{ backgroundColor: '#0040A8' }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.63"/>
                    </svg>
                    WhatsApp a Project Brief
                  </a>
                  <a
                    href={`mailto:${SITE_CONFIG.email}?subject=Financial Services Inquiry`}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all hover:bg-white/10"
                    style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.85)' }}
                  >
                    Email Us
                  </a>
                </div>
              </div>

              {/* Stats panel */}
              <div>
                <div
                  className="rounded-2xl p-7 grid grid-cols-2 gap-5"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  {STATS.map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl p-5 text-center"
                      style={{ background: 'rgba(0,64,168,0.15)', border: '1px solid rgba(0,64,168,0.3)' }}
                    >
                      <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{s.label}</div>
                    </div>
                  ))}

                  {/* Divider */}
                  <div className="col-span-2 pt-4 mt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      Team credentials: ACCA · CPA · CA · MBA Finance · Big 4 experience
                    </p>
                  </div>
                </div>

                {/* Trust strip */}
                <div className="mt-5 flex flex-wrap gap-3 justify-center">
                  {['NDA Protected', 'GAAP / IFRS Standards', 'All time zones', 'USD Pricing'].map((t) => (
                    <span
                      key={t}
                      className="text-xs px-3 py-1 rounded-full"
                      style={{ color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.12)' }}
                    >
                      ✓ {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            WHY OUTSOURCE TO US — the cost/quality argument
        ════════════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-12" style={{ backgroundColor: '#F8FAFF' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: '#050F2E' }}>
                Why International Companies Outsource Financial Work to Us
              </h2>
              <p className="text-base max-w-2xl mx-auto" style={{ color: '#6B7280' }}>
                The same expertise as a US or UK boutique firm — at a fraction of the cost.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: '💵', title: '60% Cost Saving', desc: 'A US boutique charges $250–$500/hr for financial modeling. We deliver the same quality at $40–$80/hr equivalent — same output, dramatically lower overhead.' },
                { icon: '🎓', title: 'CPA & ACCA Qualified', desc: 'Our analysts hold international qualifications — ACCA, CPA (in progress), CA — and have worked with clients from Fortune 500 companies to Series B startups.' },
                { icon: '⏱', title: '48-Hour Turnaround', desc: 'Pakistan\'s GMT+5 timezone allows us to work while your team sleeps. Faster iteration cycles than working with a local firm in the same timezone.' },
                { icon: '🔒', title: 'NDA on Every Project', desc: 'Full confidentiality agreement signed before any project begins. Your financials, projections, and business strategy stay strictly confidential.' },
                { icon: '📐', title: 'Investment Bank Standards', desc: 'We follow FAST modeling standards used by Goldman Sachs, McKinsey, and top PE firms. Every model is auditable, transparent, and assumption-driven.' },
                { icon: '🌍', title: 'Proven Track Record', desc: 'Over 500 financial models, pitch decks, and CFO engagements delivered for clients in the USA, UK, UAE, Australia, and Canada.' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-xl p-6 border-l-4 shadow-sm hover:shadow-md transition-shadow"
                  style={{ borderLeftColor: '#0040A8' }}
                >
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-base mb-2" style={{ color: '#050F2E' }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            SERVICES — each with its own section ID for anchor linking
            and Google's on-page crawling
        ════════════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-12 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: '#050F2E' }}>
                Our International Financial Services
              </h2>
              <p className="text-base max-w-xl mx-auto" style={{ color: '#6B7280' }}>
                Six core services used by startups and SMEs in the USA, UK, Australia, and Canada.
              </p>
            </div>

            <div className="space-y-6">
              {SERVICES.map((svc, i) => (
                <div
                  key={svc.id}
                  id={svc.id}
                  className="rounded-2xl overflow-hidden border"
                  style={{ borderColor: '#E5E7EB' }}
                >
                  <div className="grid lg:grid-cols-3">

                    {/* Left — title + price */}
                    <div
                      className="p-8 flex flex-col justify-between"
                      style={{ backgroundColor: i % 2 === 0 ? '#050F2E' : '#0040A8' }}
                    >
                      <div>
                        <div className="text-3xl mb-4">{svc.icon}</div>
                        <h2 className="text-xl font-bold text-white mb-2">{svc.title}</h2>
                        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{svc.tagline}</p>
                      </div>
                      <div className="mt-8">
                        <div className="text-2xl font-bold text-white">{svc.price}</div>
                        <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>⏱ {svc.timeline}</div>
                        <a
                          href={`mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent(svc.title + ' Inquiry')}`}
                          className="inline-block mt-5 px-5 py-2.5 rounded-lg text-sm font-semibold bg-white hover:bg-blue-50 transition-colors"
                          style={{ color: i % 2 === 0 ? '#050F2E' : '#0040A8' }}
                        >
                          Get a Quote →
                        </a>
                      </div>
                    </div>

                    {/* Right — description + deliverables */}
                    <div className="lg:col-span-2 p-8 bg-white">
                      <p className="text-sm leading-relaxed mb-6" style={{ color: '#374151' }}>
                        {svc.description}
                      </p>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#0040A8' }}>
                            Deliverables
                          </h3>
                          <ul className="space-y-2">
                            {svc.deliverables.map((d) => (
                              <li key={d} className="flex items-start gap-2 text-sm" style={{ color: '#374151' }}>
                                <span className="text-green-500 font-bold flex-shrink-0 mt-0.5">✓</span>
                                {d}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#0040A8' }}>
                            Best For
                          </h3>
                          <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{svc.bestFor}</p>

                          <div
                            className="mt-5 p-3 rounded-lg"
                            style={{ backgroundColor: '#F0F6FF' }}
                          >
                            <p className="text-xs font-semibold mb-1" style={{ color: '#0040A8' }}>Start this project</p>
                            <a
                              href={SITE_CONFIG.whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs underline"
                              style={{ color: '#374151' }}
                            >
                              Send your brief on WhatsApp →
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            PROCESS — how it works
        ════════════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-12" style={{ backgroundColor: '#F8FAFF' }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: '#050F2E' }}>
                How We Work With International Clients
              </h2>
              <p className="text-base" style={{ color: '#6B7280' }}>
                A simple, async-friendly process built for remote collaboration.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { n: '01', title: 'Share Your Brief', desc: 'Email or WhatsApp us a description of your project, company stage, and what you need the model or deck for.' },
                { n: '02', title: 'Scoping & Quote', desc: 'We respond within 4 hours with a scope, timeline, and fixed USD price. No hidden fees.' },
                { n: '03', title: 'Sign NDA & Kick Off', desc: 'We send an NDA, you sign, and we kick off. You share access to financial data via Google Drive or Dropbox.' },
                { n: '04', title: 'Deliver & Revise', desc: 'First draft delivered to timeline. We include 2 rounds of revisions in every project. Final file delivered unlocked.' },
              ].map((step) => (
                <div key={step.n} className="bg-white rounded-xl p-6 border" style={{ borderColor: '#E5E7EB' }}>
                  <div
                    className="text-3xl font-bold mb-4"
                    style={{ color: '#E5E7EB', fontVariantNumeric: 'tabular-nums' }}
                  >
                    {step.n}
                  </div>
                  <h3 className="font-semibold text-sm mb-2" style={{ color: '#050F2E' }}>{step.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            FAQ — FAQPage schema not added here (separate script tag would
            be needed) but content targets long-tail informational queries
        ════════════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-12 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: '#050F2E' }}>
                Frequently Asked Questions
              </h2>
              <p className="text-base" style={{ color: '#6B7280' }}>
                Common questions from clients in the USA, UK, and Australia.
              </p>
            </div>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <details
                  key={i}
                  className="group rounded-xl border p-5 cursor-pointer"
                  style={{ borderColor: '#E5E7EB' }}
                >
                  <summary
                    className="font-semibold text-sm list-none flex justify-between items-center"
                    style={{ color: '#050F2E' }}
                  >
                    {faq.q}
                    <span className="ml-4 text-lg font-light group-open:rotate-45 transition-transform inline-block flex-shrink-0"
                          style={{ color: '#0040A8' }}>+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            BOTTOM CTA
        ════════════════════════════════════════════════════════════════ */}
        <section
          className="py-16 sm:py-20 px-4 sm:px-6 lg:px-12"
          style={{ background: 'linear-gradient(135deg, #050F2E 0%, #0040A8 100%)' }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.72)' }}>
              Send us a brief and get a scoped quote within 4 business hours.
              NDA included. Fixed USD pricing. No surprises.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`mailto:${SITE_CONFIG.email}?subject=International Financial Services Inquiry`}
                className="inline-flex items-center justify-center gap-2 bg-white font-semibold px-7 py-3.5 rounded-xl text-sm hover:opacity-90 transition-opacity"
                style={{ color: '#050F2E' }}
              >
                Email Your Brief
              </a>
              <a
                href={SITE_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 font-semibold px-7 py-3.5 rounded-xl text-sm text-white hover:bg-white/10 transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.3)' }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.63"/>
                </svg>
                WhatsApp Us
              </a>
            </div>
            <p className="mt-6 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Also serving Pakistan's local market →{' '}
              <Link href="/" className="underline hover:text-white transition-colors">
                akbartaxstore.com
              </Link>
            </p>
          </div>
        </section>

      </div>
    </>
  );
}