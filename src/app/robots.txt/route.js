// app/robots.txt/route.js - ONLY robots.txt content
export function GET() {
  return new Response(
    `User-agent: *
Allow: /

# Block admin and API routes
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /private/

# Allow important files
Allow: /api/sitemap.xml
Allow: /_next/static/

# Sitemap location
Sitemap: https://www.akbartaxstore.com/sitemap.xml

# Crawl delay for better server performance
Crawl-delay: 1`,
    {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    }
  )
}