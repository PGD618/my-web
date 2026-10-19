'use client'

import { useEffect, useState } from 'react'
import { FiFileText } from 'react-icons/fi'
import { AdminPageShell } from '@/frontend/components/admin/AdminPageShell'
import { ReviewList } from '@/frontend/components/admin/ReviewList'

interface SemanticDocument {
  id: string
  category: string
  content: string
  append_count: number
  created_at: string
  updated_at: string
}

export function AdminSemanticDocumentsClient() {
  const [items, setItems] = useState<SemanticDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/semantic-documents')
      const data = await res.json()
      setItems(data.items ?? [])
    } catch {
      setError('加载失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <AdminPageShell icon={FiFileText} title="语义记忆文档" subtitle="Semantic Documents">
      {error && <p className="mb-4 text-xs font-light tracking-wide text-red-400">{error}</p>}
      {loading ? (
        <p className="text-xs font-light tracking-wide text-zinc-500">加载中…</p>
      ) : (
        <ReviewList
          items={items}
          emptyLabel="暂无记忆文档"
          renderItem={item => (
            <div className="rounded-[20px] border border-white/10 bg-zinc-950/60 p-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-400">{item.category}</p>
                <div className="mt-2 prose prose-invert prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-xs text-zinc-300">{item.content}</pre>
                </div>
                <p className="mt-3 text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-600">
                  追加 {item.append_count} 次 · {new Date(item.updated_at).toLocaleString('zh-CN')}
                </p>
              </div>
            </div>
          )}
        />
      )}
    </AdminPageShell>
  )
}
