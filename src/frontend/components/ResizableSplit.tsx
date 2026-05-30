'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'

interface ResizableSplitProps {
  left: React.ReactNode
  right: React.ReactNode
  defaultLeftPct?: number
  minLeftPct?: number
  maxLeftPct?: number
}

const MOBILE_BP = 768

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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const pctRef = useRef(defaultLeftPct)

  // 检测视口 & 响应 resize
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BP - 1}px)`)
    const handleChange = () => setIsMobile(mql.matches)
    handleChange()
    mql.addEventListener('change', handleChange)

    const calc = () => {
      if (!containerRef.current) return
      const w = containerRef.current.getBoundingClientRect().width
      const px = Math.round(w * (pctRef.current / 100))
      setLeftWidth(px)
    }
    calc()
    setMounted(true)
    window.addEventListener('resize', calc)
    return () => {
      window.removeEventListener('resize', calc)
      mql.removeEventListener('change', handleChange)
    }
  }, [])

  // 移动端打开侧边栏时锁定背景滚动
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobile, sidebarOpen])

  const getBounds = useCallback(() => {
    if (!containerRef.current) return { minPx: 180, maxPx: 600 }
    const w = containerRef.current.getBoundingClientRect().width
    return {
      minPx: Math.max(180, Math.round(w * (minLeftPct / 100))),
      maxPx: Math.min(600, Math.round(w * (maxLeftPct / 100))),
    }
  }, [minLeftPct, maxLeftPct])

  // ---- Mouse handlers ----
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

  // ---- Touch handlers ----
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!dragging || !containerRef.current) return
      const touch = e.touches[0]
      const rect = containerRef.current.getBoundingClientRect()
      const { minPx, maxPx } = getBounds()
      const newWidth = Math.max(minPx, Math.min(maxPx, touch.clientX - rect.left))
      setLeftWidth(newWidth)
      pctRef.current = Math.round((newWidth / rect.width) * 100)
    },
    [dragging, getBounds]
  )

  const handleTouchEnd = useCallback(() => {
    setDragging(false)
  }, [])

  useEffect(() => {
    if (dragging) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
    }
    return () => {
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [dragging, handleTouchMove, handleTouchEnd])

  const leftStyle = mounted && leftWidth > 0
    ? { width: leftWidth }
    : { width: `${defaultLeftPct}%`, minWidth: `${minLeftPct}%`, maxWidth: `${maxLeftPct}%` }

  // ---- Mobile layout ----
  if (isMobile) {
    return (
      <div className="h-full flex flex-col relative">
        {/* Mobile toggle */}
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="absolute top-3 left-3 z-50 p-2 rounded-xl bg-zinc-900/80 border border-white/10 backdrop-blur-md text-zinc-400 hover:text-white transition-colors"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
        </button>

        {/* Sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar drawer */}
        <aside
          className={`
            fixed top-0 left-0 z-40 h-full w-[80vw] max-w-[320px]
            bg-zinc-950 border-r border-zinc-900
            transition-transform duration-300 ease-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          {left}
        </aside>

        {/* Main content */}
        <div className="flex-1 h-full min-w-0">
          {right}
        </div>
      </div>
    )
  }

  // ---- Desktop layout ----
  return (
    <div ref={containerRef} className="h-full flex overflow-hidden">
      <div style={leftStyle} className="h-full shrink-0">
        {left}
      </div>

      {mounted && (
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className={`w-[5px] h-full cursor-col-resize shrink-0 relative group transition-colors duration-150 ${
            dragging ? 'bg-blue-500/40' : 'bg-transparent hover:bg-white/10'
          }`}
        >
          {/* Wider touch target */}
          <div className="absolute inset-y-0 -left-2 -right-2" />
        </div>
      )}

      <div className="flex-1 h-full min-w-0">
        {right}
      </div>
    </div>
  )
}
