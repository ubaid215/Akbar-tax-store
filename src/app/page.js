/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Phone, MessageCircle, ArrowRight, CheckCircle, Building, FileText, Shield, Users, Eye } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';


const Homepage = () => {
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const servicesRef = useRef(null);
  const ctaRef = useRef(null);
  const [currentTypeText, setCurrentTypeText] = useState('');
  const [typeIndex, setTypeIndex] = useState(0);
  const [counters, setCounters] = useState({
    clients: 0,
    hours: 0,
    services: 0,
    legal: 0
  });
  const [hasAnimated, setHasAnimated] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const typeTexts = [
    'NTN Registration',
    'Tax Return Filing',
    'Company & Trademark Registration',
    'GST & PRA Made Simple',
    'Financial And Bookkeeping'
  ];

  const services = [
    {
      title: 'NTN Registration',
      description: 'Get your National Tax Number (NTN) issued quickly and efficiently. We handle all the paperwork and government submissions.',
      image: '/images/ntn-registration.jpg',
      icon: <FileText className="w-5 h-5" />
    },
    {
      title: 'Business Registration',
      description: 'Start your business legally with complete SECP or FBR registration services and end-to-end support.',
      image: '/images/business-registration.jpg',
      icon: <Building className="w-5 h-5" />
    },
    {
      title: 'Company Registration',
      description: 'Register your private limited company with SECP including complete legal documentation and approvals.',
      image: '/images/company-registration.jpg',
      icon: <Building className="w-5 h-5" />
    },
    {
      title: 'Trademark Registration',
      description: 'Protect your brand identity with comprehensive trademark registration services and IP protection.',
      image: '/images/trademark-registration.jpg',
      icon: <Shield className="w-5 h-5" />
    },
    {
      title: 'Tax Return Filing',
      description: 'Professional tax return preparation and filing services for individuals and businesses with accuracy.',
      image: '/images/tax-filing.jpg',
      icon: <FileText className="w-5 h-5" />
    },
    {
      title: 'GST Registration',
      description: 'Complete GST registration and compliance services for businesses with ongoing support.',
      image: '/images/gst-registration.jpg',
      icon: <Shield className="w-5 h-5" />
    }
  ];

  // Counter animation hook
  const useCounter = (end, duration = 2000, shouldStart = false) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!shouldStart) return;

      let startTime;
      let animationFrame;

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percentage = Math.min(progress / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
        setCount(Math.floor(end * easeOutQuart));

        if (percentage < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, shouldStart]);

    return count;
  };

  // Individual counters
  const clientsCount = useCounter(500, 2000, hasAnimated);
  const hoursCount = useCounter(24, 1500, hasAnimated);
  const servicesCount = useCounter(11, 1800, hasAnimated);
  const legalCount = useCounter(100, 2200, hasAnimated);

  // Typing animation effect
  useEffect(() => {
    const typeText = typeTexts[typeIndex];
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex <= typeText.length) {
        setCurrentTypeText(typeText.substring(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setTypeIndex((prev) => (prev + 1) % typeTexts.length);
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, [typeIndex, typeTexts]);

  // Intersection Observer for animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-up');
          // Trigger counter animation when about section is visible
          if (entry.target === aboutRef.current) {
            setHasAnimated(true);
          }
        }
      });
    }, observerOptions);

    [aboutRef, servicesRef, ctaRef].forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section ref={heroRef} className="pt-16 pb-16 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, #D9E8FF 0%, #FFFFFF 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{ color: '#050505' }}>
              We're <span style={{ color: '#0040A8' }}>Akbar Tax Store</span>.
              <br />
              <span style={{ color: '#072971' }} className="font-medium">Accounting That Actually Helps You Grow.</span>
            </h1>

            <p className="text-xl sm:text-2xl mb-8" style={{ color: '#072971' }}>
              Helping Pakistan File Taxes, Businesses Register, Financial and Bookkeeping.
            </p>

            {/* Typing Animation */}
            <div className="h-16 flex items-center justify-center mb-8">
              <div className="text-lg sm:text-xl font-medium" style={{ color: '#0040A8' }}>
                → {currentTypeText}
                <span className="animate-pulse">|</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/personal"
                className="w-full sm:w-auto bg-transparent text-[#0040A8]  border-2 border-[#0040A8] px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-all hover:bg-[#0040A8] hover:text-white duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                
              >
                <MessageCircle className="w-5 h-5" />
                Personal
              </Link>
              <Link
                href="/business"
                onClick={scrollToServices}
                className="w-full sm:w-auto border-2 px-8 py-4 rounded-lg font-semibold hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  borderColor: '#0040A8',
                  color: '#0040A8',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#0040A8';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#0040A8';
                }}
              >
                <Building className="w-5 h-5" />
                Business
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} id="about" className="py-16 px-4 sm:px-6 lg:px-8 opacity-0 translate-y-10 transition-all duration-700">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{ color: '#050505' }}>
                About <span style={{ color: '#0040A8' }}>Akbar Tax Store</span>
              </h2>
              <p className="text-lg mb-6 leading-relaxed" style={{ color: '#072971' }}>
                Akbar Tax Store is a modern tax consultancy service based in Pakistan. We specialize in helping individuals, startups, and businesses become tax-compliant, register their companies, and secure their brand identity — all from the comfort of their home.
              </p>
              <p className="text-lg mb-8 leading-relaxed" style={{ color: '#072971' }}>
                Whether you need an NTN Certificate, want to become a Filer, or register your Business or Trademark, we've got you covered from A to Z. We handle all paperwork, legal processes, and government portal submissions so you can focus on what matters most — growing your business.
              </p>
              <div className="p-6 rounded-lg mb-8" style={{ backgroundColor: '#D9E8FF' }}>
                <p className="font-semibold mb-2" style={{ color: '#0040A8' }}>Want to talk to an expert?</p>
                <p style={{ color: '#072971' }}>Let's connect today.</p>
              </div>
              <Link
                href="/contact"
                className="text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center gap-2"
                style={{ backgroundColor: '#0040A8' }}
              >
                Contact Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-lg text-center" style={{ backgroundColor: '#D9E8FF' }}>
                <div className="text-3xl font-bold mb-2" style={{ color: '#0040A8' }}>{clientsCount}+</div>
                <div style={{ color: '#072971' }}>Happy Clients</div>
              </div>
              <div className="p-6 rounded-lg text-center" style={{ backgroundColor: '#D9E8FF' }}>
                <div className="text-3xl font-bold mb-2" style={{ color: '#0040A8' }}>{hoursCount}hrs</div>
                <div style={{ color: '#072971' }}>Fast Service</div>
              </div>
              <div className="p-6 rounded-lg text-center" style={{ backgroundColor: '#D9E8FF' }}>
                <div className="text-3xl font-bold mb-2" style={{ color: '#0040A8' }}>{servicesCount}+</div>
                <div style={{ color: '#072971' }}>Services</div>
              </div>
              <div className="p-6 rounded-lg text-center" style={{ backgroundColor: '#D9E8FF' }}>
                <div className="text-3xl font-bold mb-2" style={{ color: '#0040A8' }}>{legalCount}%</div>
                <div style={{ color: '#072971' }}>Legal</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} id="services" className="py-16 px-4 sm:px-6 lg:px-8 opacity-0 translate-y-10 transition-all duration-700" style={{ backgroundColor: '#D9E8FF' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#050505' }}>
              Our <span style={{ color: '#0040A8' }}>Services</span>
            </h2>
            <p className="text-xl" style={{ color: '#072971' }}>Complete tax and business solutions for Pakistan</p>
          </div>

          {/* Services Grid - More responsive and minimal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {services.slice(0, 4).map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105 max-w-sm mx-auto w-full">
                <div className="h-32 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    priority={index < 4} 
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-md" style={{ backgroundColor: '#D9E8FF', color: '#0040A8' }}>
                      {service.icon}
                    </div>
                    <h3 className="text-lg font-semibold truncate" style={{ color: '#050505' }}>{service.title}</h3>
                  </div>
                  <p className="mb-4 leading-relaxed text-sm line-clamp-3" style={{ color: '#072971' }}>{service.description}</p>
                  <Link href='/services-fees'>
                  <button
                    className="w-full text-white px-3 py-2 rounded-md hover:opacity-90 transition-colors text-sm font-medium"
                    style={{ backgroundColor: '#0040A8' }}
                  >
                    Get Started
                  </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-8">
            <Link href="/services-fees">
            <button
              className="text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 mx-auto"
              style={{ backgroundColor: '#072971' }}
            >
              <Eye className="w-5 h-5" />
              View All Services
            </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section ref={ctaRef} className="py-16 px-4 sm:px-6 lg:px-8 opacity-0 translate-y-10 transition-all duration-700" style={{ background: 'linear-gradient(135deg, #0040A8 0%, #072971 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Start Your Tax Journey Today
          </h2>
          <p className="text-xl mb-8 leading-relaxed" style={{ color: '#D9E8FF' }}>
            No queues. No paperwork stress. Just simple, fast, and reliable tax services.
            Whether you're an individual, freelancer, or business owner — Akbar Tax Store is your partner in legal success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href='/services-fees' className="w-full sm:w-auto bg-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center justify-center gap-2" style={{ color: '#0040A8' }}>
              <Building className="w-5 h-5" />
              Explore Services
            </Link>
            <a
            href="https://wa.me/923016832064"
                target="_blank"
                rel="noopener noreferrer">
            <button className="w-full sm:w-auto border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white transition-colors flex items-center justify-center gap-2"
              onMouseEnter={(e) => e.target.style.color = '#0040A8'}
              onMouseLeave={(e) => e.target.style.color = 'white'}
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Us Now
            </button>
            </a>
          </div>
        </div>
      </section>

      {/* Custom CSS for animations and line-clamp */}
      <style jsx>{`
        .animate-fade-up {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-up {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Homepage;