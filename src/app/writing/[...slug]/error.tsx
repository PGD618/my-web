'use client'

import { useEffect } from 'react'

export default function NoteError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 生产环境下错误已由 Next.js 自动收集，这里仅在开发模式记录详细信息
    if (process.env.NODE_ENV === 'development') {
      console.error('[NoteError] note page rendering error:', error)
    }
  }, [error])

  return (
    <div className="w-full flex justify-center py-[10vh] px-[6vw]">
      <div className="w-full max-w-5xl flex gap-12">
        <article className="w-full max-w-3xl min-w-0">
          <nav className="flex items-center gap-2 mb-12 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
            <span>Garden</span>
            <span>/</span>
            <span className="text-zinc-600">...</span>
          </nav>

          <header className="mb-16 border-b border-zinc-900 pb-12">
            <div className="flex items-center gap-2 mb-6">
              <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-[10px] font-mono text-red-400 uppercase tracking-[0.2em]">
                Render_Error
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-4">
              内容渲染失败
            </h1>

            <p className="text-zinc-400 leading-relaxed mb-6">
              这篇笔记的内容在渲染时发生了错误。这可能是由于内容中的特殊格式或组件兼容性问题导致的。
            </p>

            {error.digest && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 inline-block">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  Digest: {error.digest}
                </span>
              </div>
            )}

            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-200 transition-colors"
            >
              重新加载
            </button>
          </header>

          <details className="mt-8">
            <summary className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest cursor-pointer hover:text-zinc-400 transition-colors">
              查看错误详情
            </summary>
            <pre className="mt-3 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-500 font-mono overflow-x-auto">
              {error.message}
            </pre>
          </details>
        </article>
      </div>
    </div>
  )
}
