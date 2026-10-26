import { describe, it, expect } from 'vitest'
import { removeEntryMarkers } from './narrativeUtils'

describe('narrativeUtils', () => {
  describe('removeEntryMarkers', () => {
    it('should remove single entry marker', () => {
      const text = 'This is [e:entry-1] a test.'
      expect(removeEntryMarkers(text)).toBe('This is  a test.')
    })

    it('should remove multiple entry markers', () => {
      const text = 'First [e:entry-1] and second [e:entry-2] markers.'
      expect(removeEntryMarkers(text)).toBe('First  and second  markers.')
    })

    it('should handle text with no markers', () => {
      const text = 'This text has no markers.'
      expect(removeEntryMarkers(text)).toBe('This text has no markers.')
    })

    it('should remove markers with various id formats', () => {
      const text = 'Test [e:123] and [e:abc-def-123] and [e:entry_with_underscore].'
      expect(removeEntryMarkers(text)).toBe('Test  and  and .')
    })

    it('should handle consecutive markers', () => {
      const text = '[e:entry-1][e:entry-2] text'
      expect(removeEntryMarkers(text)).toBe(' text')
    })

    it('should handle empty string', () => {
      expect(removeEntryMarkers('')).toBe('')
    })
  })
})
