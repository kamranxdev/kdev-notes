import { source } from '@/lib/source';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://notes.kamranx.dev';
  
  // Static routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
  ];

  // Dynamic documentation routes from Fumadocs
  const pages = source.getPages();
  const docRoutes = pages.map((page) => {
    return {
      url: `${baseUrl}${page.url}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: page.url === '/docs' ? 0.9 : 0.7,
    };
  });

  return [...routes, ...docRoutes];
}
