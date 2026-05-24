'use client'

import { motion, Variants } from 'framer-motion'
import { FiBriefcase, FiBookOpen, FiCalendar, FiMapPin, FiUsers, FiCode } from 'react-icons/fi'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } },
}

interface Experience {
  period: string
  role: string
  org: string
  orgDesc?: string
  description: string
  highlights: string[]
  tags: string[]
  icon: any
  type: 'work' | 'education' | 'community'
}

const experiences: Experience[] = [
  {
    period: '2026.05 · 至今',
    role: '全栈研发实习生',
    org: '语核（上海）科技有限公司',
    orgDesc: 'Noumi Server · AI Agent 平台',
    description: '参与公司核心产品 Noumi Server（AI Agent 编排平台）的研发，涉及前后端开发、AI 集成与基础设施编排。在实践中沉淀工程化能力与复杂业务逻辑。',
    highlights: [
      '参与 AI Agent 平台的 Full-stack 开发',
      '学习 Monorepo 架构、CI/CD 流程与团队协作',
      '接触 Docker 编排、AI Proxy、Prisma ORM 等全栈技术栈',
    ],
    tags: ['Bun/Hono', 'React', 'TypeScript', 'Prisma', 'Docker', 'AI'],
    icon: FiBriefcase,
    type: 'work',
  },
  {
    period: '2025 · 2026',
    role: '技术部部长',
    org: '山西大学计算机与网络技术协会',
    orgDesc: 'CNTA · 技术社区',
    description: '担任协会技术部部长，负责协会技术方向规划与新生培养，主导协会官网开发与维护。',
    highlights: [
      '主导协会招生官网开发（sxu-cnta.online）',
      '组织技术分享与培训，帮助新成员入门',
      '推动协会开源文化建设',
    ],
    tags: ['社区运营', '技术分享', '招新', '开源'],
    icon: FiUsers,
    type: 'community',
  },
  {
    period: '2024 - 2028',
    role: '软件工程 · 本科',
    org: '山西大学',
    orgDesc: '双一流 · 起点普通',
    description: '大二在读，计算机科学与技术专业。虽然起点普通，但更愿意沉下心多学多做、加倍追赶，踏实打磨每一处细节。',
    highlights: [
      '计算机相关奖项若干',
      '自学全栈开发与 TS 系统编程',
      '持续输出技术笔记与项目实践',
    ],
    tags: ['软工', '竞赛', '自学'],
    icon: FiBookOpen,
    type: 'education',
  },
]

const typeConfig = {
  work: { lineColor: 'bg-blue-500', dotColor: 'border-blue-500', bgGlow: 'bg-blue-500/5' },
  education: { lineColor: 'bg-purple-500', dotColor: 'border-purple-500', bgGlow: 'bg-purple-500/5' },
  community: { lineColor: 'bg-emerald-500', dotColor: 'border-emerald-500', bgGlow: 'bg-emerald-500/5' },
}

export default function ExperiencePage() {
  return (
    <div className="relative h-full overflow-y-auto overflow-x-hidden bg-zinc-950 custom-scrollbar">
      <div className="pointer-events-none fixed -top-[15%] -left-[10%] h-[45%] w-[45%] rounded-full bg-blue-500/5 blur-[150px] z-0" />
      <div className="pointer-events-none fixed -bottom-[15%] -right-[10%] h-[45%] w-[45%] rounded-full bg-purple-500/5 blur-[150px] z-0" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-[900px] mx-auto px-6 md:px-[5vw] py-[8vh] space-y-14"
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
          <div className="absolute left-[18px] md:left-[22px] top-0 bottom-0 w-px bg-zinc-800" />

          <div className="space-y-10">
            {experiences.map((exp, i) => {
              const cfg = typeConfig[exp.type]
              return (
                <div key={i} className="relative pl-12 md:pl-14">
                  {/* 时间线节点 */}
                  <div className={`absolute left-[10px] md:left-[14px] top-1.5 w-[18px] h-[18px] rounded-full bg-zinc-950 border-2 ${cfg.dotColor} z-10 flex items-center justify-center`}>
                    <div className={`w-[6px] h-[6px] rounded-full ${cfg.lineColor}`} />
                  </div>

                  {/* 卡片 */}
                  <div className="group relative overflow-hidden rounded-[24px] bg-zinc-900/30 border border-white/5 backdrop-blur-sm transition-all duration-500 hover:bg-zinc-900/60 hover:border-white/10 hover:-translate-y-0.5">
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

