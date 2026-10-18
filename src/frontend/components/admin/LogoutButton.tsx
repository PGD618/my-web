'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiLogOut } from 'react-icons/fi'

/**
 * 清掉 admin_session cookie 并跳回登录页。7 天免登录靠的是浏览器带着这个 cookie，
 * 不是设备绑定——同一浏览器换个人用也会被当成 owner，所以需要一个主动退出的入口。
 *
 * 不用原生 title 属性，换成和 ActionButton/NavSidebar 同一套自绘浮层提示。
 */
export function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)

  async function handleLogout() {
    setLoading(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
    } finally {
      router.push('/admin/login')
      router.refresh()
    }
  }

  return (
    <div className="relative flex items-center justify-center">
      <button
        onClick={handleLogout}
        disabled={loading}
        aria-label="退出登录"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-400 transition-colors hover:border-red-500/30 hover:text-red-400 disabled:opacity-50"
      >
        <FiLogOut className="h-4 w-4" />
      </button>
      <div
        className={`
          absolute top-full mt-2 px-3 py-1.5 rounded-lg
          bg-zinc-900/95 border border-zinc-800/60 backdrop-blur-lg
          text-[11px] font-medium text-zinc-200 whitespace-nowrap
          transition-all duration-200 ease-out pointer-events-none z-50
          ${show && !loading ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}
        `}
      >
        退出登录
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-zinc-900/95" />
      </div>
    </div>
  )
}
