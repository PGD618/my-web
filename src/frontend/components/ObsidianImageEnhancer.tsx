'use client'
import { useEffect } from 'react'

/**
 * 客户端组件：增强 dangerouslySetInnerHTML 中渲染的 Obsidian 图片。
 * - IntersectionObserver 懒加载 + blur-up 占位效果
 * - 图片加载完成后移除模糊滤镜
 */
export function ObsidianImageEnhancer() {
  useEffect(() => {
    const images = document.querySelectorAll<HTMLImageElement>('img.obsidian-image')
    if (!images.length) return

    images.forEach((img) => {
      // 确保属性存在
      img.loading = 'lazy'
      img.decoding = 'async'

      // 初始模糊占位
      img.style.filter = 'blur(20px)'
      img.style.transition = 'filter 0.6s ease-out, transform 0.5s ease'

      const reveal = () => {
        img.style.filter = 'blur(0)'
      }

      if (img.complete && img.naturalWidth > 0) {
        reveal()
      } else {
        img.addEventListener('load', reveal, { once: true })
      }
    })

    return () => {
      images.forEach((img) => {
        img.removeEventListener('load', () => {})
      })
    }
  }, [])

  return null
}
