import { tools } from '@/lib/tools'
import { ToolCard } from '@/components/ToolCard'

export const metadata = {
  title: '在线开发者工具 — JSON格式化|正则测试|Base64|时间戳|色码转换',
  description: '免费在线开发者工具集，包含JSON格式化、正则表达式测试、Base64编解码、色码转换、时间戳转换等8个实用工具。',
}

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          在线开发者工具
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          8 个实用编程工具，全部免费，无需注册。数据处理、代码调试、格式转换，一站式搞定。
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </main>
  )
}
