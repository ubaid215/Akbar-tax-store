// app/sitemap.js - Complete sitemap with all service IDs
export default function sitemap() {
  const baseUrl = "https://www.akbartaxstore.com";

  // Main pages
  const mainRoutes = [
    { path: "/", priority: 1.0, changeFrequency: "daily" },
    { path: "/services-fees", priority: 0.9, changeFrequency: "weekly" },
    { path: "/personal", priority: 0.8, changeFrequency: "monthly" },
    { path: "/business", priority: 0.8, changeFrequency: "monthly" },
    { path: "/about", priority: 0.6, changeFrequency: "yearly" },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" }
  ];

  // Personal Services - Individual service pages
  const personalServiceRoutes = [
    { path: "/personal/nin", priority: 0.8, changeFrequency: "monthly" },
    { path: "/personal/ntn", priority: 0.9, changeFrequency: "monthly" },
    { path: "/personal/tax-return", priority: 0.9, changeFrequency: "monthly" },
    { path: "/personal/filer", priority: 0.8, changeFrequency: "monthly" },
    { path: "/personal/gst", priority: 0.8, changeFrequency: "monthly" },
    { path: "/personal/pra", priority: 0.7, changeFrequency: "monthly" },
    { path: "/personal/chamber", priority: 0.7, changeFrequency: "monthly" },
  ];

  // Business Services - Individual service pages
  const businessServiceRoutes = [
    { path: "/business/nin", priority: 0.8, changeFrequency: "monthly" },
    { path: "/business/ntn", priority: 0.9, changeFrequency: "monthly" },
    { path: "/business/tax-return", priority: 0.9, changeFrequency: "monthly" },
    { path: "/business/filer", priority: 0.8, changeFrequency: "monthly" },
    { path: "/business/business-reg", priority: 0.9, changeFrequency: "monthly" },
    { path: "/business/company-reg", priority: 0.9, changeFrequency: "monthly" },
    { path: "/business/firm-reg", priority: 0.8, changeFrequency: "monthly" },
    { path: "/business/trademark", priority: 0.8, changeFrequency: "monthly" },
    { path: "/business/import-export", priority: 0.7, changeFrequency: "monthly" },
    { path: "/business/gst", priority: 0.8, changeFrequency: "monthly" },
    { path: "/business/pra", priority: 0.7, changeFrequency: "monthly" },
    { path: "/business/chamber", priority: 0.7, changeFrequency: "monthly" },
    { path: "/business/dnfbp", priority: 0.7, changeFrequency: "monthly" },
    { path: "/business/accounting", priority: 0.8, changeFrequency: "monthly" },
    { path: "/business/bookkeeping", priority: 0.8, changeFrequency: "monthly" },
    { path: "/business/stock", priority: 0.7, changeFrequency: "monthly" },
  ];

  // SEO-friendly service category pages
  const categoryRoutes = [
    { path: "/services/ntn-registration", priority: 0.9, changeFrequency: "monthly" },
    { path: "/services/tax-filing", priority: 0.9, changeFrequency: "monthly" },
    { path: "/services/company-registration", priority: 0.9, changeFrequency: "monthly" },
    { path: "/services/business-registration", priority: 0.9, changeFrequency: "monthly" },
    { path: "/services/trademark-registration", priority: 0.8, changeFrequency: "monthly" },
    { path: "/services/gst-registration", priority: 0.8, changeFrequency: "monthly" },
    { path: "/services/pra-registration", priority: 0.7, changeFrequency: "monthly" },
    { path: "/services/accounting-services", priority: 0.8, changeFrequency: "monthly" },
    { path: "/services/filer-status", priority: 0.8, changeFrequency: "monthly" },
  ];

  // Location-based landing pages for local SEO
  const locationRoutes = [
    { path: "/faisalabad-tax-services", priority: 0.8, changeFrequency: "monthly" },
    { path: "/lahore-company-registration", priority: 0.7, changeFrequency: "monthly" },
    { path: "/karachi-ntn-registration", priority: 0.7, changeFrequency: "monthly" },
    { path: "/islamabad-business-registration", priority: 0.7, changeFrequency: "monthly" },
  ];

  // Resource/guide pages for content SEO
  const resourceRoutes = [
    { path: "/guides/how-to-get-ntn-pakistan", priority: 0.7, changeFrequency: "monthly" },
    { path: "/guides/company-registration-process", priority: 0.7, changeFrequency: "monthly" },
    { path: "/guides/tax-filing-deadline-pakistan", priority: 0.8, changeFrequency: "monthly" },
    { path: "/guides/filer-vs-non-filer-benefits", priority: 0.7, changeFrequency: "monthly" },
    { path: "/guides/secp-registration-requirements", priority: 0.7, changeFrequency: "monthly" },
    { path: "/guides/gst-registration-pakistan", priority: 0.7, changeFrequency: "monthly" },
    { path: "/calculator/tax-calculator", priority: 0.8, changeFrequency: "monthly" },
  ];

  // Combine all routes
  const allRoutes = [
    ...mainRoutes,
    ...personalServiceRoutes,
    ...businessServiceRoutes,
    ...categoryRoutes,
    ...locationRoutes,
    ...resourceRoutes
  ];

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}