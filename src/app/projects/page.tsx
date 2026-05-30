import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
  description: '精选项目 — 从 AI Agent 平台到国赛作品，记录每一次实践与成长。',
  openGraph: { title: 'Projects', description: '精选项目 — 从 AI Agent 平台到国赛作品。', url: '/projects' },
}

export { default } from "@/frontend/views/ProjectsPage"
