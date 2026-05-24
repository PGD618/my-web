import { getAllNotes } from '@/backend/notes'
import { buildFileTree } from '@/backend/utils'
import { GlobalSearch } from '@/frontend/components/Search'
import { FileTree } from '@/frontend/components/FileTree'
import ResizableSplit from '@/frontend/components/ResizableSplit'

export default function WritingLayoutView({ children }: { children: React.ReactNode }) {
  const notes = getAllNotes()
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
            <FileTree tree={fileTree} />
          </div>
        </aside>
      }
      right={
        <main className="h-full overflow-y-auto bg-zinc-950 custom-scrollbar">
          {children}
        </main>
      }
    />
  )
}
