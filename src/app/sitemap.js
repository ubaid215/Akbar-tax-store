export default async function sitemap() {
  const baseUrl = "https://www.akbartaxstore.com"; 

  // Static routes with better SEO configuration
  const routes = [
    { path: "", priority: 1.0, changefreq: "weekly" },
    { path: "/services-fees", priority: 0.9, changefreq: "monthly" },
    { path: "/personal", priority: 0.8, changefreq: "monthly" },
    { path: "/business", priority: 0.8, changefreq: "monthly" },
    { path: "/about", priority: 0.6, changefreq: "yearly" },
    { path: "/contact", priority: 0.7, changefreq: "yearly" }
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route.changefreq, 
    priority: route.priority,
  }));
}