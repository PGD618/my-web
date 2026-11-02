/**
 * 后台页面的红色错误小字。message 为空时不渲染。
 * className 控制外边距，默认 mb-4（页面顶部的全局错误），行内错误传 mt-2 / mt-3。
 */
export function ErrorBanner({ message, className = 'mb-4' }: { message?: string | null; className?: string }) {
  if (!message) return null
  return <p className={`${className} text-xs font-light tracking-wide text-red-400`}>{message}</p>
}
