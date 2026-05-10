import { describe, it, expect } from 'vitest'
import { encodeBase64, decodeBase64, isBase64, encodeURL, decodeURL } from '../base64'

describe('encodeBase64', () => {
  it('应将 UTF-8 文本编码为 Base64', () => {
    expect(encodeBase64('Hello')).toBe('SGVsbG8=')
  })
  it('应处理中文字符', () => {
    const encoded = encodeBase64('你好')
    expect(encoded).toBeTruthy()
    expect(typeof encoded).toBe('string')
  })
})

describe('decodeBase64', () => {
  it('应将 Base64 解码为原文', () => {
    expect(decodeBase64('SGVsbG8=')).toBe('Hello')
  })
  it('对无效 Base64 返回 null', () => {
    expect(decodeBase64('!!!invalid!!!')).toBeNull()
  })
})

describe('isBase64', () => {
  it('应对有效的 Base64 返回 true', () => {
    expect(isBase64('SGVsbG8=')).toBe(true)
  })
  it('应对无效字符串返回 false', () => {
    expect(isBase64('!!!')).toBe(false)
  })
  it('应对空字符串返回 true', () => {
    expect(isBase64('')).toBe(true)
  })
})

describe('encodeURL', () => {
  it('应编码 URL 字符串', () => {
    expect(encodeURL('https://example.com?q=hello world')).toBe('https%3A%2F%2Fexample.com%3Fq%3Dhello%20world')
  })
})

describe('decodeURL', () => {
  it('应解码 URL 字符串', () => {
    expect(decodeURL('https%3A%2F%2Fexample.com')).toBe('https://example.com')
  })
})
