'use client'

import { StatusContent, STATUS_PRIMARY_BUTTON } from '@/frontend/components/StatusPage'

// global-error 会替换根 layout，必须自带 html/body
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="bg-zinc-950 text-zinc-200 h-full flex items-center justify-center antialiased">
        <StatusContent
          className="p-8"
          badge="Critical_Error"
          badgeTone="danger"
          heading="出错了"
          description="应用发生了严重错误，请尝试重新加载。"
          digest={error.digest}
          actions={
            <button onClick={reset} className={STATUS_PRIMARY_BUTTON}>
              重新加载
            </button>
          }
        />
      </body>
    </html>
  )
}
