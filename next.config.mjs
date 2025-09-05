/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // New recommended way for external images
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
  },

  // IMPORTANT: Redirect non-www to www (choose one as primary)
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'akbartaxstore.com',
          },
        ],
        destination: 'https://www.akbartaxstore.com/:path*',
        permanent: true,
      },
    ]
  },

  // SEO Headers for Sitemap & Robots.txt
  async headers() {
    return [
      {
        source: "/robots.txt",
        headers: [
          { key: "Content-Type", value: "text/plain" },
          { key: "Cache-Control", value: "public, max-age=3600" },
        ],
      },
      {
        source: "/sitemap.xml",
        headers: [
          { key: "Content-Type", value: "application/xml" },
          { key: "Cache-Control", value: "public, max-age=3600" },
        ],
      },
    ]
  },



  trailingSlash: false,
};

export default nextConfig;