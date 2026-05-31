'use client'

import { useParams } from 'next/navigation'
import { getAllNotes } from '@/backend/notes'
import { buildFileTree, categorySlugToName } from '@/backend/utils'
import { GlobalSearch } from '@/frontend/components/Search'
import { FileTree } from '@/frontend/components/FileTree'
import ResizableSplit from '@/frontend/components/ResizableSplit'
import { PageTransition } from '@/frontend/components/PageTransition'

export default function WritingLayoutView({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const slug = params.slug as string[] | undefined

  // Portal 大厅页（/writing）：无侧边栏，全屏展示
  if (!slug) {
    return (
      <main className="h-full overflow-y-auto bg-zinc-950 custom-scrollbar">
        <PageTransition>{children}</PageTransition>
      </main>
    )
  }

  const firstSegment = slug[0]

  // 仅当第一段是已知分类 slug 时，才启用分类过滤
  const activeCategoryName = categorySlugToName(firstSegment)

  const allNotes = getAllNotes()
  const notes = activeCategoryName
    ? allNotes.filter(n => n.category === activeCategoryName)
    : allNotes
  const fileTree = buildFileTree(notes)

  return (
    <ResizableSplit
      defaultLeftPct={18}
      minLeftPct={12}
      maxLeftPct={32}
      left={
        <aside className="h-full border-r border-zinc-900 bg-black/10 flex flex-col">
          <div className="p-6 pb-2">
            <GlobalSearch notes={notes} />
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-2">
            <FileTree tree={fileTree} hideRoot={!!activeCategoryName} />
          </div>
        </aside>
      }
      right={
        <main className="h-full overflow-y-auto bg-zinc-950 custom-scrollbar">
          <PageTransition>{children}</PageTransition>
        </main>
      }
    />
  )
}
