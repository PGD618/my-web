import { getNotesStats, getPinnedNotes, getAllNotes } from '@/backend/notes'
import { getCategoryMeta } from '@/backend/utils'
import Link from 'next/link'
import { FiBookOpen, FiHash, FiClock, FiActivity, FiArrowRight, FiStar } from 'react-icons/fi'

export default function WritingDashboard() {
  const stats = getNotesStats()
  const pinnedNotes = getPinnedNotes().slice(0, 2)
  const allNotes = getAllNotes()

  // 构建分类数据：合并已知分类的元数据和实际数据中存在的分类
  const categoryEntries = stats.categories.map(cat => ({
    name: cat,
    meta: getCategoryMeta(cat),
    count: allNotes.filter(n => n.category === cat).length,
  }))

  return (
    <div className="h-full w-full overflow-y-auto bg-zinc-950 p-[5vw]">
      <div className="max-w-[1000px] mx-auto space-y-16">
        {/* Header */}
        <header className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">
            <FiActivity className="text-blue-500" /> Digital Garden Status: Active
          </div>
          <h1 className="text-[4vw] min-text-[32px] font-bold tracking-tighter text-white leading-tight">
            Select a fragment <br />
            <span className="text-zinc-600 font-light italic text-[3.5vw]">to start exploring.</span>
          </h1>
          <p className="text-zinc-500 text-lg max-w-xl">
            这里是我的碎片空间。技术沉淀、行业观察、生活手记 —— 左侧目录同步自 Obsidian，按兴趣分区浏览。
          </p>
        </header>

        {/* Pinned Articles */}
        {pinnedNotes.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-600 flex items-center gap-2 px-2">
              <FiStar className="w-3.5 h-3.5" /> Featured
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pinnedNotes.map(note => (
                <Link
                  key={note.slug}
                  href={`/writing/${note.slug}`}
                  className="group relative overflow-hidden rounded-[28px] bg-zinc-900/60 border border-zinc-800 p-8 hover:border-blue-500/30 hover:bg-zinc-900/80 transition-all"
                >
                  <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-blue-500/50 via-purple-500/30 to-transparent" />
                  <div className="space-y-3">
                    <span className="inline-block text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                      {note.category}
                    </span>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {note.title}
                    </h3>
                    {note.excerpt && (
                      <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed">
                        {note.excerpt}
                      </p>
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

        {/* Category Navigation Cards */}
        <section className="space-y-8">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-600 px-2">
            Explore by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryEntries.map(({ name, meta, count }) => (
              <div
                key={name}
                className="group p-6 rounded-[28px] bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all"
              >
                <div className="text-2xl mb-4">{meta.icon}</div>
                <h3 className="text-white font-bold text-base group-hover:text-blue-400 transition-colors">
                  {name}
                </h3>
                <p className="text-zinc-600 text-xs mt-2 leading-relaxed">
                  {meta.description}
                </p>
                <div className="mt-4 text-[10px] font-mono text-zinc-700 uppercase tracking-widest">
                  {count} 篇
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-[24px] bg-zinc-900/30 border border-zinc-800/50">
            <FiBookOpen className="text-blue-500/60 w-5 h-5 mb-4" />
            <div className="text-2xl font-bold text-white tracking-tight">{stats.totalNotes}</div>
            <div className="text-[10px] uppercase tracking-widest text-zinc-600 mt-1 font-mono">Total Fragments</div>
          </div>
          <div className="p-6 rounded-[24px] bg-zinc-900/30 border border-zinc-800/50">
            <FiHash className="text-purple-500/60 w-5 h-5 mb-4" />
            <div className="text-2xl font-bold text-white tracking-tight">{stats.categories.length}</div>
            <div className="text-[10px] uppercase tracking-widest text-zinc-600 mt-1 font-mono">Categories</div>
          </div>
          <div className="p-6 rounded-[24px] bg-zinc-900/30 border border-zinc-800/50">
            <FiClock className="text-green-500/60 w-5 h-5 mb-4" />
            <div className="text-2xl font-bold text-white tracking-tight">{Math.round(stats.totalWords / 1000)}k</div>
            <div className="text-[10px] uppercase tracking-widest text-zinc-600 mt-1 font-mono">Words Captured</div>
          </div>
        </section>

        <footer className="pt-12 text-center border-t border-zinc-900">
          <p className="text-[10px] text-zinc-700 font-mono uppercase tracking-[0.4em]">
            Fragments of thought, code, and life.
          </p>
        </footer>
      </div>
    </div>
  )
}
