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
Disallow: /booking/cancel
Disallow: /booking/confirm

# Allow important content — never block these
Allow: /calculators/
Allow: /services/
Allow: /guides/
Allow: /personal/
Allow: /business/
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
