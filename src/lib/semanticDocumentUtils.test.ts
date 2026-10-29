import { describe, it, expect } from 'vitest'
import {
  getEntriesList,
  cleanNarrativeText,
  isExperience,
  sortSections,
  generateStatsText,
  filterCategoryDocuments,
  NarrativeData,
  type NarrativeEntry,
  type NarrativeSection,
} from './semanticDocumentUtils'

describe('semanticDocumentUtils', () => {
  describe('getEntriesList', () => {
    it('should return entries directly when available', () => {
      const data: NarrativeData = {
        sections: [],
        unnarrated_entries: [],
        entries: [
          {
            id: 'e1',
            text: 'Entry 1',
            status: 'active',
            is_current: true,
            evolves_from: null,
            created_at: '2026-01-01',
            reinforcement_count: 1,
          },
        ],
      }
      const result = getEntriesList(data)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('e1')
    })

    it('should fallback to combining sections and unnarrated_entries', () => {
      const data: NarrativeData = {
        sections: [
          {
            id: 's1',
            heading: 'Section 1',
            text: 'Text',
            updated_at: '2026-01-01',
            referenced_entries: ['e1', 'e2'],
          },
        ],
        unnarrated_entries: [
          {
            id: 'e3',
            text: 'Unnarrated',
            status: 'active',
            is_current: true,
            evolves_from: null,
            created_at: '2026-01-02',
            reinforcement_count: 0,
          },
        ],
      }
      const result = getEntriesList(data)
      expect(result).toHaveLength(3)
      expect(result.map(e => e.id)).toContain('e1')
      expect(result.map(e => e.id)).toContain('e2')
      expect(result.map(e => e.id)).toContain('e3')
    })

    it('should prioritize current entries', () => {
      const data: NarrativeData = {
        sections: [],
        unnarrated_entries: [
          {
            id: 'e1',
            text: 'Old',
            status: 'active',
            is_current: false,
            evolves_from: null,
            created_at: '2026-01-01',
            reinforcement_count: 1,
          },
          {
            id: 'e2',
            text: 'Current',
            status: 'active',
            is_current: true,
            evolves_from: 'e1',
            created_at: '2026-01-02',
            reinforcement_count: 0,
          },
        ],
      }
      const result = getEntriesList(data)
      expect(result[0].is_current).toBe(true)
      expect(result[1].is_current).toBe(false)
    })

    it('should handle empty data', () => {
      const data: NarrativeData = {
        sections: [],
        unnarrated_entries: [],
      }
      const result = getEntriesList(data)
      expect(result).toHaveLength(0)
    })

    it('should deduplicate entries', () => {
      const entry: NarrativeEntry = {
        id: 'e1',
        text: 'Entry',
        status: 'active',
        is_current: true,
        evolves_from: null,
        created_at: '2026-01-01',
        reinforcement_count: 0,
      }
      const data: NarrativeData = {
        sections: [
          {
            id: 's1',
            heading: 'Section',
            text: 'Text',
            updated_at: '2026-01-01',
            referenced_entries: ['e1'],
          },
        ],
        unnarrated_entries: [entry],
      }
      const result = getEntriesList(data)
      expect(result).toHaveLength(1)
    })

    it('should handle kind field when present', () => {
      const data: NarrativeData = {
        sections: [],
        unnarrated_entries: [
          {
            id: 'e1',
            text: 'Experience text',
            status: 'active',
            is_current: true,
            evolves_from: null,
            created_at: '2026-01-01',
            reinforcement_count: 0,
            kind: 'experience',
            occurred_at: '2025-12-25',
          },
        ],
      }
      const result = getEntriesList(data)
      expect(result[0].kind).toBe('experience')
      expect(result[0].occurred_at).toBe('2025-12-25')
    })

    it('should handle occurred_at as null', () => {
      const data: NarrativeData = {
        sections: [],
        unnarrated_entries: [
          {
            id: 'e1',
            text: 'Opinion text',
            status: 'active',
            is_current: true,
            evolves_from: null,
            created_at: '2026-01-01',
            reinforcement_count: 0,
            kind: 'opinion',
            occurred_at: null,
          },
        ],
      }
      const result = getEntriesList(data)
      expect(result[0].kind).toBe('opinion')
      expect(result[0].occurred_at).toBeNull()
    })
  })

  describe('cleanNarrativeText', () => {
    it('should remove entry markers', () => {
      const text = 'This [e:entry-1] is clean [e:entry-2].'
      expect(cleanNarrativeText(text)).toBe('This  is clean .')
    })

    it('should handle text without markers', () => {
      const text = 'No markers here.'
      expect(cleanNarrativeText(text)).toBe('No markers here.')
    })
  })

  describe('isExperience', () => {
    it('should return true for experience kind', () => {
      const entry: NarrativeEntry = {
        id: 'e1',
        text: 'Experience',
        status: 'active',
        is_current: true,
        evolves_from: null,
        created_at: '2026-01-01',
        reinforcement_count: 0,
        kind: 'experience',
      }
      expect(isExperience(entry)).toBe(true)
    })

    it('should return false for opinion kind', () => {
      const entry: NarrativeEntry = {
        id: 'e1',
        text: 'Opinion',
        status: 'active',
        is_current: true,
        evolves_from: null,
        created_at: '2026-01-01',
        reinforcement_count: 0,
        kind: 'opinion',
      }
      expect(isExperience(entry)).toBe(false)
    })

    it('should return false when kind is missing', () => {
      const entry: NarrativeEntry = {
        id: 'e1',
        text: 'Entry',
        status: 'active',
        is_current: true,
        evolves_from: null,
        created_at: '2026-01-01',
        reinforcement_count: 0,
      }
      expect(isExperience(entry)).toBe(false)
    })
  })

  describe('sortSections', () => {
    it('should sort sections by position', () => {
      const sections: NarrativeSection[] = [
        { id: 's1', heading: 'First', text: 'Text 1', updated_at: '2026-01-01', position: 2 },
        { id: 's2', heading: 'Second', text: 'Text 2', updated_at: '2026-01-02', position: 1 },
        { id: 's3', heading: 'Third', text: 'Text 3', updated_at: '2026-01-03', position: 3 },
      ]
      const result = sortSections(sections)
      expect(result.map(s => s.id)).toEqual(['s2', 's1', 's3'])
    })

    it('should handle sections without position', () => {
      const sections: NarrativeSection[] = [
        { id: 's1', heading: 'With position', text: 'Text 1', updated_at: '2026-01-01', position: 1 },
        { id: 's2', heading: 'Without position', text: 'Text 2', updated_at: '2026-01-02' },
      ]
      const result = sortSections(sections)
      expect(result[0].id).toBe('s1')
      expect(result[1].id).toBe('s2')
    })

    it('should handle empty sections array', () => {
      const result = sortSections([])
      expect(result).toEqual([])
    })
  })

  describe('generateStatsText', () => {
    it('should generate correct stats text', () => {
      const text = generateStatsText({ entries_total: 10, narrated: 7, unnarrated: 3 })
      expect(text).toBe('共 10 条，已编入 7 条，未编入 3 条')
    })

    it('should handle zero values', () => {
      const text = generateStatsText({ entries_total: 0, narrated: 0, unnarrated: 0 })
      expect(text).toBe('共 0 条，已编入 0 条，未编入 0 条')
    })
  })

  describe('filterCategoryDocuments', () => {
    it('should filter out autobiography documents', () => {
      const docs = [
        { id: 'd1', kind: 'category', title: 'Doc 1' },
        { id: 'd2', kind: 'autobiography', title: 'Auto' },
        { id: 'd3', kind: 'category', title: 'Doc 3' },
      ]
      const result = filterCategoryDocuments(docs)
      expect(result).toHaveLength(2)
      expect(result.map(d => d.id)).toEqual(['d1', 'd3'])
    })

    it('should keep documents without kind field', () => {
      const docs = [
        { id: 'd1', kind: 'category', title: 'Doc 1' },
        { id: 'd2', title: 'Doc 2' },
        { id: 'd3', kind: 'autobiography', title: 'Auto' },
      ]
      const result = filterCategoryDocuments(docs)
      expect(result).toHaveLength(2)
      expect(result.map(d => d.id)).toEqual(['d1', 'd2'])
    })

    it('should handle empty array', () => {
      const result = filterCategoryDocuments([])
      expect(result).toEqual([])
    })
  })
})
