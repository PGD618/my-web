import { describe, it, expect } from 'vitest'
import { ADMIN_ROUTES, matchAdminRoute } from './adminRoutes'

describe('matchAdminRoute', () => {
  it('白名单里的每一项都能匹配上', () => {
    for (const route of ADMIN_ROUTES) {
      const segments = route.pattern.split('/').map(p => (p === ':id' ? 'abc' : p))
      const result = matchAdminRoute(route.method, segments)
      expect(result?.route).toBe(route)
    }
  })

  it('静态路径映射到 /admin 下的同名路径', () => {
    expect(matchAdminRoute('GET', ['fact-categories'])?.agentPath).toBe('/admin/fact-categories')
    expect(matchAdminRoute('POST', ['autobiography', 'rebuild'])?.agentPath).toBe('/admin/autobiography/rebuild')
    expect(matchAdminRoute('GET', ['autobiography', 'rebuild', 'job1'])?.agentPath).toBe(
      '/admin/autobiography/rebuild/job1'
    )
  })

  it('带 id 的路径对 id 做 encodeURIComponent', () => {
    expect(matchAdminRoute('DELETE', ['profile-cards', 'a/b c'])?.agentPath).toBe('/admin/profile-cards/a%2Fb%20c')
    // Next 传进来的段如果已经是编码过的，也不会被二次编码
    expect(matchAdminRoute('DELETE', ['profile-cards', 'a%2Fb%20c'])?.agentPath).toBe('/admin/profile-cards/a%2Fb%20c')
    expect(matchAdminRoute('POST', ['pending-observations', 'x1', 'confirm'])?.agentPath).toBe(
      '/admin/pending-observations/x1/confirm'
    )
  })

  it('方法不对返回 null', () => {
    expect(matchAdminRoute('POST', ['fact-categories'])).toBeNull()
    expect(matchAdminRoute('GET', ['autobiography', 'rebuild'])).toBeNull()
    expect(matchAdminRoute('POST', ['autobiography', 'rebuild', 'job1'])).toBeNull()
    expect(matchAdminRoute('PUT', ['profile-cards', 'x'])).toBeNull()
  })

  it('不在名单里的路径返回 null', () => {
    expect(matchAdminRoute('GET', ['semantic-entries'])).toBeNull()
    expect(matchAdminRoute('GET', ['pending-observations', 'x'])).toBeNull()
    expect(matchAdminRoute('POST', ['pending-observations', 'x', 'delete'])).toBeNull()
    expect(matchAdminRoute('GET', [])).toBeNull()
  })

  it('id 段为空时不匹配', () => {
    expect(matchAdminRoute('DELETE', ['confirmed-facts', ''])).toBeNull()
  })
})
