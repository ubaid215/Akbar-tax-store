// app/sitemap.js
export default async function sitemap() {
  const baseUrl = "https://www.akbartaxstore.com"; 

  // Static routes
  const routes = [
    "",
    "/services-fees",
    "/tax-filing",
    "/business-registration",
    "/about",
    "/contact",
    "/personal",
    "/business"
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changefreq: "monthly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
