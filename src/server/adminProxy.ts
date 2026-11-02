import { NextRequest, NextResponse } from 'next/server'
import { getRole } from '@/server/auth'
import { fetchAgent } from '@/server/agentClient'

/**
 * 转发到 agent 的 /admin/* 接口，先在这里（my-web 服务端）校验 owner，不通过直接拒绝，
 * 不转发到 agent——agent 侧的 /admin/* 只校验 X-Service-Token，不重复校验角色，
 * 所以这道门禁必须在这里挡住，不能依赖 agent 侧兜底。
 *
 * agent 返回的真实状态码（204/404/409 等）原样转发给前端，不要都压扁成 500——
 * 前端需要区分"没找到"和"服务器挂了"。只有这边自己出错（环境变量缺失、连不上 agent）才返回 500。
 */
export async function proxyToAgent(
  req: NextRequest,
  path: string,
  init?: { method?: string; body?: string }
): Promise<NextResponse> {
  const role = await getRole(req)
  if (role !== 'owner') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const agentResponse = await fetchAgent(path, {
      method: init?.method,
      body: init?.body,
      search: req.nextUrl.search,
    })
    const { status } = agentResponse

    // 204/205/304 不允许带 body
    if (status === 204 || status === 205 || status === 304) {
      return new NextResponse(null, { status })
    }

    const contentType = agentResponse.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) {
      const data = await agentResponse.json()
      return NextResponse.json(data, { status })
    }

    // 非 JSON（例如反向代理返回的 HTML 错误页）：保留真实状态码，
    // 出错时包成 JSON 方便前端统一读 error 字段，成功时原样透传文本
    const text = await agentResponse.text()
    if (!agentResponse.ok) {
      return NextResponse.json({ error: text.slice(0, 500) || agentResponse.statusText }, { status })
    }
    return new NextResponse(text, { status, headers: { 'Content-Type': contentType || 'text/plain' } })
  } catch (error) {
    console.error('Admin proxy error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
