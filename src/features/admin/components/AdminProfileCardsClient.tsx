'use client'

import { useState } from 'react'
import { FiUser, FiTrash2 } from 'react-icons/fi'
import { AdminPageShell } from '@/features/admin/components/AdminPageShell'
import { ReviewList } from '@/features/admin/components/ReviewList'
import { ActionButton } from '@/features/admin/components/ActionButton'
import { AdminCard } from '@/features/admin/components/AdminCard'
import { ConfirmDialog } from '@/features/admin/components/ConfirmDialog'
import { ErrorBanner } from '@/features/admin/components/ErrorBanner'
import { LoadingText } from '@/features/admin/components/LoadingText'
import { useAdminMutation, useAdminResource } from '@/features/admin/hooks/useAdminResource'
import type { ProfileCard, ProfileCardGroup } from '@/features/admin/adminTypes'

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
  const { data, setData, loading, error } = useAdminResource<ProfileCard[]>(
    '/api/admin/profile-cards',
    json => json.items ?? []
  )
  const { processingId, errors, run } = useAdminMutation()
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    await run(id, () => fetch(`/api/admin/profile-cards/${encodeURIComponent(id)}`, { method: 'DELETE' }), {
      onError: async res => {
        const body = await res.json().catch(() => ({}))
        return body.error || '删除失败'
      },
      networkError: '网络错误',
      onSuccess: () => setData(prev => (prev ?? []).filter(item => item.id !== id)),
    })
    setConfirmDeleteId(null)
  }

  const groups = groupByKey(data ?? [])

  return (
    <AdminPageShell icon={FiUser} title="个人信息槽位" subtitle="Profile Cards">
      <ConfirmDialog
        isOpen={confirmDeleteId !== null}
        title="删除个人信息"
        message="确认删除这条个人信息吗？"
        cancelLabel="取消"
        confirmLabel="删除"
        isDangerous={true}
        isLoading={processingId === confirmDeleteId}
        onConfirm={() => {
          if (confirmDeleteId) {
            handleDelete(confirmDeleteId)
          }
        }}
        onCancel={() => setConfirmDeleteId(null)}
      />
      <ErrorBanner message={error} />
      {loading ? (
        <LoadingText />
      ) : (
        <ReviewList
          items={groups}
          getKey={group => group.key}
          emptyLabel="暂无个人信息"
          renderItem={group => (
            <AdminCard className="p-4">
              <p className="text-sm font-medium text-zinc-400">{group.key}</p>
              <div className="mt-2 space-y-3">
                {group.entries.map(entry => (
                  <div key={entry.id} className="flex items-start justify-between gap-4 border-t border-white/5 pt-3 first:border-t-0 first:pt-0">
                    <div className="min-w-0 flex-1">
                      <p className="text-base text-white">{entry.value}</p>
                      <p className="mt-2 text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-600">
                        {entry.source} · {new Date(entry.updated_at).toLocaleString('zh-CN')}
                      </p>
                      <ErrorBanner message={errors[entry.id]} className="mt-2" />
                    </div>
                    <ActionButton
                      icon={FiTrash2}
                      label="删除"
                      variant="danger"
                      disabled={processingId === entry.id}
                      onClick={() => setConfirmDeleteId(entry.id)}
                    />
                  </div>
                ))}
              </div>
            </AdminCard>
          )}
        />
      )}
    </AdminPageShell>
  )
}
