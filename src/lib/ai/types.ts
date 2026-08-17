/**
 * AI 系统核心类型定义
 */

// LLM 消息类型
export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

// LLM 适配器接口
export interface LLMAdapter {
  /**
   * 流式对话接口
   * @param messages - 对话历史
   * @param context - RAG检索到的上下文
   */
  chat(
    messages: Message[],
    context: string
  ): AsyncIterableIterator<string>
}

// 向量检索结果
export interface SearchResult {
  content: string
  metadata: {
    title: string
    slug: string
    category?: string
    tags?: string[]
  }
  score: number
}

// Embedding 请求
export interface EmbeddingRequest {
  text: string
}

// Embedding 响应
export interface EmbeddingResponse {
  vector: number[]
}

// 向量数据库记录
export interface VectorRecord {
  id: string
  content: string
  vector: number[]
  metadata: {
    title: string
    slug: string
    category?: string
    tags?: string[]
    file_path: string
    updated_at: string
  }
}
