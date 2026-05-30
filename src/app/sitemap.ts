import type { MetadataRoute } from 'next'
import { getAllNotes } from '@/backend/notes'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://pgdream.cn'

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/writing`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/projects`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/experience`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  const notePages: MetadataRoute.Sitemap = getAllNotes().map((note) => ({
    url: `${baseUrl}/writing/${note.slug}`,
    lastModified: new Date(note.lastModified),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...notePages]
}
