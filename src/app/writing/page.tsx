import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Writing',
  description: '数字花园 — 同步自 Obsidian 的知识库，涵盖算法、面试、前端技术与个人思考。',
  openGraph: { title: 'Digital Garden', description: '同步自 Obsidian 的知识库。', url: '/writing' },
}

export { default } from '@/frontend/views/WritingDashboard'
