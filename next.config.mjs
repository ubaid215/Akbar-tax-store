/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Image Optimization
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.akbartaxstore.com" },
      { protocol: "https", hostname: "akbartaxstore.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "akbartaxstore.com" }],
        destination: "https://www.akbartaxstore.com/:path*",
        permanent: true,
      },
      {
        source: "/old-services",
        destination: "/services-fees",
        permanent: true,
      },
      { source: "/services/tax-filing", destination: "/personal/tax-return", permanent: true },
      { source: "/services/ntn-registration", destination: "/personal/ntn", permanent: true },
      { source: "/services/filer-status", destination: "/personal/filer", permanent: true },
      { source: "/services/gst-registration", destination: "/personal/gst", permanent: true },
      { source: "/services/pra-registration", destination: "/personal/pra", permanent: true },
      { source: "/services/company-registration", destination: "/business/company-reg", permanent: true },
      { source: "/services/secp-registration", destination: "/business/company-reg", permanent: true },
      { source: "/services/business-registration", destination: "/business/business-reg", permanent: true },
      { source: "/services/trademark-registration", destination: "/business/trademark", permanent: true },
      { source: "/services/import-export-license", destination: "/business/import-export", permanent: true },
      { source: "/services/bookkeeping", destination: "/business/bookkeeping", permanent: true },
      { source: "/services/accounting-services", destination: "/business/accounting", permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: "/robots.txt",
        headers: [
          { key: "Content-Type", value: "text/plain" },
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
      {
        source: "/sitemap.xml",
        headers: [
          { key: "Content-Type", value: "application/xml" },
          { key: "Cache-Control", value: "public, max-age=3600" },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
    ];
  },

  trailingSlash: false,
  compress: true,
  poweredByHeader: false,

  serverExternalPackages: ["@prisma/client", "bcryptjs"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },
};

export default nextConfig;