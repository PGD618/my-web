import type { LLMAdapter, Message } from '../types'

interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface DeepSeekStreamChunk {
  choices: Array<{
    delta: {
      content?: string
    }
    finish_reason: string | null
  }>
}

export class DeepSeekAdapter implements LLMAdapter {
  private apiKey: string
  private baseURL: string
  private model: string

  constructor(apiKey: string, model = 'deepseek-chat') {
    this.apiKey = apiKey
    this.baseURL = 'https://api.deepseek.com/v1'
    this.model = model
  }

  async *chat(
    messages: Message[],
    context: string
  ): AsyncIterableIterator<string> {
    // 构建系统提示词
    const systemPrompt = this.buildSystemPrompt(context)

    // 转换消息格式
    const deepseekMessages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role as 'system' | 'user' | 'assistant',
        content: msg.content,
      })),
    ]

    // 调用 DeepSeek API
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: deepseekMessages,
        stream: true,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`)
    }

    // 解析 SSE 流
    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('Failed to get response reader')
    }

    const decoder = new TextDecoder()
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()
            if (data === '[DONE]') continue

            try {
              const parsed: DeepSeekStreamChunk = JSON.parse(data)
              const content = parsed.choices[0]?.delta?.content
              if (content) {
                yield content
              }
            } catch (e) {
              console.error('Failed to parse SSE chunk:', e)
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }

  private buildSystemPrompt(context: string): string {
    return `你是一个专门了解我（网站主人）的 AI 助手。你的任务是基于我的笔记和写作内容回答用户的问题。

## 关于我的信息
${context}

## 回答要求
1. 基于上述信息回答问题，不要编造我没有说过的内容
2. 如果信息不足，诚实地说"我在笔记中没有找到相关信息"
3. 保持友好、自然的对话风格
4. 可以适当引用笔记中的原文
5. 用中文回答`
  }
}
