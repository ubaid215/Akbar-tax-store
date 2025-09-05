// app/layout.jsx (Server Component) - SEO Optimized with Environment Support
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

// Get the base URL based on environment
const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  // Always use www version as canonical
  return 'https://www.akbartaxstore.com';
};

const baseUrl = getBaseUrl();

export const metadata = {
  title: "Akbar Tax Store | Income Tax Filing, NTN Registration & SECP Company Registration Pakistan",
  description:
    "Pakistan's trusted tax consultant in Faisalabad. Expert income tax filing, NTN registration, SECP company registration, business registration, and tax return services. Get filer status & save taxes today!",
  keywords: [
    // High-volume tax filing keywords
    "income tax filing Pakistan",
    "tax filing services Pakistan",
    "tax return Pakistan",
    "income tax return filing",
    "tax consultant Faisalabad",
    "tax advisor Pakistan",
    "filer status Pakistan",
    "non filer to filer",
    "tax calculator Pakistan",
    
    // Business registration keywords
    "NTN registration Pakistan",
    "SECP company registration",
    "business registration Pakistan",
    "company registration Faisalabad",
    "single member company registration",
    "SECP eZfile registration",
    "business incorporation Pakistan",
    "startup registration Pakistan",
    
    // Location-based keywords
    "tax services Faisalabad",
    "accounting services Pakistan",
    "tax filing Multan Road",
    "financial consultant Faisalabad",
    "chartered accountant services",
    
    // Service-specific keywords
    "sales tax registration",
    "professional tax registration",
    "withholding tax filing",
    "annual tax return",
    "business tax filing",
    "individual tax filing",
    "freelancer tax filing"
  ].join(", "),
  
  openGraph: {
    title: "Akbar Tax Store | Expert Tax Filing & Business Registration Services Pakistan",
    description:
      "Leading tax consultant in Faisalabad offering income tax filing, NTN registration, SECP company registration & business services. Trusted by 1000+ clients.",
    url: baseUrl,
    siteName: "Akbar Tax Store",
    images: [
      {
        url: `${baseUrl}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Akbar Tax Store - Tax Filing & Business Registration Services Pakistan",
      },
    ],
    type: "website",
    locale: "en_PK",
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Akbar Tax Store | Tax Filing & Business Registration Pakistan",
    description:
      "Expert tax consultant in Lahore. Income tax filing, NTN registration, SECP company registration & business services.",
    images: [`${baseUrl}/images/og-image.jpg`],
  },
  
  // Additional SEO metadata - Environment aware
  alternates: {
    canonical: baseUrl,
  },
  
  other: {
    "google-site-verification": "your-google-verification-code", // Replace with actual code
    "geo.region": "PK-PB",
    "geo.placename": "Lahore",
    "geo.position": "31.5204;74.3587",
    "ICBM": "31.5204, 74.3587",
  },
};

export default function RootLayout({ children }) {
  // Structured Data for Local Business - Environment aware
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/#business`,
    name: "Akbar Tax Store",
    alternateName: "Akbar Tax Store Pakistan",
    description: "Professional tax filing, NTN registration, and business registration services in Pakistan",
    image: [
      `${baseUrl}/logo.png`,
      `${baseUrl}/images/office.jpg`
    ],
    url: baseUrl,
    telephone: "+92-301-6832064",
    priceRange: "$$",
    
    address: {
      "@type": "PostalAddress",
      streetAddress: "348 E5 Street, Topaz Block, Park View City Multan Road",
      addressLocality: "Lahore",
      addressRegion: "Punjab",
      postalCode: "54000",
      addressCountry: "PK",
    },
    
    geo: {
      "@type": "GeoCoordinates",
      latitude: 31.5204,
      longitude: 74.3587,
    },
    
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "18:00",
      }
    ],
    
    sameAs: [
      "https://www.instagram.com/_akbar_tax_store",
      "https://www.facebook.com/akbartaxstore",
      "https://www.linkedin.com/company/akbartaxstore",
    ],
    
    // Services offered
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Tax and Business Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Income Tax Filing",
            description: "Professional income tax return filing services for individuals and businesses"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service", 
            name: "NTN Registration",
            description: "National Tax Number registration and renewal services"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "SECP Company Registration", 
            description: "Complete company registration with Securities and Exchange Commission of Pakistan"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Business Registration",
            description: "Complete business registration and incorporation services"
          }
        }
      ]
    },
    
    // Reviews
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "150",
      bestRating: "5",
      worstRating: "1"
    }
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        {/* Primary Meta */}
        <meta name="author" content="Akbar Tax Store" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="theme-color" content="#0056b3" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Geographic Meta Tags */}
        <meta name="geo.region" content="PK-PB" />
        <meta name="geo.placename" content="Lahore, Pakistan" />
        <meta name="geo.position" content="31.5204;74.3587" />
        <meta name="ICBM" content="31.5204, 74.3587" />
        
        {/* Language and Locale */}
        <meta httpEquiv="content-language" content="en-pk" />
        <meta property="og:locale" content="en_PK" />
        
        {/* Business specific meta */}
        <meta name="business:contact_data:street_address" content="348 E5 Street, Topaz Block, Park View City Multan Road" />
        <meta name="business:contact_data:locality" content="Lahore" />
        <meta name="business:contact_data:region" content="Punjab" />
        <meta name="business:contact_data:postal_code" content="54000" />
        <meta name="business:contact_data:country_name" content="Pakistan" />
        <meta name="business:contact_data:phone_number" content="+92-301-6832064" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* Structured Data for Local Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Akbar Tax Store",
              url: baseUrl,
              logo: `${baseUrl}/logo.png`,
              sameAs: [
                "https://www.instagram.com/_akbar_tax_store"
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+92-301-6832064",
                contactType: "customer service",
                areaServed: "PK",
                availableLanguage: ["English", "Urdu"]
              }
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