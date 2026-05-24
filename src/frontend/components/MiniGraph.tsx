'use client'
import ForceGraph2D from 'react-force-graph-2d'
import { useRouter } from 'next/navigation'

export function MiniGraph({ data }: { data: { nodes: any[]; links: any[] } }) {
  const router = useRouter()

  return (
    <div className="h-[300px] w-full bg-zinc-900/20 rounded-[32px] border border-zinc-900 overflow-hidden relative">
      <div className="absolute top-6 left-6 z-10 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
        Local Relationship Graph
      </div>
      <ForceGraph2D
        graphData={data}
        nodeLabel="id"
        nodeColor={() => '#3b82f6'}
        linkColor={() => '#27272a'}
        backgroundColor="rgba(0,0,0,0)"
        width={800}
        height={300}
        onNodeClick={(node: any) => router.push(`/writing/${node.id}`)}
      />
    </div>
  )
}
