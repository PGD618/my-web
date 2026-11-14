import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { fetchAgent } from './agentClient'

describe('fetchAgent', () => {
  beforeEach(() => {
    vi.stubEnv('AI_AGENT_URL', 'http://agent.test')
    vi.stubEnv('AI_AGENT_SERVICE_TOKEN', 'token-value')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('不传 timeoutMs 时不设置 signal（聊天流式接口保持原行为）', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('ok'))
    vi.stubGlobal('fetch', fetchMock)

    await fetchAgent('/chat', { method: 'POST', body: '{}' })

    const init = fetchMock.mock.calls[0][1] as RequestInit
    expect(init.signal).toBeUndefined()
  })

  it('传 timeoutMs 时带上 AbortSignal，超时后请求被中止', async () => {
    const fetchMock = vi.fn((_url: URL | string, init?: RequestInit) => {
      return new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'TimeoutError')))
      })
    })
    vi.stubGlobal('fetch', fetchMock)

    const pending = fetchAgent('/admin/autobiography', { timeoutMs: 20 })
    await expect(pending).rejects.toMatchObject({ name: 'TimeoutError' })
    const init = fetchMock.mock.calls[0][1] as RequestInit
    expect(init.signal?.aborted).toBe(true)
  })

  it('请求头只带 Content-Type 和 X-Service-Token', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('ok'))
    vi.stubGlobal('fetch', fetchMock)

    await fetchAgent('/admin/autobiography')

    const init = fetchMock.mock.calls[0][1] as RequestInit
    expect(init.headers).toEqual({
      'Content-Type': 'application/json',
      'X-Service-Token': 'token-value',
    })
  })
})
