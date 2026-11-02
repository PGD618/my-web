// /api/admin/[...path] 允许转发的路径白名单。只放 agent（my-web-agent/src/agent/api/admin.py）
// 现在实际存在、且这边要用到的接口；不在名单里的请求一律 404，不转发。
// `:id` 匹配单个路径段，转发时会重新 encodeURIComponent。

export interface AdminRoute {
  method: 'GET' | 'POST' | 'DELETE'
  pattern: string
  /** 是否把请求体原样转发给 agent */
  forwardBody?: boolean
}

export const ADMIN_ROUTES: readonly AdminRoute[] = [
  { method: 'GET', pattern: 'pending-observations' },
  { method: 'POST', pattern: 'pending-observations/:id/confirm' },
  { method: 'POST', pattern: 'pending-observations/:id/reject' },
  { method: 'GET', pattern: 'disputed-facts' },
  { method: 'POST', pattern: 'disputed-facts/resolve', forwardBody: true },
  // 前端暂时没有调用，但 agent 侧接口仍在（支持 ?status=），保留转发
  { method: 'GET', pattern: 'confirmed-facts' },
  { method: 'DELETE', pattern: 'confirmed-facts/:id' },
  { method: 'GET', pattern: 'fact-categories' },
  { method: 'GET', pattern: 'profile-cards' },
  { method: 'DELETE', pattern: 'profile-cards/:id' },
  { method: 'GET', pattern: 'autobiography' },
  { method: 'POST', pattern: 'autobiography/rebuild' },
]

function safeDecode(segment: string): string {
  try {
    return decodeURIComponent(segment)
  } catch {
    return segment
  }
}

/**
 * 在白名单里查找匹配的路由。匹配成功返回 agent 侧路径（`/admin/...`，每段都已
 * encodeURIComponent）和对应的路由项；不匹配返回 null。
 */
export function matchAdminRoute(
  method: string,
  segments: string[]
): { route: AdminRoute; agentPath: string } | null {
  const decoded = segments.map(safeDecode)

  for (const route of ADMIN_ROUTES) {
    if (route.method !== method) continue
    const parts = route.pattern.split('/')
    if (parts.length !== decoded.length) continue

    const ok = parts.every((part, i) =>
      part === ':id' ? decoded[i].length > 0 : part === decoded[i]
    )
    if (ok) {
      return {
        route,
        agentPath: '/admin/' + decoded.map(s => encodeURIComponent(s)).join('/'),
      }
    }
  }
  return null
}
