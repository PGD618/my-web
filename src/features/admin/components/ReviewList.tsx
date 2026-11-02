'use client'

import { ReactNode } from 'react'

interface ReviewListProps<T> {
  items: T[]
  getKey: (item: T) => string
  renderItem: (item: T) => ReactNode
  emptyLabel: string
}

/**
 * 纯容器 shell，不做通用表格抽象——三个审核页面（待审核/待裁决/事实管理）的字段和
 * 操作都不同，统一 schema 对这个规模的项目是过度设计，每个页面自己决定行内容。
 * getKey 必须返回稳定的 id，不能用下标：列表在操作后会删掉某一项，下标会错位。
 */
export function ReviewList<T>({ items, getKey, renderItem, emptyLabel }: ReviewListProps<T>) {
  if (items.length === 0) {
    return (
      <p className="rounded-[20px] border border-white/5 bg-zinc-950/40 p-6 text-center text-xs font-light tracking-wide text-zinc-600">
        {emptyLabel}
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map(item => (
        <div key={getKey(item)}>{renderItem(item)}</div>
      ))}
    </div>
  )
}
