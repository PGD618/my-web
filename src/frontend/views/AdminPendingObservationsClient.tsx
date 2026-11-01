'use client'

import { FiInbox, FiCheck, FiX } from 'react-icons/fi'
import { AdminPageShell } from '@/frontend/components/admin/AdminPageShell'
import { ReviewList } from '@/frontend/components/admin/ReviewList'
import { ActionButton } from '@/frontend/components/admin/ActionButton'
import { AdminCard } from '@/frontend/components/admin/AdminCard'
import { ErrorBanner } from '@/frontend/components/admin/ErrorBanner'
import { LoadingText } from '@/frontend/components/admin/LoadingText'
import { useAdminMutation, useAdminResource } from '@/frontend/hooks/useAdminResource'
import type { PendingObservation } from '@/lib/adminTypes'

export function AdminPendingObservationsClient() {
  const { data, setData, loading, error } = useAdminResource<PendingObservation[]>(
    '/api/admin/pending-observations',
    json => json.items ?? []
  )
  const { processingId, errors, run } = useAdminMutation()
  const items = data ?? []

  function handleAction(id: string, action: 'confirm' | 'reject') {
    run(id, () => fetch(`/api/admin/pending-observations/${id}/${action}`, { method: 'POST' }), {
      errorKey: 'action',
      onSuccess: () => setData(prev => (prev ?? []).filter(item => item.id !== id)),
    })
  }

  return (
    <AdminPageShell icon={FiInbox} title="待审核观察" subtitle="Pending Observations">
      <ErrorBanner message={errors.action ?? error} />
      {loading ? (
        <LoadingText />
      ) : (
        <ReviewList
          items={items}
          getKey={item => item.id}
          emptyLabel="暂无待审核内容"
          renderItem={item => (
            <AdminCard className="flex items-start justify-between gap-4 p-4">
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
            </AdminCard>
          )}
        />
      )}
    </AdminPageShell>
  )
}
