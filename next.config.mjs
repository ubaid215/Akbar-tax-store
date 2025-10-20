/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Image optimization
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
    // Enable image optimization
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
  },

  // IMPORTANT: Canonical URL setup - redirect non-www to www
  async redirects() {
    return [
      // Redirect non-www to www (for consistent canonical URLs)
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'akbartaxstore.com',
          },
        ],
        destination: 'https://www.akbartaxstore.com/:path*',
        permanent: true, // 301 redirect
      },
      // Redirect old URLs if you have any
      {
        source: '/old-services',
        destination: '/services-fees',
        permanent: true,
      },
    ]
  },

  // Enhanced SEO headers
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
      // General security and performance headers
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      // Static assets caching
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 year
          },
        ],
      },
      // Images caching
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000', // 1 year
          },
        ],
      },
    ]
  },

  // Remove trailing slash for consistency
  trailingSlash: false,

  // Optimize bundle size
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },

  // Enable compression
  compress: true,

  // PoweredBy header removal for security
  poweredByHeader: false,
};

export default nextConfig;