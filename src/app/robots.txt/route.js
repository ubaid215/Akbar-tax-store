// app/robots.txt/route.js
export function GET() {
  return new Response(
    `User-agent: *
Allow: /

# Block non-public routes
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /private/
Disallow: /book-meeting/cancel
Disallow: /book-meeting/confirm

# Allow static assets & sitemap API
Allow: /api/sitemap.xml
Allow: /_next/static/
Allow: /_next/image

# Sitemap
Sitemap: https://www.akbartaxstore.com/sitemap.xml`,
    {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400',
      },
    }
  );
}