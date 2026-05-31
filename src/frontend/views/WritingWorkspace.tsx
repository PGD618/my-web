import { getAllNotes } from '@/backend/notes'
import { CATEGORIES, categorySlugToName } from '@/backend/utils'
import Link from 'next/link'
import { FiArrowRight, FiStar, FiGrid } from 'react-icons/fi'

export default function WritingWorkspace({ categorySlug }: { categorySlug: string }) {
  const categoryName = categorySlugToName(categorySlug)
  if (!categoryName) return null

  const catConfig = CATEGORIES.find(c => c.slug === categorySlug)
  const allNotes = getAllNotes()
  const categoryNotes = allNotes.filter(n => n.category === categoryName)
  const pinned = categoryNotes.filter(n => n.pinned).slice(0, 2)
  const recent = [...categoryNotes]
    .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
    .slice(0, 8)
  const totalWords = categoryNotes.reduce((acc, n) => acc + (n.wordCount || 0), 0)
  const otherCategories = CATEGORIES.filter(c => c.slug !== categorySlug)

  return (
    <div className="h-full w-full overflow-y-auto bg-zinc-950 p-[5vw]">
      <div className="max-w-[1000px] mx-auto space-y-14">
        {/* Header */}
        <header className="space-y-5">
          <Link
            href="/writing"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-300 transition-colors group"
          >
            <FiGrid className="w-3.5 h-3.5 group-hover:text-blue-400 transition-colors" />
            <span>返回全貌</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-4xl">{catConfig?.icon}</span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                {categoryName}
              </h1>
              <p className="text-zinc-500 text-sm mt-1">{catConfig?.description}</p>
            </div>
          </div>

          {otherCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {otherCategories.map(cat => (
                <Link
                  key={cat.slug}
                  href={`/writing/${cat.slug}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-500 hover:text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* Stats */}
        <section className="grid grid-cols-3 gap-3">
          <div className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
            <div className="text-xl font-bold text-white">{categoryNotes.length}</div>
            <div className="text-[10px] uppercase tracking-widest text-zinc-600 mt-1 font-mono">Fragments</div>
          </div>
          <div className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
            <div className="text-xl font-bold text-white">{Math.round(totalWords / 1000)}k</div>
            <div className="text-[10px] uppercase tracking-widest text-zinc-600 mt-1 font-mono">Words</div>
          </div>
          <div className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
            <div className="text-xl font-bold text-white">{new Set(categoryNotes.flatMap(n => n.tags || [])).size}</div>
            <div className="text-[10px] uppercase tracking-widest text-zinc-600 mt-1 font-mono">Tags</div>
          </div>
        </section>

        {/* Pinned */}
        {pinned.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-600 flex items-center gap-2 px-2">
              <FiStar className="w-3.5 h-3.5" /> Featured
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pinned.map(note => (
                <Link
                  key={note.slug}
                  href={`/writing/${note.slug}`}
                  className="group relative overflow-hidden rounded-[28px] bg-zinc-900/60 border border-zinc-800 p-8 hover:border-blue-500/30 hover:bg-zinc-900/80 transition-all"
                >
                  <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-blue-500/50 via-purple-500/30 to-transparent" />
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {note.title}
                    </h3>
                    {note.excerpt && (
                      <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed">{note.excerpt}</p>
                    )}
                    <div className="flex items-center gap-2 text-zinc-600 text-xs pt-2">
                      <span>推荐阅读</span>
                      <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:text-blue-400 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recent */}
        {recent.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-600 px-2">
              Recent
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recent.map(note => (
                <Link
                  key={note.slug}
                  href={`/writing/${note.slug}`}
                  className="group p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <h3 className="text-white font-medium text-sm truncate group-hover:text-blue-400 transition-colors">
                      {note.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-zinc-600 uppercase">
                      <span>{new Date(note.lastModified).toLocaleDateString()}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-800" />
                      <span>{note.wordCount} words</span>
                    </div>
                  </div>
                  <FiArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-3" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {categoryNotes.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-600 text-sm">这个分区还没有内容。</p>
            <Link href="/writing" className="text-blue-500 text-sm mt-2 inline-block hover:underline">
              返回全貌
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
