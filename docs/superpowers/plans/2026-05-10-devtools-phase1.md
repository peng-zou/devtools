# 开发者工具站 Phase 1 实施计划

> **给执行者：** REQUIRED SUB-SKILL: 使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 按任务逐步实现。步骤使用复选框 (`- [ ]`) 跟踪进度。

**目标：** 构建一个包含 8 个纯前端代码工具的 Next.js 网站，SEO 友好，可部署到 Vercel。

**架构：** Next.js 14 App Router + TypeScript + Tailwind CSS。每个工具一个独立路由页面，无后端依赖。工具纯逻辑函数独立于组件，可单独测试。

**技术栈：** Next.js 14, React 18, TypeScript, Tailwind CSS 3, Vitest, React Testing Library

---

## 文件结构

```
D:\MyClaudeProject1\src\
├── app/
│   ├── layout.tsx              # 根布局：导航栏 + 页脚 + SEO meta
│   ├── page.tsx                # 首页：工具卡片网格 + 搜索
│   ├── globals.css             # Tailwind + 自定义样式
│   ├── json-formatter/page.tsx # JSON 格式化/校验/压缩
│   ├── regex-tester/page.tsx   # 正则表达式测试器
│   ├── base64/page.tsx         # Base64 / URL 编解码
│   ├── color-converter/page.tsx # HEX ↔ RGB ↔ HSL 互转
│   ├── timestamp/page.tsx      # Unix 时间戳转换
│   ├── diff/page.tsx           # 文本差异逐行对比
│   ├── uuid-generator/page.tsx # UUID / 随机字符串生成
│   └── markdown-preview/page.tsx # Markdown 实时预览
├── components/
│   ├── Header.tsx              # 顶部导航 + 工具下拉菜单
│   ├── Footer.tsx              # 页脚链接
│   ├── ToolCard.tsx            # 首页工具卡片
│   └── AdBanner.tsx            # AdSense 广告占位
└── lib/
    ├── tools.ts                # 工具注册表（名称/路径/描述/关键词）
    ├── json.ts                 # JSON 格式化/校验/压缩逻辑
    ├── base64.ts               # Base64 + URL 编解码逻辑
    ├── color.ts                # HEX/RGB/HSL 转换逻辑
    ├── timestamp.ts            # 时间戳转换逻辑
    └── diff.ts                 # 逐行 diff 算法
```

---

### Task 1: 项目脚手架

**文件：**
- 创建：Next.js 项目（`create-next-app`）

- [ ] **Step 1: 创建 Next.js 项目**

```bash
cd D:\MyClaudeProject1
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --no-import-alias --use-npm
```

预期：项目创建成功，`src/app/layout.tsx` 和 `src/app/page.tsx` 存在。

- [ ] **Step 2: 安装测试依赖**

```bash
cd D:\MyClaudeProject1
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 3: 创建 Vitest 配置**

创建 `D:\MyClaudeProject1\vitest.config.ts`：

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

- [ ] **Step 4: 创建测试 setup 文件**

创建 `D:\MyClaudeProject1\vitest.setup.ts`：

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 5: 添加测试脚本到 package.json**

修改 `D:\MyClaudeProject1\package.json`，在 `"scripts"` 中添加：

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 6: 运行空测试验证**

```bash
npm test
```

预期：No tests found，但 Vitest 正常启动。

- [ ] **Step 7: 提交**

```bash
git add -A
git commit -m "feat: 初始化 Next.js 项目脚手架 + 测试框架"
```

---

### Task 2: 工具注册表 + 首页

**文件：**
- 创建：`src/lib/tools.ts`
- 创建：`src/components/ToolCard.tsx`
- 修改：`src/app/page.tsx`

- [ ] **Step 1: 编写工具注册表测试**

创建 `D:\MyClaudeProject1\src\lib\__tests__\tools.test.ts`：

```typescript
import { describe, it, expect } from 'vitest'
import { tools, getToolBySlug } from '../tools'

describe('工具注册表', () => {
  it('应该包含 8 个工具', () => {
    expect(tools).toHaveLength(8)
  })

  it('每个工具应有 name、slug、description、keywords、route', () => {
    for (const tool of tools) {
      expect(tool.name).toBeTruthy()
      expect(tool.slug).toBeTruthy()
      expect(tool.description).toBeTruthy()
      expect(tool.keywords).toBeInstanceOf(Array)
      expect(tool.route).toBeTruthy()
    }
  })

  it('getToolBySlug 应返回正确工具', () => {
    const tool = getToolBySlug('json-formatter')
    expect(tool).toBeDefined()
    expect(tool?.name).toBe('JSON 格式化')
  })

  it('getToolBySlug 对不存在的 slug 返回 undefined', () => {
    expect(getToolBySlug('nonexistent')).toBeUndefined()
  })
})
```

- [ ] **Step 2: 运行测试验证失败**

```bash
npx vitest run src/lib/__tests__/tools.test.ts
```

预期：FAIL — 模块 `../tools` 不存在。

- [ ] **Step 3: 创建工具注册表**

创建 `D:\MyClaudeProject1\src\lib\tools.ts`：

```typescript
export interface Tool {
  name: string
  slug: string
  description: string
  keywords: string[]
  route: string
}

export const tools: Tool[] = [
  {
    name: 'JSON 格式化',
    slug: 'json-formatter',
    description: '在线 JSON 格式化、校验、压缩工具，支持错误定位和语法高亮',
    keywords: ['JSON格式化', 'JSON校验', 'JSON美化', 'JSON压缩', 'JSON在线工具'],
    route: '/json-formatter',
  },
  {
    name: '正则表达式测试',
    slug: 'regex-tester',
    description: '在线正则表达式测试工具，实时匹配结果，内置常用正则库',
    keywords: ['正则表达式', '正则测试', 'regex', '正则在线', '正则匹配'],
    route: '/regex-tester',
  },
  {
    name: 'Base64 编解码',
    slug: 'base64',
    description: '在线 Base64 编码解码工具，支持文本和图片互转',
    keywords: ['Base64', 'Base64编码', 'Base64解码', '图片转Base64', 'URL编码'],
    route: '/base64',
  },
  {
    name: '色码转换',
    slug: 'color-converter',
    description: '在线色码转换工具，HEX、RGB、HSL 互转，实时预览颜色',
    keywords: ['色码转换', 'HEX转RGB', 'RGB转HEX', 'HSL', '调色板', '在线取色'],
    route: '/color-converter',
  },
  {
    name: '时间戳转换',
    slug: 'timestamp',
    description: 'Unix 时间戳在线转换工具，支持毫秒/秒与日期时间互转',
    keywords: ['时间戳', 'Unix时间戳', '时间戳转换', '日期转时间', 'timestamp'],
    route: '/timestamp',
  },
  {
    name: '文本差异对比',
    slug: 'diff',
    description: '在线文本差异对比工具，逐行比较代码和文档版本差异',
    keywords: ['文本对比', 'diff', '代码对比', '版本对比', '文档对比'],
    route: '/diff',
  },
  {
    name: 'UUID 生成器',
    slug: 'uuid-generator',
    description: '在线 UUID 和随机字符串生成工具，支持批量生成',
    keywords: ['UUID', 'UUID生成', 'GUID', '随机字符串', '唯一ID'],
    route: '/uuid-generator',
  },
  {
    name: 'Markdown 预览',
    slug: 'markdown-preview',
    description: '在线 Markdown 编辑预览工具，实时渲染，支持复制 HTML',
    keywords: ['Markdown', 'Markdown编辑', 'MD预览', '在线MD', 'markdown在线'],
    route: '/markdown-preview',
  },
]

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug)
}
```

- [ ] **Step 4: 运行测试验证通过**

```bash
npx vitest run src/lib/__tests__/tools.test.ts
```

预期：4 tests PASS。

- [ ] **Step 5: 编写 ToolCard 组件测试**

创建 `D:\MyClaudeProject1\src\components\__tests__\ToolCard.test.tsx`：

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ToolCard } from '../ToolCard'
import { tools } from '@/lib/tools'

describe('ToolCard', () => {
  it('应渲染工具名称和描述', () => {
    render(<ToolCard tool={tools[0]} />)
    expect(screen.getByText('JSON 格式化')).toBeInTheDocument()
    expect(screen.getByText(/在线 JSON 格式化/)).toBeInTheDocument()
  })

  it('应包含指向工具页面的链接', () => {
    render(<ToolCard tool={tools[0]} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/json-formatter')
  })
})
```

- [ ] **Step 6: 运行测试验证失败**

```bash
npx vitest run src/components/__tests__/ToolCard.test.tsx
```

预期：FAIL — ToolCard 模块不存在。

- [ ] **Step 7: 创建 ToolCard 组件**

创建 `D:\MyClaudeProject1\src\components\ToolCard.tsx`：

```typescript
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
```

- [ ] **Step 8: 运行测试验证通过**

```bash
npx vitest run src/components/__tests__/ToolCard.test.tsx
```

预期：2 tests PASS。

- [ ] **Step 9: 创建首页**

修改 `D:\MyClaudeProject1\src\app\page.tsx`：

```typescript
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
```

- [ ] **Step 10: 提交**

```bash
git add -A
git commit -m "feat: 添加工具注册表和首页工具卡片网格"
```

---

### Task 3: 共享布局组件（Header + Footer + AdBanner）

**文件：**
- 创建：`src/components/Header.tsx`
- 创建：`src/components/Footer.tsx`
- 创建：`src/components/AdBanner.tsx`
- 修改：`src/app/layout.tsx`
- 修改：`src/app/globals.css`

- [ ] **Step 1: 创建 Header 组件**

创建 `D:\MyClaudeProject1\src\components\Header.tsx`：

```typescript
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
```

- [ ] **Step 2: 创建 Footer 组件**

创建 `D:\MyClaudeProject1\src\components\Footer.tsx`：

```typescript
export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
        <p>全部工具免费使用 · 无需注册 · 数据不会上传到服务器</p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: 创建 AdBanner 组件**

创建 `D:\MyClaudeProject1\src\components\AdBanner.tsx`：

```typescript
export function AdBanner() {
  return (
    <div className="bg-gray-100 border border-dashed border-gray-300 rounded-lg p-4 text-center text-sm text-gray-400">
      广告位 — 接入 Google AdSense 后显示
    </div>
  )
}
```

- [ ] **Step 4: 更新根布局**

修改 `D:\MyClaudeProject1\src\app\layout.tsx`：

```typescript
import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: '开发者工具 — 免费在线编程工具集',
    template: '%s | 开发者工具',
  },
  description: '免费在线开发者工具集，JSON格式化、正则测试、Base64编解码、色码转换、时间戳转换等实用工具。',
  keywords: '在线工具,开发者工具,JSON格式化,正则测试,Base64,色码转换,时间戳转换',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  )
}
```

- [ ] **Step 5: 更新 globals.css**

修改 `D:\MyClaudeProject1\src\app\globals.css`：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
```

- [ ] **Step 6: 提交**

```bash
git add -A
git commit -m "feat: 添加共享布局组件（Header、Footer、AdBanner）"
```

---

### Task 4: JSON 格式化工具

**文件：**
- 创建：`src/lib/json.ts`
- 创建：`src/app/json-formatter/page.tsx`

- [ ] **Step 1: 编写 JSON 工具函数测试**

创建 `D:\MyClaudeProject1\src\lib\__tests__\json.test.ts`：

```typescript
import { describe, it, expect } from 'vitest'
import { formatJSON, compressJSON, validateJSON } from '../json'

describe('formatJSON', () => {
  it('应美化压缩的 JSON', () => {
    const result = formatJSON('{"name":"test","age":18}')
    expect(result.success).toBe(true)
    expect(result.output).toBe('{\n  "name": "test",\n  "age": 18\n}')
  })

  it('对无效 JSON 返回错误', () => {
    const result = formatJSON('{invalid}')
    expect(result.success).toBe(false)
    expect(result.error).toBeTruthy()
  })
})

describe('compressJSON', () => {
  it('应压缩美化的 JSON', () => {
    const result = compressJSON('{\n  "a": 1\n}')
    expect(result.success).toBe(true)
    expect(result.output).toBe('{"a":1}')
  })
})

describe('validateJSON', () => {
  it('有效 JSON 返回 valid true', () => {
    const result = validateJSON('{"valid": true}')
    expect(result.valid).toBe(true)
    expect(result.error).toBeNull()
  })

  it('无效 JSON 返回 valid false 和错误信息', () => {
    const result = validateJSON('{bad json}')
    expect(result.valid).toBe(false)
    expect(result.error).toBeTruthy()
  })
})
```

- [ ] **Step 2: 运行测试验证失败**

```bash
npx vitest run src/lib/__tests__/json.test.ts
```

预期：FAIL — 模块 `../json` 不存在。

- [ ] **Step 3: 实现 JSON 工具函数**

创建 `D:\MyClaudeProject1\src\lib\json.ts`：

```typescript
interface JSONResult {
  success: boolean
  output?: string
  error?: string
}

interface ValidateResult {
  valid: boolean
  error: string | null
}

export function formatJSON(input: string): JSONResult {
  try {
    const parsed = JSON.parse(input)
    return { success: true, output: JSON.stringify(parsed, null, 2) }
  } catch (e) {
    const msg = e instanceof Error ? e.message : '未知错误'
    return { success: false, error: msg }
  }
}

export function compressJSON(input: string): JSONResult {
  try {
    const parsed = JSON.parse(input)
    return { success: true, output: JSON.stringify(parsed) }
  } catch (e) {
    const msg = e instanceof Error ? e.message : '未知错误'
    return { success: false, error: msg }
  }
}

export function validateJSON(input: string): ValidateResult {
  try {
    JSON.parse(input)
    return { valid: true, error: null }
  } catch (e) {
    const msg = e instanceof Error ? e.message : '未知错误'
    return { valid: false, error: msg }
  }
}
```

- [ ] **Step 4: 运行测试验证通过**

```bash
npx vitest run src/lib/__tests__/json.test.ts
```

预期：4 tests PASS。

- [ ] **Step 5: 创建 JSON 格式化页面**

创建 `D:\MyClaudeProject1\src\app\json-formatter\page.tsx`：

```typescript
'use client'
import { useState } from 'react'
import { formatJSON, compressJSON, validateJSON } from '@/lib/json'
import { AdBanner } from '@/components/AdBanner'

export default function JSONFormatterPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [indent, setIndent] = useState(2)

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
```

- [ ] **Step 6: 提交**

```bash
git add -A
git commit -m "feat: 添加 JSON 格式化/校验/压缩工具"
```

---

### Task 5: 正则表达式测试器

**文件：**
- 创建：`src/app/regex-tester/page.tsx`

- [ ] **Step 1: 创建正则测试器页面**

创建 `D:\MyClaudeProject1\src\app\regex-tester\page.tsx`：

```typescript
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
```

- [ ] **Step 2: 提交**

```bash
git add -A
git commit -m "feat: 添加正则表达式测试器（含常用正则库）"
```

---

### Task 6: Base64 编解码工具

**文件：**
- 创建：`src/lib/base64.ts`
- 创建：`src/app/base64/page.tsx`

- [ ] **Step 1: 编写 Base64 工具函数测试**

创建 `D:\MyClaudeProject1\src\lib\__tests__\base64.test.ts`：

```typescript
import { describe, it, expect } from 'vitest'
import { encodeBase64, decodeBase64, isBase64, encodeURL, decodeURL } from '../base64'

describe('encodeBase64', () => {
  it('应将 UTF-8 文本编码为 Base64', () => {
    expect(encodeBase64('Hello')).toBe('SGVsbG8=')
  })

  it('应处理中文字符', () => {
    const encoded = encodeBase64('你好')
    expect(encoded).toBeTruthy()
    expect(typeof encoded).toBe('string')
  })
})

describe('decodeBase64', () => {
  it('应将 Base64 解码为原文', () => {
    expect(decodeBase64('SGVsbG8=')).toBe('Hello')
  })

  it('对无效 Base64 返回 null', () => {
    expect(decodeBase64('!!!invalid!!!')).toBeNull()
  })
})

describe('encodeURL', () => {
  it('应编码 URL 字符串', () => {
    expect(encodeURL('https://example.com?q=hello world')).toBe(
      'https%3A%2F%2Fexample.com%3Fq%3Dhello%20world'
    )
  })
})

describe('decodeURL', () => {
  it('应解码 URL 字符串', () => {
    expect(decodeURL('https%3A%2F%2Fexample.com')).toBe('https://example.com')
  })
})
```

- [ ] **Step 2: 运行测试验证失败**

```bash
npx vitest run src/lib/__tests__/base64.test.ts
```

预期：FAIL — 模块 `../base64` 不存在。

- [ ] **Step 3: 实现 Base64 工具函数**

创建 `D:\MyClaudeProject1\src\lib\base64.ts`：

```typescript
export function encodeBase64(text: string): string {
  return btoa(unescape(encodeURIComponent(text)))
}

export function decodeBase64(encoded: string): string | null {
  try {
    return decodeURIComponent(escape(atob(encoded)))
  } catch {
    return null
  }
}

export function isBase64(str: string): boolean {
  return /^[A-Za-z0-9+/]*={0,2}$/.test(str)
}

export function encodeURL(url: string): string {
  return encodeURIComponent(url)
}

export function decodeURL(encoded: string): string {
  return decodeURIComponent(encoded)
}
```

- [ ] **Step 4: 运行测试验证通过**

```bash
npx vitest run src/lib/__tests__/base64.test.ts
```

预期：5 tests PASS。

- [ ] **Step 5: 创建 Base64 编解码页面**

创建 `D:\MyClaudeProject1\src\app\base64\page.tsx`：

```typescript
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
                mode === m.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <textarea
            className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入文本..."
          />
          <textarea
            className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50"
            value={output}
            readOnly
            placeholder="结果..."
          />
        </div>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <button
          onClick={handleConvert}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          转换
        </button>
      </div>
    </main>
  )
}
```

- [ ] **Step 6: 提交**

```bash
git add -A
git commit -m "feat: 添加 Base64/URL 编解码工具"
```

---

### Task 7: 色码转换工具

**文件：**
- 创建：`src/lib/color.ts`
- 创建：`src/app/color-converter/page.tsx`

- [ ] **Step 1: 编写颜色转换函数测试**

创建 `D:\MyClaudeProject1\src\lib\__tests__\color.test.ts`：

```typescript
import { describe, it, expect } from 'vitest'
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, parseHex, parseRgb } from '../color'

describe('hexToRgb', () => {
  it('应将 HEX 转为 RGB', () => {
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 })
  })

  it('应支持短 HEX 格式', () => {
    expect(hexToRgb('#f00')).toEqual({ r: 255, g: 0, b: 0 })
  })
})

describe('rgbToHex', () => {
  it('应将 RGB 转为 HEX', () => {
    expect(rgbToHex(255, 0, 0)).toBe('#ff0000')
  })
})

describe('rgbToHsl', () => {
  it('红色应转为 HSL', () => {
    const result = rgbToHsl(255, 0, 0)
    expect(result.h).toBe(0)
    expect(result.s).toBe(100)
    expect(result.l).toBe(50)
  })
})

describe('hslToRgb', () => {
  it('红色 HSL 应转回 RGB', () => {
    const result = hslToRgb(0, 100, 50)
    expect(result.r).toBe(255)
    expect(result.g).toBe(0)
    expect(result.b).toBe(0)
  })
})
```

- [ ] **Step 2: 运行测试验证失败**

```bash
npx vitest run src/lib/__tests__/color.test.ts
```

预期：FAIL — 模块 `../color` 不存在。

- [ ] **Step 3: 实现颜色转换函数**

创建 `D:\MyClaudeProject1\src\lib\color.ts`：

```typescript
export interface RGB {
  r: number
  g: number
  b: number
}

export interface HSL {
  h: number
  s: number
  l: number
}

export function parseHex(hex: string): RGB | null {
  const match = hex.toLowerCase().match(/^#?([a-f0-9]{3}|[a-f0-9]{6})$/)
  if (!match) return null
  let h = match[1]
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  }
}

export function hexToRgb(hex: string): RGB | null {
  return parseHex(hex)
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  const rd = r / 255
  const gd = g / 255
  const bd = b / 255
  const max = Math.max(rd, gd, bd)
  const min = Math.min(rd, gd, bd)
  const l = (max + min) / 2
  let h = 0
  let s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rd:
        h = ((gd - bd) / d + (gd < bd ? 6 : 0)) / 6
        break
      case gd:
        h = ((bd - rd) / d + 2) / 6
        break
      case bd:
        h = ((rd - gd) / d + 4) / 6
        break
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  const hd = h / 360
  const sd = s / 100
  const ld = l / 100
  let r = 0, g = 0, b = 0
  if (sd === 0) {
    r = g = b = ld
  } else {
    const q = ld < 0.5 ? ld * (1 + sd) : ld + sd - ld * sd
    const p = 2 * ld - q
    r = hueToRgb(p, q, hd + 1 / 3)
    g = hueToRgb(p, q, hd)
    b = hueToRgb(p, q, hd - 1 / 3)
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) }
}

function hueToRgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1
  if (t > 1) t -= 1
  if (t < 1 / 6) return p + (q - p) * 6 * t
  if (t < 1 / 2) return q
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
  return p
}

export function parseRgb(str: string): RGB | null {
  const match = str.match(/rgb\(?\s*(\d+)\s*[,\s]\s*(\d+)\s*[,\s]\s*(\d+)\s*\)?/)
  if (!match) return null
  return { r: +match[1], g: +match[2], b: +match[3] }
}
```

- [ ] **Step 4: 运行测试验证通过**

```bash
npx vitest run src/lib/__tests__/color.test.ts
```

预期：5 tests PASS。

- [ ] **Step 5: 创建色码转换页面**

创建 `D:\MyClaudeProject1\src\app\color-converter\page.tsx`：

```typescript
'use client'
import { useState } from 'react'
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, parseRgb } from '@/lib/color'
import { AdBanner } from '@/components/AdBanner'

export default function ColorConverterPage() {
  const [hex, setHex] = useState('#3b82f6')
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 })
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 })

  const handleHexChange = (value: string) => {
    setHex(value)
    const result = hexToRgb(value)
    if (result) {
      setRgb(result)
      setHsl(rgbToHsl(result.r, result.g, result.b))
    }
  }

  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...rgb, [channel]: value }
    setRgb(newRgb)
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b))
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">色码在线转换</h1>
      <p className="text-gray-600 mb-6">HEX ↔ RGB ↔ HSL 互转，实时颜色预览。</p>

      <AdBanner />

      <div className="mt-6 flex gap-6 items-start flex-wrap">
        <div
          className="w-32 h-32 rounded-lg border border-gray-300 shadow"
          style={{ backgroundColor: hex }}
        />

        <div className="space-y-4 flex-1 min-w-[300px]">
          <div>
            <label className="block text-sm font-medium mb-1">HEX</label>
            <div className="flex gap-2">
              <input
                className="flex-1 p-2 border border-gray-300 rounded-lg font-mono text-sm"
                value={hex}
                onChange={(e) => handleHexChange(e.target.value)}
              />
              <input
                type="color"
                value={hex}
                onChange={(e) => handleHexChange(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">RGB</label>
            <div className="flex gap-2">
              {(['r', 'g', 'b'] as const).map((ch) => (
                <div key={ch} className="flex-1">
                  <span className="text-xs text-gray-500 uppercase">{ch}</span>
                  <input
                    type="number"
                    min={0}
                    max={255}
                    className="w-full p-2 border border-gray-300 rounded-lg font-mono text-sm"
                    value={rgb[ch]}
                    onChange={(e) => handleRgbChange(ch, +e.target.value || 0)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">HSL</label>
            <div className="flex gap-2">
              <div className="flex-1">
                <span className="text-xs text-gray-500">H</span>
                <input className="w-full p-2 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50" value={hsl.h} readOnly />
              </div>
              <div className="flex-1">
                <span className="text-xs text-gray-500">S%</span>
                <input className="w-full p-2 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50" value={hsl.s} readOnly />
              </div>
              <div className="flex-1">
                <span className="text-xs text-gray-500">L%</span>
                <input className="w-full p-2 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50" value={hsl.l} readOnly />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 6: 提交**

```bash
git add -A
git commit -m "feat: 添加色码转换工具（HEX/RGB/HSL 互转）"
```

---

### Task 8: 时间戳转换工具

**文件：**
- 创建：`src/lib/timestamp.ts`
- 创建：`src/app/timestamp/page.tsx`

- [ ] **Step 1: 编写时间戳函数测试**

创建 `D:\MyClaudeProject1\src\lib\__tests__\timestamp.test.ts`：

```typescript
import { describe, it, expect } from 'vitest'
import { timestampToDate, dateToTimestamp, nowTimestamp } from '../timestamp'

describe('timestampToDate', () => {
  it('应将 Unix 秒时间戳转为 ISO 日期字符串', () => {
    const result = timestampToDate(0)
    expect(result).toBe('1970-01-01T00:00:00.000Z')
  })
})

describe('dateToTimestamp', () => {
  it('应将 ISO 日期字符串转为秒时间戳', () => {
    expect(dateToTimestamp('1970-01-01T00:00:00.000Z')).toBe(0)
  })
})

describe('nowTimestamp', () => {
  it('应返回当前时间戳（数字）', () => {
    const now = nowTimestamp()
    expect(typeof now).toBe('number')
    expect(now).toBeGreaterThan(1700000000)
  })
})
```

- [ ] **Step 2: 运行测试验证失败**

```bash
npx vitest run src/lib/__tests__/timestamp.test.ts
```

预期：FAIL — 模块 `../timestamp` 不存在。

- [ ] **Step 3: 实现时间戳函数**

创建 `D:\MyClaudeProject1\src\lib\timestamp.ts`：

```typescript
export function timestampToDate(ts: number): string {
  const isMilliseconds = ts > 1000000000000
  const ms = isMilliseconds ? ts : ts * 1000
  return new Date(ms).toISOString()
}

export function dateToTimestamp(dateStr: string): number {
  return Math.floor(new Date(dateStr).getTime() / 1000)
}

export function nowTimestamp(): number {
  return Math.floor(Date.now() / 1000)
}
```

- [ ] **Step 4: 运行测试验证通过**

```bash
npx vitest run src/lib/__tests__/timestamp.test.ts
```

预期：3 tests PASS。

- [ ] **Step 5: 创建时间戳工具页面**

创建 `D:\MyClaudeProject1\src\app\timestamp\page.tsx`：

```typescript
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
            <input
              className="flex-1 p-2 border border-gray-300 rounded-lg font-mono text-sm"
              placeholder="输入 Unix 时间戳"
              value={tsInput}
              onChange={(e) => setTsInput(e.target.value)}
            />
            <button onClick={handleNow} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">
              当前
            </button>
          </div>
          <button onClick={handleTsToDate} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
            转换
          </button>
          {dateResult && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg font-mono text-sm">{dateResult}</div>
          )}
        </div>

        <div>
          <h2 className="font-semibold mb-3">日期 → 时间戳</h2>
          <input
            className="w-full p-2 border border-gray-300 rounded-lg font-mono text-sm"
            type="datetime-local"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
          />
          <button onClick={handleDateToTs} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
            转换
          </button>
          {tsResult && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg font-mono text-sm">{tsResult}</div>
          )}
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 6: 提交**

```bash
git add -A
git commit -m "feat: 添加 Unix 时间戳转换工具"
```

---

### Task 9: 文本差异对比工具

**文件：**
- 创建：`src/lib/diff.ts`
- 创建：`src/app/diff/page.tsx`

- [ ] **Step 1: 编写 diff 函数测试**

创建 `D:\MyClaudeProject1\src\lib\__tests__\diff.test.ts`：

```typescript
import { describe, it, expect } from 'vitest'
import { diffLines } from '../diff'

describe('diffLines', () => {
  it('相同文本应返回空差异', () => {
    const result = diffLines('hello\nworld', 'hello\nworld')
    expect(result).toEqual([])
  })

  it('应检测到新增行', () => {
    const result = diffLines('line1', 'line1\nline2')
    expect(result.length).toBeGreaterThan(0)
    expect(result.some((r) => r.type === 'added')).toBe(true)
  })

  it('应检测到删除行', () => {
    const result = diffLines('line1\nline2', 'line1')
    expect(result.length).toBeGreaterThan(0)
    expect(result.some((r) => r.type === 'removed')).toBe(true)
  })
})
```

- [ ] **Step 2: 运行测试验证失败**

```bash
npx vitest run src/lib/__tests__/diff.test.ts
```

预期：FAIL — 模块 `../diff` 不存在。

- [ ] **Step 3: 实现 diff 算法**

创建 `D:\MyClaudeProject1\src\lib\diff.ts`：

```typescript
export interface DiffLine {
  type: 'added' | 'removed' | 'unchanged'
  content: string
  lineNum: number
}

export function diffLines(textA: string, textB: string): DiffLine[] {
  const linesA = textA.split('\n')
  const linesB = textB.split('\n')
  const result: DiffLine[] = []
  const maxLen = Math.max(linesA.length, linesB.length)

  for (let i = 0; i < maxLen; i++) {
    if (i >= linesA.length) {
      result.push({ type: 'added', content: linesB[i], lineNum: i + 1 })
    } else if (i >= linesB.length) {
      result.push({ type: 'removed', content: linesA[i], lineNum: i + 1 })
    } else if (linesA[i] !== linesB[i]) {
      result.push({ type: 'removed', content: linesA[i], lineNum: i + 1 })
      result.push({ type: 'added', content: linesB[i], lineNum: i + 1 })
    } else {
      result.push({ type: 'unchanged', content: linesA[i], lineNum: i + 1 })
    }
  }

  return result
}
```

- [ ] **Step 4: 运行测试验证通过**

```bash
npx vitest run src/lib/__tests__/diff.test.ts
```

预期：3 tests PASS。

- [ ] **Step 5: 创建 diff 页面**

创建 `D:\MyClaudeProject1\src\app\diff\page.tsx`：

```typescript
'use client'
import { useState } from 'react'
import { diffLines, DiffLine } from '@/lib/diff'
import { AdBanner } from '@/components/AdBanner'

export default function DiffPage() {
  const [textA, setTextA] = useState('')
  const [textB, setTextB] = useState('')
  const [diff, setDiff] = useState<DiffLine[]>([])

  const handleCompare = () => {
    setDiff(diffLines(textA, textB))
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">文本差异在线对比</h1>
      <p className="text-gray-600 mb-6">逐行比较两份文本的差异。</p>

      <AdBanner />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">原始文本</label>
          <textarea
            className="w-full h-48 p-3 border border-gray-300 rounded-lg font-mono text-sm"
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            placeholder="粘贴原始文本..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">新文本</label>
          <textarea
            className="w-full h-48 p-3 border border-gray-300 rounded-lg font-mono text-sm"
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            placeholder="粘贴新文本..."
          />
        </div>
      </div>

      <button onClick={handleCompare} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
        对比差异
      </button>

      {diff.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg font-mono text-sm overflow-x-auto">
          {diff.map((line, i) => (
            <div
              key={i}
              className={`${
                line.type === 'added'
                  ? 'bg-green-100 text-green-800'
                  : line.type === 'removed'
                  ? 'bg-red-100 text-red-800'
                  : ''
              } px-2 py-0.5`}
            >
              <span className="text-gray-400 mr-2 w-8 inline-block text-right">
                {line.type !== 'added' ? line.lineNum : ' '}
              </span>
              <span>{line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}</span>
              <span>{line.content}</span>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
```

- [ ] **Step 6: 提交**

```bash
git add -A
git commit -m "feat: 添加文本差异对比工具"
```

---

### Task 10: UUID 生成器 + Markdown 预览

**文件：**
- 创建：`src/app/uuid-generator/page.tsx`
- 创建：`src/app/markdown-preview/page.tsx`

- [ ] **Step 1: 创建 UUID 生成器页面**

创建 `D:\MyClaudeProject1\src\app\uuid-generator\page.tsx`：

```typescript
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
              <input
                type="number"
                min={1}
                max={50}
                value={count}
                onChange={(e) => setCount(+e.target.value)}
                className="w-24 p-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <button
              onClick={() => setUuids(Array.from({ length: count }, generateUUID))}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              生成
            </button>
          </div>
          {uuids.length > 0 && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg font-mono text-sm space-y-1">
              {uuids.map((id, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span>{id}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(id)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    复制
                  </button>
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
              <input
                type="number"
                min={4}
                max={256}
                value={randomLen}
                onChange={(e) => setRandomLen(+e.target.value)}
                className="w-24 p-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <button
              onClick={() => setRandomStrs([generateRandomString(randomLen)])}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              生成
            </button>
          </div>
          {randomStrs.length > 0 && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg font-mono text-sm break-all">
              {randomStrs[0]}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: 创建 Markdown 预览页面**

创建 `D:\MyClaudeProject1\src\app\markdown-preview\page.tsx`：

```typescript
'use client'
import { useState } from 'react'
import { AdBanner } from '@/components/AdBanner'

function renderMarkdown(md: string): string {
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // 标题
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')

  // 粗体和斜体
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // 行内代码
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>')

  // 代码块
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm my-2"><code>$2</code></pre>')

  // 链接和图片
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full my-2 rounded" />')
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')

  // 列表
  html = html.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')

  // 段落
  html = html.replace(/^(?!<[a-z/])(.+)$/gm, '<p class="my-1">$1</p>')

  // 水平线
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
          <textarea
            className="w-full h-[500px] p-4 border border-gray-300 rounded-lg font-mono text-sm"
            value={markdown}
            onChange={(e) => handleChange(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">预览</label>
          <div
            className="w-full h-[500px] p-4 border border-gray-300 rounded-lg overflow-y-auto bg-white"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 3: 提交**

```bash
git add -A
git commit -m "feat: 添加 UUID 生成器和 Markdown 预览工具"
```

---

### Task 11: SEO + 性能优化

**文件：**
- 修改：`src/app/layout.tsx`（添加 GA 脚本）
- 创建：`src/app/sitemap.ts`
- 创建：`src/app/robots.ts`

- [ ] **Step 1: 添加 Google Analytics 脚本**

修改 `D:\MyClaudeProject1\src\app\layout.tsx`，在 `</head>` 前添加 GA 脚本占位：

```typescript
// 在 <html> 后添加 <head> 内的 GA 脚本
// 找到 html 标签位置，将其改为:
return (
  <html lang="zh-CN">
    <head>
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
      <script dangerouslySetInnerHTML={{
        __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-XXXXXXXXXX');`
      }} />
    </head>
    <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </body>
  </html>
)
```

- [ ] **Step 2: 创建 sitemap**

创建 `D:\MyClaudeProject1\src\app\sitemap.ts`：

```typescript
import { tools } from '@/lib/tools'
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://your-domain.com'
  
  const toolPages = tools.map((tool) => ({
    url: `${baseUrl}${tool.route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    ...toolPages,
  ]
}
```

- [ ] **Step 3: 创建 robots.txt**

创建 `D:\MyClaudeProject1\src\app\robots.ts`：

```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://your-domain.com/sitemap.xml',
  }
}
```

- [ ] **Step 4: 验证构建**

```bash
npm run build
```

预期：构建成功，无错误。

- [ ] **Step 5: 提交**

```bash
git add -A
git commit -m "feat: 添加 SEO 优化（sitemap、robots、GA 占位）"
```

---

### Task 12: 验证与总结

- [ ] **Step 1: 运行全部测试**

```bash
npx vitest run
```

预期：所有测试 PASS（约 20+ 个测试）。

- [ ] **Step 2: 运行开发服务器验证**

```bash
npm run dev
```

打开浏览器访问：
- http://localhost:3000（首页）
- http://localhost:3000/json-formatter
- http://localhost:3000/regex-tester
- http://localhost:3000/base64
- http://localhost:3000/color-converter
- http://localhost:3000/timestamp
- http://localhost:3000/diff
- http://localhost:3000/uuid-generator
- http://localhost:3000/markdown-preview

确认每个页面有：标题、描述、完整功能（输入 → 操作 → 输出）。

- [ ] **Step 3: 构建生产版本**

```bash
npm run build
```

预期：构建成功，所有页面预渲染。

- [ ] **Step 4: 提交**

```bash
git add -A
git commit -m "docs: 完成 Phase 1 全部工具实现"
```
