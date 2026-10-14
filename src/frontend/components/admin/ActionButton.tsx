'use client'

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
 */
export function ActionButton({ icon: Icon, label, variant = 'primary', disabled, onClick }: ActionButtonProps) {
  const colorClasses =
    variant === 'danger'
      ? 'bg-red-600 shadow-red-500/25'
      : 'bg-blue-600 shadow-blue-500/25'

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-lg transition-all hover:scale-95 active:scale-90 disabled:bg-white/5 disabled:text-zinc-600 disabled:shadow-none disabled:hover:scale-100 ${colorClasses}`}
    >
      <Icon className="h-[18px] w-[18px]" />
    </button>
  )
}
