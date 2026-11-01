import type { ReactNode } from 'react'

interface TooltipProps {
  /** 是否显示；hover/focus 状态由触发元素自己管理 */
  visible: boolean
  /** 浮层在触发元素上方还是下方 */
  placement?: 'top' | 'bottom'
  children: ReactNode
}

/**
 * 和 NavSidebar 图标提示同一套视觉语言的自绘浮层，替代原生 title 属性（原生提示的样式
 * 由系统决定，没法跟暗色主题统一）。父元素需要是 relative 定位。
 */
export function Tooltip({ visible, placement = 'top', children }: TooltipProps) {
  const isTop = placement === 'top'
  const position = isTop ? 'bottom-full mb-2' : 'top-full mt-2'
  const motion = visible ? 'opacity-100 translate-y-0' : isTop ? 'opacity-0 translate-y-1' : 'opacity-0 -translate-y-1'
  const arrow = isTop
    ? 'top-full border-t-4 border-t-zinc-900/95'
    : 'bottom-full border-b-4 border-b-zinc-900/95'

  return (
    <div
      className={`
        absolute ${position} px-3 py-1.5 rounded-lg
        bg-zinc-900/95 border border-zinc-800/60 backdrop-blur-lg
        text-[11px] font-medium text-zinc-200 whitespace-nowrap
        transition-all duration-200 ease-out pointer-events-none z-50
        ${motion}
      `}
    >
      {children}
      <div className={`absolute ${arrow} left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent`} />
    </div>
  )
}
