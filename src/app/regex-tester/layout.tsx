import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '正则表达式在线测试 — 实时匹配结果 | 开发者工具',
  description: '在线正则表达式测试工具，支持实时匹配，内置常用正则库（邮箱、手机号、URL等）。',
  openGraph: { title: '正则表达式在线测试', description: '实时匹配、常用正则库，开发者必备' },
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
