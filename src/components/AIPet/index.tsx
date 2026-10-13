'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { AIPetDialog } from './AIPetDialog'
import { PERSONA, IDLE_FRAMES, FRAME_DURATION } from './persona'
import { useFrameAnimation } from './useFrameAnimation'

export function AIPet() {
  const [isOpen, setIsOpen] = useState(false)
  const [hovered, setHovered] = useState(false)

  // 悬停时帧率提高，像是被叫到后抬头
  const { src } = useFrameAnimation(
    IDLE_FRAMES,
    hovered ? FRAME_DURATION * 0.6 : FRAME_DURATION,
    !isOpen
  )

  return (
    <>
      <motion.button
        type="button"
        aria-label={PERSONA.bubble}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group fixed right-5 bottom-16 md:bottom-6 z-50 cursor-pointer"
      >
        {/* 名牌气泡 */}
        <div
          className={`
            absolute -top-11 right-0 flex items-center gap-2 whitespace-nowrap
            rounded-full border border-white/10 bg-zinc-900/90 px-4 py-2
            backdrop-blur-lg transition-all duration-300 ease-out
            ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}
          `}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-300">
            {PERSONA.bubble}
          </span>
        </div>

        {/* 立绘 */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          className="relative h-24 w-24"
        >
          <div className="pointer-events-none absolute inset-0 rounded-full bg-blue-500/20 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <Image
            src={src}
            alt={PERSONA.name}
            width={420}
            height={580}
            className="relative h-full w-full object-contain drop-shadow-[0_6px_20px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-110"
            priority
            unoptimized
          />
        </motion.div>
      </motion.button>

      <AIPetDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
