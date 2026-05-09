'use client';

// src/app/components/schemas/BreadcrumbSchema.tsx
// Auto-generates BreadcrumbList JSON-LD and a visible nav trail from the current pathname.

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const BASE_URL = 'https://www.akbartaxstore.com';

const PATH_LABELS: Record<string, string> = {
  'services-fees': 'Services & Fees',
  about: 'About',
  contact: 'Contact',
  booking: 'Book Meeting',
  personal: 'Personal Services',
  business: 'Business Services',
  guides: 'Free Guides',
  calculators: 'Tax Calculators',
  'international-financial-services': 'Global Services',
  'privacy-policy': 'Privacy Policy',
  'faisalabad-tax-services': 'Faisalabad Tax Services',
  // personal / business service IDs
  nin: 'NIN Registration',
  ntn: 'NTN Certificate',
  'tax-return': 'Tax Return Filing',
  filer: 'Active Filer Registration',
  gst: 'GST Registration',
  pra: 'PRA Registration',
  chamber: 'Chamber of Commerce',
  'business-reg': 'Business Registration',
  'company-reg': 'SECP Company Registration',
  'firm-reg': 'Firm Registration',
  trademark: 'Trademark Registration',
  'import-export': 'Import/Export License',
  dnfbp: 'DNFBP Registration',
  accounting: 'Accounting Services',
  bookkeeping: 'Bookkeeping Services',
  stock: 'Stock Report',
  // calculators
  'income-tax-pakistan': 'Income Tax Calculator',
  'filer-vs-non-filer': 'Filer vs Non-Filer',
  'gst-calculator-pakistan': 'GST Calculator',
  'withholding-tax-pakistan': 'Withholding Tax Calculator',
  'freelancer-tax-pakistan': 'Freelancer Tax Calculator',
  'should-i-file-quiz': 'Should I File Quiz',
  // guides
  'how-to-get-ntn-pakistan': 'How to Get NTN in Pakistan',
  'how-to-become-filer-pakistan': 'How to Become a Filer',
  'fbr-tax-return-deadline-2026': 'FBR Tax Return Deadline 2026',
  'filer-vs-non-filer-benefits': 'Filer vs Non-Filer Benefits',
  'secp-company-registration': 'SECP Company Registration Guide',
  'gst-registration-guide': 'GST Registration Guide',
  'active-taxpayer-list-pakistan': 'Active Taxpayer List Pakistan',
  'trademark-registration-guide': 'Trademark Registration Guide',
};

const toLabel = (segment: string): string =>
  PATH_LABELS[segment] ??
  segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export default function BreadcrumbSchema() {
  const pathname = usePathname();

  if (!pathname || pathname === '/') return null;

  const segments = pathname.split('/').filter(Boolean);

  const crumbs = [
    { name: 'Home', url: BASE_URL, path: '/' },
    ...segments.map((seg, i) => ({
      name: toLabel(seg),
      url: `${BASE_URL}/${segments.slice(0, i + 1).join('/')}`,
      path: `/${segments.slice(0, i + 1).join('/')}`,
    })),
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };

  return (
    <>
      {/* JSON-LD for Google rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Visible breadcrumb nav — renders above H1 on every non-homepage page */}
      <nav
        aria-label="Breadcrumb"
        className="px-4 sm:px-6 lg:px-8 py-3 text-sm"
        style={{ backgroundColor: '#F8FAFF', borderBottom: '1px solid #D9E8FF' }}
      >
        <ol className="max-w-7xl mx-auto flex flex-wrap items-center gap-1">
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <li key={crumb.url} className="flex items-center gap-1">
                {i > 0 && (
                  <span style={{ color: '#9CA3AF' }} aria-hidden="true">
                    /
                  </span>
                )}
                {isLast ? (
                  <span style={{ color: '#0040A8' }} aria-current="page">
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={crumb.path}
                    style={{ color: '#6B7280' }}
                    className="hover:text-[#0040A8] transition-colors"
                  >
                    {crumb.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
