// src/app/(public)/personal/page.jsx

import Link from 'next/link';
import Image from 'next/image';
import { PERSONAL_SERVICES, SITE_CONFIG } from '@/constants';

// ── Page metadata ─────────────────────────────────────────────────────────────
export const metadata = {
  title: 'Personal Tax Services Pakistan — NIN, NTN & Tax Return Filing',
  description:
    'Professional personal tax services in Pakistan. NIN registration, NTN certificate, income tax return filing, GST and PRA registration. Fast 24-hour service. Akbar Tax Store, Faisalabad.',
  alternates: {
    canonical: 'https://www.akbartaxstore.com/personal',
  },
  openGraph: {
    title: 'Personal Tax Services Pakistan — NIN, NTN & Tax Return Filing | Akbar Tax Store',
    description:
      'NIN registration PKR 3,000. NTN certificate PKR 4,000. Tax return filing PKR 5,000. Expert personal tax services across Pakistan — results in 24 hours.',
    url: 'https://www.akbartaxstore.com/personal',
  },
};

// ── ItemList schema ───────────────────────────────────────────────────────────
const serviceListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Personal Tax Services Pakistan — Akbar Tax Store',
  url: 'https://www.akbartaxstore.com/personal',
  itemListElement: PERSONAL_SERVICES.map((s, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Service',
      name: s.title,
      description: s.description,
      url: `https://www.akbartaxstore.com${s.href}`,
      provider: { '@type': 'LocalBusiness', name: 'Akbar Tax Store' },
      offers: {
        '@type': 'Offer',
        price: s.price,
        priceCurrency: 'PKR',
        availability: 'https://schema.org/InStock',
      },
    },
  })),
};

export default function PersonalServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceListSchema) }}
      />

      <div className="min-h-screen bg-[#D9E8FF]">

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="relative bg-gradient-to-br from-[#072971] via-[#0040A8] to-[#072971] text-white py-20">
          <div className="absolute inset-0 bg-[#050505]/10" />
          <div className="container mx-auto px-6 text-center relative z-10">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <span className="text-sm font-medium">Personal Tax Services Pakistan</span>
            </div>
            {/*
              H1 — targets "personal tax services Pakistan".
              Original H1 "Professional Tax Services Made Simple" had zero
              search value — nobody searches for that phrase.
            */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Professional Personal Tax Services in Pakistan
              <span className="block text-[#D9E8FF]">NIN, NTN &amp; Tax Return Filing</span>
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              From NIN registration to becoming an active FBR filer — we handle all your
              personal tax requirements with expertise. Results in 24 hours.
            </p>
          </div>
        </section>

        {/* ── Services grid ─────────────────────────────────────────────── */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              {/* H2 with keyword: "personal tax services" */}
              <h2 className="text-3xl font-bold text-[#072971] mb-4">
                Our Personal Tax Services
              </h2>
              <p className="text-[#050505]/70 max-w-2xl mx-auto">
                Comprehensive personal tax solutions to keep you compliant and
                on the Active Taxpayer List.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PERSONAL_SERVICES.map((service) => (
                <Link
                  key={service.id}
                  href={service.href}
                  className="group block"
                >
                  <div className="bg-white rounded-2xl border border-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#0040A8]/20 hover:-translate-y-2 hover:border-[#0040A8]/30">

                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.alt}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#072971]/50 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-[#0040A8] rounded-full">
                          {service.category}
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <div className="bg-white rounded-lg px-2 py-1 shadow-sm">
                          <span className="text-xs font-medium text-[#072971]">{service.duration}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-bold text-xl text-[#072971] mb-2 group-hover:text-[#0040A8] transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-[#050505] text-sm leading-relaxed mb-4 opacity-80">
                        {service.description}
                      </p>

                      {/* Requirements preview */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-[#072971] mb-2">Key Requirements:</h4>
                        <ul className="text-sm text-[#050505]/70 space-y-1">
                          {service.requirements.slice(0, 2).map((req, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-[#0040A8] mr-2 text-xs mt-0.5">•</span>
                              {req}
                            </li>
                          ))}
                          {service.requirements.length > 2 && (
                            <li className="text-[#0040A8] font-medium text-xs">
                              + {service.requirements.length - 2} more requirements
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-[#D9E8FF]">
                        <div>
                          <span className="text-2xl font-bold text-[#072971]">
                            PKR {service.price.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center text-[#0040A8] font-semibold text-sm group-hover:text-[#072971] transition-colors">
                          View Details
                          <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why Choose Us ─────────────────────────────────────────────── */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#072971] mb-4">
                Why Choose Our Personal Tax Services?
              </h2>
              <p className="text-[#050505]/70">Professional expertise with a personal touch</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  ),
                  title: 'Fast Processing',
                  desc: 'NTN and NIN registration completed within 24 hours of document submission.',
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ),
                  title: 'FBR-Verified Process',
                  desc: 'All submissions made directly through official FBR IRIS portal by our certified team.',
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  ),
                  title: 'Transparent Pricing',
                  desc: 'No hidden fees. You see the full price before we start — nothing added later.',
                },
              ].map((item) => (
                <div key={item.title} className="text-center">
                  <div className="w-16 h-16 bg-[#D9E8FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[#0040A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {item.icon}
                    </svg>
                  </div>
                  <h3 className="font-semibold text-[#072971] mb-2">{item.title}</h3>
                  <p className="text-[#050505]/70 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3-step process ────────────────────────────────────────────── */}
        <section className="py-16 bg-[#D9E8FF]">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-[#072971] mb-4">Simple 3-Step Process</h2>
            <p className="text-[#050505]/70 mb-12">Get your tax matters sorted in 3 easy steps</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { n: '1', title: 'Submit Documents', desc: 'Send required documents via WhatsApp or email — no office visit needed.' },
                { n: '2', title: 'Expert Processing', desc: 'Our certified team handles all FBR IRIS portal submissions and paperwork.' },
                { n: '3', title: 'Receive Confirmation', desc: 'Get your certificate, NTN, or filing confirmation delivered digitally.' },
              ].map((step) => (
                <div key={step.n} className="text-center">
                  <div className="w-12 h-12 bg-[#0040A8] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                    {step.n}
                  </div>
                  <h3 className="font-semibold text-[#072971] mb-2">{step.title}</h3>
                  <p className="text-[#050505]/70 text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <section className="py-16 bg-gradient-to-r from-[#072971] to-[#0040A8]">
          <div className="container mx-auto px-6 text-center max-w-3xl">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Your Tax Matters Sorted?
            </h2>
            <p className="text-[#D9E8FF] mb-8 text-lg">
              Our tax experts are ready to help you choose the right service and
              guide you through every step of the process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Internal route — Link */}
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-white text-[#072971] font-semibold py-3 px-8 rounded-xl hover:bg-[#D9E8FF] transition-colors"
              >
                Get Free Consultation
              </Link>
              {/* External tel: — <a> */}
              <a
                href={SITE_CONFIG.phoneTel}
                className="inline-flex items-center justify-center border-2 border-white text-white font-semibold py-3 px-8 rounded-xl hover:bg-white hover:text-[#072971] transition-colors"
              >
                Call Now
              </a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}