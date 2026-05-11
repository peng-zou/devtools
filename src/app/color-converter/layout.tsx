import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '色码在线转换 — HEX RGB HSL 互转 | 开发者工具',
  description: '在线色码转换工具，HEX、RGB、HSL 实时互转，支持颜色预览和取色器。',
  openGraph: { title: '色码在线转换', description: 'HEX/RGB/HSL 互转，实时颜色预览' },
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
