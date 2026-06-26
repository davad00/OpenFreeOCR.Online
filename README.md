# OpenFreeOCR.Online

OpenFreeOCR is a free, no-signup image-to-text OCR tool for photos, screenshots, and scanned documents. It supports batch image processing, paste-from-clipboard, and text grouping by word, sentence, or paragraph.

The app is built with Next.js, React, Fluent UI, and Bun. OCR is performed through NVIDIA's hosted OCR API via the server-side `/api/ocr` route.

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
