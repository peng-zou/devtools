import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Unix 时间戳在线转换 — 秒/毫秒日期互转 | 开发者工具',
  description: 'Unix 时间戳在线转换工具，支持秒和毫秒自动识别，与日期时间互转。',
  openGraph: { title: 'Unix 时间戳在线转换', description: '秒/毫秒自动识别，时间戳日期互转' },
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
