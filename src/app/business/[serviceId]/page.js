"use client";
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const businessServiceDatabase = {
  'nin': {
    title: 'NIN Registration',
    price: '1,500 PKR',
    description: 'National Identity Number registration for tax purposes',
    fullDescription: 'National Identity Number (NIN) is mandatory for all tax-related activities in Pakistan. Our NIN registration service ensures quick and hassle-free registration with FBR. This number is essential for filing tax returns, opening business accounts, and various government procedures.',
    image: '/images/nin-registration.jpg',
    category: 'Registration',
    duration: '24 Hours',
    requirements: [
      'ID card copy (front & back)',
      'Active mobile number',
      'Email address',
      'Current address details'
    ],
    process: [
      'Document verification and validation',
      'Online FBR portal submission',
      'Biometric verification (if required)',
      'NIN certificate generation',
      'Digital copy delivery via email'
    ],
    benefits: [
      'Mandatory for tax filing',
      'Required for business operations',
      'Quick 24-hour processing',
      'Digital certificate provided',
      'FBR compliance ensured'
    ]
  },

  'ntn': {
    title: 'NTN Certificate',
    price: '1,500 PKR',
    description: 'National Tax Number registration with FBR',
    fullDescription: 'National Tax Number (NTN) is your unique identifier with Pakistan\'s tax system. Essential for individuals and businesses, NTN registration enables you to file tax returns, claim refunds, and comply with tax obligations. Our service ensures smooth registration with all required documentation.',
    image: '/images/ntn-certificate.jpg',
    category: 'Certificate',
    duration: '24 Hours',
    requirements: [
      'CNIC copy (front & back)',
      'Mobile number',
      'Email address',
      'Residential address proof'
    ],
    process: [
      'Document collection and verification',
      'FBR online portal registration',
      'Tax profile setup',
      'NTN certificate issuance',
      'Digital delivery and guidance'
    ],
    benefits: [
      'Unique tax identification',
      'Essential for tax compliance',
      'Required for business registration',
      'Enables tax refund claims',
      'Foundation for all tax matters'
    ]
  },

  'tax-return': {
    title: 'Tax Return Filing',
    price: '4,000 PKR',
    description: 'Annual income tax return filing with FBR',
    fullDescription: 'Professional tax return filing service for individuals and businesses. Our tax experts ensure accurate calculation, maximum deductions, and timely submission to avoid penalties. We handle all types of returns including salary, business income, and capital gains.',
    image: '/images/tax-return.jpg',
    category: 'Filing',
    duration: '24-48 hours after document submission',
    requirements: [
      'FBR Username and Password',
      'Annual income statements',
      'Tax deduction certificates',
      'Bank statements (if required)',
      'Previous year return copy'
    ],
    process: [
      'Income and deduction analysis',
      'Tax calculation and optimization',
      'Return preparation and review',
      'Online FBR submission',
      'Acknowledgment and follow-up'
    ],
    benefits: [
      'Professional tax optimization',
      'Penalty avoidance',
      'Maximum deduction claims',
      'Accurate calculations',
      'Expert guidance included'
    ]
  },

  'filer': {
    title: 'Business File Return',
    price: '7,000 PKR',
    description: 'Become an active tax filer for reduced tax rates',
    fullDescription: 'Transform your tax status from non-filer to active filer and enjoy significantly reduced tax rates on various transactions. Our comprehensive filer registration service includes asset declaration, income documentation, and ongoing compliance support.',
    image: '/images/filer-status.jpg',
    category: 'Status',
    duration: '24-48 hours after document submission',
    requirements: [
      'ID Card Picture',
      'Email Address',
      'Phone Number',
      'Bank Account Details (if applicable)',
      'Property Details (if owned)',
      'Vehicle details (if owned)',
      'Employment/business details'
    ],
    process: [
      'Asset and income assessment',
      'Tax return preparation',
      'FBR portal submission',
      'Filer status activation',
      'Certificate delivery and guidance'
    ],
    benefits: [
      'Reduced tax rates (50% less)',
      'Lower withholding taxes',
      'Banking convenience',
      'Property transaction benefits',
      'Business credibility enhancement'
    ],
    urgencyNote: 'Filer status provides 50% reduction in withholding taxes - significant savings on all transactions!'
  },

  'business-reg': {
    title: 'Business Registration',
    price: '15,000 PKR',
    description: 'Official registration of your business with relevant authorities',
    fullDescription: 'Proper business registration establishes your legal identity and is required for opening bank accounts, applying for loans, and entering contracts. We handle the entire registration process with the relevant authorities, ensuring compliance with all regulations. Our package includes name reservation, document preparation, submission, and follow-up until registration is complete.',
    image: '/images/business-registration-detail.jpg',
    category: 'Registration',
    duration: '7-10 Days',
    requirements: [
      'CNIC copies of all owners/partners',
      'Business name options (3 choices)',
      'Complete business address with proof',
      'Detailed business activity description',
      'Bank account details (if available)',
      'Owner/partner photographs'
    ],
    process: [
      'Business name search and reservation',
      'Document preparation and notarization',
      'Submission to relevant authority',
      'Follow-up and status tracking',
      'Registration certificate delivery',
      'Bank account opening assistance'
    ],
    benefits: [
      'Legal business identity',
      'Ability to open business bank accounts',
      'Eligibility for government tenders',
      'Protection of business name',
      'Foundation for tax registration'
    ],
    documents: [
      {
        name: 'Application Form',
        image: '/images/doc-form.jpg'
      },
      {
        name: 'Sample Certificate',
        image: '/images/doc-certificate.jpg'
      }
    ],
    testimonial: {
      name: 'Ali Enterprises',
      text: 'Registered our wholesale business in just 5 days. Saved us weeks of paperwork!'
    }
  },

  'company-reg': {
    title: 'Company Registration (SECP)',
    price: '25,000 PKR',
    description: 'Register your private limited company with Securities and Exchange Commission',
    fullDescription: 'Our comprehensive company registration package includes name reservation, document preparation, SECP submission, and post-registration services. We handle everything from Articles of Association to NTN registration after incorporation.',
    image: '/images/secp-registration.jpg',
    category: 'Registration',
    duration: '15-20 Days',
    requirements: [
      'Owner/Director CNIC copies',
      'Company name options (3 choices)',
      'Registered office address proof',
      'Business objectives description',
      'Director photographs',
      'Percentage shareholding details'
    ],
    process: [
      'Name availability check and reservation',
      'Document drafting (MOA/AOA)',
      'SECP online portal submission',
      'Payment of government fees',
      'Certificate of incorporation',
      'Post-registration compliances'
    ],
    benefits: [
      'Limited liability protection',
      'Separate legal entity status',
      'Easier access to financing',
      'Increased business credibility',
      'Transferable ownership'
    ],
    documents: [
      {
        name: 'SECP Application Form',
        image: '/images/secp-form.jpg'
      },
      {
        name: 'Sample Certificate',
        image: '/images/secp-certificate.jpg'
      }
    ]
  },

  'firm-reg': {
    title: 'Firm Registration',
    price: '25,000 PKR',
    description: 'Register your partnership firm with Registrar of Firms',
    fullDescription: 'Establish your partnership as a legal entity with our firm registration service. We handle partnership deed drafting, notarization, and submission to the Registrar of Firms. Includes post-registration NTN and business bank account assistance.',
    image: '/images/firm-registration.jpg',
    category: 'Registration',
    duration: '10-15 Days',
    requirements: [
      'Partners CNIC copies',
      'Partnership deed draft',
      'Business address proof',
      'Partners photographs',
      'Business activity description',
      'Profit-sharing ratio'
    ],
    process: [
      'Partnership deed preparation',
      'Notarization and stamping',
      'Registrar of Firms submission',
      'Follow-up until registration',
      'Certificate obtainment',
      'Post-registration services'
    ],
    benefits: [
      'Legal recognition of partnership',
      'Clear profit-sharing structure',
      'Easier dispute resolution',
      'Better access to financing',
      'Foundation for growth'
    ]
  },

  'trademark-reg': {
    title: 'Trademark Registration',
    price: '20,000 PKR',
    description: 'Protect your brand identity with official trademark registration',
    fullDescription: 'Safeguard your brand name, logo, and intellectual property with our trademark registration service. We conduct comprehensive searches, prepare applications, and handle all correspondence with the Trademark Registry until registration is complete.',
    image: '/images/trademark.jpg',
    category: 'Protection',
    duration: '3-6 Months',
    requirements: [
      'ID Card Picture',
      'Phone Number',
      'Email ID',
      'Business Name',
      'Trademark image/logo (high quality)',
      'Business Principal Activity',
      'Owner signature specimen',
      'Logo on white background'
    ],
    process: [
      'Trademark search and clearance',
      'Application preparation',
      'Class selection guidance',
      'IPO Pakistan submission',
      'Examination response handling',
      'Registration certificate obtainment'
    ],
    benefits: [
      'Exclusive rights to brand name/logo',
      'Legal protection against infringement',
      'Increased business valuation',
      'Foundation for franchising',
      'Valid for 10 years (renewable)'
    ],
    urgencyNote: 'Trademark approval takes 12-18 months - register early!'
  },

  'import-export': {
    title: 'Import/Export License',
    price: '20,000 PKR',
    description: 'Obtain license for international trade activities',
    fullDescription: 'We facilitate complete import/export license registration including IEC (Import Export Code) and membership with relevant trade associations. Our service includes guidance on customs procedures and duty drawbacks.',
    image: '/images/import-export.jpg',
    category: 'License',
    duration: '10-15 Days',
    requirements: [
      'ID card Picture',
      'Phone Number (registered on NTN)',
      'Email ID (registered on NTN)',
      'Iris login credentials',
      'Business registration documents',
      'Bank certificate'
    ],
    process: [
      'Document verification and preparation',
      'NTN/NICOP validation',
      'EPB online portal submission',
      'Customs department coordination',
      'License issuance',
      'Trade association membership'
    ],
    benefits: [
      'Legal authorization for international trade',
      'Access to export incentives',
      'Easier customs clearance',
      'Eligibility for trade financing',
      'Global market access'
    ]
  },

  'gst-reg': {
    title: 'GST Registration',
    price: '10,000 PKR',
    description: 'Register for Goods and Services Tax with Punjab Revenue Authority',
    fullDescription: 'Mandatory for service providers with annual turnover above Rs. 10 million, our GST registration package includes complete documentation, PRA liaison, and first-return filing assistance. We ensure correct business categorization and tax period selection.',
    image: '/images/gst.jpg',
    category: 'Tax',
    duration: '7-10 Days',
    requirements: [
      'ID Card Picture',
      'Phone Number',
      'Email ID',
      'Business NTN certificate',
      'Business bank account details',
      'Office front photo',
      'Electricity bill copy',
      'Rental/ownership agreement'
    ],
    process: [
      'Business category determination',
      'Document preparation',
      'PRA online portal submission',
      'Follow-up until approval',
      'Registration certificate',
      'First return filing guidance'
    ],
    benefits: [
      'Legal compliance for service providers',
      'Input tax adjustment benefits',
      'Required for government contracts',
      'Professional business image',
      'Avoid Rs. 50,000 penalty'
    ]
  },

  'pra': {
    title: 'PRA Registration',
    price: '10,000 PKR',
    description: 'Punjab Revenue Authority registration for provincial tax compliance',
    fullDescription: 'Register with Punjab Revenue Authority for provincial tax compliance. Essential for service providers operating in Punjab. Our comprehensive service includes documentation, submission, and ongoing compliance support to ensure you meet all PRA requirements.',
    image: '/images/pra-registration.jpg',
    category: 'Registration',
    duration: '5-7 working days',
    requirements: [
      'ID Card Picture',
      'Phone Number',
      'Email ID',
      'Business Name',
      'Business Address',
      'Business Principal Activity',
      'Office Front Door picture',
      'Electricity bill & meter Pic',
      'Property/office agreement',
      'Bank maintenance Certificate (Business-bank)'
    ],
    process: [
      'Business assessment and categorization',
      'Document compilation and verification',
      'PRA portal submission',
      'Follow-up and correspondence',
      'Registration approval',
      'Certificate delivery and guidance'
    ],
    benefits: [
      'Provincial tax compliance',
      'Legal operation in Punjab',
      'Access to government contracts',
      'Avoid penalties and fines',
      'Professional business status'
    ]
  },

  'chamber': {
    title: 'Chamber of Commerce',
    price: '18,000 PKR',
    description: 'Membership registration with Chamber of Commerce',
    fullDescription: 'Join your local Chamber of Commerce to enhance business credibility and access valuable networking opportunities. Our service includes complete membership processing, documentation, and guidance on chamber benefits and services.',
    image: '/images/chamber-commerce.jpg',
    category: 'Registration',
    duration: '5-7 working days',
    requirements: [
      'ID Card Picture',
      'Phone Number',
      'Email ID',
      'Business Name',
      'Business Address',
      'Business Principal Activity',
      'Person Signature',
      'White Background Picture',
      '2 years Tax Returns Copy'
    ],
    process: [
      'Membership application preparation',
      'Document verification',
      'Chamber submission and liaison',
      'Membership approval process',
      'Certificate and card issuance',
      'Orientation and benefits briefing'
    ],
    benefits: [
      'Enhanced business credibility',
      'Networking opportunities',
      'Business certification services',
      'Trade facilitation support',
      'Government liaison assistance'
    ]
  },

  'dnfbp': {
    title: 'DNFBP Registration',
    price: '10,000 PKR',
    description: 'Register as Designated Non-Financial Business/Profession',
    fullDescription: 'Mandatory for businesses like real estate, dealers in precious metals/stones, and other designated professions. We ensure complete compliance with FIA regulations including AML/CFT requirements.',
    image: '/images/dnfbp.jpg',
    category: 'Compliance',
    duration: '5-7 Days',
    requirements: [
      'ID Card Picture',
      'Phone Number',
      'Email ID',
      'Business registration documents',
      'Police character certificates',
      'Business premises details',
      'Bank maintenance certificate'
    ],
    process: [
      'Business category verification',
      'Document preparation',
      'FIA online portal submission',
      'AML/CFT compliance check',
      'Registration approval',
      'Certificate delivery'
    ],
    benefits: [
      'Legal compliance with FIA regulations',
      'Avoid heavy penalties',
      'Better banking relationships',
      'Increased business credibility',
      'Smooth financial transactions'
    ],
    urgencyNote: 'DNFBP registration is now mandatory for many businesses - non-compliance penalties up to Rs. 1 million'
  },

  'accounting-services': {
    title: 'Accounting Services',
    price: '15,000 PKR/month',
    description: 'Professional bookkeeping and financial reporting',
    fullDescription: 'Our monthly accounting services include complete bookkeeping, financial statement preparation, and tax compliance support. We provide cloud-based accounting with real-time access to your financial data.',
    image: '/images/accounting.jpg',
    category: 'Services',
    duration: 'Monthly Service',
    requirements: [
      'Business registration documents',
      'Bank statements',
      'Sales/purchase records',
      'Expense vouchers',
      'Tax registration details',
      'Previous financial records'
    ],
    servicesIncluded: [
      'Daily transaction recording',
      'Monthly financial statements',
      'Bank reconciliation',
      'Accounts receivable/payable',
      'Tax deduction calculations',
      'Financial health reports'
    ],
    process: [
      'Initial setup and document collection',
      'Daily transaction recording',
      'Monthly reconciliation',
      'Financial statement preparation',
      'Tax compliance monitoring',
      'Regular reporting and consultation'
    ],
    benefits: [
      'Accurate financial records',
      'Timely tax compliance',
      'Better financial decisions',
      'Reduced accounting costs',
      'Professional reporting'
    ],
    testimonial: {
      name: 'Shahid Enterprises',
      text: 'Switched to their accounting services and saved 40% on our accounting costs!'
    }
  },

'accounting': {
  title: 'Accountant and Financial Reporting',
  price: '25,000 PKR',
  description: 'Professional accounting and financial reporting from certified experts',
  fullDescription: 'Our comprehensive accounting service provides expert financial reporting, compliance management, and strategic financial guidance. We prepare detailed financial statements, ensure regulatory compliance, and provide insights to improve your business performance. Our certified accountants use modern tools and follow international accounting standards.',
  image: '/images/accounting-finance.jpg',
  category: 'Financial Services',
  duration: '4-5 working days',
  requirements: [
    'Previous Tax Return',
    'Previous Financials',
    'Current Year All Bank Statement',
    'All General Ledger',
    'Capital detail ledger',
    'Stock detail',
    'Administration detail ledger',
    'HR detail ledger',
    'Shareholder detail/paid up capital Detail'
  ],
  process: [
    'Document collection and review',
    'Financial data analysis and verification',
    'Statement preparation using accounting standards',
    'Compliance check and validation',
    'Final reporting and presentation',
    'Advisory consultation included'
  ],
  benefits: [
    'Professional financial statements',
    'Regulatory compliance assurance',
    'Strategic financial insights',
    'Tax optimization opportunities',
    'Business performance analysis',
    'Expert advisory support'
  ]
},

'bookkeeping': {
  title: 'Bookkeeping Service',
  price: '7,000 PKR',
  description: 'Professional daily bookkeeping and transaction recording services',
  fullDescription: 'Our bookkeeping service provides systematic recording of all business transactions, maintaining accurate books of accounts. We handle daily entries, reconciliations, and provide regular financial summaries. Perfect for businesses wanting to maintain proper records without hiring full-time accounting staff.',
  image: '/images/bookkeeping.jpg',
  category: 'Financial Services',
  duration: '4-5 working days setup, then ongoing',
  requirements: [
    'Business registration documents',
    'Bank account details',
    'Previous records (if available)',
    'Transaction documents and receipts'
  ],
  process: [
    'Initial setup and system configuration',
    'Daily transaction recording',
    'Regular account reconciliation',
    'Monthly summary preparation',
    'Error checking and correction',
    'Regular backup and reporting'
  ],
  benefits: [
    'Accurate daily record keeping',
    'Time-saving automation',
    'Regular financial summaries',
    'Tax preparation ready records',
    'Professional bookkeeping standards',
    'Cost-effective solution'
  ]
},

'stock': {
  title: 'Stock Report',
  price: '10,000 PKR',
  description: 'Comprehensive stock analysis and inventory reporting',
  fullDescription: 'Detailed stock reporting service that provides comprehensive analysis of your inventory including stock valuation, movement analysis, and optimization recommendations. Our reports help identify slow-moving items, optimize stock levels, and improve cash flow management.',
  image: '/images/stock-report.jpg',
  category: 'Business Analytics',
  duration: '2-5 working days',
  requirements: [
    'Sale and purchase data',
    'Current inventory records',
    'Product/item master list',
    'Previous stock reports (if available)',
    'Pricing information'
  ],
  process: [
    'Data collection and validation',
    'Inventory analysis and categorization',
    'Stock movement tracking',
    'Valuation and costing analysis',
    'Report generation with insights',
    'Optimization recommendations'
  ],
  benefits: [
    'Accurate stock valuation',
    'Inventory optimization insights',
    'Cash flow improvement',
    'Slow-moving stock identification',
    'Cost analysis and control',
    'Strategic inventory planning'
  ]
}
};


export default function BusinessServiceDetail({ params }) {
  const service = businessServiceDatabase[params.serviceId] || {
    title: 'Service Not Found',
    description: 'The requested business service does not exist or has been moved.',
    price: 'N/A',
    category: 'Error',
    duration: 'N/A',
    requirements: [],
    process: [],
    benefits: []
  };

  return (
    <div className="min-h-screen bg-[#D9E8FF]">
      <Head>
        <title>{service.title} | Akbar Tax Store</title>
        <meta name="description" content={service.description} />
      </Head>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#072971] to-[#0040A8] text-white py-16">
        <div className="container mx-auto px-6">
          <Link href="/business" className="inline-flex items-center text-[#D9E8FF] hover:text-white mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Business Services
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{service.title}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="bg-white text-[#0040A8] px-4 py-2 rounded-full text-lg font-semibold">
              {service.price}
            </span>
            {service.duration && (
              <span className="bg-[#FFFFFF]/20 text-white px-4 py-2 rounded-full text-sm font-medium">
                ⏱️ {service.duration}
              </span>
            )}
            <span className="text-[#D9E8FF]">{service.description}</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#D9E8FF] transform skew-y-1 -mb-6 z-10"></div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Service Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-[#072971] mb-4">Service Overview</h2>
                <p className="text-[#050505] mb-6 leading-relaxed">{service.fullDescription}</p>
                
                {/* Special Notes */}
                {service.urgencyNote && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700 font-medium">Important:</p>
                        <p className="text-sm text-red-700">{service.urgencyNote}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Services Included (for Accounting Services) */}
                {service.servicesIncluded && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-[#0040A8] mb-4">Services Included</h3>
                    <ul className="space-y-3">
                      {service.servicesIncluded.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-3 mt-1 text-lg">✓</span>
                          <span className="text-[#050505] leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <h3 className="text-xl font-semibold text-[#0040A8] mb-4">Our Process</h3>
                <ol className="mb-8 space-y-4">
                  {service.process?.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-[#0040A8] text-white font-bold rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-[#050505] leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>

                <h3 className="text-xl font-semibold text-[#0040A8] mb-4">Key Benefits</h3>
                <ul className="mb-8 space-y-3">
                  {service.benefits?.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-3 mt-1 text-lg">✓</span>
                      <span className="text-[#050505] leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* Document Samples */}
                {service.documents && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-[#0040A8] mb-4">Document Samples</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {service.documents.map((doc, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="relative h-48">
                            <Image
                              src={doc.image}
                              alt={doc.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-3 bg-gray-50">
                            <p className="text-sm font-medium text-[#072971]">{doc.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div>
                <div className="bg-[#D9E8FF] rounded-lg p-6 sticky top-4">
                  <h3 className="text-xl font-bold text-[#072971] mb-4">Required Documents</h3>
                  <ul className="space-y-3 mb-6">
                    {service.requirements?.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className="bg-[#0040A8] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 text-xs font-bold">
                          {index + 1}
                        </span>
                        <span className="text-[#050505] text-sm leading-relaxed">{req}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-3 mb-6">
                    <Link
                      href="/contact"
                      className="block w-full bg-[#0040A8] hover:bg-[#072971] text-white font-bold py-3 px-6 rounded-lg text-center transition duration-300"
                    >
                      Apply Now
                    </Link>
                    
                    <a
                      href="https://wa.me/923016832064"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-center transition duration-300"
                    >
                      📱 WhatsApp Now
                    </a>
                  </div>

                  <div className="pt-6 border-t border-[#0040A8] border-opacity-30">
                    <h4 className="text-sm font-semibold text-[#072971] mb-3">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#0040A8] mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <a href="tel:+923016832064" className="text-[#050505] hover:text-[#0040A8] transition-colors text-sm">0301-6832064</a>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#0040A8] mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <a href="mailto:hussnain@akbartaxstore.com" className="text-[#050505] hover:text-[#0040A8] transition-colors text-sm">hussnain@akbartaxstore.com</a>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial */}
                  {service.testimonial && (
                    <div className="mt-6 pt-6 border-t border-[#0040A8] border-opacity-30">
                      <h4 className="text-sm font-semibold text-[#072971] mb-2">Client Feedback</h4>
                      <p className="text-[#050505] italic text-sm mb-1">{service.testimonial.text}</p>
                      <p className="text-xs text-[#0040A8] font-medium"> {service.testimonial.name}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          {service.testimonials && (
            <div className="bg-[#F7FAFF] px-8 py-6 border-t border-[#D9E8FF]">
              <h3 className="text-xl font-bold text-[#072971] mb-4">What Our Clients Say</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-[#050505] italic mb-2">{testimonial.text}</p>
                    <p className="text-[#0040A8] font-semibold text-sm">- {testimonial.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Services */}
          <div className="bg-[#F7FAFF] px-8 py-6 border-t border-[#D9E8FF]">
            <h3 className="text-xl font-bold text-[#072971] mb-4">Related Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(businessServiceDatabase)
                .filter(([key]) => key !== params.serviceId)
                .slice(0, 3)
                .map(([key, relatedService]) => (
                  <Link 
                    href={`/business/${key}`} 
                    key={key}
                    className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition duration-300 border border-[#D9E8FF]"
                  >
                    <h4 className="font-semibold text-[#0040A8] mb-1">{relatedService.title}</h4>
                    <p className="text-sm text-[#050505]">{relatedService.description}</p>
                    <p className="text-xs text-[#0040A8] font-medium mt-2">{relatedService.price}</p>
                  </Link>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}