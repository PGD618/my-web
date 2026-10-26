import { NextRequest } from 'next/server'
import { proxyToAgent } from '@/lib/adminProxy'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const text = await req.text()
  const body = text ? JSON.parse(text) : undefined
  return proxyToAgent(req, `/admin/semantic-merge-proposals/${id}/approve`, { method: 'POST', body })
}
