import { notes } from 'content'
import type { Note } from 'content'

export type { Note }

export function getAllNotes(): Note[] {
  return notes
}

export function getNote(slug: string): Note | undefined {
  return notes.find((n: Note) => n.slug === slug)
}

export function getRecentNotes(count: number = 4): Note[] {
  return [...notes]
    .sort(
      (a: Note, b: Note) =>
        new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    )
    .slice(0, count)
}

export function getBacklinks(note: Note): Note[] {
  return notes.filter(
    (n: Note) =>
      n.slug !== note.slug &&
      (n.outboundLinks?.includes(note.title) || n.outboundLinks?.includes(note.slug))
  )
}

export interface GraphNode {
  id: string
  slug: string
}

export interface GraphLink {
  source: string
  target: string
}

export interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
}

export function getGraphData(note: Note): GraphData {
  const outboundLinks = note.outboundLinks || []
  const slugMap = new Map<string, string>()
  notes.forEach((n: Note) => {
    slugMap.set(n.title, n.slug)
  })

  return {
    nodes: [
      { id: note.title, slug: note.slug },
      ...outboundLinks.map((l: string) => ({ id: l, slug: slugMap.get(l) || l })),
    ],
    links: outboundLinks.map((l: string) => ({ source: note.title, target: l })),
  }
}

export interface NotesStats {
  totalNotes: number
  categories: string[]
  totalWords: number
}

export function getNotesStats(): NotesStats {
  return {
    totalNotes: notes.length,
    categories: Array.from(new Set(notes.map((n: Note) => n.category))),
    totalWords: notes.reduce((acc: number, n: Note) => acc + (n.wordCount || 0), 0),
  }
}

// --- 标签相关 ---

export interface TagInfo {
  name: string
  count: number
}

// 获取所有标签及其计数
export function getAllTags(): TagInfo[] {
  const tagMap = new Map<string, number>()
  notes.forEach((n: Note) => {
    (n.tags || []).forEach((tag: string) => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
    })
  })
  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

// 按标签名获取笔记列表
export function getNotesByTag(tag: string): Note[] {
  return notes.filter((n: Note) => (n.tags || []).includes(tag))
}

// 获取置顶笔记
export function getPinnedNotes(): Note[] {
  return notes.filter((n: Note) => n.pinned)
}

// 按分类获取笔记列表
export function getNotesByCategory(category: string): Note[] {
  return notes.filter((n: Note) => n.category === category)
}

// 获取所有唯一的标签名
export function getTagNames(): string[] {
  return getAllTags().map((t) => t.name)
}
