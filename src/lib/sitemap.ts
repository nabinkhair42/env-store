import { Metadata } from 'next';

// Internal site configuration (not part of the public API)
const siteConfig = {
  name: 'ENV Store',
  description:
    'Securely manage and sync your environment variables across devices. Never lose your .env again.',
  url: 'https://envstore.nabinkhair.com.np',
  ogImage: '/og.png',
  logo: '/logo.svg',
  keywords: [
    'environment variables',
    'env',
    'dotenv',
    'developer tools',
    'configuration management',
    'secrets management',
    'project setup',
    'development workflow',
    'environment configuration',
    'devops tools',
  ],
  authors: [
    {
      name: 'Nabin Khair',
      url: 'https://nabinkhair.com.np',
    },
  ],
  creator: 'Nabin Khair',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://envstore.nabinkhair.com.np',
    title: 'ENV Store - Environment Variable Manager',
    description:
      'Securely manage and sync your environment variables across devices. Never lose your .env again.',
    siteName: 'ENV Store',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'ENV Store - Environment Variable Manager',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ENV Store - Environment Variable Manager',
    description:
      'Securely manage and sync your environment variables across devices. Never lose your .env again.',
    images: ['/og.png'],
    creator: '@nabinkhair42',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  openGraph: siteConfig.openGraph,
  twitter: siteConfig.twitter,
  robots: siteConfig.robots,
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: siteConfig.logo,
    shortcut: siteConfig.logo,
    apple: siteConfig.logo,
  },
  manifest: '/manifest.json',
};

export function generateSitemap() {
  const baseUrl = siteConfig.url;

  const routes = ['', '/dashboard'];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}

// robots.txt is implemented in app/robots.ts; keep sitemap utilities here-only
