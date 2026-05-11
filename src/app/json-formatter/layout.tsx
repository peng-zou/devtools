import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JSON 在线格式化 — 免费 JSON 校验压缩工具',
  description: '在线 JSON 格式化工具，支持 JSON 美化、压缩、校验，自动检测语法错误并定位。',
  openGraph: { title: 'JSON 在线格式化', description: '免费在线 JSON 格式化、校验、压缩工具' },
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
