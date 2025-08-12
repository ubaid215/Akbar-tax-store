"use client";
import Head from 'next/head';
import Link from 'next/link';

const serviceData = {
  'nin': {
    title: 'NIN Registration',
    price: '1,500 PKR',
    description: 'National Identity Number registration for tax purposes',
    fullDescription: 'The National Identity Number (NIN) is a mandatory requirement that links your CNIC with Pakistan\'s tax system. Our experts ensure quick and hassle-free registration so you can comply with FBR requirements and avoid penalties. With over 5,000 successful registrations processed, we guarantee 100% approval when documents are submitted correctly.',
    requirements: [
      'ID card copy (front & back)',
      'Active mobile number',
      'Email address'
    ],
    process: [
      'Submit documents through our secure portal',
      'Our team verifies and submits to NADRA',
      'Receive SMS confirmation within 24 hours',
      'Get your NIN certificate via email',
      'Lifetime validity - no renewals needed'
    ],
    benefits: [
      'Mandatory for all tax filings and transactions',
      'Links your identity across all government systems',
      'Required for bank accounts above 500,000 PKR',
      'Essential for property transactions',
      'Necessary for becoming an active tax filer'
    ],
    duration: '24 Hours',
    faqs: [
      {
        question: 'How long does NIN registration take?',
        answer: 'Typically completed within 24 hours after document submission.'
      },
      {
        question: 'Is NIN different from NTN?',
        answer: 'Yes, NIN is your identity number while NTN is your tax number. Both are required for filers.'
      }
    ],
    testimonials: [
      {
        name: 'Ahmed R.',
        text: 'Got my NIN in just 1 day through Akbar Tax Store. Super efficient service!'
      }
    ]
  },
  'ntn': {
    title: 'NTN Certificate',
    price: '1,500 PKR',
    description: 'National Tax Number registration',
    fullDescription: 'Your NTN Certificate is the official proof of your tax registration in Pakistan. We specialize in fast-track NTN registrations with same-day submission to FBR. Our team handles all paperwork and follow-ups, ensuring you get your certificate without visiting any tax office. Perfect for salaried individuals, freelancers, and property owners who need to comply with tax regulations.',
    requirements: [
      'CNIC copy',
      'Mobile number',
      'Email address'
    ],
    process: [
      'Complete our simple online application',
      'Upload required documents',
      'We submit to FBR within 24 hours',
      'Receive NTN via SMS/email within 24 hours',
      'Download certificate from FBR portal'
    ],
    benefits: [
      'Mandatory for all tax-related transactions',
      'Required for property purchases/sales',
      'Necessary for vehicle registration',
      'Essential for bank loans and financing',
      'Valid for lifetime (no renewal needed)'
    ],
    duration: '24 Hours',
    urgencyNote: 'Delayed NTN registration can lead to 5,000 PKR penalty from FBR',
    testimonial: {
      name: 'Fatima K.',
      text: 'Applied in the morning, had my NTN by evening. Amazing service!'
    }
  },
  'tax-return': {
    title: 'Tax Return Filing',
    price: '4,000 PKR',
    description: 'Annual income tax return filing',
    fullDescription: 'Our certified tax experts prepare and file your annual income tax return with complete accuracy to ensure compliance and maximize your refunds. We analyze all eligible deductions including Zakat, insurance premiums, and charitable donations. Last year, our clients received 23% higher average refunds compared to self-filers.',
    requirements: [
      'Username and Password'
    ],
    process: [
      'Provide your FBR login credentials',
      'Our experts access your tax profile',
      'Complete deduction optimization analysis',
      'Draft preparation for your review',
      'Final submission to FBR within 24-48 hours',
      'Receipt generation and filing proof'
    ],
    benefits: [
      'Avoid 10,000 PKR late filing penalty',
      'Claim maximum eligible refunds',
      'Maintain active filer status',
      'Professional audit protection',
      'Digital record of all submissions'
    ],
    duration: '24-48 hours after document submission',
    statHighlight: '92% of our clients receive refunds within 45 days of filing',
    deadlineWarning: 'September 30 annual deadline approaching!'
  },
  'filer': {
    title: 'Business File Return',
    price: '7,000 PKR',
    description: 'Become an active tax filer',
    fullDescription: 'Being a filer provides significant advantages including lower tax rates, property transaction benefits, and better banking terms. Our complete filer package includes NTN registration (if needed), NIN linkage, and first-year tax return filing. We guarantee your active filer status will reflect in FBR\'s system within 15 working days or we refund 50% of our fee.',
    requirements: [
      'ID Card Picture',
      'Email Address',
      'Phone Number',
      'Bank Account Details if you have Bank Account',
      'Property Details if you own any property.',
      'Vehicle details If you own any car or bike.',
      'salary person or Business owner.'
    ],
    process: [
      'Document verification and preparation',
      'NTN/NIN registration (if needed)',
      'FBR profile activation',
      'Asset declaration if applicable',
      'First tax return preparation within 24-48 hours',
      'Filer status confirmation and certificate delivery'
    ],
    benefits: [
      '50% lower tax rates than non-filers',
      'Eligible for property transactions',
      'Lower withholding taxes on banking',
      'Better loan approval chances',
      'Required for government tenders'
    ],
    duration: '24-48 hours after document submission',
    comparison: {
      filer: '0.5-15% tax rates',
      nonFiler: '5-35% tax rates'
    },
    testimonial: {
      name: 'Usman T.',
      text: 'Saved 120,000 PKR in property taxes in first year as filer!'
    }
  },
  'gst': {
    title: 'GST Registration',
    price: '10,000 PKR',
    description: 'Goods and Services Tax registration',
    fullDescription: 'Mandatory for businesses with 10M+ annual turnover, our GST registration service includes complete documentation preparation, PRA liaison, and post-registration guidance. We handle the entire process electronically, including business categorization and tax period selection. Includes first-month return filing assistance at no extra cost.',
    requirements: [
      'ID Card Picture',
      'Phone Number',
      'Email ID',
      'Business Name',
      'Business Address',
      'Business Principal Activity.',
      'Office Front Door picture',
      'Electricity bill & meter Pic',
      'Property/office agreement',
      'Bank maintenance Certificate.(Business-bank)'
    ],
    process: [
      'Business category determination',
      'Document preparation and verification',
      'PRA portal application submission',
      'Follow-up and approval within 5-7 working days',
      'GST registration certificate',
      'First return filing guidance'
    ],
    benefits: [
      'Legal compliance for your business',
      'Input tax adjustment benefits',
      'Required for government contracts',
      'Professional image with clients',
      'Avoid 50,000 PKR penalty for non-registration'
    ],
    duration: '5-7 working days',
    statNote: 'Businesses see average 18% cost savings through proper GST filing'
  },
  'pra': {
    title: 'PRA Registration',
    price: '10,000 PKR',
    description: 'Punjab Revenue Authority registration',
    fullDescription: 'Professional registration with PRA for service providers including doctors, lawyers, consultants, and other professionals. Our package includes tax advice on optimal registration category, complete documentation, and first-quarter return filing assistance. We maintain the highest success rate in Lahore with 99% first-time approvals.',
    requirements: [
      'ID Card Picture',
      'Phone Number',
      'Email ID',
      'Business Name',
      'Business Address',
      'Business Principal Activity.',
      'Office Front Door picture',
      'Electricity bill & meter Pic',
      'Property/office agreement',
      'Bank maintenance Certificate.(Business-bank)'
    ],
    process: [
      'Service category determination',
      'Fee structure consultation',
      'Document preparation',
      'Online application submission',
      'PRA coordination within 5-7 working days',
      'Registration certificate delivery'
    ],
    benefits: [
      'Legal compliance for professionals',
      'Proper invoice documentation',
      'Input tax adjustments',
      'Avoid 2% monthly penalty charges',
      'Professional credibility'
    ],
    duration: '5-7 working days',
    urgencyNote: 'New PRA enforcement drives targeting unregistered professionals'
  },
  'chamber': {
    title: 'Chamber of Commerce',
    price: '18,000 PKR',
    description: 'Membership registration',
    fullDescription: 'Boost your business credibility with LCCI membership that provides networking opportunities, trade facilitation, and government liaison services. Our premium package includes document preparation, sponsorship arrangement (if needed), and fast-track processing. Members receive export/import certificates, trade references, and participation in international trade fairs.',
    requirements: [
      'ID Card Picture',
      'Phone Number',
      'Email ID',
      'Business Name',
      'Business Address',
      'Business Principal Activity.',
      'Person Signature',
      'White Background Picture.',
      '2 years Tax Returns Copy'
    ],
    process: [
      'Business category assessment',
      'Document preparation',
      'Sponsorship arrangement',
      'Application submission',
      'Membership approval within 5-7 working days',
      'Certificate and card delivery'
    ],
    benefits: [
      'Essential for export/import businesses',
      'Access to trade delegations',
      'Government tender eligibility',
      'Business dispute resolution',
      'Market intelligence reports'
    ],
    duration: '5-7 working days',
    statHighlight: 'LCCI members see 37% faster customs clearance'
  }
};

export default function ServiceDetail({ params }) {
  const service = serviceData[params.serviceId] || {
    title: 'Service Not Found',
    description: 'The requested service does not exist or has been moved.'
  };

  return (
    <div className="min-h-screen bg-[#D9E8FF]">
      <Head>
        <title>{service.title} | Akbar Tax Store</title>
        <meta name="description" content={`Details about our ${service.title} service`} />
      </Head>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#072971] to-[#0040A8] text-white py-16">
        <div className="container mx-auto px-6">
          <Link href="/personal" className="inline-flex items-center text-[#D9E8FF] hover:text-white mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Personal Services
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
                <p className="text-[#050505] mb-6 leading-relaxed">{service.fullDescription || service.description}</p>
                
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

                {service.deadlineWarning && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700 font-medium">Deadline Alert:</p>
                        <p className="text-sm text-yellow-700">{service.deadlineWarning}</p>
                      </div>
                    </div>
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
                  )) || <li className="text-[#050505]">Process details will be provided upon consultation</li>}
                </ol>

                <h3 className="text-xl font-semibold text-[#0040A8] mb-4">Key Benefits</h3>
                <ul className="mb-8 space-y-3">
                  {service.benefits?.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-3 mt-1 text-lg">✓</span>
                      <span className="text-[#050505] leading-relaxed">{benefit}</span>
                    </li>
                  )) || <li className="text-[#050505]">Benefits will be explained during consultation</li>}
                </ul>

                {/* Stats or Highlights */}
                {service.statHighlight && (
                  <div className="bg-blue-50 rounded-lg p-6 mb-8">
                    <div className="flex items-center">
                      <svg className="h-8 w-8 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <p className="text-blue-800 font-semibold">{service.statHighlight}</p>
                    </div>
                  </div>
                )}

                {service.comparison && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-8">
                    <h4 className="font-semibold text-[#072971] mb-3">Tax Rate Comparison</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-100 rounded-lg">
                        <p className="text-sm text-gray-600">As Filer</p>
                        <p className="text-lg font-bold text-green-700">{service.comparison.filer}</p>
                      </div>
                      <div className="text-center p-4 bg-red-100 rounded-lg">
                        <p className="text-sm text-gray-600">As Non-Filer</p>
                        <p className="text-lg font-bold text-red-700">{service.comparison.nonFiler}</p>
                      </div>
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
                    )) || <li className="text-[#050505]">Requirements will be provided upon consultation</li>}
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
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          {(service.testimonials || service.testimonial) && (
            <div className="bg-[#F7FAFF] px-8 py-6 border-t border-[#D9E8FF]">
              <h3 className="text-xl font-bold text-[#072971] mb-4">What Our Clients Say</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.testimonials?.map((testimonial, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-[#050505] italic mb-2">{testimonial.text}</p>
                    <p className="text-[#0040A8] font-semibold text-sm">- {testimonial.name}</p>
                  </div>
                )) || (service.testimonial && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-[#050505] italic mb-2">{service.testimonial.text}</p>
                    <p className="text-[#0040A8] font-semibold text-sm">- {service.testimonial.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Services */}
          <div className="bg-[#F7FAFF] px-8 py-6 border-t border-[#D9E8FF]">
            <h3 className="text-xl font-bold text-[#072971] mb-4">Related Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                href="/personal/ntn" 
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition duration-300 border border-[#D9E8FF]"
              >
                <h4 className="font-semibold text-[#0040A8] mb-1">NTN Certificate</h4>
                <p className="text-sm text-[#050505]">Get your National Tax Number certificate</p>
                <p className="text-xs text-[#0040A8] font-medium mt-2">1,500 PKR</p>
              </Link>
              <Link 
                href="/personal/tax-return" 
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition duration-300 border border-[#D9E8FF]"
              >
                <h4 className="font-semibold text-[#0040A8] mb-1">Tax Return Filing</h4>
                <p className="text-sm text-[#050505]">File your annual tax return</p>
                <p className="text-xs text-[#0040A8] font-medium mt-2">4,000 PKR</p>
              </Link>
              <Link 
                href="/personal/filer" 
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition duration-300 border border-[#D9E8FF]"
              >
                <h4 className="font-semibold text-[#0040A8] mb-1">Filer Registration</h4>
                <p className="text-sm text-[#050505]">Become an active tax filer</p>
                <p className="text-xs text-[#0040A8] font-medium mt-2">7,000 PKR</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}