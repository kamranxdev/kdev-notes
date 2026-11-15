import { source } from '@/lib/source';
import type { MetadataRoute } from 'next';
import path from 'node:path';
import fs from 'node:fs';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://notes.kamranx.dev';
  
  // Dynamic documentation routes from Fumadocs
  const pages = source.getPages();

  let latestDocModified = new Date(0);

  const docRoutes = pages.map((page) => {
    let lastModified = new Date();
    try {
      const filePath = path.join(process.cwd(), 'content/docs', page.path);
      if (fs.existsSync(filePath)) {
        lastModified = fs.statSync(filePath).mtime;
        if (lastModified > latestDocModified) {
          latestDocModified = lastModified;
        }
      }
    } catch {
      // fallback
    }

    return {
      url: `${baseUrl}${page.url}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: page.url === '/docs' ? 0.9 : 0.7,
    };
  });

  // Static routes
  const routes = [
    {
      url: baseUrl,
      lastModified: latestDocModified.getTime() > 0 ? latestDocModified : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
  ];

  return [...routes, ...docRoutes];
}
