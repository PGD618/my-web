import { describe, it, expect } from 'vitest'
import { getEntriesList, cleanNarrativeText, NarrativeData, type NarrativeEntry } from './semanticDocumentUtils'

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
            raw_text: 'Raw',
            entry_ids: [],
            locked: false,
            version: 1,
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
            raw_text: 'Raw',
            entry_ids: [],
            locked: false,
            version: 1,
            updated_at: '2026-01-01',
            referenced_entries: ['e1'],
          },
        ],
        unnarrated_entries: [entry],
      }
      const result = getEntriesList(data)
      expect(result).toHaveLength(1)
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
})
