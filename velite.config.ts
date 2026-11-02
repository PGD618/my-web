import path from 'node:path'
import { defineConfig, s } from 'velite'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import rehypeShiki from '@shikijs/rehype'
import { rehypeCodeMeta } from './src/build/rehypeCodeMeta'
import { flattenToc, extractTags, stripMarkdown } from './src/build/markdown'

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

        // 4. 字数统计（中文按字符计数，英文按空格分词，兼容中英混排）
        wordCount: s.custom().transform((_, { meta }) => {
          const content = (meta as any).content as string || ''
          // 去除代码块、行内代码与 HTML 标签，避免污染字数
          const text = content
            .replace(/```[\s\S]*?```/g, '')
            .replace(/`[^`]*`/g, '')
            .replace(/<[^>]*>/g, '')
          // 中日韩统一表意文字，逐字计数
          const cjkCount = (text.match(/[一-龥぀-ヿ]/g) || []).length
          // 剩余的非 CJK 部分按空格分词（英文单词、数字等）
          const nonCjkWords = text
            .replace(/[一-龥぀-ヿ]/g, ' ')
            .split(/\s+/)
            .filter(Boolean).length
          return cjkCount + nonCjkWords
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

        // 7. 分类提取（使用 path.relative 从绝对路径中取相对路径，兼容 Windows）
        category: s.custom().transform((_, { meta }) => {
          const relative = path.relative('content/web', meta.path).replace(/\\/g, '/')
          const parts = relative.split('/')
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