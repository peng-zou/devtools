import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: '开发者工具 — 免费在线编程工具集',
    template: '%s | 开发者工具',
  },
  description: '免费在线开发者工具集，JSON格式化、正则测试、Base64编解码、色码转换、时间戳转换等实用工具。',
  keywords: '在线工具,开发者工具,JSON格式化,正则测试,Base64,色码转换,时间戳转换',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  )
}
