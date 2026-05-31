import { describe, it, expect } from 'vitest'
import { rehypeCodeMeta } from '../rehypeCodeMeta'

// 构造 hast 节点的辅助函数
function createPreNode(codeProperties: Record<string, unknown> = {}, codeData?: { meta?: string }) {
  return {
    type: 'element',
    tagName: 'pre',
    properties: {} as Record<string, unknown>,
    children: [
      {
        type: 'element',
        tagName: 'code',
        properties: codeProperties,
        data: codeData,
        children: [],
      },
    ],
  }
}

describe('rehypeCodeMeta', () => {
  it('提取语言信息到 data-lang', () => {
    const tree = createPreNode({ className: ['language-javascript'] })
    rehypeCodeMeta()(tree as any)

    expect(tree.properties['data-lang']).toBe('javascript')
  })

  it('从 meta 中提取 title', () => {
    const tree = createPreNode(
      { className: ['language-typescript'] },
      { meta: 'title="app.ts"' }
    )
    rehypeCodeMeta()(tree as any)

    expect(tree.properties['data-lang']).toBe('typescript')
    expect(tree.properties['data-title']).toBe('app.ts')
  })

  it('从 meta 中提取 filename', () => {
    const tree = createPreNode(
      { className: ['language-python'] },
      { meta: "filename='utils.py'" }
    )
    rehypeCodeMeta()(tree as any)

    expect(tree.properties['data-lang']).toBe('python')
    expect(tree.properties['data-title']).toBe('utils.py')
  })

  it('无语言时不添加 data-lang', () => {
    const tree = createPreNode({ className: [] })
    rehypeCodeMeta()(tree as any)

    expect(tree.properties['data-lang']).toBeUndefined()
  })

  it('无 meta 时不添加 data-title', () => {
    const tree = createPreNode({ className: ['language-go'] })
    rehypeCodeMeta()(tree as any)

    expect(tree.properties['data-lang']).toBe('go')
    expect(tree.properties['data-title']).toBeUndefined()
  })

  it('pre 下无 code 子节点时不报错', () => {
    const tree = {
      type: 'element',
      tagName: 'pre',
      properties: {},
      children: [{ type: 'text', value: 'plain text' }],
    }
    expect(() => rehypeCodeMeta()(tree as any)).not.toThrow()
  })

  it('处理嵌套的 pre 节点', () => {
    const tree = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'div',
          children: [
            createPreNode({ className: ['language-bash'] }, { meta: 'title="terminal"' }),
          ],
        },
      ],
    }
    rehypeCodeMeta()(tree as any)

    const pre = (tree.children[0] as any).children[0]
    expect(pre.properties['data-lang']).toBe('bash')
    expect(pre.properties['data-title']).toBe('terminal')
  })

  it('处理无 className 的 code 节点', () => {
    const tree = createPreNode({})
    rehypeCodeMeta()(tree as any)

    expect(tree.properties['data-lang']).toBeUndefined()
  })
})
