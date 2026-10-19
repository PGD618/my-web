'use client'

import { useEffect, useState } from 'react'
import { FiFileText, FiEdit2, FiSave, FiX } from 'react-icons/fi'
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
