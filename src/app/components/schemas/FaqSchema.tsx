// src/app/components/schemas/FaqSchema.tsx
// Reusable FAQPage JSON-LD component. Accepts both {q, a} and {question, answer} shapes.

interface FaqItem {
  q?: string;
  a?: string;
  question?: string;
  answer?: string;
}

interface FaqSchemaProps {
  faqs: FaqItem[];
}

export default function FaqSchema({ faqs }: FaqSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question ?? faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer ?? faq.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
