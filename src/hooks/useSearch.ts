'use client'

import { useState, useCallback, useRef } from 'react'
import type { SearchResult } from '@/src/types/book'

export function useSearch() {
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback((query: string) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (abortRef.current) abortRef.current.abort()

    if (!query.trim()) {
      setResults([])
      setIsSearching(false)
      setError(null)
      return
    }

    timerRef.current = setTimeout(async () => {
      setIsSearching(true)
      setError(null)
      const controller = new AbortController()
      abortRef.current = controller

      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query.trim())}`,
          { signal: controller.signal }
        )
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Search failed')
        }
        const data: SearchResult[] = await res.json()
        setResults(data)
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message)
          setResults([])
        }
      } finally {
        setIsSearching(false)
      }
    }, 300)
  }, [])

  const clearResults = useCallback(() => {
    setResults([])
    setError(null)
    setIsSearching(false)
  }, [])

  return { results, isSearching, error, search, clearResults }
}
