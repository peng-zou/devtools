'use client'
import { useState } from 'react'
import { AdBanner } from '@/components/AdBanner'

const COMMON_PATTERNS = [
  { label: '邮箱地址', pattern: /^[\w.-]+@[\w.-]+\.\w+$/g.source },
  { label: '手机号码', pattern: /^1[3-9]\d{9}$/.source },
  { label: 'URL', pattern: /https?:\/\/[\w./-]+/.source },
  { label: '中文汉字', pattern: /[一-龥]+/.source },
  { label: 'IPv4 地址', pattern: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.source },
  { label: '身份证号', pattern: /\d{17}[\dXx]/.source },
]

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [testStr, setTestStr] = useState('')
  const [matches, setMatches] = useState<string[]>([])
  const [error, setError] = useState('')

  const handleTest = () => {
    setError('')
    setMatches([])
    try {
      const regex = new RegExp(pattern, flags)
      const result = testStr.match(regex)
      setMatches(result || [])
      if (!result) setError('无匹配结果')
    } catch (e) {
      setError(e instanceof Error ? e.message : '正则表达式语法错误')
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">正则表达式在线测试</h1>
      <p className="text-gray-600 mb-6">在线正则表达式测试工具，实时匹配，内置常用正则库。</p>

      <AdBanner />

      <div className="mt-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">正则表达式</label>
            <input
              className="w-full p-2 border border-gray-300 rounded-lg font-mono text-sm"
              placeholder="/pattern/"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
            />
          </div>
          <div className="w-24">
            <label className="block text-sm font-medium mb-1">标志</label>
            <input
              className="w-full p-2 border border-gray-300 rounded-lg font-mono text-sm"
              placeholder="g"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">测试文本</label>
          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded-lg font-mono text-sm"
            value={testStr}
            onChange={(e) => setTestStr(e.target.value)}
            placeholder="粘贴要匹配的文本..."
          />
        </div>

        <button onClick={handleTest} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
          测试匹配
        </button>

        {error && <p className="text-sm text-red-600">{error}</p>}

        {matches.length > 0 && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium mb-2">匹配结果（{matches.length} 项）</p>
            <ul className="list-disc list-inside space-y-1">
              {matches.map((m, i) => (
                <li key={i} className="font-mono text-sm">{m}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <p className="text-sm font-medium mb-2">常用正则表达式</p>
          <div className="flex flex-wrap gap-2">
            {COMMON_PATTERNS.map((p) => (
              <button
                key={p.label}
                onClick={() => setPattern(p.pattern)}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
