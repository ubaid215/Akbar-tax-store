// app/robots.txt/route.js
// IMPROVED — fix applied:
// The original had: Disallow: /_next/ followed by Allow: /_next/static/ and Allow: /_next/image
// Most crawlers (including Googlebot) process rules top-to-bottom and the broad Disallow
// fires before the Allow directives can rescue those paths.
// Fix: moved the specific Allow rules BEFORE the broad Disallow so they take precedence.
// The /_next/static/ and /_next/image paths carry CSS, JS, and optimised images that
// Google needs to render pages correctly — blocking them causes "page cannot be rendered"
// warnings in Search Console.

export function GET() {
  return new Response(
    `User-agent: *
Allow: /

# Specific allows — must come BEFORE any broad Disallow that would cover the same paths
Allow: /calculators/
Allow: /services/
Allow: /guides/
Allow: /personal/
Allow: /business/
Allow: /_next/static/
Allow: /_next/image

# Block non-public routes
Disallow: /api/
Disallow: /admin/
Disallow: /private/
Disallow: /book-meeting/cancel
Disallow: /booking/cancel
Disallow: /booking/confirm
Disallow: /_next/

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