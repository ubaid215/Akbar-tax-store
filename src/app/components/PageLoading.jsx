"use client";
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function PageLoading() {
  const loaderRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    // Animate progress bar
    tl.to(progressRef.current, {
      width: "80%",
      duration: 1.5,
      ease: "power2.inOut"
    });
    
    // Complete animation
    tl.to(progressRef.current, {
      width: "100%",
      duration: 0.5,
      ease: "power2.out"
    });
    
    // Hide loader
    tl.to(loaderRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => {
        if (loaderRef.current) {
          loaderRef.current.style.display = "none";
        }
      }
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center"
    >
      <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          ref={progressRef}
          className="h-full bg-gradient-to-r from-[#072971] to-[#0040A8] rounded-full"
          style={{ width: "0%" }}
        />
      </div>
      <p className="mt-4 text-gray-600 font-medium">Loading...</p>
    </div>
  );
}