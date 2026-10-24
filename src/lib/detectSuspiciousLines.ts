/**
 * 规则数组：疑似非主人观点的行判断标准
 */
const SUSPICIOUS_PATTERNS = [
  // Markdown 代码围栏
  /^```/,
  // AI 自我身份或拒绝类表述
  /我是\s*(Kiro|Claude|青砚|AI|AI\s*助手)/,
  /我是.*?(团队)?开发的/,
  /否认自己的身份/,
  /没法照做/,
  /无法照做/,
  /不会伪装/,
  /由.*?团队开发/,
  /AI\s*助手/,
  // 开场白和结尾追问
  /下面是整理结果/,
  /以下是整理/,
  /如果你想/,
  /需要我/,
  /要不要我/,
]

export interface SuspiciousLine {
  lineNumber: number
  text: string
  isSuspicious: boolean
}

/**
 * 检测文本中的疑似污染行
 * @param text 输入文本
 * @returns 每一行以及是否可疑的数组
 */
export function detectSuspiciousLines(text: string): SuspiciousLine[] {
  const lines = text.split('\n')
  return lines.map((text, index) => ({
    lineNumber: index + 1,
    text,
    isSuspicious: SUSPICIOUS_PATTERNS.some(pattern => pattern.test(text)),
  }))
}

/**
 * 获取文本中所有可疑行的数组
 */
export function getSuspiciousLines(text: string): SuspiciousLine[] {
  return detectSuspiciousLines(text).filter(line => line.isSuspicious)
}
