import type { Variants } from 'framer-motion'

/** 全站统一的 ease-out-quint 缓动曲线 */
export const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]

/** 页面根容器：子元素依次淡入 */
export function staggerContainer({ stagger, delay }: { stagger: number; delay: number }): Variants {
  return {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  }
}

/** 页面区块：从下方 offset 像素处淡入上移 */
export function fadeUpItem({ offset, duration }: { offset: number; duration: number }): Variants {
  return {
    hidden: { opacity: 0, y: offset },
    show: { opacity: 1, y: 0, transition: { duration, ease: EASE_OUT } },
  }
}
