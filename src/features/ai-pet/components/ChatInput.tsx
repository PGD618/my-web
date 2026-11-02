'use client'

import { useEffect, useRef } from 'react'
import { FiArrowUp } from 'react-icons/fi'

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  disabled: boolean
  placeholder: string
}

export function ChatInput({ value, onChange, onSend, disabled, placeholder }: ChatInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // 对话框打开时才挂载这个组件，挂载即聚焦
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // 输入框随内容弹性伸缩（参考 Claude Code 输入框）：每次内容变化先把高度重置成
  // auto 再读 scrollHeight 设回去，不能跳过"重置成 auto"这一步，否则 scrollHeight
  // 读到的是旧高度，内容变短时框不会缩回去。max-h-28 + custom-scrollbar 负责
  // 到达上限后的滚动，这里只管"没到上限时跟着内容涨"。
  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="relative z-10 border-t border-white/5 px-6 sm:px-8 py-5">
      <div className="flex items-end gap-3 rounded-[24px] border border-white/10 bg-zinc-950/60 p-2 pl-5 transition-colors focus-within:border-blue-400/40">
        <textarea
          ref={inputRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={disabled}
          className="custom-scrollbar max-h-28 flex-1 resize-none self-center bg-transparent py-2 text-[15px] font-light tracking-wide text-white placeholder:text-zinc-600 focus:outline-none disabled:opacity-50"
        />
        <button
          onClick={onSend}
          disabled={!value.trim() || disabled}
          aria-label="发送"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-95 active:scale-90 disabled:bg-white/5 disabled:text-zinc-600 disabled:shadow-none disabled:hover:scale-100"
        >
          <FiArrowUp className="h-[18px] w-[18px]" />
        </button>
      </div>
      <p className="mt-3 text-center text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-700">
        Enter 发送 · Shift + Enter 换行 · Esc 关闭
      </p>
    </div>
  )
}
