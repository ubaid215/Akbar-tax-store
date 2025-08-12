// app/layout.jsx (Server Component)
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SmoothScrolling from "./components/SmoothScrolling";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Akbar Tax Store | Tax Filing & Business Registration in Pakistan",
  description:
    "Akbar Tax Store is Pakistan's most trusted financial and accounting service provider. We offer tax filing, business registration, NTN registration, and more.",
  keywords:
    "Akbar Tax Store, tax filing Pakistan, business registration, NTN registration, financial services Pakistan, accounting services",
  openGraph: {
    title: "Akbar Tax Store | Trusted Financial & Accounting Services",
    description:
      "Most trusted financial and accounting services provider in Pakistan.",
    url: "https://www.akbartaxstore.com",
    siteName: "Akbar Tax Store",
    images: [
      {
        url: "https://www.akbartaxstore.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Akbar Tax Store",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akbar Tax Store",
    description:
      "Most trusted financial and accounting services provider in Pakistan.",
    images: ["https://www.akbartaxstore.com/images/og-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        {/* Primary Meta */}
        <meta name="author" content="Akbar Tax Store" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#0056b3" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />

        {/* Structured Data for Local Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Akbar Tax Store",
              image: "https://www.akbartaxstore.com/logo.png",
              "@id": "",
              url: "https://www.akbartaxstore.com",
              telephone: "+92-301-6832064",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Your Street Address",
                addressLocality: "Your City",
                addressRegion: "Your Province",
                postalCode: "XXXXX",
                addressCountry: "PK",
              },
              sameAs: [
                "https://instagram.com/akbartaxstore",
              ],
            }),
          }}
        />
      </head>
      <body className="bg-white text-black">
        <SmoothScrolling />
        <Navbar />
        <main className="pt-16 md:pt-24 lg:pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
