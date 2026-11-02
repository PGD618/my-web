import type { MouseEvent } from 'react'
import { FiArrowUpRight } from 'react-icons/fi'
import type { Project } from '@/data/projects'

interface ExternalLinksProps {
  links: Project['links']
  rowClassName: string
  linkClassName: string
  /** 箭头只在卡片 hover 时出现（卡片里），还是一直显示（详情抽屉里） */
  arrow: 'on-hover' | 'always'
  /** 卡片整体可点击打开详情，链接点击时要阻止冒泡 */
  stopPropagation?: boolean
  /** 只有 http 开头的链接才新开标签页；默认所有链接都新开 */
  newTabOnlyForHttp?: boolean
}

const stop = (e: MouseEvent) => e.stopPropagation()

export function ExternalLinks({
  links,
  rowClassName,
  linkClassName,
  arrow,
  stopPropagation = false,
  newTabOnlyForHttp = false,
}: ExternalLinksProps) {
  return (
    <div className={rowClassName}>
      {links.map(link => {
        const newTab = !newTabOnlyForHttp || link.url.startsWith('http')
        return (
          <a
            key={link.label}
            href={link.url}
            target={newTab ? '_blank' : undefined}
            rel={newTab ? 'noopener noreferrer' : undefined}
            onClick={stopPropagation ? stop : undefined}
            className={linkClassName}
          >
            {link.icon && <link.icon className="w-3.5 h-3.5" />}
            {link.label}
            <FiArrowUpRight
              className={
                arrow === 'on-hover'
                  ? 'w-3 h-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all'
                  : 'w-3 h-3'
              }
            />
          </a>
        )
      })}
    </div>
  )
}
