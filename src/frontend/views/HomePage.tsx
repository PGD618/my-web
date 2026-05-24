'use client'

import { motion, Variants } from 'framer-motion'
import { FiZap, FiArrowRight, FiCode } from 'react-icons/fi'
import { SiGithub, SiGmail } from 'react-icons/si'
import Link from 'next/link'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.23, 1, 0.32, 1],
    },
  },
}

export default function HomePage() {
  return (
    <div className="relative h-full overflow-y-auto overflow-x-hidden bg-zinc-950 px-6 md:px-[5vw] py-[8vh] custom-scrollbar">
      <div className="pointer-events-none absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-blue-500/10 blur-[120px] z-0" />
      <div className="pointer-events-none absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-purple-500/10 blur-[120px] z-0" />
      <div
        className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none z-0"
        style={{ backgroundRepeat: 'repeat' }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-[1200px] mx-auto space-y-[6vh]"
      >
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 group relative overflow-hidden rounded-[40px] bg-zinc-900/40 border border-white/5 p-[4vw] backdrop-blur-md transition-all hover:border-white/10 hover:bg-zinc-900/60"
          >
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-400 uppercase tracking-[0.2em]">
                <FiZap className="text-blue-400" /> 全栈开发 & 终身学习
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5vw] font-bold tracking-tight text-white leading-[1.1] wrap-break-words">
                大二程序员 / <br />
                <span className="text-zinc-600 font-medium">独立开发者 & 思考者</span>
              </h1>

              <p className="text-zinc-400 text-lg font-light max-w-lg leading-relaxed tracking-wide">
                专注于构建具有美感的全栈应用。这里是我的数字花园，记录技术、思考与成长的碎片。
              </p>

              <div className="flex gap-6 items-center pt-4">
                <SiGithub className="w-6 h-6 text-zinc-500 hover:text-white transition-colors cursor-pointer" />
                <SiGmail className="w-6 h-6 text-zinc-500 hover:text-white transition-colors cursor-pointer" />
                <div className="h-px w-12 bg-zinc-800" />
                <span className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest leading-none font-medium">PGD618.studio</span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link
              href="/writing"
              className="group relative overflow-hidden rounded-[40px] bg-blue-600 p-[3vw] text-white transition-all hover:scale-[0.98] active:scale-95 shadow-2xl shadow-blue-500/25 flex flex-col justify-between h-full min-h-[320px]"
            >
              <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10 space-y-4">
                <h2 className="text-4xl font-bold tracking-tight">我的笔记</h2>
                <p className="text-blue-100/70 text-sm font-light leading-relaxed max-w-[200px] tracking-wide">
                  探索同步自 Obsidian 的知识库，涵盖算法、面试与前端。
                </p>
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md">
                  <FiArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-60 group-hover:-rotate-12 transition-transform">
                  Enter Garden
                </span>
              </div>
            </Link>
          </motion.div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative z-10">
          {[
            { name: "算法可视化", tag: "CS61A", color: "text-pink-500" },
            { name: "沉浸式播放器", tag: "React", color: "text-orange-500" },
            { name: "个人博客系统", tag: "Next.js 15", color: "text-blue-500" },
            { name: "面试题解库", tag: "Algorithm", color: "text-green-500" },
          ].map((project, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="group aspect-square rounded-[32px] bg-zinc-900/30 border border-white/5 p-6 md:p-8 flex flex-col justify-between backdrop-blur-sm transition-all duration-500 cursor-pointer hover:bg-zinc-900/60 hover:border-white/10 hover:-translate-y-2"
            >
              <div className={`w-12 h-12 rounded-2xl bg-zinc-800/50 flex items-center justify-center border border-white/5 transition-all group-hover:border-current/30 ${project.color.replace('text', 'border')}`}>
                <FiCode className={`w-5 h-5 ${project.color} opacity-40 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(var(--tw-color-current),0.5)] transition-all duration-500`} />
              </div>

              <div>
                <div className="font-bold text-white text-base md:text-lg tracking-wide mb-2 group-hover:text-blue-400 transition-colors">
                  {project.name}
                </div>
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.15em] flex items-center gap-2 font-light">
                  <span className={`w-1 h-1 rounded-full bg-zinc-800 group-hover:animate-pulse ${project.color.replace('text', 'bg')}`} />
                  {project.tag}
                </div>
              </div>
            </motion.div>
          ))}
        </section>
      </motion.div>
    </div>
  )
}
