'use client'

import { useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { FiCode, FiExternalLink, FiGithub, FiLayers, FiArrowUpRight, FiStar, FiBriefcase, FiX } from 'react-icons/fi'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

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
  detail?: {
    background?: string
    role?: string
    highlights?: string[]
    learnings?: string
  }
}

const projects: Project[] = [
  {
    title: '智绘山河——AI"晋"行时',
    subtitle: 'AI 行程规划 · 竞赛国赛作品',
    description: '一个集景点展示、美食酒店预订、后台管理于一体的现代旅游服务平台。获得中国大学生计算机设计大赛山西省一等奖，晋级国赛。核心亮点是基于 DeepSeek 大模型的 AI 智能行程规划——通过趣味测验收集偏好，AI 自动生成个性化多日行程。',
    tags: ['Next.js 16', 'TypeScript', 'Supabase', 'DeepSeek API', 'Zustand', 'ECharts'],
    accent: 'text-emerald-500',
    gradient: 'from-emerald-600/20 to-teal-600/10',
    links: [
      { label: 'Website', url: 'https://www.aitourjin.online/', icon: FiExternalLink },
    ],
    year: '2026.03——2026.05',
    featured: true,
    detail: {
      background: '将山西深厚的文化特色与现代科技相融合，紧扣旅游热潮下突出的山西旅游成本高、规划难等问题，设计了从规划到出行的全流程服务平台。未来有意向与山西文旅局合作，助力家乡文旅宣传。',
      role: '团队唯一开发，兼任产品设计与测试。独立负责全部前后端代码、AI 行程规划模块、数据库设计与产品交互流程。',
      highlights: [
        '基于 DeepSeek + RAG 的 AI 行程规划引擎：DashScope text-embedding-v4 + Supabase pgvector 构建山西文化知识库，通过结构化 system prompt 生成带地理校验的 JSON 行程',
        '模块化架构与可扩展性：相较同类智能体模块化程度高，引入新工具后可手动调整逻辑，节约因知识库变化导致的模型微调成本',
        '可视化交互体验：摒弃传统长对话，通过模块可视化帮助用户匹配出行偏好，打造沉浸式个性化旅游体验',
        'AI 实时对话修改行程：生成后可通过自然语言聊天调整细节，PrePlanAgent 维护统一上下文',
        '全栈 TypeScript 架构 + 完整后台：Next.js 16 App Router + Supabase + Tailwind CSS v4，支持景点/美食/酒店/轮播图/趣味测试的 CRUD 管理',
      ],
      learnings: '独立负责一个完整全栈产品从 0 到 1 的交付，兼任产品设计与测试，深刻理解了"代码写得好"和"产品拿得出手"之间的差距。同时意识到技术不只是工具，更是连接家乡文化与现代需求的桥梁。',
    },
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
    detail: {
      background: 'Langhub 是语核科技基于已验证的 Agentic RAG 技术推出的自学习 AI 数字员工平台，旨在攻克传统 RAG 在复杂业务场景中的能力瓶颈——让 AI 真正吃透企业私有知识，像领域专家一样思考并完成复杂工作。',
      role: '参与 IM 集成模块的全栈开发与 AI Proxy 代理层的优化维护。作为初创团队核心研发，深度介入产品设计与技术实现的全流程，从前端交互到后端调度均有实际产出。',
      highlights: [
        '飞书 / Telegram / Discord / WhatsApp 多平台 IM 统一接入：将四种协议差异极大的 IM 平台通过 adapter 层收敛为统一业务事件，支持群聊 mention 识别与项目作用域隔离',
        'AI Proxy 多模型调度与请求级 failover：参与通道健康探测、计费预授权与 usage 结算链路，保障高并发下不丢账、不重扣',
        '全栈 Monorepo 工程实践：在 Bun + Hono + React + Prisma 技术栈下，参与 workspace 模块前后端联调与旧容器 UI 迁移兼容',
        '用户容器 runtime 代理与唤醒：参与 workspace API 代理路径设计与按需唤醒逻辑，处理 CORS、token 注入与 header 过滤',
      ],
      learnings: '第一次参与商业级产品落地，在初创公司环境中完整经历了从需求讨论、产品设计到研发上线的全流程。不仅完善了 Bun/Hono 全栈技术栈的实战经验，更深刻理解了 AI 产品从"能跑"到"可商用"之间的工程差距。',
    },
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
    detail: {
      background: '第一个全栈练手项目，想做一个真正简洁、私密的个人日记应用，记录生活点滴，给未来的自己留一份回忆。',
      role: '独立全栈开发，从产品设计到前后端实现一手完成。',
      highlights: [
        '粉色/蓝色双主题切换：自定义 useTheme hook + localStorage 持久化 + storage 事件跨标签同步',
        '完整用户认证流程：Supabase Auth 注册/登录/登出，AuthContext 全局状态管理',
        '日记 CRUD + 标签系统：创建/编辑/删除/按标签筛选，Supabase RLS 行级安全',
        '交互动画：Framer Motion 页面过渡 + 组件级入场动画',
        '全栈架构：Next.js 15 App Router + Supabase（PostgreSQL + Auth）+ Tailwind CSS v4',
      ],
      learnings: '从零到一独立交付一个完整全栈产品，完整经历了从需求构思、数据库设计、认证流程到前端交互的全流程。上线后被安全审计发现越权漏洞，修复过程中深刻理解了 Supabase RLS 行级安全的重要性，也学会了"小项目"同样需要认真对待安全边界。',
    },
  },
  {
    title: '金丝楠音乐',
    subtitle: '开源本地音乐播放器 · Rust + AI 开发',
    description: '一个使用 Rust 构建的本地音乐播放器，纯 AI 辅助开发，从 0 基础起步4小时完成。支持本地音频播放、播放列表管理、基础音频控制，是学习 Rust 系统编程的一次完整实践。',
    tags: ['Tauri', 'Rust', 'React', 'TypeScript'],
    accent: 'text-yellow-500',
    gradient: 'from-yellow-600/20 to-amber-600/10',
    links: [
      { label: 'GitHub', url: 'https://github.com/PGD618/Golden-Nanmu-Wood-Music', icon: FiGithub },
    ],
    year: '2026.03——2026.03',
    detail: {
      background: '自己攒了不少 FLAC 高音质音乐却找不到一款 UI 好看的本地播放器，恰逢网安比赛要求全程内网不能联网，于是比赛前一晚用 4 小时借助 AI 完成了整个项目的开发。名字取自"金丝楠"谐音"金思楠"——自己名字里的"金"和女朋友名字里的"楠"，也是未来个人 IP 的雏形。',
      role: '独立开发，全程由 AI 辅助完成，包括 Rust 后端与 React 前端。',
      highlights: [
        '音频元数据解析：Rust lofty 库读取本地音乐文件的封面、歌手、歌词等元数据',
        '本地音乐库管理：文件夹选择 + 递归扫描 + Tauri asset protocol 加载本地文件',
        '播放控制完整：播放/暂停/上下首、顺序/随机/单曲循环、进度拖动、音量调节',
        '歌词滚动同步：解析 LRC 时间戳，实现歌词自动高亮与平滑滚动',
        '全局快捷键：录制自定义快捷键，支持窗口最小化时后台控制',
        '系统托盘：关闭窗口隐藏到托盘，开机自启动',
      ],
      learnings: '4 小时从零交付一个完整桌面应用，验证了 AI 辅助开发在紧急场景下的可行性。同时也体会到，好的工具类产品不仅要功能完整，更要让用户在使用时感受到设计的美感和细节。',
    },
  },
  {
    title: 'CNTA 招生官网',
    subtitle: '协会宣传 · 山西大学计网协会',
    description: '作为山西大学计算机与网络技术协会的部长，为协会打造的招生宣传网站。展示协会文化、技术方向、活动风采，吸引新成员加入。开源项目，持续维护。',
    tags: ['Next.js', 'TypeScript', 'Framer Motion', 'Tailwind CSS'],
    accent: 'text-cyan-500',
    gradient: 'from-cyan-600/20 to-sky-600/10',
    links: [
      { label: 'Website', url: 'https://www.sxu-cnta.online/', icon: FiExternalLink },
      { label: 'GitHub', url: 'https://github.com/PGD618/sxu-cnta', icon: FiGithub },
    ],
    year: '2025.07',
    detail: {
      background: '作为山西大学计算机与网络技术协会（CNTA）部长，为协会打造专业、现代的招生宣传网站，解决传统招新渠道信息分散、展示效果差的问题，让新生能一站式了解协会文化、技术方向和竞赛成果。',
      role: '项目负责人兼全栈开发，从需求调研、视觉设计到前后端实现与部署维护一手完成。',
      highlights: [
        '赛博朋克视觉风格：粒子动画背景 + 视差滚动 + 毛玻璃卡片 + 打字机效果，打造沉浸式技术氛围',
        '多页面架构：首页、技术部（竞赛/培训/知识库）、志愿队（电脑义诊/数字助老）、加入我们四大板块',
        '丰富的交互组件：图片轮播 + Lightbox 灯箱预览、动态分割线、二维码名片、滚动监听导航栏',
        '竞赛成果展示：熵密杯（山西省高校第一）、AI安全竞赛（全国二等奖）、蓝桥杯等完整战绩',
        '全端适配：响应式设计 + 移动端抽屉式菜单，部署于 Vercel',
      ],
      learnings: '从协会实际需求出发，完整经历了一个面向真实用户的产品从 0 到 1 的过程。学会了如何用视觉设计传递技术组织的品牌调性，也理解了"好看不够，好用才行"的产品思维。',
    },
  },
]

function ProjectBadge({ project }: { project: Project }) {
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

function ProjectDetailSheet({ project, open, onOpenChange }: { project: Project | null; open: boolean; onOpenChange: (v: boolean) => void }) {
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
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1.5 rounded-full bg-zinc-800/60 border border-zinc-800 text-[11px] font-mono text-zinc-400 tracking-wide">
                      {tag}
                    </span>
                  ))}
                </div>
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
                  {project.links.map((link) => (
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

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation()

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
            <div
              onClick={() => handleCardClick(p)}
              className="group relative overflow-hidden rounded-4xl bg-zinc-900/40 border border-violet-500/15 backdrop-blur-sm transition-all duration-500 hover:bg-zinc-900/70 hover:border-violet-500/30 hover:-translate-y-1 cursor-pointer"
            >
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
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={stopPropagation}
                      className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 hover:text-violet-400 transition-colors uppercase tracking-wider"
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
            <div
              onClick={() => handleCardClick(p)}
              className="group relative overflow-hidden rounded-4xl bg-zinc-900/40 border border-emerald-500/15 backdrop-blur-sm transition-all duration-500 hover:bg-zinc-900/70 hover:border-emerald-500/30 hover:-translate-y-1 cursor-pointer"
            >
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
                      onClick={stopPropagation}
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
                onClick={() => handleCardClick(p)}
                className="group relative overflow-hidden rounded-[28px] bg-zinc-900/30 border border-white/5 backdrop-blur-sm transition-all duration-500 hover:bg-zinc-900/60 hover:border-white/10 hover:-translate-y-1 cursor-pointer"
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
                        onClick={stopPropagation}
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

      <ProjectDetailSheet project={selectedProject} open={open} onOpenChange={handleOpenChange} />
    </div>
  )
}
