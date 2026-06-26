'use client'

import { Link } from '@fluentui/react-components'
import {
  LegalShell,
  LegalSection,
  LegalParagraph,
  LegalList,
} from '@/components/legal-page'

export function TermsContent() {
  return (
    <LegalShell
      title="Terms of Service"
      updated="June 26, 2026"
      intro="These terms govern your use of OpenFreeOCR, the free image-to-text tool available at openfreeocr.online. By using the service, you agree to these terms. If you do not agree, please do not use the service."
    >
      <LegalSection heading="The service">
        <LegalParagraph>
          OpenFreeOCR lets you extract text from images, screenshots, and
          scanned documents using optical character recognition. It is provided
          free of charge, without requiring an account. We may change, limit, or
          discontinue any part of the service at any time without notice.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="Your content and your responsibilities">
        <LegalParagraph>
          You keep all rights to the images you upload and the text you extract.
          We claim no ownership over them and, as described in our{' '}
          <Link href="/privacy">Privacy Policy</Link>, we do not store them. In
          exchange, you agree that:
        </LegalParagraph>
        <LegalList
          items={[
            'You own the images you upload or have the necessary rights and permissions to process them.',
            'You will not use the service to process unlawful, infringing, or abusive content, or content that violates anyone’s privacy or intellectual property rights.',
            'You will not attempt to overload, disrupt, abuse, scrape, or reverse-engineer the service, or use automated means to place excessive load on it.',
            'You are solely responsible for how you use any text the service produces.',
          ]}
        />
      </LegalSection>

      <LegalSection heading="Third-party processing">
        <LegalParagraph>
          Text recognition is performed using NVIDIA’s hosted OCR service. By
          using OpenFreeOCR, you acknowledge that the images you submit are
          processed by NVIDIA, and that this processing is also subject to
          NVIDIA’s own terms and policies:
        </LegalParagraph>
        <LegalList
          items={[
            <Link
              key="nv-terms"
              href="https://www.nvidia.com/en-us/about-nvidia/terms-of-service/"
              target="_blank"
              rel="noopener noreferrer"
            >
              NVIDIA Terms of Service
            </Link>,
            <Link
              key="nv-privacy"
              href="https://www.nvidia.com/en-us/about-nvidia/privacy-policy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              NVIDIA Privacy Policy
            </Link>,
          ]}
        />
      </LegalSection>

      <LegalSection heading="Accuracy and “as is” disclaimer">
        <LegalParagraph>
          OCR is not perfect. The extracted text may contain errors, omissions,
          or misreadings, and accuracy varies with image quality, language, and
          formatting. The service is provided “as is” and “as available,”
          without warranties of any kind, whether express or implied, including
          fitness for a particular purpose and accuracy. Do not rely on
          OpenFreeOCR output for any critical, legal, medical, financial, or
          safety-related purpose without independent verification.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="Limitation of liability">
        <LegalParagraph>
          To the fullest extent permitted by law, OpenFreeOCR and its operators
          will not be liable for any indirect, incidental, special,
          consequential, or punitive damages, or any loss of data, revenue, or
          profits, arising out of or related to your use of (or inability to
          use) the service — even if advised of the possibility of such damages.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="Availability">
        <LegalParagraph>
          We make no guarantee that the service will be available, uninterrupted,
          or error-free. The service may be unavailable due to maintenance,
          third-party outages (including NVIDIA), or other factors outside our
          control.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="Changes to these terms">
        <LegalParagraph>
          We may update these terms from time to time. When we do, we’ll revise
          the “Last updated” date above. Your continued use of OpenFreeOCR after
          a change means you accept the updated terms.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="Contact">
        <LegalParagraph>
          Questions about these terms can be sent to{' '}
          <Link href="mailto:hello@openfreeocr.online">
            hello@openfreeocr.online
          </Link>
          .
        </LegalParagraph>
      </LegalSection>
    </LegalShell>
  )
}
