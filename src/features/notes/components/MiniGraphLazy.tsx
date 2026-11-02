'use client'
import dynamic from 'next/dynamic'

export const MiniGraph = dynamic(() => import('@/features/notes/components/MiniGraph'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full bg-zinc-900/20 rounded-[32px] border border-zinc-900 animate-pulse" />
  ),
})
