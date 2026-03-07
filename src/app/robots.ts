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
    sitemap: 'https://envstore.nabinkhair.com.np/sitemap.xml',
  };
}
