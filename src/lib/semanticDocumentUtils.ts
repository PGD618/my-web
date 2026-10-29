import { removeEntryMarkers } from './narrativeUtils'

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

export interface NarrativeData {
  sections: NarrativeSection[]
  unnarrated_entries: NarrativeEntry[]
  entries?: NarrativeEntry[]
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
 * 获取条目列表，兼容后端还未更新的情况
 * 如果有 entries 字段，直接使用；否则从 sections 的 referenced_entries 和 unnarrated_entries 拼装
 */
export function getEntriesList(data: NarrativeData): NarrativeEntry[] {
  // 后端已更新，直接返回
  if (data.entries && Array.isArray(data.entries)) {
    return data.entries
  }

  // 后端未更新时的降级方案：从 sections 的 referenced_entries 和 unnarrated_entries 拼装
  const entryMap = new Map<string, NarrativeEntry>()

  // 先添加已被引用的条目
  data.sections.forEach(section => {
    section.referenced_entries?.forEach(entryId => {
      if (!entryMap.has(entryId)) {
        // 这里只有 id，需要创建默认对象
        entryMap.set(entryId, {
          id: entryId,
          text: '（条目详情未加载）',
          status: 'referenced',
          is_current: true,
          evolves_from: null,
          created_at: '',
          reinforcement_count: 0,
        })
      }
    })
  })

  // 再添加未被纳入叙事的条目
  data.unnarrated_entries?.forEach(entry => {
    if (!entryMap.has(entry.id)) {
      entryMap.set(entry.id, entry)
    }
  })

  // 转换为数组并排序（当前条目优先，然后按创建时间倒序）
  return Array.from(entryMap.values()).sort((a, b) => {
    if (a.is_current !== b.is_current) {
      return a.is_current ? -1 : 1
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
}

/**
 * 清理叙事文本中的标记
 */
export function cleanNarrativeText(text: string): string {
  return removeEntryMarkers(text)
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

/**
 * 过滤掉自传文档，保留分类文档
 */
export function filterCategoryDocuments<T extends { kind?: string }>(documents: T[]): T[] {
  return documents.filter(doc => doc.kind !== 'autobiography')
}
