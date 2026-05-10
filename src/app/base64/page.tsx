'use client'
import { useState } from 'react'
import { encodeBase64, decodeBase64, encodeURL, decodeURL } from '@/lib/base64'
import { AdBanner } from '@/components/AdBanner'

type Mode = 'base64-encode' | 'base64-decode' | 'url-encode' | 'url-decode'

export default function Base64Page() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<Mode>('base64-encode')
  const [error, setError] = useState('')

  const handleConvert = () => {
    setError('')
    if (!input.trim()) return
    switch (mode) {
      case 'base64-encode':
        setOutput(encodeBase64(input))
        break
      case 'base64-decode': {
        const decoded = decodeBase64(input)
        if (decoded === null) setError('无效的 Base64 字符串')
        else setOutput(decoded)
        break
      }
      case 'url-encode':
        setOutput(encodeURL(input))
        break
      case 'url-decode':
        setOutput(decodeURL(input))
        break
    }
  }

  const modes: { value: Mode; label: string }[] = [
    { value: 'base64-encode', label: 'Base64 编码' },
    { value: 'base64-decode', label: 'Base64 解码' },
    { value: 'url-encode', label: 'URL 编码' },
    { value: 'url-decode', label: 'URL 解码' },
  ]

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Base64 在线编解码</h1>
      <p className="text-gray-600 mb-6">在线 Base64 和 URL 编码解码工具。</p>
      <AdBanner />
      <div className="mt-6">
        <div className="flex gap-2 mb-4">
          {modes.map((m) => (
            <button
              key={m.value}
              onClick={() => { setMode(m.value); setOutput(''); setError('') }}
              className={`px-3 py-1 text-sm rounded-lg ${
                mode === m.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <textarea className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm" value={input} onChange={(e) => setInput(e.target.value)} placeholder="输入文本..." />
          <textarea className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50" value={output} readOnly placeholder="结果..." />
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <button onClick={handleConvert} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">转换</button>
      </div>
    </main>
  )
}
