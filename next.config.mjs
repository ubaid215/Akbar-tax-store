/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Image Optimization (add domains if needed)
  images: {
    domains: ["https://www.akbartaxstore.com", "cdn.yourdomain.com"], // Add your own CDN or image domains
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

  // Remove trailing slashes in URLs
  trailingSlash: false,
};

export default nextConfig;
