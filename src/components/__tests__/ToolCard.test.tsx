import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ToolCard } from '../ToolCard'
import { tools } from '@/lib/tools'

describe('ToolCard', () => {
  it('应渲染工具名称和描述', () => {
    render(<ToolCard tool={tools[0]} />)
    expect(screen.getByText('JSON 格式化')).toBeInTheDocument()
    expect(screen.getByText(/在线 JSON 格式化/)).toBeInTheDocument()
  })

  it('应包含指向工具页面的链接', () => {
    render(<ToolCard tool={tools[0]} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/json-formatter')
  })
})
