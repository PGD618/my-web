'use client'

import { useEffect, useState } from 'react'
import { FiCheckCircle, FiTrash2 } from 'react-icons/fi'
import { AdminPageShell } from '@/frontend/components/admin/AdminPageShell'
import { ReviewList } from '@/frontend/components/admin/ReviewList'
import { ActionButton } from '@/frontend/components/admin/ActionButton'
import { detectSuspiciousLines } from '@/lib/detectSuspiciousLines'
import { groupByCategory, getDetailError, SemanticEntry } from '@/lib/migratedEntries'

interface MigratedEntry extends SemanticEntry {
  error?: string
}

type LoadState = 'loading' | 'loaded' | 'error'

export function AdminMigratedEntriesClient() {
  const [entries, setEntries] = useState<MigratedEntry[]>([])
  const [state, setState] = useState<LoadState>('loading')
  const [errorMsg, setErrorMsg] = useState<string>('')

  useEffect(() => {
    fetchEntries()
  }, [])

  async function fetchEntries() {
    setState('loading')
    try {
      const res = await fetch('/api/admin/semantic-entries?status=migrated_pending')
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`)
      }
      const data = await res.json()
      setEntries(data.items || [])
      setState('loaded')
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Unknown error')
      setState('error')
    }
  }

  async function handleConfirm(id: string) {
    try {
      const res = await fetch(`/api/admin/semantic-entries/${id}/confirm-migrated`, {
        method: 'POST',
      })
      if (!res.ok) {
        const data = await res.json()
        const detail = data.detail
        const errorText = getDetailError(detail) || data.detail || `Error: ${res.status}`
        setEntries(prev =>
          prev.map(e => (e.id === id ? { ...e, error: errorText } : e))
        )
        return
      }
      setEntries(prev => prev.filter(e => e.id !== id))
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error'
      setEntries(prev => prev.map(e => (e.id === id ? { ...e, error: msg } : e)))
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('确认删除此条目？')) {
      return
    }
    try {
      const res = await fetch(`/api/admin/semantic-entries/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const data = await res.json()
        const detail = data.detail
        const errorText = getDetailError(detail) || data.detail || `Error: ${res.status}`
        setEntries(prev =>
          prev.map(e => (e.id === id ? { ...e, error: errorText } : e))
        )
        return
      }
      setEntries(prev => prev.filter(e => e.id !== id))
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error'
      setEntries(prev => prev.map(e => (e.id === id ? { ...e, error: msg } : e)))
    }
  }

  const grouped = groupByCategory(entries) as Record<string, MigratedEntry[]>
  const categories = Object.keys(grouped).sort()

  return (
    <AdminPageShell
      icon={FiCheckCircle}
      title="迁移待确认条目"
      subtitle="Migrated Entries Pending Review"
    >
      <div className="space-y-8">
        <p className="rounded-[20px] border border-white/5 bg-zinc-900/40 p-4 text-xs font-light tracking-wide text-zinc-400">
          这些是迁移时被标为疑似非主人观点的行，确认保留后才会被召回
        </p>

        {state === 'loading' && (
          <p className="text-center text-sm text-zinc-500">加载中...</p>
        )}

        {state === 'error' && (
          <p className="rounded-[20px] border border-red-500/20 bg-red-950/20 p-4 text-xs font-light text-red-300">
            加载失败: {errorMsg}
          </p>
        )}

        {state === 'loaded' && entries.length === 0 && (
          <ReviewList
            items={[]}
            renderItem={() => null}
            emptyLabel="没有待确认的迁移条目"
          />
        )}

        {state === 'loaded' && entries.length > 0 && (
          <div className="space-y-6">
            {categories.map(category => (
              <div key={category}>
                <div className="mb-3 flex items-baseline gap-2">
                  <h2 className="text-sm font-semibold text-white">{category}</h2>
                  <span className="text-xs text-zinc-500">
                    ({grouped[category].length})
                  </span>
                </div>
                <ReviewList
                  items={grouped[category]}
                  renderItem={(item: MigratedEntry) => (
                    <div className="flex gap-3 rounded-[20px] border border-white/5 bg-zinc-900/40 p-4">
                      <div className="flex-1 space-y-2">
                        <div className="space-y-1">
                          {detectSuspiciousLines(item.text).map((line, idx) => (
                            <div
                              key={idx}
                              className={line.isSuspicious ? 'bg-yellow-500/20 px-2 py-1 rounded' : ''}
                            >
                              <p className={`text-xs leading-relaxed font-light ${
                                line.isSuspicious ? 'text-yellow-200' : 'text-zinc-300'
                              }`}>
                                {line.text}
                              </p>
                            </div>
                          ))}
                        </div>
                        {item.error && (
                          <p className="text-xs text-red-400 italic pt-2">
                            {item.error}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <ActionButton
                          icon={FiCheckCircle}
                          label="确认保留"
                          variant="primary"
                          disabled={!!item.error}
                          onClick={() => handleConfirm(item.id)}
                        />
                        <ActionButton
                          icon={FiTrash2}
                          label="删除"
                          variant="danger"
                          disabled={!!item.error}
                          onClick={() => handleDelete(item.id)}
                        />
                      </div>
                    </div>
                  )}
                  emptyLabel=""
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminPageShell>
  )
}
