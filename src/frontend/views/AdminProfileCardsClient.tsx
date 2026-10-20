'use client'

import { useEffect, useState } from 'react'
import { FiUser, FiTrash2 } from 'react-icons/fi'
import { AdminPageShell } from '@/frontend/components/admin/AdminPageShell'
import { ReviewList } from '@/frontend/components/admin/ReviewList'
import { ActionButton } from '@/frontend/components/admin/ActionButton'

interface ProfileCard {
  id: string
  key: string
  value: string
  source: string
  updated_at: string
}

interface ProfileCardGroup {
  key: string
  entries: ProfileCard[]
}

function groupByKey(items: ProfileCard[]): ProfileCardGroup[] {
  const groups = new Map<string, ProfileCard[]>()
  for (const item of items) {
    const entries = groups.get(item.key) ?? []
    entries.push(item)
    groups.set(item.key, entries)
  }
  return Array.from(groups.entries()).map(([key, entries]) => ({ key, entries }))
}

export function AdminProfileCardsClient() {
  const [items, setItems] = useState<ProfileCard[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [error, setError] = useState<Record<string, string>>({})

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/profile-cards')
      const data = await res.json()
      setItems(data.items ?? [])
    } catch {
      setError({ global: '加载失败' })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    setProcessingId(id)
    setError(prev => ({ ...prev, [id]: '' }))

    try {
      const res = await fetch(`/api/admin/profile-cards/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json()
        setError(prev => ({ ...prev, [id]: data.error || '删除失败' }))
        return
      }

      setItems(prev => prev.filter(item => item.id !== id))
    } catch {
      setError(prev => ({ ...prev, [id]: '网络错误' }))
    } finally {
      setProcessingId(null)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const groups = groupByKey(items)

  return (
    <AdminPageShell icon={FiUser} title="个人信息槛位" subtitle="Profile Cards">
      {error.global && <p className="mb-4 text-xs font-light tracking-wide text-red-400">{error.global}</p>}
      {loading ? (
        <p className="text-xs font-light tracking-wide text-zinc-500">加载中…</p>
      ) : (
        <ReviewList
          items={groups}
          emptyLabel="暂无个人信息"
          renderItem={group => (
            <div className="rounded-[20px] border border-white/10 bg-zinc-950/60 p-4">
              <p className="text-sm font-medium text-zinc-400">{group.key}</p>
              <div className="mt-2 space-y-3">
                {group.entries.map(entry => (
                  <div key={entry.id} className="flex items-start justify-between gap-4 border-t border-white/5 pt-3 first:border-t-0 first:pt-0">
                    <div className="min-w-0 flex-1">
                      <p className="text-base text-white">{entry.value}</p>
                      <p className="mt-2 text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-600">
                        {entry.source} · {new Date(entry.updated_at).toLocaleString('zh-CN')}
                      </p>
                      {error[entry.id] && (
                        <p className="mt-2 text-xs font-light tracking-wide text-red-400">{error[entry.id]}</p>
                      )}
                    </div>
                    <ActionButton
                      icon={FiTrash2}
                      label="删除"
                      variant="danger"
                      disabled={processingId === entry.id}
                      onClick={() => handleDelete(entry.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        />
      )}
    </AdminPageShell>
  )
}
