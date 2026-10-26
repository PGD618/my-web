import { removeEntryMarkers } from './narrativeUtils'

export interface NarrativeEntry {
  id: string
  text: string
  status: string
  is_current: boolean
  evolves_from: string | null
  created_at: string
  reinforcement_count: number
}

export interface NarrativeSection {
  id: string
  heading: string
  text: string
  raw_text: string
  entry_ids: string[]
  locked: boolean
  version: number
  updated_at: string
  referenced_entries: string[]
}

export interface NarrativeData {
  sections: NarrativeSection[]
  unnarrated_entries: NarrativeEntry[]
  entries?: NarrativeEntry[]
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
