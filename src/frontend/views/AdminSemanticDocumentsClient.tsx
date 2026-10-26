'use client'

import { useEffect, useState } from 'react'
import { FiFileText, FiEdit2, FiSave, FiX, FiCheck, FiAlertTriangle, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { AdminPageShell } from '@/frontend/components/admin/AdminPageShell'
import { ReviewList } from '@/frontend/components/admin/ReviewList'
import { ActionButton } from '@/frontend/components/admin/ActionButton'
import { detectSuspiciousLines } from '@/lib/detectSuspiciousLines'
import { getEntriesList, cleanNarrativeText, type NarrativeData, type NarrativeEntry } from '@/lib/semanticDocumentUtils'

interface SemanticDocument {
  id: string
  title?: string
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
  const [narrativeDataMap, setNarrativeDataMap] = useState<Record<string, NarrativeData | null>>({})
  const [expandedNarrative, setExpandedNarrative] = useState<Set<string>>(new Set())

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/semantic-documents')
      const data = await res.json()
      const documents = data.items ?? []
      setItems(documents)

      // 加载每篇文档的叙事数据
      const narrativeMap: Record<string, NarrativeData | null> = {}
      await Promise.all(
        documents.map(async (doc: SemanticDocument) => {
          try {
            const narrativeRes = await fetch(`/api/admin/semantic-documents/${doc.id}/narrative`)
            if (narrativeRes.ok) {
              narrativeMap[doc.id] = await narrativeRes.json()
            } else {
              narrativeMap[doc.id] = null
            }
          } catch {
            narrativeMap[doc.id] = null
          }
        })
      )
      setNarrativeDataMap(narrativeMap)
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
    if (action === 'approve') {
      const item = items.find(i => i.id === id)
      if (item?.pending_content) {
        const suspiciousLines = detectSuspiciousLines(item.pending_content).filter(
          line => line.isSuspicious
        )
        let confirmMsg = '确认批准此整理提案吗？'
        if (suspiciousLines.length > 0) {
          const preview = suspiciousLines.slice(0, 3).map(line => `"${line.text}"`).join('\n')
          confirmMsg = `警告：提案中发现 ${suspiciousLines.length} 行疑似非主人观点：\n${preview}${suspiciousLines.length > 3 ? '\n...' : ''}\n\n确认仍要覆盖原内容吗？`
        }
        if (!window.confirm(confirmMsg)) {
          return
        }
      }
    }

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

  function hasPendingContent(): boolean {
    return items.some(item => item.pending_content !== null)
  }

  function renderEntries(entries: NarrativeEntry[]): React.ReactNode {
    if (entries.length === 0) {
      return <p className="text-xs text-zinc-500">暂无条目</p>
    }

    return (
      <div className="space-y-2">
        {entries.map(entry => (
          <div key={entry.id} className="flex items-start gap-2">
            {!entry.is_current && (
              <span className="mt-0.5 inline-block px-1.5 py-0.5 text-[10px] bg-zinc-700/40 text-zinc-400 rounded">
                以前认为
              </span>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-zinc-300">{entry.text}</p>
              {entry.reinforcement_count > 1 && (
                <p className="text-[11px] text-zinc-600 mt-0.5">×{entry.reinforcement_count}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <AdminPageShell icon={FiFileText} title="语义记忆文档" subtitle="Semantic Documents">
      {hasPendingContent() && (
        <div className="mb-4 rounded-lg border border-amber-400/20 bg-amber-500/5 p-3">
          <p className="text-xs text-amber-300">自动整理已暂停，以下为历史遗留提案，建议驳回后由新流程重新整理</p>
        </div>
      )}

      {error.global && <p className="mb-4 text-xs font-light tracking-wide text-red-400">{error.global}</p>}
      {loading ? (
        <p className="text-xs font-light tracking-wide text-zinc-500">加载中…</p>
      ) : (
        <ReviewList
          items={items}
          emptyLabel="暂无记忆文档"
          renderItem={item => {
            const contentSuspicious = detectSuspiciousLines(item.content).filter(l => l.isSuspicious)
            const pendingSuspicious = item.pending_content
              ? detectSuspiciousLines(item.pending_content).filter(l => l.isSuspicious)
              : []

            const narrativeData = narrativeDataMap[item.id]
            const entries = narrativeData ? getEntriesList(narrativeData) : []
            const expandedNarrativeItem = expandedNarrative.has(item.id)

            const docTitle = item.title || item.category

            return (
              <div className="rounded-[20px] border border-white/10 bg-zinc-950/60 p-4 space-y-4">
                {/* 文档标题 - 醒目 */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-zinc-100 mb-1">{docTitle}</h3>
                    <p className="text-[11px] text-zinc-500">条目数：{entries.length}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
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

                {contentSuspicious.length > 0 && (
                  <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-400/20 bg-red-500/5 px-3 py-2">
                    <FiAlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
                    <p className="text-xs text-red-300">
                      条目中有 {contentSuspicious.length} 行疑似非主人观点
                    </p>
                  </div>
                )}

                {/* 条目列表 */}
                <div>
                  <p className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-600 mb-3">条目</p>
                  {editingId === item.id ? (
                    <textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      className="w-full min-h-[200px] bg-zinc-900 text-zinc-300 text-xs font-mono p-3 rounded-lg border border-white/10 focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    renderEntries(entries)
                  )}
                </div>

                {/* 叙事折叠区 */}
                {narrativeData && (
                  <div className="border-t border-white/10 pt-4">
                    <button
                      onClick={() => {
                        setExpandedNarrative(prev => {
                          const next = new Set(prev)
                          if (next.has(item.id)) {
                            next.delete(item.id)
                          } else {
                            next.add(item.id)
                          }
                          return next
                        })
                      }}
                      className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-zinc-600 hover:text-zinc-500 transition"
                    >
                      {expandedNarrativeItem ? (
                        <FiChevronUp className="h-3 w-3" />
                      ) : (
                        <FiChevronDown className="h-3 w-3" />
                      )}
                      叙事
                    </button>

                    {expandedNarrativeItem && (
                      <div className="mt-3 space-y-3 text-xs text-zinc-300">
                        {narrativeData.sections && narrativeData.sections.length > 0 ? (
                          narrativeData.sections.map(section => (
                            <div key={section.id}>
                              {section.heading && (
                                <p className="font-medium text-zinc-200 mb-1">{section.heading}</p>
                              )}
                              <p className="whitespace-pre-wrap text-zinc-400">{cleanNarrativeText(section.text)}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-zinc-500">暂无叙事</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 历史遗留提案（兼容旧数据） */}
                {item.pending_content !== null && (
                  <div className="border-t border-white/10 pt-4 space-y-3">
                    <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-amber-400">
                      待审核整理提案
                    </p>
                    {pendingSuspicious.length > 0 && (
                      <div className="flex items-center gap-2 rounded-lg border border-red-400/20 bg-red-500/5 px-3 py-2">
                        <FiAlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
                        <p className="text-xs text-red-300">
                          提案中有 {pendingSuspicious.length} 行疑似非主人观点
                        </p>
                      </div>
                    )}
                    <div className="rounded-lg border border-amber-400/20 bg-amber-500/5 p-3">
                      {detectSuspiciousLines(item.pending_content).map((line, idx) => (
                        <div
                          key={idx}
                          className={
                            line.isSuspicious
                              ? 'border-l-2 border-red-500 bg-red-500/10 px-2 py-1 text-xs font-mono text-zinc-300'
                              : 'text-xs font-mono text-zinc-300 py-1'
                          }
                        >
                          {line.text}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <ActionButton
                        icon={FiCheck}
                        label="批准，覆盖条目"
                        variant="primary"
                        disabled={processingId === item.id}
                        onClick={() => resolveConsolidation(item.id, 'approve')}
                      />
                      <ActionButton
                        icon={FiX}
                        label="驳回"
                        variant="danger"
                        disabled={processingId === item.id}
                        onClick={() => resolveConsolidation(item.id, 'reject')}
                      />
                    </div>
                  </div>
                )}

                {error[item.id] && (
                  <p className="mt-3 text-xs font-light tracking-wide text-red-400">{error[item.id]}</p>
                )}
              </div>
            )
          }}
        />
      )}
    </AdminPageShell>
  )
}
