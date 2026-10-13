'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiLock, FiArrowRight } from 'react-icons/fi'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!res.ok) {
        setError('密码错误')
        return
      }

      router.push('/')
      router.refresh()
    } catch {
      setError('登录失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden bg-zinc-950 px-6">
      <div className="pointer-events-none absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-purple-500/10 blur-[120px]" />

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-sm rounded-[32px] border border-white/5 bg-zinc-900/60 p-8 backdrop-blur-xl shadow-2xl shadow-black/60"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-400">
            <FiLock className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wide text-white">管理员登录</h1>
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-600">
              Owner Access
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-[20px] border border-white/10 bg-zinc-950/60 p-2 pl-5 transition-colors focus-within:border-blue-400/40">
          <input
            type="password"
            autoFocus
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="密码"
            className="flex-1 bg-transparent py-2 text-[15px] font-light tracking-wide text-white placeholder:text-zinc-600 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!password || submitting}
            aria-label="登录"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-95 active:scale-90 disabled:bg-white/5 disabled:text-zinc-600 disabled:shadow-none disabled:hover:scale-100"
          >
            <FiArrowRight className="h-[18px] w-[18px]" />
          </button>
        </div>

        {error && (
          <p className="mt-3 text-xs font-light tracking-wide text-red-400">{error}</p>
        )}
      </motion.form>
    </div>
  )
}
