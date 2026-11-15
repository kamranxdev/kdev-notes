import { getPageImage, getPageMarkdownUrl, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/notebook/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { gitConfig } from '@/lib/shared';
import path from 'node:path';
import fs from 'node:fs';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://notes.kamranx.dev';
  const pageUrl = `${baseUrl}${page.url}`;
  const imageUrl = `${baseUrl}${getPageImage(page).url}`;

  let dateModified: string | undefined;
  try {
    const filePath = path.join(process.cwd(), 'content/docs', page.path);
    if (fs.existsSync(filePath)) {
      dateModified = fs.statSync(filePath).mtime.toISOString();
    }
  } catch {
    // fallback if file stats fail
  }

  // Construct BreadcrumbList schema
  const breadcrumbElements: Array<{
    '@type': string;
    position: number;
    name: string;
    item: string;
  }> = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: baseUrl,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Docs',
      item: `${baseUrl}/docs`,
    },
  ];

  if (params.slug && params.slug.length > 0) {
    let currentPath = '/docs';
    params.slug.forEach((segment, idx) => {
      currentPath += `/${segment}`;
      const isLast = idx === (params.slug?.length ?? 0) - 1;
      const formattedName = isLast
        ? page.data.title
        : segment
            .replace(/^(\d+-|\([a-z0-9_-]+\))/i, '')
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());

      breadcrumbElements.push({
        '@type': 'ListItem',
        position: breadcrumbElements.length + 1,
        name: formattedName,
        item: `${baseUrl}${currentPath}`,
      });
    });
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${pageUrl}#article`,
        headline: page.data.title,
        description: page.data.description,
        url: pageUrl,
        image: imageUrl,
        ...(dateModified ? { dateModified } : {}),
        author: {
          '@type': 'Person',
          name: 'Kamran Khan',
          url: 'https://kamranx.dev',
        },
        publisher: {
          '@type': 'Person',
          name: 'Kamran Khan',
          url: 'https://kamranx.dev',
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': pageUrl,
        },
        inLanguage: 'en-US',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: breadcrumbElements,
      },
    ],
  };

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${page.path}`}
        />
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const title = page.data.title;
  const description = page.data.description;
  const imageUrl = getPageImage(page).url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl,
    },
    twitter: {
      title,
      description,
      images: imageUrl,
    },
    alternates: {
      canonical: page.url,
    },
  };
}

