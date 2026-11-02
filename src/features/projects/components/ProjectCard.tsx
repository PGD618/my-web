import type { Project } from '@/data/projects'
import { ProjectBadge } from './ProjectBadge'
import { TagList } from './TagList'
import { ExternalLinks } from './ExternalLinks'

// 三种卡片：实习（紫）、主打（绿）、其他作品网格（蓝，尺寸更小、没有徽章）。
// 类名保持完整字面量，Tailwind 才能扫描到。
const VARIANTS = {
  internship: {
    card: 'group relative overflow-hidden rounded-4xl bg-zinc-900/40 border border-violet-500/15 backdrop-blur-sm transition-all duration-500 hover:bg-zinc-900/70 hover:border-violet-500/30 hover:-translate-y-1 cursor-pointer',
    bar: 'h-2 w-full bg-linear-to-r opacity-80',
    body: 'p-7 md:p-9 space-y-6',
    showBadge: true,
    title: 'text-white font-bold text-2xl tracking-wide group-hover:text-violet-400 transition-colors',
    subtitle: 'text-zinc-500 text-xs font-mono mt-1 tracking-wide',
    description: 'text-zinc-300 text-sm leading-[1.9] max-w-2xl',
    linksRow: 'flex items-center gap-4 pt-1',
    link: 'inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 hover:text-violet-400 transition-colors uppercase tracking-wider',
  },
  featured: {
    card: 'group relative overflow-hidden rounded-4xl bg-zinc-900/40 border border-emerald-500/15 backdrop-blur-sm transition-all duration-500 hover:bg-zinc-900/70 hover:border-emerald-500/30 hover:-translate-y-1 cursor-pointer',
    bar: 'h-2 w-full bg-linear-to-r opacity-80',
    body: 'p-7 md:p-9 space-y-6',
    showBadge: true,
    title: 'text-white font-bold text-2xl tracking-wide group-hover:text-emerald-400 transition-colors',
    subtitle: 'text-zinc-500 text-xs font-mono mt-1 tracking-wide',
    description: 'text-zinc-300 text-sm leading-[1.9] max-w-2xl',
    linksRow: 'flex items-center gap-4 pt-1',
    link: 'inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 hover:text-emerald-400 transition-colors uppercase tracking-wider',
  },
  grid: {
    card: 'group relative overflow-hidden rounded-[28px] bg-zinc-900/30 border border-white/5 backdrop-blur-sm transition-all duration-500 hover:bg-zinc-900/60 hover:border-white/10 hover:-translate-y-1 cursor-pointer',
    bar: 'h-1.5 w-full bg-linear-to-r opacity-60 group-hover:opacity-100 transition-opacity',
    body: 'p-6 md:p-7 space-y-5',
    showBadge: false,
    title: 'text-white font-bold text-lg tracking-wide group-hover:text-blue-400 transition-colors',
    subtitle: 'text-zinc-500 text-xs font-mono mt-0.5 tracking-wide',
    description: 'text-zinc-400 text-sm leading-relaxed',
    linksRow: 'flex items-center gap-3 pt-1',
    link: 'inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-500 hover:text-blue-400 transition-colors uppercase tracking-wider',
  },
} as const

export function ProjectCard({
  project,
  variant,
  onClick,
}: {
  project: Project
  variant: keyof typeof VARIANTS
  onClick: () => void
}) {
  const v = VARIANTS[variant]
  const Title = variant === 'grid' ? 'h3' : 'h2'

  return (
    <div onClick={onClick} className={v.card}>
      <div className={`${v.bar} ${project.gradient}`} />
      <div className={v.body}>
        {v.showBadge && (
          <div className="flex items-center gap-3 mb-1">
            <ProjectBadge project={project} />
          </div>
        )}
        <div className="flex items-start justify-between">
          <div>
            <Title className={v.title}>{project.title}</Title>
            <p className={v.subtitle}>{project.subtitle}</p>
          </div>
          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest shrink-0 mt-1">
            {project.year}
          </span>
        </div>
        <p className={v.description}>{project.description}</p>
        <TagList tags={project.tags} />
        <ExternalLinks
          links={project.links}
          rowClassName={v.linksRow}
          linkClassName={v.link}
          arrow="on-hover"
          stopPropagation
          newTabOnlyForHttp={variant === 'grid'}
        />
      </div>
    </div>
  )
}
