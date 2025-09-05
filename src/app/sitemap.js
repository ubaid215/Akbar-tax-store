export default async function sitemap() {
  const baseUrl = "https://www.akbartaxstore.com"; 

  const routes = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/services-fees", priority: 0.9, changeFrequency: "monthly" },
    { path: "/personal", priority: 0.8, changeFrequency: "monthly" },
    { path: "/business", priority: 0.8, changeFrequency: "monthly" },
    { path: "/about", priority: 0.6, changeFrequency: "yearly" },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" }
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
