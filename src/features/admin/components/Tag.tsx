import type { ReactNode } from 'react'

const TONES = {
  experience: 'bg-emerald-700/40 text-emerald-400',
  fact: 'bg-blue-700/40 text-blue-400',
  muted: 'bg-zinc-700/40 text-zinc-400',
} as const

/** 条目前的小徽标，如「经历」「事实」「以前认为」。className 用来补布局类（如 flex-shrink-0）。 */
export function Tag({
  tone,
  className = '',
  children,
}: {
  tone: keyof typeof TONES
  className?: string
  children: ReactNode
}) {
  return (
    <span className={`mt-0.5 inline-block px-1.5 py-0.5 text-[10px] rounded ${TONES[tone]} ${className}`}>
      {children}
    </span>
  )
}
