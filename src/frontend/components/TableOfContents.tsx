'use client'

import React, { useEffect, useLayoutEffect, useState, useRef, useCallback } from 'react'

interface TocItem {
  title: string
  url: string
  depth: number
}

const STORAGE_KEY = 'toc-sidebar-width'
const DEFAULT_WIDTH = 224
const MIN_WIDTH = 160
const MAX_WIDTH = 400

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState('')
  // 初始值始终为默认值，保证 SSR/客户端 hydration 一致
  const [width, setWidth] = useState(DEFAULT_WIDTH)
  const [dragging, setDragging] = useState(false)
  const startXRef = useRef(0)
  const startWidthRef = useRef(0)

  // 挂载后从 localStorage 恢复宽度（useLayoutEffect 在绘制前同步执行，避免闪烁）
  useLayoutEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const val = parseInt(saved, 10)
      // eslint-disable-next-line react-hooks/set-state-in-effect -- 恢复持久化状态
      if (val >= MIN_WIDTH && val <= MAX_WIDTH) setWidth(val)
    }
  }, [])

  useEffect(() => {
    const ids = items.map((item) => item.url.slice(1))

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -80% 0px', threshold: 0 }
    )

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [items])

  const handleClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault()
    const id = url.slice(1)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveId(id)
    }
  }

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    startXRef.current = e.clientX
    startWidthRef.current = width
    setDragging(true)
  }, [width])

  useEffect(() => {
    if (!dragging) return

    const handleMouseMove = (e: MouseEvent) => {
      // 向左拖拽 = clientX 减小 = 宽度增大
      const delta = startXRef.current - e.clientX
      const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startWidthRef.current + delta))
      setWidth(newWidth)
    }

    const handleMouseUp = () => {
      setDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [dragging])

  // 拖拽结束后保存宽度
  useEffect(() => {
    if (!dragging) {
      localStorage.setItem(STORAGE_KEY, String(width))
    }
  }, [dragging, width])

  return (
    <aside
      className="hidden xl:block shrink-0 relative"
      style={{ width }}
    >
      {/* 拖拽手柄 */}
      <div
        onMouseDown={handleMouseDown}
        className={`absolute left-0 top-0 bottom-0 w-[5px] cursor-col-resize z-10 transition-colors duration-150 ${
          dragging ? 'bg-blue-500/40' : 'bg-transparent hover:bg-white/10'
        }`}
      />

      <div className="sticky top-8 pl-4">
        <nav className="text-[11px] font-mono">
          <h4 className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-4 font-bold">
            On This Page
          </h4>
          <ul className="space-y-1">
            {items.map((item, index) => {
              const id = item.url.slice(1)
              const isActive = activeId === id
              return (
                <li key={index}>
                  <a
                    href={item.url}
                    onClick={(e) => handleClick(e, item.url)}
                    className={`block py-1 transition-colors leading-tight truncate ${
                      item.depth === 2 ? 'pl-0' : item.depth === 3 ? 'pl-3' : 'pl-6'
                    } ${
                      isActive
                        ? 'text-blue-400'
                        : 'text-zinc-600 hover:text-zinc-300'
                    }`}
                    title={item.title}
                  >
                    {item.title}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
