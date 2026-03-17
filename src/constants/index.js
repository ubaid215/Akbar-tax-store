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
  // show both, but only `phone` (0301) is used in schema / GBP / footer CTA.
  phone:          '+92-301-6832064',   // canonical — schema + GBP
  phoneDisplay:   '0301-6832064',
  phoneTel:       'tel:+923016832064',
  phoneAlt:       '+92-340-7300408',   // secondary — shown in navbar dropdown only
  phoneAltDisplay:'0340-7300408',
  phoneAltTel:    'tel:+923407300408',
  whatsappUrl:    'https://wa.me/923016832064',
  whatsappGroup:  'https://wa.me/message/QJQEJZWC36JKN1', // navbar quick-link
  email:          'hussnain@akbartaxstore.com',

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
  { label: 'HOME',         href: '/' },
  { label: 'SERVICES FEE', href: '/services-fees' },
  { label: 'ABOUT',        href: '/about' },
  { label: 'CONTACT',      href: '/contact' },
  { label: 'BOOK MEETING', href: '/book-meeting' },
];

// ── Navbar top-bar: Contact dropdown ─────────────────────────────────────────
// Rendered in the blue utility strip at the top of the navbar on desktop.
// Mix of <a href="tel:"> and <a href="mailto:"> — not Next.js routes.
export const NAV_CONTACT_DROPDOWN = [
  { label: '📞 0301-6832064',                  href: 'tel:+923016832064',              external: true },
  { label: '📞 0340-7300408',                  href: 'tel:+923407300408',              external: true },
  { label: '✉️ Email Us',                      href: 'mailto:hussnain@akbartaxstore.com', external: true },
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

// ── Footer: Quick links column ────────────────────────────────────────────────
export const FOOTER_LINKS = [
  { label: 'Home',         href: '/' },
  { label: 'Services',     href: '/services-fees' },
  { label: 'About Us',     href: '/about' },
  { label: 'Contact',      href: '/contact' },
  { label: 'Book Meeting', href: '/book-meeting' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
];

// ── Footer: Our Services column ───────────────────────────────────────────────
// Linked to individual service SEO pages so footer passes PageRank
// to service pages on every page of the site.
export const FOOTER_SERVICES = [
  { label: 'NTN & Filer Registration',   href: '/services/ntn-registration' },
  { label: 'FBR Tax Return Filing',       href: '/services/tax-filing' },
  { label: 'Business / Firm Registration',href: '/services/business-registration' },
  { label: 'SECP Company Registration',   href: '/services/company-registration' },
  { label: 'Trademark & GST / PRA',       href: '/services/gst-registration' },
  { label: 'Import & Export License',     href: '/services/import-export-license' },
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
  { id: 'stat-legal',    value: '100%',  label: 'Legal Compliance', animateTo: 100 },
];

// ── Homepage service cards ────────────────────────────────────────────────────
export const HOME_SERVICES = [
  {
    title: 'NTN Registration',
    description: 'Get your National Tax Number (NTN) issued quickly. We handle all FBR IRIS portal submissions and paperwork on your behalf.',
    image: '/images/ntn-registration.jpg',
    alt:   'NTN registration service Pakistan — Akbar Tax Store Faisalabad',
    href:  '/services/ntn-registration',
  },
  {
    title: 'FBR Tax Return Filing',
    description: 'Professional FBR income tax return preparation and filing for individuals, salaried employees, freelancers, and business owners.',
    image: '/images/tax-return.jpg',
    alt:   'FBR income tax return filing service Pakistan',
    href:  '/services/tax-filing',
  },
  {
    title: 'SECP Company Registration',
    description: 'Register your private limited company with SECP including complete legal documentation, digital signatures, and certificate of incorporation.',
    image: '/images/company-registration.jpg',
    alt:   'SECP company registration Pakistan — private limited company',
    href:  '/services/company-registration',
  },
  {
    title: 'Business Registration',
    description: 'Start your sole proprietorship or partnership legally with complete FBR and SECP registration services and end-to-end support.',
    image: '/images/business-registration.jpg',
    alt:   'Business registration in Pakistan — sole proprietorship and partnership',
    href:  '/services/business-registration',
  },
  {
    title: 'GST Registration',
    description: 'Federal GST and Punjab Revenue Authority (PRA) registration services for businesses supplying taxable goods and services in Pakistan.',
    image: '/images/gst.jpg',
    alt:   'GST registration Pakistan — General Sales Tax FBR',
    href:  '/services/gst-registration',
  },
  {
    title: 'Trademark Registration',
    description: 'Protect your brand name and logo with comprehensive trademark registration through the Intellectual Property Organisation of Pakistan (IPO).',
    image: '/images/trademark-registration.jpg',
    alt:   'Trademark registration Pakistan — brand protection IPO',
    href:  '/services/trademark-registration',
  },
];

// ── Homepage "Why Choose Us" features ─────────────────────────────────────────
export const HOME_FEATURES = [
  { icon: '✅', title: 'FBR-Verified Processes',      desc: 'All tax filing and NTN registration procedures follow official FBR guidelines and are submitted directly through the IRIS portal.' },
  { icon: '⚡', title: '24-Hour Turnaround',           desc: 'Most services including NTN registration and income tax return filing are completed within 24–48 hours of receiving your documents.' },
  { icon: '💰', title: 'Transparent Pricing',          desc: 'No hidden fees. You see exactly what you pay before we start. NTN registration from PKR 4,000. Tax return filing from PKR 5,000.' },
  { icon: '📱', title: '100% Online — No Office Visit',desc: 'Submit your documents via WhatsApp or email. We handle all government portal submissions. Clients across all of Pakistan served remotely.' },
  { icon: '🏆', title: '5+ Years of Experience',       desc: 'Our team has deep expertise in Pakistani tax law, SECP regulations, and FBR compliance — keeping your business on the right side of the law.' },
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
    a: 'SECP company registration involves choosing a company name, preparing the Memorandum and Articles of Association, paying the registration fee, and obtaining your Certificate of Incorporation through the SECP eServices portal. Akbar Tax Store completes this entire process for PKR 50,000 within 24–48 hours.',
  },
];

// ── Homepage guide/resource links ─────────────────────────────────────────────
export const HOME_GUIDES = [
  { title: 'How to Get NTN in Pakistan',          href: '/guides/how-to-get-ntn-pakistan' },
  { title: 'How to Become a Filer (2026 Guide)',   href: '/guides/how-to-become-filer-pakistan' },
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
    id: 'nin', title: 'NIN Registration', description: 'National Identity Number registration for tax purposes',
    price: 3000, duration: '24 Hours', image: '/images/nin-registration.jpg',
    alt: 'NIN registration business Pakistan', href: '/business/nin',
    requirements: ['ID card copy (front & back)', 'Active mobile number', 'Email address'],
  },
  {
    id: 'ntn', title: 'NTN Certificate', description: 'National Tax Number registration via FBR IRIS portal',
    price: 4000, duration: '24 Hours', image: '/images/ntn-certificate.jpg',
    alt: 'Business NTN registration Pakistan FBR', href: '/business/ntn',
    requirements: ['CNIC copy', 'Mobile number', 'Email address'],
  },
  {
    id: 'filer', title: 'Business Filer Registration', description: 'Become an active tax filer for your business — appear on ATL',
    price: 20000, duration: '24–48 hours after document submission', image: '/images/bookkeeping.jpg',
    alt: 'Business filer registration Pakistan FBR Active Taxpayer List', href: '/business/filer',
    requirements: [
      'ID Card Picture', 'Email Address', 'Phone Number',
      'Bank Account Details if you have Bank Account',
      'Property Details if you own any property',
      'Vehicle details if you own any car or bike',
      'Salary person or Business owner',
    ],
  },
  {
    id: 'business-reg', title: 'Business Registration', description: 'Sole proprietorship or partnership registration with FBR and relevant authorities',
    price: 15000, duration: '1–3 working days', image: '/images/business-registration.jpg',
    alt: 'Business registration Pakistan sole proprietorship partnership', href: '/business/business-reg',
    requirements: [
      'Owner/partner CNICs', 'Phone Number', 'Email Address',
      'Business name', 'Business Address Proof', 'Business Principal Activity',
    ],
  },
  {
    id: 'company-reg', title: 'SECP Company Registration', description: 'Private limited company registration with SECP including all legal documentation',
    price: 50000, duration: '24–48 hours after document submission', image: '/images/company-registration.jpg',
    alt: 'SECP company registration Pakistan private limited', href: '/business/company-reg',
    requirements: [
      'Owner Details: Name, CNIC, Contact, Email, Share holder',
      'Company Details: Name, CNIC, Contact, Email',
      'Company Address', 'Company Category',
      'Director: Name, CNIC, Email, Contact, Share Holder',
    ],
  },
  {
    id: 'firm-reg', title: 'Firm Registration', description: 'Business firm registration with complete legal documentation',
    price: 50000, duration: '3–5 working days', image: '/images/firm-registration.jpg',
    alt: 'Firm registration Pakistan business', href: '/business/firm-reg',
    requirements: [
      'Owner Details: Name, CNIC, Contact, Email, Share holder',
      'Firm Details: Name', 'Company Address', 'Company Category',
      'Director: Name, CNIC, Email, Contact, Share Holder',
    ],
  },
  {
    id: 'trademark', title: 'Trademark Registration', description: 'Brand name and logo protection via IPO Pakistan trademark registration',
    price: 80000, duration: '24–48 hours after document submission', image: '/images/trademark.jpg',
    alt: 'Trademark registration Pakistan — IPO brand protection', href: '/business/trademark',
    requirements: [
      'Owner/partner CNICs', 'Phone Number', 'Email Address',
      'Business name', 'Business Address Proof', 'Business Principal Activity',
      'Person Signature', 'Business logo white background picture',
    ],
  },
  {
    id: 'import-export', title: 'Import / Export License', description: 'License for international trade — import and export from Pakistan',
    price: 40000, duration: '24–48 hours after document submission', image: '/images/import-export.jpg',
    alt: 'Import export license Pakistan international trade', href: '/business/import-export',
    requirements: [
      'ID card picture', 'Phone Number (registered on NTN)',
      'IRIS login credentials', 'Email ID (registered on NTN)',
    ],
  },
  {
    id: 'gst', title: 'GST Registration', description: 'Federal Goods and Services Tax registration with FBR for businesses',
    price: 40000, duration: '5–7 working days', image: '/images/gst.jpg',
    alt: 'GST registration business Pakistan FBR', href: '/business/gst',
    requirements: [
      'ID Card Picture', 'Phone Number', 'Email ID', 'Business Name', 'Business Address',
      'Business Principal Activity', 'Office Front Door picture',
      'Electricity bill & meter pic', 'Property/office agreement',
      'Bank maintenance Certificate (Business bank)',
    ],
  },
  {
    id: 'pra', title: 'PRA Registration', description: 'Punjab Revenue Authority registration for Punjab-based businesses',
    price: 40000, duration: '5–7 working days', image: '/images/pra-registration.png',
    alt: 'PRA registration business Pakistan Punjab Revenue Authority', href: '/business/pra',
    requirements: [
      'ID Card Picture', 'Phone Number', 'Email ID', 'Business Name', 'Business Address',
      'Business Principal Activity', 'Office Front Door picture',
      'Electricity bill & meter pic', 'Property/office agreement',
      'Bank maintenance Certificate (Business bank)',
    ],
  },
  {
    id: 'chamber', title: 'Chamber of Commerce', description: 'Chamber of Commerce membership registration',
    price: 30000, duration: '5–7 working days', image: '/images/chamber-commerce.jpg',
    alt: 'Chamber of Commerce registration Pakistan', href: '/business/chamber',
    requirements: [
      'ID Card Picture', 'Phone Number', 'Email ID', 'Business Name', 'Business Address',
      'Business Principal Activity', 'Person Signature',
      'White Background Picture', '2 years Tax Returns Copy',
    ],
  },
  {
    id: 'dnfbp', title: 'DNFBP Registration', description: 'Designated Non-Financial Business and Professions registration',
    price: 15000, duration: '4–5 working days', image: '/images/dnfbp.png',
    alt: 'DNFBP registration Pakistan', href: '/business/dnfbp',
    requirements: [
      'ID Card Picture', 'Phone Number', 'Email ID', 'Business Name', 'Business Address',
      'Business Principal Activity', 'Police Character Certificate',
      'Property/office agreement', 'Bank maintenance Certificate (Business bank)',
    ],
  },
  {
    id: 'accounting', title: 'Accounting & Financial Reporting', description: 'Professional accounting and financial reporting services from certified accountants',
    price: 50000, duration: '4–5 working days', image: '/images/accounting-finance.jpg',
    alt: 'Accounting financial reporting services Pakistan', href: '/business/accounting',
    requirements: [
      'Previous Tax Return', 'Previous Financials',
      'Current Year All Bank Statement', 'All General Ledger',
      'Capital detail ledger', 'Stock detail',
      'Administration detail ledger', 'HR detail ledger',
      'Shareholder detail / paid up capital detail',
    ],
  },
  {
    id: 'bookkeeping', title: 'Bookkeeping Service', description: 'Professional bookkeeping and accounts management services for businesses',
    price: 20000, duration: '4–5 working days', image: '/images/bookkeeping.jpg',
    alt: 'Bookkeeping services Pakistan small business', href: '/business/bookkeeping',
    requirements: ['No documents required — contact us to discuss your needs'],
  },
  {
    id: 'stock', title: 'Stock Report', description: 'Detailed stock reporting and inventory analysis for FBR compliance',
    price: 20000, duration: '2–5 working days', image: '/images/stock-report.jpg',
    alt: 'Stock report Pakistan FBR inventory', href: '/business/stock',
    requirements: ['Provide sale and purchase data'],
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