'use client'
import { useState } from 'react'
import { formatJSON, compressJSON, validateJSON } from '@/lib/json'
import { AdBanner } from '@/components/AdBanner'

export default function JSONFormatterPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const handleFormat = () => {
    const result = formatJSON(input)
    if (result.success) {
      setOutput(result.output!)
      setError('')
    } else {
      setError(result.error!)
      setOutput('')
    }
  }

  const handleCompress = () => {
    const result = compressJSON(input)
    if (result.success) {
      setOutput(result.output!)
      setError('')
    } else {
      setError(result.error!)
      setOutput('')
    }
  }

  const handleValidate = () => {
    const result = validateJSON(input)
    if (result.valid) {
      setError('')
      alert('JSON 格式有效')
    } else {
      setError(result.error!)
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">JSON 在线格式化</h1>
      <p className="text-gray-600 mb-6">
        在线 JSON 格式化、校验、压缩工具。粘贴 JSON 数据，一键美化或压缩。
      </p>

      <AdBanner />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">输入 JSON</label>
          <textarea
            className="w-full h-80 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder='{"key": "value"}'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">输出结果</label>
          <textarea
            className="w-full h-80 p-4 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50"
            value={output}
            readOnly
            placeholder="点击格式化查看结果"
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button onClick={handleFormat} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
          格式化
        </button>
        <button onClick={handleCompress} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm">
          压缩
        </button>
        <button onClick={handleValidate} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
          校验
        </button>
        {output && (
          <button
            onClick={() => navigator.clipboard.writeText(output)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
          >
            复制结果
          </button>
        )}
      </div>
    </main>
  )
}
