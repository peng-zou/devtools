import Link from 'next/link'
import { Tool } from '@/lib/tools'

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={tool.route}
      className="block rounded-lg border border-gray-200 p-6 hover:border-blue-400 hover:shadow-md transition-all bg-white"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{tool.name}</h3>
      <p className="text-sm text-gray-600">{tool.description}</p>
    </Link>
  )
}
