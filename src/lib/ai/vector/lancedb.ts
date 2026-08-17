import type { SearchResult } from '../types'

/**
 * LanceDB 客户端 - Serverless 模式
 * 通过 HTTP Range Requests 远程访问存储在 R2 的向量数据库
 */
export class LanceDBClient {
  private baseURL: string

  constructor(baseURL: string) {
    // R2 公开访问 URL，例如: https://pub-xxxxx.r2.dev/vectors
    this.baseURL = baseURL.replace(/\/$/, '')
  }

  /**
   * 向量相似度搜索
   * @param query - 查询向量
   * @param limit - 返回结果数量
   */
  async search(query: number[], limit = 5): Promise<SearchResult[]> {
    try {
      // LanceDB 通过 HTTP 访问
      // 实际实现需要根据 LanceDB 的 HTTP API 调整
      const response = await fetch(`${this.baseURL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vector: query,
          limit,
        }),
      })

      if (!response.ok) {
        throw new Error(`LanceDB search failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      return data.results.map((result: any) => ({
        content: result.content,
        metadata: {
          title: result.metadata.title,
          slug: result.metadata.slug,
          category: result.metadata.category,
          tags: result.metadata.tags,
        },
        score: result.score,
      }))
    } catch (error) {
      console.error('LanceDB search error:', error)
      throw error
    }
  }

  /**
   * 使用文本查询（需要先转换为向量）
   */
  async searchByText(
    text: string,
    embeddingFn: (text: string) => Promise<number[]>,
    limit = 5
  ): Promise<SearchResult[]> {
    const vector = await embeddingFn(text)
    return this.search(vector, limit)
  }
}

/**
 * 从环境变量创建客户端
 */
export function createLanceDBClient(): LanceDBClient {
  const baseURL = process.env.R2_PUBLIC_URL

  if (!baseURL) {
    throw new Error('Missing R2_PUBLIC_URL environment variable')
  }

  return new LanceDBClient(baseURL)
}
