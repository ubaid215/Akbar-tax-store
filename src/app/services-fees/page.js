"use client";
import { useState, useEffect } from 'react';
import { X, Phone, MessageCircle, Clock, FileText, CheckCircle } from 'lucide-react';
import Image from 'next/image';

const ServicesFeePage = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const openModal = (service) => {
    setSelectedService(service);
    setIsOpening(true);
    // Small delay to ensure state updates before starting animation
    setTimeout(() => {
      setIsAnimating(true);
    }, 10);
  };

  const closeModal = () => {
    setIsAnimating(false);
    setIsOpening(false);
    // Wait for animation to complete before hiding modal
    setTimeout(() => {
      setSelectedService(null);
    }, 300);
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedService) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedService]);

  const services = [
    {
      id: 'personal',
      category: 'Personal Services',
      icon: '👤',
      color: 'from-[#072971] to-[#0040A8]',
      services: [
        {
          id: 'personal-nin',
          name: 'NIN Registration',
          fee: '1,500 PKR',
          description: 'National Identity Number registration for tax purposes',
          image: '/images/nin-registration.jpg',
          requirements: [
            'ID card copy (front & back)',
            'Active mobile number',
            'Email address'
          ],
          process: '24 Hours'
        },
        {
          id: 'personal-ntn',
          name: 'NTN Certificate',
          fee: '1,500 PKR',
          description: 'National Tax Number registration',
          image: '/images/ntn-certificate.jpg',
          requirements: [
            'CNIC copy',
            'Mobile number',
            'Email address',
          ],
          process: '24 Hours'
        },
        {
          id: 'personal-tax-return',
          name: 'Tax Return Filing',
          fee: '4,000 PKR',
          description: 'Annual income tax return filing',
          image: '/images/tax-return.jpg',
          requirements: [
            'Username and Password, (If Already Filer)',
            'ID Card Picture',
            'Email Address',
            'Phone Number',
            'Bank Account Details if you have Bank Account',
            'Property Details if you own any property',
            'Vehicle details If you own any car or bike',
            'Salary person or Business owner'
          ],
          process: '24-48 hours after document submission'
        },
        {
          id: 'personal-filer',
          name: 'Business File Return',
          fee: '7,000 PKR',
          description: 'Become an active tax filer',
          image: '/images/filer-status.jpg',
          requirements: [
            'ID Card Picture',
            'Email Address',
            'Phone Number',
            'Bank Account Details if you have Bank Account',
            'Property Details if you own any property',
            'Vehicle details If you own any car or bike',
            'Salary person or Business owner'
          ],
          process: '24-48 hours after document submission'
        },
        {
          id: 'personal-gst',
          name: 'GST Registration',
          fee: '10,000 PKR',
          description: 'Goods and Services Tax registration',
          image: '/images/gst.jpg',
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
            'Bank maintenance Certificate (Business-bank)',
          ],
          process: '5-7 working days'
        },
        {
          id: 'personal-pra',
          name: 'PRA Registration',
          fee: '10,000 PKR',
          description: 'Punjab Revenue Authority registration',
          image: '/images/pra-registration.png',
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
            'Bank maintenance Certificate (Business-bank)',
          ],
          process: '5-7 working days'
        },
        {
          id: 'personal-chamber',
          name: 'Chamber of Commerce',
          fee: '18,000 PKR',
          description: 'Membership registration',
          image: '/images/chamber-commerce.jpg',
          requirements: [
            'ID Card Picture',
            'Phone Number',
            'Email ID',
            'Business Name',
            'Business Address',
            'Business Principal Activity',
            'Person Signature',
            'White Background Picture',
            '2 years Tax Returns Copy',
          ],
          process: '5-7 working days'
        },
      ]
    },
    {
      id: 'business',
      category: 'Business Services',
      icon: '🏢',
      color: 'from-[#072971] to-[#0040A8]',
      services: [
        {
          id: 'business-nin',
          name: 'NIN Registration',
          fee: '1,500 PKR',
          description: 'National Identity Number registration for tax purposes',
          image: '/images/nin-registration.jpg',
          requirements: [
            'ID card copy (front & back)',
            'Active mobile number',
            'Email address'
          ],
          process: '24 Hours'
        },
        {
          id: 'business-ntn',
          name: 'NTN Certificate',
          fee: '1,500 PKR',
          description: 'National Tax Number registration',
          image: '/images/ntn-certificate.jpg',
          requirements: [
            'CNIC copy',
            'Mobile number',
            'Email address',
          ],
          process: '24 Hours'
        },
        {
          id: 'business-tax-return',
          name: 'Tax Return Filing',
          fee: '4,000 PKR',
          description: 'Annual income tax return filing',
          image: '/images/tax-return.jpg',
          requirements: [
            'Username and Password, (If Already Filer)',
            'ID Card Picture',
            'Email Address',
            'Phone Number',
            'Bank Account Details if you have Bank Account',
            'Property Details if you own any property',
            'Vehicle details If you own any car or bike',
            'Salary person or Business owner'
          ],
          process: '24-48 hours after document submission'
        },
        {
          id: 'business-filer',
          name: 'Business File Return',
          fee: '7,000 PKR',
          description: 'Become an active tax filer',
          image: '/images/filer-status.jpg',
          requirements: [
            'ID Card Picture',
            'Email Address',
            'Phone Number',
            'Bank Account Details if you have Bank Account',
            'Property Details if you own any property',
            'Vehicle details If you own any car or bike',
            'Salary person or Business owner'
          ],
          process: '24-48 hours after document submission'
        },
        {
          id: 'business-reg',
          name: 'Business Registration',
          fee: '15,000 PKR',
          description: 'Official business registration with relevant authorities',
          image: '/images/business-registration.jpg',
          requirements: [
            'Owner/partner CNICs',
            'Phone Number',
            'Email Address',
            'Business name',
            'Business Address Proof',
            'Business Principal Activity',
          ],
          process: '1-3 working days'
        },
        {
          id: 'company-reg',
          name: 'Company Registration (SECP)',
          fee: '40,000 PKR',
          description: 'Private limited company registration',
          image: '/images/company-registration.jpg',
          requirements: [
            'Owner Details: Name, CNIC, Contact, Email, Share holder',
            'Company Details: Name, CNIC, Contact, Email',
            'Company Address',
            'Company Category',
            'Director: Name, CNIC, Email, Contact, Share Holder'
          ],
          process: '24-48 hours after document submission'
        },
        {
          id: 'firm-reg',
          name: 'Firm Registration',
          fee: '40,000 PKR',
          description: 'Business Firm registration',
          image: '/images/firm-registration.jpg',
          requirements: [
            'Owner Details: Name, CNIC, Contact, Email, Share holder',
            'Firm Details: Name',
            'Company Address',
            'Company Category',
            'Director: Name, CNIC, Email, Contact, Share Holder'
          ],
          process: '3-5 working days'
        },
        {
          id: 'trademark',
          name: 'Trademark Registration',
          fee: '20,000 PKR',
          description: 'Brand name/logo protection',
          image: '/images/trademark.jpg',
          requirements: [
            'Owner/partner CNICs',
            'Phone Number',
            'Email Address',
            'Business name',
            'Business Address Proof',
            'Business Principal Activity',
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
          image: '/images/import-export.jpg',
          requirements: [
            'ID card Picture',
            'Phone Number (reg on NTN)',
            'Iris login',
            'Email ID (reg on NTN)'
          ],
          process: '24-48 hours after document submission'
        },
        {
          id: 'business-gst',
          name: 'GST Registration',
          fee: '40,000 PKR',
          description: 'Goods and Services Tax registration',
          image: '/images/gst.jpg',
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
            'Bank maintenance Certificate (Business-bank)',
          ],
          process: '5-7 working days'
        },
        {
          id: 'business-pra',
          name: 'PRA Registration',
          fee: '10,000 PKR',
          description: 'Punjab Revenue Authority registration',
          image: '/images/pra-registration.png',
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
            'Bank maintenance Certificate (Business-bank)',
          ],
          process: '5-7 working days'
        },
        {
          id: 'business-chamber',
          name: 'Chamber of Commerce',
          fee: '18,000 PKR',
          description: 'Membership registration',
          image: '/images/chamber-commerce.jpg',
          requirements: [
            'ID Card Picture',
            'Phone Number',
            'Email ID',
            'Business Name',
            'Business Address',
            'Business Principal Activity',
            'Person Signature',
            'White Background Picture',
            '2 years Tax Returns Copy',
          ],
          process: '5-7 working days'
        },
        {
          id: 'dnfbp',
          name: 'DNFBP Registration',
          fee: '10,000 PKR',
          description: 'Designated Non-Financial Business registration',
          image: '/images/dnfbp.png',
          requirements: [
            'ID Card Picture',
            'Phone Number',
            'Email ID',
            'Business Name',
            'Business Address',
            'Business Principal Activity',
            'Police Character Certificate',
            'Property/office agreement',
            'Bank maintenance Certificate (Business bank)'
          ],
          process: '4-5 working days'
        },
        {
          id: 'accounting',
          name: 'Accountant and Financial Reporting',
          fee: '25,000 PKR',
          description: 'Accountant and financial reporting from experts',
          image: '/images/accounting-finance.jpg',
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
          process: '4-5 working days'
        },
        {
          id: 'bookkeeping',
          name: 'Bookkeeping Service',
          fee: '7,000 PKR',
          description: 'Professional bookkeeping services',
          image: '/images/bookkeeping.jpg',
          requirements: [
            'No Document Required',
          ],
          process: '4-5 working days'
        },
        {
          id: 'stock',
          name: 'Stock Report',
          fee: '10,000 PKR',
          description: 'Detailed stock reporting and analysis',
          image: '/images/stock-report.jpg',
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
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#072971] to-[#0040A8] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Our Services & Fees
          </h1>
          <p className="text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#D9E8FF' }}>
            Transparent pricing for all our tax and business services
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Service Categories */}
        <div className="space-y-16">
          {services.map((category) => (
            <div key={category.id} className="space-y-8">
              {/* Category Header */}
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${category.color} text-white text-2xl mb-4 shadow-lg`}>
                  {category.icon}
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#072971' }}>
                  {category.category}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-[#072971] to-[#0040A8] mx-auto rounded-full"></div>
              </div>

              {/* Services Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {category.services.map((service) => (
                  <div
                    key={service.id}
                    className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
                  >
                    {/* Service Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-lg font-bold" style={{ color: '#0040A8' }}>
                          {service.fee}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Service Info */}
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-[#0040A8] transition-colors" style={{ color: '#050505' }}>
                        {service.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {service.description}
                      </p>

                      {/* Processing Time */}
                      <div className="flex items-center mb-4 text-xs" style={{ color: '#072971' }}>
                        <Clock className="w-4 h-4 mr-1" />
                        {service.process}
                      </div>

                      {/* View Details Button */}
                      <button
                        onClick={() => openModal(service)}
                        className="w-full py-2 px-4 rounded-lg transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg text-white"
                        style={{ backgroundColor: '#0040A8' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#072971'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#0040A8'}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-[#072971] to-[#0040A8] rounded-2xl p-8 lg:p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Need a Custom Package?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: '#D9E8FF' }}>
            Contact us for bulk discounts or customized service bundles for your business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+923016832064"
              className="bg-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-3 shadow-lg text-lg"
              style={{ color: '#0040A8' }}
            >
              <Phone className="w-5 h-5" />
              Call Now
            </a>
            <a
              href="https://wa.me/923016832064"
              className="bg-[#25D366] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#22c55e] transition-colors flex items-center justify-center gap-3 shadow-lg text-lg"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* Modal with Enhanced Animations */}
      {selectedService && (
        <div 
          className={`fixed inset-0 z-50 transition-all duration-300 ease-out ${
            isOpening ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Backdrop */}
          <div 
            className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 ${
              isAnimating ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={closeModal}
          ></div>
          
          {/* Modal Container */}
          <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
            <div 
              className={`bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-300 ease-out ${
                isAnimating 
                  ? 'scale-100 opacity-100' 
                  : 'scale-75 opacity-0'
              }`}
            >
              {/* Modal Header - Removed image for cleaner UI */}
              <div className="bg-gradient-to-r from-[#072971] to-[#0040A8] p-6 text-white relative">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200 p-2 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="pr-10">
                  <h3 className="text-2xl font-bold mb-2">{selectedService.name}</h3>
                  <p className="text-xl font-semibold bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full inline-block">
                    {selectedService.fee}
                  </p>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 10rem)' }}>
                {/* Description */}
                <div className="mb-6">
                  <p className="text-gray-700 text-lg">{selectedService.description}</p>
                </div>

                {/* Processing Time */}
                <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: '#D9E8FF' }}>
                  <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: '#072971' }}>
                    <Clock className="w-5 h-5" />
                    Processing Time
                  </h4>
                  <p style={{ color: '#0040A8' }}>{selectedService.process}</p>
                </div>

                {/* Requirements */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#072971' }}>
                    <FileText className="w-5 h-5" />
                    Requirements
                  </h4>
                  <div className="space-y-2">
                    {selectedService.requirements.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#0040A8' }} />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Important Notes */}
                <div className="mb-6 p-4 bg-green-50 rounded-xl">
                  <h4 className="font-semibold text-green-800 mb-3">Important Notes</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <span className="text-green-700 text-sm">Prices inclusive of all government fees</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <span className="text-green-700 text-sm">No hidden charges</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={`/contact?service=${encodeURIComponent(selectedService.name)}`}
                    className="flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200 text-center shadow-lg hover:shadow-xl text-white"
                    style={{ backgroundColor: '#0040A8' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#072971'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#0040A8'}
                  >
                    Book This Service
                  </a>
                  <a
                    href="https://wa.me/923016832064"
                    className="flex-1 bg-[#25D366] text-white py-4 px-6 rounded-xl font-semibold hover:bg-[#22c55e] transition-colors text-center flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesFeePage;