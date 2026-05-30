import { getNotesByTag, getAllTags } from '@/backend/notes'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FiFileText, FiClock, FiArrowRight } from 'react-icons/fi'

export default async function TagNotesView({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params
  const tagName = decodeURIComponent(tag)
  const notes = getNotesByTag(tagName)

  if (notes.length === 0) notFound()

  return (
    <div className="w-full flex justify-center py-[10vh] px-[6vw]">
      <div className="w-full max-w-3xl">
        <nav className="flex items-center gap-2 mb-12 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
          <Link href="/writing" className="hover:text-zinc-200 transition-colors">
            Garden
          </Link>
          <span>/</span>
          <Link href="/writing/tags" className="hover:text-zinc-200 transition-colors">
            Tags
          </Link>
          <span>/</span>
          <span className="text-zinc-600">{tagName}</span>
        </nav>

        <header className="mb-16 border-b border-zinc-900 pb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-purple-500 text-2xl">#</span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white leading-[1.1]">
              {tagName}
            </h1>
          </div>
          <p className="text-zinc-500 text-sm font-mono uppercase tracking-widest">
            {notes.length} {notes.length === 1 ? 'fragment' : 'fragments'} tagged
          </p>
        </header>

        <div className="space-y-4">
          {notes
            .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
            .map((note) => (
              <Link
                key={note.slug}
                href={`/writing/${note.slug}`}
                className="group p-6 rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-white/10 hover:bg-zinc-900/50 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <FiFileText className="w-5 h-5 text-zinc-600 shrink-0" />
                  <div className="min-w-0">
                    <h3 className="text-white font-bold text-sm truncate group-hover:text-purple-400 transition-colors">
                      {note.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] font-mono text-zinc-500 uppercase">
                      <span>{note.category}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-800" />
                      <span className="flex items-center gap-1">
                        <FiClock className="w-3 h-3" />
                        {new Date(note.lastModified).toLocaleDateString()}
                      </span>
                    </div>
                    {note.excerpt && (
                      <p className="text-[11px] text-zinc-600 mt-2 line-clamp-2 italic leading-relaxed">
                        {note.excerpt.slice(0, 120)}
                      </p>
                    )}
                  </div>
                </div>
                <FiArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-4" />
              </Link>
            ))}
        </div>

        <footer className="mt-24 pt-12 border-t border-zinc-900 flex flex-col items-center gap-8">
          <Link href="/writing/tags" className="text-[10px] text-zinc-600 hover:text-white transition-colors font-mono uppercase tracking-[0.3em]">
            ← Back to Tags
          </Link>
        </footer>
      </div>
    </div>
  )
}

// 生成静态路径
export function generateStaticParams() {
  const tags = getAllTags()
  return tags.map((t) => ({ tag: encodeURIComponent(t.name) }))
}
