export interface NarrativeEntry {
  id: string
  text: string
  status: string
  is_current: boolean
  evolves_from: string | null
  created_at: string
  reinforcement_count: number
  kind?: 'opinion' | 'experience'
  occurred_at?: string | null
  category?: string
}

export interface NarrativeSection {
  id: string
  heading: string
  text: string
  raw_text?: string
  entry_ids?: string[]
  locked?: boolean
  version?: number
  updated_at: string
  referenced_entries?: string[]
  position?: number
}

export interface AutobiographyData {
  document_id: string
  sections: NarrativeSection[]
  unnarrated_entries: NarrativeEntry[]
  stats: {
    entries_total: number
    narrated: number
    unnarrated: number
  }
}

/**
 * 清理叙事文本中的 [e:...] 条目标记
 */
export function cleanNarrativeText(text: string): string {
  return text.replace(/\[e:[^\]]+\]/g, '')
}

/**
 * 判断条目是否为经历
 */
export function isExperience(entry: NarrativeEntry): boolean {
  return entry.kind === 'experience'
}

/**
 * 排序自传章节
 */
export function sortSections(sections: NarrativeSection[]): NarrativeSection[] {
  return [...sections].sort((a, b) => {
    const posA = a.position ?? Number.MAX_VALUE
    const posB = b.position ?? Number.MAX_VALUE
    return posA - posB
  })
}

/**
 * 生成统计文案
 */
export function generateStatsText(stats: { entries_total: number; narrated: number; unnarrated: number }): string {
  return `共 ${stats.entries_total} 条，已编入 ${stats.narrated} 条，未编入 ${stats.unnarrated} 条`
}
