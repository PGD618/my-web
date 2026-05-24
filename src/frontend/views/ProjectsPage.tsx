'use client'

import { motion, Variants } from 'framer-motion'
import { FiCode, FiExternalLink, FiGithub, FiLayers, FiArrowUpRight, FiStar, FiBriefcase } from 'react-icons/fi'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } },
}

/* ── 项目数据结构 ── */
interface Project {
  title: string
  subtitle: string
  description: string
  tags: string[]
  accent: string
  gradient: string
  links: { label: string; url: string; icon?: any }[]
  year: string
  featured?: boolean
  internship?: boolean
}

const projects: Project[] = [
  {
    title: '智绘山河——AI“晋”行时',
    subtitle: 'AI 行程规划 · 竞赛国赛作品',
    description: '一个集景点展示、美食酒店预订、后台管理于一体的现代旅游服务平台。获得中国大学生计算机设计大赛山西省一等奖，晋级国赛。核心亮点是基于 DeepSeek 大模型的 AI 智能行程规划——通过趣味测验收集偏好，AI 自动生成个性化多日行程。',
    tags: ['Next.js 15', 'TypeScript', 'Supabase', 'DeepSeek API', 'Zustand', 'ECharts'],
    accent: 'text-emerald-500',
    gradient: 'from-emerald-600/20 to-teal-600/10',
    links: [
      { label: 'Website', url: 'https://www.aitourjin.online/', icon: FiExternalLink },
    ],
    year: '2026.03——2026.05',
    featured: true,
  },
  {
    title: 'Noumi Server',
    internship: true,
    subtitle: 'AI Agent 平台 · 语核科技',
    description: '参与研发的 AI Agent 编排平台，采用 Monorepo 架构，集成了前端交互、后端控制面、AI Proxy 与 Docker 容器编排。涉及用户 workspace、认证鉴权、AI 模型接入等全栈能力。',
    tags: ['Bun/Hono', 'React', 'TypeScript', 'Prisma', 'PostgreSQL', 'Docker', 'AI SDK'],
    accent: 'text-violet-500',
    gradient: 'from-violet-600/20 to-purple-600/10',
    links: [
      { label: 'Website', url: 'https://noumi.ai/', icon: FiExternalLink },
      { label: 'Company', url: 'https://langcore.cn/', icon: FiBriefcase },
    ],
    year: '2026.05——至今',
  },
  {
    title: 'PP的日记',
    subtitle: '个人日记应用 · Next.js + Supabase',
    description: '一个小而美的个人日记应用，支持用户注册登录、创建/编辑/删除日记、标签分类管理。内置粉色/蓝色双主题切换，采用 Framer Motion 交互动画，全响应式设计。',
    tags: ['Next.js 15', 'TypeScript', 'Supabase', 'Auth', 'Framer Motion'],
    accent: 'text-pink-500',
    gradient: 'from-pink-600/20 to-rose-600/10',
    links: [
      { label: 'Website', url: 'https://pp-s-diary.vercel.app/', icon: FiExternalLink },
    ],
    year: '2025.06——2025.07',
  },
  {
    title: '金丝楠音乐',
    subtitle: '开源本地音乐播放器 · Rust + AI 开发',
    description: '一个使用 Rust 构建的本地音乐播放器，纯 AI 辅助开发，从 0 基础起步4小时完成。支持本地音频播放、播放列表管理、基础音频控制，是学习 Rust 系统编程的一次完整实践。',
    tags: ['Rust', 'AI 辅助开发', '系统编程', '开源'],
    accent: 'text-yellow-500',
    gradient: 'from-yellow-600/20 to-amber-600/10',
    links: [
      { label: 'GitHub', url: 'https://github.com/PGD618/Golden-Nanmu-Wood-Music', icon: FiGithub },
    ],
    year: '2026.04——2026.04',
  },
  {
    title: 'CNTA 招生官网',
    subtitle: '协会宣传 · 山西大学计网协会',
    description: '作为山西大学计算机与网络技术协会的部长，为协会打造的招生宣传网站。展示协会文化、技术方向、活动风采，吸引新成员加入。开源项目，持续维护。',
    tags: ['Next.js', 'TypeScript', '协会官网', '开源'],
    accent: 'text-cyan-500',
    gradient: 'from-cyan-600/20 to-sky-600/10',
    links: [
      { label: 'Website', url: 'https://www.sxu-cnta.online/', icon: FiExternalLink },
      { label: 'GitHub', url: 'https://github.com/PGD618/sxu-cnta', icon: FiGithub },
    ],
    year: '2025.07——2025.07',
  },
]

export default function ProjectsPage() {
  return (
    <div className="relative h-full overflow-y-auto overflow-x-hidden bg-zinc-950 custom-scrollbar">
      <div className="pointer-events-none fixed -top-[15%] -right-[10%] h-[45%] w-[45%] rounded-full bg-indigo-500/5 blur-[150px] z-0" />
      <div className="pointer-events-none fixed -bottom-[15%] -left-[10%] h-[45%] w-[45%] rounded-full bg-amber-500/5 blur-[150px] z-0" />

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
        {projects.filter(p => p.internship).map((p) => (
          <motion.section key={p.title} variants={itemVariants}>
            <div className="space-y-4 mb-2">
              <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-600 flex items-center gap-2">
                <FiBriefcase /> 实习项目
              </h2>
            </div>
            <div className="group relative overflow-hidden rounded-4xl bg-zinc-900/40 border border-violet-500/15 backdrop-blur-sm transition-all duration-500 hover:bg-zinc-900/70 hover:border-violet-500/30 hover:-translate-y-1">
              <div className={`h-2 w-full bg-linear-to-r ${p.gradient} opacity-80`} />
              <div className="p-7 md:p-9 space-y-6">
                <div className="flex items-center gap-3 mb-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-[9px] font-mono text-violet-400 uppercase tracking-widest">
                    <FiCode className="w-2.5 h-2.5" />
                    Internship
                  </span>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-white font-bold text-2xl tracking-wide group-hover:text-violet-400 transition-colors">{p.title}</h2>
                    <p className="text-zinc-500 text-xs font-mono mt-1 tracking-wide">{p.subtitle}</p>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest shrink-0 mt-1">{p.year}</span>
                </div>
                <p className="text-zinc-300 text-sm leading-[1.9] max-w-2xl">{p.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-full bg-zinc-800/50 border border-zinc-800 text-[10px] font-mono text-zinc-400 tracking-wide">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-4 pt-1">
                  {p.links.map((link) => (
                    <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 hover:text-violet-400 transition-colors uppercase tracking-wider">
                      {link.icon && <link.icon className="w-3.5 h-3.5" />}
                      {link.label}
                      <FiArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        ))}

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

        {/* ═══ 主打项目：Jinai ═══ */}
        {projects.filter(p => p.featured).map((p) => (
          <motion.section key={p.title} variants={itemVariants}>
            <div className="group relative overflow-hidden rounded-4xl bg-zinc-900/40 border border-emerald-500/15 backdrop-blur-sm transition-all duration-500 hover:bg-zinc-900/70 hover:border-emerald-500/30 hover:-translate-y-1">
              {/* 顶部高亮条 */}
              <div className={`h-2 w-full bg-linear-to-r ${p.gradient} opacity-80`} />

              <div className="p-7 md:p-9 space-y-6">
                {/* 徽章 + 标题 */}
                <div className="flex items-center gap-3 mb-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono text-emerald-400 uppercase tracking-widest">
                    <FiStar className="w-2.5 h-2.5" />
                    Featured
                  </span>
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-white font-bold text-2xl tracking-wide group-hover:text-emerald-400 transition-colors">
                      {p.title}
                    </h2>
                    <p className="text-zinc-500 text-xs font-mono mt-1 tracking-wide">{p.subtitle}</p>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest shrink-0 mt-1">
                    {p.year}
                  </span>
                </div>

                {/* 描述 */}
                <p className="text-zinc-300 text-sm leading-[1.9] max-w-2xl">
                  {p.description}
                </p>

                {/* 技术栈 */}
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full bg-zinc-800/50 border border-zinc-800 text-[10px] font-mono text-zinc-400 tracking-wide"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 链接 */}
                <div className="flex items-center gap-4 pt-1">
                  {p.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 hover:text-emerald-400 transition-colors uppercase tracking-wider"
                    >
                      {link.icon && <link.icon className="w-3.5 h-3.5" />}
                      {link.label}
                      <FiArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        ))}

        {/* ═══ 其他项目卡片网格 ═══ */}
        <motion.section variants={itemVariants} className="space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-600 flex items-center gap-2">
            <FiCode /> 更多作品
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projects.filter(p => !p.featured && !p.internship).map((p) => (
              <div
                key={p.title}
                className="group relative overflow-hidden rounded-[28px] bg-zinc-900/30 border border-white/5 backdrop-blur-sm transition-all duration-500 hover:bg-zinc-900/60 hover:border-white/10 hover:-translate-y-1"
              >
                <div className={`h-1.5 w-full bg-linear-to-r ${p.gradient} opacity-60 group-hover:opacity-100 transition-opacity`} />

                <div className="p-6 md:p-7 space-y-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white font-bold text-lg tracking-wide group-hover:text-blue-400 transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-zinc-500 text-xs font-mono mt-0.5 tracking-wide">{p.subtitle}</p>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest shrink-0 mt-1">
                      {p.year}
                    </span>
                  </div>

                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {p.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full bg-zinc-800/50 border border-zinc-800 text-[10px] font-mono text-zinc-400 tracking-wide"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    {p.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.url}
                        target={link.url.startsWith('http') ? '_blank' : undefined}
                        rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-500 hover:text-blue-400 transition-colors uppercase tracking-wider"
                      >
                        {link.icon && <link.icon className="w-3.5 h-3.5" />}
                        {link.label}
                        <FiArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
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
    </div>
  )
}







