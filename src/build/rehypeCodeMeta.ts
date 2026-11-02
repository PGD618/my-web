// Rehype 插件：为 <pre> 元素添加 data-* 属性，用于显示语言和文件名
// 用法: ```js title="app.js" 或 ```typescript filename="utils.ts"

interface HastProperties {
  className?: string[]
  metastring?: string
  [key: string]: unknown
}

interface HastNode {
  type: string
  tagName?: string
  properties?: HastProperties
  children?: HastNode[]
  data?: { meta?: string }
}

export function rehypeCodeMeta() {
  return (tree: HastNode) => {
    visitNode(tree)
  }
}

function visitNode(node: HastNode) {
  if (node.type === 'element' && node.tagName === 'pre') {
    enhancePre(node)
  }
  if (node.children) {
    for (const child of node.children) {
      visitNode(child)
    }
  }
}

function enhancePre(pre: HastNode) {
  const codeNode = pre.children?.find((c) => c.tagName === 'code')
  if (!codeNode) return

  // 提取语言
  const className = codeNode.properties?.className || []
  const langClass = className.find((c) => c.startsWith('language-'))
  const lang = langClass ? langClass.replace('language-', '') : ''

  // 提取 meta 字符串（如 title="app.js"）
  const meta = codeNode.data?.meta || codeNode.properties?.metastring || ''

  // 从 meta 中提取 title 或 filename
  const titleMatch = typeof meta === 'string' ? meta.match(/(?:title|filename)=["']([^"']+)["']/) : null
  const title = titleMatch ? titleMatch[1] : ''

  // 添加 data 属性
  pre.properties = pre.properties || {}
  if (lang) pre.properties['data-lang'] = lang
  if (title) pre.properties['data-title'] = title
}
