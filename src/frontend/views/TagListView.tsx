import { getAllTags } from '@/backend/notes'
import Link from 'next/link'
import { FiHash, FiArrowRight } from 'react-icons/fi'

export default function TagListView() {
  const tags = getAllTags()

  return (
    <div className="w-full flex justify-center py-[10vh] px-[6vw]">
      <div className="w-full max-w-3xl">
        <header className="mb-16 border-b border-zinc-900 pb-12">
          <div className="flex items-center gap-2 mb-6">
            <FiHash className="text-purple-500" />
            <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-500 text-[10px] font-mono uppercase tracking-[0.2em]">
              Tags
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white leading-[1.1]">
            标签索引
          </h1>
          <p className="text-zinc-500 mt-4 text-lg">
            通过标签浏览所有笔记碎片
          </p>
        </header>

        {tags.length === 0 ? (
          <div className="py-20 text-center">
            <FiHash className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
            <p className="text-zinc-600 font-mono text-sm uppercase tracking-widest">
              No tags found
            </p>
            <p className="text-zinc-700 text-sm mt-2">
              在笔记的 frontmatter 中添加 tags 字段，或使用 #tag 语法
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tags.map((tag) => (
              <Link
                key={tag.name}
                href={`/writing/tags/${encodeURIComponent(tag.name)}`}
                className="group p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800/50 hover:border-zinc-600 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-purple-500 text-lg">#</span>
                  <div className="min-w-0">
                    <h3 className="text-white font-bold text-sm truncate group-hover:text-purple-400 transition-colors">
                      {tag.name}
                    </h3>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase mt-1 block">
                      {tag.count} {tag.count === 1 ? 'fragment' : 'fragments'}
                    </span>
                  </div>
                </div>
                <FiArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        )}

        <footer className="mt-24 pt-12 border-t border-zinc-900 flex flex-col items-center gap-8">
          <Link href="/writing" className="text-[10px] text-zinc-600 hover:text-white transition-colors font-mono uppercase tracking-[0.3em]">
            ← Back to Digital Garden
          </Link>
        </footer>
      </div>
    </div>
  )
}
