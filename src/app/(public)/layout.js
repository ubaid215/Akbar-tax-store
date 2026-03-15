// src/app/(public)/layout.js

import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import SmoothScrolling from '@/app/components/SmoothScrolling';

export default function PublicLayout({ children }) {
  return (
    <>
      <SmoothScrolling />
      <Navbar />
      <main className="pt-16 md:pt-24 lg:pt-20">
        {children}
      </main>
      <Footer />
    </>
  );
}