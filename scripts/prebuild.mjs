// 构建前更新 content 子模块（Obsidian 内容仓库）。
//
// 有 GITHUB_TOKEN 时只通过 `git -c` 给这一条命令临时注入凭据，不写进任何 gitconfig；
// 参数用数组传给 execFileSync，不经过 shell，token 也不会出现在日志里。
// 更新失败不中断构建，退回到仓库里现有的内容。
import { execFileSync } from 'node:child_process'

const token = process.env.GITHUB_TOKEN
const args = []
if (token) {
  args.push('-c', `url.https://x-access-token:${token}@github.com/.insteadOf=https://github.com/`)
}
args.push('submodule', 'update', '--remote', '--merge', 'content')

try {
  execFileSync('git', args, { stdio: ['ignore', 'inherit', 'pipe'] })
} catch (err) {
  // git 的 stderr 可能带着远端 URL，把 token 抹掉再打印
  const detail = String(err.stderr || err.message || '')
  const safe = token ? detail.split(token).join('***') : detail
  console.warn('内容子模块更新失败，使用现有内容')
  if (safe.trim()) console.warn(safe.trim())
}
