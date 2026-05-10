import { describe, it, expect } from 'vitest'
import { formatJSON, compressJSON, validateJSON } from '../json'

describe('formatJSON', () => {
  it('应美化压缩的 JSON', () => {
    const result = formatJSON('{"name":"test","age":18}')
    expect(result.success).toBe(true)
    expect(result.output).toBe('{\n  "name": "test",\n  "age": 18\n}')
  })

  it('对无效 JSON 返回错误', () => {
    const result = formatJSON('{invalid}')
    expect(result.success).toBe(false)
    expect(result.error).toBeTruthy()
  })
})

describe('compressJSON', () => {
  it('应压缩美化的 JSON', () => {
    const result = compressJSON('{\n  "a": 1\n}')
    expect(result.success).toBe(true)
    expect(result.output).toBe('{"a":1}')
  })
})

describe('validateJSON', () => {
  it('有效 JSON 返回 valid true', () => {
    const result = validateJSON('{"valid": true}')
    expect(result.valid).toBe(true)
    expect(result.error).toBeNull()
  })

  it('无效 JSON 返回 valid false 和错误信息', () => {
    const result = validateJSON('{bad json}')
    expect(result.valid).toBe(false)
    expect(result.error).toBeTruthy()
  })
})
