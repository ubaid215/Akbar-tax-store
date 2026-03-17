'use client';


import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { ABOUT_STATS, ABOUT_FEATURES, SITE_CONFIG } from '@/constants';

// ── Scroll animation hook ─────────────────────────────────────────────────────
// Content starts visible. CSS class adds a lift animation on first intersection.
function useScrollReveal(selector = '.reveal') {
  useEffect(() => {
    const els = document.querySelectorAll(selector);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [selector]);
}

// ── Stat chip used in the hero ────────────────────────────────────────────────
function HeroChip({ value, label }) {
  return (
    <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-4 min-w-[110px]">
      <span className="text-2xl sm:text-3xl font-bold text-white">{value}</span>
      <span className="text-xs text-blue-200 mt-1 text-center leading-tight">{label}</span>
    </div>
  );
}

export default function AboutClient() {
  useScrollReveal();

  return (
    <>
      {/* Reveal animation styles */}
      <style>{`
        .reveal { transition: opacity 0.6s ease, transform 0.6s ease; }
        .reveal:not(.revealed) { opacity: 0; transform: translateY(24px); }
        @media (prefers-reduced-motion: reduce) {
          .reveal:not(.revealed) { opacity: 1; transform: none; }
        }
      `}</style>

      <div className="min-h-screen bg-white">

        {/* ════════════════════════════════════════════════════════════════
            HERO
            H1 targets: "tax consultant Faisalabad Pakistan"
            Visual: dark navy full-bleed, diagonal bottom cut, stat chips
        ════════════════════════════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden pt-16 pb-28 sm:pt-20 sm:pb-36 px-4 sm:px-6 lg:px-12"
          style={{ background: 'linear-gradient(135deg, #050F2E 0%, #072971 50%, #0040A8 100%)' }}
        >
          {/* Decorative diagonal bottom cut */}
          <div
            className="absolute bottom-0 left-0 right-0 h-16 bg-white"
            style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}
          />

          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10"
               style={{ background: 'radial-gradient(circle, #60A5FA, transparent)', transform: 'translate(30%, -30%)' }} />
          <div className="absolute bottom-20 left-0 w-56 h-56 rounded-full opacity-10"
               style={{ background: 'radial-gradient(circle, #93C5FD, transparent)', transform: 'translate(-30%, 0)' }} />

          <div className="relative max-w-5xl mx-auto text-center">
            {/* Breadcrumb — lightweight SEO signal */}
            <nav className="flex justify-center mb-8" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-xs text-blue-300">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li aria-hidden="true" className="text-blue-500">›</li>
                <li className="text-blue-100">About</li>
              </ol>
            </nav>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-semibold text-blue-100 tracking-wide uppercase">
                Tax Consultant Faisalabad, Pakistan
              </span>
            </div>

            {/*
              H1 — keyword target: "tax consultant Faisalabad Pakistan"
              Original H1 "Pakistan's Most Trusted Tax & Business Partner"
              is a brand tagline with zero search volume.
            */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Trusted{' '}
              <span style={{ color: '#60A5FA' }}>Tax Consultant</span>
              <span className="block mt-1">in Faisalabad, Pakistan</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed">
              Akbar Tax Store helps individuals and businesses file FBR tax returns,
              register for NTN, and get on the Active Taxpayer List — all online,
              in as little as 24 hours.
            </p>

            {/* Stat chips row */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {ABOUT_STATS.map((s) => (
                <HeroChip key={s.label} value={s.value} label={s.label} />
              ))}
            </div>

            <Link
              href="/services-fees"
              className="inline-flex items-center gap-2 bg-white text-[#072971] font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg text-base"
            >
              View All Services &amp; Fees
            </Link>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            ABOUT / INTRO
            H2 targets: "FBR tax filing business registration Pakistan"
            Asymmetric: text left, highlight card right
        ════════════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

              {/* Text */}
              <div className="reveal">
                {/* Eyebrow */}
                <div
                  className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-3 py-1 rounded-full"
                  style={{ backgroundColor: '#D9E8FF', color: '#0040A8' }}
                >
                  Who We Are
                </div>

                {/*
                  H2 — keyword: "FBR tax filing & business registration Pakistan"
                */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 leading-tight" style={{ color: '#050505' }}>
                  FBR Tax Filing &amp; Business Registration Services in Pakistan
                </h2>

                <p className="text-base lg:text-lg leading-relaxed mb-5" style={{ color: '#374151' }}>
                  Akbar Tax Store is a modern tax consultancy based in{' '}
                  <strong>Faisalabad, Pakistan</strong>. We specialise in FBR
                  income tax return filing, NTN registration on the IRIS portal,
                  SECP company registration, GST, PRA, and trademark services —
                  serving 500+ clients across all of Pakistan.
                </p>

                <p className="text-base leading-relaxed mb-8" style={{ color: '#374151' }}>
                  Our clients don't just file taxes — they strategically use
                  active filer status to pay lower withholding taxes on property,
                  banking, and vehicles. We handle all government portal
                  submissions so you can focus on growing your business.
                </p>

                <div className="space-y-3">
                  {[
                    '24-hour processing for NTN registration and tax returns',
                    'FBR IRIS portal submissions handled by our certified team',
                    '100% online — no office visit required anywhere in Pakistan',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#0040A8' }} />
                      <span className="text-sm lg:text-base" style={{ color: '#374151' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlight card */}
              <div className="reveal">
                <div
                  className="rounded-2xl p-8 lg:p-10 relative overflow-hidden"
                  style={{ backgroundColor: '#072971' }}
                >
                  {/* Decorative circle */}
                  <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 bg-white"
                       style={{ transform: 'translate(30%, -30%)' }} />

                  <div
                    className="inline-block text-xs font-bold tracking-widest uppercase mb-6 px-3 py-1 rounded-full"
                    style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#D9E8FF' }}
                  >
                    The Akbar Advantage
                  </div>

                  <blockquote
                    className="text-lg lg:text-xl font-medium leading-relaxed mb-8 text-white"
                  >
                    "We don't just handle your taxes — we optimise your entire
                    financial strategy for maximum growth and FBR compliance."
                  </blockquote>

                  {/* Key metric */}
                  <div
                    className="rounded-xl p-5 mb-6"
                    style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                  >
                    <div className="text-4xl font-bold text-white mb-1">96%</div>
                    <div className="text-sm" style={{ color: '#BAD4FF' }}>Client Retention Rate</div>
                  </div>

                  {/* Location trust signal */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Based in</div>
                      <div className="text-sm" style={{ color: '#BAD4FF' }}>
                        {SITE_CONFIG.address.street}, {SITE_CONFIG.address.city}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            FEATURES — Why Choose Us
            H2 targets: "why choose Akbar Tax Store"
            Layout: horizontal cards with left accent border
        ════════════════════════════════════════════════════════════════ */}
        <section
          className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12"
          style={{ backgroundColor: '#F8FAFF' }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 reveal">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3" style={{ color: '#050505' }}>
                Why Businesses Choose{' '}
                <span style={{ color: '#0040A8' }}>Akbar Tax Store</span>
              </h2>
              <p className="text-base lg:text-lg max-w-2xl mx-auto" style={{ color: '#6B7280' }}>
                Results speak louder than promises. Here's what sets us apart
                in Pakistan's tax industry.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {ABOUT_FEATURES.map((f) => (
                <div
                  key={f.label}
                  className="reveal bg-white rounded-xl p-6 flex gap-4 items-start border-l-4 shadow-sm hover:shadow-md transition-shadow"
                  style={{ borderLeftColor: '#0040A8' }}
                >
                  <div
                    className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: '#D9E8FF' }}
                  >
                    <span className="text-xl font-bold" style={{ color: '#0040A8' }}>{f.value}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm lg:text-base mb-1" style={{ color: '#050505' }}>
                      {f.label}
                    </h3>
                    <p className="text-xs lg:text-sm" style={{ color: '#6B7280' }}>{f.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            VISION & MISSION
            Visually distinct: Vision = filled navy, Mission = outline
        ════════════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">

              {/* Vision — filled */}
              <div
                className="reveal rounded-2xl p-8 lg:p-10 text-white relative overflow-hidden"
                style={{ backgroundColor: '#072971' }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 bg-white"
                     style={{ transform: 'translate(30%,-30%)' }} />
                <div
                  className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#D9E8FF' }}
                >
                  Our Vision
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-5">
                  Tax-Smart Pakistan
                </h2>
                <p className="text-base leading-relaxed mb-5" style={{ color: '#BAD4FF' }}>
                  Imagine a Pakistan where every business owner understands their
                  tax benefits, every startup gets registered in hours not months,
                  and every entrepreneur has a trusted financial advisor in their
                  pocket.
                </p>
                <p className="text-sm font-semibold text-white">
                  That's the Pakistan we're building — one client at a time.
                </p>
              </div>

              {/* Mission — outlined */}
              <div
                className="reveal rounded-2xl p-8 lg:p-10 relative overflow-hidden border-2"
                style={{ borderColor: '#0040A8', backgroundColor: '#F8FAFF' }}
              >
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-5"
                     style={{ background: '#0040A8', transform: 'translate(-30%, 30%)' }} />
                <div
                  className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
                  style={{ backgroundColor: '#D9E8FF', color: '#0040A8' }}
                >
                  Our Mission
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-5" style={{ color: '#072971' }}>
                  Your Success
                </h2>
                <p className="text-base leading-relaxed mb-5" style={{ color: '#374151' }}>
                  To make FBR tax filing faster than ordering food online,
                  SECP business registration simpler than opening a bank account,
                  and financial growth strategies accessible to every Pakistani
                  entrepreneur.
                </p>
                <p className="text-sm font-semibold" style={{ color: '#0040A8' }}>
                  We measure our success by your savings and business growth.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            CTA
            WhatsApp FIXED: was a <button> with no href — now an <a> tag
        ════════════════════════════════════════════════════════════════ */}
        <section
          className="py-16 sm:py-20 px-4 sm:px-6 lg:px-12"
          style={{ background: 'linear-gradient(135deg, #0040A8 0%, #072971 100%)' }}
        >
          <div className="max-w-4xl mx-auto text-center reveal">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-5">
              Ready to Save Thousands in Taxes?
            </h2>
            <p className="text-base sm:text-lg text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join Pakistan's fastest-growing community of tax-smart entrepreneurs.
              Get your free consultation in the next 15 minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              {/* Internal route — Link */}
              <Link
                href="/book-meeting"
                className="w-full sm:w-auto bg-white text-[#072971] font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg text-base"
              >
                Start Free Consultation
              </Link>
              {/* External URL — <a>. Was a <button> with no href in original. */}
              <a
                href={SITE_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg text-base flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.63"/>
                </svg>
                WhatsApp Now
              </a>
            </div>

            <p className="text-xs text-blue-200">
              Free consultation · No obligations · Expert advice in Urdu &amp; English
            </p>
          </div>
        </section>

      </div>
    </>
  );
}