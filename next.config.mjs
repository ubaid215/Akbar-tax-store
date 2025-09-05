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

  // SEO Headers for Sitemap & Robots.txt
  async headers() {
    return [
      {
        source: "/sitemap.xml",
        headers: [{ key: "Content-Type", value: "application/xml" }],
      },
      {
        source: "/robots.txt",
        headers: [{ key: "Content-Type", value: "text/plain" }],
      },
    ];
  },

  // Force redirects to preferred domain (www + https)
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "akbartaxstore.com" }],
        destination: "https://www.akbartaxstore.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "http://akbartaxstore.com" }],
        destination: "https://www.akbartaxstore.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "http://www.akbartaxstore.com" }],
        destination: "https://www.akbartaxstore.com/:path*",
        permanent: true,
      },
    ];
  },

  trailingSlash: false,
};

export default nextConfig;
