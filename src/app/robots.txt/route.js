export function GET() {
  return new Response(
    `User-agent: *
Allow: /

Disallow: /api/
Disallow: /admin/

Sitemap: https://www.akbartaxstore.com/sitemap.xml`,
    {
      headers: {
        'Content-Type': 'text/plain',
      },
    }
  )
}