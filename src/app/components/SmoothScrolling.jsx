// app/components/SmoothScrolling.jsx
"use client"
import { useEffect } from 'react';

export default function SmoothScrolling() {
  useEffect(() => {
    const initSmoothScroll = async () => {
      const Lenis = (await import('@studio-freight/lenis')).default;
      
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      return () => lenis.destroy();
    };

    initSmoothScroll();
  }, []);

  return null;
}