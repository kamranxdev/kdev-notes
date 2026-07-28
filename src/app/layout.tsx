import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import PWARegistration from '@/components/PWARegistration';

export const viewport: Viewport = {
  themeColor: '#c9fd74',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://notes.kamranx.dev'),
  title: {
    template: "%s | K-Dev Notes | Kamran Khan (kamranxdev)",
    default: "K-Dev Notes | Engineering Docs & Reference | Kamran Khan (kamranxdev)",
  },
  description: "Official technical documentation, computer science notes, DSA cheat sheets, and production code patterns authored by Kamran Khan (kamranxdev).",
  keywords: [
    "K-Dev Notes",
    "Kamran Khan",
    "kamranxdev",
    "kamranx",
    "notes.kamranx.dev",
    "@kamranxdev",
    "Kamran Khan Software Engineer",
    "Software Engineer & Full Stack Developer",
    "System Design",
    "Data Structures & Algorithms",
    "Next.js Notes",
    "TypeScript Docs"
  ],
  authors: [{ name: "Kamran Khan", url: "https://kamranx.dev" }],
  creator: "Kamran Khan (kamranxdev)",
  publisher: "Kamran Khan",
  alternates: {
    canonical: "https://notes.kamranx.dev",
  },
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
    title: "K-Dev Notes | Engineering Docs & Reference | Kamran Khan (kamranxdev)",
    description: "Official technical documentation, computer science notes, DSA cheat sheets, and production code patterns authored by Kamran Khan (kamranxdev).",
    siteName: "K-Dev Notes",
  },
  twitter: {
    card: "summary_large_image",
    title: "K-Dev Notes | Engineering Docs & Reference | Kamran Khan (kamranxdev)",
    description: "Official technical documentation, computer science notes, DSA cheat sheets, and production code patterns authored by Kamran Khan (kamranxdev).",
    creator: "@kamranxdev",
    site: "@kamranxdev",
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
