'use client'

import { useRef } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  cancelLabel?: string
  confirmLabel?: string
  isDangerous?: boolean
  isLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/**
 * 基于 Radix Dialog：焦点陷阱、Esc 关闭、锁定背景滚动、标题和描述的 aria 关联都由它处理，
 * 不用再手写 id。打开时默认聚焦「取消」，避免误按回车直接执行危险操作。
 */
export function ConfirmDialog({
  isOpen,
  title,
  message,
  cancelLabel = '取消',
  confirmLabel = '确认',
  isDangerous = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  const confirmButtonColor = isDangerous
    ? 'bg-red-600 hover:bg-red-700 active:bg-red-800'
    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={open => !open && onCancel()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <DialogPrimitive.Content
            className="rounded-[20px] border border-white/10 bg-zinc-950/60 p-8 shadow-2xl w-full max-w-sm mx-4 outline-none"
            onOpenAutoFocus={e => {
              e.preventDefault()
              cancelButtonRef.current?.focus()
            }}
          >
            <DialogPrimitive.Title className="text-lg font-medium text-zinc-100 mb-3">{title}</DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-sm text-zinc-300 mb-8 leading-relaxed">
              {message}
            </DialogPrimitive.Description>

            <div className="flex gap-3 justify-end">
              <button
                ref={cancelButtonRef}
                onClick={onCancel}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg border border-white/20 bg-white/5 text-zinc-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${confirmButtonColor}`}
              >
                {isLoading ? '处理中…' : confirmLabel}
              </button>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
