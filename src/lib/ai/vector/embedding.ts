import type { EmbeddingResponse } from '../types'

/**
 * 阿里云百炼 Embedding 客户端
 */
export class AlibabaEmbeddingClient {
  private apiKey: string
  private baseURL: string
  private model: string

  constructor(apiKey: string, model = 'text-embedding-v3') {
    this.apiKey = apiKey
    this.baseURL = 'https://dashscope.aliyuncs.com/api/v1'
    this.model = model
  }

  /**
   * 生成文本向量
   */
  async embed(text: string): Promise<number[]> {
    const response = await fetch(`${this.baseURL}/services/embeddings/text-embedding/text-embedding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        input: {
          texts: [text],
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Alibaba Embedding API error: ${response.status} - ${error}`)
    }

    const data = await response.json()

    // 阿里云百炼返回格式: { output: { embeddings: [{ embedding: number[] }] } }
    const embedding = data.output?.embeddings?.[0]?.embedding

    if (!embedding || !Array.isArray(embedding)) {
      throw new Error('Invalid embedding response format')
    }

    return embedding
  }

  /**
   * 批量生成向量
   */
  async embedBatch(texts: string[]): Promise<number[][]> {
    // 阿里云百炼支持批量，但需要注意单次请求限制
    const batchSize = 25 // 根据API限制调整
    const results: number[][] = []

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize)
      const response = await fetch(`${this.baseURL}/services/embeddings/text-embedding/text-embedding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          input: {
            texts: batch,
          },
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Alibaba Embedding API error: ${response.status} - ${error}`)
      }

      const data = await response.json()
      const embeddings = data.output?.embeddings?.map((e: any) => e.embedding) || []
      results.push(...embeddings)
    }

    return results
  }
}

/**
 * 从环境变量创建客户端
 */
export function createEmbeddingClient(): AlibabaEmbeddingClient {
  const apiKey = process.env.ALIBABA_EMBEDDING_API_KEY

  if (!apiKey) {
    throw new Error('Missing ALIBABA_EMBEDDING_API_KEY environment variable')
  }

  return new AlibabaEmbeddingClient(apiKey)
}
