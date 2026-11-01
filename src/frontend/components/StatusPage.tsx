import type { ReactNode } from 'react'

// error.tsx、global-error.tsx、not-found.tsx 共用的状态页。
// 不用 hooks，服务端组件和客户端组件都能直接用。

export const STATUS_PRIMARY_BUTTON =
  'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-200 transition-colors'
export const STATUS_SECONDARY_BUTTON =
  'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-800 hover:border-zinc-700 transition-colors'

const BADGE_TONES = {
  danger: 'bg-red-500/10 border border-red-500/20 text-red-400',
  neutral: 'bg-zinc-900 border border-zinc-800 text-zinc-500',
} as const

interface StatusContentProps {
  badge: string
  badgeTone: keyof typeof BADGE_TONES
  heading: string
  /** 标题字号，错误页 text-5xl，404 用 text-[8rem] */
  headingSize?: 'text-5xl' | 'text-[8rem]'
  description: string
  digest?: string
  actions: ReactNode
  footer?: ReactNode
  className?: string
}

/** 只有内容块，没有全屏外壳；global-error 需要自己包 html/body 时用它 */
export function StatusContent({
  badge,
  badgeTone,
  heading,
  headingSize = 'text-5xl',
  description,
  digest,
  actions,
  footer,
  className = '',
}: StatusContentProps) {
  return (
    <div className={`text-center space-y-8 max-w-md ${className}`}>
      <div className="space-y-3">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] ${BADGE_TONES[badgeTone]}`}
        >
          {badge}
        </div>
        <h1 className={`${headingSize} font-bold tracking-tighter text-white leading-none`}>{heading}</h1>
        <p className="text-zinc-500 text-lg font-light tracking-wide">{description}</p>
      </div>

      {digest && (
        <div className="px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Digest: {digest}</span>
        </div>
      )}

      {actions}

      {footer}
    </div>
  )
}

/** 填满所在区域、内容居中的状态页 */
export function StatusPage(props: StatusContentProps) {
  return (
    <div className="h-full w-full flex items-center justify-center bg-zinc-950 p-8">
      <StatusContent {...props} />
    </div>
  )
}
