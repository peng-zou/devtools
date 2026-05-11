import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Base64 在线编解码 — 文本图片 Base64 转换 | 开发者工具',
  description: '在线 Base64 编码解码工具，支持文本和图片互转，同时支持 URL 编码解码。',
  openGraph: { title: 'Base64 在线编解码', description: '文本/图片 Base64 编解码 + URL 编解码' },
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
