import type { SearchResult } from '@/src/types/book'

interface OpenLibraryDoc {
  key: string
  title: string
  author_name?: string[]
  first_publish_year?: number
  cover_i?: number
  first_sentence?: string[]
}

interface OpenLibraryResponse {
  docs: OpenLibraryDoc[]
  numFound: number
}

export function normalizeResults(data: OpenLibraryResponse): SearchResult[] {
  return data.docs.slice(0, 5).map((doc) => ({
    open_library_key: doc.key,
    title: doc.title,
    author: doc.author_name?.[0] ?? 'Unknown Author',
    year: doc.first_publish_year ?? null,
    cover_id: doc.cover_i ?? null,
    description: doc.first_sentence?.[0] ?? null,
  }))
}
