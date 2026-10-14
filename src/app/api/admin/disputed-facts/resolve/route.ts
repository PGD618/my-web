import { NextRequest } from 'next/server'
import { proxyToAgent } from '@/lib/adminProxy'

export async function POST(req: NextRequest) {
  const body = await req.json()
  return proxyToAgent(req, '/admin/disputed-facts/resolve', { method: 'POST', body })
}
