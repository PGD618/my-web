export interface FileTreeNode {
  name: string
  isFolder: boolean
  children: Record<string, FileTreeNode>
  slug: string | null
}

export interface CategoryMeta {
  icon: string
  description: string
}

export const CATEGORY_META: Record<string, CategoryMeta> = {
  '技术沉淀': { icon: '💻', description: '前端、全栈、工程实践' },
  '行业洞察': { icon: '🔭', description: 'AI、创业、行业趋势' },
  '生活手记': { icon: '🌿', description: '成长、日常、感悟' },
  '我的想法': { icon: '💡', description: '三观、价值观、哲学' },
  '面试': { icon: '📋', description: '面试经验与准备' },
}

export function getCategoryMeta(name: string): CategoryMeta {
  return CATEGORY_META[name] ?? { icon: '📁', description: '' }
}

export function buildFileTree(notes: { slug: string }[]): Record<string, FileTreeNode> {
  const tree: Record<string, FileTreeNode> = {}
  notes.forEach((note) => {
    const parts = note.slug.replace(/\\/g, '/').split('/')
    let current = tree

    parts.forEach((part, index) => {
      if (!current[part]) {
        current[part] = {
          name: part,
          isFolder: index !== parts.length - 1,
          children: {},
          slug: index === parts.length - 1 ? note.slug : null,
        }
      }
      current = current[part].children
    })
  })
  return tree
}
