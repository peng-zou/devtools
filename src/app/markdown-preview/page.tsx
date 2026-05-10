'use client'
import { useState } from 'react'
import { AdBanner } from '@/components/AdBanner'

function renderMarkdown(md: string): string {
  let html = md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>')
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm my-2"><code>$2</code></pre>')
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full my-2 rounded" />')
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
  html = html.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
  html = html.replace(/^(?!<[a-z/])(.+)$/gm, '<p class="my-1">$1</p>')
  html = html.replace(/^---$/gm, '<hr class="my-4 border-gray-300" />')
  return html
}

export default function MarkdownPreviewPage() {
  const [markdown, setMarkdown] = useState('# Hello Markdown\n\n输入 Markdown 文本，**实时** 预览。\n\n- 列表项 1\n- 列表项 2\n\n```js\nconsole.log("hello")\n```')
  const [html, setHtml] = useState(renderMarkdown(markdown))

  const handleChange = (value: string) => {
    setMarkdown(value)
    setHtml(renderMarkdown(value))
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Markdown 在线编辑预览</h1>
      <p className="text-gray-600 mb-6">在线编辑 Markdown，实时预览渲染效果。</p>
      <AdBanner />
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Markdown 编辑</label>
          <textarea className="w-full h-[500px] p-4 border border-gray-300 rounded-lg font-mono text-sm" value={markdown} onChange={(e) => handleChange(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">预览</label>
          <div className="w-full h-[500px] p-4 border border-gray-300 rounded-lg overflow-y-auto bg-white" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </main>
  )
}
