import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'UUID 在线生成器 — 批量生成 UUID 和随机字符串 | 开发者工具',
  description: '在线 UUID 生成器，支持批量生成 UUID v4 和自定义长度随机字符串。',
  openGraph: { title: 'UUID 在线生成器', description: '批量生成 UUID v4 和随机字符串' },
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
