import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/privacy', '/terms'].map((p) => ({ url: `https://buildsoftwaresolo.com${p}` }))
}
