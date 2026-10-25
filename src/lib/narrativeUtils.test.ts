import { describe, it, expect } from 'vitest'
import { formatNarrativeStats, mapResultToChineseLabel } from './narrativeUtils'

describe('narrativeUtils', () => {
  describe('formatNarrativeStats', () => {
    it('should format single kind with single result', () => {
      const stats = { narrative: { success: 3 } }
      expect(formatNarrativeStats(stats)).toBe('narrative 成功 3')
    })

    it('should format single kind with multiple results', () => {
      const stats = { narrative: { success: 3, missing_source: 1 } }
      expect(formatNarrativeStats(stats)).toBe('narrative 成功 3 · 缺少来源 1')
    })

    it('should format multiple kinds', () => {
      const stats = {
        narrative: { success: 3, missing_source: 1 },
        section: { success: 2, llm_error: 1 },
      }
      expect(formatNarrativeStats(stats)).toContain('narrative')
      expect(formatNarrativeStats(stats)).toContain('section')
      expect(formatNarrativeStats(stats)).toContain('成功')
      expect(formatNarrativeStats(stats)).toContain('缺少来源')
      expect(formatNarrativeStats(stats)).toContain('模型出错')
    })

    it('should handle empty stats', () => {
      expect(formatNarrativeStats({})).toBe('')
    })

    it('should fallback to English for unmapped results', () => {
      const stats = { narrative: { unknown_result: 5 } }
      expect(formatNarrativeStats(stats)).toBe('narrative unknown_result 5')
    })
  })

  describe('mapResultToChineseLabel', () => {
    it('should map success to 成功', () => {
      expect(mapResultToChineseLabel('success')).toBe('成功')
    })

    it('should map missing_source to 缺少来源', () => {
      expect(mapResultToChineseLabel('missing_source')).toBe('缺少来源')
    })

    it('should map llm_error to 模型出错', () => {
      expect(mapResultToChineseLabel('llm_error')).toBe('模型出错')
    })

    it('should return original value for unmapped results', () => {
      expect(mapResultToChineseLabel('unknown')).toBe('unknown')
    })
  })
})
