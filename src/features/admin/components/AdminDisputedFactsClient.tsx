'use client'

import { FiAlertTriangle, FiCheck } from 'react-icons/fi'
import { AdminPageShell } from '@/features/admin/components/AdminPageShell'
import { ReviewList } from '@/features/admin/components/ReviewList'
import { ActionButton } from '@/features/admin/components/ActionButton'
import { AdminCard } from '@/features/admin/components/AdminCard'
import { ErrorBanner } from '@/features/admin/components/ErrorBanner'
import { LoadingText } from '@/features/admin/components/LoadingText'
import { useAdminMutation, useAdminResource } from '@/features/admin/hooks/useAdminResource'
import type { ConfirmedFact, DisputePair } from '@/features/admin/types'

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

const pairKey = (pair: DisputePair) => `${pair.a.id}:${pair.b.id}`

export function AdminDisputedFactsClient() {
  const { data, setData, loading, error } = useAdminResource<DisputePair[]>(
    '/api/admin/disputed-facts',
    json => pairUpDisputes(json.items ?? [])
  )
  const { processingId, errors, run } = useAdminMutation()
  const pairs = data ?? []

  function resolve(pairId: string, body: { keep_id: string; discard_id: string | null }) {
    run(
      pairId,
      () =>
        fetch('/api/admin/disputed-facts/resolve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }),
      {
        errorKey: 'action',
        onSuccess: () => setData(prev => (prev ?? []).filter(p => pairKey(p) !== pairId)),
      }
    )
  }

  return (
    <AdminPageShell icon={FiAlertTriangle} title="待裁决冲突" subtitle="Disputed Facts">
      <ErrorBanner message={errors.action ?? error} />
      {loading ? (
        <LoadingText />
      ) : (
        <ReviewList
          items={pairs}
          getKey={pairKey}
          emptyLabel="暂无待裁决的冲突"
          renderItem={pair => {
            const pairId = pairKey(pair)
            const disabled = processingId === pairId
            return (
              <AdminCard className="p-4">
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
              </AdminCard>
            )
          }}
        />
      )}
    </AdminPageShell>
  )
}
