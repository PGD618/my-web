import Link from 'next/link'
import { FiHome, FiEdit3 } from 'react-icons/fi'

export default function NotFound() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-zinc-950 p-8">
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">
            Error_404
          </div>
          <h1 className="text-[8rem] font-bold tracking-tighter text-white leading-none">
            404
          </h1>
          <p className="text-zinc-500 text-lg font-light tracking-wide">
            这个页面不存在，或已被移除。
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-200 transition-colors"
          >
            <FiHome className="w-4 h-4" />
            返回首页
          </Link>
          <Link
            href="/writing"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <FiEdit3 className="w-4 h-4" />
            浏览碎片
          </Link>
        </div>

        <div className="pt-4">
          <span className="text-[10px] font-mono text-zinc-800 uppercase tracking-[0.3em]">
            Fragment_not_found
          </span>
        </div>
      </div>
    </div>
  )
}
