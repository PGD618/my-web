'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FiDatabase, FiTrash2, FiArrowRight } from 'react-icons/fi'
import { AdminPageShell } from '@/frontend/components/admin/AdminPageShell'
import { ReviewList } from '@/frontend/components/admin/ReviewList'
import { ActionButton } from '@/frontend/components/admin/ActionButton'
import { isExperience, type NarrativeEntry } from '@/lib/semanticDocumentUtils'

interface FactEntry extends NarrativeEntry {
  kind?: 'opinion' | 'experience'
}

interface FactItem {
  id: string
  text: string
  status: string
  created_at: string
  updated_at: string
}

interface CategoryData {
  category: string
  entries: FactEntry[]
  facts: FactItem[]
}

interface FactCategoriesResponse {
  categories: CategoryData[]
}

export function AdminFactsClient() {
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [error, setError] = useState<Record<string, string>>({})

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/fact-categories')
      if (!res.ok) {
        setError({ global: `加载失败（${res.status}）` })
        return
      }
      const data: FactCategoriesResponse = await res.json()
      setCategories(data.categories ?? [])
    } catch {
      setError({ global: '加载失败' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleDelete(factId: string) {
    if (!window.confirm('确认删除此事实吗？')) {
      return
    }

    setProcessingId(factId)
    setError(prev => {
      const next = { ...prev }
      delete next[factId]
      return next
    })

    try {
      const res = await fetch(`/api/admin/confirmed-facts/${factId}`, { method: 'DELETE' })
      if (res.status === 409) {
        const data = await res.json()
        const referencedBy = data.detail?.referenced_by ?? []
        setError(prev => ({
          ...prev,
          [factId]: `被 ${referencedBy.length} 条记录引用，无法删除：${referencedBy
            .map((f: { content: string }) => f.content)
            .join('；')}`,
        }))
        return
      }
      if (!res.ok) {
        setError(prev => ({ ...prev, [factId]: `删除失败（${res.status}）` }))
        return
      }
      // Reload after deletion
      await load()
    } catch {
      setError(prev => ({ ...prev, [factId]: '删除失败，请重试' }))
    } finally {
      setProcessingId(null)
    }
  }

  function renderEntries(entries: FactEntry[]): React.ReactNode {
    if (entries.length === 0) {
      return <p className="text-xs text-zinc-500">暂无条目</p>
    }

    return (
      <div className="space-y-2">
        {entries.map(entry => (
          <div key={entry.id} className="flex items-start gap-2">
            {isExperience(entry) && (
              <span className="mt-0.5 inline-block px-1.5 py-0.5 text-[10px] bg-emerald-700/40 text-emerald-400 rounded">
                经历
              </span>
            )}
            {!entry.is_current && (
              <span className="mt-0.5 inline-block px-1.5 py-0.5 text-[10px] bg-zinc-700/40 text-zinc-400 rounded">
                以前认为
              </span>
            )}
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

  function renderFacts(facts: FactItem[]): React.ReactNode {
    if (facts.length === 0) {
      return null
    }

    return (
      <div className="space-y-2">
        {facts.map(fact => (
          <div key={fact.id} className="flex items-start gap-2">
            <span className="mt-0.5 inline-block px-1.5 py-0.5 text-[10px] bg-blue-700/40 text-blue-400 rounded">
              事实
            </span>
            <div className="flex-1 min-w-0 flex items-start justify-between gap-4">
              <p className="text-sm text-zinc-300">{fact.text}</p>
              <ActionButton
                icon={FiTrash2}
                label="删除"
                variant="danger"
                disabled={processingId === fact.id}
                onClick={() => handleDelete(fact.id)}
              />
            </div>
            {error[fact.id] && (
              <p className="mt-3 text-xs font-light tracking-wide text-red-400">{error[fact.id]}</p>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <AdminPageShell icon={FiDatabase} title="事实管理" subtitle="Confirmed Facts">
      <div className="mb-6 flex items-center gap-2 text-sm text-blue-300 hover:text-blue-200 transition">
        <Link href="/admin/autobiography" className="flex items-center gap-1">
          查看自传中的事实分类
          <FiArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {error.global && <p className="mb-4 text-xs font-light tracking-wide text-red-400">{error.global}</p>}
      {loading ? (
        <p className="text-xs font-light tracking-wide text-zinc-500">加载中…</p>
      ) : categories.length === 0 ? (
        <p className="text-xs font-light tracking-wide text-zinc-500">暂无数据</p>
      ) : (
        <ReviewList
          items={categories}
          emptyLabel="暂无类别"
          renderItem={category => {
            const totalItems = category.entries.length + category.facts.length

            return (
              <div className="rounded-[20px] border border-white/10 bg-zinc-950/60 p-4 space-y-4">
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
              </div>
            )
          }}
        />
      )}
    </AdminPageShell>
  )
}
