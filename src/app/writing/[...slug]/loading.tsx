export default function NoteLoading() {
  return (
    <div className="w-full flex justify-center py-[10vh] px-[6vw]">
      <div className="w-full max-w-5xl flex gap-12">
        <article className="w-full max-w-3xl min-w-0">
          <nav className="flex items-center gap-2 mb-12">
            <div className="h-4 w-12 bg-zinc-800 rounded animate-pulse" />
            <span className="text-zinc-800">/</span>
            <div className="h-4 w-16 bg-zinc-800 rounded animate-pulse" />
          </nav>

          <header className="mb-16 border-b border-zinc-900 pb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-5 w-16 bg-zinc-800 rounded animate-pulse" />
            </div>
            <div className="h-16 w-2/3 bg-zinc-800 rounded animate-pulse mb-8" />
            <div className="flex items-center gap-8">
              <div className="h-3 w-24 bg-zinc-800 rounded animate-pulse" />
              <div className="h-3 w-20 bg-zinc-800 rounded animate-pulse" />
            </div>
          </header>

          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 bg-zinc-800 rounded animate-pulse" style={{ width: `${80 - i * 10}%` }} />
            ))}
          </div>
        </article>
      </div>
    </div>
  )
}
