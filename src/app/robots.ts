import type { MetadataRoute } from 'next'

const BASE = process.env.NEXTAUTH_URL ?? 'https://cellaviva.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/account/', '/checkout/', '/cart/'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  }
}
