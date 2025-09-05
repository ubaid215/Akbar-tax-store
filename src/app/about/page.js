/* eslint-disable react/no-unescaped-entities */
"use client"

import React, { useEffect, useRef } from 'react';
import { CheckCircle, Users, Award, Shield, Phone, MessageCircle, TrendingUp, Target, Zap, Star } from 'lucide-react';
import Link from 'next/link';

const About = () => {
  const heroRef = useRef(null);
  const introRef = useRef(null);
  const visionRef = useRef(null);
  const missionRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);

  const heroHeadingRef = useRef(null);
  const heroSubheadingRef = useRef(null);
  const heroButtonRef = useRef(null);

  useEffect(() => {
    // Simple animations without GSAP dependency issues
    const animateOnScroll = (element, delay = 0) => {
      if (!element) return;
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }, delay);
          }
        });
      }, { threshold: 0.1 });

      observer.observe(element);
      return observer;
    };

    // Hero animations with staggered timing
    setTimeout(() => {
      if (heroHeadingRef.current) {
        heroHeadingRef.current.style.opacity = '1';
        heroHeadingRef.current.style.transform = 'translateY(0)';
      }
    }, 100);

    setTimeout(() => {
      if (heroSubheadingRef.current) {
        heroSubheadingRef.current.style.opacity = '1';
        heroSubheadingRef.current.style.transform = 'translateY(0)';
      }
    }, 300);

    setTimeout(() => {
      if (heroButtonRef.current) {
        heroButtonRef.current.style.opacity = '1';
        heroButtonRef.current.style.transform = 'scale(1)';
      }
    }, 500);

    // Animate other sections
    const observers = [
      animateOnScroll(introRef.current, 0),
      animateOnScroll(visionRef.current, 100),
      animateOnScroll(missionRef.current, 200),
      animateOnScroll(featuresRef.current, 0),
      animateOnScroll(statsRef.current, 0),
      animateOnScroll(ctaRef.current, 0)
    ];

    // Animate feature cards individually
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
      animateOnScroll(card, index * 100);
    });

    return () => {
      observers.forEach(observer => observer && observer.disconnect());
    };
  }, []);

  const features = [
    { 
      icon: Users, 
      number: "500+", 
      text: "Clients Successfully Registered & Tax Filed",
      description: "From startups to established businesses"
    },
    { 
      icon: Award, 
      number: "5+", 
      text: "Years of Proven Industry Experience",
      description: "Deep expertise in Pakistani tax laws"
    },
    { 
      icon: Shield, 
      number: "100%", 
      text: "Legal Compliance & Verification Guaranteed",
      description: "FBR approved processes and documentation"
    },
    { 
      icon: TrendingUp, 
      number:"0", 
      text: "Hidden Fees - Complete Transparent Pricing",
      description: "Know exactly what you pay upfront"
    },
    { 
      icon: Phone, 
      number: "24/7", 
      text: "Support via WhatsApp, Call & In-Person",
      description: "Get help whenever you need it"
    },
    { 
      icon: Target, 
      number: "96%", 
      text: "Client Satisfaction & Success Rate",
      description: "Measurable results and happy customers"
    }
  ];

  const stats = [
    { number: "1M+", label: "Tax Savings Generated", icon: TrendingUp },
    { number: "500+", label: "Businesses Registered", icon: Users },
    { number: "15min", label: "Average Response Time", icon: Zap },
    { number: "4.3★", label: "Average Client Rating", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section 
        ref={heroRef} 
        className="relative bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-12 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-blue-800/10"></div>
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-indigo-200/30 rounded-full blur-xl"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 
            ref={heroHeadingRef}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-blue-800 mb-4 sm:mb-6 lg:mb-8 leading-tight transition-all duration-1000 opacity-0 transform translate-y-12"
          >
            Pakistan's Most Trusted
            <span className="block text-blue-900 mt-2">Tax & Business Partner</span>
          </h1>
          <p 
            ref={heroSubheadingRef}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-5xl mx-auto mb-6 sm:mb-10 lg:mb-12 leading-relaxed px-4 transition-all duration-1000 opacity-0 transform translate-y-8"
          >
            Join 500+ successful clients who saved millions in taxes and grew their businesses with our expert guidance. 
            <span className="block mt-2 font-semibold text-blue-700">Get results in 24 hours, not weeks.</span>
          </p>
          <div 
            ref={heroButtonRef}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 opacity-0 transform scale-75"
          >
            <Link href="/services-fees" className="w-full sm:w-auto bg-blue-800 hover:bg-blue-900 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Start Your Tax Journey
            </Link>
            
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        ref={statsRef}
        className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-12 bg-white transition-all duration-1000 opacity-0 transform translate-y-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-800 rounded-full flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                    <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-800 mb-1 sm:mb-2">
                    {stat.number}
                  </div>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Intro Section */}
      <section 
        ref={introRef} 
        className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-12 bg-gradient-to-br from-gray-50 to-blue-50 transition-all duration-1000 opacity-0 transform translate-y-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-blue-800 mb-4 sm:mb-6 lg:mb-8">
                From Tax Confusion to 
                <span className="block text-blue-900">Financial Clarity</span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed mb-4 sm:mb-6 lg:mb-8">
                We've transformed how 500+ Pakistani businesses handle taxes, registrations, and compliance. 
                Our clients don't just file taxes – they strategically optimize them to fuel business growth.
              </p>
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  <span className="text-sm sm:text-base lg:text-lg text-gray-700">Average tax savings: maximum per client</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  <span className="text-sm sm:text-base lg:text-lg text-gray-700">24-hour processing for urgent cases</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  <span className="text-sm sm:text-base lg:text-lg text-gray-700">FBR-verified processes and documentation</span>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-6 sm:p-8 lg:p-12 rounded-2xl shadow-xl">
                <div className="text-center mb-6 sm:mb-8">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-800 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                    <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-800 mb-3 sm:mb-4">
                    The Akbar Advantage
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                    "We don't just handle your taxes – we optimize your entire financial strategy for maximum growth and compliance."
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900 mb-1 sm:mb-2">96%</div>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600">Client Retention Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Vision */}
            <div 
              ref={visionRef} 
              className="transition-all duration-1000 opacity-0 transform translate-y-8"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-800 mb-4 sm:mb-6 lg:mb-8">
                Our Vision: Tax-Smart Pakistan
              </h2>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 sm:p-8 lg:p-10 rounded-2xl shadow-lg">
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed mb-4 sm:mb-6">
                  Imagine a Pakistan where every business owner understands their tax benefits, 
                  every startup gets registered in hours not months, and every entrepreneur 
                  has a trusted financial advisor in their pocket.
                </p>
                <p className="text-sm sm:text-base lg:text-lg text-blue-700 font-semibold">
                  That's the Pakistan we're building, one client at a time.
                </p>
              </div>
            </div>

            {/* Mission */}
            <div 
              ref={missionRef} 
              className="transition-all duration-1000 opacity-0 transform translate-y-8"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900 mb-4 sm:mb-6 lg:mb-8">
                Our Mission: Your Success
              </h2>
              <div className="bg-gradient-to-br from-indigo-50 to-blue-100 p-6 sm:p-8 lg:p-10 rounded-2xl shadow-lg">
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed mb-4 sm:mb-6">
                  To make tax filing faster than ordering food online, business registration 
                  simpler than opening a bank account, and financial growth strategies 
                  accessible to every Pakistani entrepreneur.
                </p>
                <p className="text-sm sm:text-base lg:text-lg text-indigo-700 font-semibold">
                  We measure our success by your savings and growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section 
        ref={featuresRef} 
        className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-12 bg-gradient-to-br from-gray-50 to-blue-50 transition-all duration-1000 opacity-0 transform translate-y-8"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-blue-800 text-center mb-4 sm:mb-6 lg:mb-8">
            Why 500+ Clients Choose Us
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 text-center mb-8 sm:mb-12 lg:mb-16 max-w-4xl mx-auto">
            Results speak louder than promises. Here's what sets us apart in Pakistan's tax industry.
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div 
                  key={index} 
                  className="feature-card bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 opacity-0 transform translate-y-8"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-800 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                      <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-800 mb-2 sm:mb-3">
                      {feature.number}
                    </div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
                      {feature.text}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section 
        ref={ctaRef} 
        className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-12 bg-gradient-to-r from-blue-800 via-blue-900 to-indigo-900 transition-all duration-1000 opacity-0 transform translate-y-8"
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 sm:mb-6 lg:mb-8">
            Ready to Save Thousands in Taxes?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-blue-100 mb-6 sm:mb-8 lg:mb-10 leading-relaxed">
            Join Pakistan's fastest-growing community of tax-smart entrepreneurs. 
            <span className="block mt-2 font-semibold">Get your free consultation in the next 15 minutes.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-6 sm:mb-8">
            <Link href='/book-meeting' className="w-full sm:w-auto bg-white hover:bg-gray-100 text-blue-800 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Start Free Consultation
            </Link>
            <button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              WhatsApp Now
            </button>
          </div>
          
          <p className="text-xs sm:text-sm text-blue-200 opacity-90">
            💡 Free consultation • No obligations • Expert advice in Urdu/English
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;