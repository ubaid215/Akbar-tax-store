// src/app/components/schemas/ServiceSchema.tsx
// Service JSON-LD schema for /personal/* and /business/* service pages.

const BASE_URL = 'https://www.akbartaxstore.com';

interface ServiceSchemaProps {
  name: string;
  description: string;
  price: number;
  priceCurrency?: string;
  duration?: string;
  path: string;
  serviceType?: string;
}

export default function ServiceSchema({
  name,
  description,
  price,
  priceCurrency = 'PKR',
  duration,
  path,
  serviceType,
}: ServiceSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    serviceType: serviceType ?? name,
    provider: {
      '@type': ['LocalBusiness', 'ProfessionalService'],
      name: 'Akbar Tax Store',
      url: BASE_URL,
      telephone: '+923016832064',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'P 82/3 Al-Fayyaz Colony, Street No 4, Satiana Road',
        addressLocality: 'Faisalabad',
        addressRegion: 'Punjab',
        postalCode: '38000',
        addressCountry: 'PK',
      },
    },
    areaServed: [
      { '@type': 'Country', name: 'Pakistan' },
      { '@type': 'City', name: 'Faisalabad' },
      { '@type': 'City', name: 'Lahore' },
      { '@type': 'City', name: 'Karachi' },
      { '@type': 'City', name: 'Islamabad' },
    ],
    url: `${BASE_URL}${path}`,
    offers: {
      '@type': 'Offer',
      price: price.toString(),
      priceCurrency,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Akbar Tax Store',
      },
      ...(duration ? { deliveryLeadTime: duration } : {}),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
