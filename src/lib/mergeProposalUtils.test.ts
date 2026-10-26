import { describe, it, expect } from 'vitest'
import { parseCheckReport, processProposal, type MergeProposal } from '@/lib/mergeProposalUtils'

describe('mergeProposalUtils', () => {
  describe('parseCheckReport', () => {
    it('should return null when check_report is null', () => {
      expect(parseCheckReport(null)).toBeNull()
    })

    it('should parse valid JSON string', () => {
      const json = JSON.stringify({ passed: true, count: 5 })
      const result = parseCheckReport(json)
      expect(result).toEqual({ passed: true, count: 5 })
    })

    it('should handle invalid JSON gracefully', () => {
      const result = parseCheckReport('not valid json')
      expect(result).toHaveProperty('error')
      expect(result?.error).toContain('Invalid JSON')
    })

    it('should handle complex JSON structures', () => {
      const json = JSON.stringify({
        checks: [
          { name: 'consistency', passed: true },
          { name: 'coherence', passed: false, reason: 'too short' },
        ],
      })
      const result = parseCheckReport(json)
      const checks = result?.checks as Array<{ name: string; passed: boolean }> | undefined
      expect(checks).toHaveLength(2)
      expect(checks?.[1]?.passed).toBe(false)
    })
  })

  describe('processProposal', () => {
    const baseProposal: MergeProposal = {
      id: 'prop-1',
      relation: 'refine',
      source_entry_ids: ['entry-1', 'entry-2'],
      sources: [
        {
          id: 'entry-1',
          text: 'Source text 1',
          evidence: ['quote 1'],
        },
      ],
      proposed_text: 'Merged text',
      check_report: null,
      status: 'pending',
      created_at: '2025-01-01T00:00:00Z',
    }

    it('should convert refine proposal correctly', () => {
      const result = processProposal(baseProposal)
      expect(result.id).toBe('prop-1')
      expect(result.relation).toBe('refine')
      expect(result.proposedText).toBe('Merged text')
      expect(result.checkReport).toBeNull()
    })

    it('should convert evolved proposal without proposed_text', () => {
      const evolved: MergeProposal = {
        ...baseProposal,
        relation: 'evolved',
        proposed_text: undefined,
      }
      const result = processProposal(evolved)
      expect(result.relation).toBe('evolved')
      expect(result.proposedText).toBeUndefined()
    })

    it('should parse check_report in processed proposal', () => {
      const withReport: MergeProposal = {
        ...baseProposal,
        check_report: JSON.stringify({ passed: true, message: 'OK' }),
      }
      const result = processProposal(withReport)
      expect(result.checkReport).toEqual({ passed: true, message: 'OK' })
    })

    it('should handle missing optional fields', () => {
      const minimalProposal: MergeProposal = {
        id: 'prop-2',
        relation: 'refine',
        source_entry_ids: [],
        sources: [],
        check_report: null,
        status: 'pending',
        created_at: '2025-01-01T00:00:00Z',
      }
      const result = processProposal(minimalProposal)
      expect(result.proposedText).toBeUndefined()
      expect(result.resolvedAt).toBeUndefined()
    })

    it('should include resolvedAt when present', () => {
      const withResolved: MergeProposal = {
        ...baseProposal,
        status: 'approved',
        resolved_at: '2025-01-02T00:00:00Z',
      }
      const result = processProposal(withResolved)
      expect(result.resolvedAt).toBe('2025-01-02T00:00:00Z')
    })
  })
})
