'use client'

import { StatusPage, STATUS_PRIMARY_BUTTON } from '@/shared/ui/StatusPage'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <StatusPage
      badge="System_Error"
      badgeTone="danger"
      heading="出错了"
      description="页面渲染时发生了错误，请尝试重新加载。"
      digest={error.digest}
      actions={
        <button onClick={reset} className={STATUS_PRIMARY_BUTTON}>
          重新加载
        </button>
      }
    />
  )
}
