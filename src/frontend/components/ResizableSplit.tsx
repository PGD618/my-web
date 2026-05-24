'use client'
import { useState, useRef, useCallback, useEffect } from 'react'

interface ResizableSplitProps {
  left: React.ReactNode
  right: React.ReactNode
  defaultLeftPct?: number
  minLeftPct?: number
  maxLeftPct?: number
}

export default function ResizableSplit({
  left,
  right,
  defaultLeftPct = 18,
  minLeftPct = 12,
  maxLeftPct = 32,
}: ResizableSplitProps) {
  const [mounted, setMounted] = useState(false)
  const [leftWidth, setLeftWidth] = useState(0)
  const [dragging, setDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const pctRef = useRef(defaultLeftPct)

  useEffect(() => {
    const calc = () => {
      if (!containerRef.current) return
      const w = containerRef.current.getBoundingClientRect().width
      const px = Math.round(w * (pctRef.current / 100))
      setLeftWidth(px)
    }
    calc()
    setMounted(true)
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  const getBounds = useCallback(() => {
    if (!containerRef.current) return { minPx: 180, maxPx: 600 }
    const w = containerRef.current.getBoundingClientRect().width
    return {
      minPx: Math.max(180, Math.round(w * (minLeftPct / 100))),
      maxPx: Math.min(600, Math.round(w * (maxLeftPct / 100))),
    }
  }, [minLeftPct, maxLeftPct])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const { minPx, maxPx } = getBounds()
      const newWidth = Math.max(minPx, Math.min(maxPx, e.clientX - rect.left))
      setLeftWidth(newWidth)
      pctRef.current = Math.round((newWidth / rect.width) * 100)
    },
    [dragging, getBounds]
  )

  const handleMouseUp = useCallback(() => {
    setDragging(false)
  }, [])

  useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [dragging, handleMouseMove, handleMouseUp])

  // SSR: use percentage-based CSS; client: use computed pixel width
  const leftStyle = mounted && leftWidth > 0
    ? { width: leftWidth }
    : { width: `${defaultLeftPct}%`, minWidth: `${minLeftPct}%`, maxWidth: `${maxLeftPct}%` }

  return (
    <div ref={containerRef} className="h-full flex overflow-hidden">
      <div style={leftStyle} className="h-full shrink-0">
        {left}
      </div>

      {/* Divider — only show after mount to avoid hydration shift */}
      {mounted && (
        <div
          onMouseDown={handleMouseDown}
          className={`w-[5px] h-full cursor-col-resize shrink-0 relative group transition-colors duration-150 ${
            dragging ? 'bg-blue-500/40' : 'bg-transparent hover:bg-white/10'
          }`}
        >
          <div className="absolute inset-y-0 -left-1 -right-1" />
        </div>
      )}

      <div className="flex-1 h-full min-w-0">
        {right}
      </div>
    </div>
  )
}
