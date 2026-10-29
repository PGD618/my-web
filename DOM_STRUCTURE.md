# 页面 DOM 层次结构

## 1. 分类管理页面 (AdminSemanticDocumentsClient.tsx)

```
AdminPageShell
├── 背景光斑容器 (pointer-events-none)
├── motion.div (z-10)
│   ├── 标题区 (mb-8)
│   │   ├── 返回按钮 (FiArrowLeft, h-10 w-10)
│   │   ├── 页面图标 (h-10 w-10)
│   │   ├── 标题和副标题
│   │   └── LogoutButton
│   │
│   ├── 自传链接区 (mb-6, text-sm text-blue-300)
│   │   └── Link to /admin/autobiography
│   │       ├── "查看我的自传"
│   │       └── FiArrowRight
│   │
│   ├── 待审核提案提示 (mb-4, 可选)
│   │   └── 琥珀色警告框
│   │
│   ├── 全局错误提示 (mb-4, 可选)
│   │
│   └── ReviewList (items container)
│       └── 每篇文档 (rounded-[20px] border border-white/10 bg-zinc-950/60 p-4)
│           ├── 标题区 (flex justify-between)
│           │   ├── 文档标题 (text-base font-medium)
│           │   ├── 条目数提示 (text-[11px] text-zinc-500)
│           │   └── 操作按钮组 (flex gap-2)
│           │       ├── ActionButton (编辑/保存/取消)
│           │       └── 保存状态处理
│           │
│           ├── 内容可疑提示 (可选, mb-3)
│           │   └── 红色警告框
│           │
│           ├── 条目列表区 (border-t border-white/10 pt-4)
│           │   ├── 条目标签 (text-xs font-mono uppercase)
│           │   └── 条目内容
│           │       └── 每条条目 (flex items-start gap-2)
│           │           ├── "经历"标签 (可选, emerald-700/40)
│           │           ├── "以前认为"标签 (可选, zinc-700/40)
│           │           ├── 条目文本 (text-sm)
│           │           ├── 日期显示 (可选, text-[10px])
│           │           └── 强化计数 (可选, ×N)
│           │
│           ├── 提案审核区 (可选, border-t pt-4)
│           │   ├── "待审核整理提案"标签 (amber-400)
│           │   ├── 提案可疑提示 (可选)
│           │   ├── 提案内容展示 (border border-amber-400/20 bg-amber-500/5 p-3)
│           │   │   └── 每行内容 (text-xs font-mono)
│           │   └── 审核按钮组 (flex gap-2)
│           │       ├── ActionButton "批准，覆盖条目" (primary)
│           │       └── ActionButton "驳回" (danger)
│           │
│           └── 错误提示 (可选, mt-3, text-red-400)
```

## 2. 自传页面 (AdminAutobiographyClient.tsx)

```
AdminPageShell
├── 背景光斑容器 (pointer-events-none)
├── motion.div (z-10)
│   ├── 标题区 (mb-8)
│   │   ├── 返回按钮 (FiArrowLeft)
│   │   ├── 页面图标 (FiBookOpen)
│   │   ├── 标题 "我的自传"
│   │   ├── 副标题 "Autobiography"
│   │   └── LogoutButton
│   │
│   ├── 右上角重建按钮 (absolute top-10 right-6)
│   │   └── ActionButton (FiRefreshCw, 可禁用)
│   │
│   ├── 重建结果提示 (可选, mb-6)
│   │   └── 蓝色信息框 (已规划 X 章, 写入 Y 章, 失败 Z 章)
│   │
│   ├── 空状态提示 (可选)
│   │   └── rounded-[20px] 卡片
│   │       ├── "自传还没有生成，可以点右上角重建"
│   │       └── 重建按钮
│   │
│   ├── 错误提示 (可选)
│   │   └── 红色警告框
│   │
│   ├── 章节列表 (space-y-8 mb-8)
│   │   └── 每个章节 (rounded-[20px] border border-white/10 bg-zinc-950/60 p-6)
│   │       ├── 章节标题 (text-lg font-medium)
│   │       └── 章节正文 (text-sm leading-relaxed text-zinc-200)
│   │
│   ├── 统计行 (text-xs text-zinc-500)
│   │   └── "共 N 条，已编入 M 条，未编入 K 条"
│   │
│   └── 未编入条目折叠区 (可选)
│       └── rounded-[20px] 卡片 (border border-white/10 bg-zinc-950/60 p-4)
│           ├── 标题按钮 (flex items-center gap-2)
│           │   ├── 折叠图标 (FiChevronDown/FiChevronUp)
│           │   ├── "未编入条目"
│           │   └── 计数 (K)
│           │
│           └── 未编入条目列表 (可选展开, space-y-3)
│               └── 每条条目 (flex items-start gap-2, text-xs)
│                   ├── "经历"标签 (可选, emerald-700/40)
│                   ├── 条目文本
│                   └── 分类名 (text-[10px] text-zinc-600)
```

## 3. 后台首页 (AdminDashboardClient.tsx)

```
div (relative h-full overflow-hidden bg-zinc-950)
├── 背景光斑容器 (pointer-events-none)
├── motion.div (z-10)
│   ├── 标题区 (mb-8, flex justify-between)
│   │   ├── "管理后台" (text-sm font-bold)
│   │   └── LogoutButton
│   │
│   └── 入口卡片网格 (grid gap-4 sm:grid-cols-3)
│       └── 每个入口 (Link)
│           └── rounded-[32px] 卡片 (border border-white/5 bg-zinc-900/60 p-6)
│               ├── 图标区 (mb-4, flex justify-between)
│               │   ├── 圆形图标容器 (h-10 w-10)
│               │   │   └── 图标 (h-4 w-4)
│               │   └── 计数徽章 (可选, bg-blue-600)
│               │       └── 数字
│               │
│               ├── 入口标题 (text-sm font-bold)
│               ├── 入口副标题 (text-[10px] font-mono uppercase)
│               └── "查看" 链接 (flex items-center gap-1)
│                   └── FiArrowRight (h-3 w-3)
```
