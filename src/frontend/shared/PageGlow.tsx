// 页面背景的两个模糊光斑。各页面的位置、颜色、大小不完全一样，用 variant 区分；
// 类名必须是完整的字面量，Tailwind 才能扫描到，不要拼接。

const GLOWS = {
  // 后台各页、登录页
  admin: [
    'pointer-events-none absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-blue-500/10 blur-[120px]',
    'pointer-events-none absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-purple-500/10 blur-[120px]',
  ],
  home: [
    'pointer-events-none absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-blue-500/10 blur-[120px] z-0',
    'pointer-events-none absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-purple-500/10 blur-[120px] z-0',
  ],
  about: [
    'pointer-events-none fixed -top-[20%] -left-[10%] h-[50%] w-[50%] rounded-full bg-purple-500/5 blur-[150px] z-0',
    'pointer-events-none fixed -bottom-[20%] -right-[10%] h-[50%] w-[50%] rounded-full bg-blue-500/5 blur-[150px] z-0',
  ],
  experience: [
    'pointer-events-none fixed -top-[15%] -left-[10%] h-[45%] w-[45%] rounded-full bg-blue-500/5 blur-[150px] z-0',
    'pointer-events-none fixed -bottom-[15%] -right-[10%] h-[45%] w-[45%] rounded-full bg-purple-500/5 blur-[150px] z-0',
  ],
  projects: [
    'pointer-events-none fixed -top-[15%] -right-[10%] h-[45%] w-[45%] rounded-full bg-indigo-500/5 blur-[150px] z-0',
    'pointer-events-none fixed -bottom-[15%] -left-[10%] h-[45%] w-[45%] rounded-full bg-amber-500/5 blur-[150px] z-0',
  ],
  // AI 宠物对话框内部
  dialog: [
    'pointer-events-none absolute -top-[20%] -left-[15%] h-[55%] w-[55%] rounded-full bg-blue-500/10 blur-[110px]',
    'pointer-events-none absolute -bottom-[20%] -right-[15%] h-[55%] w-[55%] rounded-full bg-purple-500/10 blur-[110px]',
  ],
} as const

export function PageGlow({ variant }: { variant: keyof typeof GLOWS }) {
  const [first, second] = GLOWS[variant]
  return (
    <>
      <div className={first} />
      <div className={second} />
    </>
  )
}
