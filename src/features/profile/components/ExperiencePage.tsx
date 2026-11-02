'use client'

import { motion } from 'framer-motion'
import { staggerContainer, fadeUpItem } from '@/shared/motion/motion'
import { PageGlow } from '@/shared/ui/PageGlow'
import { FiCalendar, FiMapPin } from 'react-icons/fi'
import { experiences, typeConfig } from '@/data/experiences'

const containerVariants = staggerContainer({ stagger: 0.1, delay: 0.15 })
const itemVariants = fadeUpItem({ offset: 24, duration: 0.6 })

export default function ExperiencePage() {
  return (
    <div className="relative h-full overflow-y-auto overflow-x-hidden bg-zinc-950 custom-scrollbar">
      <PageGlow variant="experience" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-225 mx-auto px-6 md:px-[5vw] py-[8vh] space-y-14"
      >
        {/* ═══ Header ═══ */}
        <motion.section variants={itemVariants} className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-400 uppercase tracking-[0.2em]">
            <FiCalendar className="text-blue-400" />
            Experience · 履历
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.1]">
              我的<span className="text-zinc-500">时间线</span>
            </h1>
            <p className="text-zinc-500 text-base mt-3 font-light tracking-wide max-w-xl">
              从校园到职场，每一步都是成长的印记。
              记录走过的路，也提醒自己继续向前。
            </p>
          </div>
        </motion.section>

        {/* ═══ Timeline ═══ */}
        <motion.section variants={itemVariants} className="relative">
          {/* 竖线 */}
          <div className="absolute left-4.5 md:left-5.5 top-0 bottom-0 w-px bg-zinc-800" />

          <div className="space-y-10">
            {experiences.map((exp, i) => {
              const cfg = typeConfig[exp.type]
              return (
                <div key={i} className="relative pl-12 md:pl-14">
                  {/* 时间线节点 */}
                  <div className={`absolute left-2.5 md:left-3.5 top-1.5 w-4.5 h-4.5 rounded-full bg-zinc-950 border-2 ${cfg.dotColor} z-10 flex items-center justify-center`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${cfg.lineColor}`} />
                  </div>

                  {/* 卡片 */}
                  <div className="group relative overflow-hidden rounded-3xl bg-zinc-900/30 border border-white/5 backdrop-blur-sm transition-all duration-500 hover:bg-zinc-900/60 hover:border-white/10 hover:-translate-y-0.5">
                    {/* 顶部类型色条 */}
                    <div className={`h-1 w-full bg-linear-to-r from-transparent via-current opacity-30 ${cfg.lineColor.replace('bg-', 'text-')}`} />

                    <div className="p-6 md:p-7 space-y-4">
                      {/* 时间 + 类型徽章 */}
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                          {exp.period}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-mono uppercase tracking-widest border ${cfg.dotColor} ${cfg.bgGlow} ${cfg.dotColor.replace('border-', 'text-')}`}>
                          {exp.type === 'work' ? '工作' : exp.type === 'education' ? '教育' : '社区'}
                        </span>
                      </div>

                      {/* 角色 + 组织 */}
                      <div>
                        <h3 className="text-white font-bold text-lg tracking-wide group-hover:text-blue-400 transition-colors">
                          {exp.role}
                        </h3>
                        <p className="text-zinc-400 text-sm mt-0.5 flex items-center gap-1.5">
                          <exp.icon className="w-3.5 h-3.5 text-zinc-600" />
                          {exp.org}
                          {exp.orgDesc && <span className="text-zinc-600 text-xs font-mono">· {exp.orgDesc}</span>}
                        </p>
                      </div>

                      {/* 描述 */}
                      <p className="text-zinc-400 text-sm leading-relaxed">
                        {exp.description}
                      </p>

                      {/* 亮点列表 */}
                      <ul className="space-y-1.5">
                        {exp.highlights.map((h, j) => (
                          <li key={j} className="flex items-start gap-2 text-zinc-500 text-xs">
                            <span className={`w-1 h-1 rounded-full ${cfg.lineColor} mt-1.5 shrink-0`} />
                            {h}
                          </li>
                        ))}
                      </ul>

                      {/* 标签 */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {exp.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-full bg-zinc-800/50 border border-zinc-800 text-[10px] font-mono text-zinc-400 tracking-wide"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.section>

        {/* ═══ Footer ═══ */}
        <motion.div variants={itemVariants} className="text-center pt-4">
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-zinc-900/20 border border-dashed border-zinc-800 text-xs text-zinc-600 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 animate-pulse" />
            To be continued · 未完待续
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

