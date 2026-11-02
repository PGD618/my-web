import { FiBriefcase, FiBookOpen, FiUsers } from 'react-icons/fi'

export interface Experience {
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

export const experiences: Experience[] = [
  {
    period: '2026.07 · 至今',
    role: 'Workflow 开发实习生',
    org: '万境千寻（北京）科技有限公司',
    orgDesc: 'Mozbrain / CapturEx · 具身智能机器人平台',
    description: '作为 SE 随 mentor 驻场客户 POC 交付，基于自研 Overmind 框架搭建机器人作业 workflow，并针对不同产线场景做业务改造，重点负责技术运营指标体系的搭建。',
    highlights: [
      '搭建通用 workflow 骨架并沉淀至 main 分支，已稳定应用于 2 个客户项目的产线场景，新项目搭建周期缩短约 60%',
      '在 main 分支搭建节点级埋点监控，覆盖全部项目；并在 workflow 层搭建业务埋点，覆盖 2 个稳定项目，故障定位速度平均提升 43.7%',
      '参与数采环节，已应用于 4 个项目，并了解 VLA 模型训练/后训练流程与真实产线部署的衔接关系',
    ],
    tags: ['Workflow', 'Python', '机器人', 'POC交付', '运营指标'],
    icon: FiBriefcase,
    type: 'work',
  },
  {
    period: '2026.03 · 2026.07',
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
    description: '大三在读，计算机科学与技术专业。虽然起点普通，但更愿意沉下心多学多做、加倍追赶，踏实打磨每一处细节。',
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

export const typeConfig = {
  work: { lineColor: 'bg-blue-500', dotColor: 'border-blue-500', bgGlow: 'bg-blue-500/5' },
  education: { lineColor: 'bg-purple-500', dotColor: 'border-purple-500', bgGlow: 'bg-purple-500/5' },
  community: { lineColor: 'bg-emerald-500', dotColor: 'border-emerald-500', bgGlow: 'bg-emerald-500/5' },
}
