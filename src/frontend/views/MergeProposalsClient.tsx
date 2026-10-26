'use client'

import { useEffect, useState } from 'react'
import { FiCheck, FiX, FiRotateCw, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { ActionButton } from '@/frontend/components/admin/ActionButton'
import { ReviewList } from '@/frontend/components/admin/ReviewList'
import { processProposal, type MergeProposal } from '@/lib/mergeProposalUtils'

interface ProposalState {
  id: string
  error?: string
  isProcessing?: boolean
}

export function MergeProposalsClient() {
  const [proposals, setProposals] = useState<MergeProposal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [proposalStates, setProposalStates] = useState<Record<string, ProposalState>>({})
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [triggering, setTriggering] = useState(false)

  async function loadProposals() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/semantic-merge-proposals?status=pending')
      if (!res.ok) {
        setError(`加载失败 (${res.status})`)
        return
      }
      const data = await res.json()
      setProposals(data.proposals || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : '网络错误')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProposals()
  }, [])

  async function approveProposal(proposal: MergeProposal) {
    if (!window.confirm('确认批准这个提案吗？')) {
      return
    }

    const propId = proposal.id
    setProposalStates(prev => ({ ...prev, [propId]: { id: propId, isProcessing: true } }))

    try {
      const body = proposal.relation === 'evolved' ? { direction: 'as_suggested' } : undefined
      const res = await fetch(`/api/admin/semantic-merge-proposals/${propId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      })

      if (!res.ok) {
        const data = await res.json()
        setProposalStates(prev => ({
          ...prev,
          [propId]: { id: propId, error: `${res.status}: ${data.detail || '批准失败'}` },
        }))
        return
      }

      setProposals(prev => prev.filter(p => p.id !== propId))
      setProposalStates(prev => {
        const next = { ...prev }
        delete next[propId]
        return next
      })
    } catch (e) {
      setProposalStates(prev => ({
        ...prev,
        [propId]: { id: propId, error: e instanceof Error ? e.message : '网络错误' },
      }))
    }
  }

  async function rejectProposal(proposal: MergeProposal) {
    if (!window.confirm('确认驳回这个提案吗？')) {
      return
    }

    const propId = proposal.id
    setProposalStates(prev => ({ ...prev, [propId]: { id: propId, isProcessing: true } }))

    try {
      const res = await fetch(`/api/admin/semantic-merge-proposals/${propId}/reject`, {
        method: 'POST',
      })

      if (!res.ok) {
        const data = await res.json()
        setProposalStates(prev => ({
          ...prev,
          [propId]: { id: propId, error: `${res.status}: ${data.detail || '驳回失败'}` },
        }))
        return
      }

      setProposals(prev => prev.filter(p => p.id !== propId))
      setProposalStates(prev => {
        const next = { ...prev }
        delete next[propId]
        return next
      })
    } catch (e) {
      setProposalStates(prev => ({
        ...prev,
        [propId]: { id: propId, error: e instanceof Error ? e.message : '网络错误' },
      }))
    }
  }

  async function triggerDetection() {
    setTriggering(true)
    try {
      const res = await fetch('/api/admin/semantic-merge/run', { method: 'POST' })
      if (!res.ok) {
        setError(`检测失败 (${res.status})`)
      } else {
        await new Promise(r => setTimeout(r, 500))
        await loadProposals()
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '网络错误')
    } finally {
      setTriggering(false)
    }
  }

  const renderProposal = (proposal: MergeProposal) => {
    const state = proposalStates[proposal.id]
    const isExpanded = expandedIds.has(proposal.id)
    const processed = processProposal(proposal)

    return (
      <div
        key={proposal.id}
        className="rounded-[16px] border border-white/5 bg-zinc-900/40 p-4 backdrop-blur-sm"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() =>
                  setExpandedIds(prev => {
                    const next = new Set(prev)
                    if (next.has(proposal.id)) next.delete(proposal.id)
                    else next.add(proposal.id)
                    return next
                  })
                }
                className="text-zinc-400 hover:text-white transition-colors"
              >
                {isExpanded ? (
                  <FiChevronUp className="h-4 w-4" />
                ) : (
                  <FiChevronDown className="h-4 w-4" />
                )}
              </button>
              <span className="text-xs font-mono px-2 py-1 rounded bg-zinc-800/50 text-zinc-300">
                {proposal.relation}
              </span>
            </div>

            {isExpanded && (
              <div className="space-y-3 ml-6">
                {proposal.relation === 'refine' ? (
                  <div className="space-y-2">
                    <p className="text-xs text-zinc-500 font-mono uppercase">来源条目</p>
                    {processed.sources.map((source, i) => (
                      <div key={i} className="space-y-1 text-xs">
                        <p className="text-white font-medium break-words">{source.text}</p>
                        {source.evidence.length > 0 && (
                          <div className="pl-2 border-l border-zinc-700">
                            {source.evidence.map((ev, j) => (
                              <p key={j} className="text-zinc-400 italic text-[10px] break-words">
                                &quot;{ev}&quot;
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {processed.proposedText && (
                      <div className="mt-3">
                        <p className="text-xs text-zinc-500 font-mono uppercase">合成表述</p>
                        <p className="text-white text-xs mt-1 break-words">{processed.proposedText}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-zinc-500 font-mono uppercase">演变</p>
                    <div className="space-y-1">
                      {processed.sources.map((source, i) => (
                        <div key={i}>
                          <p className="text-xs text-zinc-400">旧版本：</p>
                          <p className="text-white text-xs break-words">{source.text}</p>
                        </div>
                      ))}
                    </div>
                    {processed.proposedText && (
                      <div>
                        <p className="text-xs text-zinc-400">新版本：</p>
                        <p className="text-white text-xs break-words">{processed.proposedText}</p>
                      </div>
                    )}
                  </div>
                )}

                {processed.checkReport && (
                  <div className="mt-3">
                    <p className="text-xs text-zinc-500 font-mono uppercase">校验结果</p>
                    <div className="mt-1 text-xs space-y-1">
                      {processed.checkReport.error ? (
                        <p className="text-red-400">{String(processed.checkReport.error)}</p>
                      ) : (
                        Object.entries(processed.checkReport).map(([key, value]) => (
                          <p
                            key={key}
                            className={value === false ? 'text-red-400' : 'text-zinc-400'}
                          >
                            {key}: {String(value)}
                          </p>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {state?.error && (
                  <div className="mt-3 p-2 rounded bg-red-500/10 border border-red-500/30">
                    <p className="text-xs text-red-400">{state.error}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2 shrink-0">
            <ActionButton
              icon={FiCheck}
              label="批准"
              disabled={state?.isProcessing}
              onClick={() => approveProposal(proposal)}
            />
            <ActionButton
              icon={FiX}
              label="驳回"
              variant="danger"
              disabled={state?.isProcessing}
              onClick={() => rejectProposal(proposal)}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-zinc-300">待审核提案</h2>
        <ActionButton
          icon={FiRotateCw}
          label="立即检测"
          disabled={triggering}
          onClick={triggerDetection}
        />
      </div>

      {error && (
        <div className="rounded-[16px] border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      {loading ? (
        <p className="text-xs text-zinc-600">加载中...</p>
      ) : (
        <ReviewList
          items={proposals}
          renderItem={renderProposal}
          emptyLabel="暂无待审合并提案"
        />
      )}
    </div>
  )
}
