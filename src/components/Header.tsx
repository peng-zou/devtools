import Link from 'next/link'
import { tools } from '@/lib/tools'

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-gray-900 hover:text-blue-600">
          开发者工具
        </Link>
        <nav className="flex items-center gap-4">
          <div className="relative group">
            <button className="text-sm text-gray-600 hover:text-gray-900 py-1">
              全部工具 ▾
            </button>
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg hidden group-hover:block min-w-[200px]">
              {tools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={tool.route}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
