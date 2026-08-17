import { NextRequest } from 'next/server'
import { LLMFactory } from '@/lib/ai/llm/factory'
import { createEmbeddingClient } from '@/lib/ai/vector/embedding'
import { createLanceDBClient } from '@/lib/ai/vector/lancedb'

export const runtime = 'edge'

interface ChatRequest {
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as ChatRequest

    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 获取最后一条用户消息作为查询
    const lastUserMessage = messages
      .slice()
      .reverse()
      .find(m => m.role === 'user')

    if (!lastUserMessage) {
      return new Response(
        JSON.stringify({ error: 'No user message found' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 1. 向量检索相关上下文
    const embeddingClient = createEmbeddingClient()
    const lanceDBClient = createLanceDBClient()

    const results = await lanceDBClient.searchByText(
      lastUserMessage.content,
      (text) => embeddingClient.embed(text),
      5 // 取top 5相关内容
    )

    // 2. 构建上下文
    const context = results
      .map(
        (result, idx) =>
          `[${idx + 1}] 标题: ${result.metadata.title}\n内容: ${result.content}\n`
      )
      .join('\n---\n\n')

    // 3. 调用 LLM 生成回复
    const llm = LLMFactory.createDefault()

    // 4. 流式返回
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of llm.chat(messages, context)) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`))
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Stream error:', error)
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
