import { Metadata } from 'next';

export const siteConfig = {
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
  twitter: '@nabinkhair42',
  github: 'https://github.com/nabinkhair42',
  repo: 'https://github.com/nabinkhair42/env-store',
};

const title = `${siteConfig.name} - Environment Variable Manager`;

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.twitter,
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
  metadataBase: new URL(siteConfig.url),
  alternates: { canonical: '/' },
  icons: {
    icon: siteConfig.logo,
    shortcut: siteConfig.logo,
    apple: siteConfig.logo,
  },
  manifest: '/manifest.json',
};

export function generateSitemap() {
  const routes = ['', '/privacy', '/terms', '/contact'];
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));
}
