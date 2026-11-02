const SIZES = {
  // 卡片里的小标签
  sm: {
    row: 'flex flex-wrap gap-1.5',
    tag: 'px-2.5 py-1 rounded-full bg-zinc-800/50 border border-zinc-800 text-[10px] font-mono text-zinc-400 tracking-wide',
  },
  // 详情抽屉里的标签
  md: {
    row: 'flex flex-wrap gap-2',
    tag: 'px-3 py-1.5 rounded-full bg-zinc-800/60 border border-zinc-800 text-[11px] font-mono text-zinc-400 tracking-wide',
  },
} as const

export function TagList({ tags, size = 'sm' }: { tags: string[]; size?: keyof typeof SIZES }) {
  const s = SIZES[size]
  return (
    <div className={s.row}>
      {tags.map(tag => (
        <span key={tag} className={s.tag}>
          {tag}
        </span>
      ))}
    </div>
  )
}
