'use client'
import { useState } from 'react'
import { timestampToDate, dateToTimestamp, nowTimestamp } from '@/lib/timestamp'
import { AdBanner } from '@/components/AdBanner'

export default function TimestampPage() {
  const [tsInput, setTsInput] = useState('')
  const [dateInput, setDateInput] = useState('')
  const [tsResult, setTsResult] = useState('')
  const [dateResult, setDateResult] = useState('')

  const handleTsToDate = () => {
    const ts = parseInt(tsInput)
    if (isNaN(ts)) return
    setDateResult(timestampToDate(ts))
  }

  const handleDateToTs = () => {
    if (!dateInput) return
    setTsResult(String(dateToTimestamp(dateInput)))
  }

  const handleNow = () => {
    const now = nowTimestamp()
    setTsInput(String(now))
    setDateResult(timestampToDate(now))
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Unix 时间戳在线转换</h1>
      <p className="text-gray-600 mb-6">Unix 时间戳与日期时间互转，支持秒和毫秒。</p>
      <AdBanner />
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="font-semibold mb-3">时间戳 → 日期</h2>
          <div className="flex gap-2">
            <input className="flex-1 p-2 border border-gray-300 rounded-lg font-mono text-sm" placeholder="输入 Unix 时间戳" value={tsInput} onChange={(e) => setTsInput(e.target.value)} />
            <button onClick={handleNow} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">当前</button>
          </div>
          <button onClick={handleTsToDate} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">转换</button>
          {dateResult && <div className="mt-2 p-3 bg-gray-50 rounded-lg font-mono text-sm break-all">{dateResult}</div>}
        </div>
        <div>
          <h2 className="font-semibold mb-3">日期 → 时间戳</h2>
          <input className="w-full p-2 border border-gray-300 rounded-lg font-mono text-sm" type="datetime-local" value={dateInput} onChange={(e) => setDateInput(e.target.value)} />
          <button onClick={handleDateToTs} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">转换</button>
          {tsResult && <div className="mt-2 p-3 bg-gray-50 rounded-lg font-mono text-sm">{tsResult}</div>}
        </div>
      </div>
    </main>
  )
}
