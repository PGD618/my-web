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
  created_at: string
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

  async function handleDelete(key: string) {
    setProcessingId(key)
    setError(prev => ({ ...prev, [key]: '' }))

    try {
      const res = await fetch(`/api/admin/profile-cards/${encodeURIComponent(key)}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json()
        setError(prev => ({ ...prev, [key]: data.error || '删除失败' }))
        return
      }

      setItems(prev => prev.filter(item => item.key !== key))
    } catch {
      setError(prev => ({ ...prev, [key]: '网络错误' }))
    } finally {
      setProcessingId(null)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <AdminPageShell icon={FiUser} title="个人信息槽位" subtitle="Profile Cards">
      {error.global && <p className="mb-4 text-xs font-light tracking-wide text-red-400">{error.global}</p>}
      {loading ? (
        <p className="text-xs font-light tracking-wide text-zinc-500">加载中…</p>
      ) : (
        <ReviewList
          items={items}
          emptyLabel="暂无个人信息"
          renderItem={item => (
            <div className="rounded-[20px] border border-white/10 bg-zinc-950/60 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-zinc-400">{item.key}</p>
                  <p className="mt-1 text-base text-white">{item.value}</p>
                  <p className="mt-2 text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-600">
                    {item.source} · {new Date(item.created_at).toLocaleString('zh-CN')}
                  </p>
                </div>
                <ActionButton
                  icon={FiTrash2}
                  label="删除"
                  variant="danger"
                  disabled={processingId === item.key}
                  onClick={() => handleDelete(item.key)}
                />
              </div>
              {error[item.key] && (
                <p className="mt-3 text-xs font-light tracking-wide text-red-400">{error[item.key]}</p>
              )}
            </div>
          )}
        />
      )}
    </AdminPageShell>
  )
}
