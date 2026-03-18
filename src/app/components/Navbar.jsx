'use client';

// src/components/Navbar.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Changes from original:
//
// 1. All hardcoded arrays (navigation items, dropdown items) removed.
//    Data now imported from @/constants:
//      NAV_LINKS               → desktop + mobile main nav
//      NAV_CONTACT_DROPDOWN    → phone / email quick-links
//      NAV_PERSONAL_DROPDOWN   → personal service links
//      NAV_BUSINESS_DROPDOWN   → business service links
//      SITE_CONFIG             → phone numbers, WhatsApp URL, social links
//
// 2. Dropdown items rendered with a shared <DropdownItem> helper that
//    chooses <Link> (internal) or <a> (external/tel/mailto) based on the
//    `external` flag in constants — no repeated className boilerplate.
//
// 3. onMouseEnter / onMouseLeave inline style mutations replaced with
//    Tailwind hover classes (hover:bg-[#D9E8FF]) — cleaner and avoids
//    direct DOM style writes inside React render.
//
// 4. Social icon hrefs pulled from SITE_CONFIG.social instead of being
//    hardcoded — change the URL once in constants and both desktop + mobile
//    icons update automatically.
//
// 5. All logic (burger animation, clip-path toggle, handleLinkClick) is
//    untouched — behaviour is identical to the original.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  SITE_CONFIG,
  NAV_LINKS,
  NAV_CONTACT_DROPDOWN,
  NAV_PERSONAL_DROPDOWN,
  NAV_BUSINESS_DROPDOWN,
} from '@/constants';

// ── SVG icon components ───────────────────────────────────────────────────────
const IconWhatsApp = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.63" />
  </svg>
);

const IconInstagram = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const IconChevronDown = () => (
  <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor" className="transition-transform duration-200">
    <path d="M7 10l5 5 5-5z" />
  </svg>
);

const IconEmail = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const IconPerson = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const IconBusiness = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
  </svg>
);

const IconGlobe = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
  </svg>
);

// ── Shared dropdown item ──────────────────────────────────────────────────────
// Renders <a> for external/tel/mailto, <Link> for internal Next.js routes.
function DropdownItem({ item, onClick }) {
  const cls =
    'block px-4 py-2 text-sm hover:bg-[#D9E8FF] transition-colors duration-200';
  const style = { color: '#072971' };

  if (item.external) {
    return (
      <a href={item.href} className={cls} style={style} onClick={onClick}>
        {item.label}
      </a>
    );
  }
  return (
    <Link href={item.href} className={cls} style={style} onClick={onClick}>
      {item.label}
    </Link>
  );
}

// ── Dropdown wrapper ──────────────────────────────────────────────────────────
function NavDropdown({ triggerHref, triggerIcon, triggerLabel, items, isOpen, onEnter, onLeave, onItemClick }) {
  return (
    <div className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <Link
        href={triggerHref}
        className="flex items-center gap-1 text-sm font-bold hover:scale-105 transform transition-colors duration-200"
        style={{ color: '#072971' }}
      >
        {triggerIcon}
        {triggerLabel}
        <IconChevronDown />
      </Link>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-1 bg-white shadow-xl rounded-lg border-2 py-2 min-w-[200px] z-50"
          style={{ borderColor: '#0040A8' }}
        >
          {items.map((item) => (
            <DropdownItem key={item.href} item={item} onClick={onItemClick} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
export default function Navbar() {
  const [menuOpen,              setMenuOpen]              = useState(false);
  const [contactDropdown,       setContactDropdown]       = useState(false);
  const [personalDropdown,      setPersonalDropdown]      = useState(false);
  const [businessDropdown,      setBusinessDropdown]      = useState(false);
  const [internationalDropdown, setInternationalDropdown] = useState(false);

  const menuRef        = useRef(null);
  const linksRef       = useRef([]);
  const desktopLinksRef = useRef([]);

  // Burger bar refs
  const topBar    = useRef(null);
  const middleBar = useRef(null);
  const bottomBar = useRef(null);

  // Stagger desktop links on page load
  useEffect(() => {
    const links = desktopLinksRef.current.filter(Boolean);
    links.forEach((link, i) => {
      link.style.opacity   = '0';
      link.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        link.style.transition = 'all 0.4s ease-out';
        link.style.opacity    = '1';
        link.style.transform  = 'translateY(0)';
      }, 200 + i * 100);
    });
  }, []);

  const handleMenuToggle = () => {
    const opening = !menuOpen;
    setMenuOpen(opening);

    if (menuRef.current) {
      menuRef.current.style.clipPath = opening
        ? 'circle(150% at 50% 50%)'
        : 'circle(0% at 50% 50%)';
    }
    if (topBar.current && middleBar.current && bottomBar.current) {
      topBar.current.style.transform    = opening ? 'translateY(6px) rotate(45deg)'  : 'translateY(0) rotate(0deg)';
      middleBar.current.style.opacity   = opening ? '0'                              : '1';
      bottomBar.current.style.transform = opening ? 'translateY(-6px) rotate(-45deg)': 'translateY(0) rotate(0deg)';
    }
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
    if (menuRef.current) menuRef.current.style.clipPath = 'circle(0% at 50% 50%)';
    if (topBar.current && middleBar.current && bottomBar.current) {
      topBar.current.style.transform    = 'translateY(0) rotate(0deg)';
      middleBar.current.style.opacity   = '1';
      bottomBar.current.style.transform = 'translateY(0) rotate(0deg)';
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-lg">

      {/* ── Top utility strip (desktop only) ──────────────────────────────── */}
      <div
        className="hidden md:block border-b border-gray-100 px-6 py-2"
        style={{ backgroundColor: '#D9E8FF' }}
      >
        <div className="flex justify-between items-center">

          {/* Social icons */}
          <div className="flex gap-4 items-center">
            <a
              href={SITE_CONFIG.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transform transition-transform duration-200"
              style={{ color: '#072971' }}
              aria-label="WhatsApp"
            >
              <IconWhatsApp />
            </a>
            <a
              href={SITE_CONFIG.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transform transition-transform duration-200"
              style={{ color: '#072971' }}
              aria-label="Instagram"
            >
              <IconInstagram />
            </a>
          </div>

          {/* Dropdowns */}
          <div className="flex gap-6 items-center">
            <NavDropdown
              triggerHref="/contact"
              triggerIcon={<IconEmail />}
              triggerLabel="Contact"
              items={NAV_CONTACT_DROPDOWN}
              isOpen={contactDropdown}
              onEnter={() => setContactDropdown(true)}
              onLeave={() => setContactDropdown(false)}
              onItemClick={() => setContactDropdown(false)}
            />
            <NavDropdown
              triggerHref="/personal"
              triggerIcon={<IconPerson />}
              triggerLabel="Personal"
              items={NAV_PERSONAL_DROPDOWN}
              isOpen={personalDropdown}
              onEnter={() => setPersonalDropdown(true)}
              onLeave={() => setPersonalDropdown(false)}
              onItemClick={() => setPersonalDropdown(false)}
            />
            <NavDropdown
              triggerHref="/business"
              triggerIcon={<IconBusiness />}
              triggerLabel="Business"
              items={NAV_BUSINESS_DROPDOWN}
              isOpen={businessDropdown}
              onEnter={() => setBusinessDropdown(true)}
              onLeave={() => setBusinessDropdown(false)}
              onItemClick={() => setBusinessDropdown(false)}
            />
          </div>
        </div>
      </div>

      {/* ── Main nav row ───────────────────────────────────────────────────── */}
      <div className="px-6 py-4 flex justify-between items-center bg-white">

        {/* Logo */}
        <Link href="/" className="hover:scale-105 transform transition-all duration-300" aria-label="Akbar Tax Store — Home">
          <Image src="/logo.png" alt="Akbar Tax Store logo" width={70} height={70} priority />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex gap-8">
          {NAV_LINKS.map((item, i) => (
            <Link
              key={item.href}
              ref={(el) => { if (el) desktopLinksRef.current[i] = el; }}
              href={item.href}
              className="transition-all duration-300 relative group hover:scale-105 transform font-medium"
              style={{ color: '#072971' }}
            >
              {item.label}
              <span
                className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ease-out"
                style={{ backgroundColor: '#0040A8' }}
              />
              <span
                className="absolute bottom-0 right-0 h-[2px] w-full group-hover:w-0 transition-all duration-500 ease-out"
                style={{ backgroundColor: '#D9E8FF' }}
              />
            </Link>
          ))}
        </div>

        {/* Burger button */}
        <button
          className="md:hidden z-[150] cursor-pointer p-2 -m-2 touch-manipulation hover:scale-110 transform transition-transform duration-200"
          onClick={handleMenuToggle}
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <div className="relative w-6 h-5 flex flex-col justify-between">
            <span ref={topBar}    className="block h-0.5 w-full rounded-sm transform-gpu origin-center transition-all duration-300 ease-in-out" style={{ backgroundColor: '#072971' }} />
            <span ref={middleBar} className="block h-0.5 w-full rounded-sm transform-gpu origin-center transition-all duration-300 ease-in-out" style={{ backgroundColor: '#072971' }} />
            <span ref={bottomBar} className="block h-0.5 w-full rounded-sm transform-gpu origin-center transition-all duration-300 ease-in-out" style={{ backgroundColor: '#072971' }} />
          </div>
        </button>
      </div>

      {/* ── Mobile full-screen menu ────────────────────────────────────────── */}
      <div
        ref={menuRef}
        className="fixed top-0 left-0 w-full h-screen flex flex-col justify-center items-center gap-6 z-[140] transition-all duration-500 ease-in-out bg-white"
        style={{ clipPath: 'circle(0% at 50% 50%)' }}
      >
        {/* Social icons */}
        <div className="flex gap-6 items-center mb-4">
          <a
            href={SITE_CONFIG.social.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-125 transform transition-all duration-200"
            style={{ color: '#072971' }}
            aria-label="WhatsApp"
          >
            <IconWhatsApp size={32} />
          </a>
          <a
            href={SITE_CONFIG.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-125 transform transition-all duration-200"
            style={{ color: '#072971' }}
            aria-label="Instagram"
          >
            <IconInstagram size={32} />
          </a>
        </div>

        {/* Mobile quick-access row */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <Link
            href="/contact"
            onClick={handleLinkClick}
            className="flex items-center gap-2 text-lg font-semibold hover:scale-110 transform transition-all duration-200"
            style={{ color: '#072971' }}
          >
            <IconEmail />
            Contact Us
          </Link>
          <div className="flex gap-6">
            <Link
              href="/personal"
              onClick={handleLinkClick}
              className="flex items-center gap-2 text-lg font-semibold hover:scale-110 transform transition-all duration-200"
              style={{ color: '#072971' }}
            >
              <IconPerson />
              Personal
            </Link>
            <Link
              href="/business"
              onClick={handleLinkClick}
              className="flex items-center gap-2 text-lg font-semibold hover:scale-110 transform transition-all duration-200"
              style={{ color: '#072971' }}
            >
              <IconBusiness />
              Business
            </Link>
          </div>
        </div>

        {/* Main nav links */}
        {NAV_LINKS.map((item, i) => (
          <Link
            key={item.href}
            ref={(el) => { if (el) linksRef.current[i] = el; }}
            href={item.href}
            onClick={handleLinkClick}
            className="text-2xl font-bold relative group hover:scale-110 transform transition-all duration-200"
            style={{ color: '#050505' }}
          >
            {item.label}
            <span
              className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-300 ease-out"
              style={{ backgroundColor: '#0040A8' }}
            />
          </Link>
        ))}
      </div>

    </nav>
  );
}