import type { Metadata } from 'next'
import { getNote } from '@/backend/notes'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params
  const currentPath = decodeURIComponent(slug.join('/'))
  const note = getNote(currentPath)
  if (!note) notFound()

  const url = `/writing/${note.slug}`
  return {
    title: note.title,
    description: note.excerpt || `${note.title} - PGD618 Digital Garden`,
    openGraph: {
      type: 'article',
      title: note.title,
      description: note.excerpt || `${note.title} - PGD618 Digital Garden`,
      url,
      publishedTime: note.lastModified,
      modifiedTime: note.lastModified,
      section: note.category,
      siteName: 'PGD618 Digital Garden',
    },
    twitter: {
      card: 'summary',
      title: note.title,
      description: note.excerpt || `${note.title} - PGD618 Digital Garden`,
    },
    alternates: { canonical: url },
  }
}

export { default } from '@/frontend/views/NotePageView'
