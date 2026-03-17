// src/app/guides/how-to-get-ntn-pakistan/page.jsx

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

// JSON-LD: HowTo schema — enables Google rich results for step-by-step guides
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

const META = {
  title: 'How to Get NTN in Pakistan (2026 Step-by-Step Guide)',
  h1: 'How to Get NTN in Pakistan (2026 Complete Guide)',
  intro:
    'A National Tax Number (NTN) is your official identity in Pakistan\'s tax system. This guide walks you through every step of FBR IRIS registration — documents required, the exact process, and how to avoid common mistakes.',
  category: 'Tax Registration',
  updatedDate: 'March 2026',
  readTime: '7',
};

const TOC = [
  { id: 'what-is-ntn',         label: 'What is an NTN?' },
  { id: 'who-needs-ntn',       label: 'Who Needs an NTN?' },
  { id: 'documents-required',  label: 'Documents Required' },
  { id: 'step-by-step',        label: 'Step-by-Step Registration' },
  { id: 'after-registration',  label: 'After Registration: Verify Your NTN' },
  { id: 'common-mistakes',     label: 'Common Mistakes to Avoid' },
  { id: 'faq',                 label: 'Frequently Asked Questions' },
];

export default function NTNGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <GuideLayout meta={META} toc={TOC}>

        <h2 id="what-is-ntn">What is an NTN?</h2>
        <p>
          A <strong>National Tax Number (NTN)</strong> is a unique identification number issued by Pakistan's Federal Board of Revenue (FBR) to individuals, companies, and Associations of Persons (AOPs). It is your official identity within Pakistan's tax system and is required for filing income tax returns, opening business bank accounts, and conducting most formal financial transactions.
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
          <li>Your annual income exceeds <strong>PKR 600,000</strong> (PKR 50,000/month)</li>
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

        <h2 id="documents-required">Documents Required for NTN Registration</h2>

        <h3>For Individuals (Salaried / Freelancers)</h3>
        <ul>
          <li>CNIC (front and back) — scanned copy in JPG or PDF format</li>
          <li>Active mobile number registered in your name (for OTP verification)</li>
          <li>Active email address</li>
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

        <h3>Step 4 — Open Form 181 from Drafts</h3>
        <p>
          Log into your new IRIS account using your CNIC and password. Navigate to the <strong>Drafts</strong> section on your dashboard. Open <strong>Form 181 — Application for Registration</strong>. This is the core document for NTN issuance.
        </p>

        <h3>Step 5 — Fill All Required Tabs</h3>
        <p>Form 181 has multiple tabs you must complete in full:</p>
        <ul>
          <li><strong>Personal Tab</strong> — CNIC details, full name, father's name, date of birth, contact information, and residential address</li>
          <li><strong>Property Tab</strong> — Enter your residential address details and reference your utility bill</li>
          <li><strong>Business Tab</strong> — If you run a business, enter its nature, business activity codes, and business address. Skip this tab if you are a salaried individual only.</li>
          <li><strong>Bank Account Tab</strong> — Mandatory for all applicants. Enter your bank name, IBAN, and confirm account ownership.</li>
        </ul>

        <h3>Step 6 — Upload Required Documents</h3>
        <p>
          Upload scanned copies of your CNIC (front and back), utility bill, and any other required documents. Files must be in JPG or PDF format and clearly legible. Blurry or incomplete documents are a primary cause of rejection.
        </p>

        <h3>Step 7 — Submit the Application</h3>
        <p>
          Review all tabs carefully. Once you click <strong>Submit</strong>, you cannot make further changes. After submission, FBR typically approves registration within <strong>1–2 working days</strong>. You will receive a confirmation email.
        </p>

        <h3>Step 8 — Download Your NTN Certificate</h3>
        <p>
          Log back into your IRIS account after approval. Navigate to your profile and download your NTN certificate from the IRIS dashboard. You can re-download this certificate at any time if you lose it.
        </p>

        <div className="callout-success">
          <strong>After getting your NTN:</strong> Check the "Completed Tasks" folder in IRIS for an "Order to grant/refuse registration" task. You must complete this task before you can file your first income tax return. Without completing it, you will receive a "Task Not Enabled" error.
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
          Note that simply obtaining an NTN does not automatically make you an active filer. You must also <Link href="/guides/how-to-become-filer-pakistan">file your annual income tax return</Link> to appear on the ATL and enjoy filer benefits.
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
              <td>Update CNIC via NADRA before registering if it has expired or has old address</td>
            </tr>
            <tr>
              <td>Entering business details before completing individual registration</td>
              <td>Application errors and delays</td>
              <td>Complete the Personal Tab fully before adding business information</td>
            </tr>
            <tr>
              <td>Not completing the "Completed Tasks" step after registration</td>
              <td>"Task Not Enabled" error when trying to file return</td>
              <td>After approval, always check and complete the order in the Completed Tasks folder</td>
            </tr>
          </tbody>
        </table>

        <h2 id="faq">Frequently Asked Questions</h2>

        <h3>Is NTN registration free in Pakistan?</h3>
        <p>
          Yes. Registering on the FBR IRIS portal and obtaining your NTN is completely free. However, many individuals and businesses use a professional tax consultant to handle the process correctly on their behalf. <Link href="/services/ntn-registration">Akbar Tax Store charges PKR 4,000</Link> for NTN registration with 24-hour processing.
        </p>

        <h3>How long does NTN registration take?</h3>
        <p>
          Online registration via the IRIS portal typically takes <strong>1–2 working days</strong> after submitting a complete application. If there are discrepancies in your documents, it may take longer. Akbar Tax Store processes NTN registrations within 24 hours.
        </p>

        <h3>Can I register for NTN without visiting an FBR office?</h3>
        <p>
          Yes. The entire NTN registration process can be completed <strong>100% online</strong> via the IRIS portal. No office visit is required. You can also complete it from outside Pakistan using a NICOP (for overseas Pakistanis) or passport.
        </p>

        <h3>What if I already have an NTN but cannot access IRIS?</h3>
        <p>
          If you have an existing NTN but no IRIS credentials, you need to "e-enrol" using your existing NTN at the IRIS portal. This links your NTN to an online account. If you cannot recover your password, use the IRIS password reset option or contact the FBR helpline at <strong>0800-00-227</strong>.
        </p>

        <h3>Is my CNIC the same as my NTN?</h3>
        <p>
          For individual taxpayers and sole proprietors, yes — your 13-digit CNIC number functions as your NTN. However, you must still register on IRIS to activate your tax profile. For companies and AOPs, FBR issues a separate unique 7-digit NTN.
        </p>

      </GuideLayout>
    </>
  );
}