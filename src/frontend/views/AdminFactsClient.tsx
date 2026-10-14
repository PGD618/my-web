'use client'

import { useEffect, useState } from 'react'
import { FiDatabase, FiTrash2 } from 'react-icons/fi'
import { AdminPageShell } from '@/frontend/components/admin/AdminPageShell'
import { ReviewList } from '@/frontend/components/admin/ReviewList'
import { ActionButton } from '@/frontend/components/admin/ActionButton'

interface ConfirmedFact {
  id: string
  content: string
  category: string
  source: string
}

export function AdminFactsClient() {
  const [items, setItems] = useState<ConfirmedFact[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [error, setError] = useState<Record<string, string>>({})

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/confirmed-facts')
      const data = await res.json()
      setItems(data.items ?? [])
    } catch {
      setError(prev => ({ ...prev, global: '加载失败' }))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleDelete(id: string) {
    setProcessingId(id)
    setError(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    try {
      const res = await fetch(`/api/admin/confirmed-facts/${id}`, { method: 'DELETE' })
      if (res.status === 409) {
        const data = await res.json()
        const referencedBy = data.detail?.referenced_by ?? []
        setError(prev => ({
          ...prev,
          [id]: `被 ${referencedBy.length} 条记录引用，无法删除：${referencedBy
            .map((f: { content: string }) => f.content)
            .join('；')}`,
        }))
        return
      }
      if (!res.ok) {
        setError(prev => ({ ...prev, [id]: `删除失败（${res.status}）` }))
        return
      }
      setItems(prev => prev.filter(item => item.id !== id))
    } catch {
      setError(prev => ({ ...prev, [id]: '删除失败，请重试' }))
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <AdminPageShell icon={FiDatabase} title="事实管理" subtitle="Confirmed Facts">
      {error.global && <p className="mb-4 text-xs font-light tracking-wide text-red-400">{error.global}</p>}
      {loading ? (
        <p className="text-xs font-light tracking-wide text-zinc-500">加载中…</p>
      ) : (
        <ReviewList
          items={items}
          emptyLabel="暂无已确认事实"
          renderItem={item => (
            <div className="rounded-[20px] border border-white/10 bg-zinc-950/60 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white">{item.content}</p>
                  <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-600">
                    {item.category} · {item.source}
                  </p>
                </div>
                <ActionButton
                  icon={FiTrash2}
                  label="彻底删除"
                  variant="danger"
                  disabled={processingId === item.id}
                  onClick={() => handleDelete(item.id)}
                />
              </div>
              {error[item.id] && (
                <p className="mt-3 text-xs font-light tracking-wide text-red-400">{error[item.id]}</p>
              )}
            </div>
          )}
        />
      )}
    </AdminPageShell>
  )
}
