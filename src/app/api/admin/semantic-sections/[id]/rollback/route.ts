import { NextRequest } from 'next/server'
import { proxyToAgent } from '@/lib/adminProxy'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  return proxyToAgent(req, `/admin/semantic-sections/${id}/rollback`, { method: 'POST', body })
}
