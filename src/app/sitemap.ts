import { generateSitemap } from '@/lib/sitemap';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return generateSitemap() as MetadataRoute.Sitemap;
}
