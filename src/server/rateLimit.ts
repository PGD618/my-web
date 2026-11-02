const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 5

const attemptsByKey = new Map<string, number[]>()

/**
 * 进程内内存限速，单进程部署足够用——重启会清空计数，不接 Redis。
 * 只统计失败尝试，登录成功的请求不计入，避免拖累正常使用。
 */
export function isRateLimited(key: string): boolean {
  const now = Date.now()
  const attempts = (attemptsByKey.get(key) ?? []).filter(t => now - t < WINDOW_MS)
  attemptsByKey.set(key, attempts)
  return attempts.length >= MAX_ATTEMPTS
}

export function recordFailedAttempt(key: string): void {
  const now = Date.now()
  const attempts = (attemptsByKey.get(key) ?? []).filter(t => now - t < WINDOW_MS)
  attempts.push(now)
  attemptsByKey.set(key, attempts)
}

export function clearAttempts(key: string): void {
  attemptsByKey.delete(key)
}

export function getClientKey(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  return 'unknown'
}
