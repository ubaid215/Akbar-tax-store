"use client";
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

const personalServices = [
  {
    id: 'nin',
    title: 'NIN Registration',
    price: '1,500',
    description: 'National Identity Number registration for tax purposes',
    image: '/images/nin-registration.jpg',
    category: 'Registration',
    duration: '24 Hours',
    requirements: [
      'ID card copy (front & back)',
      'Active mobile number',
      'Email address'
    ]
  },
  {
    id: 'ntn',
    title: 'NTN Certificate',
    price: '1,500',
    description: 'National Tax Number registration',
    image: '/images/ntn-certificate.jpg',
    category: 'Certificate',
    duration: '24 Hours',
    requirements: [
      'CNIC copy',
      'Mobile number',
      'Email address'
    ]
  },
  {
    id: 'tax-return',
    title: 'Tax Return Filing',
    price: '4,000',
    description: 'Annual income tax return filing',
    image: '/images/tax-return.jpg',
    category: 'Filing',
    duration: '24-48 hours after document submission',
    requirements: [
      'Username and Password, (If Already Filer then only need this)',
      'If you are new then provide 👇🏼👇🏼 below otherwise not',
      'ID Card Picture',
      'Email Address',
      'Phone Number',
      'Bank Account Details if you have Bank Account',
      'Property Details if you own any property',
      'Vehicle details If you own any car or bike',
      'Salary person or Business owner'
    ]
  },
  {
    id: 'filer',
    title: 'Business File Return',
    price: '7,000',
    description: 'Become an active tax filer',
    image: '/images/tax.jpg',
    category: 'Status',
    duration: '24-48 hours after document submission',
    requirements: [
      'ID Card Picture',
      'Email Address',
      'Phone Number',
      'Bank Account Details if you have Bank Account',
      'Property Details if you own any property.',
      'Vehicle details If you own any car or bike.',
      'salary person or Business owner.'
    ]
  },
  {
    id: 'gst',
    title: 'GST Registration',
    price: '10,000',
    description: 'Goods and Services Tax registration',
    image: '/images/gst.jpg',
    category: 'Registration',
    duration: '5-7 working days',
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
    ]
  },
  {
    id: 'pra',
    title: 'PRA Registration',
    price: '10,000',
    description: 'Punjab Revenue Authority registration',
    image: '/images/pra-registration.png',
    category: 'Registration',
    duration: '5-7 working days',
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
    ]
  },
  {
    id: 'chamber',
    title: 'Chamber of Commerce',
    price: '18,000',
    description: 'Membership registration',
    image: '/images/chamber-commerce.jpg',
    category: 'Registration',
    duration: '5-7 working days',
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
    ]
  }
];

export default function PersonalServices() {
  return (
    <div className="min-h-screen bg-[#D9E8FF]">
      <Head>
        <title>Personal Tax Services Pakistan | NIN, NTN, Tax Return Filing - Akbar Tax Store</title>
        <meta name="description" content="Professional personal tax services in Pakistan. NIN registration, NTN certificate, tax return filing, GST registration, FBR compliance. Fast, affordable & expert tax solutions." />
        <meta name="keywords" content="personal tax services Pakistan, NIN registration, NTN certificate, tax return filing, income tax return, FBR tax filer, GST registration Pakistan, PRA registration, chamber of commerce, tax consultant Pakistan, FBR services, tax compliance Pakistan, individual tax filing, business tax return, tax certificate" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Personal Tax Services Pakistan | NIN, NTN, Tax Return Filing - Akbar Tax Store" />
        <meta property="og:description" content="Expert personal tax services in Pakistan. NIN registration, NTN certificate, tax return filing, GST registration. Fast processing & professional guidance." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://akbartaxstore.com/personal" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Personal Tax Services Pakistan | NIN, NTN, Tax Return Filing" />
        <meta name="twitter:description" content="Professional tax services for individuals in Pakistan. NIN, NTN, tax return filing, GST registration and FBR compliance services." />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://akbartaxstore.com/personal" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Personal Tax Services Pakistan",
            "description": "Professional personal tax services including NIN registration, NTN certificate, tax return filing, GST registration and FBR compliance services",
            "provider": {
              "@type": "Organization",
              "name": "Akbar Tax Store",
              "url": "https://akbartaxstore.com"
            },
            "areaServed": "Pakistan",
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Personal Tax Services",
              "itemListElement": personalServices.map(service => ({
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": service.title,
                  "description": service.description,
                  "price": service.price,
                  "priceCurrency": "PKR"
                }
              }))
            }
          })}
        </script>
      </Head>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#072971] via-[#0040A8] to-[#072971] text-white py-20">
        <div className="absolute inset-0 bg-[#050505]/10"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center bg-[#FFFFFF]/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <span className="text-sm font-medium">Personal Tax Services Pakistan</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Professional Tax Services
            <span className="block text-[#D9E8FF]">Made Simple</span>
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            From NIN registration to becoming a filer - we handle all your tax requirements with expertise and care.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#072971] mb-4">Our Personal Tax Services</h2>
            <p className="text-[#050505]/70 max-w-2xl mx-auto">Comprehensive personal tax solutions to keep you compliant and worry-free</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personalServices.map((service) => (
              <Link
                href={`/personal/${service.id}`}
                key={service.id}
                className="group block"
              >
                <div className="bg-[#FFFFFF] rounded-2xl border border-[#FFFFFF] overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#0040A8]/20 hover:-translate-y-2 hover:border-[#0040A8]/30">
                  {/* Image Header */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#072971]/50 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className="inline-block px-3 py-1 text-xs font-semibold text-[#FFFFFF] bg-[#0040A8] rounded-full">
                        {service.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <div className="bg-[#FFFFFF] rounded-lg px-2 py-1 shadow-sm">
                        <span className="text-xs font-medium text-[#072971]">{service.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-[#072971] mb-2 group-hover:text-[#0040A8] transition-colors">
                      {service.title}
                    </h3>

                    <p className="text-[#050505] text-sm leading-relaxed mb-4 opacity-80">
                      {service.description}
                    </p>

                    {/* Requirements Preview */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-[#072971] mb-2">Key Requirements:</h4>
                      <ul className="text-sm text-[#050505]/70 space-y-1">
                        {service.requirements.slice(0, 2).map((req, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-[#0040A8] mr-2 text-xs">•</span>
                            {req}
                          </li>
                        ))}
                        {service.requirements.length > 2 && (
                          <li className="text-[#0040A8] font-medium text-xs">+ {service.requirements.length - 2} more requirements</li>
                        )}
                      </ul>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#D9E8FF]">
                      <div>
                        <span className="text-2xl font-bold text-[#072971]">
                          {service.price}
                          <span className="text-sm font-normal text-[#050505]/60 ml-1">PKR</span>
                        </span>
                      </div>
                      <div className="flex items-center text-[#0040A8] font-semibold text-sm group-hover:text-[#072971] transition-colors">
                        View Details
                        <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-[#FFFFFF]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#072971] mb-4">Why Choose Our Personal Tax Services?</h2>
              <p className="text-[#050505]/70">Professional expertise with a personal touch</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#D9E8FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#0040A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#072971] mb-2">Fast Processing</h3>
                <p className="text-[#050505]/70 text-sm">Quick turnaround times without compromising quality</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#D9E8FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#0040A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#072971] mb-2">Expert Guidance</h3>
                <p className="text-[#050505]/70 text-sm">Professional support throughout the entire process</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#D9E8FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#0040A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#072971] mb-2">Transparent Pricing</h3>
                <p className="text-[#050505]/70 text-sm">No hidden fees, clear pricing structure</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-[#D9E8FF]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#072971] mb-4">Simple 3-Step Process</h2>
            <p className="text-[#050505]/70 mb-12">Get your tax matters sorted in just 3 easy steps</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#0040A8] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">1</div>
                <h3 className="font-semibold text-[#072971] mb-2">Submit Documents</h3>
                <p className="text-[#050505]/70 text-sm">Upload required documents via WhatsApp or visit our office</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#0040A8] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">2</div>
                <h3 className="font-semibold text-[#072971] mb-2">Expert Processing</h3>
                <p className="text-[#050505]/70 text-sm">Our tax experts handle all the paperwork and procedures</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#0040A8] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">3</div>
                <h3 className="font-semibold text-[#072971] mb-2">Receive Documents</h3>
                <p className="text-[#050505]/70 text-sm">Get your certificates and documents ready for use</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#072971] to-[#0040A8]">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-[#FFFFFF] mb-4">
              Ready to Get Your Tax Matters Sorted?
            </h2>
            <p className="text-[#D9E8FF] mb-8 text-lg">
              Our tax experts are ready to help you choose the right service and guide you through every step of the process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-[#FFFFFF] text-[#072971] font-semibold py-3 px-8 rounded-xl hover:bg-[#D9E8FF] transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Get Tax Consultation
              </Link>
              <a
                href="tel:+923016832064"
                className="inline-flex items-center justify-center border-2 border-[#FFFFFF] text-[#FFFFFF] font-semibold py-3 px-8 rounded-xl hover:bg-[#FFFFFF] hover:text-[#072971] transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}