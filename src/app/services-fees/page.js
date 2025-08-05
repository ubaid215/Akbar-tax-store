"use client";
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const ServicesFeePage = () => {
  const [expandedService, setExpandedService] = useState(null);

  const toggleService = (id) => {
    setExpandedService(expandedService === id ? null : id);
  };

  const services = [
    {
      id: 'personal',
      category: 'Personal Services',
      icon: '/icons/personal-tax.png',
      services: [
        {
          id: 'nin',
          name: 'NIN Registration',
          fee: '1,500 PKR',
          description: 'National Identity Number registration for tax purposes',
          requirements: [
            'ID card copy (front & back)',
            'Active mobile number',
            'Email address'
          ],
          process: '24 Hours'
        },
        {
          id: 'ntn',
          name: 'NTN Certificate',
          fee: '1,500 PKR',
          description: 'National Tax Number registration',
          requirements: [
            'CNIC copy',
            'Mobile number',
            'Email address',
          ],
          process: '24 Hours'
        },
        {
          id: 'tax-return',
          name: 'Tax Return Filing',
          fee: '4,000 PKR',
          description: 'Annual income tax return filing',
          requirements: [
            'Username and Password',
          ],
          process: '24-48 hours after document submission'
        },
        {
          id: 'filer',
          name: 'Filer Registration',
          fee: '7,000 PKR',
          description: 'Become an active tax filer',
          requirements: [
            'ID Card Picture',
            'Email Address',
            'Phone Number',
            'Bank Account Details if you have Bank Account',
            'Property Details if you own any property.',
            'Vehicle details If you own any car or bike.',
            'salary person or Business owner.'
          ],
          process: '24-48 hours after document submission'
        },
         {
          id: 'gst',
          name: 'GST Registration',
          fee: '10,000 PKR',
          description: 'Goods and Services Tax registration',
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
            'Bank maintenance Certificate.(Business-bank)',
          ],
          process: '5-7 working days'
        },
        {
          id: 'pra',
          name: 'PRA Registration',
          fee: '10,000 PKR',
          description: 'Punjab Revenue Authority registration',
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
            'Bank maintenance Certificate.(Business-bank)',
          ],
          process: '5-7 working days'
        },
        {
          id: 'chamber',
          name: 'Chamber of Commerce',
          fee: '18,000 PKR',
          description: 'Membership registration',
          requirements: [
            'ID Card Picture',
            'Phone Number',
            'Email ID',
            'Business Name',
            'Business Address',
            'Business Principal Activity.',
            'Person Signature',
            'White Background Picture.',
            '2 years Tax Returns Copy',
          ],
          process: '5-7 working days'
        },
      ]
    },
    {
      id: 'business',
      category: 'Business Services',
      icon: '/icons/business-tax.png',
      services: [
        {
          id: 'nin',
          name: 'NIN Registration',
          fee: '1,500 PKR',
          description: 'National Identity Number registration for tax purposes',
          requirements: [
            'ID card copy (front & back)',
            'Active mobile number',
            'Email address'
          ],
          process: '24 Hours'
        },
        {
          id: 'ntn',
          name: 'NTN Certificate',
          fee: '1,500 PKR',
          description: 'National Tax Number registration',
          requirements: [
            'CNIC copy',
            'Mobile number',
            'Email address',
          ],
          process: '24 Hours'
        },
        {
          id: 'tax-return',
          name: 'Tax Return Filing',
          fee: '4,000 PKR',
          description: 'Annual income tax return filing',
          requirements: [
            'Username and Password',
          ],
          process: '24-48 hours after document submission'
        },
        {
          id: 'filer',
          name: 'Filer Registration',
          fee: '7,000 PKR',
          description: 'Become an active tax filer',
          requirements: [
            'ID Card Picture',
            'Email Address',
            'Phone Number',
            'Bank Account Details if you have Bank Account',
            'Property Details if you own any property.',
            'Vehicle details If you own any car or bike.',
            'salary person or Business owner.'
          ],
          process: '24-48 hours after document submission'
        },
        {
          id: 'business-reg',
          name: 'Business Registration',
          fee: '15,000 PKR',
          description: 'Official business registration with relevant authorities',
          requirements: [
            'Owner/partner CNICs',
            'Phone Number',
            'Email Address',
            'Business name ',
            'Business Address Proof',
            'Business Princple Activity',
          ],
          process: '1-3 working days'
        },
        {
          id: 'company-reg',
          name: 'Company Registration (SECP)',
          fee: '25,000 PKR',
          description: 'Private limited company registration',
          requirements: [
            'Owner Details :',
            `Name : ____ CNIC : ______ Contact:______ Email:______  Share holder:_____`,
            'Company Details : ',
            `Name : ____ CNIC : ______ Contact:______ Email:______`,
            'Company Address',
            'Company Category',
            'Director:',
            `Name, CNIC, Email, Contact, Share Holder`
          ],
          process: '24-48 hours after document submission'
        },
        {
          id: 'firm-reg',
          name: 'Firm Registration ',
          fee: '25,000 PKR',
          description: 'Business Firm registration',
          requirements: [
            'Owner Details :',
            `Name : ____ CNIC : ______ Contact:______ Email:______  Share holder:_____`,
            'Firm Details : ',
            'Name',
            'Company Address',
            'Company Category',
            'Director:',
            `Name, CNIC, Email, Contact, Share Holder`
          ],
          process: '3-5 working days'
        },
        {
          id: 'trademark',
          name: 'Trademark Registration',
          fee: '20,000 PKR',
          description: 'Brand name/logo protection',
          requirements: [
            'Owner/partner CNICs',
            'Phone Number',
            'Email Address',
            'Business name ',
            'Business Address Proof',
            'Business Princple Activity',
            'Person Signature',
            'Business logo white background Picture'
          ],
          process: '24-48 hours after document submission'
        },
        {
          id: 'import-export',
          name: 'Import/Export License',
          fee: '20,000 PKR',
          description: 'License for international trade',
          requirements: [
            'ID card Picture',
            'Phone Number( reg on NTN)',
            'Iris login',
            'Email ID(reg on NTN)'
          ],
          process: '24-48 hours after document submission'
        },
        {
          id: 'gst',
          name: 'GST Registration',
          fee: '10,000 PKR',
          description: 'Goods and Services Tax registration',
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
            'Bank maintenance Certificate.(Business-bank)',
          ],
          process: '5-7 working days'
        },
        {
          id: 'pra',
          name: 'PRA Registration',
          fee: '10,000 PKR',
          description: 'Punjab Revenue Authority registration',
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
            'Bank maintenance Certificate.(Business-bank)',
          ],
          process: '5-7 working days'
        },
        {
          id: 'chamber',
          name: 'Chamber of Commerce',
          fee: '18,000 PKR',
          description: 'Membership registration',
          requirements: [
            'ID Card Picture',
            'Phone Number',
            'Email ID',
            'Business Name',
            'Business Address',
            'Business Principal Activity.',
            'Person Signature',
            'White Background Picture.',
            '2 years Tax Returns Copy',
          ],
          process: '5-7 working days'
        },
        {
          id: 'dnfbp',
          name: 'DNFBP Registration',
          fee: '10,000 PKR',
          description: 'Designated Non-Financial Business registration',
          requirements: [
             'ID Card Picture',
            'Phone Number',
            'Email ID',
            'Business Name',
            'Business Address',
            'Business Principal Activity.',
            'Police Character Certificate',
            'Property/office agreement',
            'Bank maintenance Certificate.(Business bank)'
          ],
          process: '4-5 working days'
        },
        {
          id: 'accounting',
          name: 'Accountant and financial reporting',
          fee: '25,000 PKR',
          description: 'Accountant and financial reporting form experts',
          requirements: [
             'Pervious Tax Return.',
            'Pervious Financials.',
            'Current Year All Bank Statement',
            'All General Ledger',
            'Capital detail ledger.',
            'Stock detail.',
            'Administration detail ledger',
            'Hr detail ledger.',
            'Shareholder detail/paid up capital Detail'
          ],
          process: '4-5 working days'
        },
        {
          id: 'booking',
          name: 'Bookkeeping service',
          fee: '10,000 PKR',
          description: '',
          requirements: [
             'No Document Reauired',
          ],
          process: '4-5 working days'
        },
        {
          id: 'stock',
          name: 'Stock Report',
          fee: '10,000 PKR',
          description: '',
          requirements: [
             'Provide sale and purchase data',
          ],
          process: '2-5 working days'
        }
      ]
    },
    
  ];

  return (
    <div className="min-h-screen bg-[#F7FAFF]">
      <Head>
        <title>Services & Fees | Akbar Tax Store</title>
        <meta name="description" content="Complete list of all our services with transparent pricing" />
      </Head>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#072971] to-[#0040A8] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Our Services & Fees</h1>
          <p className="text-xl sm:text-2xl max-w-3xl mx-auto" style={{ color: '#D9E8FF' }}>
            Transparent pricing for all our tax and business services
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Service Categories */}
        <div className="space-y-8">
          {services.map((category) => (
            <div key={category.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Category Header */}
              <div className="flex items-center p-6 border-b border-[#D9E8FF]">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4" style={{ backgroundColor: '#D9E8FF' }}>
                  <Image
                    src={category.icon}
                    alt={category.category}
                    width={24}
                    height={24}
                  />
                </div>
                <h2 className="text-xl font-bold" style={{ color: '#072971' }}>{category.category}</h2>
              </div>

              {/* Services List */}
              <div className="divide-y divide-[#D9E8FF]">
                {category.services.map((service) => (
                  <div key={service.id} className="p-6">
                    {/* Service Summary */}
                    <div 
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleService(service.id)}
                    >
                      <div>
                        <h3 className="text-lg font-semibold" style={{ color: '#050505' }}>{service.name}</h3>
                        <p className="text-sm" style={{ color: '#072971' }}>{service.description}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="font-bold mr-4" style={{ color: '#0040A8' }}>{service.fee}</span>
                        <svg
                          className={`w-5 h-5 text-[#0040A8] transition-transform duration-300 ${expandedService === service.id ? 'transform rotate-180' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedService === service.id && (
                      <div className="mt-4 pt-4 border-t border-[#D9E8FF] animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center" style={{ color: '#0040A8' }}>
                              <Image
                                src="/icons/requirements.png"
                                alt="Requirements"
                                width={16}
                                height={16}
                                className="mr-2"
                              />
                              Requirements
                            </h4>
                            <ul className="space-y-2">
                              {service.requirements.map((item, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-[#0040A8] mr-2">•</span>
                                  <span style={{ color: '#050505' }}>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center" style={{ color: '#0040A8' }}>
                              <Image
                                src="/icons/process.png"
                                alt="Process"
                                width={16}
                                height={16}
                                className="mr-2"
                              />
                              Processing Time
                            </h4>
                            <p style={{ color: '#050505' }}>{service.process}</p>

                            <h4 className="font-semibold mt-4 mb-2 flex items-center" style={{ color: '#0040A8' }}>
                              <Image
                                src="/icons/notes.png"
                                alt="Notes"
                                width={16}
                                height={16}
                                className="mr-2"
                              />
                              Important Notes
                            </h4>
                            <ul className="space-y-2">
                              <li className="flex items-start">
                                <span className="text-[#0040A8] mr-2">•</span>
                                <span style={{ color: '#050505' }}>Prices inclusive of all government fees</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-[#0040A8] mr-2">•</span>
                                <span style={{ color: '#050505' }}>No hidden charges</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                          <Link
                            href={`/contact?service=${encodeURIComponent(service.name)}`}
                            className="px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-colors"
                            style={{ backgroundColor: '#0040A8', color: 'white' }}
                          >
                            Book This Service
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-[#072971] to-[#0040A8] rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Need a Custom Package?</h2>
          <p className="mb-6 max-w-2xl mx-auto">Contact us for bulk discounts or customized service bundles for your business needs.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+923016832064"
              className="bg-white text-[#0040A8] px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center justify-center gap-2"
            >
              <Image
                src="/icons/phone-white.png"
                alt="Call"
                width={20}
                height={20}
              />
              Call Now
            </a>
            <a
              href="https://wa.me/923016832064"
              className="bg-[#25D366] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center justify-center gap-2"
            >
              <Image
                src="/icons/whatsapp-white.png"
                alt="WhatsApp"
                width={20}
                height={20}
              />
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ServicesFeePage;