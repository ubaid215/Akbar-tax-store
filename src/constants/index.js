// src/constants/index.js
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for Akbar Tax Store.
// Every URL, label, phone number, and social link lives here.
// Navbar, Footer, and all pages import from this file — change once, updates
// everywhere automatically.
// ─────────────────────────────────────────────────────────────────────────────

// ── Site-wide config ──────────────────────────────────────────────────────────
export const SITE_CONFIG = {
  name: 'Akbar Tax Store',
  tagline: 'Accounting That Actually Helps You Grow.',
  description:
    'Expert FBR tax filing, NTN registration, and SECP company registration in Faisalabad, Pakistan. Become an active filer in 24 hours.',
  baseUrl: 'https://www.akbartaxstore.com',

  // ── Canonical contact details ─────────────────────────────────────────────
  // These must match your Google Business Profile exactly.
  // The Navbar had two phone numbers — both are kept here so dropdowns can
  // show both, but only `phone` (0340) is used in schema / GBP / footer CTA.
  phone:          '+92-340-7300408',   // canonical — schema + GBP
  phoneDisplay:   '0340-7300408',
  phoneTel:       'tel:+923407300408',
  phoneAlt:       '+92-340-7300408',   // secondary — shown in navbar dropdown only
  phoneAltDisplay:'0340-7300408',
  phoneAltTel:    'tel:+923407300408',
  whatsappUrl:    'https://wa.me/923407300804',
  whatsappGroup:  'https://wa.me/message/QJQEJZWC36JKN1', // navbar quick-link
  email:          'info@akbartaxstore.com',

  // ── Address ───────────────────────────────────────────────────────────────
  address: {
    street:     'P 82/3 Al-Fayyaz Colony, Street No 4, Satiana Road',
    city:       'Faisalabad',
    region:     'Punjab',
    country:    'Pakistan',
    postalCode: '38000',
    full:       'P 82/3 ALFAYYAZ Colony, Street No 4 Satiana Road, Faisalabad, Pakistan',
  },

  // ── Social media ──────────────────────────────────────────────────────────
  // Fill in the URL strings once profiles are live.
  social: {
    whatsapp:  'https://wa.me/message/QJQEJZWC36JKN1',
    instagram: 'https://www.instagram.com/_akbar_tax_store?utm_source=qr&igsh=MWw4ajI5dDNuYncwMA==',
    facebook:  '',   // 'https://www.facebook.com/akbartaxstore'
    linkedin:  '',   // 'https://www.linkedin.com/company/akbar-tax-store'
    youtube:   '',   // 'https://www.youtube.com/@akbartaxstore'
  },

  // Developer credit shown in footer
  developer: 'Muhammad Ubaidullah',
};

// ── Main navigation bar links (desktop + mobile) ──────────────────────────────
// Used in the primary horizontal nav. Labels are ALL-CAPS to match the
// original Navbar design; adjust here if you want sentence case.
export const NAV_LINKS = [
  { label: 'HOME',           href: '/' },
  { label: 'SERVICES FEE',   href: '/services-fees' },
  { label: 'CALCULATORS',    href: '/calculators' },
  // { label: 'GLOBAL SERVICES',href: '/international-financial-services' },
  { label: 'ABOUT',          href: '/about' },
  { label: 'CONTACT',        href: '/contact' },
  { label: 'BOOK MEETING',   href: '/booking', cta: true },
];

// ── Navbar top-bar: Contact dropdown ─────────────────────────────────────────
// Rendered in the blue utility strip at the top of the navbar on desktop.
// Mix of <a href="tel:"> and <a href="mailto:"> — not Next.js routes.
export const NAV_CONTACT_DROPDOWN = [
  { label: '📞 0340-7300408',                  href: 'tel:+923407300408',              external: true },
  { label: '✉️ Email Us',                      href: 'mailto:info@akbartaxstore.com', external: true },
];

// ── Navbar top-bar: Personal dropdown ────────────────────────────────────────
// Internal Next.js routes — use <Link> in the component.
export const NAV_PERSONAL_DROPDOWN = [
  { label: '📋 Tax Return',     href: '/personal/tax-return' },
  { label: '🆔 NIN Registration', href: '/personal/nin' },
  { label: '📜 NTN Certificate',  href: '/personal/ntn' },
  { label: '✏️ Filer',            href: '/personal/filer' },
  { label: '🧾 GST Registration', href: '/personal/gst' },
  { label: '🏦 PRA Registration', href: '/personal/pra' },
];

// ── Navbar top-bar: Business dropdown ────────────────────────────────────────
export const NAV_BUSINESS_DROPDOWN = [
  { label: '📊 Business Registration',  href: '/business/business-reg' },
  { label: '🏢 Company Registration',   href: '/business/company-reg' },
  { label: '💼 Firm Registration',      href: '/business/firm-reg' },
  { label: '™️ Trademark Registration',  href: '/business/trademark' },
  { label: '💰 DNFBP Registration',     href: '/business/dnfbp' },
  { label: '📦 Import/Export Licence',  href: '/business/import-export' },
  { label: '🧾 GST Registration',       href: '/business/gst' },
  { label: '🏦 PRA Registration',       href: '/business/pra' },
];

// ── Navbar top-bar: International / Global Services dropdown ─────────────────
// Links to the six international financial services with anchor IDs so the
// dropdown takes visitors directly to the right service section on the page.
export const NAV_INTERNATIONAL_DROPDOWN = [
  { label: '📊 Financial Modeling',     href: '/international-financial-services#financial-modeling' },
  { label: '🎯 Investor Pitch Deck',    href: '/international-financial-services#pitch-deck' },
  { label: '👔 Fractional CFO',         href: '/international-financial-services#fractional-cfo' },
  { label: '💰 Business Valuation',     href: '/international-financial-services#valuation' },
  { label: '📈 FP&A Services',          href: '/international-financial-services#fpa' },
  { label: '📝 Business Plan Writing',  href: '/international-financial-services#business-plan' },
];

// ── Footer: Quick links column ────────────────────────────────────────────────
export const FOOTER_LINKS = [
  { label: 'Home',                href: '/' },
  { label: 'Services',            href: '/services-fees' },
  { label: 'Global Services',     href: '/international-financial-services' },
  { label: 'About Us',            href: '/about' },
  { label: 'Contact',             href: '/contact' },
  { label: 'Book Meeting',        href: '/booking' },
  { label: 'Privacy Policy',      href: '/privacy-policy' },
];

// ── Footer: Our Services column ───────────────────────────────────────────────
// Linked to individual service SEO pages so footer passes PageRank
// to service pages on every page of the site.
export const FOOTER_SERVICES = [
  { label: 'NTN & Filer Registration',    href: '/personal/ntn' },
  { label: 'FBR Tax Return Filing',        href: '/personal/tax-return' },
  { label: 'Business / Firm Registration', href: '/business/business-reg' },
  { label: 'SECP Company Registration',    href: '/business/company-reg' },
  { label: 'Trademark & GST / PRA',        href: '/business/trademark' },
  { label: 'Import & Export License',      href: '/business/import-export' },
  { label: 'Financial Modeling (Global)',  href: '/international-financial-services#financial-modeling' },
  { label: 'Fractional CFO (Global)',      href: '/international-financial-services#fractional-cfo' },
];

// ── Footer: Free Guides column ────────────────────────────────────────────────
// Keeps guide links in footer for crawlability on every page.
export const FOOTER_GUIDES = [
  { label: 'How to Get NTN in Pakistan',        href: '/guides/how-to-get-ntn-pakistan' },
  { label: 'How to Become a Filer (2026)',       href: '/guides/how-to-become-filer-pakistan' },
  { label: 'FBR Tax Return Deadline 2026',       href: '/guides/fbr-tax-return-deadline-2026' },
  { label: 'Filer vs Non-Filer Benefits',        href: '/guides/filer-vs-non-filer-benefits' },
];

// ── Homepage hero typing animation texts ─────────────────────────────────────
export const HERO_TYPING_TEXTS = [
  'NTN Registration',
  'FBR Tax Return Filing',
  'SECP Company Registration',
  'GST & PRA Registration',
  'Trademark Registration',
  'Bookkeeping & Accounts',
];

// ── Homepage stats ────────────────────────────────────────────────────────────
// Static values rendered in HTML for Google crawler visibility.
// Client-side counter animations run on top of these.
export const HOME_STATS = [
  { id: 'stat-clients',  value: '500+',  label: 'Happy Clients',   animateTo: 500 },
  { id: 'stat-hours',    value: '24hrs', label: 'Fast Service',     animateTo: 24  },
  { id: 'stat-services', value: '15+',   label: 'Services',         animateTo: 15  },
  { id: 'stat-legal',    value: '99%',  label: 'Legal Compliance', animateTo: 100 },
];

// ── Homepage service cards ────────────────────────────────────────────────────
export const HOME_SERVICES = [
  {
    title: 'NTN Registration',
    description: 'Get your National Tax Number (NTN) issued quickly. We handle all FBR IRIS portal submissions and paperwork on your behalf.',
    image: '/images/ntn-registration.jpg',
    alt:   'NTN registration service Pakistan — Akbar Tax Store Faisalabad',
    href:  '/personal/ntn',
  },
  {
    title: 'FBR Tax Return Filing',
    description: 'Professional FBR income tax return preparation and filing for individuals, salaried employees, freelancers, and business owners.',
    image: '/images/tax-return.jpg',
    alt:   'FBR income tax return filing service Pakistan',
    href:  '/personal/tax-return',
  },
  {
    title: 'SECP Company Registration',
    description: 'Register your private limited company with SECP including complete legal documentation, digital signatures, and certificate of incorporation.',
    image: '/images/company-registration.jpg',
    alt:   'SECP company registration Pakistan — private limited company',
    href:  '/business/company-reg',
  },
  {
    title: 'Business Registration',
    description: 'Start your sole proprietorship or partnership legally with complete FBR and SECP registration services and end-to-end support.',
    image: '/images/business-registration.jpg',
    alt:   'Business registration in Pakistan — sole proprietorship and partnership',
    href:  '/business/business-reg',
  },
  {
    title: 'GST Registration',
    description: 'Federal GST and Punjab Revenue Authority (PRA) registration services for businesses supplying taxable goods and services in Pakistan.',
    image: '/images/gst.jpg',
    alt:   'GST registration Pakistan — General Sales Tax FBR',
    href:  '/personal/gst',
  },
  {
    title: 'Trademark Registration',
    description: 'Protect your brand name and logo with comprehensive trademark registration through the Intellectual Property Organisation of Pakistan (IPO).',
    image: '/images/trademark-registration.jpg',
    alt:   'Trademark registration Pakistan — brand protection IPO',
    href:  '/business/trademark',
  },
];

// ── Homepage "Why Choose Us" features ─────────────────────────────────────────
export const HOME_FEATURES = [
  { icon: '✅', title: 'FBR-Verified Processes',      desc: 'All tax filing and NTN registration procedures follow official FBR guidelines and are submitted directly through the IRIS portal.' },
  { icon: '⚡', title: '24-Hour Turnaround',           desc: 'Most services including NTN registration and income tax return filing are completed within 24–48 hours of receiving your documents.' },
  { icon: '💰', title: 'Transparent Pricing',          desc: 'No hidden fees. You see exactly what you pay before we start. NTN registration from PKR 4,000. Tax return filing from PKR 5,000.' },
  { icon: '📱', title: '100% Online — No Office Visit',desc: 'Submit your documents via WhatsApp or email. We handle all government portal submissions. Clients across all of Pakistan served remotely.' },
  { icon: '🏆', title: '5+ Years of Experience',       desc: 'Our team has deep expertise in Pakistani tax law, Accounting Services, and FBR compliance — keeping your business on the right side of the law.' },
  { icon: '🌐', title: 'Serving All of Pakistan',      desc: 'Based in Faisalabad, we serve clients from Lahore, Karachi, Islamabad, Rawalpindi, and every city across Pakistan.' },
];

// ── Homepage FAQ items ────────────────────────────────────────────────────────
export const HOME_FAQS = [
  {
    q: 'How do I become a tax filer in Pakistan?',
    a: 'To become a tax filer (appear on the Active Taxpayer List/ATL), you need to register on the FBR IRIS portal, obtain your NTN, and file your income tax return before the annual deadline (usually September 30). Akbar Tax Store handles the complete process for you within 24–48 hours.',
  },
  {
    q: 'What is the FBR tax return deadline for 2026?',
    a: 'The FBR income tax return deadline for salaried individuals and business owners is typically September 30, 2026 for Tax Year 2026. Contact Akbar Tax Store early to file your return on time and avoid late-filing penalties.',
  },
  {
    q: 'What are the benefits of becoming a filer in Pakistan?',
    a: 'Active filers in Pakistan pay significantly lower withholding taxes on bank transactions, property purchases, and vehicle registrations. For example, non-filers pay double the tax on most bank withdrawals and property deals. Filers also have stronger financial credibility for loans and contracts.',
  },
  {
    q: 'How much does NTN registration cost in Pakistan?',
    a: 'Akbar Tax Store charges PKR 4,000 for NTN Certificate registration. The process is completed within 24 hours of receiving your CNIC and other required documents. The service includes full FBR IRIS portal submission and document processing.',
  },
  {
    q: 'Can I get FBR tax filing services online from anywhere in Pakistan?',
    a: 'Yes. Akbar Tax Store provides fully online FBR tax filing services. You submit your documents via WhatsApp or email. Our team handles all FBR IRIS portal submissions and sends you your tax return confirmation — no office visit required, for clients across all of Pakistan.',
  },
  {
    q: 'How do I register a company in Pakistan through SECP?',
    a: 'SECP company registration involves choosing a company name, preparing the Memorandum and Articles of Association, paying the registration fee, and obtaining your Certificate of Incorporation through the SECP eServices portal.',
  },
];

// ── Homepage guide/resource links ─────────────────────────────────────────────
export const HOME_GUIDES = [
  { title: 'How to Get NTN in Pakistan',          href: '/guides/how-to-become-filer-pakistan' },
  { title: 'FBR Tax Return Deadline 2026',         href: '/guides/fbr-tax-return-deadline-2026' },
  { title: 'Filer vs Non-Filer: Key Differences',  href: '/guides/filer-vs-non-filer-benefits' },
];

// ── Services fees page — Personal services ────────────────────────────────────
// Each entry includes SEO fields (metaTitle, metaDesc, h1, category) and
// content fields (process, benefits) used by the dynamic [serviceId] page.
export const PERSONAL_SERVICES = [
  {
    id: 'nin',
    title: 'NIN Registration',
    category: 'Registration',
    description: 'National Identity Number registration for tax purposes',
    metaTitle: 'NIN Registration Pakistan — National Identity Number | Akbar Tax Store',
    metaDesc: 'Get your NIN (National Identity Number) registered in Pakistan within 24 hours. Required for FBR tax compliance. PKR 3,000. Akbar Tax Store, Faisalabad.',
    h1: 'NIN Registration in Pakistan — 24-Hour Service',
    price: 3000, duration: '24 Hours',
    image: '/images/nin-registration.jpg',
    alt: 'NIN registration service Pakistan — National Identity Number for tax',
    href: '/personal/nin',
    requirements: ['ID card copy (front & back)', 'Active mobile number', 'Email address'],
    process: [
      'Submit your CNIC copy and mobile number via WhatsApp or email',
      'Our team verifies documents and submits to the relevant authority',
      'Receive SMS confirmation within 24 hours',
      'Download your NIN certificate via email',
    ],
    benefits: [
      'Mandatory for all FBR tax filings and transactions',
      'Links your identity across government systems',
      'Required for bank accounts and property transactions',
      'Essential step before becoming an active tax filer',
    ],
  },
  {
    id: 'ntn',
    title: 'NTN Certificate',
    category: 'Certificate',
    description: 'National Tax Number registration via FBR IRIS portal',
    metaTitle: 'NTN Registration Pakistan — Get NTN Certificate in 24 Hours | Akbar Tax Store',
    metaDesc: 'NTN registration via FBR IRIS portal in 24 hours. PKR 4,000. Our experts handle all paperwork and portal submission. No office visit required. Faisalabad, Pakistan.',
    h1: 'NTN Registration in Pakistan — Get Your NTN Certificate in 24 Hours',
    price: 4000, duration: '24 Hours',
    image: '/images/ntn-certificate.jpg',
    alt: 'NTN certificate Pakistan — National Tax Number FBR registration',
    href: '/personal/ntn',
    requirements: ['CNIC copy', 'Mobile number', 'Email address'],
    process: [
      'Complete our simple document submission via WhatsApp or email',
      'We register you on FBR IRIS portal on your behalf',
      'NTN issued and confirmed via SMS/email within 24 hours',
      'Download your NTN certificate from the FBR IRIS dashboard',
    ],
    benefits: [
      'Mandatory for all tax-related transactions in Pakistan',
      'Required for property purchases and vehicle registration',
      'Essential for bank loans and business financing',
      'Lifetime validity — no renewal needed',
    ],
  },
  {
    id: 'tax-return',
    title: 'Tax Return Filing',
    category: 'Filing',
    description: 'Annual FBR income tax return filing for individuals and salaried persons',
    metaTitle: 'Income Tax Return Filing Pakistan — FBR IRIS | Akbar Tax Store',
    metaDesc: 'Professional FBR income tax return filing for salaried individuals and freelancers in Pakistan. PKR 5,000. Completed in 24–48 hours. Akbar Tax Store, Faisalabad.',
    h1: 'FBR Income Tax Return Filing in Pakistan — Salaried & Individual',
    price: 5000, duration: '24–48 hours after document submission',
    image: '/images/tax-return.jpg',
    alt: 'FBR income tax return filing Pakistan — salaried individual',
    href: '/personal/tax-return',
    requirements: [
      'Username and Password (If Already Filer then only need this)',
      'If you are new then provide below otherwise not',
      'ID Card Picture', 'Email Address', 'Phone Number',
      'Bank Account Details if you have Bank Account',
      'Property Details if you own any property',
      'Vehicle details if you own any car or bike',
      'Salary person or Business owner',
    ],
    process: [
      'Provide your FBR IRIS login credentials (or we create your profile if new)',
      'Share salary certificate, bank statements, and asset details',
      'Our experts prepare your income and wealth statement',
      'Return submitted to FBR within 24–48 hours of document receipt',
      'You receive the filing confirmation and CPR receipt',
    ],
    benefits: [
      'Avoid PKR 1,000/day late filing penalty after September 30 deadline',
      'Maintain Active Taxpayer List (ATL) status for lower withholding taxes',
      'Claim maximum eligible deductions and refunds',
      'Professional wealth reconciliation to avoid FBR audit notices',
    ],
  },
  {
    id: 'filer',
    title: 'Become an Active Filer',
    category: 'Status',
    description: 'Complete FBR filer registration — appear on the Active Taxpayer List (ATL)',
    metaTitle: 'Become a Tax Filer in Pakistan — FBR Active Taxpayer List | Akbar Tax Store',
    metaDesc: 'Become an FBR active filer in Pakistan in 24–48 hours. Appear on ATL, pay lower withholding taxes on property, banking, and vehicles. PKR 20,000. Faisalabad.',
    h1: 'Become an Active Tax Filer in Pakistan — Appear on ATL in 24 Hours',
    price: 20000, duration: '24–48 hours after document submission',
    image: '/images/tax.jpg',
    alt: 'Become a tax filer Pakistan — FBR Active Taxpayer List ATL',
    href: '/personal/filer',
    requirements: [
      'ID Card Picture', 'Email Address', 'Phone Number',
      'Bank Account Details if you have Bank Account',
      'Property Details if you own any property',
      'Vehicle details if you own any car or bike',
      'Salary person or Business owner',
    ],
    process: [
      'Submit your CNIC and contact details via WhatsApp',
      'We create or activate your FBR IRIS profile if not already registered',
      'Income and wealth statement prepared and verified',
      'Tax return filed and ATL status confirmed within 24–48 hours',
      'You receive filing confirmation and ATL verification instructions',
    ],
    benefits: [
      'Pay 3% property purchase tax instead of 10% as a non-filer (Section 236K)',
      'Pay 15% bank interest tax instead of 35% as a non-filer (Section 151)',
      'Lower vehicle token tax — save up to PKR 40,000 annually',
      'Required for government tenders and contracts',
      'Stronger financial credibility for loans and leases',
    ],
  },
  {
    id: 'gst',
    title: 'GST Registration',
    category: 'Registration',
    description: 'Federal Goods and Services Tax registration with FBR',
    metaTitle: 'GST Registration Pakistan — Federal General Sales Tax FBR | Akbar Tax Store',
    metaDesc: 'GST registration in Pakistan via FBR portal. PKR 40,000. Completed in 5–7 working days. For businesses with taxable supplies. Akbar Tax Store, Faisalabad.',
    h1: 'GST Registration in Pakistan — Federal General Sales Tax FBR',
    price: 40000, duration: '5–7 working days',
    image: '/images/gst.jpg',
    alt: 'GST registration Pakistan — Federal General Sales Tax FBR',
    href: '/personal/gst',
    requirements: [
      'ID Card Picture', 'Phone Number', 'Email ID', 'Business Name', 'Business Address',
      'Business Principal Activity', 'Office Front Door picture',
      'Electricity bill & meter pic', 'Property/office agreement',
      'Bank maintenance Certificate (Business bank)',
    ],
    process: [
      'Business category and turnover determination',
      'Document preparation and verification',
      'FBR sales tax portal application submission',
      'Follow-up and coordination with FBR',
      'GST registration certificate issued within 5–7 working days',
    ],
    benefits: [
      'Legal compliance for your business operations',
      'Claim input tax adjustments to reduce tax liability',
      'Required for government supply contracts',
      'Avoid penalties for unregistered taxable supplies',
      'Professional credibility with suppliers and clients',
    ],
  },
  {
    id: 'pra',
    title: 'PRA Registration',
    category: 'Registration',
    description: 'Punjab Revenue Authority registration for Punjab-based businesses',
    metaTitle: 'PRA Registration Pakistan — Punjab Revenue Authority | Akbar Tax Store',
    metaDesc: 'PRA registration for service providers in Punjab, Pakistan. PKR 40,000. Completed in 5–7 working days. Doctors, lawyers, consultants, and businesses. Faisalabad.',
    h1: 'PRA Registration in Pakistan — Punjab Revenue Authority',
    price: 40000, duration: '5–7 working days',
    image: '/images/pra-registration.png',
    alt: 'PRA registration Pakistan — Punjab Revenue Authority service tax',
    href: '/personal/pra',
    requirements: [
      'ID Card Picture', 'Phone Number', 'Email ID', 'Business Name', 'Business Address',
      'Business Principal Activity', 'Office Front Door picture',
      'Electricity bill & meter pic', 'Property/office agreement',
      'Bank maintenance Certificate (Business bank)',
    ],
    process: [
      'Service category and tax rate determination',
      'Document preparation and verification',
      'Online PRA portal application submission',
      'PRA coordination and follow-up',
      'Registration certificate issued within 5–7 working days',
    ],
    benefits: [
      'Legal compliance for Punjab-based service providers',
      'Proper invoice documentation for clients',
      'Input tax adjustments on business purchases',
      'Avoid 2% monthly penalty for unregistered service providers',
      'Required for professional service billing',
    ],
  },
  {
    id: 'chamber',
    title: 'Chamber of Commerce',
    category: 'Registration',
    description: 'Chamber of Commerce membership registration',
    metaTitle: 'Chamber of Commerce Membership Registration Pakistan | Akbar Tax Store',
    metaDesc: 'Chamber of Commerce membership registration in Pakistan. PKR 30,000. Completed in 5–7 working days. Required for import/export businesses. Faisalabad.',
    h1: 'Chamber of Commerce Membership Registration in Pakistan',
    price: 30000, duration: '5–7 working days',
    image: '/images/chamber-commerce.jpg',
    alt: 'Chamber of Commerce membership registration Pakistan Faisalabad',
    href: '/personal/chamber',
    requirements: [
      'ID Card Picture', 'Phone Number', 'Email ID', 'Business Name', 'Business Address',
      'Business Principal Activity', 'Person Signature',
      'White Background Picture', '2 years Tax Returns Copy',
    ],
    process: [
      'Business category assessment and membership tier selection',
      'Document preparation and sponsorship arrangement',
      'Application submission to relevant Chamber',
      'Membership approval and processing',
      'Certificate and membership card delivery within 5–7 working days',
    ],
    benefits: [
      'Essential for import/export businesses and trade activities',
      'Access to trade delegations and business networking',
      'Government tender eligibility',
      'Export and import certificates issued',
      'Business dispute resolution services',
    ],
  },
];

// ── Services fees page — Business services ────────────────────────────────────
export const BUSINESS_SERVICES = [
  {
    id: 'nin',
    title: 'NIN Registration',
    category: 'Registration',
    description: 'National Identity Number registration for tax purposes',
    metaTitle: 'NIN Registration for Businesses Pakistan | Akbar Tax Store',
    metaDesc: 'Business NIN registration in Pakistan within 24 hours. Required for all FBR tax compliance. PKR 3,000. Akbar Tax Store Faisalabad — serving all of Pakistan.',
    h1: 'NIN Registration for Businesses in Pakistan — 24-Hour Service',
    price: 3000, duration: '24 Hours',
    image: '/images/nin-registration.jpg',
    alt: 'NIN registration business Pakistan — National Identity Number',
    href: '/business/nin',
    requirements: ['ID card copy (front & back)', 'Active mobile number', 'Email address'],
    process: [
      'Submit CNIC copy and active mobile number via WhatsApp or email',
      'Our team verifies and submits to the relevant authority',
      'Receive SMS confirmation within 24 hours',
      'NIN certificate delivered digitally',
    ],
    benefits: [
      'Mandatory for all business tax filings and transactions',
      'Links business identity across all government systems',
      'Required for business bank accounts and property transactions',
      'Essential step before FBR business registration',
    ],
  },
  {
    id: 'ntn',
    title: 'NTN Certificate',
    category: 'Certificate',
    description: 'National Tax Number registration via FBR IRIS portal',
    metaTitle: 'Business NTN Registration Pakistan — FBR IRIS | Akbar Tax Store',
    metaDesc: 'Business NTN registration via FBR IRIS portal in 24 hours. PKR 4,000. No office visit. All paperwork handled. Akbar Tax Store Faisalabad, Pakistan.',
    h1: 'Business NTN Registration in Pakistan — Get Your NTN in 24 Hours',
    price: 4000, duration: '24 Hours',
    image: '/images/ntn-certificate.jpg',
    alt: 'Business NTN certificate Pakistan — FBR IRIS registration',
    href: '/business/ntn',
    requirements: ['CNIC copy', 'Mobile number', 'Email address'],
    process: [
      'Submit documents via WhatsApp or email',
      'We register your business on FBR IRIS portal',
      'NTN confirmed via SMS/email within 24 hours',
      'Download NTN certificate from IRIS dashboard',
    ],
    benefits: [
      'Mandatory for all business tax transactions in Pakistan',
      'Required for SECP company registration and business banking',
      'Essential for government tenders and contracts',
      'Lifetime validity — no renewal needed',
    ],
  },
  {
    id: 'filer',
    title: 'Business Filer Registration',
    category: 'Status',
    description: 'Become an active tax filer for your business — appear on ATL',
    metaTitle: 'Business Tax Filer Registration Pakistan — Active Taxpayer List | Akbar Tax Store',
    metaDesc: 'Register your business as an active FBR filer in Pakistan. Appear on ATL, pay lower withholding taxes. PKR 20,000. 24–48 hours. Akbar Tax Store Faisalabad.',
    h1: 'Business Filer Registration Pakistan — Appear on FBR Active Taxpayer List',
    price: 20000, duration: '24–48 hours after document submission',
    image: '/images/bookkeeping.jpg',
    alt: 'Business filer registration Pakistan FBR Active Taxpayer List',
    href: '/business/filer',
    requirements: [
      'ID Card Picture', 'Email Address', 'Phone Number',
      'Bank Account Details if you have Bank Account',
      'Property Details if you own any property',
      'Vehicle details if you own any car or bike',
      'Business owner details',
    ],
    process: [
      'Submit business and owner CNIC details via WhatsApp',
      'We create or activate your FBR IRIS business profile',
      'Income and wealth statement prepared and verified',
      'Business return filed and ATL status confirmed within 24–48 hours',
      'You receive confirmation and ATL verification instructions',
    ],
    benefits: [
      'Pay 3% property transaction tax instead of 10% (Section 236K)',
      'Lower withholding tax on all banking transactions',
      'Required for government supply contracts and tenders',
      'Stronger credibility for business loans and leases',
      'Eligible for input tax adjustments on business purchases',
    ],
  },
  {
    id: 'business-reg',
    title: 'Business Registration',
    category: 'Registration',
    description: 'Sole proprietorship or partnership registration with FBR and relevant authorities',
    metaTitle: 'Business Registration Pakistan — Sole Proprietorship & Partnership | Akbar Tax Store',
    metaDesc: 'Register your business in Pakistan in 1–3 working days. Sole proprietorship and partnership registration. PKR 15,000. Full documentation handled. Faisalabad.',
    h1: 'Business Registration in Pakistan — Sole Proprietorship & Partnership',
    price: 15000, duration: '1–3 working days',
    image: '/images/business-registration.jpg',
    alt: 'Business registration Pakistan sole proprietorship partnership FBR',
    href: '/business/business-reg',
    requirements: [
      'Owner/partner CNICs', 'Phone Number', 'Email Address',
      'Business name', 'Business Address Proof', 'Business Principal Activity',
    ],
    process: [
      'Business name availability check',
      'Document preparation and verification',
      'Submission to FBR and relevant authority',
      'Follow-up and status tracking',
      'Registration certificate delivered within 1–3 working days',
    ],
    benefits: [
      'Establishes legal business identity in Pakistan',
      'Required for opening a business bank account',
      'Enables government tender eligibility',
      'Foundation for NTN, GST, and other registrations',
      'Protects your business name legally',
    ],
  },
  {
    id: 'company-reg',
    title: 'SECP Company Registration',
    category: 'Registration',
    description: 'Private limited company registration with SECP including all legal documentation',
    metaTitle: 'SECP Company Registration Pakistan — Private Limited Company | Akbar Tax Store',
    metaDesc: 'SECP private limited company registration in Pakistan in 24–48 hours. PKR 50,000. Complete incorporation including MOA, AOA, and Certificate of Incorporation. Faisalabad.',
    h1: 'SECP Company Registration Pakistan — Private Limited Company in 24–48 Hours',
    price: 50000, duration: '24–48 hours after document submission',
    image: '/images/company-registration.jpg',
    alt: 'SECP company registration Pakistan private limited certificate of incorporation',
    href: '/business/company-reg',
    requirements: [
      'Owner Details: Name, CNIC, Contact, Email, Share holder',
      'Company Details: Name, CNIC, Contact, Email',
      'Company Address', 'Company Category',
      'Director: Name, CNIC, Email, Contact, Share Holder',
    ],
    process: [
      'Company name search and availability check on SECP eServices',
      'Memorandum and Articles of Association preparation',
      'SECP online portal submission and fee payment',
      'Follow-up until Certificate of Incorporation issued',
      'Post-incorporation NTN and bank account setup guidance',
    ],
    benefits: [
      'Creates a separate legal entity with limited liability',
      'Easier access to business financing and bank loans',
      'Required for overseas investors and foreign investment',
      'Higher business credibility for contracts and tenders',
      'Transferable ownership through share issuance',
    ],
  },
  {
    id: 'firm-reg',
    title: 'Firm Registration',
    category: 'Registration',
    description: 'Business firm registration with complete legal documentation',
    metaTitle: 'Firm Registration Pakistan — Partnership Firm Registrar | Akbar Tax Store',
    metaDesc: 'Partnership firm registration in Pakistan in 3–5 working days. PKR 50,000. Partnership deed preparation, notarisation, and Registrar of Firms submission. Faisalabad.',
    h1: 'Firm Registration in Pakistan — Partnership Firm & Registrar of Firms',
    price: 50000, duration: '3–5 working days',
    image: '/images/firm-registration.jpg',
    alt: 'Firm registration Pakistan partnership registrar of firms',
    href: '/business/firm-reg',
    requirements: [
      'Owner Details: Name, CNIC, Contact, Email, Share holder',
      'Firm Details: Name', 'Company Address', 'Company Category',
      'Director: Name, CNIC, Email, Contact, Share Holder',
    ],
    process: [
      'Partnership deed preparation and profit-sharing structure',
      'Notarisation and stamp duty payment',
      'Submission to Registrar of Firms',
      'Follow-up until registration certificate issued',
      'Post-registration NTN and bank account guidance',
    ],
    benefits: [
      'Legal recognition of the partnership in Pakistan',
      'Clear profit-sharing and decision-making structure',
      'Easier dispute resolution between partners',
      'Better access to business financing',
      'Foundation for GST and other business registrations',
    ],
  },
  {
    id: 'trademark',
    title: 'Trademark Registration',
    category: 'Protection',
    description: 'Brand name and logo protection via IPO Pakistan trademark registration',
    metaTitle: 'Trademark Registration Pakistan — IPO Brand Protection | Akbar Tax Store',
    metaDesc: 'Trademark registration in Pakistan via IPO. PKR 80,000. Protect your brand name and logo. Application filed in 24–48 hours. 10-year protection. Faisalabad.',
    h1: 'Trademark Registration in Pakistan — Protect Your Brand via IPO Pakistan',
    price: 80000, duration: '24–48 hours after document submission',
    image: '/images/trademark.jpg',
    alt: 'Trademark registration Pakistan IPO brand name logo protection',
    href: '/business/trademark',
    requirements: [
      'Owner/partner CNICs', 'Phone Number', 'Email Address',
      'Business name', 'Business Address Proof', 'Business Principal Activity',
      'Person Signature', 'Business logo white background picture',
    ],
    process: [
      'Trademark search and availability check on IPO Pakistan database',
      'Trademark class selection based on business activity',
      'Application preparation and filing with IPO Pakistan',
      'Examination response handling if required',
      'Trademark registration certificate delivered upon approval',
    ],
    benefits: [
      'Exclusive legal rights to your brand name and logo in Pakistan',
      'Protection against infringement and brand copying',
      'Valid for 10 years — renewable indefinitely',
      'Foundation for international trademark registration',
      'Required for franchising and licensing your brand',
    ],
  },
  {
    id: 'import-export',
    title: 'Import / Export License',
    category: 'License',
    description: 'License for international trade — import and export from Pakistan',
    metaTitle: 'Import Export License Pakistan — International Trade Registration | Akbar Tax Store',
    metaDesc: 'Import and export license registration in Pakistan in 24–48 hours. PKR 40,000. Required for international trade. FBR IRIS and EPB registration handled. Faisalabad.',
    h1: 'Import Export License in Pakistan — International Trade Registration',
    price: 40000, duration: '24–48 hours after document submission',
    image: '/images/import-export.jpg',
    alt: 'Import export license Pakistan international trade registration',
    href: '/business/import-export',
    requirements: [
      'ID card picture', 'Phone Number (registered on NTN)',
      'IRIS login credentials', 'Email ID (registered on NTN)',
    ],
    process: [
      'NTN and IRIS profile verification',
      'Export/import registration on FBR portal',
      'EPB (Export Promotion Bureau) coordination if required',
      'Customs department liaison',
      'License certificate issued within 24–48 hours',
    ],
    benefits: [
      'Legal authorisation for international trade from Pakistan',
      'Access to export incentives and duty drawbacks',
      'Easier customs clearance at ports',
      'Eligibility for trade financing from banks',
      'Access to global markets for your products',
    ],
  },
  {
    id: 'gst',
    title: 'GST Registration',
    category: 'Tax',
    description: 'Federal Goods and Services Tax registration with FBR for businesses',
    metaTitle: 'Business GST Registration Pakistan — FBR Sales Tax | Akbar Tax Store',
    metaDesc: 'GST registration for businesses in Pakistan via FBR portal. PKR 40,000. 5–7 working days. Complete documentation and FBR submission handled. Faisalabad.',
    h1: 'Business GST Registration in Pakistan — Federal General Sales Tax FBR',
    price: 40000, duration: '5–7 working days',
    image: '/images/gst.jpg',
    alt: 'Business GST registration Pakistan FBR General Sales Tax',
    href: '/business/gst',
    requirements: [
      'ID Card Picture', 'Phone Number', 'Email ID', 'Business Name', 'Business Address',
      'Business Principal Activity', 'Office Front Door picture',
      'Electricity bill & meter pic', 'Property/office agreement',
      'Bank maintenance Certificate (Business bank)',
    ],
    process: [
      'Business turnover and category determination',
      'Document preparation and verification',
      'FBR sales tax portal submission',
      'Follow-up and coordination with FBR',
      'GST registration certificate issued within 5–7 working days',
    ],
    benefits: [
      'Legal compliance for businesses supplying taxable goods and services',
      'Claim input tax adjustments to reduce overall tax liability',
      'Required for government supply contracts above PKR 10 million',
      'Avoid penalties for operating without GST registration',
      'Professional credibility with suppliers and corporate clients',
    ],
  },
  {
    id: 'pra',
    title: 'PRA Registration',
    category: 'Registration',
    description: 'Punjab Revenue Authority registration for Punjab-based businesses',
    metaTitle: 'PRA Registration Punjab Pakistan — Punjab Revenue Authority | Akbar Tax Store',
    metaDesc: 'PRA registration for businesses in Punjab, Pakistan. PKR 40,000. 5–7 working days. Required for service providers in Punjab. Complete documentation handled. Faisalabad.',
    h1: 'PRA Registration in Punjab Pakistan — Punjab Revenue Authority',
    price: 40000, duration: '5–7 working days',
    image: '/images/pra-registration.png',
    alt: 'PRA registration Punjab Pakistan Punjab Revenue Authority business',
    href: '/business/pra',
    requirements: [
      'ID Card Picture', 'Phone Number', 'Email ID', 'Business Name', 'Business Address',
      'Business Principal Activity', 'Office Front Door picture',
      'Electricity bill & meter pic', 'Property/office agreement',
      'Bank maintenance Certificate (Business bank)',
    ],
    process: [
      'Service category and PRA tax rate determination',
      'Document preparation and verification',
      'PRA online portal submission',
      'PRA coordination and follow-up',
      'Registration certificate issued within 5–7 working days',
    ],
    benefits: [
      'Legal compliance for Punjab-based service businesses',
      'Proper invoice documentation for business clients',
      'Input tax adjustments on purchases',
      'Avoid 2% monthly penalty for unregistered service providers',
      'Required for professional service billing above PKR 1 million',
    ],
  },
  {
    id: 'chamber',
    title: 'Chamber of Commerce',
    category: 'Registration',
    description: 'Chamber of Commerce membership registration',
    metaTitle: 'Chamber of Commerce Membership Registration Pakistan | Akbar Tax Store',
    metaDesc: 'Chamber of Commerce membership for businesses in Pakistan. PKR 30,000. 5–7 working days. Required for import/export and trade activities. Faisalabad.',
    h1: 'Chamber of Commerce Membership Registration in Pakistan',
    price: 30000, duration: '5–7 working days',
    image: '/images/chamber-commerce.jpg',
    alt: 'Chamber of Commerce membership registration Pakistan business',
    href: '/business/chamber',
    requirements: [
      'ID Card Picture', 'Phone Number', 'Email ID', 'Business Name', 'Business Address',
      'Business Principal Activity', 'Person Signature',
      'White Background Picture', '2 years Tax Returns Copy',
    ],
    process: [
      'Membership category assessment and tier selection',
      'Document preparation and sponsorship arrangement',
      'Application submission to relevant Chamber of Commerce',
      'Membership approval and processing',
      'Certificate and membership card delivered within 5–7 working days',
    ],
    benefits: [
      'Essential for import/export businesses and international trade',
      'Export and import certificate issuance for shipments',
      'Access to government tenders requiring chamber membership',
      'Business networking and trade delegation access',
      'Business dispute resolution and legal support',
    ],
  },
  {
    id: 'dnfbp',
    title: 'DNFBP Registration',
    category: 'Compliance',
    description: 'Designated Non-Financial Business and Professions registration',
    metaTitle: 'DNFBP Registration Pakistan — FIA AML Compliance | Akbar Tax Store',
    metaDesc: 'DNFBP registration in Pakistan for real estate, dealers, lawyers, and accountants. PKR 15,000. 4–5 working days. FIA AML/CFT compliance. Faisalabad.',
    h1: 'DNFBP Registration in Pakistan — FIA AML/CFT Compliance',
    price: 15000, duration: '4–5 working days',
    image: '/images/dnfbp.png',
    alt: 'DNFBP registration Pakistan FIA AML compliance',
    href: '/business/dnfbp',
    requirements: [
      'ID Card Picture', 'Phone Number', 'Email ID', 'Business Name', 'Business Address',
      'Business Principal Activity', 'Police Character Certificate',
      'Property/office agreement', 'Bank maintenance Certificate (Business bank)',
    ],
    process: [
      'Business category verification against FIA DNFBP list',
      'Document preparation and police character certificate guidance',
      'FIA online portal submission',
      'AML/CFT compliance check and approval',
      'Registration certificate delivered within 4–5 working days',
    ],
    benefits: [
      'Legal compliance with FIA regulations — avoids penalties up to PKR 1 million',
      'Better banking relationships and smooth financial transactions',
      'Required for real estate, precious metals, and designated professions',
      'Increased business credibility with clients and banks',
      'Full AML/CFT compliance documentation',
    ],
  },
  {
    id: 'accounting',
    title: 'Accounting & Financial Reporting',
    category: 'Financial Services',
    description: 'Professional accounting and financial reporting services from certified accountants',
    metaTitle: 'Accounting & Financial Reporting Services Pakistan | Akbar Tax Store',
    metaDesc: 'Professional accounting and financial reporting for businesses in Pakistan. PKR 50,000. Financial statements, FBR compliance, and expert advisory. Faisalabad.',
    h1: 'Accounting & Financial Reporting Services for Businesses in Pakistan',
    price: 50000, duration: '4–5 working days',
    image: '/images/accounting-finance.jpg',
    alt: 'Accounting financial reporting services Pakistan businesses',
    href: '/business/accounting',
    requirements: [
      'Previous Tax Return', 'Previous Financials',
      'Current Year All Bank Statement', 'All General Ledger',
      'Capital detail ledger', 'Stock detail',
      'Administration detail ledger', 'HR detail ledger',
      'Shareholder detail / paid up capital detail',
    ],
    process: [
      'Document collection and financial data review',
      'Analysis and verification against accounting standards',
      'Financial statement preparation (balance sheet, P&L, cash flow)',
      'FBR compliance check and tax position review',
      'Final reporting and expert advisory consultation',
    ],
    benefits: [
      'Accurate financial statements meeting FBR and SECP requirements',
      'Professional balance sheet, P&L, and cash flow statements',
      'Tax optimisation opportunities identified',
      'Required for bank financing and investor presentations',
      'Expert advisory for business performance improvement',
    ],
  },
  {
    id: 'bookkeeping',
    title: 'Bookkeeping Service',
    category: 'Financial Services',
    description: 'Professional bookkeeping and accounts management services for businesses',
    metaTitle: 'Bookkeeping Services Pakistan — Business Accounts Management | Akbar Tax Store',
    metaDesc: 'Professional bookkeeping services for businesses in Pakistan. PKR 20,000. Daily transaction recording, reconciliations, and monthly summaries. Akbar Tax Store Faisalabad.',
    h1: 'Professional Bookkeeping Services for Businesses in Pakistan',
    price: 20000, duration: '4–5 working days',
    image: '/images/bookkeeping.jpg',
    alt: 'Bookkeeping services Pakistan small business accounts management',
    href: '/business/bookkeeping',
    requirements: ['No documents required — contact us to discuss your needs'],
    process: [
      'Initial setup and chart of accounts configuration',
      'Daily business transaction recording',
      'Regular bank account reconciliation',
      'Monthly financial summary preparation',
      'Regular reporting and consultation with business owner',
    ],
    benefits: [
      'Accurate day-to-day financial records',
      'Tax-ready books at year end — no last-minute panic',
      'Regular financial summaries for business decisions',
      'Cost-effective alternative to a full-time accountant',
      'Fully compliant records for FBR returns and audits',
    ],
  },
  {
    id: 'stock',
    title: 'Stock Report',
    category: 'Analytics',
    description: 'Detailed stock reporting and inventory analysis for FBR compliance',
    metaTitle: 'Stock Report & Inventory Analysis Pakistan — FBR Compliance | Akbar Tax Store',
    metaDesc: 'Professional stock report and inventory analysis for businesses in Pakistan. PKR 20,000. 2–5 working days. FBR-compliant stock valuation and analysis. Faisalabad.',
    h1: 'Stock Report & Inventory Analysis for Businesses in Pakistan',
    price: 20000, duration: '2–5 working days',
    image: '/images/stock-report.jpg',
    alt: 'Stock report inventory analysis Pakistan FBR compliance',
    href: '/business/stock',
    requirements: ['Provide sale and purchase data'],
    process: [
      'Sale and purchase data collection and validation',
      'Inventory categorisation and stock movement analysis',
      'Stock valuation using FIFO/weighted average method',
      'Slow-moving and dead stock identification',
      'Comprehensive report with optimisation recommendations',
    ],
    benefits: [
      'FBR-compliant stock valuation for tax return submission',
      'Accurate inventory records for financial statements',
      'Identify slow-moving stock to improve cash flow',
      'Cost analysis to improve profit margins',
      'Basis for strategic inventory planning and ordering',
    ],
  },
];

// ── About page stats ──────────────────────────────────────────────────────────
export const ABOUT_STATS = [
  { value: '1M+',   label: 'Tax Savings Generated' },
  { value: '500+',  label: 'Businesses Registered' },
  { value: '15min', label: 'Average Response Time' },
  { value: '4.8★',  label: 'Average Client Rating' },
];

// ── About page "Why Choose Us" metrics ───────────────────────────────────────
export const ABOUT_FEATURES = [
  { value: '500+', label: 'Clients Successfully Registered & Tax Filed', detail: 'From startups to established businesses' },
  { value: '5+',   label: 'Years of Proven Industry Experience',          detail: 'Deep expertise in Pakistani tax laws' },
  { value: '100%', label: 'Legal Compliance & Verification Guaranteed',   detail: 'FBR approved processes and documentation' },
  { value: '0',    label: 'Hidden Fees — Complete Transparent Pricing',   detail: 'Know exactly what you pay upfront' },
  { value: '24/7', label: 'Support via WhatsApp, Call & In-Person',       detail: 'Get help whenever you need it' },
  { value: '96%',  label: 'Client Satisfaction & Success Rate',           detail: 'Measurable results and happy customers' },
];