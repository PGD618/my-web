// 后台各接口的响应类型。字段名以 Python 后端为准
// （my-web-agent/src/agent/api/admin.py、memory/models.py）。
//
// 注意：同一张 confirmed_facts 表在不同接口里字段名不同——
// fact-categories 把 content 映射成了 text（CategoryFact），
// disputed-facts 和删除 409 的 referenced_by 保留原名 content（ConfirmedFact / ReferencedFact）。
// 两边是不同接口，不要合成一个类型。

import type { NarrativeEntry } from './autobiography'

// ─── GET /admin/pending-observations ───

export interface PendingObservation {
  id: string
  content: string
  source_excerpt: string
  category: string
  created_at: string
}

// ─── GET /admin/disputed-facts ───

export interface ConfirmedFact {
  id: string
  content: string
  category: string
  disputes_with_id: string | null
}

export interface DisputePair {
  a: ConfirmedFact
  b: ConfirmedFact
}

// ─── DELETE /admin/confirmed-facts/{id} 返回 409 时 detail.referenced_by 的元素 ───

export interface ReferencedFact {
  id: string
  content: string
}

// ─── GET /admin/fact-categories ───

/** fact-categories 接口里的事实：content 字段被映射成了 text */
export interface CategoryFact {
  id: string
  text: string
  status: string
  created_at: string
  updated_at: string
}

export interface FactCategory {
  category: string
  entries: NarrativeEntry[]
  facts: CategoryFact[]
}

export interface FactCategoriesResponse {
  categories: FactCategory[]
}

// ─── GET /admin/profile-cards ───

export interface ProfileCard {
  id: string
  key: string
  value: string
  source: string
  updated_at: string
}

export interface ProfileCardGroup {
  key: string
  entries: ProfileCard[]
}

// ─── POST /admin/autobiography/rebuild ───

/** POST 立即返回：重建在后台跑，进度用 GET /admin/autobiography/rebuild/:id 轮询 */
export interface AutobiographyRebuildJob {
  job_id: string
  status: 'running'
}

/** GET 轮询结果。succeeded 时带 result，failed 时带 error */
export interface AutobiographyRebuildStatus {
  job_id: string
  status: 'running' | 'succeeded' | 'failed'
  result: AutobiographyRebuildResult | null
  error: string | null
}

export interface AutobiographyRebuildResult {
  chapters_planned: number
  chapters_written: number
  chapters_failed: number
}
