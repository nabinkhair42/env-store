import { siteConfig } from '@/lib/sitemap';
import Script from 'next/script';

const author = siteConfig.authors[0];

const schemas = [
  {
    id: 'software-application-schema',
    data: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: siteConfig.name,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: siteConfig.description,
      url: siteConfig.url,
      author: { '@type': 'Person', name: author.name, url: author.url },
      creator: { '@type': 'Person', name: author.name, url: author.url },
      featureList: [
        'Secure environment variable storage',
        'GitHub OAuth authentication',
        'AES-256-GCM encryption',
        'Cross-device synchronization',
        'Project-based organization',
        'Export to .env format',
      ],
    },
  },
  {
    id: 'website-schema',
    data: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
    },
  },
  {
    id: 'person-schema',
    data: {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: author.name,
      url: author.url,
      sameAs: [siteConfig.github],
      jobTitle: 'Software Developer',
      description: `Creator of ${siteConfig.name} - a secure environment variable management tool`,
    },
  },
];

export function StructuredData() {
  return (
    <>
      {schemas.map((s) => (
        <Script
          key={s.id}
          id={s.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s.data) }}
        />
      ))}
    </>
  );
}
