import { NextRequest } from 'next/server'
import { proxyToAgent } from '@/lib/adminProxy'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') ?? 'pending'
  return proxyToAgent(req, `/admin/semantic-merge-proposals?status=${status}`)
}
