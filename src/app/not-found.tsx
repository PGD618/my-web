import Link from 'next/link'
import { FiHome, FiEdit3 } from 'react-icons/fi'
import { StatusPage, STATUS_PRIMARY_BUTTON, STATUS_SECONDARY_BUTTON } from '@/frontend/components/StatusPage'

export default function NotFound() {
  return (
    <StatusPage
      badge="Error_404"
      badgeTone="neutral"
      heading="404"
      headingSize="text-[8rem]"
      description="这个页面不存在，或已被移除。"
      actions={
        <div className="flex items-center justify-center gap-4">
          <Link href="/" className={STATUS_PRIMARY_BUTTON}>
            <FiHome className="w-4 h-4" />
            返回首页
          </Link>
          <Link href="/writing" className={STATUS_SECONDARY_BUTTON}>
            <FiEdit3 className="w-4 h-4" />
            浏览碎片
          </Link>
        </div>
      }
      footer={
        <div className="pt-4">
          <span className="text-[10px] font-mono text-zinc-800 uppercase tracking-[0.3em]">Fragment_not_found</span>
        </div>
      }
    />
  )
}
