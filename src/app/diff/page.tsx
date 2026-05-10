'use client'
import { useState } from 'react'
import { diffLines, DiffLine } from '@/lib/diff'
import { AdBanner } from '@/components/AdBanner'

export default function DiffPage() {
  const [textA, setTextA] = useState('')
  const [textB, setTextB] = useState('')
  const [diff, setDiff] = useState<DiffLine[]>([])

  const handleCompare = () => setDiff(diffLines(textA, textB))

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">文本差异在线对比</h1>
      <p className="text-gray-600 mb-6">逐行比较两份文本的差异。</p>
      <AdBanner />
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">原始文本</label>
          <textarea className="w-full h-48 p-3 border border-gray-300 rounded-lg font-mono text-sm" value={textA} onChange={(e) => setTextA(e.target.value)} placeholder="粘贴原始文本..." />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">新文本</label>
          <textarea className="w-full h-48 p-3 border border-gray-300 rounded-lg font-mono text-sm" value={textB} onChange={(e) => setTextB(e.target.value)} placeholder="粘贴新文本..." />
        </div>
      </div>
      <button onClick={handleCompare} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">对比差异</button>
      {diff.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg font-mono text-sm overflow-x-auto">
          {diff.map((line, i) => (
            <div key={i} className={`${line.type === 'added' ? 'bg-green-100 text-green-800' : line.type === 'removed' ? 'bg-red-100 text-red-800' : ''} px-2 py-0.5`}>
              <span className="text-gray-400 mr-2 w-8 inline-block text-right">{line.type !== 'added' ? line.lineNum : ' '}</span>
              <span>{line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}</span>
              <span>{line.content}</span>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
