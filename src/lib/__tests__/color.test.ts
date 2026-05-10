import { describe, it, expect } from 'vitest'
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb } from '../color'

describe('hexToRgb', () => {
  it('应将 HEX 转为 RGB', () => {
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 })
  })
  it('应支持短 HEX 格式', () => {
    expect(hexToRgb('#f00')).toEqual({ r: 255, g: 0, b: 0 })
  })
})

describe('rgbToHex', () => {
  it('应将 RGB 转为 HEX', () => {
    expect(rgbToHex(255, 0, 0)).toBe('#ff0000')
  })
})

describe('rgbToHsl', () => {
  it('红色应转为 HSL', () => {
    const result = rgbToHsl(255, 0, 0)
    expect(result.h).toBe(0)
    expect(result.s).toBe(100)
    expect(result.l).toBe(50)
  })
})

describe('hslToRgb', () => {
  it('红色 HSL 应转回 RGB', () => {
    const result = hslToRgb(0, 100, 50)
    expect(result.r).toBe(255)
    expect(result.g).toBe(0)
    expect(result.b).toBe(0)
  })
})
