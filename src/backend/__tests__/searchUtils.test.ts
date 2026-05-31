import { describe, it, expect } from 'vitest'
import { getSnippet } from '../searchUtils'

describe('getSnippet', () => {
  it('undefined 输入返回 null', () => {
    expect(getSnippet(undefined)).toBeNull()
  })

  it('无 value 返回 null', () => {
    expect(getSnippet({ indices: [[0, 3]], value: undefined })).toBeNull()
  })

  it('无匹配索引返回 null', () => {
    expect(getSnippet({ indices: [], value: 'some text' })).toBeNull()
  })

  it('提取匹配位置附近的上下文', () => {
    const text = '这是一段很长的文本内容，其中包含搜索关键词，以及其他无关的内容。'
    const result = getSnippet({
      indices: [[13, 16]], // "搜索关键词"
      value: text,
    })

    expect(result).not.toBeNull()
    expect(result!.text).toContain('搜索关键词')
  })

  it('匹配在开头时不添加前缀省略号', () => {
    const result = getSnippet({
      indices: [[0, 3]],
      value: 'Hello world, this is a test',
    }, 5)

    expect(result).not.toBeNull()
    expect(result!.text).not.toMatch(/^\.\.\./)
    expect(result!.text).toContain('Hello')
  })

  it('匹配在末尾时不添加后缀省略号', () => {
    const text = 'short text'
    const result = getSnippet({
      indices: [[6, 9]],
      value: text,
    }, 40)

    expect(result).not.toBeNull()
    expect(result!.text).not.toMatch(/\.\.\.$/)
  })

  it('匹配在中间时添加两侧省略号', () => {
    const text = 'a'.repeat(50) + 'MATCH' + 'b'.repeat(50)
    const result = getSnippet({
      indices: [[50, 54]],
      value: text,
    }, 10)

    expect(result).not.toBeNull()
    expect(result!.text).toMatch(/^\.\.\./)
    expect(result!.text).toMatch(/\.\.\.$/)
    expect(result!.text).toContain('MATCH')
  })

  it('调整后的索引正确映射到片段文本', () => {
    const result = getSnippet({
      indices: [[10, 14]],
      value: '0123456789MATCH56789',
    }, 0)

    expect(result).not.toBeNull()
    const { text, indices } = result!
    // 验证索引对应的文本确实是匹配内容
    for (const [s, e] of indices) {
      const highlighted = text.slice(s, e + 1)
      expect(highlighted).toBe('MATCH')
    }
  })

  it('过滤掉范围外的匹配索引', () => {
    const text = 'first MATCH then some text and second MATCH here'
    const result = getSnippet({
      indices: [[6, 10], [39, 43]], // 两个匹配，第二个在上下文范围外
      value: text,
    }, 5)

    expect(result).not.toBeNull()
    // 只包含第一个匹配的索引
    expect(result!.indices).toHaveLength(1)
  })

  it('自定义 contextLen 生效', () => {
    const result1 = getSnippet({
      indices: [[20, 24]],
      value: 'x'.repeat(20) + 'MATCH' + 'x'.repeat(20),
    }, 5)

    const result2 = getSnippet({
      indices: [[20, 24]],
      value: 'x'.repeat(20) + 'MATCH' + 'x'.repeat(20),
    }, 15)

    expect(result1!.text.length).toBeLessThan(result2!.text.length)
  })
})
