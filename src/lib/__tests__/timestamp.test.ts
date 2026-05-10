import { describe, it, expect } from 'vitest'
import { timestampToDate, dateToTimestamp, nowTimestamp } from '../timestamp'

describe('timestampToDate', () => {
  it('应将 Unix 秒时间戳转为 ISO 日期字符串', () => {
    const result = timestampToDate(0)
    expect(result).toBe('1970-01-01T00:00:00.000Z')
  })
})

describe('dateToTimestamp', () => {
  it('应将 ISO 日期字符串转为秒时间戳', () => {
    expect(dateToTimestamp('1970-01-01T00:00:00.000Z')).toBe(0)
  })
})

describe('nowTimestamp', () => {
  it('应返回当前时间戳（数字）', () => {
    const now = nowTimestamp()
    expect(typeof now).toBe('number')
    expect(now).toBeGreaterThan(1700000000)
  })
})
