'use client'
import { useRef, useState, useEffect } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { useRouter } from 'next/navigation'
import type { GraphData } from '@/backend/notes'

function MiniGraph({ data }: { data: GraphData }) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    setDimensions({ width: el.clientWidth, height: el.clientHeight })
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      setDimensions({ width, height })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className="h-[300px] w-full bg-zinc-900/20 rounded-[32px] border border-zinc-900 overflow-hidden relative"
    >
      <div className="absolute top-6 left-6 z-10 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
        Local Relationship Graph
      </div>
      {dimensions.width > 0 && (
        <ForceGraph2D
          graphData={data}
          nodeLabel="id"
          nodeColor={() => '#3b82f6'}
          linkColor={() => '#27272a'}
          backgroundColor="rgba(0,0,0,0)"
          width={dimensions.width}
          height={dimensions.height}
          onNodeClick={(node) => router.push(`/writing/${node.slug ?? node.id}`)}
        />
      )}
    </div>
  )
}

export { MiniGraph }
export default MiniGraph
