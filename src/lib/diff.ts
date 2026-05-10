export interface DiffLine {
  type: 'added' | 'removed' | 'unchanged'
  content: string
  lineNum: number
}

export function diffLines(textA: string, textB: string): DiffLine[] {
  const linesA = textA.split('\n')
  const linesB = textB.split('\n')
  const result: DiffLine[] = []
  const maxLen = Math.max(linesA.length, linesB.length)

  for (let i = 0; i < maxLen; i++) {
    if (i >= linesA.length) {
      result.push({ type: 'added', content: linesB[i], lineNum: i + 1 })
    } else if (i >= linesB.length) {
      result.push({ type: 'removed', content: linesA[i], lineNum: i + 1 })
    } else if (linesA[i] !== linesB[i]) {
      result.push({ type: 'removed', content: linesA[i], lineNum: i + 1 })
      result.push({ type: 'added', content: linesB[i], lineNum: i + 1 })
    } else {
      result.push({ type: 'unchanged', content: linesA[i], lineNum: i + 1 })
    }
  }
  return result
}
