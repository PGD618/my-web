import { NextRequest, NextResponse } from 'next/server'
import { getRole } from '@/lib/auth'

/**
 * 转发到 agent 的 /admin/* 接口，先在这里（my-web 服务端）校验 owner，不通过直接拒绝，
 * 不转发到 agent——agent 侧的 /admin/* 只校验 X-Service-Token，不重复校验角色，
 * 所以这道门禁必须在这里挡住，不能依赖 agent 侧兜底。
 *
 * agent 返回的真实状态码（404/409 等）原样转发给前端，不要都压扁成 500——
 * 前端需要区分"没找到"和"服务器挂了"。
 */
export async function proxyToAgent(
  req: NextRequest,
  path: string,
  init?: { method?: string; body?: unknown }
): Promise<NextResponse> {
  const role = await getRole(req)
  if (role !== 'owner') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const agentURL = process.env.AI_AGENT_URL
  if (!agentURL) {
    throw new Error('Missing AI_AGENT_URL environment variable')
  }

  const serviceToken = process.env.AI_AGENT_SERVICE_TOKEN
  if (!serviceToken) {
    throw new Error('Missing AI_AGENT_SERVICE_TOKEN environment variable')
  }

  try {
    const url = new URL(`${agentURL}${path}`)
    url.search = req.nextUrl.search

    const agentResponse = await fetch(url, {
      method: init?.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Service-Token': serviceToken,
      },
      body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
    })

    const data = await agentResponse.json()
    return NextResponse.json(data, { status: agentResponse.status })
  } catch (error) {
    console.error('Admin proxy error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
