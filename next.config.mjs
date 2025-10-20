/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ Image Optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.akbartaxstore.com",
      },
      {
        protocol: "https",
        hostname: "akbartaxstore.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 31536000, // 1 year
  },

  // ✅ Redirect Rules (with protection for Vercel builds)
  async redirects() {
    return [
      // Redirect non-www to www (avoid loop on vercel.app)
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "akbartaxstore.com",
          },
        ],
        missing: [
          {
            type: "host",
            value: "www.akbartaxstore.com",
          },
        ],
        destination: "https://www.akbartaxstore.com/:path*",
        permanent: true,
      },
      // Example redirect for old URLs
      {
        source: "/old-services",
        destination: "/services-fees",
        permanent: true,
      },
    ];
  },

  // ✅ Custom Headers
  async headers() {
    return [
      // Robots.txt headers
      {
        source: "/robots.txt",
        headers: [
          { key: "Content-Type", value: "text/plain" },
          { key: "Cache-Control", value: "public, max-age=86400" }, // 24 hours
        ],
      },
      // Sitemap headers
      {
        source: "/sitemap.xml",
        headers: [
          { key: "Content-Type", value: "application/xml" },
          { key: "Cache-Control", value: "public, max-age=3600" }, // 1 hour
        ],
      },
      // Security & SEO Headers (Safe for Edge Runtime)
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
      // Static assets caching
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable", // 1 year
          },
        ],
      },
      // Public images caching
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000",
          },
        ],
      },
    ];
  },

  // ✅ General Optimizations
  trailingSlash: false,
  compress: true,
  poweredByHeader: false,

  // ✅ Experimental (Safe for Vercel)
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  // ✅ Remove console logs in production (keep errors/warnings)
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  // ✅ Disable ESLint during build (for Vercel build stability)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
