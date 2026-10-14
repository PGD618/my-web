'use client'

import { useEffect, useState } from 'react'
import { FiAlertTriangle, FiCheck } from 'react-icons/fi'
import { AdminPageShell } from '@/frontend/components/admin/AdminPageShell'
import { ReviewList } from '@/frontend/components/admin/ReviewList'
import { ActionButton } from '@/frontend/components/admin/ActionButton'

interface ConfirmedFact {
  id: string
  content: string
  category: string
  disputes_with_id: string | null
}

interface DisputePair {
  a: ConfirmedFact
  b: ConfirmedFact
}

function pairUpDisputes(items: ConfirmedFact[]): DisputePair[] {
  const byId = new Map(items.map(item => [item.id, item]))
  const seen = new Set<string>()
  const pairs: DisputePair[] = []

  for (const item of items) {
    if (seen.has(item.id) || !item.disputes_with_id) continue
    const other = byId.get(item.disputes_with_id)
    if (!other) continue
    pairs.push({ a: item, b: other })
    seen.add(item.id)
    seen.add(other.id)
  }

  return pairs
}

export function AdminDisputedFactsClient() {
  const [pairs, setPairs] = useState<DisputePair[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/disputed-facts')
      const data = await res.json()
      setPairs(pairUpDisputes(data.items ?? []))
    } catch {
      setError('加载失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function resolve(pairId: string, body: { keep_id: string; discard_id: string | null }) {
    setProcessingId(pairId)
    setError('')
    try {
      const res = await fetch('/api/admin/disputed-facts/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        setError(`操作失败（${res.status}）`)
        return
      }
      setPairs(prev => prev.filter(p => `${p.a.id}:${p.b.id}` !== pairId))
    } catch {
      setError('操作失败，请重试')
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <AdminPageShell icon={FiAlertTriangle} title="待裁决冲突" subtitle="Disputed Facts">
      {error && <p className="mb-4 text-xs font-light tracking-wide text-red-400">{error}</p>}
      {loading ? (
        <p className="text-xs font-light tracking-wide text-zinc-500">加载中…</p>
      ) : (
        <ReviewList
          items={pairs}
          emptyLabel="暂无待裁决的冲突"
          renderItem={pair => {
            const pairId = `${pair.a.id}:${pair.b.id}`
            const disabled = processingId === pairId
            return (
              <div className="rounded-[20px] border border-white/10 bg-zinc-950/60 p-4">
                <div className="mb-4 grid gap-3 sm:grid-cols-2">
                  {[pair.a, pair.b].map(fact => (
                    <div key={fact.id} className="rounded-[16px] border border-white/5 bg-white/5 p-3">
                      <p className="text-sm text-white">{fact.content}</p>
                      <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-600">
                        {fact.category}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    disabled={disabled}
                    onClick={() => resolve(pairId, { keep_id: pair.a.id, discard_id: pair.b.id })}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-light tracking-wide text-zinc-300 transition hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-blue-300 disabled:opacity-50"
                  >
                    保留左侧，废弃右侧
                  </button>
                  <button
                    disabled={disabled}
                    onClick={() => resolve(pairId, { keep_id: pair.b.id, discard_id: pair.a.id })}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-light tracking-wide text-zinc-300 transition hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-blue-300 disabled:opacity-50"
                  >
                    保留右侧，废弃左侧
                  </button>
                  <ActionButton
                    icon={FiCheck}
                    label="两条都保留"
                    variant="primary"
                    disabled={disabled}
                    onClick={() => resolve(pairId, { keep_id: pair.a.id, discard_id: null })}
                  />
                </div>
              </div>
            )
          }}
        />
      )}
    </AdminPageShell>
  )
}
