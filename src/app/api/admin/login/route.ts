import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { signSessionToken, ADMIN_SESSION_COOKIE } from '@/lib/auth'
import { clearAttempts, getClientKey, isRateLimited, recordFailedAttempt } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  const clientKey = getClientKey(req)

  if (isRateLimited(clientKey)) {
    return NextResponse.json(
      { error: 'Too many attempts, please try again later' },
      { status: 429 }
    )
  }

  const { password } = (await req.json()) as { password?: string }

  if (!password) {
    recordFailedAttempt(clientKey)
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const passwordHash = process.env.ADMIN_PASSWORD_HASH
  if (!passwordHash) {
    throw new Error('Missing ADMIN_PASSWORD_HASH environment variable')
  }

  const matches = await bcrypt.compare(password, passwordHash)
  if (!matches) {
    recordFailedAttempt(clientKey)
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  clearAttempts(clientKey)

  const token = await signSessionToken()

  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  })
  return response
}
