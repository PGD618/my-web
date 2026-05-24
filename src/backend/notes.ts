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

export function getGraphData(note: Note): {
  nodes: { id: string }[]
  links: { source: string; target: string }[]
} {
  const outboundLinks = note.outboundLinks || []
  return {
    nodes: [{ id: note.title }, ...outboundLinks.map((l: string) => ({ id: l }))],
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
