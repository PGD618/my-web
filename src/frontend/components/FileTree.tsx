'use client'
import Link from 'next/link'
import { useState } from 'react'
import { FiChevronRight, FiFolder, FiFileText } from 'react-icons/fi'
import { usePathname } from 'next/navigation'

function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 rounded-md bg-zinc-800/95 border border-zinc-700/60 backdrop-blur-lg text-[11px] text-zinc-300 whitespace-nowrap z-50 pointer-events-none shadow-lg animate-in fade-in slide-in-from-left-1 duration-150">
          {label}
          <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-3 border-y-transparent border-r-3 border-r-zinc-800/95" />
        </div>
      )}
    </div>
  )
}

function TreeNode({ node, level }: { node: any; level: number }) {
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()
  const isActive = pathname === `/writing/${node.slug}`
  const displayName = node.name

  if (node.isFolder) {
    return (
      <div className="mt-0.5">
        <Tooltip label={node.name}>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-all duration-300 group
                       text-zinc-500 hover:text-zinc-200 hover:bg-white/5 hover:translate-x-1"
          >
            <FiChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-90 text-blue-400' : 'text-zinc-600'}`} />
            <FiFolder className={`w-3.5 h-3.5 shrink-0 transition-colors ${isOpen ? 'text-blue-500/80' : 'text-zinc-500'}`} />
            <span className="text-[13px] font-medium truncate tracking-wide">{displayName}</span>
          </div>
        </Tooltip>

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
    <Tooltip label={node.slug}>
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
        <FiFileText className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-400' : 'opacity-50 group-hover:opacity-100'}`} />
        <span className="text-[13px] truncate tracking-wide">{displayName}</span>
        {isActive && (
          <div className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-blue-500 rounded-full" />
        )}
      </Link>
    </Tooltip>
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



