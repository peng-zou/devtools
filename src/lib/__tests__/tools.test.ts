import { describe, it, expect } from 'vitest'
import { tools, getToolBySlug } from '../tools'

describe('工具注册表', () => {
  it('应该包含 8 个工具', () => {
    expect(tools).toHaveLength(8)
  })

  it('每个工具应有 name、slug、description、keywords、route', () => {
    for (const tool of tools) {
      expect(tool.name).toBeTruthy()
      expect(tool.slug).toBeTruthy()
      expect(tool.description).toBeTruthy()
      expect(tool.keywords).toBeInstanceOf(Array)
      expect(tool.route).toBeTruthy()
    }
  })

  it('getToolBySlug 应返回正确工具', () => {
    const tool = getToolBySlug('json-formatter')
    expect(tool).toBeDefined()
    expect(tool?.name).toBe('JSON 格式化')
  })

  it('getToolBySlug 对不存在的 slug 返回 undefined', () => {
    expect(getToolBySlug('nonexistent')).toBeUndefined()
  })
})
