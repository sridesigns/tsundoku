import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { GENRES, type Genre } from '@/src/types/book'

const SYSTEM_PROMPT = `Return exactly one genre from this list: Fiction, Literary Fiction, Science Fiction, Fantasy, Mystery & Thriller, Historical Fiction, Non-Fiction, Biography & Memoir, Science & Nature, Philosophy, History, Self-Development, Design & Creativity, Essays, Graphic Novel, Poetry, Other. Return only the genre string. No punctuation. No explanation.`

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Anthropic API key not configured' },
      { status: 500 }
    )
  }

  let body: { title?: string; author?: string; description?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { title, author, description } = body
  if (!title) {
    return NextResponse.json(
      { error: 'Title is required' },
      { status: 400 }
    )
  }

  try {
    const client = new Anthropic({ apiKey })
    const userMessage = `Title: ${title}\nAuthor: ${author ?? 'Unknown'}\nDescription: ${description ?? 'N/A'}`

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 50,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })

    const text = response.content[0]?.type === 'text' ? response.content[0].text.trim() : 'Other'
    const genre: Genre = GENRES.includes(text as Genre) ? (text as Genre) : 'Other'

    return NextResponse.json({ genre })
  } catch (err) {
    console.error('Categorize error:', err)
    return NextResponse.json(
      { error: 'Failed to categorize book' },
      { status: 502 }
    )
  }
}
