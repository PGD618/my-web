import { defineConfig, s } from 'velite'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import rehypeShiki from '@shikijs/rehype'
import { rehypeCodeMeta } from './src/backend/rehypeCodeMeta'

// 辅助函数：将嵌套的 TOC 拍扁，方便前端渲染
const flattenToc = (items: any[], depth = 2) => {
  const result: any[] = []
  items.forEach(item => {
    result.push({ title: item.title, url: item.url, depth })
    if (item.items && item.items.length > 0) {
      result.push(...flattenToc(item.items, depth + 1))
    }
  })
  return result
}

// 从原始 markdown 内容中提取标签
// 支持：YAML frontmatter 的 tags/tag 字段 + 行内 #tag 语法
const extractTags = (rawContent: string): string[] => {
  const tags = new Set<string>()

  // 1. 尝试解析 YAML frontmatter 中的 tags
  const frontmatterMatch = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (frontmatterMatch) {
    const yaml = frontmatterMatch[1]
    // 匹配 tags: [tag1, tag2] 或 tags:\n  - tag1\n  - tag2
    const tagsArrayMatch = yaml.match(/^tags?:\s*\[([^\]]+)\]/mi)
    if (tagsArrayMatch) {
      tagsArrayMatch[1].split(',').forEach(t => {
        const tag = t.trim().replace(/^["']|["']$/g, '')
        if (tag) tags.add(tag)
      })
    }
    const tagsListMatch = yaml.match(/^tags?:\s*\n((?:\s*-\s*.+\n?)+)/mi)
    if (tagsListMatch) {
      tagsListMatch[1].split('\n').forEach(line => {
        const match = line.match(/^\s*-\s*(.+)/)
        if (match) {
          const tag = match[1].trim().replace(/^["']|["']$/g, '')
          if (tag) tags.add(tag)
        }
      })
    }
    // 单行格式: tags: tag1
    const tagsSingleMatch = yaml.match(/^tags?:\s*([^\[\n]+)$/mi)
    if (tagsSingleMatch && !tagsArrayMatch) {
      const tag = tagsSingleMatch[1].trim().replace(/^["']|["']$/g, '')
      if (tag) tags.add(tag)
    }
  }

  // 2. 提取行内 #tag 语法（排除代码块中的 #）
  const withoutCodeBlocks = rawContent.replace(/```[\s\S]*?```/g, '').replace(/`[^`]+`/g, '')
  const inlineTagMatches = withoutCodeBlocks.matchAll(/(?:^|\s)#([a-zA-Z\u4e00-\u9fa5][\w\u4e00-\u9fa5/-]*)/g)
  for (const match of inlineTagMatches) {
    tags.add(match[1])
  }

  return Array.from(tags)
}

// 从 markdown 原文中提取纯文本，用于构建搜索索引
const stripMarkdown = (raw: string): string => {
  return raw
    .replace(/```[\s\S]*?```/g, '')       // 代码块
    .replace(/`[^`]*`/g, '')              // 行内代码
    .replace(/<[^>]*>/g, '')              // HTML 标签
    .replace(/!\[\[([^\]|]*)(?:\|[^\]]*)?\]\]/g, '$1')  // ![[image|size]] → image
    .replace(/\[\[([^\]|]*)(?:\|([^\]]*))?\]\]/g, '$2')  // [[link|alias]] → alias
    .replace(/^#{1,6}\s+/gm, '')          // 标题标记
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')             // 粗体/斜体
    .replace(/_{1,3}([^_]+)_{1,3}/g, '$1')               // 下划线
    .replace(/~~([^~]+)~~/g, '$1')        // 删除线
    .replace(/^\s*[-*+]\s+/gm, '')        // 无序列表
    .replace(/^\s*\d+\.\s+/gm, '')        // 有序列表
    .replace(/^\s*>\s?/gm, '')            // 引用块
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')            // ![alt](url)
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')             // [text](url)
    .replace(/\n{2,}/g, '\n')
    .trim()
}

export default defineConfig({
  // 根目录指向子模块中的 web 文件夹
  root: 'content/web',

  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash].[ext]',
    clean: true
  },

  collections: {
    notes: {
      name: 'Note',
      pattern: '**/*.md',
      schema: s.object({
        // 1. 标题提取
        title: s.string().optional().transform((val, { meta }) => {
          if (val) return val
          const normalizedPath = meta.path.replace(/\\/g, '/')
          const fileName = normalizedPath.split('/').pop() || 'Untitled'
          return fileName.replace(/\.md$/, '')
        }),

        // 2. Slug 处理
        slug: s.path().transform(p => p.replace(/\\/g, '/')),

        // --- 核心修复：处理 Obsidian 特有语法 ---
        content: s.markdown().transform((html, { meta }) => {
          // A. 处理 Obsidian 图片语法 ![[image.png]] 或 ![[image.png|100]]
          let processed = html.replace(
            /!\[\[(.*?)\]\]/g,
            (_, target) => {
              const [fileName] = target.split('|')
              // 转换为标准 img 标签。Velite 会自动处理资源路径并在编译时拷贝 assets
              return `<img src="${fileName}" alt="${fileName}" class="obsidian-image" loading="lazy" decoding="async" />`
            }
          )

          // B. 处理 WikiLinks [[Link]] 或 [[Link|Alias]] 变成 <a> 标签
          processed = processed.replace(
            /\[\[(.*?)\]\]/g,
            (_, target) => {
              const [link, alias] = target.split('|')
              // 处理路径中的反斜杠，并生成 Web 路由
              const slug = link.replace(/\\/g, '/')
              return `<a href="/writing/${slug}" class="internal-link">${alias || link}</a>`
            }
          )

          return processed
        }),

        excerpt: s.excerpt(),

        // 3. 最后修改时间
        lastModified: s.custom().transform((_, { meta }) => {
          const stats = (meta as any).stats
          return stats?.mtime ? new Date(stats.mtime).toISOString() : new Date().toISOString()
        }),

        // 4. 字数统计
        wordCount: s.custom().transform((_, { meta }) => {
          const content = (meta as any).content as string || ''
          return content.split(/\s+/g).length || 0
        }),

        // 5. 目录处理
        toc: s.toc().transform(items => flattenToc(items)),

        // 6. 提取双向链接 (Backlinks 逻辑支持)
        outboundLinks: s.custom().transform((_, { meta }) => {
          const content = meta.content as string
          if (!content) return []
          const matches = content.matchAll(/\[\[(.*?)\]\]/g)
          return Array.from(matches).map(m => m[1].split('|')[0])
        }),

        // 7. 分类提取
        category: s.custom().transform((_, { meta }) => {
          const normalizedPath = meta.path.replace(/\\/g, '/')
          const parts = normalizedPath.split('/')
          return parts.length > 1 ? parts[0] : 'General'
        }),

        // 8. 标签提取（frontmatter + 行内 #tag）
        tags: s.custom().transform((_, { meta }) => {
          const rawContent = (meta as any).content || ''
          return extractTags(rawContent)
        }),

        // 9. 纯文本内容（构建时预计算，用于全文搜索索引）
        plainContent: s.custom().transform((_, { meta }) => {
          const rawContent = (meta as any).content || ''
          return stripMarkdown(rawContent)
        }),

        // 10. 置顶标记（frontmatter 中 pinned: true）
        pinned: s.boolean().optional().default(false)
      })
    }
  },

  // 针对 s.markdown() 字段的配置
  markdown: {
    remarkPlugins: [remarkGfm, remarkBreaks],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      [
        rehypeShiki as any,
        {
          theme: 'github-dark-dimmed',
          langs: ['javascript', 'typescript', 'go', 'bash', 'html', 'css', 'python'],
        }
      ],
      rehypeCodeMeta as any
    ]
  },

  // 针对 s.mdx() 字段的配置
  mdx: {
    remarkPlugins: [remarkGfm, remarkBreaks],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      [rehypeShiki as any, { theme: 'github-dark-dimmed' }],
      rehypeCodeMeta as any
    ]
  }
})