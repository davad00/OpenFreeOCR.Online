import type { Metadata } from 'next'
import { PrivacyContent } from '@/components/privacy-content'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'OpenFreeOCR does not store, log, or retain the images you upload or the text it extracts. Learn how your data is handled.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return <PrivacyContent />
}
