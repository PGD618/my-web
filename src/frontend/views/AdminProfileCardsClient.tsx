'use client'

import { useEffect, useState } from 'react'
import { FiUser } from 'react-icons/fi'
import { AdminPageShell } from '@/frontend/components/admin/AdminPageShell'
import { ReviewList } from '@/frontend/components/admin/ReviewList'

interface ProfileCard {
  id: string
  key: string
  value: string
  source: string
  created_at: string
}

export function AdminProfileCardsClient() {
  const [items, setItems] = useState<ProfileCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/profile-cards')
      const data = await res.json()
      setItems(data.items ?? [])
    } catch {
      setError('加载失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <AdminPageShell icon={FiUser} title="个人信息槽位" subtitle="Profile Cards">
      {error && <p className="mb-4 text-xs font-light tracking-wide text-red-400">{error}</p>}
      {loading ? (
        <p className="text-xs font-light tracking-wide text-zinc-500">加载中…</p>
      ) : (
        <ReviewList
          items={items}
          emptyLabel="暂无个人信息"
          renderItem={item => (
            <div className="rounded-[20px] border border-white/10 bg-zinc-950/60 p-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-400">{item.key}</p>
                <p className="mt-1 text-base text-white">{item.value}</p>
                <p className="mt-2 text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-600">
                  {item.source} · {new Date(item.created_at).toLocaleString('zh-CN')}
                </p>
              </div>
            </div>
          )}
        />
      )}
    </AdminPageShell>
  )
}
