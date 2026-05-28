export default function Loading() {
  return (
    <div className="h-full w-full bg-zinc-950 p-[5vw]">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header skeleton */}
        <div className="space-y-4">
          <div className="h-4 w-32 rounded-full bg-zinc-900 animate-pulse" />
          <div className="h-10 w-80 rounded-lg bg-zinc-900 animate-pulse" />
          <div className="h-4 w-64 rounded-full bg-zinc-900/60 animate-pulse" />
        </div>
        {/* Divider */}
        <div className="h-px w-full bg-zinc-900" />
        {/* Content skeleton */}
        <div className="space-y-4 pt-4">
          <div className="h-3 w-full rounded-full bg-zinc-900/40 animate-pulse" />
          <div className="h-3 w-[92%] rounded-full bg-zinc-900/40 animate-pulse" />
          <div className="h-3 w-[85%] rounded-full bg-zinc-900/40 animate-pulse" />
          <div className="h-3 w-[78%] rounded-full bg-zinc-900/40 animate-pulse" />
          <div className="h-8" />
          <div className="h-3 w-full rounded-full bg-zinc-900/40 animate-pulse" />
          <div className="h-3 w-[88%] rounded-full bg-zinc-900/40 animate-pulse" />
          <div className="h-3 w-[70%] rounded-full bg-zinc-900/40 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
