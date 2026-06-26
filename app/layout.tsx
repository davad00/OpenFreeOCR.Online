import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

const SITE_URL = 'https://openfreeocr.online'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'OpenFreeOCR - Free Online OCR Image to Text Tool',
    template: '%s · OpenFreeOCR',
  },
  description:
    'OpenFreeOCR is a free online OCR tool for converting images, screenshots, photos, and scanned documents to clean, copyable text. No signup, batch OCR, paste from clipboard, powered by NVIDIA OCR.',
  applicationName: 'OpenFreeOCR',
  keywords: [
    'OpenFreeOCR',
    'openfreeocr online',
    'openfreeocr.online',
    'open free OCR',
    'open free OCR online',
    'free online OCR',
    'OCR',
    'image to text',
    'free OCR',
    'online OCR',
    'extract text from image',
    'screenshot to text',
    'photo to text',
    'scan to text',
    'image text extractor',
    'document scanner',
    'NVIDIA OCR',
  ],
  authors: [{ name: 'OpenFreeOCR', url: SITE_URL }],
  creator: 'OpenFreeOCR',
  publisher: 'OpenFreeOCR',
  category: 'technology',
  alternates: { canonical: '/' },
  icons: {
    icon: '/openfreeocr-logo.svg',
    apple: '/openfreeocr-avatar.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'OpenFreeOCR',
    title: 'OpenFreeOCR - Free Online OCR Image to Text Tool',
    description:
      'Free online OCR for images, screenshots, photos, and scanned documents. Convert images to clean, copyable text with no signup.',
    url: SITE_URL,
    images: [{ url: '/openfreeocr-avatar.png', width: 1024, height: 1024, alt: 'OpenFreeOCR' }],
  },
  twitter: {
    card: 'summary',
    title: 'OpenFreeOCR - Free Online OCR Image to Text Tool',
    description:
      'Free online OCR for images, screenshots, photos, and scanned documents. Convert images to clean, copyable text with no signup.',
    images: ['/openfreeocr-avatar.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
