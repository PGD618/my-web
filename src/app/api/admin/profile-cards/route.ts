import { NextResponse } from 'next/server'
import { getRole } from '@/lib/auth'
import { proxyToAgent } from '@/lib/adminProxy'

export async function GET(request: Request) {
  const role = await getRole()
  if (role !== 'owner') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return proxyToAgent(request, '/admin/profile-cards')
}
