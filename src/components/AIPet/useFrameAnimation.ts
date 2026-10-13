'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * 预加载候选帧，只保留真实存在的那些，然后循环播放。
 * 这样即便 public/avatar/ 下只有一张立绘也不会出现裂图，
 * 补上 pgd-2.png 之后动画会自动多一帧。
 */
export function useFrameAnimation(
  candidates: readonly string[],
  duration: number,
  playing = true
) {
  const [frames, setFrames] = useState<string[]>(() => candidates.slice(0, 1))
  const [index, setIndex] = useState(0)

  // 探测可用帧
  useEffect(() => {
    let cancelled = false

    const probe = (src: string) =>
      new Promise<string | null>(resolve => {
        const img = new window.Image()
        img.onload = () => resolve(src)
        img.onerror = () => resolve(null)
        img.src = src
      })

    Promise.all(candidates.map(probe)).then(results => {
      if (cancelled) return
      const available = results.filter((src): src is string => src !== null)
      if (available.length > 0) setFrames(available)
    })

    return () => {
      cancelled = true
    }
  }, [candidates])

  // 循环播放
  const frameCount = frames.length
  const lastTick = useRef(0)

  useEffect(() => {
    if (!playing || frameCount < 2) return

    let raf = 0
    const step = (now: number) => {
      if (now - lastTick.current >= duration) {
        lastTick.current = now
        setIndex(i => (i + 1) % frameCount)
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)

    return () => cancelAnimationFrame(raf)
  }, [playing, frameCount, duration])

  // 帧数变化时避免索引越界
  const safeIndex = frameCount > 0 ? index % frameCount : 0

  return { src: frames[safeIndex] ?? candidates[0], frames, index: safeIndex }
}
