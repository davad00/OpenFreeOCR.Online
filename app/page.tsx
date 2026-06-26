import type { Metadata } from 'next'
import { OcrTool } from '@/components/ocr-tool'

const SITE_URL = 'https://openfreeocr.online'

export const metadata: Metadata = {
  title: 'Free Online OCR - Convert Images, Screenshots, and Scans to Text',
  description:
    'Use OpenFreeOCR to extract text from images, screenshots, photos, and scanned documents for free. No signup, batch OCR, clipboard paste, paragraph grouping, and no stored uploads.',
  alternates: { canonical: '/' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'OpenFreeOCR',
      url: SITE_URL,
      logo: `${SITE_URL}/openfreeocr-avatar.png`,
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'OpenFreeOCR',
      alternateName: [
        'OpenFreeOCR Online',
        'Open Free OCR',
        'Open Free OCR Online',
        'openfreeocr.online',
      ],
      url: SITE_URL,
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en',
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE_URL}/#app`,
      name: 'OpenFreeOCR',
      alternateName: 'OpenFreeOCR Online',
      url: SITE_URL,
      applicationCategory: 'UtilitiesApplication',
      applicationSubCategory: 'OCR tool',
      operatingSystem: 'Web browser',
      browserRequirements: 'Requires JavaScript and a modern web browser',
      description:
        'Free online OCR tool that converts images, screenshots, photos, and scanned documents into clean, copyable text. Supports batch processing, paste from clipboard, and grouping OCR output by word, sentence, or paragraph.',
      image: `${SITE_URL}/openfreeocr-avatar.png`,
      screenshot: `${SITE_URL}/openfreeocr-avatar.png`,
      softwareVersion: '1.0',
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: [
        'Free image to text OCR',
        'Online OCR with no signup',
        'Batch OCR for multiple images',
        'Paste screenshots from clipboard',
        'Extract text by word, sentence, or paragraph',
        'No stored uploads in OpenFreeOCR',
        'Powered by NVIDIA OCR',
      ],
      creator: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is OpenFreeOCR free?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. OpenFreeOCR is a free online OCR tool with no signup required.',
          },
        },
        {
          '@type': 'Question',
          name: 'What can I convert with OpenFreeOCR?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can extract text from images, screenshots, photos, and scanned documents. You can upload images or paste screenshots from your clipboard.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does OpenFreeOCR store uploaded images?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'OpenFreeOCR does not store, log, or retain uploaded images or extracted text. Images are processed for the OCR request and discarded after the response.',
          },
        },
        {
          '@type': 'Question',
          name: 'What OCR engine powers OpenFreeOCR?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'OpenFreeOCR uses NVIDIA OCR processing through a server-side API relay.',
          },
        },
      ],
    },
  ],
}

export default function Home() {
  return (
    <>
      <OcrTool />
      <section className="seo-content" aria-labelledby="seo-title">
        <div className="seo-content__inner">
          <p className="seo-content__eyebrow">OpenFreeOCR.online</p>
          <h1 id="seo-title">
            Free online OCR for images, screenshots, and scanned documents
          </h1>
          <p className="seo-content__lead">
            OpenFreeOCR is a fast image-to-text OCR tool for anyone who needs to
            copy text out of photos, screenshots, receipts, notes, and scanned
            pages. Upload an image or paste from your clipboard, then copy or
            download the extracted text.
          </p>

          <div className="seo-content__grid">
            <article>
              <h2>Free image to text, no signup</h2>
              <p>
                Use OpenFreeOCR directly in your browser. There are no accounts,
                no paywalls, and no login steps before you can extract text from
                an image.
              </p>
            </article>
            <article>
              <h2>Batch OCR for multiple images</h2>
              <p>
                Add several images to the queue, choose how text should be
                grouped, and process them as one batch. It is built for repeated
                screenshot-to-text and document-to-text workflows.
              </p>
            </article>
            <article>
              <h2>Powered by NVIDIA OCR</h2>
              <p>
                Text recognition is powered by NVIDIA OCR through a secure
                server-side relay. OpenFreeOCR does not store your uploaded
                images or extracted text.
              </p>
            </article>
          </div>

          <h2>Popular uses</h2>
          <ul className="seo-content__uses">
            <li>Convert screenshots to copyable text</li>
            <li>Extract text from photos and scanned pages</li>
            <li>Turn receipts, notes, and documents into editable text</li>
            <li>Copy OCR results by word, sentence, or paragraph</li>
          </ul>

          <h2>Frequently asked questions</h2>
          <div className="seo-content__faq">
            <details>
              <summary>Is OpenFreeOCR free?</summary>
              <p>Yes. OpenFreeOCR is free to use and does not require signup.</p>
            </details>
            <details>
              <summary>Does OpenFreeOCR store my images?</summary>
              <p>
                No. OpenFreeOCR does not store, log, or retain your uploaded
                images or extracted text.
              </p>
            </details>
            <details>
              <summary>Can I paste a screenshot?</summary>
              <p>
                Yes. You can paste screenshots from your clipboard and extract
                text without saving the image as a file first.
              </p>
            </details>
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  )
}
