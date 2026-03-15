import { NextRequest, NextResponse } from 'next/server'
import { normalizeResults } from '@/src/lib/openLibrary'

const rateLimit = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)

  if (!entry || now > entry.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + 60_000 })
    return true
  }

  if (entry.count >= 10) return false
  entry.count++
  return true
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again in a minute.' },
      { status: 429 }
    )
  }

  const q = request.nextUrl.searchParams.get('q')
  if (!q || q.trim().length === 0) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 })
  }

  try {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(q.trim())}&limit=5&fields=key,title,author_name,first_publish_year,cover_i,first_sentence`
    const res = await fetch(url, { next: { revalidate: 3600 } })

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch from Open Library' },
        { status: 502 }
      )
    }

    const data = await res.json()
    const results = normalizeResults(data)

    return NextResponse.json(results, {
      headers: { 'Cache-Control': 'public, s-maxage=3600' },
    })
  } catch {
    return NextResponse.json(
      { error: 'Search service temporarily unavailable' },
      { status: 503 }
    )
  }
}
