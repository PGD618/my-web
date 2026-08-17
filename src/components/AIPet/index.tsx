'use client'

import { useState } from 'react'
import { AIPetDialog } from './AIPetDialog'

export function AIPet() {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 20, y: 20 })

  return (
    <>
      {/* 桌宠容器 */}
      <div
        className="fixed z-50 cursor-pointer"
        style={{
          left: `${position.x}px`,
          bottom: `${position.y}px`,
        }}
        onClick={() => setIsOpen(true)}
      >
        {/* 占位符 - 后续替换为动画形象 */}
        <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
          <span className="text-3xl">🤖</span>
        </div>

        {/* 提示气泡 */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          点击和我聊天
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-800 rotate-45" />
        </div>
      </div>

      {/* 对话框 */}
      <AIPetDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
