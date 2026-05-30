'use client'

import { useEffect } from 'react'

// 代码块增强组件：为页面上所有 <pre> 代码块添加复制按钮和文件名标题
export function CodeBlockEnhancer() {
  useEffect(() => {
    const pres = document.querySelectorAll<HTMLElement>('article pre')
    pres.forEach((pre) => {
      if (pre.getAttribute('data-enhanced')) return
      pre.setAttribute('data-enhanced', 'true')

      const lang = pre.getAttribute('data-lang') || ''
      const title = pre.getAttribute('data-title') || ''

      // 创建工具栏
      const toolbar = document.createElement('div')
      toolbar.className = 'code-toolbar'

      // 文件名/语言标签
      if (title || lang) {
        const label = document.createElement('span')
        label.className = 'code-label'
        label.textContent = title || lang
        toolbar.appendChild(label)
      }

      // 复制按钮
      const btn = document.createElement('button')
      btn.className = 'code-copy-btn'
      btn.setAttribute('aria-label', '复制代码')
      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>'

      btn.addEventListener('click', async () => {
        const code = pre.querySelector('code')?.textContent || pre.textContent || ''
        try {
          await navigator.clipboard.writeText(code)
          btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>'
          btn.classList.add('copied')
          setTimeout(() => {
            btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>'
            btn.classList.remove('copied')
          }, 2000)
        } catch {
          // 忽略复制失败
        }
      })

      toolbar.appendChild(btn)
      pre.insertBefore(toolbar, pre.firstChild)
    })
  })

  return null
}
