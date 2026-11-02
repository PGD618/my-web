import { NextRequest, NextResponse } from 'next/server'
import { proxyToAgent } from '@/server/adminProxy'
import { matchAdminRoute } from '@/features/admin/adminRoutes'

// 所有 /api/admin/* 代理共用这一个入口，允许的路径和方法见 lib/adminRoutes.ts。
// login、logout 是静态路由，优先级高于这里的 catch-all，不经过白名单。

type Context = { params: Promise<{ path: string[] }> }

async function handle(req: NextRequest, { params }: Context) {
  const { path } = await params
  const match = matchAdminRoute(req.method, path)
  if (!match) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const body = match.route.forwardBody ? await req.text() : undefined
  return proxyToAgent(req, match.agentPath, { method: req.method, body })
}

export const GET = handle
export const POST = handle
export const PUT = handle
export const PATCH = handle
export const DELETE = handle
