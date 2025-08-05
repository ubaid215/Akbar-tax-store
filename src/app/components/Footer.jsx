import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
} from "lucide-react";
import Link from 'next/link';


const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="text-white py-12  px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "#072971" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand & Tagline */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold mb-3" style={{ color: "#FFFFFF" }}>
              Akbar Tax Store
            </h2>
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: "#D9E8FF" }}
            >
              Modern tax solutions made simple. We help you register your
              business, become a filer, and save taxes — all from your phone.
            </p>
            {/* Social Media Icons */}
            <div className="flex space-x-3">
              
              <a
                href="#"
                className="p-2 rounded-full transition-all duration-300 hover:scale-110"
                style={{ backgroundColor: "#0040A8" }}
                title="Instagram"
              >
                <Instagram className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "#FFFFFF" }}
            >
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/"
                  className="text-sm transition-colors duration-300 hover:text-white"
                  style={{ color: "#D9E8FF" }}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/services-fees"
                  className="text-sm transition-colors duration-300 hover:text-white"
                  style={{ color: "#D9E8FF" }}
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-sm transition-colors duration-300 hover:text-white"
                  style={{ color: "#D9E8FF" }}
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-sm transition-colors duration-300 hover:text-white"
                  style={{ color: "#D9E8FF" }}
                >
                  Contact
                </a>
              </li>
             
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "#FFFFFF" }}
            >
              Our Services
            </h3>
            <ul className="space-y-3">
              <li>
                <span className="text-sm" style={{ color: "#D9E8FF" }}>
                  NTN & Filer Registration
                </span>
              </li>
              <li>
                <span className="text-sm" style={{ color: "#D9E8FF" }}>
                  Tax Return Filing
                </span>
              </li>
              <li>
                <span className="text-sm" style={{ color: "#D9E8FF" }}>
                  Business / Firm Registration
                </span>
              </li>
              <li>
                <span className="text-sm" style={{ color: "#D9E8FF" }}>
                  Trademark & GST / PRA
                </span>
              </li>
              <li>
                <span className="text-sm" style={{ color: "#D9E8FF" }}>
                  Import & Export License
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "#FFFFFF" }}
            >
              Contact Us
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin
                  className="w-4 h-4 mt-0.5"
                  style={{ color: "#0040A8" }}
                />
                <span className="text-sm" style={{ color: "#D9E8FF" }}>
                  Lahore, Punjab, Pakistan
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4" style={{ color: "#0040A8" }} />
                <a
                  href="tel:03016832064"
                  className="text-sm transition-colors duration-300 hover:text-white"
                  style={{ color: "#D9E8FF" }}
                >
                  03016832064
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" style={{ color: "#0040A8" }} />
                <a
                  href="mailto:hussnain@akbartaxstore.com"
                  className="text-sm transition-colors duration-300 hover:text-white"
                  style={{ color: "#D9E8FF" }}
                >
                  hussnain@akbartaxstore.com
                </a>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-6">
              <a
                href="https://wa.me/923016832064"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 hover:scale-105"
                style={{ backgroundColor: "#0040A8" }}
              >
                <Phone className="w-4 h-4" />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t" style={{ borderColor: "#0040A8" }}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-sm" style={{ color: "#D9E8FF" }}>
                © {currentYear} Akbar Tax Store. All rights reserved.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-sm" style={{ color: "#D9E8FF" }}>
                Built with ❤️ by{" "}
                <span className="font-semibold text-white hover:text-cyan-600 hover:underline transition duration-200 cursor-pointer">
                  Muhammad Ubaidullah
                </span>
              </p>
              <div className="flex space-x-4">
                <Link
                  href="/privacy-policy"
                  className="text-xs transition-colors duration-300 hover:text-white"
                  style={{ color: "#D9E8FF" }}
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
