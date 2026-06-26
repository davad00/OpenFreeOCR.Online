import type { Metadata } from 'next'
import { TermsContent } from '@/components/terms-content'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'The terms that govern your use of OpenFreeOCR, the free image-to-text tool at openfreeocr.online.',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return <TermsContent />
}
