import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Markdown 在线编辑预览 — 实时渲染 MD 工具 | 开发者工具',
  description: '在线 Markdown 编辑器，支持实时预览渲染效果，随时编辑和查看。',
  openGraph: { title: 'Markdown 在线编辑预览', description: '实时编辑预览，即时查看 Markdown 渲染效果' },
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
