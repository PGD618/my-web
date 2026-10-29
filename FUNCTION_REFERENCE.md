# 用到的函数/组件对照表

## 纯函数 (`src/lib/semanticDocumentUtils.ts`)

| 函数名 | 定义位置 | 用途 |
|--------|---------|------|
| `getEntriesList` | semanticDocumentUtils.ts:47-76 | 从NarrativeData中提取条目列表，支持后端兼容 |
| `cleanNarrativeText` | semanticDocumentUtils.ts:78-80 | 清理叙事文本中的`[e:...]`标记 |
| `isExperience` | semanticDocumentUtils.ts:82-84 | 判断条目是否为经历类型 |
| `sortSections` | semanticDocumentUtils.ts:86-89 | 按position排序章节 |
| `generateStatsText` | semanticDocumentUtils.ts:91-93 | 生成统计文案 |
| `filterCategoryDocuments` | semanticDocumentUtils.ts:95-97 | 过滤掉autobiography文档 |
| `removeEntryMarkers` | narrativeUtils.ts:4-6 | 从文本移除`[e:...]`标记 |

## React组件

### AdminSemanticDocumentsClient (`src/frontend/views/AdminSemanticDocumentsClient.tsx`)
| 使用的组件/函数 | 来源 | 行号 |
|----------------|------|------|
| `AdminPageShell` | frontend/components/admin/AdminPageShell.tsx | 7 |
| `ReviewList` | frontend/components/admin/ReviewList.tsx | 8 |
| `ActionButton` | frontend/components/admin/ActionButton.tsx | 9 |
| `detectSuspiciousLines` | lib/detectSuspiciousLines.ts | 10 |
| `getEntriesList` | lib/semanticDocumentUtils.ts | 11 |
| `filterCategoryDocuments` | lib/semanticDocumentUtils.ts | 11 |
| `isExperience` | lib/semanticDocumentUtils.ts | 11 |
| react-icons/fi icons | react-icons | 5 |

### AdminAutobiographyClient (`src/frontend/views/AdminAutobiographyClient.tsx`)
| 使用的组件/函数 | 来源 | 行号 |
|----------------|------|------|
| `AdminPageShell` | frontend/components/admin/AdminPageShell.tsx | 5 |
| `ActionButton` | frontend/components/admin/ActionButton.tsx | 6 |
| `cleanNarrativeText` | lib/semanticDocumentUtils.ts | 7 |
| `generateStatsText` | lib/semanticDocumentUtils.ts | 7 |
| `sortSections` | lib/semanticDocumentUtils.ts | 7 |
| `isExperience` | lib/semanticDocumentUtils.ts | 7 |
| react-icons/fi icons | react-icons | 4 |

### AdminAutobiographyView (`src/frontend/views/AdminAutobiographyView.tsx`)
| 使用的组件 | 来源 |
|----------|------|
| `AdminAutobiographyClient` | frontend/views/AdminAutobiographyClient.tsx |

### AdminDashboardClient (`src/frontend/views/AdminDashboardClient.tsx`)
| 使用的组件 | 来源 | 行号 |
|----------|------|------|
| `LogoutButton` | frontend/components/admin/LogoutButton.tsx | 7 |
| react-icons/fi icons | react-icons | 6 |
| Next.js Link | next/link | 5 |
| framer-motion | framer-motion | 5 |

## API 代理路由

| 路由 | 文件 | 方法 | 代理目标 |
|-----|------|------|--------|
| `/api/admin/autobiography` | src/app/api/admin/autobiography/route.ts | GET | `/admin/autobiography` |
| `/api/admin/autobiography/rebuild` | src/app/api/admin/autobiography/rebuild/route.ts | POST | `/admin/autobiography/rebuild` |

## 新增/修改的数据类型

### AutobiographyData (新增)
```typescript
interface AutobiographyData {
  document_id: string
  sections: NarrativeSection[]
  unnarrated_entries: NarrativeEntry[]
  stats: {
    entries_total: number
    narrated: number
    unnarrated: number
  }
}
```

### NarrativeEntry (扩展)
新增字段:
- `kind?: 'opinion' | 'experience'` - 条目类型
- `occurred_at?: string | null` - 发生时间
- `category?: string` - 所属分类

### NarrativeSection (扩展)
新增字段:
- `position?: number` - 在自传中的位置

## 删除的代码

### 从 AdminSemanticDocumentsClient.tsx 删除
- `expandedNarrative` 状态变量 (第30行)
- `setExpandedNarrative` 状态更新函数
- 叙事折叠按钮及展开逻辑 (原第276-318行)
- 叙事渲染相关代码

### 从导入中删除
- `cleanNarrativeText` (不再需要，因为叙事折叠区被删除)
- `FiChevronDown`, `FiChevronUp` 图标

## 测试覆盖

在 `semanticDocumentUtils.test.ts` 中新增测试:
- `isExperience()` - 3个测试用例 (experience/opinion/missing kind)
- `sortSections()` - 3个测试用例 (正常排序/无position/空数组)
- `generateStatsText()` - 2个测试用例 (正常/零值)
- `filterCategoryDocuments()` - 3个测试用例 (过滤autobiography/兼容无kind/空数组)
- 扩展 `getEntriesList()` - 2个新测试 (kind字段/occurred_at为null)

总计新增8个测试，现有77个测试保持，共85个测试全部通过。
