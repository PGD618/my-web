import { FiCode, FiStar } from 'react-icons/fi'
import type { Project } from '@/data/projects'

export function ProjectBadge({ project }: { project: Project }) {
  if (project.internship) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-[9px] font-mono text-violet-400 uppercase tracking-widest">
        <FiCode className="w-2.5 h-2.5" />
        Internship
      </span>
    )
  }
  if (project.featured) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono text-emerald-400 uppercase tracking-widest">
        <FiStar className="w-2.5 h-2.5" />
        Featured
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-500/10 border border-zinc-500/20 text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
      <FiCode className="w-2.5 h-2.5" />
      Project
    </span>
  )
}
