/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState } from 'react';
import Head from 'next/head';
import { TelescopeIcon } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } else {
        setSubmitError(data.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Contact Us | Akbar Tax Store</title>
        <meta name="description" content="Get in touch with our tax experts for personalized assistance" />
      </Head>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#072971] to-[#0040A8] text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Our Tax Experts</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Have questions about taxes or financial services? Reach out to our team for personalized assistance.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white transform skew-y-1 -mb-8 z-10"></div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Contact Form */}
          <div className="lg:w-1/2">
            <div className="bg-[#D9E8FF] rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-[#072971]">Send Us a Message</h2>

              {submitSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                  <p>✅ Thank you for your message! We'll get back to you soon at {formData.email || 'your email'}.</p>
                </div>
              )}

              {submitError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  <p>❌ {submitError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#050505] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-lg border border-[#0040A8] focus:ring-2 focus:ring-[#0040A8] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Your Full Name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#050505] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-lg border border-[#0040A8] focus:ring-2 focus:ring-[#0040A8] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Please enter your email"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-[#050505] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-lg border border-[#0040A8] focus:ring-2 focus:ring-[#0040A8] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="+92 301 567 890"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-[#050505] mb-1">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-lg border border-[#0040A8] focus:ring-2 focus:ring-[#0040A8] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select a subject</option>
                    <option value="Tax Consultation">Tax Consultation</option>
                    <option value="Personal Tax">Personal Tax Services</option>
                    <option value="Business Tax">Business Tax Services</option>
                    <option value="NTN Registration">NTN Registration</option>
                    <option value="Other">Other Inquiry</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#050505] mb-1">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-lg border border-[#0040A8] focus:ring-2 focus:ring-[#0040A8] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0040A8] hover:bg-[#072971] text-white font-bold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-[#D9E8FF]">
              <h2 className="text-2xl font-bold mb-6 text-[#072971]">Contact Information</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-[#D9E8FF] p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0040A8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#050505]">Phone Numbers</h3>
                    <p className="text-[#072971] mt-1 space-y-1">
                      <a href="tel:+923016832064" className="hover:underline block">0301-6832064</a>
                      <a href="tel:+923407300408" className="hover:underline block">0340-7300408</a>
                      <a href="tel:+923248957804" className="hover:underline block">0324-8957804</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#D9E8FF] p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0040A8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#050505]">Telephone Numbers</h3>
                    <p className="text-[#072971] mt-1">
                      <a href="tel:+924236446766" className="hover:underline">042-36446766</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#D9E8FF] p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0040A8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#050505]">Email</h3>
                    <p className="text-[#072971] mt-1">
                      <a href="mailto:hussnain@akbartaxstore.com" className="hover:underline">hussnain@akbartaxstore.com</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#D9E8FF] p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0040A8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#050505]">Office Address</h3>
                    <p className="text-[#072971] mt-1">
                      348 E5 Street, Topaz Block, Park View City Multan Road<br />
                      Lahore, Pakistan
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#D9E8FF] p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0040A8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#050505]">Working Hours</h3>
                    <p className="text-[#072971] mt-1">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-[#050505] mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="https://wa.me/message/QJQEJZWC36JKN1" target="_blank" rel="noopener noreferrer" className="bg-[#D9E8FF] p-3 rounded-full hover:bg-[#0040A8] hover:text-white transition duration-300">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.63" />
                    </svg>
                  </a>
                  <a href="https://www.instagram.com/_akbar_tax_store?utm_source=qr&igsh=MWw4ajI5dDNuYncwMA==" target="_blank" rel="noopener noreferrer" className="bg-[#D9E8FF] p-3 rounded-full hover:bg-[#0040A8] hover:text-white transition duration-300">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-[#D9E8FF] py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8 text-center text-[#072971]">Our Location</h2>
          <div className="rounded-xl overflow-hidden shadow-lg h-96">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6806.97835592733!2d74.19284428525114!3d31.455727071553984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3918fe09dc680cc3%3A0x8e2840321cfd7c25!2sPark%20View%20City%20Lahore%20Topaz%20Block%20Park%20View%2C%20Lahore%2C%20Pakistan!5e0!3m2!1sen!2sus!4v1754331384731!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Google Maps Location"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}