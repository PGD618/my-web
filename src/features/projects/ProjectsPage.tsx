'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { staggerContainer, fadeUpItem } from '@/shared/motion/motion'
import { PageGlow } from '@/shared/ui/PageGlow'
import { FiCode, FiLayers, FiBriefcase } from 'react-icons/fi'
import { projects, type Project } from '@/data/projects'
import { ProjectCard } from '@/features/projects/components/ProjectCard'
import { ProjectDetailSheet } from '@/features/projects/components/ProjectDetailSheet'

const containerVariants = staggerContainer({ stagger: 0.08, delay: 0.15 })
const itemVariants = fadeUpItem({ offset: 24, duration: 0.6 })

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [open, setOpen] = useState(false)

  const handleCardClick = (project: Project) => {
    setSelectedProject(project)
    setOpen(true)
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) setSelectedProject(null)
  }

  return (
    <div className="relative h-full overflow-y-auto overflow-x-hidden bg-zinc-950 custom-scrollbar">
      <PageGlow variant="projects" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-250 mx-auto px-6 md:px-[5vw] py-[8vh] space-y-14"
      >
        {/* ═══ Header ═══ */}
        <motion.section variants={itemVariants} className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-400 uppercase tracking-[0.2em]">
            <FiLayers className="text-blue-400" />
            Projects · 作品
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.1]">
              我做过的<span className="text-zinc-500">东西</span>
            </h1>
            <p className="text-zinc-500 text-base mt-3 font-light tracking-wide max-w-xl">
              每个项目都是一次探索，记录着我从想法到实现的完整旅程。
              点击卡片了解更多。
            </p>
          </div>
        </motion.section>

        {/* ═══ 实习项目 ═══ */}
        <motion.section variants={itemVariants}>
          <div className="space-y-4 mb-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-600 flex items-center gap-2">
              <FiBriefcase /> 实习项目
            </h2>
          </div>
          <div className="space-y-4">
            {projects.filter(p => p.internship).map(p => (
              <ProjectCard key={p.title} project={p} variant="internship" onClick={() => handleCardClick(p)} />
            ))}
          </div>
        </motion.section>

        {/* ═══ 分隔线 ═══ */}
        <motion.div variants={itemVariants} className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800/60" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-zinc-950 px-4 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.3em]">
              Personal Projects
            </span>
          </div>
        </motion.div>

        {/* ═══ 主打项目 ═══ */}
        {projects.filter(p => p.featured).map(p => (
          <motion.section key={p.title} variants={itemVariants}>
            <ProjectCard project={p} variant="featured" onClick={() => handleCardClick(p)} />
          </motion.section>
        ))}

        {/* ═══ 其他项目卡片网格 ═══ */}
        <motion.section variants={itemVariants} className="space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-600 flex items-center gap-2">
            <FiCode /> 更多作品
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projects.filter(p => !p.featured && !p.internship).map(p => (
              <ProjectCard key={p.title} project={p} variant="grid" onClick={() => handleCardClick(p)} />
            ))}
          </div>
        </motion.section>

        {/* ═══ 底部提示 ═══ */}
        <motion.div variants={itemVariants} className="text-center pt-4">
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-zinc-900/20 border border-dashed border-zinc-800 text-xs text-zinc-600 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 animate-pulse" />
            More projects brewing · 持续更新中
          </div>
        </motion.div>
      </motion.div>

      <ProjectDetailSheet project={selectedProject} open={open} onOpenChange={handleOpenChange} />
    </div>
  )
}
