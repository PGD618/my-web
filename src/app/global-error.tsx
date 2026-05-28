'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="bg-zinc-950 text-zinc-200 h-full flex items-center justify-center antialiased">
        <div className="text-center space-y-8 max-w-md p-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-mono text-red-400 uppercase tracking-[0.2em]">
              Critical_Error
            </div>
            <h1 className="text-5xl font-bold tracking-tighter text-white leading-none">
              出错了
            </h1>
            <p className="text-zinc-500 text-lg font-light tracking-wide">
              应用发生了严重错误，请尝试重新加载。
            </p>
          </div>

          {error.digest && (
            <div className="px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
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
        </div>
      </body>
    </html>
  )
}
