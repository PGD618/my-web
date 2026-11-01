import type { ReactNode } from 'react'

/** 后台页面的深色圆角卡片。内边距和布局由 className 决定（如 `p-4`、`p-6 text-center`）。 */
export function AdminCard({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`rounded-[20px] border border-white/10 bg-zinc-950/60 ${className}`}>{children}</div>
}
