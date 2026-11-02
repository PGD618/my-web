/**
 * SSE 流的增量解析：把 reader.read() 读到的字节块转成一条条 `data:` 负载。
 *
 * 两个容易踩的坑都在这里处理：
 * - 中文等多字节字符可能被切在两个 chunk 之间，TextDecoder 必须用 stream 模式，
 *   流结束时再 flush 一次；
 * - 一行 `data: {...}` 也可能被切在两个 chunk 之间，最后一个不完整的行要留在
 *   缓冲区里，等下一个 chunk 拼起来再解析。
 */
export interface SSEParser {
  /** 喂入一个字节块，返回其中已经完整的 data 负载（不含 `[DONE]`） */
  push(chunk: Uint8Array): string[]
  /** 流结束时调用，吐出缓冲区里剩下的最后一行 */
  flush(): string[]
}

function extractData(lines: string[]): string[] {
  const result: string[] = []
  for (const raw of lines) {
    const line = raw.endsWith('\r') ? raw.slice(0, -1) : raw
    if (!line.startsWith('data: ')) continue
    const data = line.slice(6)
    if (data === '[DONE]') continue
    result.push(data)
  }
  return result
}

export function createSSEParser(): SSEParser {
  const decoder = new TextDecoder()
  let buffer = ''

  return {
    push(chunk) {
      buffer += decoder.decode(chunk, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''
      return extractData(lines)
    },
    flush() {
      buffer += decoder.decode()
      const rest = buffer
      buffer = ''
      return rest ? extractData([rest]) : []
    },
  }
}
