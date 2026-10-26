import { NextRequest } from 'next/server'
import { proxyToAgent } from '@/lib/adminProxy'

export async function POST(req: NextRequest) {
  return proxyToAgent(req, '/admin/semantic-merge/run', { method: 'POST' })
}
