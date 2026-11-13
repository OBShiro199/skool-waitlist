import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/', disallow: ['/waitlist', '/vault', '/landers'] }, sitemap: 'https://buildsoftwaresolo.com/sitemap.xml' }
}
