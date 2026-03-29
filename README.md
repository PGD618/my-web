# 🌲 Project: Zenith Garden (极客森林)

### **一个基于 Next.js 15 与 Obsidian 工作流的“沉浸式”数字花园**

> **状态：开发初期 (Inception Phase)** —— 正在构建核心内容引擎与视觉系统。

---

## 🧭 项目愿景 (The Vision)

本项目不仅仅是一个个人博客，它是我大脑的**外部索引**。我追求的是一种**“静谧而充实”**的数字空间：
*   **Vercel 审美**: 采用 `Zinc-950` 深色调，配合极细边框（Border-white/10）与微质感动效。
*   **非线性叙事**: 引入 Obsidian 的**双向链接 (Bi-directional Links)** 与 **交互式关系图谱 (Graph View)**，打破传统的列表式阅读。
*   **极致性能**: 利用 Next.js 15 的 Server Components，实现接近零客户端 JS 的阅读体验。

---

## 🛠️ 技术栈 (Tech Stack)

虽然代码尚未完全铺开，但技术蓝图已经确定：

*   **核心框架**: `Next.js 15 (App Router)` + `React 19`
*   **内容引擎**: `Velite` (强类型的 Markdown/Mdx 处理方案，支持自动 Schema 校验)
*   **UI 系统**: `Tailwind CSS v4` + `Shadcn UI` + `Framer Motion`
*   **字体**: `Geist Sans` & `Mono` (Vercel 官方字体，极致的技术感排版)
*   **数据可视化**: `react-force-graph-2d` (用于实现知识图谱)
*   **内容流**: 通过 `Git Submodule` 挂载私有的 **Obsidian** 仓库。

---

## ✨ 核心特性规划 (Roadmap)

### 1. 深度 Obsidian 集成
- [ ] **WikiLinks 支持**: 自动解析 `[[Internal Link]]` 并在页面间建立关联。
- [ ] **自动反向链接 (Backlinks)**: 在文末自动展示引用了当前页面的其他文章。
- [ ] **私有内容同步**: 建立 Git-Sync 自动化流水线，本地 Obsidian 更新，Vercel 自动重构。

### 2. 交互式视觉体验
- [ ] **Bento Grid 主页**: 响应式模块化布局，展示技术栈、最近思考与开源项目。
- [ ] **关系图谱 (Graph View)**: 可视化展现知识节点之间的逻辑链接，支持缩放与点击跳转。
- [ ] **极致代码块**: 基于 `Shiki` 的服务端高亮，支持文件名显示与点击复制。

### 3. 文档流增强
- [ ] **多级树状导航**: 为长篇技术文档提供清晰的层级感。
- [ ] **静态站内搜索**: 使用 `Fumadocs Search` 实现毫秒级响应。

---

## 📂 架构预览 (Proposed Structure)

```text
.
├── content/              # [Submodule] 我的私有笔记仓库
├── src/
│   ├── app/              # Next.js 路由逻辑 (App Router)
│   ├── components/       # UI 组件库 (Bento, Graph, Backlinks)
│   ├── lib/              # 核心逻辑 (双链解析算法、图谱数据处理)
│   └── styles/           # Tailwind 4 全局变量
├── velite.config.ts      # 内容 Schema 定义
└── README.md
```

---

## 🛠️ 开发日志 (Dev Log)

- 暂无

---

## 🖋️ 结语

> "We are what we build."

这不仅是一个作品集，更是一个持续生长的数字生命体。我希望在这里，技术不仅是冷冰冰的代码，而是具有流动感和关联性的知识森林。

---

### **License**
[MIT](./LICENSE) © PGD

