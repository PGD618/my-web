// velite 构建时使用的 markdown 辅助函数，从 velite.config.ts 原样搬出。
/* eslint-disable @typescript-eslint/no-explicit-any */

// 辅助函数：将嵌套的 TOC 拍扁，方便前端渲染
export const flattenToc = (items: any[], depth = 2) => {
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
export const extractTags = (rawContent: string): string[] => {
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
export const stripMarkdown = (raw: string): string => {
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
