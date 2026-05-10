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
