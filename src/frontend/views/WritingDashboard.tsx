import { getNotesStats, getRecentNotes } from '@/backend/notes'
import Link from 'next/link'
import { FiBookOpen, FiHash, FiClock, FiActivity, FiArrowRight, FiEdit3 } from 'react-icons/fi'

export default function WritingDashboard() {
  const stats = getNotesStats()
  const recentNotes = getRecentNotes(4)

  return (
    <div className="h-full w-full overflow-y-auto bg-zinc-950 p-[5vw]">
      <div className="max-w-[1000px] mx-auto space-y-16">
        <header className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">
            <FiActivity className="text-blue-500" /> Digital Garden Status: Active
          </div>
          <h1 className="text-[4vw] min-text-[32px] font-bold tracking-tighter text-white leading-tight">
            Select a fragment <br />
            <span className="text-zinc-600 font-light italic text-[3.5vw]">to start exploring.</span>
          </h1>
          <p className="text-zinc-500 text-lg max-w-xl">
            这是我的知识库入口。左侧目录同步自我的 Obsidian 仓库，涵盖了算法、面试经、前端技术以及我的个人思考。
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-[32px] bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between hover:border-zinc-700 transition-all">
            <FiBookOpen className="text-blue-500 w-6 h-6" />
            <div className="mt-8">
              <div className="text-3xl font-bold text-white tracking-tighter">{stats.totalNotes}</div>
              <div className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1 font-mono">Total Fragments</div>
            </div>
          </div>
          <div className="p-8 rounded-[32px] bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between hover:border-zinc-700 transition-all">
            <FiHash className="text-purple-500 w-6 h-6" />
            <div className="mt-8">
              <div className="text-3xl font-bold text-white tracking-tighter">{stats.categories.length}</div>
              <div className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1 font-mono">Categories</div>
            </div>
          </div>
          <div className="p-8 rounded-[32px] bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between hover:border-zinc-700 transition-all">
            <FiClock className="text-green-500 w-6 h-6" />
            <div className="mt-8">
              <div className="text-3xl font-bold text-white tracking-tighter">{Math.round(stats.totalWords / 1000)}k</div>
              <div className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1 font-mono">Words Captured</div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-600 flex items-center gap-2">
              <FiEdit3 /> Recent Contributions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentNotes.map((note) => (
              <Link
                key={note.slug}
                href={`/writing/${note.slug}`}
                className="group p-6 rounded-3xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800/50 hover:border-zinc-600 transition-all flex items-center justify-between"
              >
                <div className="min-w-0">
                  <h3 className="text-white font-bold text-sm truncate group-hover:text-blue-400 transition-colors">
                    {note.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] font-mono text-zinc-500 uppercase">
                    <span>{note.category}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-800" />
                    <span>{new Date(note.lastModified).toLocaleDateString()}</span>
                  </div>
                </div>
                <FiArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </section>

        <footer className="pt-12 text-center border-t border-zinc-900">
          <p className="text-[10px] text-zinc-700 font-mono uppercase tracking-[0.4em]">
            Built for knowledge, not for display.
          </p>
        </footer>
      </div>
    </div>
  )
}
