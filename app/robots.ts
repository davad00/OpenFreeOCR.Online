import type { MetadataRoute } from 'next'

const SITE_URL = 'https://openfreeocr.online'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The OCR API is a server relay, not a page — keep it out of crawlers.
      disallow: '/api/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
