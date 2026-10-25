const resultKindMap: Record<string, string> = {
  success: '成功',
  invalid_json: '格式错误',
  missing_source: '缺少来源',
  dropped_reference: '挤掉旧引用',
  unfaithful: '不忠实',
  causal_without_source: '因果无来源',
  too_long: '过长',
  llm_error: '模型出错',
  no_relevant_section: '无相关段落',
}

export function formatNarrativeStats(stats: Record<string, Record<string, number>>): string {
  const parts: string[] = []

  for (const kind in stats) {
    const kindStats = stats[kind]
    const kindParts: string[] = []

    for (const result in kindStats) {
      const count = kindStats[result]
      const label = resultKindMap[result] || result
      kindParts.push(`${label} ${count}`)
    }

    if (kindParts.length > 0) {
      parts.push(`${kind} ${kindParts.join(' · ')}`)
    }
  }

  return parts.join(' · ')
}

export function mapResultToChineseLabel(result: string): string {
  return resultKindMap[result] || result
}
