'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiDatabase, FiTrash2, FiArrowRight } from 'react-icons/fi'
import { AdminPageShell } from '@/features/admin/components/AdminPageShell'
import { ReviewList } from '@/features/admin/components/ReviewList'
import { ActionButton } from '@/features/admin/components/ActionButton'
import { AdminCard } from '@/features/admin/components/AdminCard'
import { ConfirmDialog } from '@/features/admin/components/ConfirmDialog'
import { ErrorBanner } from '@/features/admin/components/ErrorBanner'
import { LoadingText } from '@/features/admin/components/LoadingText'
import { Tag } from '@/features/admin/components/Tag'
import { useAdminMutation, useAdminResource } from '@/features/admin/hooks/useAdminResource'
import { isExperience, type NarrativeEntry } from '@/features/admin/autobiography'
import type { CategoryFact, FactCategory, FactCategoriesResponse, ReferencedFact } from '@/features/admin/types'

export function AdminFactsClient() {
  const { data, loading, error, reload } = useAdminResource<FactCategory[]>(
    '/api/admin/fact-categories',
    (json: FactCategoriesResponse) => json.categories ?? []
  )
  const { processingId, errors, run } = useAdminMutation()
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const categories = data ?? []

  async function handleDelete(factId: string) {
    await run(factId, () => fetch(`/api/admin/confirmed-facts/${factId}`, { method: 'DELETE' }), {
      onError: async res => {
        if (res.status === 409) {
          const data = await res.json()
          const referencedBy: ReferencedFact[] = data.detail?.referenced_by ?? []
          return `被 ${referencedBy.length} 条记录引用，无法删除：${referencedBy.map(f => f.content).join('；')}`
        }
        return `删除失败（${res.status}）`
      },
      networkError: '删除失败，请重试',
      onSuccess: () => reload(),
    })
    setConfirmDeleteId(null)
  }

  function renderEntries(entries: NarrativeEntry[]): React.ReactNode {
    if (entries.length === 0) {
      return <p className="text-xs text-zinc-500">暂无条目</p>
    }

    return (
      <div className="space-y-2">
        {entries.map(entry => (
          <div key={entry.id} className="flex items-start gap-2">
            {isExperience(entry) && <Tag tone="experience">经历</Tag>}
            {!entry.is_current && <Tag tone="muted">以前认为</Tag>}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-zinc-300">{entry.text}</p>
              {entry.occurred_at && (
                <p className="text-[10px] text-zinc-600 mt-0.5">{entry.occurred_at}</p>
              )}
              {entry.reinforcement_count > 1 && (
                <p className="text-[11px] text-zinc-600 mt-0.5">×{entry.reinforcement_count}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  function renderFacts(facts: CategoryFact[]): React.ReactNode {
    if (facts.length === 0) {
      return null
    }

    return (
      <div className="space-y-2">
        {facts.map(fact => (
          <div key={fact.id} className="flex items-start gap-2">
            <Tag tone="fact">事实</Tag>
            <div className="flex-1 min-w-0 flex items-start justify-between gap-4">
              <p className="text-sm text-zinc-300">{fact.text}</p>
              <ActionButton
                icon={FiTrash2}
                label="删除"
                variant="danger"
                disabled={processingId === fact.id}
                onClick={() => setConfirmDeleteId(fact.id)}
              />
            </div>
            <ErrorBanner message={errors[fact.id]} className="mt-3" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <AdminPageShell icon={FiDatabase} title="事实管理" subtitle="Confirmed Facts">
      <ConfirmDialog
        isOpen={confirmDeleteId !== null}
        title="删除事实"
        message="确认删除此事实吗？"
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
      <div className="mb-6 flex items-center gap-2 text-sm text-blue-300 hover:text-blue-200 transition">
        <Link href="/admin/autobiography" className="flex items-center gap-1">
          查看我的自传
          <FiArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <ErrorBanner message={error} />
      {loading ? (
        <LoadingText />
      ) : categories.length === 0 ? (
        <LoadingText>暂无数据</LoadingText>
      ) : (
        <ReviewList
          items={categories}
          getKey={category => category.category}
          emptyLabel="暂无类别"
          renderItem={category => {
            const totalItems = category.entries.length + category.facts.length

            return (
              <AdminCard className="p-4 space-y-4">
                {/* 类别标题 - 醒目 */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-zinc-100 mb-1">{category.category}</h3>
                    <p className="text-[11px] text-zinc-500">条目数：{totalItems}</p>
                  </div>
                </div>

                {/* 条目列表 */}
                {category.entries.length > 0 && (
                  <div>
                    <p className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-600 mb-3">观点/经历</p>
                    {renderEntries(category.entries)}
                  </div>
                )}

                {/* 事实列表 */}
                {category.facts.length > 0 && (
                  <div>
                    <p className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-600 mb-3">事实</p>
                    {renderFacts(category.facts)}
                  </div>
                )}

                {totalItems === 0 && (
                  <p className="text-xs text-zinc-500">此类别暂无内容</p>
                )}
              </AdminCard>
            )
          }}
        />
      )}
    </AdminPageShell>
  )
}
