import { NextRequest } from 'next/server'
import { proxyToAgent } from '@/lib/adminProxy'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return proxyToAgent(req, `/admin/semantic-documents/${id}/rebuild-narrative`, { method: 'POST' })
}
