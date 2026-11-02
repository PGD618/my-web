'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

type Router = ReturnType<typeof useRouter>

export type AdminFetchResult =
  | { kind: 'ok'; json: unknown }
  | { kind: 'auth' }
  | { kind: 'http'; status: number }

/**
 * 后台 GET 请求的统一入口：session 过期（401/403）直接跳登录页，其他非 2xx 交给调用方显示错误。
 * 网络错误会直接抛出，由调用方 catch。
 */
export async function fetchAdminJson(url: string, router: Router): Promise<AdminFetchResult> {
  const res = await fetch(url)
  if (res.status === 401 || res.status === 403) {
    router.push('/admin/login')
    return { kind: 'auth' }
  }
  if (!res.ok) {
    return { kind: 'http', status: res.status }
  }
  return { kind: 'ok', json: await res.json() }
}

export interface AdminResourceOptions {
  /** 非 2xx 时的错误文案，默认「加载失败（状态码）」 */
  errorMessage?: (status: number) => string
  /** 网络错误时的文案，默认「加载失败」 */
  networkErrorMessage?: string
}

/**
 * 加载一个后台接口。select 把响应 JSON 转成页面要的数据；可以是内联函数，不会引起重复请求。
 * 返回的 setData 用于操作成功后在本地更新列表，省一次重新请求。
 */
export function useAdminResource<T>(
  url: string,
  select: (json: any) => T, // eslint-disable-line @typescript-eslint/no-explicit-any
  options: AdminResourceOptions = {}
) {
  const router = useRouter()
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // select/options 每次渲染都可能是新函数，放进 ref，避免 reload 因此变化而反复请求
  const configRef = useRef({ select, options })
  useEffect(() => {
    configRef.current = { select, options }
  })

  const reload = useCallback(async () => {
    const { select, options } = configRef.current
    setLoading(true)
    setError(null)
    try {
      const result = await fetchAdminJson(url, router)
      if (result.kind === 'ok') {
        setData(select(result.json))
      } else if (result.kind === 'http') {
        setError(options.errorMessage?.(result.status) ?? `加载失败（${result.status}）`)
      }
    } catch {
      setError(options.networkErrorMessage ?? '加载失败')
    } finally {
      setLoading(false)
    }
  }, [url, router])

  useEffect(() => {
    reload()
  }, [reload])

  return { data, setData, loading, error, reload }
}

export interface MutationHandlers {
  /** 成功后的处理；返回字符串表示业务上失败，作为该条的错误显示 */
  onSuccess?: (res: Response) => void | string | Promise<void | string>
  /** 非 2xx 时生成错误文案，默认「操作失败（状态码）」 */
  onError?: (res: Response) => string | Promise<string>
  /** 网络错误时的文案，默认「操作失败，请重试」 */
  networkError?: string
  /** 错误记在哪个键下，默认就是 id；页面只有一处错误提示时可以传固定的键 */
  errorKey?: string
}

/**
 * 管理单条操作（确认、删除、重建等）的进行中状态和错误。
 * processingId 是当前正在处理的那一条，errors 按键记录每条的错误。
 */
export function useAdminMutation() {
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const setError = useCallback((key: string, message: string | null) => {
    setErrors(prev => {
      const next = { ...prev }
      if (message) next[key] = message
      else delete next[key]
      return next
    })
  }, [])

  async function run(id: string, request: () => Promise<Response>, handlers: MutationHandlers = {}): Promise<boolean> {
    const key = handlers.errorKey ?? id
    setProcessingId(id)
    setError(key, null)
    try {
      const res = await request()
      if (!res.ok) {
        setError(key, handlers.onError ? await handlers.onError(res) : `操作失败（${res.status}）`)
        return false
      }
      const failure = await handlers.onSuccess?.(res)
      if (typeof failure === 'string') {
        setError(key, failure)
        return false
      }
      return true
    } catch {
      setError(key, handlers.networkError ?? '操作失败，请重试')
      return false
    } finally {
      setProcessingId(null)
    }
  }

  return { processingId, errors, setError, run }
}
