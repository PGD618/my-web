import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getNote, getBacklinks, getGraphData } from '@/backend/notes'
import { categorySlugToName, resolveNotePath } from '@/backend/utils'
import NotePageView from '@/frontend/views/NotePageView'
import WritingWorkspace from '@/frontend/views/WritingWorkspace'

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  try {
    const { slug: rawSlug } = await params
    const slug = rawSlug.map(decodeURIComponent)
    const firstSegment = slug[0]

    if (slug.length === 1 && categorySlugToName(firstSegment)) {
      const name = categorySlugToName(firstSegment)!
      return { title: name, description: `${name} - PGD618 Digital Garden` }
    }

    const notePath = resolveNotePath(slug)
    const note = getNote(notePath)
    if (!note) return {}

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
  } catch (err) {
    console.error('[generateMetadata] error:', err)
    return {}
  }
}

export default async function WritingCatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug: rawSlug } = await params
  const slug = rawSlug.map(decodeURIComponent)

  // 如果 slug 只有一段且是已知英文分类 → 渲染工作区
  if (slug.length === 1 && categorySlugToName(slug[0])) {
    return <WritingWorkspace categorySlug={slug[0]} />
  }

  // 否则 → 按笔记路径查找并渲染
  const notePath = resolveNotePath(slug)
  const note = getNote(notePath)

  if (!note) {
    console.warn('[WritingCatchAllPage] note not found:', { notePath, slug })
    notFound()
  }

  console.log('[WritingCatchAllPage] rendering note:', { notePath, title: note.title, contentLen: note.content?.length })

  const backlinks = getBacklinks(note)
  const graphData = getGraphData(note)

  return <NotePageView note={note} slug={slug} backlinks={backlinks} graphData={graphData} />
}
