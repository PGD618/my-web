import type { Metadata } from "next";
import "@/frontend/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://pgdream.cn'),
  title: {
    default: 'PGD618 | Digital Garden',
    template: '%s | PGD618',
  },
  description: 'Sophomore Full-stack Developer. 数字花园 — 记录技术、思考与成长的碎片。',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: 'PGD618 Digital Garden',
    title: 'PGD618 | Digital Garden',
    description: 'Sophomore Full-stack Developer. 数字花园 — 记录技术、思考与成长的碎片。',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PGD618 | Digital Garden',
    description: 'Sophomore Full-stack Developer. 数字花园 — 记录技术、思考与成长的碎片。',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    types: {
      'application/rss+xml': [
        { url: '/feed.xml', title: 'PGD618 Digital Garden RSS Feed' }
      ],
    },
  },
};

export { default } from "@/frontend/views/RootLayoutView";
