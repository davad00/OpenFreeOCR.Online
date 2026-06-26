import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// OpenFreeOCR is served from this domain and this domain only. Any other
// custom host that points at this deployment is permanently redirected here,
// so the canonical, indexable home of the app is always openfreeocr.online.
const CANONICAL_HOST = 'openfreeocr.online'

export function proxy(request: NextRequest) {
  const hostname = (request.headers.get('host') ?? '').split(':')[0].toLowerCase()

  // Never redirect local development hosts used while building and reviewing
  // the app. Every public host should resolve to openfreeocr.online.
  const isLocal =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.local')

  if (!isLocal && hostname !== CANONICAL_HOST) {
    const url = request.nextUrl.clone()
    url.protocol = 'https:'
    url.host = CANONICAL_HOST
    url.port = ''
    return NextResponse.redirect(url, 308)
  }

  return NextResponse.next()
}

export const config = {
  // Run on everything except static assets and the well-known crawler files.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
}
