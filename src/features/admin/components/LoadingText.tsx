import type { ReactNode } from 'react'

/** 后台页面的「加载中…」等灰色小字提示 */
export function LoadingText({ children = '加载中…' }: { children?: ReactNode }) {
  return <p className="text-xs font-light tracking-wide text-zinc-500">{children}</p>
}
