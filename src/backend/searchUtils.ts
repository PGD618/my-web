/** 从 Fuse.js 匹配结果中提取上下文片段，用于搜索结果显示 */

export interface MatchIndices {
  indices: readonly [number, number][]
  value?: string
}

export interface SnippetResult {
  text: string
  indices: [number, number][]
}

/**
 * 从匹配结果中提取带上下文的片段。
 * 以第一个匹配位置为中心，前后各扩展 contextLen 个字符。
 */
export function getSnippet(
  match: MatchIndices | undefined,
  contextLen: number = 40
): SnippetResult | null {
  if (!match?.value || !match.indices.length) return null

  const [firstStart, firstEnd] = match.indices[0]
  const start = Math.max(0, firstStart - contextLen)
  const end = Math.min(match.value.length, firstEnd + 1 + contextLen)

  const prefix = start > 0 ? '...' : ''
  const suffix = end < match.value.length ? '...' : ''
  const text = prefix + match.value.slice(start, end) + suffix

  const prefixLen = prefix.length
  const indices = match.indices
    .filter(([s]) => s >= start && s <= end)
    .map(
      ([s, e]) =>
        [s - start + prefixLen, Math.min(e, end - 1) - start + prefixLen] as [number, number]
    )

  return { text, indices }
}
