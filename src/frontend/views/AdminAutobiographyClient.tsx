'use client'

import { useEffect, useRef, useState } from 'react'
import { FiBookOpen, FiRefreshCw, FiChevronDown, FiChevronUp, FiAlertTriangle } from 'react-icons/fi'
import { AdminPageShell } from '@/frontend/components/admin/AdminPageShell'
import { ActionButton } from '@/frontend/components/admin/ActionButton'
import { AdminCard } from '@/frontend/components/admin/AdminCard'
import { ConfirmDialog } from '@/frontend/components/admin/ConfirmDialog'
import { LoadingText } from '@/frontend/components/admin/LoadingText'
import { Tag } from '@/frontend/components/admin/Tag'
import { useAdminMutation, useAdminResource } from '@/frontend/hooks/useAdminResource'
import { cleanNarrativeText, generateStatsText, sortSections, isExperience, type AutobiographyData } from '@/lib/autobiography'
import type { AutobiographyRebuildResult } from '@/lib/adminTypes'

export function AdminAutobiographyClient() {
  // 加载失败才整页显示错误；重建失败只在正文上方内联提示，正文保留
  const { data, loading, error: loadError, reload } = useAdminResource<AutobiographyData>(
    '/api/admin/autobiography',
    json => json,
    {
      errorMessage: status => (status === 404 ? '自传页面不存在' : `加载失败 (${status})`),
      networkErrorMessage: '网络错误',
    }
  )
  const { processingId, errors, run } = useAdminMutation()
  const rebuilding = processingId === 'rebuild'
  const actionError = errors.rebuild
  const [expandedUnnarrated, setExpandedUnnarrated] = useState(false)
  const [rebuildResult, setRebuildResult] = useState<AutobiographyRebuildResult | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const reloadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function handleRebuild() {
    await run('rebuild', () => fetch('/api/admin/autobiography/rebuild', { method: 'POST' }), {
      onError: async res => {
        const data = await res.json().catch(() => ({}))
        return `重建失败：${data.detail || res.statusText}`
      },
      networkError: '网络错误',
      onSuccess: async res => {
        const result: AutobiographyRebuildResult = await res.json()
        if (result.chapters_written === 0) {
          return '重建没有写入任何章节，请查看服务器日志'
        }
        setRebuildResult(result)
        if (reloadTimerRef.current) clearTimeout(reloadTimerRef.current)
        reloadTimerRef.current = setTimeout(() => {
          reloadTimerRef.current = null
          reload()
          setRebuildResult(null)
        }, 1500)
      },
    })
    setShowConfirm(false)
  }

  useEffect(() => {
    return () => {
      if (reloadTimerRef.current) clearTimeout(reloadTimerRef.current)
    }
  }, [])

  const actionErrorBlock = actionError && (
    <div className="mb-6 rounded-lg border border-red-400/20 bg-red-500/5 px-4 py-3">
      <div className="flex items-center gap-2">
        <FiAlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
        <p className="text-sm text-red-300">{actionError}</p>
      </div>
    </div>
  )

  if (loading) {
    return (
      <AdminPageShell icon={FiBookOpen} title="我的自传" subtitle="Autobiography">
        <LoadingText />
      </AdminPageShell>
    )
  }

  if (loadError) {
    return (
      <AdminPageShell icon={FiBookOpen} title="我的自传" subtitle="Autobiography">
        <div className="flex items-center justify-between gap-4 rounded-lg border border-red-400/20 bg-red-500/5 px-4 py-3">
          <div className="flex items-center gap-2">
            <FiAlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-300">{loadError}</p>
          </div>
          <ActionButton icon={FiRefreshCw} label="重试" onClick={reload} />
        </div>
      </AdminPageShell>
    )
  }

  if (!data || data.sections.length === 0) {
    return (
      <AdminPageShell icon={FiBookOpen} title="我的自传" subtitle="Autobiography">
        <ConfirmDialog
          isOpen={showConfirm}
          title="重建自传"
          message="会用当前全部条目重新生成整篇自传，锁定的段落会保留。重建需要一两分钟。"
          cancelLabel="取消"
          confirmLabel="确认重建"
          isLoading={rebuilding}
          onConfirm={handleRebuild}
          onCancel={() => setShowConfirm(false)}
        />
        {actionErrorBlock}
        <AdminCard className="p-6 text-center">
          <p className="text-sm text-zinc-300 mb-4">自传还没有生成，可以点右上角重建</p>
          <div className="flex justify-center">
            <ActionButton
              icon={FiRefreshCw}
              label="重建自传"
              variant="primary"
              disabled={rebuilding}
              onClick={() => setShowConfirm(true)}
            />
          </div>
        </AdminCard>
      </AdminPageShell>
    )
  }

  const sortedSections = sortSections(data.sections)
  const statsText = generateStatsText(data.stats)

  return (
    <AdminPageShell icon={FiBookOpen} title="我的自传" subtitle="Autobiography">
      <ConfirmDialog
        isOpen={showConfirm}
        title="重建自传"
        message="会用当前全部条目重新生成整篇自传，锁定的段落会保留。重建需要一两分钟。"
        cancelLabel="取消"
        confirmLabel="确认重建"
        isLoading={rebuilding}
        onConfirm={handleRebuild}
        onCancel={() => setShowConfirm(false)}
      />
      <div className="absolute top-10 right-6 md:right-[5vw]">
        <ActionButton
          icon={FiRefreshCw}
          label="重建自传"
          variant="primary"
          disabled={rebuilding}
          onClick={() => setShowConfirm(true)}
        />
      </div>

      {actionErrorBlock}

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
          <AdminCard key={section.id} className="p-6">
            {section.heading && (
              <h2 className="text-lg font-medium text-zinc-100 mb-4">{section.heading}</h2>
            )}
            <p className="text-sm leading-relaxed text-zinc-200 whitespace-pre-wrap">
              {cleanNarrativeText(section.text)}
            </p>
          </AdminCard>
        ))}
      </div>

      {/* 统计行 */}
      <div className="mb-6 text-xs text-zinc-500">{statsText}</div>

      {/* 未编入条目 */}
      {data.unnarrated_entries.length > 0 && (
        <AdminCard className="p-4 space-y-3">
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
                    <Tag tone="experience" className="flex-shrink-0">
                      经历
                    </Tag>
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
        </AdminCard>
      )}
    </AdminPageShell>
  )
}
