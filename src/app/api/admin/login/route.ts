import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { signSessionToken, ADMIN_SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from '@/server/auth'
import { clearAttempts, getClientKey, isRateLimited, recordFailedAttempt } from '@/server/rateLimit'

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
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
  return response
}
