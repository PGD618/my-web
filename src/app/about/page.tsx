import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: '郭金波 — 全栈研发实习生，山西大学大二学生，专注全栈开发与技术探索。',
  openGraph: { title: 'About Me', description: '郭金波 — 全栈研发实习生，山西大学大二学生。', url: '/about' },
}

export { default } from "@/frontend/views/AboutPage"
