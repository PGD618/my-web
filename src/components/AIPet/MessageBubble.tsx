import { motion } from 'framer-motion'
import Image from 'next/image'
import { FiCopy, FiCheck } from 'react-icons/fi'
import type { ChatMessage as Message } from './types'
import { SegmentBlock } from './SegmentBlock'

interface MessageBubbleProps {
  message: Message
  index: number
  avatarSrc: string
  personaName: string
  copiedIdx: number | null
  onCopy: (idx: number, content: string) => void
}

export function MessageBubble({ message, index, avatarSrc, personaName, copiedIdx, onCopy }: MessageBubbleProps) {
  const msg = message

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={`group flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      {msg.role === 'assistant' && (
        <div className="mt-1 mr-3 h-7 w-7 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
          <Image
            src={avatarSrc}
            alt={personaName}
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
              <SegmentBlock key={i} segment={seg} />
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
            onClick={() => onCopy(index, msg.content || msg.segments?.map(s => s.content).join('\n\n') || '')}
            aria-label="复制回答"
            className="mt-2 flex items-center gap-1 text-[11px] font-light tracking-wide text-zinc-600 opacity-0 transition-opacity hover:text-zinc-300 group-hover:opacity-100"
          >
            {copiedIdx === index ? (
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
  )
}
