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

// ─── 分类路由配置（新增板块只需在此添加一行）───

export const CATEGORIES = [
  { slug: 'tech', name: '技术沉淀', icon: '💻', description: '前端、全栈、工程实践' },
  { slug: 'insights', name: '行业洞察', icon: '🔭', description: 'AI、创业、行业趋势' },
  { slug: 'life', name: '生活手记', icon: '🌿', description: '成长、日常、感悟' },
  { slug: 'thoughts', name: '我的想法', icon: '💡', description: '三观、价值观、哲学' },
] as const

const SLUG_TO_NAME: Record<string, string> = {}
const NAME_TO_SLUG: Record<string, string> = {}
CATEGORIES.forEach(c => {
  SLUG_TO_NAME[c.slug] = c.name
  NAME_TO_SLUG[c.name] = c.slug
})

export function categorySlugToName(slug: string): string | null {
  return SLUG_TO_NAME[slug] ?? null
}

export function categoryNameToSlug(name: string): string | null {
  return NAME_TO_SLUG[name] ?? null
}

export function resolveNotePath(segments: string[]): string {
  const first = segments[0]
  const chineseName = SLUG_TO_NAME[first]
  if (chineseName) {
    return [chineseName, ...segments.slice(1)].join('/')
  }
  return segments.join('/')
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
