'use client';

// src/app/(public)/services-fees/ServicesClient.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Client Component — owns all interactive state (modal open/close, animations,
// body scroll lock). Has no metadata export — that lives in page.jsx.
//
// Receives no props — reads directly from @/constants so data is never
// serialised across the server/client boundary.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Phone, MessageCircle, Clock, FileText, CheckCircle } from 'lucide-react';
import { PERSONAL_SERVICES, BUSINESS_SERVICES, SITE_CONFIG } from '@/constants';

// ── Service card ───────────────────────────────────────────────────────────────
function ServiceCard({ service, onOpen }) {
  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">

      <div className="relative h-48 overflow-hidden">
        <Image
          src={service.image}
          alt={service.alt}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-sm font-bold" style={{ color: '#0040A8' }}>
            PKR {service.price.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3
          className="text-lg font-semibold mb-2 group-hover:text-[#0040A8] transition-colors"
          style={{ color: '#050505' }}
        >
          {service.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>

        <div className="flex items-center mb-4 text-xs" style={{ color: '#072971' }}>
          <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
          {service.duration}
        </div>

        <button
          onClick={() => onOpen(service)}
          className="w-full py-2 px-4 rounded-lg font-medium text-sm text-white
                     bg-[#0040A8] hover:bg-[#072971] transition-colors duration-200"
        >
          View Details
        </button>
      </div>

    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
// SCROLL FIX:
// The original used two nested scroll containers (overflow-hidden wrapper +
// maxHeight inner div) which caused iOS touch-scroll to stick and content to
// be clipped on short screens.
//
// Fix: single scroll container on the modal panel itself (overflow-y-auto +
// max-h-[92vh]). The sticky header pins inside the scroll with `sticky top-0`.
// No inner div has its own maxHeight — everything scrolls as one unit.
function ServiceModal({ service, isAnimating, onClose }) {

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center
                  p-0 sm:p-4 transition-opacity duration-300
                  ${isAnimating ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — single scroll container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={service.title}
        onClick={(e) => e.stopPropagation()}
        className={`relative z-10 bg-white w-full sm:max-w-2xl shadow-2xl
                    overflow-y-auto overscroll-contain
                    max-h-[92vh] sm:max-h-[90vh]
                    rounded-t-2xl sm:rounded-2xl
                    transform transition-all duration-300 ease-out
                    ${isAnimating
                      ? 'translate-y-0 opacity-100 scale-100'
                      : 'translate-y-8 opacity-0 scale-95'}`}
      >

        {/* Sticky header — stays pinned while body scrolls below */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-[#072971] to-[#0040A8] p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30
                       transition-colors p-2 rounded-full"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="pr-10">
            <h2 className="text-xl font-bold mb-2">{service.title}</h2>
            <span className="text-base font-semibold bg-white/20 px-4 py-1.5 rounded-full inline-block">
              PKR {service.price.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="p-6 pb-10">

          <p className="text-gray-700 text-base mb-6">{service.description}</p>

          {/* Processing time */}
          <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: '#D9E8FF' }}>
            <h3 className="font-semibold mb-1 flex items-center gap-2 text-sm"
                style={{ color: '#072971' }}>
              <Clock className="w-4 h-4" />
              Processing Time
            </h3>
            <p className="text-sm" style={{ color: '#0040A8' }}>{service.duration}</p>
          </div>

          {/* Documents required */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm"
                style={{ color: '#072971' }}>
              <FileText className="w-4 h-4" />
              Documents Required
            </h3>
            <div className="space-y-2">
              {service.requirements.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5"
                               style={{ color: '#0040A8' }} />
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6 p-4 bg-green-50 rounded-xl">
            <h3 className="font-semibold text-green-800 mb-3 text-sm">Important Notes</h3>
            <div className="space-y-2">
              {[
                'Prices inclusive of all government fees',
                'No hidden charges',
              ].map((note) => (
                <div key={note} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-green-700 text-sm">{note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/contact?service=${encodeURIComponent(service.title)}`}
              onClick={onClose}
              className="flex-1 py-3 px-6 rounded-xl font-semibold text-sm text-white
                         text-center bg-[#0040A8] hover:bg-[#072971] transition-colors"
            >
              Book This Service
            </Link>
            <a
              href={SITE_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-6 rounded-xl font-semibold text-sm text-white
                         text-center bg-[#25D366] hover:bg-[#22c55e] transition-colors
                         flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Category section ───────────────────────────────────────────────────────────
function CategorySection({ icon, heading, services, onOpen }) {
  return (
    <section className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl
                        bg-gradient-to-r from-[#072971] to-[#0040A8]
                        text-white text-2xl mb-4 shadow-lg">
          {icon}
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#072971' }}>
          {heading}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[#072971] to-[#0040A8]
                        mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}

// ── Main Client Component ──────────────────────────────────────────────────────
export default function ServicesClient() {
  const [selectedService, setSelectedService] = useState(null);
  const [isAnimating,     setIsAnimating]     = useState(false);

  const openModal = useCallback((service) => {
    setSelectedService(service);
    // Double rAF: guarantees DOM has painted before CSS transition class fires
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsAnimating(true));
    });
  }, []);

  const closeModal = useCallback(() => {
    setIsAnimating(false);
    // Wait for 300ms CSS transition to finish, then unmount the modal
    setTimeout(() => setSelectedService(null), 300);
  }, []);

  // Lock body scroll while modal is open; restore on close / unmount
  useEffect(() => {
    document.body.style.overflow = selectedService ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedService]);

  return (
    <div className="min-h-screen bg-[#F7FAFF]">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#072971] to-[#0040A8] text-white
                      py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Tax &amp; Business Registration Services in Pakistan
          </h1>
          <p className="text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed"
             style={{ color: '#D9E8FF' }}>
            Transparent pricing for all FBR tax filing and business registration services.
            No hidden charges.
          </p>
        </div>
      </div>

      {/* ── Service categories ─────────────────────────────────────────────── */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-20">

          <CategorySection
            icon="👤"
            heading="Personal Tax Services"
            services={PERSONAL_SERVICES}
            onOpen={openModal}
          />

          <CategorySection
            icon="🏢"
            heading="Business Registration Services Pakistan"
            services={BUSINESS_SERVICES}
            onOpen={openModal}
          />

        </div>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <div className="mt-20 bg-gradient-to-r from-[#072971] to-[#0040A8]
                        rounded-2xl p-8 lg:p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Need a Custom Package?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: '#D9E8FF' }}>
            Contact us for bulk discounts or customised service bundles for your business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={SITE_CONFIG.phoneTel}
              className="bg-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-100
                         transition-colors flex items-center justify-center gap-3 text-lg"
              style={{ color: '#0040A8' }}
            >
              <Phone className="w-5 h-5" />
              Call Now
            </a>
            <a
              href={SITE_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white px-8 py-4 rounded-xl font-semibold
                         hover:bg-[#22c55e] transition-colors
                         flex items-center justify-center gap-3 text-lg"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      {selectedService && (
        <ServiceModal
          service={selectedService}
          isAnimating={isAnimating}
          onClose={closeModal}
        />
      )}

    </div>
  );
}