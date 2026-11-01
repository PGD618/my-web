'use client'

import { useState } from 'react'
import type { IconType } from 'react-icons'
import { Tooltip } from './Tooltip'

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
      <Tooltip visible={show && !disabled}>{label}</Tooltip>
    </div>
  )
}
