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

async function resolveRole(token: string | undefined): Promise<'owner' | 'guest'> {
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

export async function getRole(request: NextRequest): Promise<'owner' | 'guest'> {
  return resolveRole(request.cookies.get(COOKIE_NAME)?.value)
}

/**
 * 给服务端组件用（没有 NextRequest，只能从 next/headers 的 cookies() 读）。
 * 复用同一套 JWT 验签逻辑，不重复实现。
 */
export async function getRoleFromCookies(
  cookieStore: Pick<Awaited<ReturnType<typeof import('next/headers').cookies>>, 'get'>
): Promise<'owner' | 'guest'> {
  return resolveRole(cookieStore.get(COOKIE_NAME)?.value)
}

export const ADMIN_SESSION_COOKIE = COOKIE_NAME
