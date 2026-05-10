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
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    ...toolPages,
  ]
}
