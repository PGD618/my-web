'use client'
import Link from 'next/link'
import { useState } from 'react'
import { FiChevronRight, FiFolder, FiFileText } from 'react-icons/fi'
import { usePathname } from 'next/navigation'

function TreeNode({ node, level }: { node: any; level: number }) {
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()
  const isActive = pathname === `/writing/${node.slug}`

  if (node.isFolder) {
    return (
      <div className="mt-0.5">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-all duration-300 group
                     text-zinc-500 hover:text-zinc-200 hover:bg-white/5 hover:translate-x-1"
        >
          <FiChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-90 text-blue-400' : 'text-zinc-600'}`} />
          <FiFolder className={`w-3.5 h-3.5 transition-colors ${isOpen ? 'text-blue-500/80' : 'text-zinc-500'}`} />
          <span className="text-[13px] font-medium truncate tracking-wide">{node.name}</span>
        </div>

        {isOpen && (
          <div className="ml-3.5 pl-2 border-l border-white/3">
            {Object.values(node.children).map((child: any) => (
              <TreeNode key={child.name} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={`/writing/${node.slug}`}
      className={`
        flex items-center gap-2 py-1.5 px-3 my-0.5 rounded-md transition-all duration-300
        group relative overflow-hidden
        ${isActive
          ? 'bg-blue-500/10 text-blue-400 font-medium'
          : 'text-zinc-500 hover:text-zinc-100 hover:bg-white/5 hover:translate-x-1'
        }
      `}
    >
      <FiFileText className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'opacity-50 group-hover:opacity-100'}`} />
      <span className="text-[13px] truncate tracking-wide">{node.name}</span>
      {isActive && (
        <div className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-blue-500 rounded-full" />
      )}
    </Link>
  )
}

export function FileTree({ tree }: { tree: any }) {
  return (
    <div className="h-full overflow-y-auto py-4 px-2 scrollbar-hide">
      {Object.values(tree).map((node: any) => (
        <TreeNode key={node.name} node={node} level={0} />
      ))}
    </div>
  )
}
