import Link from 'next/link'
import { FiHome, FiEdit3, FiLayers, FiUser } from 'react-icons/fi'

export function NavSidebar() {
  return (
    <nav className="w-[5vw] min-w-[64px] max-w-[80px] h-full border-r border-zinc-900 bg-black/20 flex flex-col items-center py-8 z-50 shrink-0">
      <div className="w-8 h-8 bg-white rounded-xl mb-12 flex items-center justify-center text-black font-black">P</div>
      <div className="flex-1 flex flex-col gap-8 text-zinc-500">
        <Link href="/" className="hover:text-white transition-colors"><FiHome size="1.5rem" /></Link>
        <Link href="/writing" className="hover:text-white transition-colors"><FiEdit3 size="1.5rem" /></Link>
        <Link href="/projects" className="hover:text-white transition-colors"><FiLayers size="1.5rem" /></Link>
      </div>
      <Link href="/about" className="text-zinc-500 hover:text-white mt-auto mb-8"><FiUser size="1.5rem" /></Link>
    </nav>
  )
}
