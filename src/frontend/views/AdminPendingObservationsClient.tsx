'use client'

import { useEffect, useState } from 'react'
import { FiInbox, FiCheck, FiX } from 'react-icons/fi'
import { AdminPageShell } from '@/frontend/components/admin/AdminPageShell'
import { ReviewList } from '@/frontend/components/admin/ReviewList'
import { ActionButton } from '@/frontend/components/admin/ActionButton'

interface PendingObservation {
  id: string
  content: string
  source_excerpt: string
  category: string
  created_at: string
}

export function AdminPendingObservationsClient() {
  const [items, setItems] = useState<PendingObservation[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/pending-observations')
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

  async function handleAction(id: string, action: 'confirm' | 'reject') {
    setProcessingId(id)
    setError('')
    try {
      const res = await fetch(`/api/admin/pending-observations/${id}/${action}`, { method: 'POST' })
      if (!res.ok) {
        setError(`操作失败（${res.status}）`)
        return
      }
      setItems(prev => prev.filter(item => item.id !== id))
    } catch {
      setError('操作失败，请重试')
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <AdminPageShell icon={FiInbox} title="待审核观察" subtitle="Pending Observations">
      {error && <p className="mb-4 text-xs font-light tracking-wide text-red-400">{error}</p>}
      {loading ? (
        <p className="text-xs font-light tracking-wide text-zinc-500">加载中…</p>
      ) : (
        <ReviewList
          items={items}
          emptyLabel="暂无待审核内容"
          renderItem={item => (
            <div className="flex items-start justify-between gap-4 rounded-[20px] border border-white/10 bg-zinc-950/60 p-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-white">{item.content}</p>
                <p className="mt-1 text-xs font-light text-zinc-500">原话：{item.source_excerpt}</p>
                <p className="mt-2 text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-600">
                  {item.category}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <ActionButton
                  icon={FiCheck}
                  label="确认"
                  variant="primary"
                  disabled={processingId === item.id}
                  onClick={() => handleAction(item.id, 'confirm')}
                />
                <ActionButton
                  icon={FiX}
                  label="拒绝"
                  variant="danger"
                  disabled={processingId === item.id}
                  onClick={() => handleAction(item.id, 'reject')}
                />
              </div>
            </div>
          )}
        />
      )}
    </AdminPageShell>
  )
}
