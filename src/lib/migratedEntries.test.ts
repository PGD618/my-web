import { describe, it, expect } from 'vitest'
import { groupByCategory, getDetailError, SemanticEntry } from './migratedEntries'

describe('migratedEntries', () => {
  describe('groupByCategory', () => {
    it('groups items by category', () => {
      const items: SemanticEntry[] = [
        { id: '1', text: 'entry1', category: 'tech', status: 'pending', created_at: '2024-01-01' },
        { id: '2', text: 'entry2', category: 'life', status: 'pending', created_at: '2024-01-01' },
        { id: '3', text: 'entry3', category: 'tech', status: 'pending', created_at: '2024-01-01' },
      ]

      const result = groupByCategory(items)

      expect(result).toEqual({
        tech: [items[0], items[2]],
        life: [items[1]],
      })
    })

    it('handles empty list', () => {
      const result = groupByCategory([])
      expect(result).toEqual({})
    })

    it('handles single category', () => {
      const items: SemanticEntry[] = [
        { id: '1', text: 'entry1', category: 'tech', status: 'pending', created_at: '2024-01-01' },
        { id: '2', text: 'entry2', category: 'tech', status: 'pending', created_at: '2024-01-01' },
      ]

      const result = groupByCategory(items)

      expect(result).toEqual({
        tech: items,
      })
    })
  })

  describe('getDetailError', () => {
    it('extracts error from detail object', () => {
      const detail = { error: 'Some error message', referenced_by: [] }
      expect(getDetailError(detail)).toBe('Some error message')
    })

    it('returns string detail as-is', () => {
      const detail = 'Entry not found or not in migrated_pending status'
      expect(getDetailError(detail)).toBe(detail)
    })

    it('returns null for missing error field', () => {
      const detail = { referenced_by: [] }
      expect(getDetailError(detail)).toBeNull()
    })

    it('returns null when detail is not an object', () => {
      expect(getDetailError(null)).toBeNull()
      expect(getDetailError(undefined)).toBeNull()
      expect(getDetailError(123)).toBeNull()
    })

    it('returns null when error is not a string', () => {
      const detail = { error: { nested: 'object' } }
      expect(getDetailError(detail)).toBeNull()
    })
  })
})
