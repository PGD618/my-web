'use client'

import { motion, Variants } from 'framer-motion'
import { FiZap, FiArrowRight, FiCode, FiBriefcase, FiUser } from 'react-icons/fi'
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

const navCards = [
  { name: '项目', tag: '代表作品 · 实习与竞赛项目', href: '/projects', icon: FiCode, bg: 'from-blue-600/20 to-cyan-600/10' },
  { name: '履历', tag: '工作与社团 · 成长时间线', href: '/experience', icon: FiBriefcase, bg: 'from-violet-600/20 to-purple-600/10' },
  { name: '关于我', tag: '性格标签 · 日常碎片', href: '/about', icon: FiUser, bg: 'from-emerald-600/20 to-teal-600/10' },
]
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
        className="relative z-10 max-w-300 mx-auto space-y-[6vh]"
      >
        {/* ═══ Hero ═══ */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 group relative overflow-hidden rounded-[40px] bg-zinc-900/40 border border-white/5 p-[4vw] backdrop-blur-md transition-all hover:border-white/10 hover:bg-zinc-900/60"
          >
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-400 uppercase tracking-[0.2em]">
                <FiZap className="text-blue-400" /> 全栈开发 · 终身学习
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5vw] font-bold tracking-tight text-white leading-[1.1] wrap-break-words">
                大三程序猿 / <br />
                <span className="text-zinc-600 font-medium">独立开发者 & 思考者</span>
              </h1>

              <p className="text-zinc-400 text-lg font-light max-w-lg leading-relaxed tracking-wide">
                专注于构建有美感的全栈应用。这里是我的数字花园，记录技术、行业思考与生活感悟的碎片。
              </p>

              <div className="flex gap-6 items-center pt-4">
                <a href="https://github.com/PGD618" target="_blank" rel="noopener noreferrer"><SiGithub className="w-6 h-6 text-zinc-500 hover:text-white transition-colors cursor-pointer" /></a>
                <a href="mailto:guojinbo618@gmail.com"><SiGmail className="w-6 h-6 text-zinc-500 hover:text-white transition-colors cursor-pointer" /></a>
                <div className="h-px w-12 bg-zinc-800" />
                <span className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest leading-none font-medium">PGD618.studio</span>
              </div>
            </div>
          </motion.div>

          {/* ═══ Blog 入口卡片 ═══ */}
          <motion.div variants={itemVariants}>
            <Link
              href="/writing"
              className="group relative overflow-hidden rounded-[40px] bg-blue-600 p-[3vw] text-white transition-all hover:scale-[0.98] active:scale-95 shadow-2xl shadow-blue-500/25 flex flex-col justify-between h-full min-h-80"
            >
              <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10 space-y-4">
                <h2 className="text-4xl font-bold tracking-tight">我的碎片</h2>
                <p className="text-blue-100/70 text-sm font-light leading-relaxed max-w-50 tracking-wide">
                  技术沉淀、行业思考、生活手记 —— 同步自 Obsidian 的思想空间。
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

        {/* ═══ 更多内容 ═══ */}
        <section className="space-y-5">
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-600 flex items-center gap-2">
              <FiCode /> 更多内容
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {navCards.map((card) => (
              <motion.div key={card.name} variants={itemVariants}>
                <Link
                  href={card.href}
                  className="group relative overflow-hidden rounded-[28px] bg-zinc-900/30 border border-white/5 p-6 backdrop-blur-sm transition-all duration-500 hover:bg-zinc-900/60 hover:border-white/10 hover:-translate-y-1 cursor-pointer block"
                >
                  <div className={`h-1 w-full bg-linear-to-r ${card.bg} opacity-60 group-hover:opacity-100 transition-opacity mb-5 rounded-full`} />

                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-white text-lg tracking-wide group-hover:text-blue-400 transition-colors">
                        {card.name}
                      </div>
                      <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.15em] mt-1.5">
                        {card.tag}
                      </div>
                    </div>
                    <FiArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </motion.div>
    </div>
  )
}


