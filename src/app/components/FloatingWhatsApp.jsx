'use client';
// src/app/components/FloatingWhatsApp.jsx
// Persistent floating WhatsApp button — visible on every page, every scroll position.
// Uses GA4 event tracking so you can see WhatsApp click rate in Google Analytics.
// Pulses every 8 seconds to draw attention without being annoying.

import { useState, useEffect } from 'react';

const WHATSAPP_NUMBER = '923407300408'; // International format, no + or spaces
const WHATSAPP_MESSAGE = 'Hello. I visited your website and would like to discuss accounting, taxation, or compliance services for my business.'; 

export default function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);
  const [pulse, setPulse] = useState(false);

  // Delay appearance by 3 seconds so it doesn't distract on page load
  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(showTimer);
  }, []);

  // Subtle pulse every 8 seconds to draw attention
  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 1000);
    }, 8000);
    return () => clearInterval(interval);
  }, [visible]);

  const handleClick = () => {
    // GA4 event tracking — see WhatsApp click rate in Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'whatsapp_click', {
        event_category: 'conversion',
        event_label: 'floating_button',
      });
    }

    const encodedMessage = encodeURIComponent(WHATSAPP_MESSAGE);
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '8px',
      }}
    >
      {/* Tooltip label */}
      <div
        style={{
          background: '#1a1a2e',
          color: '#ffffff',
          fontSize: '12px',
          fontWeight: '600',
          padding: '6px 12px',
          borderRadius: '20px',
          whiteSpace: 'nowrap',
          opacity: 0.9,
          pointerEvents: 'none',
          lineHeight: '1.4',
        }}
      >
        Chat with us — Need expert tax advice?
      </div>

      {/* WhatsApp Button */}
      <button
        onClick={handleClick}
        aria-label="Chat on WhatsApp — Free Tax Consultation"
        title="WhatsApp us for free tax consultation"
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: '#25D366',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          animation: pulse ? 'whatsapp-pulse 1s ease' : 'none',
          outline: 'none',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 28px rgba(37, 211, 102, 0.55)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(37, 211, 102, 0.4)';
        }}
      >
        {/* WhatsApp SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="30"
          height="30"
          fill="white"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </button>

      {/* Pulse animation keyframes */}
      <style>{`
        @keyframes whatsapp-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); box-shadow: 0 6px 32px rgba(37, 211, 102, 0.65); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}