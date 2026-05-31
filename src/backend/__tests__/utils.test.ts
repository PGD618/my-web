import { describe, it, expect } from 'vitest'
import { buildFileTree } from '../utils'
import type { FileTreeNode } from '../utils'

describe('buildFileTree', () => {
  it('构建单级路径的树', () => {
    const tree = buildFileTree([{ slug: 'readme' }])
    expect(tree).toHaveProperty('readme')
    expect(tree.readme.name).toBe('readme')
    expect(tree.readme.isFolder).toBe(false)
    expect(tree.readme.slug).toBe('readme')
  })

  it('构建多级路径的树', () => {
    const tree = buildFileTree([{ slug: 'frontend/react/hooks' }])

    expect(tree.frontend.isFolder).toBe(true)
    expect(tree.frontend.slug).toBeNull()

    expect(tree.frontend.children.react.isFolder).toBe(true)
    expect(tree.frontend.children.react.slug).toBeNull()

    expect(tree.frontend.children.react.children.hooks.isFolder).toBe(false)
    expect(tree.frontend.children.react.children.hooks.slug).toBe('frontend/react/hooks')
  })

  it('合并相同前缀的路径', () => {
    const tree = buildFileTree([
      { slug: 'frontend/react-hooks' },
      { slug: 'frontend/typescript-basics' },
    ])

    expect(Object.keys(tree)).toHaveLength(1) // 只有 frontend
    expect(Object.keys(tree.frontend.children)).toHaveLength(2)
  })

  it('处理空数组', () => {
    const tree = buildFileTree([])
    expect(Object.keys(tree)).toHaveLength(0)
  })

  it('处理反斜杠路径', () => {
    const tree = buildFileTree([{ slug: 'backend\\go\\concurrency' }])
    expect(tree.backend).toBeDefined()
    expect(tree.backend.children.go.children.concurrency.isFolder).toBe(false)
    expect(tree.backend.children.go.children.concurrency.slug).toBe('backend\\go\\concurrency')
  })

  it('深层嵌套路径正确构建', () => {
    const tree = buildFileTree([{ slug: 'a/b/c/d/e' }])

    let current: Record<string, FileTreeNode> = tree
    const parts = ['a', 'b', 'c', 'd', 'e']
    parts.forEach((part, i) => {
      expect(current[part]).toBeDefined()
      expect(current[part].isFolder).toBe(i < parts.length - 1)
      current = current[part].children
    })
  })

  it('不覆盖已存在的节点', () => {
    // 如果两个笔记共享前缀路径，先创建的节点不会被覆盖
    const tree = buildFileTree([
      { slug: 'notes/first' },
      { slug: 'notes/second' },
    ])
    expect(tree.notes.children.first.slug).toBe('notes/first')
    expect(tree.notes.children.second.slug).toBe('notes/second')
  })
})
