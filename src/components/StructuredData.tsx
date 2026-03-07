import Script from 'next/script';

export function StructuredData() {
  const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ENV Store',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'Securely manage and sync your environment variables across devices. Never lose your .env again.',
    url: 'https://envstore.nabinkhair.com.np',
    author: {
      '@type': 'Person',
      name: 'Nabin Khair',
      url: 'https://nabinkhair.com.np',
    },
    creator: {
      '@type': 'Person',
      name: 'Nabin Khair',
      url: 'https://nabinkhair.com.np',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: '1',
    },
    featureList: [
      'Secure environment variable storage',
      'GitHub OAuth authentication',
      'AES-256-GCM encryption',
      'Cross-device synchronization',
      'Project-based organization',
      'Export to .env format',
    ],
  };

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ENV Store',
    url: 'https://envstore.nabinkhair.com.np',
    description:
      'Securely manage and sync your environment variables across devices. Never lose your .env again.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate:
          'https://envstore.nabinkhair.com.np/?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Nabin Khair',
    url: 'https://nabinkhair.com.np',
    sameAs: ['https://github.com/nabinkhair42'],
    jobTitle: 'Software Developer',
    description:
      'Creator of ENV Store - a secure environment variable management tool',
  };

  return (
    <>
      <Script
        id="software-application-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema),
        }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webSiteSchema),
        }}
      />
      <Script
        id="person-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />
    </>
  );
}
