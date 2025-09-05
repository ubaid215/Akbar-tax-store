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

  trailingSlash: false,
};

export default nextConfig;
