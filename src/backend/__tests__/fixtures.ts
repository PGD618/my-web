/** 共享的测试 fixture 数据 */

export interface MockNote {
  title: string
  slug: string
  content: string
  excerpt: string
  lastModified: string
  wordCount: number
  toc: { title: string; url: string; depth: number }[]
  outboundLinks: string[]
  category: string
  tags: string[]
  plainContent: string
  pinned: boolean
}

export const mockNotes: MockNote[] = [
  {
    title: 'React Hooks',
    slug: 'frontend/react-hooks',
    content: '<p>React Hooks 是 React 16.8 引入的新特性。</p>',
    excerpt: 'React Hooks 简介',
    lastModified: '2024-03-15T10:00:00.000Z',
    wordCount: 120,
    toc: [{ title: 'useState', url: '#usestate', depth: 2 }],
    outboundLinks: ['TypeScript 基础'],
    category: 'frontend',
    tags: ['react', 'hooks', 'frontend'],
    plainContent: 'React Hooks 是 React 16.8 引入的新特性。',
    pinned: true,
  },
  {
    title: 'TypeScript 基础',
    slug: 'frontend/typescript-basics',
    content: '<p>TypeScript 是 JavaScript 的超集。</p>',
    excerpt: 'TypeScript 入门指南',
    lastModified: '2024-03-20T10:00:00.000Z',
    wordCount: 200,
    toc: [{ title: '类型系统', url: '#types', depth: 2 }],
    outboundLinks: ['React Hooks'],
    category: 'frontend',
    tags: ['typescript', 'frontend'],
    plainContent: 'TypeScript 是 JavaScript 的超集。',
    pinned: false,
  },
  {
    title: 'Go 并发编程',
    slug: 'backend/go-concurrency',
    content: '<p>Go 语言的并发模型基于 goroutine。</p>',
    excerpt: 'Go 并发编程指南',
    lastModified: '2024-03-10T10:00:00.000Z',
    wordCount: 300,
    toc: [],
    outboundLinks: [],
    category: 'backend',
    tags: ['go', 'concurrency'],
    plainContent: 'Go 语言的并发模型基于 goroutine。',
    pinned: false,
  },
  {
    title: 'Docker 入门',
    slug: 'devops/docker-intro',
    content: '<p>Docker 是一种容器化技术。</p>',
    excerpt: 'Docker 入门教程',
    lastModified: '2024-03-25T10:00:00.000Z',
    wordCount: 150,
    toc: [],
    outboundLinks: ['Go 并发编程'],
    category: 'devops',
    tags: ['docker', 'devops'],
    plainContent: 'Docker 是一种容器化技术。',
    pinned: false,
  },
  {
    title: '无标签笔记',
    slug: 'misc/no-tags',
    content: '<p>这是一篇没有标签的笔记。</p>',
    excerpt: '无标签',
    lastModified: '2024-03-01T10:00:00.000Z',
    wordCount: 50,
    toc: [],
    outboundLinks: [],
    category: 'misc',
    tags: [],
    plainContent: '这是一篇没有标签的笔记。',
    pinned: false,
  },
]
