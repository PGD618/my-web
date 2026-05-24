import { defineConfig, s } from 'velite'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import rehypeShiki from '@shikijs/rehype'

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
              return `<img src="${fileName}" alt="${fileName}" class="obsidian-image" />`
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
        })
      })
    }
  },

  // 针对 s.markdown() 字段的配置
  markdown: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      [
        rehypeShiki as any,
        {
          theme: 'github-dark-dimmed',
          langs: ['javascript', 'typescript', 'go', 'bash', 'html', 'css', 'python'],
        }
      ]
    ]
  },

  // 针对 s.mdx() 字段的配置
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      [rehypeShiki as any, { theme: 'github-dark-dimmed' }] // 3. 添加到 mdx
    ]
  }
})