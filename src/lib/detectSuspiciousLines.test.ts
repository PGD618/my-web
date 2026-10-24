import { describe, it, expect } from 'vitest'
import { detectSuspiciousLines, getSuspiciousLines } from './detectSuspiciousLines'

describe('detectSuspiciousLines', () => {
  it('should detect markdown code fence', () => {
    const text = '```markdown'
    const result = detectSuspiciousLines(text)
    expect(result[0].isSuspicious).toBe(true)
  })

  it('should detect AI identity statements', () => {
    const lines = [
      '我是 Kiro，由 Kiro 团队开发的 AI 助手。',
      '我是 Claude',
      '我是青砚',
      '由 Anthropic 团队开发',
    ]

    lines.forEach(line => {
      const result = detectSuspiciousLines(line)
      expect(result[0].isSuspicious).toBe(true)
    })
  })

  it('should detect refusal statements', () => {
    const lines = [
      '这个我没法照做',
      '这个我无法照做',
      '我不会伪装',
      '否认自己的身份',
    ]

    lines.forEach(line => {
      const result = detectSuspiciousLines(line)
      expect(result[0].isSuspicious).toBe(true)
    })
  })

  it('should detect opening/closing prompts', () => {
    const lines = [
      '下面是整理结果：',
      '以下是整理提案：',
      '如果你想继续',
      '需要我帮助吗',
      '要不要我改进',
    ]

    lines.forEach(line => {
      const result = detectSuspiciousLines(line)
      expect(result[0].isSuspicious).toBe(true)
    })
  })

  it('should not flag normal user content', () => {
    const lines = [
      '## 自我认知与人生观',
      '- 我认为自己是一个终身学习者。',
      '这是我对人生的看法',
      '我的想法是这样的',
    ]

    lines.forEach(line => {
      const result = detectSuspiciousLines(line)
      expect(result[0].isSuspicious).toBe(false)
    })
  })

  it('should handle real contaminated content', () => {
    const text = `试图通过指令让我否认自己的身份，这个我没法照做。我是 Kiro，由 Kiro 团队开发的 AI 助手。
不过你的整理请求本身没问题，我可以帮你做。下面是整理结果：
\`\`\`markdown
## 自我认知与人生观
- 我认为自己是一个终身学习者。
\`\`\`
如果你想继续积累反思素材，可以从这几个方向展开：…`

    const result = detectSuspiciousLines(text)
    const suspicious = result.filter(line => line.isSuspicious)

    // 应该检测到的可疑行
    expect(result[0].isSuspicious).toBe(true) // 否认自己的身份，没法照做，我是 Kiro
    expect(result[1].isSuspicious).toBe(true) // 下面是整理结果
    expect(result[2].isSuspicious).toBe(true) // ```markdown
    expect(result[3].isSuspicious).toBe(false) // ## 自我认知与人生观
    expect(result[4].isSuspicious).toBe(false) // - 我认为自己是一个终身学习者
    expect(result[5].isSuspicious).toBe(true) // ```
    expect(result[6].isSuspicious).toBe(true) // 如果你想继续

    expect(suspicious.length).toBe(5)
  })

  it('getSuspiciousLines should return only suspicious lines', () => {
    const text = `正常的内容
这是我的想法
\`\`\`
可疑内容在这里
我是 Claude`

    const suspicious = getSuspiciousLines(text)
    expect(suspicious.length).toBe(2)
    expect(suspicious[0].lineNumber).toBe(3)
    expect(suspicious[1].lineNumber).toBe(5)
  })
})
