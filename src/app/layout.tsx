import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import PWARegistration from '@/components/PWARegistration';

export const viewport: Viewport = {
  themeColor: '#c9fd74',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://notes.kamranx.dev'),
  title: {
    template: "%s | K-Dev Notes",
    default: "K-Dev Notes - Technical Documentation & Reference",
  },
  description: "A detailed repository of reference guides, syntax cheat sheets, and technical writeups with clear analogies and production-grade examples.",
  keywords: ["programming", "web development", "database", "SQL", "Linux shell", "Next.js", "React", "developer reference"],
  authors: [{ name: "Kamran Khan", url: "https://kamranx.dev" }],
  creator: "Kamran Khan",
  icons: {
    icon: "/favicon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "K-Dev Notes",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://notes.kamranx.dev",
    title: "K-Dev Notes - Technical Documentation & Reference",
    description: "A detailed repository of reference guides, syntax cheat sheets, and technical writeups with clear analogies and production-grade examples.",
    siteName: "K-Dev Notes",
  },
  twitter: {
    card: "summary_large_image",
    title: "K-Dev Notes - Technical Documentation & Reference",
    description: "A detailed repository of reference guides, syntax cheat sheets, and technical writeups with clear analogies and production-grade examples.",
  },
};


const inter = Inter({
  subsets: ['latin'],
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
        <PWARegistration />
      </body>
    </html>
  );
}
