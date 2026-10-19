import { NextRequest } from 'next/server'
import { proxyToAgent } from '@/lib/adminProxy'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params
  return proxyToAgent(req, `/admin/profile-cards/${key}`, { method: 'DELETE' })
}
