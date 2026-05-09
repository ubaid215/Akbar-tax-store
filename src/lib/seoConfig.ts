// src/lib/seoConfig.ts
// Single source of truth for page-level SEO metadata.
// Import in each page's generateMetadata() to guarantee unique titles/descriptions.

const BASE_URL = 'https://www.akbartaxstore.com';

interface PageSEO {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
  keywords: string[];
  canonicalUrl: string;
}

export const SEO_CONFIG: Record<string, PageSEO> = {
  '/': {
    title: 'FBR Tax Filing & NTN Registration | Akbar Tax Store Pakistan',
    description:
      'Professional FBR tax filing, NTN registration & SECP company registration in Pakistan. 500+ clients. Become an active filer in 24 hours. Free consultation.',
    ogTitle: 'FBR Tax Filing & NTN Registration | Akbar Tax Store Pakistan',
    ogDescription:
      'Professional FBR tax filing, NTN registration & SECP company registration in Pakistan. 500+ clients. Become an active filer in 24 hours.',
    twitterTitle: 'FBR Tax Filing & NTN Registration | Akbar Tax Store Pakistan',
    twitterDescription:
      'Expert FBR tax filing, NTN registration, and SECP company registration. 500+ clients. Results in 24 hours. Serving all of Pakistan online.',
    keywords: [
      'FBR tax filing Pakistan',
      'NTN registration Pakistan',
      'SECP company registration',
      'income tax return Pakistan',
      'tax consultant Faisalabad',
      'become filer Pakistan 2026',
      'FBR tax return 2026',
      'active taxpayer list Pakistan',
      'tax consultant Pakistan online',
      'FBR IRIS registration',
    ],
    canonicalUrl: BASE_URL,
  },

  '/services-fees': {
    title: 'Tax Services & Fees Pakistan 2026 | Akbar Tax Store',
    description:
      'Transparent pricing: NTN PKR 4,000 | Tax Return PKR 5,000 | SECP Company PKR 50,000 | Trademark PKR 80,000. No hidden fees. All FBR services online.',
    ogTitle: 'Tax Services & Fees Pakistan 2026 | Akbar Tax Store',
    ogDescription:
      'Transparent FBR tax and business registration fees in Pakistan. NTN from PKR 4,000. SECP company PKR 50,000. No hidden charges.',
    twitterTitle: 'Tax Services & Fees 2026 | Akbar Tax Store Pakistan',
    twitterDescription:
      'Transparent pricing for all FBR tax services. NTN PKR 4,000 | Tax Return PKR 5,000 | SECP PKR 50,000. No hidden fees.',
    keywords: [
      'tax services fees Pakistan 2026',
      'NTN registration fee Pakistan',
      'FBR tax return filing cost',
      'SECP company registration fee',
      'GST registration fee Pakistan',
      'trademark registration cost Pakistan',
      'FBR services pricing',
      'tax consultant fees Faisalabad',
    ],
    canonicalUrl: `${BASE_URL}/services-fees`,
  },

  '/about': {
    title: 'About Akbar Tax Store | Tax Consultants Faisalabad',
    description:
      'Akbar Tax Store — 500+ clients, 5+ years, expert FBR tax consultants in Faisalabad. Serving Lahore, Karachi, Islamabad & all Pakistan online.',
    ogTitle: 'About Akbar Tax Store | Expert Tax Consultants in Pakistan',
    ogDescription:
      'Meet Akbar Tax Store — 500+ clients served, 5+ years of FBR expertise. Based in Faisalabad, serving all of Pakistan online.',
    twitterTitle: 'About Us | Tax Consultants Faisalabad | Akbar Tax Store',
    twitterDescription:
      'Akbar Tax Store — trusted FBR tax consultants in Faisalabad with 500+ clients and 5+ years experience. Serving all Pakistan.',
    keywords: [
      'about Akbar Tax Store',
      'tax consultant Faisalabad',
      'FBR tax expert Pakistan',
      'trusted tax advisor Pakistan',
      'NTN registration expert Faisalabad',
      'tax consultant 5 years experience',
      'FBR certified tax consultant',
      'Pakistan tax advisory firm',
    ],
    canonicalUrl: `${BASE_URL}/about`,
  },

  '/contact': {
    title: 'Contact Akbar Tax Store | WhatsApp 0301-6832064',
    description:
      'Free tax consultation. WhatsApp us at 0301-6832064. NTN registration, FBR tax filing & SECP company registration in Pakistan. Fast 24-hour service.',
    ogTitle: 'Contact Akbar Tax Store | Free Tax Consultation Pakistan',
    ogDescription:
      'Get a free tax consultation. WhatsApp 0301-6832064. NTN registration, FBR tax filing, and SECP registration in 24 hours.',
    twitterTitle: 'Contact Akbar Tax Store | WhatsApp 0301-6832064',
    twitterDescription:
      'Contact us for free tax consultation. WhatsApp 0301-6832064. NTN, FBR tax filing, SECP registration in 24 hours across Pakistan.',
    keywords: [
      'contact Akbar Tax Store',
      'tax consultant WhatsApp Pakistan',
      'free tax consultation Pakistan',
      'FBR tax help Pakistan',
      'NTN registration WhatsApp',
      'tax consultant contact Faisalabad',
      'online tax help Pakistan',
      'FBR registration help 2026',
    ],
    canonicalUrl: `${BASE_URL}/contact`,
  },

  '/calculators/income-tax-pakistan': {
    title: 'Pakistan Income Tax Calculator 2025-26 | FBR Salary Tax',
    description:
      'Free Pakistan income tax calculator. Updated FBR Finance Act 2025 slabs. Instant salary tax, take-home pay & slab breakdown. Salaried & business income.',
    ogTitle: 'Pakistan Income Tax Calculator 2025-26 | FBR Tax Slabs',
    ogDescription:
      'Free income tax calculator for Pakistan. FBR 2025-26 slabs, instant salary tax and take-home pay calculation. Salaried and business income.',
    twitterTitle: 'Pakistan Income Tax Calculator 2025-26 | FBR Salary Tax',
    twitterDescription:
      'Calculate your Pakistan income tax instantly. Updated FBR 2025-26 slabs. Salary tax, take-home pay & full slab breakdown.',
    keywords: [
      'income tax calculator Pakistan',
      'FBR tax calculator 2025-26',
      'salary tax Pakistan calculator',
      'income tax slabs Pakistan 2025',
      'Pakistan tax calculator',
      'FBR salary tax 2026',
      'how much tax do I pay Pakistan',
      'income tax calculation Pakistan 2026',
    ],
    canonicalUrl: `${BASE_URL}/calculators/income-tax-pakistan`,
  },

  '/calculators/filer-vs-non-filer': {
    title: 'Filer vs Non-Filer Savings Calculator Pakistan 2025',
    description:
      'See exactly how much tax you save as a filer. Property, bank & vehicle tax comparison. Finance Act 2025 rates. Become a filer in 24 hours with Akbar Tax Store.',
    ogTitle: 'Filer vs Non-Filer Tax Savings Calculator Pakistan 2025',
    ogDescription:
      'Calculate your exact tax savings as a filer vs non-filer in Pakistan. Property, bank, and vehicle tax comparison using Finance Act 2025 rates.',
    twitterTitle: 'Filer vs Non-Filer Savings Calculator Pakistan 2025',
    twitterDescription:
      'See how much you save as an FBR tax filer. Property, bank & vehicle WHT comparison. Finance Act 2025 rates.',
    keywords: [
      'filer vs non filer Pakistan',
      'FBR active taxpayer benefits',
      'non filer penalty Pakistan 2025',
      'tax savings as filer Pakistan',
      'withholding tax filer vs non filer',
      'ATL benefits Pakistan',
      'filer tax rates Pakistan 2026',
      'become filer save tax Pakistan',
    ],
    canonicalUrl: `${BASE_URL}/calculators/filer-vs-non-filer`,
  },

  '/calculators/gst-calculator-pakistan': {
    title: 'GST Calculator Pakistan 2025-26 | 18% Sales Tax | FBR',
    description:
      'Free Pakistan GST calculator. Federal 18% & provincial rates (PRA 16%, SRB 15%). Tax inclusive & exclusive. For goods, services & digital transactions.',
    ogTitle: 'Pakistan GST Calculator 2025-26 | FBR Sales Tax',
    ogDescription:
      'Free GST calculator for Pakistan. Federal 18%, PRA 16%, SRB 15% rates. Tax inclusive and exclusive calculations for goods and services.',
    twitterTitle: 'GST Calculator Pakistan 2025-26 | 18% FBR Sales Tax',
    twitterDescription:
      'Calculate GST in Pakistan instantly. Federal 18%, PRA 16%, SRB 15% rates. Tax inclusive and exclusive modes.',
    keywords: [
      'GST calculator Pakistan',
      'Pakistan GST calculator 2025',
      'FBR sales tax calculator',
      'general sales tax Pakistan 18%',
      'PRA calculator Punjab',
      'GST tax inclusive exclusive Pakistan',
      'sales tax calculation Pakistan 2026',
      'GST registration Pakistan',
    ],
    canonicalUrl: `${BASE_URL}/calculators/gst-calculator-pakistan`,
  },

  '/calculators/withholding-tax-pakistan': {
    title: 'Withholding Tax Calculator Pakistan 2025 | FBR WHT Rates',
    description:
      'Calculate Pakistan withholding tax for filers and non-filers. All 2025-26 WHT rates: salary, property, bank, services, dividends. Finance Act 2025.',
    ogTitle: 'Pakistan Withholding Tax Calculator 2025 | FBR WHT',
    ogDescription:
      'Free WHT calculator for Pakistan. All 2025-26 withholding tax rates for filers and non-filers — salary, property, bank, services, dividends.',
    twitterTitle: 'Withholding Tax Calculator Pakistan 2025 | FBR WHT',
    twitterDescription:
      'Calculate Pakistan withholding tax for filers vs non-filers. All 2025-26 WHT categories. Finance Act 2025.',
    keywords: [
      'withholding tax calculator Pakistan',
      'Pakistan WHT rates 2025',
      'FBR withholding tax 2026',
      'property withholding tax Pakistan',
      'bank withholding tax Pakistan',
      'withholding tax filer non-filer',
      'WHT rates Finance Act 2025',
      'property tax calculator Pakistan',
    ],
    canonicalUrl: `${BASE_URL}/calculators/withholding-tax-pakistan`,
  },

  '/calculators/freelancer-tax-pakistan': {
    title: 'Freelancer Tax Calculator Pakistan 2025 | PSEB vs Non-PSEB',
    description:
      'Free freelancer income tax calculator for Pakistan. PSEB 0.25% vs normal slabs. Upwork, Fiverr income in USD. FBR Finance Act 2025 rates.',
    ogTitle: 'Pakistan Freelancer Tax Calculator 2025 | PSEB Rate',
    ogDescription:
      'Calculate your Pakistan freelancer income tax. PSEB 0.25% flat vs normal income tax slabs. Upwork, Fiverr, USD income. FBR 2025-26.',
    twitterTitle: 'Freelancer Tax Calculator Pakistan 2025 | PSEB vs Normal',
    twitterDescription:
      'Free freelancer tax calculator for Pakistan. PSEB 0.25% vs standard slabs. Upwork, Fiverr income in USD. FBR 2025-26.',
    keywords: [
      'freelancer tax calculator Pakistan',
      'PSEB tax rate Pakistan',
      'freelancer income tax Pakistan 2025',
      'Upwork tax Pakistan',
      'Fiverr tax Pakistan',
      'online earning tax Pakistan',
      'freelancer PSEB 0.25 percent',
      'freelancer FBR tax return Pakistan',
    ],
    canonicalUrl: `${BASE_URL}/calculators/freelancer-tax-pakistan`,
  },

  '/calculators/should-i-file-quiz': {
    title: 'Should I File Tax Return in Pakistan? | Free Quiz 2026',
    description:
      'Answer 5 quick questions to find out if you should file an FBR tax return in Pakistan. Free, instant, no registration. Based on Finance Act 2025 rules.',
    ogTitle: 'Should I File a Tax Return in Pakistan? | Free Quiz',
    ogDescription:
      'Quick quiz to determine if you need to file an FBR tax return in Pakistan. 5 questions, instant result, based on 2025-26 rules.',
    twitterTitle: 'Should I File Tax Return Pakistan? | Free 2026 Quiz',
    twitterDescription:
      'Find out in 5 questions if you need to file an FBR tax return in Pakistan. Instant result, no registration required.',
    keywords: [
      'should I file tax return Pakistan',
      'do I need to file FBR return',
      'tax filing requirement Pakistan',
      'FBR return mandatory Pakistan',
      'who needs to file tax return Pakistan',
      'FBR income threshold Pakistan',
      'tax filer quiz Pakistan 2026',
      'FBR filing obligation Pakistan',
    ],
    canonicalUrl: `${BASE_URL}/calculators/should-i-file-quiz`,
  },

  '/personal/ntn': {
    title: 'NTN Registration Pakistan — PKR 4,000 | 24 Hours',
    description:
      'Get your National Tax Number (NTN) in 24 hours for PKR 4,000. 100% online via FBR IRIS portal. 500+ clients registered. Free consultation available.',
    ogTitle: 'NTN Registration Pakistan | PKR 4,000 | 24-Hour Service',
    ogDescription:
      'Get your NTN (National Tax Number) registered in 24 hours for PKR 4,000. Online via FBR IRIS. 500+ clients. Free consultation.',
    twitterTitle: 'NTN Registration Pakistan — PKR 4,000 | Akbar Tax Store',
    twitterDescription:
      'NTN registration in 24 hours. PKR 4,000. 100% online. 500+ clients registered. FBR IRIS portal submission handled.',
    keywords: [
      'NTN registration Pakistan',
      'National Tax Number Pakistan',
      'NTN certificate FBR',
      'NTN registration fee Pakistan',
      'how to get NTN Pakistan',
      'NTN registration online Pakistan',
      'FBR NTN registration 2026',
      'NTN registration Faisalabad',
    ],
    canonicalUrl: `${BASE_URL}/personal/ntn`,
  },

  '/personal/tax-return': {
    title: 'FBR Income Tax Return Filing | PKR 5,000 | 24–48 Hours',
    description:
      'Professional FBR income tax return filing from PKR 5,000. Salaried, freelancer & business returns. Submit via WhatsApp. Active filer status in 48 hours.',
    ogTitle: 'FBR Tax Return Filing Pakistan | PKR 5,000 | 24–48 Hours',
    ogDescription:
      'Professional FBR income tax return filing from PKR 5,000. Salaried and freelancer returns. WhatsApp submission. Active filer in 48 hours.',
    twitterTitle: 'FBR Income Tax Return Filing | PKR 5,000 | Akbar Tax Store',
    twitterDescription:
      'FBR income tax return filing from PKR 5,000. 24–48 hour turnaround. Salaried, freelancer & business. Submit via WhatsApp.',
    keywords: [
      'FBR tax return filing Pakistan',
      'income tax return Pakistan 2026',
      'tax return filing service Pakistan',
      'FBR IRIS return filing',
      'salaried tax return Pakistan',
      'freelancer tax return Pakistan',
      'income tax return filing fee',
      'FBR return deadline 2026',
    ],
    canonicalUrl: `${BASE_URL}/personal/tax-return`,
  },

  '/business/company-reg': {
    title: 'SECP Company Registration Pakistan | PKR 50,000',
    description:
      'Register your private limited company with SECP for PKR 50,000. Includes Memorandum, Articles, digital signature & Certificate of Incorporation. Online.',
    ogTitle: 'SECP Company Registration Pakistan | Private Limited | PKR 50,000',
    ogDescription:
      'SECP private limited company registration for PKR 50,000. MOA, AOA, digital signature, Certificate of Incorporation. 100% online.',
    twitterTitle: 'SECP Company Registration Pakistan | PKR 50,000',
    twitterDescription:
      'Register your company with SECP for PKR 50,000. Includes all documentation and Certificate of Incorporation. Online service.',
    keywords: [
      'SECP company registration Pakistan',
      'private limited company Pakistan',
      'company registration SECP online',
      'Certificate of Incorporation Pakistan',
      'SECP registration fee Pakistan',
      'how to register company Pakistan',
      'SECP eServices Pakistan',
      'company registration Faisalabad',
    ],
    canonicalUrl: `${BASE_URL}/business/company-reg`,
  },

  '/guides/how-to-become-filer-pakistan': {
    title: 'How to Become a Tax Filer in Pakistan 2026 | FBR Guide',
    description:
      'Step-by-step guide to becoming an active FBR tax filer in Pakistan 2026. NTN registration, IRIS portal, ATL list, deadlines & benefits explained.',
    ogTitle: 'How to Become a Tax Filer in Pakistan 2026 | FBR Step-by-Step',
    ogDescription:
      'Complete guide to becoming an active FBR tax filer in Pakistan. NTN registration, IRIS portal, ATL list, and deadlines for 2026.',
    twitterTitle: 'How to Become a Tax Filer Pakistan 2026 | FBR Guide',
    twitterDescription:
      'Step-by-step guide: become an FBR active filer in Pakistan 2026. NTN, IRIS portal, ATL list, deadlines and benefits.',
    keywords: [
      'how to become filer Pakistan',
      'become active taxpayer Pakistan',
      'FBR filer registration 2026',
      'Active Taxpayer List Pakistan',
      'ATL registration Pakistan',
      'how to file income tax Pakistan',
      'FBR IRIS registration guide',
      'how to become filer Faisalabad',
    ],
    canonicalUrl: `${BASE_URL}/guides/how-to-become-filer-pakistan`,
  },

  '/guides/fbr-tax-return-deadline-2026': {
    title: 'FBR Tax Return Deadline 2026 | September 30 | Pakistan',
    description:
      'FBR income tax return deadline is September 30, 2026 for individuals. Late filing penalties, extension rules & how to file on time in Pakistan.',
    ogTitle: 'FBR Tax Return Deadline 2026 | September 30 Pakistan',
    ogDescription:
      'FBR income tax return deadline is September 30, 2026. Learn about late filing penalties, extension rules, and how to file on time.',
    twitterTitle: 'FBR Tax Return Deadline 2026 | September 30 | Pakistan',
    twitterDescription:
      'FBR deadline: September 30, 2026. Learn about late filing penalties and how to file your income tax return on time in Pakistan.',
    keywords: [
      'FBR tax return deadline 2026',
      'income tax return deadline Pakistan',
      'FBR filing deadline September 2026',
      'late tax return penalty Pakistan',
      'FBR extension deadline 2026',
      'income tax return last date Pakistan',
      'FBR penalty for late filing',
      'tax year 2026 Pakistan deadline',
    ],
    canonicalUrl: `${BASE_URL}/guides/fbr-tax-return-deadline-2026`,
  },

  '/guides/filer-vs-non-filer-benefits': {
    title: 'Filer vs Non-Filer Benefits Pakistan 2025 | Tax Savings Guide',
    description:
      'Complete comparison of filer vs non-filer tax rates in Pakistan 2025. Bank, property, vehicle WHT differences. Finance Act 2025. Save more as a filer.',
    ogTitle: 'Filer vs Non-Filer Benefits Pakistan 2025 | Full Comparison',
    ogDescription:
      'Detailed comparison of tax benefits for filers vs non-filers in Pakistan. Bank, property, vehicle withholding tax differences. Finance Act 2025.',
    twitterTitle: 'Filer vs Non-Filer Benefits Pakistan 2025 | Tax Guide',
    twitterDescription:
      'Full comparison: filer vs non-filer tax rates in Pakistan 2025. See bank, property & vehicle WHT differences.',
    keywords: [
      'filer vs non filer Pakistan benefits',
      'FBR active taxpayer advantages',
      'non filer tax penalty Pakistan',
      'filer lower withholding tax Pakistan',
      'tax benefits filer Pakistan 2025',
      'ATL benefits Pakistan 2026',
      'non filer rate Pakistan 2025',
      'FBR active taxpayer list check',
    ],
    canonicalUrl: `${BASE_URL}/guides/filer-vs-non-filer-benefits`,
  },

  '/guides/how-to-get-ntn-pakistan': {
    title: 'How to Get NTN in Pakistan 2026 | FBR IRIS Guide',
    description:
      'Complete step-by-step guide to getting your NTN (National Tax Number) in Pakistan via FBR IRIS portal in 2026. Documents required, process, and costs.',
    ogTitle: 'How to Get NTN in Pakistan 2026 | Step-by-Step FBR Guide',
    ogDescription:
      'Complete guide to getting your NTN in Pakistan via FBR IRIS. Documents required, registration steps, costs, and timeline explained.',
    twitterTitle: 'How to Get NTN in Pakistan 2026 | FBR IRIS Guide',
    twitterDescription:
      'Step-by-step guide: get your National Tax Number (NTN) via FBR IRIS portal in Pakistan. Documents, steps, costs.',
    keywords: [
      'how to get NTN in Pakistan',
      'NTN registration process Pakistan',
      'FBR IRIS NTN registration',
      'get NTN online Pakistan 2026',
      'NTN documents required Pakistan',
      'National Tax Number process Pakistan',
      'NTN registration fee Pakistan',
      'FBR NTN certificate Pakistan',
    ],
    canonicalUrl: `${BASE_URL}/guides/how-to-get-ntn-pakistan`,
  },
};

export function getPageSEO(path: string): PageSEO | undefined {
  return SEO_CONFIG[path];
}
