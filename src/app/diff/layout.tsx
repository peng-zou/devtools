import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '文本差异在线对比 — 代码文档 Diff 工具 | 开发者工具',
  description: '在线文本差异对比工具，逐行比较代码和文档版本差异，差异高亮显示。',
  openGraph: { title: '文本差异在线对比', description: '逐行对比，差异高亮，代码/文档版本对比' },
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
