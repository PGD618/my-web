// AI 宠物对话的消息类型，前端对话框和 /api/chat 路由共用。

export interface IntentSegment {
  type: 'fact_input' | 'retrieval' | 'chitchat'
  content: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  segments?: IntentSegment[]  // 结构化模式
  // ISO8601，agent 侧会话护栏（超过 2 小时未活动自动重置）用它判断时长，
  // 见 my-web-agent/src/agent/memory/short_term.py。
  timestamp?: string
}

export interface ChatRequest {
  messages: ChatMessage[]
}
