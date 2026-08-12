import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllNotes } from '@/backend/notes'
import { FiFileText, FiClock, FiBookOpen, FiArrowRight, FiHash } from 'react-icons/fi'

export const metadata: Metadata = {
  title: '全部笔记',
  description: '按时间顺序浏览数字花园中的所有笔记碎片',
  openGraph: {
    title: '全部笔记 | PGD618 Digital Garden',
    description: '按时间顺序浏览数字花园中的所有笔记碎片',
    url: '/writing/all',
  },
}

export default function AllNotesPage() {
  const allNotes = getAllNotes().sort(
    (a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
  )

  const totalWords = allNotes.reduce((sum, note) => sum + (note.wordCount || 0), 0)

  return (
    <div className="w-full flex justify-center py-[10vh] px-[6vw]">
      <div className="w-full max-w-4xl">
        <nav className="flex items-center gap-2 mb-12 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
          <Link href="/writing" className="hover:text-zinc-200 transition-colors">
            Garden
          </Link>
          <span>/</span>
          <span className="text-zinc-600">All Notes</span>
        </nav>

        <header className="mb-16 border-b border-zinc-900 pb-12">
          <div className="flex items-center gap-2 mb-6">
            <FiBookOpen className="text-cyan-400" />
            <span className="px-2 py-0.5 rounded bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-[10px] font-mono uppercase tracking-[0.2em]">
              All_Notes
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white leading-[1.1] mb-4">
            全部笔记
          </h1>
          <p className="text-zinc-500 text-lg leading-relaxed">
            数字花园的时间流 — 按最近修改时间排序
          </p>

          <div className="flex items-center gap-6 mt-8 text-[10px] font-mono uppercase tracking-widest text-zinc-600">
            <div className="flex items-center gap-2">
              <FiFileText className="w-3 h-3" />
              <span>{allNotes.length} 篇笔记</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-zinc-800" />
            <div className="flex items-center gap-2">
              <FiBookOpen className="w-3 h-3" />
              <span>{totalWords.toLocaleString()} 字</span>
            </div>
          </div>
        </header>

        {allNotes.length === 0 ? (
          <div className="py-20 text-center">
            <FiFileText className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
            <p className="text-zinc-600 font-mono text-sm uppercase tracking-widest">
              No notes found
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {allNotes.map((note) => (
              <Link
                key={note.slug}
                href={`/writing/${note.slug}`}
                className="group block p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/50 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-white font-bold text-base group-hover:text-cyan-400 transition-colors truncate">
                        {note.title}
                      </h3>
                      <span className="shrink-0 px-2 py-0.5 rounded bg-zinc-800/50 text-zinc-500 text-[9px] font-mono uppercase tracking-wider">
                        {note.category}
                      </span>
                    </div>

                    {note.excerpt && (
                      <p className="text-sm text-zinc-500 leading-relaxed mb-3 line-clamp-2">
                        {note.excerpt}
                      </p>
                    )}

                    <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-[10px] font-mono text-zinc-600 uppercase">
                      <span className="flex items-center gap-1.5">
                        <FiClock className="w-3 h-3" />
                        {new Date(note.lastModified).toLocaleDateString('zh-CN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })}
                      </span>
                      {note.wordCount && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-zinc-800" />
                          <span>{note.wordCount} 字</span>
                        </>
                      )}
                      {note.tags && note.tags.length > 0 && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-zinc-800" />
                          <div className="flex items-center gap-1.5">
                            <FiHash className="w-3 h-3" />
                            <span className="truncate max-w-[200px]">
                              {note.tags.slice(0, 3).join(', ')}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <FiArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                </div>
              </Link>
            ))}
          </div>
        )}

        <footer className="mt-24 pt-12 border-t border-zinc-900 flex flex-col items-center gap-8">
          <Link
            href="/writing"
            className="text-[10px] text-zinc-600 hover:text-white transition-colors font-mono uppercase tracking-[0.3em]"
          >
            ← Back to Garden Portal
          </Link>
        </footer>
      </div>
    </div>
  )
}
