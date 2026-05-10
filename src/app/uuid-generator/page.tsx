'use client'
import { useState } from 'react'
import { AdBanner } from '@/components/AdBanner'

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default function UUIDGeneratorPage() {
  const [uuids, setUuids] = useState<string[]>([])
  const [count, setCount] = useState(1)
  const [randomLen, setRandomLen] = useState(16)
  const [randomStrs, setRandomStrs] = useState<string[]>([])

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">UUID 在线生成器</h1>
      <p className="text-gray-600 mb-6">批量生成 UUID v4 和随机字符串。</p>
      <AdBanner />
      <div className="mt-6 space-y-8">
        <div>
          <h2 className="font-semibold mb-3">生成 UUID</h2>
          <div className="flex gap-2 items-end">
            <div>
              <label className="block text-sm mb-1">数量</label>
              <input type="number" min={1} max={50} value={count} onChange={(e) => setCount(+e.target.value)} className="w-24 p-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <button onClick={() => setUuids(Array.from({ length: count }, generateUUID))} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">生成</button>
          </div>
          {uuids.length > 0 && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg font-mono text-sm space-y-1">
              {uuids.map((id, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span>{id}</span>
                  <button onClick={() => navigator.clipboard.writeText(id)} className="text-xs text-blue-600 hover:underline">复制</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h2 className="font-semibold mb-3">生成随机字符串</h2>
          <div className="flex gap-2 items-end">
            <div>
              <label className="block text-sm mb-1">长度</label>
              <input type="number" min={4} max={256} value={randomLen} onChange={(e) => setRandomLen(+e.target.value)} className="w-24 p-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <button onClick={() => setRandomStrs([generateRandomString(randomLen)])} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">生成</button>
          </div>
          {randomStrs.length > 0 && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg font-mono text-sm break-all">{randomStrs[0]}</div>
          )}
        </div>
      </div>
    </main>
  )
}
