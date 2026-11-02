'use client'

import { useState } from 'react'
import { PERSONA } from './persona'
import { createSSEParser } from './parseSSE'
import type { ChatMessage as Message, IntentSegment } from './types'

/**
 * 对话状态 + 发送逻辑：POST /api/chat，按 SSE 增量解析，边收边更新最后一条 assistant 消息。
 * 发送后先插入一个空的占位气泡；出错时如果占位气泡还空着就复用它显示错误。
 */
export function useChatStream() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const send = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    const userMessage: Message = { role: 'user', content: trimmed, timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // 结构化模式下 assistant 的 content 是空串，回传 history 前用 segments 拼出正文，
    // 否则后端看到的上一轮回复就是空的
    const history = [...messages, userMessage].map(m =>
      m.segments ? { ...m, content: m.segments.map(s => s.content).join('\n\n') } : m
    )

    let placeholderAdded = false

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader available')

      const parser = createSSEParser()
      let assistantMessage = ''
      const segments: IntentSegment[] = []
      let currentSegment: IntentSegment | null = null

      setMessages(prev => [...prev, { role: 'assistant', content: '', timestamp: new Date().toISOString() }])
      placeholderAdded = true

      const handleData = (data: string) => {
        try {
          const parsed = JSON.parse(data)

          // 结构化模式
          if (parsed.type === 'intent_start') {
            currentSegment = {
              type: parsed.intent_type,
              content: '',
            }
          } else if (parsed.type === 'content') {
            if (currentSegment) {
              // 结构化模式：累加到当前 segment
              currentSegment.content += parsed.content
            } else {
              // 纯文本模式（向后兼容）或单 retrieval 快速路径
              assistantMessage += parsed.content
            }

            // 实时更新 UI
            setMessages(prev => {
              const next = [...prev]
              const lastMsg = next[next.length - 1]
              if (currentSegment) {
                // 结构化模式：更新 segments
                const updatedSegments = [...segments]
                if (updatedSegments.length === 0 || updatedSegments[updatedSegments.length - 1] !== currentSegment) {
                  updatedSegments.push(currentSegment)
                }
                next[next.length - 1] = {
                  ...lastMsg,
                  segments: updatedSegments,
                  content: '', // segments 存在时 content 不用
                }
              } else {
                // 纯文本模式
                next[next.length - 1] = {
                  ...lastMsg,
                  content: assistantMessage,
                }
              }
              return next
            })
          } else if (parsed.type === 'intent_end') {
            if (currentSegment) {
              segments.push(currentSegment)
              currentSegment = null
            }
          } else if (parsed.content) {
            // 兜底：旧格式纯文本 SSE（向后兼容）
            assistantMessage += parsed.content
            setMessages(prev => {
              const next = [...prev]
              next[next.length - 1] = {
                role: 'assistant',
                content: assistantMessage,
              }
              return next
            })
          }
        } catch (e) {
          console.error('Failed to parse SSE:', e)
        }
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        parser.push(value).forEach(handleData)
      }
      parser.flush().forEach(handleData)
    } catch (error) {
      // 用 warn 不用 error：这个失败已经通过 UI（errorReply 气泡）呈现给用户了，
      // 不是未处理异常。Next.js dev 模式会把 console.error 弹成全局报错浮层，
      // 叠在对话框上面，看起来像布局错位，其实只是浮层叠加，不是真的样式问题。
      console.warn('Chat error:', error)
      setMessages(prev => {
        const last = prev[prev.length - 1]
        // 占位气泡还是空的就直接复用它显示错误；已经流出部分内容则保留，另起一个气泡
        if (placeholderAdded && last?.role === 'assistant' && !last.content && !last.segments) {
          return [...prev.slice(0, -1), { ...last, content: PERSONA.errorReply }]
        }
        return [...prev, { role: 'assistant', content: PERSONA.errorReply }]
      })
    } finally {
      setIsLoading(false)
    }
  }

  return { messages, isLoading, send }
}
