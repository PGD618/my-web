'use client'
import Link from 'next/link'
import { useState } from 'react'
import { FiHome, FiEdit3, FiLayers, FiUser, FiClock } from 'react-icons/fi'

const navItems = [
  { href: '/',       icon: FiHome,   label: 'Home' },
  { href: '/writing', icon: FiEdit3, label: 'Blog' },
  { href: '/projects', icon: FiLayers, label: 'Projects' },
  { href: '/experience', icon: FiClock, label: 'Experience' },
  { href: '/about',   icon: FiUser,  label: 'About' },
]

function NavIcon({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
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
        {/* Arrow */}
        <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-r-4 border-r-zinc-900/95" />
      </div>
    </Link>
  )
}

export function NavSidebar() {
  return (
    <nav className="w-[5vw] min-w-[64px] max-w-[80px] h-full border-r border-zinc-900 bg-black/20 flex flex-col items-center py-8 z-50 shrink-0">
      <div className="w-8 h-8 bg-white rounded-xl mb-12 flex items-center justify-center text-black font-black">P</div>
      <div className="flex-1 flex flex-col items-center gap-8 text-zinc-500">
        {navItems.slice(0, 4).map((item) => (
          <NavIcon key={item.href} {...item} />
        ))}
      </div>
      <div className="mb-8">
        <NavIcon {...navItems[4]} />
      </div>
    </nav>
  )
}



