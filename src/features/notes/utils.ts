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

// ─── 分类配置（唯一数据源，新增板块只需在此添加一行）───
// 有 slug 的是有独立路由的板块，会出现在 CATEGORIES 里；
// 没有 slug 的（如「面试」）只提供图标和描述，不单独建板块。

const CATEGORY_TABLE = [
  { slug: 'tech', name: '技术沉淀', icon: '💻', description: '前端、全栈、工程实践' },
  { slug: 'insights', name: '行业洞察', icon: '🔭', description: 'AI、创业、行业趋势' },
  { slug: 'life', name: '生活手记', icon: '🌿', description: '成长、日常、感悟' },
  { slug: 'thoughts', name: '我的想法', icon: '💡', description: '三观、价值观、哲学' },
  { slug: null, name: '面试', icon: '📋', description: '面试经验与准备' },
] as const

type RoutedCategory = Extract<(typeof CATEGORY_TABLE)[number], { slug: string }>

export const CATEGORIES = CATEGORY_TABLE.filter((c): c is RoutedCategory => c.slug !== null)

export const CATEGORY_META: Record<string, CategoryMeta> = Object.fromEntries(
  CATEGORY_TABLE.map(c => [c.name, { icon: c.icon, description: c.description }])
)

export function getCategoryMeta(name: string): CategoryMeta {
  return CATEGORY_META[name] ?? { icon: '📁', description: '' }
}

const SLUG_TO_NAME: Record<string, string> = {}
const ROUTED_NAMES = new Set<string>()
CATEGORIES.forEach(c => {
  SLUG_TO_NAME[c.slug] = c.name
  ROUTED_NAMES.add(c.name)
})

export function categorySlugToName(slug: string): string | null {
  // 英文 slug → 中文名（如 "tech" → "技术沉淀"）
  if (SLUG_TO_NAME[slug]) return SLUG_TO_NAME[slug]
  // 中文分类名本身也合法（URL 解码后 slug[0] 直接是 "技术沉淀"）
  if (ROUTED_NAMES.has(slug)) return slug
  return null
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
