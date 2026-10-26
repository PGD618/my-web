/**
 * 解析合并提案中的 check_report 字段。
 * - null 时返回 null
 * - JSON 字符串时解析并返回对象
 * - 坏 JSON 时返回 { error: 错误信息 }
 */
export function parseCheckReport(checkReport: string | null): Record<string, unknown> | null {
  if (checkReport === null) return null
  try {
    return JSON.parse(checkReport) as Record<string, unknown>
  } catch (e) {
    return { error: `Invalid JSON: ${e instanceof Error ? e.message : 'Unknown error'}` }
  }
}

export interface MergeProposal {
  id: string
  relation: 'refine' | 'evolved'
  source_entry_ids: string[]
  sources: Array<{
    id: string
    text: string
    evidence: string[]
  }>
  proposed_text?: string
  check_report: string | null
  status: string
  created_at: string
  resolved_at?: string | null
}

export interface ProcessedProposal {
  id: string
  relation: 'refine' | 'evolved'
  sources: Array<{
    id: string
    text: string
    evidence: string[]
  }>
  proposedText?: string
  checkReport: Record<string, unknown> | null
  status: string
  createdAt: string
  resolvedAt?: string | null
}

/**
 * 将 API 返回的提案转换为前端需要的格式。
 */
export function processProposal(proposal: MergeProposal): ProcessedProposal {
  return {
    id: proposal.id,
    relation: proposal.relation,
    sources: proposal.sources,
    proposedText: proposal.proposed_text,
    checkReport: parseCheckReport(proposal.check_report),
    status: proposal.status,
    createdAt: proposal.created_at,
    resolvedAt: proposal.resolved_at,
  }
}
