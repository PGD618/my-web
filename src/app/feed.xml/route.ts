import { getAllNotes } from '@/backend/notes'
import RSS from 'rss'

export async function GET() {
  const baseUrl = 'https://pgdream.cn'

  const feed = new RSS({
    title: 'PGD618 Digital Garden',
    description: '技术沉淀、行业洞察与思考碎片 — 来自 PGD 的个人数字花园',
    feed_url: `${baseUrl}/feed.xml`,
    site_url: baseUrl,
    language: 'zh-CN',
    ttl: 60, // 建议 RSS 阅读器每 60 分钟刷新一次
    pubDate: new Date(),
  })

  // 获取最近 20 篇笔记，按修改时间降序
  const recentNotes = getAllNotes()
    .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
    .slice(0, 20)

  recentNotes.forEach((note) => {
    feed.item({
      title: note.title,
      description: note.excerpt || note.plainContent?.slice(0, 200) + '...' || '',
      url: `${baseUrl}/writing/${note.slug}`,
      guid: note.slug, // 全局唯一标识符
      categories: [note.category, ...(note.tags || [])],
      date: new Date(note.lastModified),
      author: 'PGD',
    })
  })

  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      // CDN 缓存 1 小时，过期后仍可使用旧版本（stale-while-revalidate 24 小时）
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
