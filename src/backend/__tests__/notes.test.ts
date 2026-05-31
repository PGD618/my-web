import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNotes } from './fixtures'

// Mock content 模块，返回 fixture 数据
vi.mock('content', () => ({
  notes: mockNotes,
}))

// 在 mock 之后导入
import {
  getAllNotes,
  getNote,
  getRecentNotes,
  getBacklinks,
  getGraphData,
  getNotesStats,
  getAllTags,
  getNotesByTag,
  getTagNames,
  getPinnedNotes,
  getNotesByCategory,
} from '../notes'

describe('getAllNotes', () => {
  it('返回所有笔记', () => {
    const result = getAllNotes()
    expect(result).toHaveLength(5)
  })
})

describe('getNote', () => {
  it('通过 slug 查找笔记', () => {
    const note = getNote('frontend/react-hooks')
    expect(note).toBeDefined()
    expect(note!.title).toBe('React Hooks')
  })

  it('不存在的 slug 返回 undefined', () => {
    expect(getNote('nonexistent/slug')).toBeUndefined()
  })
})

describe('getRecentNotes', () => {
  it('默认返回 4 条笔记', () => {
    const result = getRecentNotes()
    expect(result).toHaveLength(4)
  })

  it('按 lastModified 降序排列', () => {
    const result = getRecentNotes()
    expect(result[0].title).toBe('Docker 入门') // 2024-03-25
    expect(result[1].title).toBe('TypeScript 基础') // 2024-03-20
    expect(result[2].title).toBe('React Hooks') // 2024-03-15
    expect(result[3].title).toBe('Go 并发编程') // 2024-03-10
  })

  it('支持自定义数量', () => {
    const result = getRecentNotes(2)
    expect(result).toHaveLength(2)
    expect(result[0].title).toBe('Docker 入门')
  })

  it('数量超过笔记总数时返回全部', () => {
    const result = getRecentNotes(10)
    expect(result).toHaveLength(5)
  })
})

describe('getBacklinks', () => {
  it('找到引用了目标笔记的反向链接', () => {
    const reactHooks = getNote('frontend/react-hooks')!
    const backlinks = getBacklinks(reactHooks)
    // TypeScript 基础 的 outboundLinks 包含 'React Hooks'
    expect(backlinks).toHaveLength(1)
    expect(backlinks[0].title).toBe('TypeScript 基础')
  })

  it('通过 slug 匹配反向链接', () => {
    const goNote = getNote('backend/go-concurrency')!
    const backlinks = getBacklinks(goNote)
    // Docker 入门 的 outboundLinks 包含 'Go 并发编程'
    expect(backlinks).toHaveLength(1)
    expect(backlinks[0].title).toBe('Docker 入门')
  })

  it('没有反向链接时返回空数组', () => {
    const noTags = getNote('misc/no-tags')!
    expect(getBacklinks(noTags)).toHaveLength(0)
  })

  it('不包含自身', () => {
    const tsNote = getNote('frontend/typescript-basics')!
    const backlinks = getBacklinks(tsNote)
    // React Hooks 链接到 TypeScript 基础，TypeScript 基础也链接到 React Hooks
    // 但 getBacklinks 排除了自身
    expect(backlinks.every((b) => b.slug !== tsNote.slug)).toBe(true)
  })
})

describe('getGraphData', () => {
  it('返回包含当前节点的图谱数据', () => {
    const note = getNote('frontend/react-hooks')!
    const graph = getGraphData(note)

    expect(graph.nodes).toHaveLength(2) // 自身 + TypeScript 基础
    expect(graph.nodes[0]).toEqual({ id: 'React Hooks', slug: 'frontend/react-hooks' })
  })

  it('返回正确的链接关系', () => {
    const note = getNote('frontend/react-hooks')!
    const graph = getGraphData(note)

    expect(graph.links).toHaveLength(1)
    expect(graph.links[0]).toEqual({ source: 'React Hooks', target: 'TypeScript 基础' })
  })

  it('无外链时只有自身节点', () => {
    const note = getNote('backend/go-concurrency')!
    const graph = getGraphData(note)

    expect(graph.nodes).toHaveLength(1)
    expect(graph.links).toHaveLength(0)
  })

  it('目标笔记的 slug 通过 title→slug 映射解析', () => {
    const note = getNote('devops/docker-intro')!
    const graph = getGraphData(note)

    // Docker 链接到 'Go 并发编程'，应解析为 backend/go-concurrency
    const goNode = graph.nodes.find((n) => n.id === 'Go 并发编程')
    expect(goNode?.slug).toBe('backend/go-concurrency')
  })
})

describe('getNotesStats', () => {
  it('返回正确的统计数据', () => {
    const stats = getNotesStats()
    expect(stats.totalNotes).toBe(5)
    expect(stats.totalWords).toBe(120 + 200 + 300 + 150 + 50)
  })

  it('返回去重后的分类列表', () => {
    const stats = getNotesStats()
    expect(stats.categories).toContain('frontend')
    expect(stats.categories).toContain('backend')
    expect(stats.categories).toContain('devops')
    expect(stats.categories).toContain('misc')
    // frontend 出现两次但只计算一次
    expect(stats.categories.filter((c) => c === 'frontend')).toHaveLength(1)
  })
})

describe('getAllTags', () => {
  it('返回所有标签及计数，按计数降序', () => {
    const tags = getAllTags()
    // frontend: 2 (React Hooks + TypeScript 基础)
    expect(tags[0]).toEqual({ name: 'frontend', count: 2 })
  })

  it('包含所有唯一标签', () => {
    const tags = getAllTags()
    const names = tags.map((t) => t.name)
    expect(names).toContain('react')
    expect(names).toContain('hooks')
    expect(names).toContain('typescript')
    expect(names).toContain('go')
    expect(names).toContain('concurrency')
    expect(names).toContain('docker')
    expect(names).toContain('devops')
  })

  it('计数为 1 的标签正确统计', () => {
    const tags = getAllTags()
    const reactTag = tags.find((t) => t.name === 'react')
    expect(reactTag?.count).toBe(1)
  })
})

describe('getNotesByTag', () => {
  it('返回包含指定标签的笔记', () => {
    const result = getNotesByTag('frontend')
    expect(result).toHaveLength(2)
    const titles = result.map((n) => n.title)
    expect(titles).toContain('React Hooks')
    expect(titles).toContain('TypeScript 基础')
  })

  it('不存在的标签返回空数组', () => {
    expect(getNotesByTag('nonexistent')).toHaveLength(0)
  })
})

describe('getTagNames', () => {
  it('返回所有唯一标签名', () => {
    const names = getTagNames()
    // react, hooks, frontend, typescript, go, concurrency, docker, devops
    expect(names).toHaveLength(8)
    expect(names).toContain('frontend')
    expect(names).toContain('react')
  })
})

describe('getPinnedNotes', () => {
  it('返回所有置顶笔记', () => {
    const pinned = getPinnedNotes()
    expect(pinned).toHaveLength(1)
    expect(pinned[0].title).toBe('React Hooks')
  })

  it('只返回 pinned 为 true 的笔记', () => {
    const pinned = getPinnedNotes()
    expect(pinned.every(n => n.pinned)).toBe(true)
  })
})

describe('getNotesByCategory', () => {
  it('返回指定分类的笔记', () => {
    const result = getNotesByCategory('frontend')
    expect(result).toHaveLength(2)
    const titles = result.map(n => n.title)
    expect(titles).toContain('React Hooks')
    expect(titles).toContain('TypeScript 基础')
  })

  it('不存在的分类返回空数组', () => {
    expect(getNotesByCategory('nonexistent')).toHaveLength(0)
  })
})
