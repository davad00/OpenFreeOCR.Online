import { type NextRequest, NextResponse } from 'next/server'

const INVOKE_URL = 'https://ai.api.nvidia.com/v1/cv/nvidia/nemotron-ocr-v2'
const NO_STORE_HEADERS = { 'Cache-Control': 'no-store, max-age=0' }

type Detection = {
  text_prediction?: { text?: string; confidence?: number }
  bounding_box?: { points?: { x: number; y: number }[] }
}

type Line = { id: number; text: string; confidence: number }

function noStoreJson(body: unknown, status?: number) {
  return NextResponse.json(body, {
    ...(status ? { status } : {}),
    headers: NO_STORE_HEADERS,
  })
}

export async function POST(request: NextRequest) {
  let dataUrl: string | undefined
  let mergeLevel = 'paragraph'
  try {
    const body = await request.json()
    dataUrl = body?.imageDataUrl
    if (
      typeof body?.mergeLevel === 'string' &&
      ['word', 'sentence', 'paragraph'].includes(body.mergeLevel)
    ) {
      mergeLevel = body.mergeLevel
    }
  } catch {
    return noStoreJson({ error: 'Invalid request body.' }, 400)
  }

  if (!dataUrl || typeof dataUrl !== 'string') {
    return noStoreJson({ error: 'No image was provided.' }, 400)
  }

  // The inline data-URL endpoint accepts a base64 payload up to ~180k chars.
  const base64 = dataUrl.split(',')[1] ?? ''
  if (base64.length > 180_000) {
    return noStoreJson(
      {
        error:
          'Image is too large after processing. Try a smaller or lower-resolution image.',
      },
      413,
    )
  }

  const apiKey = process.env.NVIDIA_API_KEY
  if (!apiKey) {
    return noStoreJson(
      { error: 'NVIDIA_API_KEY is not configured on the server.' },
      500,
    )
  }

  let upstream: Response
  try {
    upstream = await fetch(INVOKE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: [{ type: 'image_url', url: dataUrl }],
        merge_levels: [mergeLevel],
      }),
    })
  } catch {
    return noStoreJson(
      { error: 'Could not reach the OCR service. Please try again.' },
      502,
    )
  }

  const raw = await upstream.text()
  if (!upstream.ok) {
    return noStoreJson(
      {
        error: `OCR service returned an error (${upstream.status}).`,
        detail: raw.slice(0, 500),
      },
      upstream.status,
    )
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return noStoreJson(
      { error: 'OCR service returned an unexpected response.' },
      502,
    )
  }

  const detections: Detection[] =
    (parsed as { data?: { text_detections?: Detection[] }[] })?.data?.[0]
      ?.text_detections ?? []

  const lines: Line[] = detections
    .map((d, i) => ({
      id: i + 1,
      text: d?.text_prediction?.text ?? '',
      confidence:
        typeof d?.text_prediction?.confidence === 'number'
          ? d.text_prediction!.confidence!
          : 0,
    }))
    .filter((l) => l.text.trim().length > 0)

  const text = lines.map((l) => l.text).join('\n')

  return noStoreJson({ text, lines })
}
