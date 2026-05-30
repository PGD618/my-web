'use client'
import React, { useEffect, useState, useMemo } from 'react'
import { Command } from 'cmdk'
import { FiSearch, FiFileText, FiHash, FiClock } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import Fuse from 'fuse.js'
import type { Note } from 'content'

// 从 HTML 内容中提取纯文本，用于全文搜索索引
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export function GlobalSearch({ notes }: { notes: Note[] }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [isMac, setIsMac] = useState(false)
  const router = useRouter()

  // 按最后修改时间降序排列
  const sortedNotes = useMemo(
    () =>
      [...notes].sort(
        (a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
      ),
    [notes]
  )

  // 构建 Fuse.js 全文搜索索引
  const fuse = useMemo(
    () =>
      new Fuse(
        sortedNotes.map((note) => ({
          ...note,
          plainContent: stripHtml(note.content),
        })),
        {
          keys: [
            { name: 'title', weight: 3 },
            { name: 'excerpt', weight: 1.5 },
            { name: 'plainContent', weight: 1 },
          ],
          threshold: 0.3,
          includeMatches: true,
          minMatchCharLength: 2,
        }
      ),
    [sortedNotes]
  )

  useEffect(() => {
    queueMicrotask(() => setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0))
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => {
          if (!prev) setQuery('')
          return !prev
        })
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) setQuery('')
    setOpen(isOpen)
  }

  const onSelect = (slug: string) => {
    setOpen(false)
    router.push(`/writing/${slug}`)
  }

  const results = query.trim().length >= 2 ? fuse.search(query).map((r) => r.item) : null

  const displayNotes = results ?? sortedNotes
  const groupLabel = results ? `搜索结果 (${results.length})` : '最近记录'

  return (
    <>
      <button
        onClick={() => handleOpen(true)}
        className="flex items-center gap-3 px-3 py-2 w-full rounded-xl bg-zinc-900/50 border border-white/5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50 transition-all group"
      >
        <FiSearch className="w-4 h-4" />
        <span className="text-xs font-medium flex-1 text-left uppercase tracking-wider text-nowrap">搜索碎片...</span>
        <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium opacity-100">
          {isMac ? '⌘K' : 'Ctrl+K'}
        </kbd>
      </button>

      <DialogPrimitive.Root open={open} onOpenChange={handleOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" />

          <DialogPrimitive.Content className="fixed left-[50%] top-[10vh] md:top-[15vh] z-101 w-[calc(100%-2rem)] md:w-full max-w-[600px] translate-x-[-50%] outline-none animate-in fade-in zoom-in duration-200">
            <VisuallyHidden>
              <DialogPrimitive.Title>全局搜索</DialogPrimitive.Title>
              <DialogPrimitive.Description>搜索你的笔记</DialogPrimitive.Description>
            </VisuallyHidden>

            <Command className="w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl" shouldFilter={false}>
              <div className="flex items-center border-b border-white/5 px-4">
                <FiSearch className="text-zinc-500 w-5 h-5 shrink-0" />
                <Command.Input
                  autoFocus
                  value={query}
                  onValueChange={setQuery}
                  placeholder="搜索所有碎片..."
                  className="w-full bg-transparent py-4 ml-3 text-sm text-zinc-200 outline-none placeholder:text-zinc-600"
                />
              </div>

              <Command.List className="max-h-[50vh] md:max-h-[350px] overflow-y-auto p-2 scrollbar-hide">
                {displayNotes.length === 0 && (
                  <div className="py-12 text-center text-sm text-zinc-500 font-mono uppercase tracking-widest leading-none">
                    No fragments found.
                  </div>
                )}

                {displayNotes.length > 0 && (
                  <Command.Group heading={groupLabel} className="px-2 pb-2 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600">
                    {displayNotes.map((note) => (
                      <Command.Item
                        key={note.slug}
                        value={note.slug}
                        onSelect={() => onSelect(note.slug)}
                        className="flex items-center gap-3 p-3 rounded-xl cursor-pointer aria-selected:bg-white/5 aria-selected:text-white text-zinc-400 transition-colors min-h-[44px]"
                      >
                        <FiFileText className="w-4 h-4 opacity-50 shrink-0" />
                        <div className="flex flex-col min-w-0 leading-none flex-1">
                          <span className="text-[13px] font-medium truncate">{note.title}</span>
                          {note.excerpt && (
                            <span className="text-[11px] text-zinc-600 mt-1 truncate">
                              {note.excerpt.slice(0, 80)}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <div className="flex items-center gap-1 text-[9px] opacity-30 font-mono whitespace-nowrap overflow-hidden max-w-[100px]">
                            <FiHash /> {note.category}
                          </div>
                          <div className="flex items-center gap-1 text-[9px] opacity-30 font-mono whitespace-nowrap">
                            <FiClock /> {new Date(note.lastModified).toLocaleDateString()}
                          </div>
                        </div>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}
              </Command.List>

              <div className="flex items-center justify-between border-t border-white/5 bg-black/20 px-4 py-3 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                <div className="flex gap-4 italic opacity-50">
                  <span>↑↓ Navigate</span>
                  <span>Enter to Open</span>
                </div>
                <span className="opacity-50 hidden sm:inline">Click Outside or Esc to Close</span>
              </div>
            </Command>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  )
}
