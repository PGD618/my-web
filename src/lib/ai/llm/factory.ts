import type { LLMAdapter } from '../types'
import { DeepSeekAdapter } from './deepseek'

export type LLMProvider = 'deepseek' | 'openai' | 'claude'

/**
 * LLM 工厂类 - 支持多模型切换
 */
export class LLMFactory {
  static create(provider: LLMProvider, apiKey: string): LLMAdapter {
    switch (provider) {
      case 'deepseek':
        return new DeepSeekAdapter(apiKey)

      case 'openai':
        // 预留 OpenAI 实现
        throw new Error('OpenAI adapter not implemented yet')

      case 'claude':
        // 预留 Claude 实现
        throw new Error('Claude adapter not implemented yet')

      default:
        throw new Error(`Unknown LLM provider: ${provider}`)
    }
  }

  /**
   * 从环境变量创建默认 LLM
   */
  static createDefault(): LLMAdapter {
    const provider = (process.env.LLM_PROVIDER || 'deepseek') as LLMProvider

    let apiKey: string | undefined

    switch (provider) {
      case 'deepseek':
        apiKey = process.env.DEEPSEEK_API_KEY
        break
      case 'openai':
        apiKey = process.env.OPENAI_API_KEY
        break
      case 'claude':
        apiKey = process.env.ANTHROPIC_API_KEY
        break
    }

    if (!apiKey) {
      throw new Error(`Missing API key for provider: ${provider}`)
    }

    return this.create(provider, apiKey)
  }
}
