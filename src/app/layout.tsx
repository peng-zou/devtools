import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import './globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://devtools-xi-ecru.vercel.app'
const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: '开发者工具 — 免费在线编程工具集',
    template: '%s | 开发者工具',
  },
  description: '免费在线开发者工具集，JSON格式化、正则测试、Base64编解码、色码转换、时间戳转换等实用工具。',
  keywords: '在线工具,开发者工具,JSON格式化,正则测试,Base64,色码转换,时间戳转换',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: '开发者工具',
    title: '开发者工具 — 免费在线编程工具集',
    description: '免费在线开发者工具集，JSON格式化、正则测试、Base64编解码等实用工具。',
  },
  twitter: { card: 'summary_large_image', title: '开发者工具', description: '免费在线开发者工具集' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      {GA_ID && (
        <head>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}></script>
          <script dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${GA_ID}');`
          }} />
        </head>
      )}
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  )
}
