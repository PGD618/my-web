/**
 * 从文本中移除 [e:...] 标记
 */
export function removeEntryMarkers(text: string): string {
  return text.replace(/\[e:[^\]]+\]/g, '')
}
