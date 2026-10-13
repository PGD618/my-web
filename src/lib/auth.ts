import { NextRequest } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'

const COOKIE_NAME = 'admin_session'
const SESSION_DURATION = '7d'

function getSecretKey() {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('Missing JWT_SECRET environment variable')
  }
  return new TextEncoder().encode(secret)
}

export async function signSessionToken(): Promise<string> {
  return new SignJWT({ role: 'owner' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getSecretKey())
}

export async function getRole(request: NextRequest): Promise<'owner' | 'guest'> {
  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token) {
    return 'guest'
  }

  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    return payload.role === 'owner' ? 'owner' : 'guest'
  } catch {
    return 'guest'
  }
}

export const ADMIN_SESSION_COOKIE = COOKIE_NAME
