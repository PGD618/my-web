'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiLogOut } from 'react-icons/fi'
import { Tooltip } from './Tooltip'

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
      <Tooltip visible={show && !loading} placement="bottom">
        退出登录
      </Tooltip>
    </div>
  )
}
