'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ContactCard() {
  const [downloaded, setDownloaded] = useState(false);

  // Contact information
  const contactInfo = {
    name: 'Akbar Tax Store',
    phone: '+923407300408',
    email: 'info@akbartaxstore.com',
    website: 'https://www.akbartaxstore.com',
    description: 'Fast, reliable tax filing & business registration services in Pakistan. Transparent pricing, expert guidance, stress-free process.',
  };

  // Generate vCard file
  const generateVCard = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${contactInfo.name}
ORG:${contactInfo.name}
TEL;TYPE=CELL:${contactInfo.phone}
EMAIL:${contactInfo.email}
URL:${contactInfo.website}
NOTE:${contactInfo.description}
END:VCARD`;

    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Akbar-Tax-Store.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Section with Logo */}
          <div className="bg-blue-900 pt-8 pb-6 px-4 text-center">
            <div className="w-24 h-24 mx-auto mb-3 bg-white rounded-full p-3 shadow-lg overflow-hidden">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image
                  src="/logo.jpeg"
                  alt="Akbar Tax Store Logo"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {contactInfo.name}
            </h1>
            <p className="text-white/90 text-xs sm:text-sm px-2">
              {contactInfo.description}
            </p>
          </div>

          {/* Contact Information */}
          <div className="p-4 sm:p-6 space-y-3">
            {/* Add to Contacts Button */}
            <button
              onClick={generateVCard}
              className="w-full bg-gradient-to-r from-[#2B4C7E] to-[#3A5F8F] text-white py-3 px-4 rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              {downloaded ? 'Added to Contacts!' : 'Add to Contacts'}
            </button>

            {/* WhatsApp Button */}
            <a
              href={`https://wa.me/${contactInfo.phone.replace(/\+/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] text-white py-3 px-4 rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Message on WhatsApp
            </a>

            {/* Email Button */}
            <a
              href={`mailto:${contactInfo.email}`}
              className="w-full bg-[#EA4335] text-white py-3 px-4 rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Send Email
            </a>

            {/* Website Button */}
            <a
              href={contactInfo.website}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-[#2B4C7E] to-[#3A5F8F] text-white py-3 px-4 rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              Visit Website
            </a>

            {/* Contact Info Display */}
            <div className="mt-6 pt-4 border-t border-gray-200 space-y-2 flex flex-col items-center     ">
              <a 
                href={`tel:${contactInfo.phone}`}
                className="flex items-center gap-2 text-gray-600 hover:text-[#2B4C7E] transition-colors"
              >
                <svg
                  className="w-4 h-4 text-[#2B4C7E] flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="text-xs sm:text-sm font-medium">{contactInfo.phone}</span>
              </a>
              <div className="flex items-center gap-2 text-gray-600">
                <svg
                  className="w-4 h-4 text-[#2B4C7E] flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-xs sm:text-sm font-medium break-all">{contactInfo.email}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}