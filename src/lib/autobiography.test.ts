import { describe, it, expect } from 'vitest'
import {
  cleanNarrativeText,
  isExperience,
  sortSections,
  generateStatsText,
  type NarrativeEntry,
  type NarrativeSection,
} from './autobiography'

describe('autobiography', () => {
  describe('cleanNarrativeText', () => {
    it('should remove entry markers', () => {
      const text = 'This [e:entry-1] is clean [e:entry-2].'
      expect(cleanNarrativeText(text)).toBe('This  is clean .')
    })

    it('should handle text without markers', () => {
      const text = 'No markers here.'
      expect(cleanNarrativeText(text)).toBe('No markers here.')
    })

    it('should remove markers with various id formats', () => {
      const text = 'Test [e:123] and [e:abc-def-123] and [e:entry_with_underscore].'
      expect(cleanNarrativeText(text)).toBe('Test  and  and .')
    })

    it('should handle consecutive markers', () => {
      expect(cleanNarrativeText('[e:entry-1][e:entry-2] text')).toBe(' text')
    })

    it('should handle empty string', () => {
      expect(cleanNarrativeText('')).toBe('')
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
})
