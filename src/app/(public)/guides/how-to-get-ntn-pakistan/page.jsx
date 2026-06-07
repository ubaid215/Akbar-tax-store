// src/app/guides/how-to-get-ntn-pakistan/page.jsx
// IMPROVED — fixes applied:
// 1. Fixed missing prose Steps 4, 5, 6 (Complete All Tabs, Upload Documents) — now match HowTo schema
// 2. Added "atl-surcharge" to TOC array (was in content but unreachable from TOC)
// 3. Added FAQPage JSON-LD schema (guide answers high-volume PAA questions but had none)
// 4. Fixed spacing: "companies,Businesses" → "companies, Businesses"
// 5. Added NTN service CTA callout (PKR 4,000) — transactional page was missing conversion point
// 6. Softened "Completed Tasks" language to be resilient to IRIS UI changes

import GuideLayout from '@/app/components/GuideLayout';
import Link from 'next/link';

export const metadata = {
  title: 'How to Get NTN in Pakistan (2026 Step-by-Step Guide)',
  description:
    'Complete guide on how to get your NTN (National Tax Number) in Pakistan via FBR IRIS portal. Documents required, step-by-step registration, and common mistakes to avoid.',
  alternates: {
    canonical: 'https://www.akbartaxstore.com/guides/how-to-get-ntn-pakistan',
  },
  openGraph: {
    title: 'How to Get NTN in Pakistan (2026 Step-by-Step Guide)',
    description:
      'Learn how to register for NTN on the FBR IRIS portal. Full document checklist, step-by-step instructions, and expert tips from Akbar Tax Store Faisalabad.',
    url: 'https://www.akbartaxstore.com/guides/how-to-get-ntn-pakistan',
  },
};

// --- SCHEMA 1: HowTo (kept from original — correct) ---
const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Get NTN in Pakistan via FBR IRIS Portal',
  description:
    'Step-by-step guide to register for a National Tax Number (NTN) in Pakistan using the FBR IRIS portal.',
  totalTime: 'PT30M',
  step: [
    { '@type': 'HowToStep', position: 1, name: 'Visit the FBR IRIS Portal', text: 'Go to iris.fbr.gov.pk and click on "Registration for Unregistered Person".' },
    { '@type': 'HowToStep', position: 2, name: 'Enter CNIC and Mobile Number', text: 'Select your citizen type, enter your 13-digit CNIC, name, and active mobile number. An OTP will be sent to your phone.' },
    { '@type': 'HowToStep', position: 3, name: 'Verify OTP and Set Password', text: 'Enter the OTP received on your phone. Create a strong password for your IRIS account.' },
    { '@type': 'HowToStep', position: 4, name: 'Open Form 181 from Drafts', text: 'Log into your IRIS account. Go to the Drafts section and open Form 181 — Application for Registration.' },
    { '@type': 'HowToStep', position: 5, name: 'Complete All Tabs', text: 'Fill in the Personal Tab (CNIC, contact, address), Property Tab (utility bill), Business Tab (if applicable), and Bank Account Tab (IBAN).' },
    { '@type': 'HowToStep', position: 6, name: 'Upload Documents', text: 'Upload scanned copies of your CNIC (front and back), utility bill, and any other required documents in JPG or PDF format.' },
    { '@type': 'HowToStep', position: 7, name: 'Submit and Download NTN Certificate', text: 'Click Submit. After FBR approval (usually 1–2 working days), log back in and download your NTN certificate from the IRIS dashboard.' },
  ],
};

// --- SCHEMA 2: FAQPage (NEW — unlocks PAA boxes for NTN queries) ---
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I get an NTN number in Pakistan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To get an NTN (National Tax Number) in Pakistan, visit iris.fbr.gov.pk, click "Registration for Unregistered Person", enter your CNIC and mobile number, verify via OTP, then complete Form 181 with your personal and bank details and upload your CNIC and utility bill. FBR approves registration within 1–2 working days.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is NTN registration free in Pakistan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, NTN registration on the FBR IRIS portal is completely free of charge. You only pay if you use a professional tax consultant to register on your behalf. Akbar Tax Store charges PKR 4,000 for assisted NTN registration.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between NTN and CNIC in Pakistan tax?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For salaried individuals and sole proprietors, the 13-digit CNIC number serves as the NTN. However, you must still register on the FBR IRIS portal to activate your tax profile. Companies and AOPs receive a unique 7-digit NTN issued by FBR upon e-enrollment — separate from any CNIC.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does NTN registration take in Pakistan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'NTN registration via the FBR IRIS portal typically takes 1–2 working days after you submit your application and documents. The online registration process itself takes approximately 20–30 minutes to complete.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I check my NTN number online in Pakistan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You can check your NTN and Active Taxpayer List status by visiting e.fbr.gov.pk/esbn/Verification.aspx and entering your CNIC or NTN. You can also send SMS "ATL [space] 13-digit CNIC" to 9966, or check via the FBR Tax Asaan mobile app.',
      },
    },
  ],
};

const META = {
  title: 'How to Get NTN in Pakistan (2026 Step-by-Step Guide)',
  h1: 'How to Get NTN in Pakistan (2026 Complete Guide)',
  intro:
    'A National Tax Number (NTN) is your official identity in Pakistan\'s tax system. This guide walks you through every step of FBR IRIS registration — documents required, the exact process, and how to avoid the mistakes that delay most applications.',
  category: 'Tax Registration',
  updatedDate: 'March 2026',
  readTime: '7',
};

// FIX 2: Added "atl-surcharge" to TOC — was present in content but missing here
const TOC = [
  { id: 'what-is-ntn',         label: 'What is an NTN?' },
  { id: 'who-needs-ntn',       label: 'Who Needs an NTN?' },
  { id: 'documents-required',  label: 'Documents Required' },
  { id: 'step-by-step',        label: 'Step-by-Step Registration' },
  { id: 'after-registration',  label: 'After Registration: Verify Your NTN' },
  { id: 'common-mistakes',     label: 'Common Mistakes to Avoid' },
  { id: 'atl-surcharge',       label: 'Late Filing & ATL Surcharge' },
  { id: 'faq',                 label: 'Frequently Asked Questions' },
];

export default function NTNGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      {/* FIX 3: Added FAQPage schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <GuideLayout meta={META} toc={TOC}>

        <h2 id="what-is-ntn">What is an NTN?</h2>
        <p>
          {/* FIX 4: "companies,Businesses" → "companies, businesses" (space + lowercase) */}
          A <strong>National Tax Number (NTN)</strong> is a unique identification number issued by Pakistan's Federal Board of Revenue (FBR) to individuals, companies, businesses, and Associations of Persons (AOPs). It is your official identity within Pakistan's tax system and is required for filing income tax returns, opening business bank accounts, and conducting most formal financial transactions.
        </p>
        <p>
          For salaried individuals and sole proprietors, <strong>your 13-digit CNIC number serves as your NTN</strong>. However, you must still register on the FBR IRIS portal to activate your tax profile and receive login credentials. For companies and AOPs, FBR issues a unique 7-digit NTN upon e-enrollment.
        </p>
        <div className="callout">
          <strong>Official FBR definition:</strong> An individual, company, or AOP is treated as registered when they are e-enrolled on the IRIS portal. E-enrollment provides you with an NTN (or Registration Number) and password, enabling access to all online income tax services.
        </div>

        <h2 id="who-needs-ntn">Who Needs an NTN?</h2>
        <p>You are legally required to obtain an NTN and register with FBR if:</p>
        <ul>
          <li>You are a business owner, freelancer, or self-employed professional</li>
          <li>You own immovable property, a vehicle, or investments</li>
          <li>You want to appear on the <strong>Active Taxpayer List (ATL)</strong> to benefit from lower withholding tax rates</li>
          <li>You need to open a business bank account</li>
          <li>You are registering a company with SECP</li>
          <li>You are applying for a business import/export licence</li>
        </ul>
        <p>
          Even if your income is below the taxable threshold, registering for an NTN is highly recommended. It costs nothing and allows you to conduct formal business, apply for loans, and avoid higher withholding taxes on banking and property transactions.
        </p>

        {/* FIX 5: NTN service CTA added — converts transactional intent visitors */}
        <div className="callout-success">
          <strong>Want us to handle it for you?</strong><br />
          Akbar Tax Store registers your NTN within 24 hours — you just send us your CNIC and utility bill on WhatsApp. <Link href="/personal/ntn-registration">NTN registration starts from PKR 4,000.</Link>
        </div>

        <h2 id="documents-required">Documents Required for NTN Registration</h2>

        <h3>For Individuals (Salaried / Freelancers)</h3>
        <ul>
          <li>CNIC (front and back) — scanned copy in JPG or PDF format</li>
          <li>Active mobile number registered in your name (for OTP verification)</li>
          <li>Active email address (for OTP verification)</li>
          <li>Proof of residence — utility bill (electricity, gas, or water) or rent agreement</li>
          <li>Salary slip or employer's NTN (for salaried individuals — optional but helpful)</li>
          <li>Bank IBAN and bank account details</li>
        </ul>

        <h3>For Businesses / Companies / AOPs</h3>
        <ul>
          <li>CNIC copies of all partners or directors</li>
          <li>Business registration certificate (from SECP or local authority)</li>
          <li>Memorandum and Articles of Association (for companies)</li>
          <li>Partnership deed (for firms/AOPs)</li>
          <li>Lease or ownership documents for business premises</li>
          <li>Bank account certificate showing IBAN</li>
          <li>Business letterhead and stamp (scanned image)</li>
          <li>NTN numbers of all partners (if existing)</li>
        </ul>
        <div className="callout-warning">
          <strong>Important:</strong> Ensure your mobile number is registered with NADRA against your CNIC and has not been previously used for another FBR registration. Using an unregistered or already-used number is one of the most common causes of registration failure.
        </div>

        <h2 id="step-by-step">Step-by-Step NTN Registration on FBR IRIS Portal</h2>

        <h3>Step 1 — Visit the FBR IRIS Portal</h3>
        <p>
          Open your browser and go to <strong>iris.fbr.gov.pk</strong>. On the login page, look for the option labelled <strong>"Registration for Unregistered Person"</strong> and click it.
        </p>

        <h3>Step 2 — Enter Your CNIC and Mobile Number</h3>
        <p>
          Select your citizen type (Resident Pakistani, Non-Resident, Foreign National). Enter your 13-digit CNIC number, your full name exactly as it appears on your CNIC, and your active mobile number. An OTP (One-Time Password) will be sent to your phone via SMS.
        </p>

        <h3>Step 3 — Verify OTP and Set Password</h3>
        <p>
          Enter the OTP within the time limit. You will be prompted to create a password for your IRIS account. Store this password safely — you will use it for all future FBR filings.
        </p>

        {/* FIX 1: Steps 4, 5, 6 were missing from prose — added to match HowTo schema */}
        <h3>Step 4 — Open Form 181 from Drafts</h3>
        <p>
          Log into your IRIS account with the credentials you just created. Navigate to the <strong>Drafts</strong> section and open <strong>Form 181 — Application for Registration</strong>. This is the main registration form where you will enter all your details.
        </p>

        <h3>Step 5 — Complete All Tabs</h3>
        <p>
          Form 181 has multiple tabs. Complete each one carefully:
        </p>
        <ul>
          <li><strong>Personal Tab:</strong> CNIC details, date of birth, contact number, email, and residential address</li>
          <li><strong>Property Tab:</strong> Enter the address from your utility bill to confirm your residence</li>
          <li><strong>Business Tab:</strong> Fill in only if you have a business. Leave blank if you are a salaried individual or freelancer</li>
          <li><strong>Bank Account Tab:</strong> Enter your IBAN. At least one bank account is required</li>
        </ul>

        <h3>Step 6 — Upload Documents</h3>
        <p>
          In the documents section, upload scanned copies of your CNIC (front and back) and your utility bill. Files must be in JPG or PDF format. Ensure all four corners of the CNIC are visible and the image is not blurry — unclear scans are a leading cause of application rejection.
        </p>

        <h3>Step 7 — Submit and Download Your NTN Certificate</h3>
        <p>
          Review all tabs carefully. Once you click <strong>Submit</strong>, you cannot make further changes. After submission, FBR typically approves registration within <strong>1–2 working days</strong>. You will receive a confirmation email. Log back in after approval to download your NTN certificate from the IRIS dashboard.
        </p>

        {/* FIX 6: Softened "Completed Tasks" language to be resilient to IRIS UI changes */}
        <div className="callout-success">
          <strong>After your registration is approved:</strong> Log back into IRIS and check for any pending tasks or notifications from FBR. You may need to acknowledge an "Order to grant registration" notice before you can file your first income tax return. Without completing this step, you may encounter a "Task Not Enabled" error during filing. If you are unsure, <Link href="/contact">contact us for guidance</Link>.
        </div>

        <h2 id="after-registration">After Registration: Verify Your NTN is Active</h2>
        <p>
          Once registered, verify that your NTN is active and your name appears on the <strong>Active Taxpayer List (ATL)</strong> using any of these methods:
        </p>
        <ul>
          <li><strong>FBR ATL Portal:</strong> Visit <em>e.fbr.gov.pk/esbn/Verification.aspx</em> and enter your CNIC or NTN</li>
          <li><strong>SMS:</strong> Send <em>"ATL [space] 13-digit CNIC"</em> to <strong>9966</strong></li>
          <li><strong>Tax Asaan App:</strong> Download the official FBR Tax Asaan mobile app and verify your status</li>
        </ul>
        <p>
          Note that simply obtaining an NTN does not automatically make you an active filer. You must also <Link href="/guides/how-to-become-filer-pakistan">file your annual income tax return</Link> to appear on the ATL and enjoy filer benefits such as lower withholding tax on banking, property, and vehicle transactions.
        </p>

        <h2 id="common-mistakes">Common Mistakes to Avoid</h2>
        <table>
          <thead>
            <tr><th>Mistake</th><th>Consequence</th><th>How to Avoid</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Mobile number not registered with NADRA</td>
              <td>OTP not received, registration blocked</td>
              <td>Visit NADRA or your telecom provider to link CNIC and number first</td>
            </tr>
            <tr>
              <td>Uploading blurry or cropped documents</td>
              <td>Application rejected or delayed</td>
              <td>Use a scanner or high-quality phone camera; ensure all four corners are visible</td>
            </tr>
            <tr>
              <td>Incorrect CNIC or outdated address</td>
              <td>Mismatch with NADRA records, rejection</td>
              <td>Update CNIC via NADRA before registering if it has expired or has an old address</td>
            </tr>
            <tr>
              <td>Entering business details before completing individual registration</td>
              <td>Application errors and delays</td>
              <td>Complete the Personal Tab fully before adding business information</td>
            </tr>
            <tr>
              <td>Not acknowledging the FBR approval notice after registration</td>
              <td>"Task Not Enabled" error when trying to file return</td>
              <td>After approval, check for and complete any pending FBR notices in your IRIS inbox</td>
            </tr>
          </tbody>
        </table>

        <h2 id="atl-surcharge">Late Filing and the ATL Surcharge</h2>
        <p>
          The official tax return deadline for individuals and AOPs is <strong>September 30, 2026</strong> for Tax Year 2026. FBR sometimes grants extensions — check fbr.gov.pk for announcements closer to the deadline.
        </p>
        <p>
          If you file <strong>after the deadline</strong>, you are classified as a Late Filer. To appear on the ATL as a late filer, you must pay the <strong>ATL Surcharge</strong>:
        </p>
        <table>
          <thead>
            <tr><th>Taxpayer Type</th><th>ATL Surcharge Amount</th></tr>
          </thead>
          <tbody>
            <tr><td>Individual</td><td>PKR 1,000</td></tr>
            <tr><td>AOP (Association of Persons)</td><td>PKR 10,000</td></tr>
            <tr><td>Company</td><td>PKR 20,000</td></tr>
          </tbody>
        </table>
        <p>
          In addition to the ATL surcharge, late filing attracts a penalty of <strong>PKR 1,000 per day</strong> of default, with a minimum penalty of PKR 10,000 for individuals. Continued non-compliance can lead to SIM card blockage under FBR's authority with NADRA/PTA.
        </p>
        <div className="callout-warning">
          <strong>Even if your income is zero:</strong> File a nil return before the deadline. It costs nothing and prevents penalties, keeps your ATL status active, and avoids the PKR 1,000/day late filing penalty. See our <Link href="/guides/fbr-tax-return-deadline-2026">full guide on the 2026 tax return deadline</Link>.
        </div>

        <h2 id="faq">Frequently Asked Questions</h2>

        <h3>How do I get my NTN number if I already have a CNIC?</h3>
        <p>
          For individuals, your 13-digit CNIC is your NTN. However, you still need to register on the FBR IRIS portal at iris.fbr.gov.pk to activate your tax profile. The registration is free and takes 20–30 minutes. Without IRIS registration, you cannot file tax returns or access filer benefits.
        </p>

        <h3>Is NTN registration free in Pakistan?</h3>
        <p>
          Yes. Registering directly on the IRIS portal is completely free. Professional assistance is optional — <Link href="/personal/ntn-registration">Akbar Tax Store provides NTN registration from PKR 4,000</Link> for those who prefer to have it handled for them.
        </p>

        <h3>How long does NTN registration take?</h3>
        <p>
          The online application on IRIS takes 20–30 minutes to complete. FBR processes and approves most applications within 1–2 working days. You will receive an email confirmation once approved.
        </p>

        <h3>Can I have more than one NTN in Pakistan?</h3>
        <p>
          No. Each individual or entity can have only one NTN. If you believe you have a duplicate NTN, contact FBR's helpline (051-111-772-772) to resolve it. Filing under a duplicate NTN can cause complications with your tax history.
        </p>

        <h3>What should I do after getting my NTN?</h3>
        <p>
          After obtaining your NTN, file your first income tax return on IRIS by September 30 of the relevant tax year. This is what places you on the Active Taxpayer List and unlocks filer benefits. Getting an NTN alone does not make you an active filer. Read our <Link href="/guides/how-to-become-filer-pakistan">complete guide on how to become a filer in Pakistan</Link>.
        </p>

      </GuideLayout>
    </>
  );
}