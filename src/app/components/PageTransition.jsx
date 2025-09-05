"use client";
import { usePathname } from 'next/navigation';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const mainContent = useRef(null);
  const transitionOverlay = useRef(null);

  useEffect(() => {
    // Function to handle page transitions
    const handlePageTransition = async () => {
      // Create overlay animation
      const tl = gsap.timeline();
      
      // Animate overlay in
      tl.to(transitionOverlay.current, {
        duration: 0.3,
        opacity: 1,
        ease: "power2.inOut"
      });
      
      // Animate content out
      tl.to(mainContent.current, {
        duration: 0.3,
        opacity: 0,
        y: 20,
        ease: "power2.out"
      }, 0);
      
      // Wait for the transition to complete
      await tl.play();
      
      // Animate overlay out and new content in
      const tl2 = gsap.timeline();
      
      // Animate overlay out
      tl2.to(transitionOverlay.current, {
        duration: 0.3,
        opacity: 0,
        ease: "power2.inOut"
      });
      
      // Animate content in
      tl2.to(mainContent.current, {
        duration: 0.5,
        opacity: 1,
        y: 0,
        ease: "power2.out"
      }, 0.1);
    };

    handlePageTransition();
  }, [pathname]);

  return (
    <>
      {/* Transition overlay */}
      <div
        ref={transitionOverlay}
        className="fixed inset-0 bg-gradient-to-r from-[#072971] to-[#0040A8] z-50 pointer-events-none opacity-0"
      />
      
      {/* Main content */}
      <div ref={mainContent} className="opacity-100">
        {children}
      </div>
    </>
  );
}