'use client'

import { useEffect, useRef, useState } from 'react'
import { FiBookOpen, FiRefreshCw, FiChevronDown, FiChevronUp, FiAlertTriangle } from 'react-icons/fi'
import { AdminPageShell } from '@/features/admin/components/AdminPageShell'
import { ActionButton } from '@/features/admin/components/ActionButton'
import { AdminCard } from '@/features/admin/components/AdminCard'
import { ConfirmDialog } from '@/features/admin/components/ConfirmDialog'
import { LoadingText } from '@/features/admin/components/LoadingText'
import { Tag } from '@/features/admin/components/Tag'
import { useAdminMutation, useAdminResource } from '@/features/admin/hooks/useAdminResource'
import { cleanNarrativeText, generateStatsText, sortSections, isExperience, type AutobiographyData } from '@/features/admin/autobiography'
import type { AutobiographyRebuildResult, AutobiographyRebuildStatus } from '@/features/admin/types'

// 重建在后台跑，几分钟；每 3 秒问一次状态
const REBUILD_POLL_INTERVAL_MS = 3000

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
  const { processingId, errors, setError, run } = useAdminMutation()
  const actionError = errors.rebuild
  const [expandedUnnarrated, setExpandedUnnarrated] = useState(false)
  const [rebuildResult, setRebuildResult] = useState<AutobiographyRebuildResult | null>(null)
  // 轮询期间 processingId 已经清空，用这个单独标记，避免按钮重新可点、重复启动
  const [rebuildPolling, setRebuildPolling] = useState(false)
  const rebuilding = processingId === 'rebuild' || rebuildPolling
  const [showConfirm, setShowConfirm] = useState(false)
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mountedRef = useRef(true)

  function stopPolling() {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current)
      pollTimerRef.current = null
    }
  }

  function pollRebuild(jobId: string) {
    pollTimerRef.current = setTimeout(async () => {
      pollTimerRef.current = null
      if (!mountedRef.current) return
      let status: AutobiographyRebuildStatus
      try {
        const res = await fetch(`/api/admin/autobiography/rebuild/${jobId}`)
        if (res.status === 404) {
          // 任务查不到就不会再有结果，停下来报错，不无限轮询
          setRebuildPolling(false)
          setError('rebuild', '重建状态查询失败，请刷新页面确认结果')
          return
        }
        if (!res.ok) {
          // 其他失败（网络抖动、代理超时）不中断：重建在后台继续，下一轮再问
          pollRebuild(jobId)
          return
        }
        status = await res.json()
      } catch {
        pollRebuild(jobId)
        return
      }
      if (!mountedRef.current) return
      if (status.status === 'running') {
        pollRebuild(jobId)
        return
      }
      setRebuildPolling(false)
      if (status.status === 'failed') {
        setError('rebuild', `重建失败：${status.error || '请查看服务器日志'}`)
        return
      }
      const result = status.result
      if (!result || result.chapters_written === 0) {
        setError('rebuild', '重建没有写入任何章节，请查看服务器日志')
        return
      }
      setRebuildResult(result)
      reload()
      setTimeout(() => setRebuildResult(null), 1500)
    }, REBUILD_POLL_INTERVAL_MS)
  }

  function startPolling(jobId: string) {
    setRebuildPolling(true)
    setError('rebuild', null)
    pollRebuild(jobId)
  }

  async function handleRebuild() {
    // 重建在后台跑（几分钟），POST 只负责启动并返回 job_id，进度靠轮询
    await run('rebuild', () => fetch('/api/admin/autobiography/rebuild', { method: 'POST' }), {
      onError: async res => {
        const data = await res.json().catch(() => ({}))
        if (res.status === 409 && data.job_id) {
          // 已有重建在跑：接上它，不报错
          startPolling(data.job_id)
          return ''
        }
        return `重建失败：${data.error || res.statusText}`
      },
      networkError: '网络错误',
      onSuccess: async res => {
        const { job_id: jobId } = await res.json()
        startPolling(jobId)
      },
    })
    setShowConfirm(false)
  }

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      stopPolling()
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
          message="会用当前全部条目重新生成整篇自传，锁定的段落会保留。重建在后台进行，通常需要几分钟，可以关掉页面。"
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
        message="会用当前全部条目重新生成整篇自传，锁定的段落会保留。重建在后台进行，通常需要几分钟，可以关掉页面。"
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

      {rebuildPolling && (
        <div className="mb-6 rounded-lg border border-blue-400/20 bg-blue-500/5 p-4">
          <p className="text-sm text-blue-300">重建进行中，通常需要几分钟，可以关掉页面</p>
        </div>
      )}

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
