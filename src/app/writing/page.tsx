import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllNotes } from '@/backend/notes'
import { CATEGORIES } from '@/backend/utils'
import { FiArrowRight } from 'react-icons/fi'

export const metadata: Metadata = {
  title: 'Writing',
  description: '数字花园 — 技术沉淀、行业洞察、生活手记，同步自 Obsidian 的思想空间。',
  openGraph: { title: 'Digital Garden', description: '技术沉淀、行业洞察、生活手记。', url: '/writing' },
}

export default function WritingPortalPage() {
  const allNotes = getAllNotes()

  const categories = CATEGORIES.map(cat => ({
    ...cat,
    count: allNotes.filter(n => n.category === cat.name).length,
  }))

  return (
    <div className="h-full w-full overflow-y-auto bg-zinc-950 p-[5vw]">
      <div className="max-w-[1000px] mx-auto space-y-16">
        <header className="space-y-6 text-center py-[8vh]">
          <h1 className="text-[4vw] min-text-[32px] font-bold tracking-tighter text-white leading-tight">
            选择探索的维度
          </h1>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto">
            每个分区是我世界的一个切面。选一个方向，专注了解。
          </p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {categories.map(cat => (
            <Link
              key={cat.slug}
              href={`/writing/${cat.slug}`}
              className="group relative overflow-hidden rounded-[32px] bg-zinc-900/50 border border-zinc-800 p-8 hover:border-zinc-600 hover:bg-zinc-900/80 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="space-y-4">
                <span className="text-3xl">{cat.icon}</span>
                <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  {cat.name}
                </h2>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  {cat.description}
                </p>
              </div>
              <div className="flex items-center justify-between mt-8">
                <span className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest">
                  {cat.count} 篇
                </span>
                <FiArrowRight className="w-5 h-5 text-zinc-700 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  )
}
