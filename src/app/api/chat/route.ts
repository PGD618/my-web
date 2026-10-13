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

    const agentURL = process.env.AI_AGENT_URL
    if (!agentURL) {
      throw new Error('Missing AI_AGENT_URL environment variable')
    }

    const serviceToken = process.env.SERVICE_TOKEN
    if (!serviceToken) {
      throw new Error('Missing SERVICE_TOKEN environment variable')
    }

    const role = await getRole(req)

    const agentResponse = await fetch(`${agentURL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Service-Token': serviceToken,
      },
      body: JSON.stringify({ message: lastUserMessage.content, role }),
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
