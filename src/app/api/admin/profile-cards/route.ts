import { NextRequest } from 'next/server'
import { proxyToAgent } from '@/lib/adminProxy'

export async function GET(req: NextRequest) {
  return proxyToAgent(req, '/admin/profile-cards')
}
