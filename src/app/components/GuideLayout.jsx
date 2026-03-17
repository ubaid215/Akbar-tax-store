// src/components/GuideLayout.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Pure Server Component — no 'use client', no styled-jsx.
//
// FIX: styled-jsx (<style jsx global>) was removed because it is a client-only
// API. The prose styles now live in src/styles/guide-prose.css and are
// imported here as a plain CSS module — Next.js handles it at build time with
// no browser JS required.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link';
import { SITE_CONFIG } from '@/constants';

// Plain CSS import — no styled-jsx, works fine in Server Components
import '@/styles/guide-prose.css';

// ── Sub-components ────────────────────────────────────────────────────────────

function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm" style={{ color: '#6B7280' }}>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden="true">›</span>}
            {item.href ? (
              <Link href={item.href} className="hover:underline" style={{ color: '#0040A8' }}>
                {item.label}
              </Link>
            ) : (
              <span style={{ color: '#374151' }}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function TableOfContents({ items }) {
  return (
    <nav
      aria-label="Table of contents"
      className="rounded-xl p-5 sticky top-24"
      style={{ backgroundColor: '#F0F6FF', border: '1px solid #D9E8FF' }}
    >
      <p
        className="font-semibold mb-3 uppercase tracking-wide"
        style={{ color: '#0040A8', fontSize: '11px' }}
      >
        In This Guide
      </p>
      <ol className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-sm hover:underline block leading-snug"
              style={{ color: '#374151' }}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function CTASidebar() {
  return (
    <div
      className="rounded-xl p-5 mt-6 sticky top-72"
      style={{ backgroundColor: '#0040A8' }}
    >
      <p className="font-bold text-white mb-1 text-base">Need help filing?</p>
      <p className="text-sm mb-4" style={{ color: '#BAD4FF' }}>
        Akbar Tax Store handles everything for you — in 24 hours.
      </p>
      <Link
        href="/contact"
        className="block w-full text-center bg-white font-semibold py-2.5 rounded-lg text-sm hover:bg-blue-50 transition-colors"
        style={{ color: '#0040A8' }}
      >
        Get Free Consultation
      </Link>
      <a
        href={SITE_CONFIG.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center border border-white text-white font-semibold py-2.5 rounded-lg text-sm mt-2 hover:bg-blue-800 transition-colors"
      >
        WhatsApp Us
      </a>
    </div>
  );
}

function ArticleMeta({ meta }) {
  return (
    <div
      className="flex flex-wrap items-center gap-3 mb-6 pb-6"
      style={{ borderBottom: '1px solid #E5E7EB' }}
    >
      <span
        className="text-xs font-semibold px-2.5 py-1 rounded-full"
        style={{ backgroundColor: '#D9E8FF', color: '#0040A8' }}
      >
        {meta.category}
      </span>
      <span className="text-sm" style={{ color: '#6B7280' }}>
        Updated: {meta.updatedDate}
      </span>
      <span className="text-sm" style={{ color: '#6B7280' }}>
        {meta.readTime} min read
      </span>
    </div>
  );
}

function BottomCTA() {
  return (
    <section
      className="mt-12 rounded-2xl p-8 text-center"
      style={{ background: 'linear-gradient(135deg, #0040A8 0%, #072971 100%)' }}
    >
      <h2 className="text-2xl font-bold text-white mb-3">Ready to Get Started?</h2>
      <p className="mb-6 text-base" style={{ color: '#BAD4FF' }}>
        Akbar Tax Store handles everything — NTN registration, tax return filing,
        and business registration — in as little as 24 hours.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/services-fees"
          className="bg-white font-semibold px-6 py-3 rounded-lg text-sm hover:opacity-90 transition-colors"
          style={{ color: '#0040A8' }}
        >
          View Services &amp; Fees
        </Link>
        <a
          href={SITE_CONFIG.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="border-2 border-white text-white font-semibold px-6 py-3 rounded-lg text-sm hover:bg-white hover:text-[#0040A8] transition-colors"
        >
          WhatsApp Us Now
        </a>
      </div>
    </section>
  );
}

// ── Main layout ───────────────────────────────────────────────────────────────
export default function GuideLayout({ meta, toc, children }) {
  const breadcrumb = [
    { label: 'Home',   href: '/' },
    { label: 'Guides', href: '/guides' },
    { label: meta.title },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFB' }}>

      {/* ── Hero banner ─────────────────────────────────────────────────────── */}
      <div
        className="px-4 py-10 sm:py-14"
        style={{ background: 'linear-gradient(135deg, #D9E8FF 0%, #EEF4FF 100%)' }}
      >
        <div className="max-w-5xl mx-auto">
          <Breadcrumb items={breadcrumb} />

          <div
            className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: '#0040A8', color: '#fff' }}
          >
            {meta.category}
          </div>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4"
            style={{ color: '#050505' }}
          >
            {meta.h1}
          </h1>

          <p className="text-lg max-w-2xl leading-relaxed" style={{ color: '#374151' }}>
            {meta.intro}
          </p>

          <div className="flex flex-wrap gap-3 mt-5">
            {[
              `✓ Updated ${meta.updatedDate}`,
              '✓ Verified against FBR official sources',
              `✓ ${meta.readTime} min read`,
            ].map((badge) => (
              <span
                key={badge}
                className="text-xs px-3 py-1 rounded-full"
                style={{ backgroundColor: '#fff', color: '#0040A8', border: '1px solid #D9E8FF' }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body — 2-col desktop / single-col mobile ────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex gap-10 items-start">

          {/* Article */}
          <article className="flex-1 min-w-0">
            <ArticleMeta meta={meta} />
            <div className="guide-prose">
              {children}
            </div>
            <BottomCTA />
          </article>

          {/* Sidebar — hidden on mobile, sticky on desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <TableOfContents items={toc} />
            <CTASidebar />
          </aside>

        </div>

        {/* Mobile-only CTA strip (sidebar is hidden on mobile) */}
        <div
          className="lg:hidden mt-8 p-5 rounded-xl flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
          style={{ backgroundColor: '#0040A8' }}
        >
          <div>
            <p className="font-bold text-white text-sm">Need professional help?</p>
            <p className="text-xs" style={{ color: '#BAD4FF' }}>
              24-hour service across Pakistan
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Link
              href="/contact"
              className="bg-white text-xs font-semibold px-4 py-2 rounded-lg hover:opacity-90"
              style={{ color: '#0040A8' }}
            >
              Contact Us
            </Link>
            <a
              href={SITE_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-blue-800"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}