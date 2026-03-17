// src/components/Footer.jsx

import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Instagram } from 'lucide-react';
import {
  SITE_CONFIG,
  FOOTER_LINKS,
  FOOTER_SERVICES,
  FOOTER_GUIDES,
} from '@/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="text-white py-12 px-4 sm:px-6 lg:px-6"
      style={{ backgroundColor: '#072971' }}
    >
      <div className="w-full mx-auto">

        {/* ── Main grid — identical breakpoints to original ─────────────────
            mobile:  1 column
            tablet:  2 columns
            desktop: 4 columns                                              */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* ── Col 1: Brand & tagline ────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <Link href="/" aria-label="Akbar Tax Store — Home">
              <Image
                src="/logo-1.png"
                alt="Akbar Tax Store logo"
                width={70}
                height={70}
                priority
              />
            </Link>
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: '#D9E8FF' }}
            >
              Modern tax solutions made simple. We help you register your
              business, become a filer, and save taxes — all from your phone.
            </p>

            {/* Social icons */}
            <div className="flex space-x-3">
              <a
                href={SITE_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full transition-all duration-300 hover:scale-110"
                style={{ backgroundColor: '#0040A8' }}
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-white" />
              </a>
              <a
                href={SITE_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full transition-all duration-300 hover:scale-110"
                style={{ backgroundColor: '#0040A8' }}
                aria-label="WhatsApp"
              >
                {/* WhatsApp SVG — same as original Navbar */}
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.63" />
                </svg>
              </a>
            </div>
          </div>

          {/* ── Col 2: Quick Links ────────────────────────────────────────── */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#FFFFFF' }}>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-300 hover:text-white"
                    style={{ color: '#D9E8FF' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3: Our Services + Free Guides ────────────────────────── */}
          {/* Guides are added as a second sub-section within this column so
              the 4-column grid is preserved — no layout change on any screen */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#FFFFFF' }}>
              Our Services
            </h3>
            <ul className="space-y-3">
              {FOOTER_SERVICES.map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className="text-sm transition-colors duration-300 hover:text-white"
                    style={{ color: '#D9E8FF' }}
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Free Guides sub-section — same column, separated by a small
                top margin so it reads as a distinct group */}
            <h3 className="text-lg font-semibold mt-7 mb-4" style={{ color: '#FFFFFF' }}>
              Free Guides
            </h3>
            <ul className="space-y-3">
              {FOOTER_GUIDES.map((guide) => (
                <li key={guide.href}>
                  <Link
                    href={guide.href}
                    className="text-sm transition-colors duration-300 hover:text-white"
                    style={{ color: '#D9E8FF' }}
                  >
                    {guide.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 4: Contact Info ───────────────────────────────────────── */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#FFFFFF' }}>
              Contact Us
            </h3>
            <div className="space-y-3">

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#0040A8' }} />
                <span className="text-sm" style={{ color: '#D9E8FF' }}>
                  {SITE_CONFIG.address.full}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 flex-shrink-0" style={{ color: '#0040A8' }} />
                {/* tel: is external — <a> is correct here, not Link */}
                <a
                  href={SITE_CONFIG.phoneTel}
                  className="text-sm transition-colors duration-300 hover:text-white"
                  style={{ color: '#D9E8FF' }}
                >
                  {SITE_CONFIG.phoneDisplay}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 flex-shrink-0" style={{ color: '#0040A8' }} />
                {/* mailto: is external — <a> is correct here, not Link */}
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-sm transition-colors duration-300 hover:text-white"
                  style={{ color: '#D9E8FF' }}
                >
                  {SITE_CONFIG.email}
                </a>
              </div>

            </div>

            {/* WhatsApp CTA button */}
            <div className="mt-6">
              <a
                href={SITE_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 hover:scale-105"
                style={{ backgroundColor: '#0040A8' }}
              >
                <Phone className="w-4 h-4" />
                WhatsApp Us
              </a>
            </div>
          </div>

        </div>

        {/* ── Bottom bar ────────────────────────────────────────────────────── */}
        <div className="pt-8 border-t" style={{ borderColor: '#0040A8' }}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">

            <p className="text-sm text-center md:text-left" style={{ color: '#D9E8FF' }}>
              © {currentYear} {SITE_CONFIG.name}. All rights reserved.
            </p>

            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-sm" style={{ color: '#D9E8FF' }}>
                Website Develop By{' '}
                <span className="font-semibold text-white hover:text-cyan-600 hover:underline transition duration-200 cursor-pointer">
                  {SITE_CONFIG.developer}
                </span>
              </p>
              <Link
                href="/privacy-policy"
                className="text-xs transition-colors duration-300 hover:text-white"
                style={{ color: '#D9E8FF' }}
              >
                Privacy Policy
              </Link>
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
}