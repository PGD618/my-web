'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiInbox, FiAlertTriangle, FiDatabase, FiArrowRight, FiUser, FiFileText, FiGitMerge } from 'react-icons/fi'
import { LogoutButton } from '@/frontend/components/admin/LogoutButton'

interface Entry {
  href: string
  icon: typeof FiInbox
  title: string
  subtitle: string
  countEndpoint: string
}

const ENTRIES: Entry[] = [
  {
    href: '/admin/pending',
    icon: FiInbox,
    title: '待审核观察',
    subtitle: 'Pending Observations',
    countEndpoint: '/api/admin/pending-observations',
  },
  {
    href: '/admin/disputes',
    icon: FiAlertTriangle,
    title: '待裁决冲突',
    subtitle: 'Disputed Facts',
    countEndpoint: '/api/admin/disputed-facts',
  },
  {
    href: '/admin/facts',
    icon: FiDatabase,
    title: '事实管理',
    subtitle: 'Confirmed Facts',
    countEndpoint: '/api/admin/confirmed-facts',
  },
  {
    href: '/admin/profile-cards',
    icon: FiUser,
    title: '个人信息槽位',
    subtitle: 'Profile Cards',
    countEndpoint: '/api/admin/profile-cards',
  },
  {
    href: '/admin/semantic-documents',
    icon: FiFileText,
    title: '语义记忆文档',
    subtitle: 'Semantic Documents',
    countEndpoint: '/api/admin/semantic-documents',
  },
  {
    href: '/admin/merge-proposals',
    icon: FiGitMerge,
    title: '合并提案',
    subtitle: 'Merge Proposals',
    countEndpoint: '/api/admin/semantic-merge-proposals',
  },
]

export function AdminDashboardClient() {
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    ENTRIES.forEach(entry => {
      fetch(entry.countEndpoint)
        .then(res => (res.ok ? res.json() : { items: [] }))
        .then(data => {
          setCounts(prev => ({ ...prev, [entry.href]: data.items?.length ?? 0 }))
        })
        .catch(() => {})
    })
  }, [])

  return (
    <div className="relative h-full overflow-hidden bg-zinc-950 px-6 py-10 md:px-[5vw]">
      <div className="pointer-events-none absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-purple-500/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 mx-auto max-w-3xl"
      >
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-sm font-bold tracking-wide text-white">管理后台</h1>
          <LogoutButton />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {ENTRIES.map(entry => {
            const Icon = entry.icon
            const count = counts[entry.href]
            return (
              <Link
                key={entry.href}
                href={entry.href}
                className="group rounded-[32px] border border-white/5 bg-zinc-900/60 p-6 backdrop-blur-xl shadow-2xl shadow-black/60 transition-colors hover:border-white/10"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-400">
                    <Icon className="h-4 w-4" />
                  </div>
                  {count !== undefined && count > 0 && (
                    <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-bold text-white">
                      {count}
                    </span>
                  )}
                </div>
                <h2 className="text-sm font-bold tracking-wide text-white">{entry.title}</h2>
                <p className="mb-4 text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-600">
                  {entry.subtitle}
                </p>
                <div className="flex items-center gap-1 text-xs font-light tracking-wide text-zinc-500 transition-colors group-hover:text-blue-300">
                  查看
                  <FiArrowRight className="h-3 w-3" />
                </div>
              </Link>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
