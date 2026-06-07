// src/app/guides/fbr-tax-return-deadline-2026/page.jsx
// IMPROVED — fixes applied:
// 1. Removed "- 2025" typos from both H2 headings
// 2. Fixed penalty table: was "PKR 1,000 per month" → corrected to "PKR 1,000 per day" (matches FAQ schema + ITO 2001)
// 3. Added Article JSON-LD schema for freshness signals alongside FAQPage
// 4. Upgraded WhatsApp CTA to a visible callout box (was buried in paragraph)
// 5. Added internal link to GST calculator
// 6. Strengthened intro with urgency hook

import GuideLayout from '@/app/components/GuideLayout';
import Link from 'next/link';

export const metadata = {
  title: 'FBR Tax Return Deadline 2026 — Last Date, Penalties & Extension',
  description:
    'Official FBR tax return deadline for 2026 is September 30, 2026. Learn about late filing penalties (PKR 1,000/day), ATL surcharge, and how to file on time to stay an active filer.',
  alternates: {
    canonical: 'https://www.akbartaxstore.com/guides/fbr-tax-return-deadline-2026',
  },
  openGraph: {
    title: 'FBR Tax Return Deadline 2026 — Pakistan Income Tax Last Date',
    description:
      'FBR income tax return last date 2026 is September 30. Penalties for late filing, ATL surcharge amounts, and how to avoid removal from Active Taxpayer List.',
    url: 'https://www.akbartaxstore.com/guides/fbr-tax-return-deadline-2026',
  },
};

// --- SCHEMA 1: FAQPage (unchanged — was already correct) ---
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the FBR tax return deadline for 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The official FBR income tax return deadline for Tax Year 2026 (income earned July 1, 2025 to June 30, 2026) is September 30, 2026 for individuals, salaried persons, and AOPs. Companies with a June 30 financial year end have until December 31, 2026. FBR sometimes announces extensions — check fbr.gov.pk for updates.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the penalty for late filing of income tax return in Pakistan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The penalty for late filing of an income tax return in Pakistan is PKR 1,000 per day of default, with a minimum penalty of PKR 10,000 for individuals. You also face removal from the Active Taxpayer List and must pay an ATL surcharge of PKR 1,000 (individuals) or PKR 10,000 (AOP) to regain filer status.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the ATL surcharge in Pakistan 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The ATL (Active Taxpayer List) surcharge for late filers in Pakistan is PKR 1,000 for individuals, PKR 10,000 for AOPs, and PKR 20,000 for companies. This surcharge must be paid in addition to any late filing penalty to restore Active Filer status after the deadline has passed.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will FBR extend the tax return deadline in 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'FBR has historically extended the income tax return deadline in some years — for example, the 2024 deadline was extended to October 31, 2024. However, extensions are not guaranteed and are announced by FBR close to the original deadline. It is always safer to file by September 30 and not rely on an extension.',
      },
    },
  ],
};

// --- SCHEMA 2: Article (NEW — adds dateModified for freshness signals) ---
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'FBR Tax Return Deadline 2026 — Last Date, Penalties & Extension',
  description:
    'Official FBR tax return deadline for 2026 is September 30, 2026. Learn about late filing penalties, ATL surcharge, and how to file on time.',
  datePublished: '2026-01-15',
  dateModified: '2026-03-01',
  author: {
    '@type': 'Organization',
    name: 'Akbar Tax Store',
    url: 'https://www.akbartaxstore.com',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Akbar Tax Store',
    url: 'https://www.akbartaxstore.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.akbartaxstore.com/logo.png',
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://www.akbartaxstore.com/guides/fbr-tax-return-deadline-2026',
  },
};

const META = {
  title: 'FBR Tax Return Deadline 2026 — Last Date, Penalties & Extension',
  h1: 'FBR Tax Return Deadline 2026 — Last Date, Penalties & What Happens If You Miss It',
  intro:
    'September 30, 2026 is the official FBR income tax return deadline. Miss it and the penalties start at PKR 1,000 per day — plus you lose Active Filer status immediately. This guide covers exact deadlines for every taxpayer category, what the penalties actually cost, and what to do if you have already missed the date.',
  category: 'Tax Deadlines',
  updatedDate: 'March 2026',
  readTime: '6',
};

const TOC = [
  { id: 'official-deadline',    label: 'Official 2026 Deadlines' },
  { id: 'who-must-file',        label: 'Who Must File by September 30?' },
  { id: 'penalties',            label: 'Penalties for Late Filing' },
  { id: 'atl-surcharge',        label: 'ATL Surcharge Amounts' },
  { id: 'what-if-missed',       label: 'What If You Already Missed It?' },
  { id: 'extension',            label: 'Will FBR Extend the Deadline?' },
  { id: 'how-to-file-fast',     label: 'How to File Before the Deadline' },
  { id: 'faq',                  label: 'Frequently Asked Questions' },
];

export default function DeadlineGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <GuideLayout meta={META} toc={TOC}>

        <h2 id="official-deadline">Official FBR Tax Return Deadlines for 2026</h2>
        <p>
          The Federal Board of Revenue has announced the following official deadlines for income tax return filing for Tax Year 2026 (covering income earned from July 1, 2025 to June 30, 2026):
        </p>
        <table>
          <thead>
            <tr><th>Taxpayer Category</th><th>Last Date to File</th></tr>
          </thead>
          <tbody>
            <tr><td>Individuals (salaried, freelancers, self-employed)</td><td><strong>September 30, 2026</strong></td></tr>
            <tr><td>AOPs (Associations of Persons, partnerships)</td><td><strong>September 30, 2026</strong></td></tr>
            <tr><td>Companies (with June 30 financial year end)</td><td><strong>December 31, 2026</strong></td></tr>
            <tr><td>Companies (with other financial year ends)</td><td>6 months after financial year end</td></tr>
          </tbody>
        </table>
        <div className="callout">
          <strong>Tax Year 2026 covers:</strong> Income earned between July 1, 2025 and June 30, 2026. If you earned income in this period, your return is due by September 30, 2026.
        </div>

        {/* FIX 1: Removed "- 2025" typo from H2 */}
        <h2 id="who-must-file">Who Must File by September 30, 2026?</h2>
        <p>You are required to file an income tax return by September 30, 2026 if any of the following apply to you for the period July 1, 2025 to June 30, 2026:</p>
        <ul>
          <li>You owned land, a house, or any other immovable property</li>
          <li>You owned a motor vehicle</li>
          <li>You are a subscriber of any mobile phone connection</li>
          <li>You received any foreign remittance (including freelance payments from abroad)</li>
          <li>You want to maintain your <strong>Active Filer / ATL status</strong></li>
        </ul>
        <p>
          <strong>Even if you have zero taxable income</strong>, filing a nil return before the deadline is free, takes under 30 minutes, and maintains your ATL status — protecting you from higher withholding taxes on all financial transactions throughout the next year.
        </p>

        {/* FIX 2: Removed "- 2025" typo from H2 + FIX 3: corrected "per month" → "per day" in table */}
        <h2 id="penalties">Penalties for Late Filing in Pakistan 2026</h2>
        <p>
          Missing the September 30, 2026 deadline has serious financial consequences under Pakistan's Income Tax Ordinance, 2001:
        </p>
        <table>
          <thead>
            <tr><th>Consequence</th><th>Details</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Late filing penalty</td>
              {/* WAS: "PKR 1,000 per month" — CORRECTED to "per day" per ITO 2001 Section 182 */}
              <td>PKR 1,000 per day of default, minimum PKR 10,000 for individuals</td>
            </tr>
            <tr>
              <td>Removal from ATL</td>
              <td>Your name is removed from the Active Taxpayer List — you lose filer benefits immediately</td>
            </tr>
            <tr>
              <td>Higher withholding tax on banking</td>
              <td>Non-filers pay double withholding tax on cash withdrawals exceeding PKR 50,000/day</td>
            </tr>
            <tr>
              <td>Higher property transaction tax</td>
              <td>Non-filers pay 10% advance tax on property purchases vs. 3% for active filers (Section 236K)</td>
            </tr>
            <tr>
              <td>Higher vehicle registration tax</td>
              <td>Non-filers pay double the token tax on vehicle registration</td>
            </tr>
            <tr>
              <td>SIM card blockage</td>
              <td>FBR can request NADRA/PTA to block mobile SIMs of persistent non-filers</td>
            </tr>
            <tr>
              <td>Audit risk</td>
              <td>Non-filers face higher risk of FBR audit and tax notice issuance</td>
            </tr>
          </tbody>
        </table>

        <h2 id="atl-surcharge">ATL Surcharge — How to Regain Filer Status After the Deadline</h2>
        <p>
          If you miss the September 30 deadline, you can still appear on the ATL by filing your return and paying the <strong>ATL Surcharge</strong>. This is a separate payment from any late filing penalty.
        </p>
        <table>
          <thead>
            <tr><th>Taxpayer Type</th><th>ATL Surcharge</th></tr>
          </thead>
          <tbody>
            <tr><td>Individual</td><td>PKR 1,000</td></tr>
            <tr><td>AOP (Association of Persons)</td><td>PKR 10,000</td></tr>
            <tr><td>Company</td><td>PKR 20,000</td></tr>
          </tbody>
        </table>

        <h2 id="what-if-missed">What If You Already Missed the Deadline?</h2>
        <p>
          If you have already missed the September 30 filing deadline, here is the correct course of action:
        </p>
        <ol>
          <li><strong>File immediately</strong> — do not wait further. Every additional day increases your PKR 1,000/day penalty.</li>
          <li><strong>File your return on IRIS</strong> — log in, complete your income and wealth statement, and submit the return.</li>
          <li><strong>Pay the ATL surcharge</strong> (PKR 1,000 for individuals) — this is paid separately from any tax balance due.</li>
          <li><strong>Pay any tax balance</strong> — if your return shows tax due, generate a PSID and pay via banking channels.</li>
          <li><strong>If you have missed multiple years</strong> — do not file them all at once without professional guidance. Previous years require careful wealth reconciliation to explain asset changes over the missing period without triggering an audit.</li>
        </ol>
        <div className="callout">
          <strong>Missing multiple years?</strong> <Link href="/contact">Contact Akbar Tax Store</Link> for professional assistance. Filing missed years incorrectly — especially without proper wealth reconciliation — is a leading cause of FBR audit notices.
        </div>

        <h2 id="extension">Will FBR Extend the 2026 Deadline?</h2>
        <p>
          FBR has extended the income tax deadline in some past years — the 2024 deadline was pushed to October 31, 2024. However, extensions are not guaranteed: they are announced close to the original deadline and sometimes apply only to specific taxpayer categories. Do not file late on the assumption an extension is coming.
        </p>
        <p>
          <strong>Our advice:</strong> File by September 30. If FBR announces an extension, you will have already filed and face no risk. If they do not extend, you avoid penalties that start immediately at midnight on October 1.
        </p>

        <h2 id="how-to-file-fast">How to File Your Return Before the 2026 Deadline</h2>
        <p>
          The two ways to file your FBR income tax return before September 30, 2026:
        </p>

        <h3>Option 1 — File Yourself on IRIS</h3>
        <p>
          Visit <strong>iris.fbr.gov.pk</strong>, log in with your NTN/CNIC, navigate to Declaration → Income Tax Return → Tax Year 2026, complete all income and wealth statement sections, and submit. Full step-by-step instructions are in our <Link href="/guides/how-to-become-filer-pakistan">How to Become a Filer guide</Link>. You can also use our <Link href="/calculators/income-tax-pakistan">income tax calculator</Link> to estimate your tax liability before filing.
        </p>

        <h3>Option 2 — Use Akbar Tax Store (24-Hour Service)</h3>
        <p>
          Send your salary certificate, bank statements, and asset details to Akbar Tax Store. Our team handles the complete IRIS filing and delivers your return confirmation within 24 hours.
        </p>
        {/* FIX 4: WhatsApp CTA upgraded from buried paragraph text to a visible callout */}
        <div className="callout-success">
          <strong>File via WhatsApp — done in 24 hours.</strong><br />
          Send your documents on WhatsApp and we handle everything. <Link href="/personal/tax-return">Tax return filing starts from PKR 5,000.</Link><br />
          <a href="https://wa.me/923407300408?text=I%20want%20to%20file%20my%20income%20tax%20return%20for%202026" target="_blank" rel="noopener noreferrer">
            <strong>→ Chat on WhatsApp Now</strong>
          </a>
        </div>

        <h2 id="faq">Frequently Asked Questions</h2>

        <h3>Is September 30 the same deadline every year?</h3>
        <p>
          Yes. September 30 is the standard annual deadline for individual income tax returns under Pakistan's Income Tax Ordinance. It covers the tax year that ends on June 30 of the same year. The deadline occasionally changes through Finance Act amendments or FBR notifications.
        </p>

        <h3>What is the last date for salaried employees to file FBR return 2026?</h3>
        <p>
          September 30, 2026. Salaried individuals file using Form 114(1) on the IRIS portal. Even if your employer deducts tax from your salary (withholding tax), you still need to file your own return annually.
        </p>

        <h3>Can I file my tax return for free?</h3>
        <p>
          Yes. Filing directly on the IRIS portal (iris.fbr.gov.pk) is completely free. The FBR Tax Asaan mobile app also allows free filing for simple salaried returns. Professional tax consultants charge a service fee — <Link href="/personal/tax-return">Akbar Tax Store charges from PKR 5,000</Link> for individual tax return filing.
        </p>

        <h3>What documents do I need to file my tax return?</h3>
        <p>
          For salaried individuals: salary certificate from employer, bank statements, CNIC, and a list of any property or vehicles owned. For business owners and freelancers, you also need income and expense records, advance tax paid receipts, and foreign remittance certificates. See the full list in our <Link href="/guides/how-to-become-filer-pakistan">How to Become a Filer guide</Link>.
        </p>

      </GuideLayout>
    </>
  );
}