'use client'

import { useEffect, useState } from 'react'
import { FiBookOpen, FiRefreshCw, FiChevronDown, FiChevronUp, FiAlertTriangle } from 'react-icons/fi'
import { AdminPageShell } from '@/frontend/components/admin/AdminPageShell'
import { ActionButton } from '@/frontend/components/admin/ActionButton'
import { cleanNarrativeText, generateStatsText, sortSections, isExperience, type AutobiographyData } from '@/lib/semanticDocumentUtils'

export function AdminAutobiographyClient() {
  const [data, setData] = useState<AutobiographyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedUnnarrated, setExpandedUnnarrated] = useState(false)
  const [rebuilding, setRebuilding] = useState(false)
  const [rebuildResult, setRebuildResult] = useState<{ chapters_planned: number; chapters_written: number; chapters_failed: number } | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/autobiography')
      if (res.status === 404) {
        setError('自传页面不存在')
        setData(null)
      } else if (!res.ok) {
        setError(`加载失败 (${res.status})`)
        setData(null)
      } else {
        const result = await res.json()
        setData(result)
      }
    } catch {
      setError('网络错误')
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  async function handleRebuild() {
    if (!window.confirm('会用当前条目重新生成整篇自传，主人锁定的段落保留。确认吗？')) {
      return
    }

    setRebuilding(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/autobiography/rebuild', {
        method: 'POST',
      })

      if (!res.ok) {
        setError(`重建失败 (${res.status})`)
      } else {
        const result = await res.json()
        setRebuildResult(result)
        setTimeout(() => {
          load()
          setRebuildResult(null)
        }, 1500)
      }
    } catch {
      setError('网络错误')
    } finally {
      setRebuilding(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) {
    return (
      <AdminPageShell icon={FiBookOpen} title="我的自传" subtitle="Autobiography">
        <p className="text-xs font-light tracking-wide text-zinc-500">加载中…</p>
      </AdminPageShell>
    )
  }

  if (error) {
    return (
      <AdminPageShell icon={FiBookOpen} title="我的自传" subtitle="Autobiography">
        <div className="flex items-center gap-2 rounded-lg border border-red-400/20 bg-red-500/5 px-4 py-3">
          <FiAlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      </AdminPageShell>
    )
  }

  if (!data || data.sections.length === 0) {
    return (
      <AdminPageShell icon={FiBookOpen} title="我的自传" subtitle="Autobiography">
        <div className="rounded-[20px] border border-white/10 bg-zinc-950/60 p-6 text-center">
          <p className="text-sm text-zinc-300 mb-4">自传还没有生成，可以点右上角重建</p>
          <div className="flex justify-center">
            <ActionButton
              icon={FiRefreshCw}
              label="重建自传"
              variant="primary"
              disabled={rebuilding}
              onClick={handleRebuild}
            />
          </div>
        </div>
      </AdminPageShell>
    )
  }

  const sortedSections = sortSections(data.sections)
  const statsText = generateStatsText(data.stats)

  return (
    <AdminPageShell icon={FiBookOpen} title="我的自传" subtitle="Autobiography">
      <div className="absolute top-10 right-6 md:right-[5vw]">
        <ActionButton
          icon={FiRefreshCw}
          label="重建自传"
          variant="primary"
          disabled={rebuilding}
          onClick={handleRebuild}
        />
      </div>

      {rebuildResult && (
        <div className="mb-6 rounded-lg border border-blue-400/20 bg-blue-500/5 p-4">
          <p className="text-sm text-blue-300">
            已规划 {rebuildResult.chapters_planned} 章，写入 {rebuildResult.chapters_written} 章，失败{' '}
            {rebuildResult.chapters_failed} 章
          </p>
        </div>
      )}

      {/* 正文章节 */}
      <div className="space-y-8 mb-8">
        {sortedSections.map(section => (
          <div key={section.id} className="rounded-[20px] border border-white/10 bg-zinc-950/60 p-6">
            {section.heading && (
              <h2 className="text-lg font-medium text-zinc-100 mb-4">{section.heading}</h2>
            )}
            <p className="text-sm leading-relaxed text-zinc-200 whitespace-pre-wrap">
              {cleanNarrativeText(section.text)}
            </p>
          </div>
        ))}
      </div>

      {/* 统计行 */}
      <div className="mb-6 text-xs text-zinc-500">{statsText}</div>

      {/* 未编入条目 */}
      {data.unnarrated_entries.length > 0 && (
        <div className="rounded-[20px] border border-white/10 bg-zinc-950/60 p-4 space-y-3">
          <button
            onClick={() => setExpandedUnnarrated(!expandedUnnarrated)}
            className="flex items-center gap-2 w-full text-xs font-mono uppercase tracking-[0.18em] text-zinc-600 hover:text-zinc-500 transition"
          >
            {expandedUnnarrated ? (
              <FiChevronUp className="h-3 w-3" />
            ) : (
              <FiChevronDown className="h-3 w-3" />
            )}
            未编入条目 ({data.unnarrated_entries.length})
          </button>

          {expandedUnnarrated && (
            <div className="space-y-3 mt-4">
              {data.unnarrated_entries.map(entry => (
                <div key={entry.id} className="flex items-start gap-2 text-xs text-zinc-300">
                  {isExperience(entry) && (
                    <span className="mt-0.5 inline-block px-1.5 py-0.5 text-[10px] bg-emerald-700/40 text-emerald-400 rounded flex-shrink-0">
                      经历
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <p>{entry.text}</p>
                    {entry.category && (
                      <p className="text-[10px] text-zinc-600 mt-1">{entry.category}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </AdminPageShell>
  )
}
