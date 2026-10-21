import { NextRequest } from 'next/server'
import { getRole } from '@/lib/auth'

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

    const lastUserIndex = messages.map(m => m.role).lastIndexOf('user')

    if (lastUserIndex === -1) {
      return new Response(
        JSON.stringify({ error: 'No user message found' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const lastUserMessage = messages[lastUserIndex]
    // 最后一条 user 消息单独进 message 字段（检索 query 用它），之前的轮次
    // 原样转发给 agent 接到 LLM 调用的 messages 里，不再在这一层砍掉。
    const history = messages.slice(0, lastUserIndex)

    const agentURL = process.env.AI_AGENT_URL
    if (!agentURL) {
      throw new Error('Missing AI_AGENT_URL environment variable')
    }

    const serviceToken = process.env.AI_AGENT_SERVICE_TOKEN
    if (!serviceToken) {
      throw new Error('Missing AI_AGENT_SERVICE_TOKEN environment variable')
    }

    const role = await getRole(req)

    const agentResponse = await fetch(`${agentURL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Service-Token': serviceToken,
      },
      body: JSON.stringify({ message: lastUserMessage.content, role, history }),
    })

    if (!agentResponse.ok || !agentResponse.body) {
      throw new Error(`AI agent request failed: ${agentResponse.status} ${agentResponse.statusText}`)
    }

    return new Response(agentResponse.body, {
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
