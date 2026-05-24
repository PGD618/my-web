import { getAllNotes } from '@/backend/notes'
import { buildFileTree } from '@/backend/utils'
import { GlobalSearch } from '@/frontend/components/Search'
import { FileTree } from '@/frontend/components/FileTree'

export default function WritingLayoutView({ children }: { children: React.ReactNode }) {
  const notes = getAllNotes()
  const fileTree = buildFileTree(notes)

  return (
    <div className="h-full flex overflow-hidden">
      <aside className="w-[18vw] min-w-[260px] max-w-[320px] h-full border-r border-zinc-900 bg-black/10 flex flex-col shrink-0">
        <div className="p-6 pb-2">
          <GlobalSearch notes={notes} />
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-2">
          <FileTree tree={fileTree} />
        </div>
      </aside>

      <main className="flex-1 h-full overflow-y-auto bg-zinc-950 custom-scrollbar">
        {children}
      </main>
    </div>
  )
}
