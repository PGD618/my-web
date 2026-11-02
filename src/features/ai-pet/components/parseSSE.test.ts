import { describe, expect, it } from 'vitest'
import { createSSEParser } from './parseSSE'

const encode = (s: string) => new TextEncoder().encode(s)

describe('createSSEParser', () => {
  it('中文字符的字节被切在两个 chunk 之间时不乱码', () => {
    const bytes = encode('data: {"type":"content","content":"你好"}\n')
    // "你" 占 3 个字节，从它中间切开
    const cut = bytes.indexOf(0xe4) + 1
    const parser = createSSEParser()

    const first = parser.push(bytes.slice(0, cut))
    const second = parser.push(bytes.slice(cut))

    expect(first).toEqual([])
    expect(second).toEqual(['{"type":"content","content":"你好"}'])
    expect(JSON.parse(second[0]).content).toBe('你好')
  })

  it('一行被切在两个 chunk 之间时拼接后再返回', () => {
    const parser = createSSEParser()

    const first = parser.push(encode('data: {"type":"intent_start"}\ndata: {"type":"con'))
    const second = parser.push(encode('tent","content":"abc"}\ndata: [DONE]\n'))

    expect(first).toEqual(['{"type":"intent_start"}'])
    expect(second).toEqual(['{"type":"content","content":"abc"}'])
  })

  it('流结束时 flush 出没有换行结尾的最后一行', () => {
    const parser = createSSEParser()

    expect(parser.push(encode('data: {"content":"末行"}'))).toEqual([])
    expect(parser.flush()).toEqual(['{"content":"末行"}'])
  })
})
