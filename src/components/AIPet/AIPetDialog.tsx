'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE_OUT } from '@/frontend/shared/motion'
import { PageGlow } from '@/frontend/shared/PageGlow'
import { FiX } from 'react-icons/fi'
import { PERSONA, IDLE_FRAMES, FRAME_DURATION } from './persona'
import { useFrameAnimation } from './useFrameAnimation'
import { useChatStream } from './useChatStream'
import { MessageBubble } from './MessageBubble'
import { ChatInput } from './ChatInput'

interface AIPetDialogProps {
  isOpen: boolean
  onClose: () => void
}

const SUGGESTIONS = ['你是谁？', '最近在做什么项目？', '聊聊你的技术栈']

export function AIPetDialog({ isOpen, onClose }: AIPetDialogProps) {
  const [input, setInput] = useState('')
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const { messages, isLoading, send } = useChatStream()

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

  // Esc 关闭
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  // 和原来 send() 里的顺序一致：通过空值/加载中检查后才清空输入框
  const submit = (text: string) => {
    if (!text.trim() || isLoading) return
    send(text)
    setInput('')
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
            transition={{ duration: 0.45, ease: EASE_OUT }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-2xl h-[min(640px,85vh)] flex flex-col overflow-hidden rounded-[32px] sm:rounded-[40px] border border-white/5 bg-zinc-900/60 backdrop-blur-xl shadow-2xl shadow-black/60"
          >
            {/* 氛围光斑，沿用首页的处理 */}
            <PageGlow variant="dialog" />

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
                  transition={{ duration: 0.6, delay: 0.15, ease: EASE_OUT }}
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
                        onClick={() => submit(s)}
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-light tracking-wide text-zinc-400 transition-all hover:-translate-y-0.5 hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-blue-300"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {messages.map((msg, idx) => (
                <MessageBubble
                  key={idx}
                  message={msg}
                  index={idx}
                  avatarSrc={avatarSrc}
                  personaName={PERSONA.name}
                  copiedIdx={copiedIdx}
                  onCopy={copyMessage}
                />
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
            <ChatInput
              value={input}
              onChange={setInput}
              onSend={() => submit(input)}
              disabled={isLoading}
              placeholder={`问问${PERSONA.name}…`}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
