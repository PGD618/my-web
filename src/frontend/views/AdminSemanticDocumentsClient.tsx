'use client'

import { useEffect, useState } from 'react'
import { FiFileText, FiEdit2, FiSave, FiX, FiCheck } from 'react-icons/fi'
import { AdminPageShell } from '@/frontend/components/admin/AdminPageShell'
import { ReviewList } from '@/frontend/components/admin/ReviewList'
import { ActionButton } from '@/frontend/components/admin/ActionButton'

interface SemanticDocument {
  id: string
  category: string
  content: string
  append_count: number
  created_at: string
  updated_at: string
  pending_content: string | null
}

export function AdminSemanticDocumentsClient() {
  const [items, setItems] = useState<SemanticDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState<string>('')
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [error, setError] = useState<Record<string, string>>({})

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/semantic-documents')
      const data = await res.json()
      setItems(data.items ?? [])
    } catch {
      setError({ global: '加载失败' })
    } finally {
      setLoading(false)
    }
  }

  function startEdit(item: SemanticDocument) {
    setEditingId(item.id)
    setEditContent(item.content)
    setError(prev => ({ ...prev, [item.id]: '' }))
  }

  function cancelEdit() {
    setEditingId(null)
    setEditContent('')
  }

  async function saveEdit(id: string) {
    setProcessingId(id)
    setError(prev => ({ ...prev, [id]: '' }))

    try {
      const res = await fetch(`/api/admin/semantic-documents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(prev => ({ ...prev, [id]: data.error || '保存失败' }))
        return
      }

      setItems(prev =>
        prev.map(item => (item.id === id ? { ...item, content: editContent } : item))
      )
      setEditingId(null)
      setEditContent('')
    } catch {
      setError(prev => ({ ...prev, [id]: '网络错误' }))
    } finally {
      setProcessingId(null)
    }
  }

  async function resolveConsolidation(id: string, action: 'approve' | 'reject') {
    setProcessingId(id)
    setError(prev => ({ ...prev, [id]: '' }))

    try {
      const res = await fetch(`/api/admin/semantic-documents/${id}/${action}-consolidation`, {
        method: 'POST',
      })

      if (!res.ok) {
        const data = await res.json()
        setError(prev => ({ ...prev, [id]: data.error || '操作失败' }))
        return
      }

      setItems(prev =>
        prev.map(item =>
          item.id === id
            ? {
                ...item,
                pending_content: null,
                content: action === 'approve' ? item.pending_content ?? item.content : item.content,
                append_count: action === 'approve' ? 0 : item.append_count,
              }
            : item
        )
      )
    } catch {
      setError(prev => ({ ...prev, [id]: '网络错误' }))
    } finally {
      setProcessingId(null)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <AdminPageShell icon={FiFileText} title="语义记忆文档" subtitle="Semantic Documents">
      {error.global && <p className="mb-4 text-xs font-light tracking-wide text-red-400">{error.global}</p>}
      {loading ? (
        <p className="text-xs font-light tracking-wide text-zinc-500">加载中…</p>
      ) : (
        <ReviewList
          items={items}
          emptyLabel="暂无记忆文档"
          renderItem={item => (
            <div className="rounded-[20px] border border-white/10 bg-zinc-950/60 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-medium text-zinc-400">{item.category}</p>
                  <div className="flex gap-2">
                    {editingId === item.id ? (
                      <>
                        <ActionButton
                          icon={FiSave}
                          label="保存"
                          variant="primary"
                          disabled={processingId === item.id}
                          onClick={() => saveEdit(item.id)}
                        />
                        <ActionButton
                          icon={FiX}
                          label="取消"
                          variant="danger"
                          disabled={processingId === item.id}
                          onClick={cancelEdit}
                        />
                      </>
                    ) : (
                      <ActionButton
                        icon={FiEdit2}
                        label="编辑"
                        variant="primary"
                        onClick={() => startEdit(item)}
                      />
                    )}
                  </div>
                </div>
                <div className="mt-2">
                  {editingId === item.id ? (
                    <textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      className="w-full min-h-[200px] bg-zinc-900 text-zinc-300 text-xs font-mono p-3 rounded-lg border border-white/10 focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <div className="prose prose-invert prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-xs text-zinc-300">{item.content}</pre>
                    </div>
                  )}
                </div>
                <p className="mt-3 text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-600">
                  追加 {item.append_count} 次 · {new Date(item.updated_at).toLocaleString('zh-CN')}
                </p>
                {item.pending_content !== null && (
                  <div className="mt-4 rounded-[16px] border border-amber-400/20 bg-amber-500/5 p-3">
                    <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-amber-400">
                      待审核整理提案
                    </p>
                    <div className="mt-2">
                      <pre className="whitespace-pre-wrap text-xs text-zinc-300">{item.pending_content}</pre>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <ActionButton
                        icon={FiCheck}
                        label="批准，覆盖原内容"
                        variant="primary"
                        disabled={processingId === item.id}
                        onClick={() => resolveConsolidation(item.id, 'approve')}
                      />
                      <ActionButton
                        icon={FiX}
                        label="驳回，保留原内容"
                        variant="danger"
                        disabled={processingId === item.id}
                        onClick={() => resolveConsolidation(item.id, 'reject')}
                      />
                    </div>
                  </div>
                )}
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
