'use client'

import { useEffect, useState } from 'react'
import { FiChevronDown, FiChevronUp, FiRefreshCw, FiEdit2, FiSave, FiX, FiRotateCcw } from 'react-icons/fi'
import { ActionButton } from '@/frontend/components/admin/ActionButton'
import { mapResultToChineseLabel } from '@/lib/narrativeUtils'

interface ReferencedEntry {
  id: string
  text: string
}

interface Section {
  id: string
  heading: string
  text: string
  raw_text: string
  entry_ids: string[]
  locked: boolean
  version: number
  updated_at: string
  referenced_entries: ReferencedEntry[]
}

interface Revision {
  id: string
  before_text: string
  after_text: string
  before_entry_ids: string[] | null
  created_at: string
}

interface NarrativeResponse {
  sections: Section[]
  unnarrated_entries: Array<{ id: string; text: string }>
}

interface SemanticNarrativePanelProps {
  docId: string
}

export function SemanticNarrativePanel({ docId }: SemanticNarrativePanelProps) {
  const [narrative, setNarrative] = useState<NarrativeResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [expandedRevisions, setExpandedRevisions] = useState<Set<string>>(new Set())
  const [revisions, setRevisions] = useState<Record<string, Revision[]>>({})
  const [loadingRevisions, setLoadingRevisions] = useState<Set<string>>(new Set())
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [rebuilding, setRebuilding] = useState(false)
  const [rebuildStats, setRebuildStats] = useState('')

  async function loadNarrative() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/semantic-documents/${docId}/narrative`)
      if (!res.ok) {
        setError(`加载失败 (${res.status})`)
        return
      }
      const data = await res.json()
      setNarrative(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : '网络错误')
    } finally {
      setLoading(false)
    }
  }

  async function loadRevisions(sectionId: string) {
    if (revisions[sectionId]) {
      return
    }
    setLoadingRevisions(prev => new Set(prev).add(sectionId))
    try {
      const res = await fetch(`/api/admin/semantic-sections/${sectionId}/revisions`)
      if (!res.ok) {
        throw new Error(`加载失败 (${res.status})`)
      }
      const data = await res.json()
      setRevisions(prev => ({ ...prev, [sectionId]: data.revisions }))
    } catch (e) {
      setError(e instanceof Error ? e.message : '网络错误')
    } finally {
      setLoadingRevisions(prev => {
        const next = new Set(prev)
        next.delete(sectionId)
        return next
      })
    }
  }

  async function rollbackRevision(sectionId: string, revisionId: string) {
    if (!window.confirm('确认回滚到这个版本吗？')) {
      return
    }
    setProcessingId(sectionId)
    setError('')
    try {
      const res = await fetch(`/api/admin/semantic-sections/${sectionId}/rollback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revision_id: revisionId }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || `回滚失败 (${res.status})`)
        return
      }
      await loadNarrative()
    } catch (e) {
      setError(e instanceof Error ? e.message : '网络错误')
    } finally {
      setProcessingId(null)
    }
  }

  function startEdit(section: Section) {
    setEditingId(section.id)
    setEditText(section.raw_text)
  }

  async function saveEdit(sectionId: string) {
    if (!window.confirm('保存后这一段会被锁定，不再被自动改写，确认吗？')) {
      return
    }
    setProcessingId(sectionId)
    setError('')
    try {
      const res = await fetch(`/api/admin/semantic-sections/${sectionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editText }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || `保存失败 (${res.status})`)
        return
      }
      setEditingId(null)
      await loadNarrative()
    } catch (e) {
      setError(e instanceof Error ? e.message : '网络错误')
    } finally {
      setProcessingId(null)
    }
  }

  function cancelEdit() {
    setEditingId(null)
    setEditText('')
  }

  async function rebuildNarrative() {
    if (!window.confirm('会重新生成未锁定的段落，旧版本可以在修改记录里回滚，确认吗？')) {
      return
    }
    setRebuilding(true)
    setError('')
    setRebuildStats('')
    try {
      const res = await fetch(`/api/admin/semantic-documents/${docId}/rebuild-narrative`, {
        method: 'POST',
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || `重建失败 (${res.status})`)
        return
      }
      const stats = await res.json()
      // Format stats for display
      const parts: string[] = []
      for (const kind in stats) {
        const kindStats = stats[kind]
        const kindParts: string[] = []
        for (const result in kindStats) {
          const label = mapResultToChineseLabel(result)
          kindParts.push(`${label} ${kindStats[result]}`)
        }
        if (kindParts.length > 0) {
          parts.push(kindParts.join(' · '))
        }
      }
      setRebuildStats(parts.join(' · '))
      await loadNarrative()
    } catch (e) {
      setError(e instanceof Error ? e.message : '网络错误')
    } finally {
      setRebuilding(false)
    }
  }

  function toggleSection(sectionId: string) {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(sectionId)) {
        next.delete(sectionId)
      } else {
        next.add(sectionId)
      }
      return next
    })
  }

  async function toggleRevisions(sectionId: string) {
    if (expandedRevisions.has(sectionId)) {
      setExpandedRevisions(prev => {
        const next = new Set(prev)
        next.delete(sectionId)
        return next
      })
    } else {
      await loadRevisions(sectionId)
      setExpandedRevisions(prev => new Set(prev).add(sectionId))
    }
  }

  useEffect(() => {
    loadNarrative()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docId])

  if (loading) {
    return <p className="text-xs font-light tracking-wide text-zinc-500">加载叙事中…</p>
  }

  if (!narrative) {
    return <p className="text-xs font-light tracking-wide text-zinc-500">无法加载叙事</p>
  }

  const hasNarrative = narrative.sections.length > 0
  const hasUnnarrated = narrative.unnarrated_entries.length > 0

  if (!hasNarrative && !hasUnnarrated) {
    return <p className="text-xs text-zinc-400">还没有叙事段落</p>
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-400/20 bg-red-500/5 p-3">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      {hasNarrative && (
        <>
          <div className="flex items-center justify-between gap-2">
            <ActionButton
              icon={FiRefreshCw}
              label="重建叙事"
              variant="primary"
              disabled={rebuilding}
              onClick={rebuildNarrative}
            />
            {rebuildStats && (
              <p className="text-xs text-zinc-400">{rebuildStats}</p>
            )}
          </div>

          <div className="space-y-2">
            {narrative.sections.map(section => (
              <div key={section.id} className="rounded-lg border border-white/10 bg-zinc-900/30 overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-start justify-between gap-2 p-3 hover:bg-white/5 transition"
                >
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-zinc-300">{section.heading}</p>
                    {section.locked && (
                      <p className="text-[10px] text-zinc-500 mt-1">已锁定（手动编辑）</p>
                    )}
                  </div>
                  {expandedSections.has(section.id) ? (
                    <FiChevronUp className="h-4 w-4 text-zinc-500 flex-shrink-0" />
                  ) : (
                    <FiChevronDown className="h-4 w-4 text-zinc-500 flex-shrink-0" />
                  )}
                </button>

                {expandedSections.has(section.id) && (
                  <div className="border-t border-white/10 p-3 space-y-3">
                    {editingId === section.id ? (
                      <>
                        <textarea
                          value={editText}
                          onChange={e => setEditText(e.target.value)}
                          className="w-full min-h-[150px] bg-zinc-900 text-zinc-300 text-xs font-mono p-2 rounded border border-white/10 focus:outline-none focus:border-blue-500"
                        />
                        <div className="flex gap-2">
                          <ActionButton
                            icon={FiSave}
                            label="保存"
                            variant="primary"
                            disabled={processingId === section.id}
                            onClick={() => saveEdit(section.id)}
                          />
                          <ActionButton
                            icon={FiX}
                            label="取消"
                            variant="danger"
                            disabled={processingId === section.id}
                            onClick={cancelEdit}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-zinc-900/50 rounded p-2 text-xs text-zinc-300 whitespace-pre-wrap break-words">
                          {section.text}
                        </div>
                        <div className="flex gap-2">
                          <ActionButton
                            icon={FiEdit2}
                            label="编辑"
                            variant="primary"
                            disabled={processingId === section.id}
                            onClick={() => startEdit(section)}
                          />
                          <button
                            onClick={() => toggleRevisions(section.id)}
                            className="text-xs px-2 py-1 rounded border border-white/10 hover:bg-white/5 transition text-zinc-400"
                            disabled={loadingRevisions.has(section.id) || processingId === section.id}
                          >
                            修改记录
                          </button>
                          {section.referenced_entries.length > 0 && (
                            <button
                              onClick={() => {
                                const text = section.referenced_entries.map(e => e.text).join('\n\n')
                                alert(`引用的条目：\n\n${text}`)
                              }}
                              className="text-xs px-2 py-1 rounded border border-white/10 hover:bg-white/5 transition text-zinc-400"
                              disabled={processingId === section.id}
                            >
                              查看来源 ({section.referenced_entries.length})
                            </button>
                          )}
                        </div>

                        {expandedRevisions.has(section.id) && revisions[section.id] && (
                          <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
                            {revisions[section.id].map(rev => (
                              <div key={rev.id} className="bg-zinc-900/50 rounded p-2 text-xs space-y-1">
                                <p className="text-zinc-500">{new Date(rev.created_at).toLocaleString('zh-CN')}</p>
                                <div>
                                  <p className="text-zinc-600 mb-1">修改前：</p>
                                  <p className="text-zinc-400 whitespace-pre-wrap break-words">{rev.before_text}</p>
                                </div>
                                <div>
                                  <p className="text-zinc-600 mb-1">修改后：</p>
                                  <p className="text-zinc-300 whitespace-pre-wrap break-words">{rev.after_text}</p>
                                </div>
                                <ActionButton
                                  icon={FiRotateCcw}
                                  label="回滚到修改前"
                                  variant="danger"
                                  disabled={processingId === section.id}
                                  onClick={() => rollbackRevision(section.id, rev.id)}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {hasUnnarrated && (
        <div className="rounded-lg border border-white/10 bg-zinc-900/30 p-3">
          <p className="text-sm font-medium text-zinc-300 mb-2">未编入叙事 ({narrative.unnarrated_entries.length})</p>
          <div className="space-y-2">
            {narrative.unnarrated_entries.map(entry => (
              <div key={entry.id} className="text-xs text-zinc-400 bg-zinc-900/50 rounded p-2">
                {entry.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
