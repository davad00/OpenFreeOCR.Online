import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

const SITE_URL = 'https://openfreeocr.online'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'OpenFreeOCR — Free Image to Text OCR',
    template: '%s · OpenFreeOCR',
  },
  description:
    'OpenFreeOCR is a free, no-signup image-to-text tool. Drop in a photo, screenshot, or scanned document and get clean, copyable text in seconds. Powered by NVIDIA. We never store your images.',
  applicationName: 'OpenFreeOCR',
  keywords: [
    'OCR',
    'image to text',
    'free OCR',
    'extract text from image',
    'screenshot to text',
    'document scanner',
    'OpenFreeOCR',
  ],
  authors: [{ name: 'OpenFreeOCR', url: SITE_URL }],
  creator: 'OpenFreeOCR',
  publisher: 'OpenFreeOCR',
  alternates: { canonical: '/' },
  icons: {
    icon: '/openfreeocr-logo.svg',
    apple: '/openfreeocr-avatar.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'OpenFreeOCR',
    title: 'OpenFreeOCR — Free Image to Text OCR',
    description:
      'Free, no-signup image-to-text. Drop in an image and get clean, copyable text in seconds. We never store your images.',
    url: SITE_URL,
    images: [{ url: '/openfreeocr-avatar.png', width: 1024, height: 1024, alt: 'OpenFreeOCR' }],
  },
  twitter: {
    card: 'summary',
    title: 'OpenFreeOCR — Free Image to Text OCR',
    description:
      'Free, no-signup image-to-text. Drop in an image and get clean, copyable text in seconds. We never store your images.',
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
