'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { FiX, FiArrowUp, FiCopy, FiCheck } from 'react-icons/fi'
import { PERSONA, IDLE_FRAMES, FRAME_DURATION } from './persona'
import { useFrameAnimation } from './useFrameAnimation'

interface IntentSegment {
  type: 'fact_input' | 'retrieval' | 'chitchat'
  content: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  segments?: IntentSegment[]  // 结构化模式
}

interface AIPetDialogProps {
  isOpen: boolean
  onClose: () => void
}

const SUGGESTIONS = ['你是谁？', '最近在做什么项目？', '聊聊你的技术栈']

export function AIPetDialog({ isOpen, onClose }: AIPetDialogProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const copyMessage = async (idx: number, content: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(prev => (prev === idx ? null : prev)), 1500)
  }

  // 思考时立绘加速播放
  const { src: avatarSrc } = useFrameAnimation(
    IDLE_FRAMES,
    isLoading ? FRAME_DURATION / 2 : FRAME_DURATION,
    isOpen
  )

  // 直接设置 scrollTop，不用 scrollIntoView({ behavior: 'smooth' })——流式输出时
  // messages 每收到一个 token 就变化一次，smooth 滚动动画会和消息气泡自己的
  // framer-motion 入场位移动画（y: 10 -> 0）同时跑，两个独立的位移叠在一起，
  // 看起来就是"先往上滚一下再定住"。直接跳到底部不会有这个问题。
  useEffect(() => {
    const container = messagesContainerRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [messages, isLoading])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  // 输入框随内容弹性伸缩（参考 Claude Code 输入框）：每次内容变化先把高度重置成
  // auto 再读 scrollHeight 设回去，不能跳过"重置成 auto"这一步，否则 scrollHeight
  // 读到的是旧高度，内容变短时框不会缩回去。max-h-28 + custom-scrollbar 负责
  // 到达上限后的滚动，这里只管"没到上限时跟着内容涨"。
  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [input])

  // Esc 关闭
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  const send = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    const userMessage: Message = { role: 'user', content: trimmed }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader available')

      const decoder = new TextDecoder()
      let assistantMessage = ''
      let segments: IntentSegment[] = []
      let currentSegment: IntentSegment | null = null

      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') continue

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
      }
    } catch (error) {
      // 用 warn 不用 error：这个失败已经通过 UI（errorReply 气泡）呈现给用户了，
      // 不是未处理异常。Next.js dev 模式会把 console.error 弹成全局报错浮层，
      // 叠在对话框上面，看起来像布局错位，其实只是浮层叠加，不是真的样式问题。
      console.warn('Chat error:', error)
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: PERSONA.errorReply },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-100 flex items-center justify-center bg-zinc-950/80 backdrop-blur-md p-4 sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-2xl h-[min(640px,85vh)] flex flex-col overflow-hidden rounded-[32px] sm:rounded-[40px] border border-white/5 bg-zinc-900/60 backdrop-blur-xl shadow-2xl shadow-black/60"
          >
            {/* 氛围光斑，沿用首页的处理 */}
            <div className="pointer-events-none absolute -top-[20%] -left-[15%] h-[55%] w-[55%] rounded-full bg-blue-500/10 blur-[110px]" />
            <div className="pointer-events-none absolute -bottom-[20%] -right-[15%] h-[55%] w-[55%] rounded-full bg-purple-500/10 blur-[110px]" />

            {/* ═══ 头部 ═══ */}
            <header className="relative z-10 flex items-center justify-between gap-4 px-6 sm:px-8 py-5 border-b border-white/5">
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <Image
                    src={avatarSrc}
                    alt={PERSONA.name}
                    width={120}
                    height={120}
                    className="h-full w-full object-contain"
                    unoptimized
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="flex items-baseline gap-2 text-lg font-bold tracking-wide text-white">
                    {PERSONA.name}
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-600">
                      {PERSONA.latin}
                    </span>
                  </h2>
                  <p className="truncate text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500">
                    {PERSONA.title} · {PERSONA.tagline}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="关闭对话"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                <FiX className="h-4 w-4" />
              </button>
            </header>

            {/* ═══ 消息区 ═══ */}
            <div
              ref={messagesContainerRef}
              className="custom-scrollbar relative z-10 flex-1 space-y-5 overflow-y-auto px-6 sm:px-8 py-6"
            >
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
                  className="flex h-full flex-col items-center justify-center gap-6 text-center"
                >
                  <div className="h-28 w-28 opacity-90 drop-shadow-[0_8px_30px_rgba(59,130,246,0.25)]">
                    <Image
                      src={avatarSrc}
                      alt={PERSONA.name}
                      width={420}
                      height={580}
                      className="h-full w-full object-contain"
                      unoptimized
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-bold tracking-wide text-white">
                      {PERSONA.greeting}
                    </p>
                    <p className="mx-auto max-w-sm text-sm font-light leading-relaxed tracking-wide text-zinc-500">
                      {PERSONA.greetingSub}
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {SUGGESTIONS.map(s => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-light tracking-wide text-zinc-400 transition-all hover:-translate-y-0.5 hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-blue-300"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className={`group flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="mt-1 mr-3 h-7 w-7 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                      <Image
                        src={avatarSrc}
                        alt={PERSONA.name}
                        width={80}
                        height={80}
                        className="h-full w-full object-contain"
                        unoptimized
                      />
                    </div>
                  )}
                  <div
                    className={
                      msg.role === 'user'
                        ? 'max-w-[82%] rounded-[22px] rounded-br-lg bg-blue-600 px-5 py-3 text-[15px] leading-relaxed tracking-wide text-white shadow-lg shadow-blue-500/20'
                        : 'max-w-[82%] rounded-[22px] rounded-bl-lg border border-white/5 bg-zinc-900/60 px-5 py-3 text-[15px] leading-relaxed tracking-wide text-zinc-200 backdrop-blur-sm'
                    }
                  >
                    {msg.segments ? (
                      // 结构化模式：每个 segment 独立渲染
                      <div className="space-y-3">
                        {msg.segments.map((seg, i) => (
                          <div
                            key={i}
                            className={
                              seg.type === 'fact_input'
                                ? 'rounded-lg border border-green-500/20 bg-green-500/5 p-3'
                                : seg.type === 'chitchat'
                                  ? 'rounded-lg border border-purple-500/20 bg-purple-500/5 p-3'
                                  : ''
                            }
                          >
                            {seg.type === 'fact_input' && (
                              <div className="mb-2 flex items-center gap-2 text-xs text-green-400">
                                <FiCheck className="h-3 w-3" />
                                <span>已记录</span>
                              </div>
                            )}
                            {seg.type === 'chitchat' && (
                              <div className="mb-2 flex items-center gap-2 text-xs text-purple-400">
                                <span className="font-medium">💬 闲聊回复</span>
                              </div>
                            )}
                            <p className="whitespace-pre-wrap wrap-break-words">
                              {seg.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      // 纯文本模式（向后兼容）
                      <p className="whitespace-pre-wrap wrap-break-words">
                        {msg.content}
                      </p>
                    )}
                    {msg.role === 'assistant' && (msg.content || msg.segments) && (
                      <button
                        onClick={() => copyMessage(idx, msg.content || msg.segments?.map(s => s.content).join('\n\n') || '')}
                        aria-label="复制回答"
                        className="mt-2 flex items-center gap-1 text-[11px] font-light tracking-wide text-zinc-600 opacity-0 transition-opacity hover:text-zinc-300 group-hover:opacity-100"
                      >
                        {copiedIdx === idx ? (
                          <>
                            <FiCheck className="h-3 w-3 text-green-400" />
                            <span className="text-green-400">已复制</span>
                          </>
                        ) : (
                          <>
                            <FiCopy className="h-3 w-3" />
                            复制
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

              {isLoading && messages[messages.length - 1]?.content === '' && (
                <div className="flex justify-start pl-10">
                  <div className="flex items-center gap-3 rounded-[22px] rounded-bl-lg border border-white/5 bg-zinc-900/60 px-5 py-3 backdrop-blur-sm">
                    <span className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-blue-400"
                          animate={{ opacity: [0.25, 1, 0.25] }}
                          transition={{
                            duration: 1.1,
                            repeat: Infinity,
                            delay: i * 0.18,
                            ease: 'easeInOut',
                          }}
                        />
                      ))}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
                      {PERSONA.thinking}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* ═══ 输入区 ═══ */}
            <div className="relative z-10 border-t border-white/5 px-6 sm:px-8 py-5">
              <div className="flex items-end gap-3 rounded-[24px] border border-white/10 bg-zinc-950/60 p-2 pl-5 transition-colors focus-within:border-blue-400/40">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`问问${PERSONA.name}…`}
                  rows={1}
                  disabled={isLoading}
                  className="custom-scrollbar max-h-28 flex-1 resize-none self-center bg-transparent py-2 text-[15px] font-light tracking-wide text-white placeholder:text-zinc-600 focus:outline-none disabled:opacity-50"
                />
                <button
                  onClick={() => send(input)}
                  disabled={!input.trim() || isLoading}
                  aria-label="发送"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-95 active:scale-90 disabled:bg-white/5 disabled:text-zinc-600 disabled:shadow-none disabled:hover:scale-100"
                >
                  <FiArrowUp className="h-[18px] w-[18px]" />
                </button>
              </div>
              <p className="mt-3 text-center text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-700">
                Enter 发送 · Shift + Enter 换行 · Esc 关闭
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
