'use client'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { FiHome, FiEdit3, FiLayers, FiUser, FiClock } from 'react-icons/fi'
import type { IconType } from 'react-icons'

const EASTER_EGG_CLICKS = 5
const EASTER_EGG_WINDOW_MS = 1500

const navItems = [
  { href: '/',       icon: FiHome,   label: 'Home' },
  { href: '/writing', icon: FiEdit3, label: 'Blog' },
  { href: '/projects', icon: FiLayers, label: 'Projects' },
  { href: '/experience', icon: FiClock, label: 'Experience' },
  { href: '/about',   icon: FiUser,  label: 'About' },
]

function NavIcon({ href, icon: Icon, label }: { href: string; icon: IconType; label: string }) {
  const [show, setShow] = useState(false)

  return (
    <Link
      href={href}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      className="relative flex items-center justify-center text-zinc-500 hover:text-white transition-colors duration-300"
    >
      <Icon size="1.5rem" />
      <div
        className={`
          absolute left-full ml-3 px-3 py-1.5 rounded-lg
          bg-zinc-900/95 border border-zinc-800/60 backdrop-blur-lg
          text-[11px] font-medium text-zinc-200 whitespace-nowrap
          transition-all duration-200 ease-out pointer-events-none z-50
          ${show
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-1'
          }
        `}
      >
        {label}
        <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-r-4 border-r-zinc-900/95" />
      </div>
    </Link>
  )
}

function MobileNavItem({ href, icon: Icon, label, active }: { href: string; icon: IconType; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 transition-colors ${
        active ? 'text-blue-400' : 'text-zinc-500 active:text-zinc-300'
      }`}
    >
      <Icon size={18} />
      <span className="text-[9px] font-medium tracking-wide">{label}</span>
    </Link>
  )
}

function LogoEasterEgg() {
  const router = useRouter()
  const clickTimes = useRef<number[]>([])

  const handleClick = () => {
    const now = Date.now()
    clickTimes.current = [...clickTimes.current, now].filter(
      t => now - t <= EASTER_EGG_WINDOW_MS
    )

    if (clickTimes.current.length >= EASTER_EGG_CLICKS) {
      clickTimes.current = []
      router.push('/admin/login')
    }
  }

  return (
    <button
      onClick={handleClick}
      aria-label="PGD618"
      className="w-8 h-8 bg-white rounded-xl mb-12 flex items-center justify-center text-black font-black select-none"
    >
      P
    </button>
  )
}

export function NavSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Desktop: left sidebar */}
      <nav className="hidden md:flex w-[5vw] min-w-[64px] max-w-[80px] h-full border-r border-zinc-900 bg-black/20 flex-col items-center py-8 z-50 shrink-0">
        <LogoEasterEgg />
        <div className="flex-1 flex flex-col items-center gap-8 text-zinc-500">
          {navItems.slice(0, 4).map((item) => (
            <NavIcon key={item.href} {...item} />
          ))}
        </div>
        <div className="mb-8">
          <NavIcon {...navItems[4]} />
        </div>
      </nav>

      {/* Mobile: bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-zinc-950/95 border-t border-zinc-900 backdrop-blur-lg px-2 pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => (
          <MobileNavItem
            key={item.href}
            {...item}
            active={isActive(item.href)}
          />
        ))}
      </nav>
    </>
  )
}
