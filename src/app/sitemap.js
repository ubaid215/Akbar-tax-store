// app/sitemap.js

const BASE_URL = 'https://www.akbartaxstore.com';

// Helper — keeps date strings consistent and avoids timezone drift
const d = (dateString) => new Date(dateString);

export default function sitemap() {
  // ── Core pages ──────────────────────────────────────────────────────────────
  const coreRoutes = [
    { path: '/',              priority: 1.0, changeFrequency: 'weekly',  lastModified: d('2026-03-01') },
    { path: '/services-fees', priority: 0.9, changeFrequency: 'weekly',  lastModified: d('2026-03-01') },
    { path: '/personal',      priority: 0.8, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/business',      priority: 0.8, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/about',         priority: 0.5, changeFrequency: 'yearly',  lastModified: d('2026-01-01') },
    { path: '/contact',       priority: 0.6, changeFrequency: 'yearly',  lastModified: d('2026-01-01') },
    { path: '/book-meeting',  priority: 0.7, changeFrequency: 'monthly', lastModified: d('2026-01-01') },
  ];

  // ── SEO landing pages (keyword-rich, dedicated pages) ───────────────────────
  const servicePageRoutes = [
    { path: '/services/ntn-registration',      priority: 0.9, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/services/tax-filing',            priority: 0.9, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/services/company-registration',  priority: 0.9, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/services/business-registration', priority: 0.9, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/services/trademark-registration',priority: 0.8, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/services/gst-registration',      priority: 0.8, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/services/pra-registration',      priority: 0.7, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/services/accounting-services',   priority: 0.8, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/services/filer-status',          priority: 0.8, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/services/bookkeeping',           priority: 0.7, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/services/import-export-license', priority: 0.7, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/services/secp-registration',     priority: 0.8, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
  ];

  // ── Personal service detail pages ───────────────────────────────────────────
  const personalRoutes = [
    { path: '/personal/nin',        priority: 0.8, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/personal/ntn',        priority: 0.9, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/personal/tax-return', priority: 0.9, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/personal/filer',      priority: 0.8, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/personal/gst',        priority: 0.8, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/personal/pra',        priority: 0.7, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/personal/chamber',    priority: 0.6, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
  ];

  // ── Business service detail pages ───────────────────────────────────────────
  const businessRoutes = [
    { path: '/business/nin',          priority: 0.8, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/business/ntn',          priority: 0.9, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/business/tax-return',   priority: 0.9, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/business/filer',        priority: 0.8, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/business/business-reg', priority: 0.9, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/business/company-reg',  priority: 0.9, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/business/firm-reg',     priority: 0.8, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/business/trademark',    priority: 0.8, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/business/import-export',priority: 0.7, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/business/gst',          priority: 0.8, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/business/pra',          priority: 0.7, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/business/chamber',      priority: 0.6, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/business/dnfbp',        priority: 0.7, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/business/accounting',   priority: 0.8, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/business/bookkeeping',  priority: 0.8, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/business/stock',        priority: 0.7, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
  ];

  // ── Local SEO landing page (Faisalabad only — the real office location) ─────
  const locationRoutes = [
    { path: '/faisalabad-tax-services', priority: 0.8, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
  ];

  // ── Content / guide pages (informational keyword targeting) ─────────────────
  const guideRoutes = [
    { path: '/guides/how-to-get-ntn-pakistan',       priority: 0.8, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/guides/how-to-become-filer-pakistan',  priority: 0.8, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/guides/fbr-tax-return-deadline-2026',  priority: 0.9, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/guides/filer-vs-non-filer-benefits',   priority: 0.7, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/guides/secp-company-registration',     priority: 0.8, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/guides/gst-registration-guide',        priority: 0.7, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/guides/active-taxpayer-list-pakistan', priority: 0.7, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
    { path: '/guides/trademark-registration-guide',  priority: 0.7, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
  ];

  // ── Tools ────────────────────────────────────────────────────────────────────
  const toolRoutes = [
    { path: '/calculator/tax-calculator', priority: 0.8, changeFrequency: 'monthly', lastModified: d('2026-03-01') },
  ];

  const allRoutes = [
    ...coreRoutes,
    ...servicePageRoutes,
    ...personalRoutes,
    ...businessRoutes,
    ...locationRoutes,
    ...guideRoutes,
    ...toolRoutes,
  ];

  return allRoutes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: route.lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}