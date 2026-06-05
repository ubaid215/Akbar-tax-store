import Script from 'next/script';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import SmoothScrolling from '@/app/components/SmoothScrolling';

export default function PublicLayout({ children }) {
  return (
    <>
      {/* Google Tag (gtag.js) */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
        `}
      </Script>

      <SmoothScrolling />
      <Navbar />
      <main className="pt-16 md:pt-24 lg:pt-20">
        {children}
      </main>
      <Footer />
    </>
  );
}