import type { Metadata } from "next";
import "@/shared/styles/globals.css";
import { site } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: '%s | PGD618',
  },
  description: site.description,
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: site.siteName,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    types: {
      'application/rss+xml': [
        { url: '/feed.xml', title: `${site.siteName} RSS Feed` }
      ],
    },
  },
};

export { default } from "@/shared/layout/RootLayoutView";
