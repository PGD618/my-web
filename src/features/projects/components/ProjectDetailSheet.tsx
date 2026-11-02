import * as DialogPrimitive from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { FiX, FiArrowUpRight } from 'react-icons/fi'
import type { Project } from '@/data/projects'
import { ProjectBadge } from './ProjectBadge'
import { TagList } from './TagList'

export function ProjectDetailSheet({
  project,
  open,
  onOpenChange,
}: {
  project: Project | null
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  if (!project) return null

  const d = project.detail
  const hasDetail = d && (d.background || d.role || d.highlights?.length || d.learnings)

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="sheet-overlay fixed inset-0 z-100 bg-black/60 backdrop-blur-sm" />

        <DialogPrimitive.Content className="sheet-content fixed right-0 top-0 z-101 h-full w-[90%] md:w-[65%] lg:w-[60%] max-w-200 bg-zinc-950 border-l border-white/10 outline-none">
          <VisuallyHidden>
            <DialogPrimitive.Title>{project.title} 详情</DialogPrimitive.Title>
            <DialogPrimitive.Description>{project.subtitle}</DialogPrimitive.Description>
          </VisuallyHidden>

          <div className="h-full overflow-y-auto custom-scrollbar">
            {/* 关闭按钮 */}
            <div className="sticky top-0 z-10 flex justify-end p-4 md:p-6 bg-zinc-950/80 backdrop-blur-md">
              <DialogPrimitive.Close asChild>
                <button className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
                  <FiX className="w-4 h-4" />
                </button>
              </DialogPrimitive.Close>
            </div>

            <div className="px-6 md:px-10 pb-12 md:pb-16 space-y-8 -mt-4">
              {/* 色条 + 标题 */}
              <div className="space-y-4">
                <div className={`h-1.5 w-16 rounded-full bg-linear-to-r ${project.gradient}`} />
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{project.title}</h2>
                  <p className="text-zinc-500 text-sm font-mono mt-1 tracking-wide">{project.subtitle}</p>
                </div>
                <div className="flex items-center gap-3">
                  <ProjectBadge project={project} />
                  <span className="text-[11px] font-mono text-zinc-600 uppercase tracking-widest">{project.year}</span>
                </div>
              </div>

              {/* 项目背景 */}
              {d?.background && (
                <div className="space-y-3">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500 flex items-center gap-2">
                    <span className="w-4 h-px bg-zinc-700" />
                    项目背景
                  </h3>
                  <p className="text-zinc-300 text-sm leading-[1.9]">{d.background}</p>
                </div>
              )}

              {/* 我的角色 */}
              {d?.role && (
                <div className="space-y-3">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500 flex items-center gap-2">
                    <span className="w-4 h-px bg-zinc-700" />
                    我的角色
                  </h3>
                  <p className="text-zinc-300 text-sm leading-[1.9]">{d.role}</p>
                </div>
              )}

              {/* 技术亮点 */}
              {d?.highlights && d.highlights.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500 flex items-center gap-2">
                    <span className="w-4 h-px bg-zinc-700" />
                    技术亮点
                  </h3>
                  <ul className="space-y-2.5">
                    {d.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-zinc-300 text-sm leading-[1.8]">
                        <span className="mt-2 w-1 h-1 rounded-full bg-zinc-600 shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 技术栈 */}
              <div className="space-y-3">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500 flex items-center gap-2">
                  <span className="w-4 h-px bg-zinc-700" />
                  技术栈
                </h3>
                <TagList tags={project.tags} size="md" />
              </div>

              {/* 收获与反思 */}
              {d?.learnings && (
                <div className="space-y-3">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500 flex items-center gap-2">
                    <span className="w-4 h-px bg-zinc-700" />
                    收获与反思
                  </h3>
                  <p className="text-zinc-300 text-sm leading-[1.9]">{d.learnings}</p>
                </div>
              )}

              {/* 如果没有 detail 数据，展示卡片已有信息作为兜底 */}
              {!hasDetail && (
                <div className="space-y-3">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500 flex items-center gap-2">
                    <span className="w-4 h-px bg-zinc-700" />
                    简介
                  </h3>
                  <p className="text-zinc-300 text-sm leading-[1.9]">{project.description}</p>
                </div>
              )}

              {/* 链接 */}
              <div className="space-y-3">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500 flex items-center gap-2">
                  <span className="w-4 h-px bg-zinc-700" />
                  链接
                </h3>
                <div className="flex items-center gap-4">
                  {project.links.map(link => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[12px] font-mono text-zinc-400 hover:text-white transition-colors uppercase tracking-wider"
                    >
                      {link.icon && <link.icon className="w-3.5 h-3.5" />}
                      {link.label}
                      <FiArrowUpRight className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
