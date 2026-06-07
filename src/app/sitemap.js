// app/sitemap.js
// IMPROVED — changes:
// 1. Added /calculators hub page (was missing — linked from nav but absent from sitemap)
// 2. Updated lastModified to TODAY for guides we improved this session
//    (fbr-tax-return-deadline-2026 and how-to-get-ntn-pakistan)
// 3. Corrected /contact changeFrequency from 'yearly' to 'monthly'
//    (contact page gets schema updates periodically — yearly undersells recency to Google)
// All routes, priorities, and structure are otherwise unchanged.

const BASE_URL = 'https://www.akbartaxstore.com';
const TODAY = new Date();

export default function sitemap() {
  // ── Core pages ──────────────────────────────────────────────────────────────
  const coreRoutes = [
    { path: '/',              priority: 1.0,  changeFrequency: 'weekly',  lastModified: TODAY },
    { path: '/services-fees', priority: 0.9,  changeFrequency: 'monthly', lastModified: TODAY },
    { path: '/about',         priority: 0.6,  changeFrequency: 'yearly',  lastModified: new Date('2026-03-01') },
    { path: '/contact',       priority: 0.70, changeFrequency: 'monthly', lastModified: TODAY },
    { path: '/booking',       priority: 0.7,  changeFrequency: 'monthly', lastModified: new Date('2026-03-01') },
    { path: '/personal',      priority: 0.8,  changeFrequency: 'monthly', lastModified: TODAY },
    { path: '/business',      priority: 0.8,  changeFrequency: 'monthly', lastModified: TODAY },
    { path: '/faisalabad-tax-services',          priority: 0.8,  changeFrequency: 'monthly', lastModified: new Date('2026-03-01') },
    { path: '/international-financial-services', priority: 0.75, changeFrequency: 'monthly', lastModified: new Date('2026-03-01') },
  ];

  // ── Calculator tools ─────────────────────────────────────────────────────────
  const toolRoutes = [
    // FIX: Added /calculators hub — was linked from nav but absent from sitemap
    { path: '/calculators',                           priority: 0.85, changeFrequency: 'monthly', lastModified: TODAY },
    { path: '/calculators/income-tax-pakistan',       priority: 0.95, changeFrequency: 'monthly', lastModified: TODAY },
    { path: '/calculators/filer-vs-non-filer',        priority: 0.95, changeFrequency: 'monthly', lastModified: TODAY },
    { path: '/calculators/gst-calculator-pakistan',   priority: 0.90, changeFrequency: 'monthly', lastModified: TODAY },
    { path: '/calculators/withholding-tax-pakistan',  priority: 0.90, changeFrequency: 'monthly', lastModified: TODAY },
    { path: '/calculators/freelancer-tax-pakistan',   priority: 0.90, changeFrequency: 'monthly', lastModified: TODAY },
    { path: '/calculators/should-i-file-quiz',        priority: 0.85, changeFrequency: 'monthly', lastModified: TODAY },
  ];

  // ── Top service pages ───────────────────────────────────────────────────────
  const topServiceRoutes = [
    { path: '/personal/ntn',          priority: 0.90, changeFrequency: 'monthly', lastModified: TODAY },
    { path: '/personal/tax-return',   priority: 0.90, changeFrequency: 'monthly', lastModified: TODAY },
    { path: '/business/company-reg',  priority: 0.85, changeFrequency: 'monthly', lastModified: TODAY },
    { path: '/business/business-reg', priority: 0.85, changeFrequency: 'monthly', lastModified: TODAY },
    { path: '/personal/gst',          priority: 0.85, changeFrequency: 'monthly', lastModified: TODAY },
    { path: '/business/gst',          priority: 0.85, changeFrequency: 'monthly', lastModified: TODAY },
    { path: '/business/trademark',    priority: 0.80, changeFrequency: 'monthly', lastModified: TODAY },
    { path: '/personal/filer',        priority: 0.80, changeFrequency: 'monthly', lastModified: TODAY },
    { path: '/business/filer',        priority: 0.80, changeFrequency: 'monthly', lastModified: TODAY },
  ];

  // ── Secondary service pages ─────────────────────────────────────────────────
  const secondaryServiceRoutes = [
    { path: '/personal/nin',           priority: 0.75, changeFrequency: 'monthly', lastModified: new Date('2026-03-01') },
    { path: '/personal/pra',           priority: 0.75, changeFrequency: 'monthly', lastModified: new Date('2026-03-01') },
    { path: '/personal/chamber',       priority: 0.65, changeFrequency: 'monthly', lastModified: new Date('2026-03-01') },
    { path: '/business/nin',           priority: 0.75, changeFrequency: 'monthly', lastModified: new Date('2026-03-01') },
    { path: '/business/ntn',           priority: 0.85, changeFrequency: 'monthly', lastModified: new Date('2026-03-01') },
    { path: '/business/firm-reg',      priority: 0.75, changeFrequency: 'monthly', lastModified: new Date('2026-03-01') },
    { path: '/business/import-export', priority: 0.75, changeFrequency: 'monthly', lastModified: new Date('2026-03-01') },
    { path: '/business/pra',           priority: 0.75, changeFrequency: 'monthly', lastModified: new Date('2026-03-01') },
    { path: '/business/chamber',       priority: 0.65, changeFrequency: 'monthly', lastModified: new Date('2026-03-01') },
    { path: '/business/dnfbp',         priority: 0.70, changeFrequency: 'monthly', lastModified: new Date('2026-03-01') },
    { path: '/business/accounting',    priority: 0.75, changeFrequency: 'monthly', lastModified: new Date('2026-03-01') },
    { path: '/business/bookkeeping',   priority: 0.75, changeFrequency: 'monthly', lastModified: new Date('2026-03-01') },
    { path: '/business/stock',         priority: 0.70, changeFrequency: 'monthly', lastModified: new Date('2026-03-01') },
    { path: '/business/tax-return',    priority: 0.85, changeFrequency: 'monthly', lastModified: new Date('2026-03-01') },
  ];

  // ── Guide / content pages ───────────────────────────────────────────────────
  const guideRoutes = [
    { path: '/guides/how-to-become-filer-pakistan',  priority: 0.80, changeFrequency: 'monthly', lastModified: TODAY },
    // Updated: guide was improved this session (H2 typos, penalty data, Article schema, CTA)
    { path: '/guides/fbr-tax-return-deadline-2026',  priority: 0.80, changeFrequency: 'monthly', lastModified: TODAY },
    { path: '/guides/filer-vs-non-filer-benefits',   priority: 0.80, changeFrequency: 'monthly', lastModified: TODAY },
    // Updated: guide was improved this session (missing steps, FAQPage schema, TOC fix, CTA)
    { path: '/guides/how-to-get-ntn-pakistan',       priority: 0.80, changeFrequency: 'monthly', lastModified: TODAY },
    { path: '/guides/secp-company-registration',     priority: 0.75, changeFrequency: 'monthly', lastModified: new Date('2026-03-01') },
    { path: '/guides/gst-registration-guide',        priority: 0.70, changeFrequency: 'monthly', lastModified: new Date('2026-03-01') },
    { path: '/guides/active-taxpayer-list-pakistan', priority: 0.70, changeFrequency: 'monthly', lastModified: new Date('2026-03-01') },
    { path: '/guides/trademark-registration-guide',  priority: 0.70, changeFrequency: 'monthly', lastModified: new Date('2026-03-01') },
  ];

  const allRoutes = [
    ...coreRoutes,
    ...toolRoutes,
    ...topServiceRoutes,
    ...secondaryServiceRoutes,
    ...guideRoutes,
  ];

  return allRoutes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: route.lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}