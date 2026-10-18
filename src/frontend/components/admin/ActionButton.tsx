'use client'

import { useState } from 'react'
import type { IconType } from 'react-icons'

interface ActionButtonProps {
  icon: IconType
  label: string
  variant?: 'primary' | 'danger'
  disabled?: boolean
  onClick: () => void
}

/**
 * 复用 AdminLoginPage 的圆形操作按钮样式。primary 对应确认/保留类操作，
 * danger 对应拒绝/删除类操作，颜色不同、交互语言（hover/active/disabled）相同。
 *
 * 不用原生 title 属性——那是浏览器自己画的提示框，样式由系统/浏览器决定，
 * 没法跟暗色主题统一。这里换成和 NavSidebar 图标提示同一套视觉语言的自绘浮层。
 */
export function ActionButton({ icon: Icon, label, variant = 'primary', disabled, onClick }: ActionButtonProps) {
  const [show, setShow] = useState(false)
  const colorClasses =
    variant === 'danger'
      ? 'bg-red-600 shadow-red-500/25'
      : 'bg-blue-600 shadow-blue-500/25'

  return (
    <div className="relative flex items-center justify-center">
      <button
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-lg transition-all hover:scale-95 active:scale-90 disabled:bg-white/5 disabled:text-zinc-600 disabled:shadow-none disabled:hover:scale-100 ${colorClasses}`}
      >
        <Icon className="h-[18px] w-[18px]" />
      </button>
      <div
        className={`
          absolute bottom-full mb-2 px-3 py-1.5 rounded-lg
          bg-zinc-900/95 border border-zinc-800/60 backdrop-blur-lg
          text-[11px] font-medium text-zinc-200 whitespace-nowrap
          transition-all duration-200 ease-out pointer-events-none z-50
          ${show && !disabled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}
        `}
      >
        {label}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-zinc-900/95" />
      </div>
    </div>
  )
}
