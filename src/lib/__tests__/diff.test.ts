import { describe, it, expect } from 'vitest'
import { diffLines } from '../diff'

describe('diffLines', () => {
  it('相同文本应全部返回 unchanged 行', () => {
    const result = diffLines('hello\nworld', 'hello\nworld')
    expect(result.length).toBe(2)
    expect(result.every((r) => r.type === 'unchanged')).toBe(true)
    expect(result[0]).toEqual({ type: 'unchanged', content: 'hello', lineNum: 1 })
    expect(result[1]).toEqual({ type: 'unchanged', content: 'world', lineNum: 2 })
  })

  it('应检测到新增行', () => {
    const result = diffLines('line1', 'line1\nline2')
    expect(result.length).toBeGreaterThan(0)
    expect(result.some((r) => r.type === 'added')).toBe(true)
  })

  it('应检测到删除行', () => {
    const result = diffLines('line1\nline2', 'line1')
    expect(result.length).toBeGreaterThan(0)
    expect(result.some((r) => r.type === 'removed')).toBe(true)
  })
})
