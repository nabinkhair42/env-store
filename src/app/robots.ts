import { siteConfig } from '@/lib/sitemap';
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/_next/', '/static/'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
