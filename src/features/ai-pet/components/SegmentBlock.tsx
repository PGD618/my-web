import type { IntentSegment } from './types'
import { FiCheck } from 'react-icons/fi'

export function SegmentBlock({ segment }: { segment: IntentSegment }) {
  return (
    <div
      className={
        segment.type === 'fact_input'
          ? 'rounded-lg border border-green-500/20 bg-green-500/5 p-3'
          : segment.type === 'chitchat'
            ? 'rounded-lg border border-purple-500/20 bg-purple-500/5 p-3'
            : ''
      }
    >
      {segment.type === 'fact_input' && (
        <div className="mb-2 flex items-center gap-2 text-xs text-green-400">
          <FiCheck className="h-3 w-3" />
          <span>已记录</span>
        </div>
      )}
      {segment.type === 'chitchat' && (
        <div className="mb-2 flex items-center gap-2 text-xs text-purple-400">
          <span className="font-medium">💬 闲聊回复</span>
        </div>
      )}
      <p className="whitespace-pre-wrap wrap-break-words">
        {segment.content}
      </p>
    </div>
  )
}
