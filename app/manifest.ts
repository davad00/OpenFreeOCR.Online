import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'OpenFreeOCR - Free Online OCR',
    short_name: 'OpenFreeOCR',
    description:
      'Free online OCR for images, screenshots, photos, and scanned documents.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#f8faf9',
    theme_color: '#087a5c',
    categories: ['productivity', 'utilities'],
    icons: [
      {
        src: '/openfreeocr-logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/openfreeocr-avatar.png',
        sizes: '1024x1024',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/openfreeocr-avatar.png',
        sizes: '1024x1024',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
