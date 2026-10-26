export interface SemanticEntry {
  id: string
  text: string
  category: string
  status: string
  created_at: string
}

export interface GroupedEntries {
  [category: string]: SemanticEntry[]
}

export function groupByCategory(items: SemanticEntry[]): GroupedEntries {
  return items.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    },
    {} as GroupedEntries
  )
}

export function getDetailError(detail: unknown): string | null {
  if (typeof detail === 'string') {
    return detail
  }
  if (detail && typeof detail === 'object' && 'error' in detail) {
    const error = (detail as Record<string, unknown>).error
    return typeof error === 'string' ? error : null
  }
  return null
}
