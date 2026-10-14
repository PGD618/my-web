'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { IconType } from 'react-icons'

interface AdminPageShellProps {
  icon: IconType
  title: string
  subtitle: string
  children: ReactNode
}

/**
 * 四个 /admin/* 页面共用的外壳：背景光斑 + 标题区，视觉语言和 AdminLoginPage 保持一致。
 */
export function AdminPageShell({ icon: Icon, title, subtitle, children }: AdminPageShellProps) {
  return (
    <div className="relative h-full overflow-y-auto bg-zinc-950 px-6 py-10 md:px-[5vw]">
      <div className="pointer-events-none absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-purple-500/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 mx-auto max-w-3xl"
      >
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-400">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wide text-white">{title}</h1>
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-600">
              {subtitle}
            </p>
          </div>
        </div>

        {children}
      </motion.div>
    </div>
  )
}
