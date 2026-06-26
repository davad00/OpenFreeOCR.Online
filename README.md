# OpenFreeOCR.Online - Free Online OCR

[OpenFreeOCR.online](https://openfreeocr.online) is a free, no-signup online OCR and image-to-text tool for photos, screenshots, scanned documents, receipts, and notes. It supports batch OCR, paste-from-clipboard, drag-and-drop upload, and text grouping by word, sentence, or paragraph.

The app is built with Next.js, React, Fluent UI, and Bun. OCR is performed through NVIDIA's hosted OCR API via the server-side `/api/ocr` route.

## SEO Keywords

OpenFreeOCR, OpenFreeOCR online, openfreeocr.online, open free OCR, open free OCR online, free OCR, free online OCR, image to text, image text extractor, screenshot to text, photo to text, scanned document OCR, batch OCR, NVIDIA OCR.

## Features

- Free online OCR with no signup
- Convert images, screenshots, photos, receipts, and scanned documents to text
- Paste screenshots directly from the clipboard
- Batch OCR for multiple images
- Group OCR output by word, sentence, or paragraph
- Copy or download extracted text
- Privacy-first app: OpenFreeOCR does not store uploaded images or extracted text

## Local Development

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

Create a local `.env` file from `.env.example` and set:

```text
NVIDIA_API_KEY=your_nvidia_key_here
```

Do not commit real API keys.

## Useful Commands

```bash
bun run typecheck
bun run build
bun run start
```

## Deployment

Render deployment settings are in [DEPLOY_RENDER.md](DEPLOY_RENDER.md) and [render.yaml](render.yaml).

The production domain is:

```text
https://openfreeocr.online
```

The app includes Privacy Policy and Terms of Service pages, canonical host redirects, security headers, and no-store API responses for OCR requests.

`/keep-alive` returns `200 ok` as a lightweight health endpoint.
