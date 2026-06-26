'use client'

import { Link } from '@fluentui/react-components'
import {
  LegalShell,
  LegalSection,
  LegalParagraph,
  LegalList,
} from '@/components/legal-page'

export function PrivacyContent() {
  return (
    <LegalShell
      title="Privacy Policy"
      updated="June 26, 2026"
      intro="OpenFreeOCR is a free image-to-text tool operated at openfreeocr.online. Privacy is the default here: there are no accounts, no tracking, and we do not keep the images you process or the text we extract from them. This policy explains exactly what happens to your data."
    >
      <LegalSection heading="The short version">
        <LegalList
          items={[
            'We do not store, log, or retain your uploaded images or the extracted text.',
            'We do not require an account, and we do not collect personal information.',
            'We use no cookies, no analytics, and no advertising or tracking technologies.',
            'To read your image, it is sent to NVIDIA’s OCR service for processing — your use of that processing is subject to NVIDIA’s policies (see below).',
          ]}
        />
      </LegalSection>

      <LegalSection heading="Images and extracted text">
        <LegalParagraph>
          When you add an image, it is first resized inside your own browser and
          then sent to our server for the single purpose of relaying it to the
          optical character recognition (OCR) service that reads it. We act only
          as a pass-through. Your image and the resulting text exist in memory
          only for the brief moment needed to process the request, and are
          discarded immediately once the result is returned to you. We do not
          write your images or text to any database, log, or disk, and we cannot
          retrieve them after the fact.
        </LegalParagraph>
        <LegalParagraph>
          The results you see — the extracted text, line confidence, and any
          edits you make — live only in your browser tab. They are gone when you
          close or refresh the page, unless you copy or download them yourself.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="Processing by NVIDIA">
        <LegalParagraph>
          OpenFreeOCR performs text recognition using NVIDIA’s hosted OCR model.
          To extract text, the image you submit is transmitted to NVIDIA’s API
          for processing. This means your image is handled by NVIDIA as part of
          delivering the result. We do not control NVIDIA’s systems, and your
          use of that processing is governed by NVIDIA’s own privacy policy and
          terms. Please review them to understand how NVIDIA handles data sent
          to its services:
        </LegalParagraph>
        <LegalList
          items={[
            <Link
              key="nv-privacy"
              href="https://www.nvidia.com/en-us/about-nvidia/privacy-policy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              NVIDIA Privacy Policy
            </Link>,
            <Link
              key="nv-terms"
              href="https://www.nvidia.com/en-us/about-nvidia/terms-of-service/"
              target="_blank"
              rel="noopener noreferrer"
            >
              NVIDIA Terms of Service
            </Link>,
            <Link
              key="nv-trust"
              href="https://www.nvidia.com/en-us/agreements/"
              target="_blank"
              rel="noopener noreferrer"
            >
              NVIDIA Agreements &amp; Trust Center
            </Link>,
          ]}
        />
        <LegalParagraph>
          Do not upload images containing sensitive, confidential, or personal
          information that you are not comfortable sending to a third-party
          processing service.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="Cookies, analytics, and tracking">
        <LegalParagraph>
          We do not use cookies, local storage for personal data, analytics, or
          any tracking or fingerprinting technology. Your theme preference
          (light or dark) is kept only in your browser’s memory for the current
          session and is never sent to us.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="Donations">
        <LegalParagraph>
          If you choose to support the project, donations are handled entirely
          by Ko-fi. We never see or receive your payment card details. Any
          information you provide during a donation is processed by Ko-fi under{' '}
          <Link href="https://ko-fi.com" target="_blank" rel="noopener noreferrer">
            their own privacy policy and terms
          </Link>
          .
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="Children">
        <LegalParagraph>
          OpenFreeOCR is not directed to children under 13, and we do not
          knowingly collect any information from them. Because we don’t collect
          personal information from anyone, no special action is generally
          required, but please do not use the service to process images of
          children without appropriate consent.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="Changes to this policy">
        <LegalParagraph>
          We may update this policy from time to time. When we do, we’ll revise
          the “Last updated” date above. Continued use of OpenFreeOCR after a
          change means you accept the updated policy.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="Contact">
        <LegalParagraph>
          Questions about this policy can be sent to{' '}
          <Link href="mailto:hello@openfreeocr.online">
            hello@openfreeocr.online
          </Link>
          .
        </LegalParagraph>
      </LegalSection>
    </LegalShell>
  )
}
