'use client'

import Image from 'next/image'
import type { SearchResult } from '@/src/types/book'

interface SearchResultsProps {
  results: SearchResult[]
  isSearching: boolean
  isAdding: boolean
  onSelect: (result: SearchResult) => void
}

export function SearchResults({ results, isSearching, isAdding, onSelect }: SearchResultsProps) {
  if (isSearching && results.length === 0) {
    return (
      <div className="mt-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="w-12 h-16 bg-[var(--color-surface-raised)]" />
            <div className="flex-1">
              <div className="h-3.5 bg-[var(--color-surface-raised)] w-3/4 mb-2" />
              <div className="h-3 bg-[var(--color-surface-raised)] w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (results.length === 0) return null

  return (
    <div className="mt-4 space-y-1">
      {results.map((result) => {
        const coverUrl = result.cover_id
          ? `https://covers.openlibrary.org/b/id/${result.cover_id}-S.jpg`
          : null

        return (
          <button
            key={result.open_library_key}
            onClick={() => onSelect(result)}
            disabled={isAdding}
            className="w-full flex items-center gap-3 p-3 text-left hover:bg-[var(--color-surface-raised)] transition-colors disabled:opacity-50"
          >
            <div className="w-10 h-14 bg-[var(--color-surface-raised)] shrink-0 overflow-hidden relative">
              {coverUrl && (
                <Image
                  src={coverUrl}
                  alt={result.title}
                  fill
                  sizes="40px"
                  className="object-cover"
                  loading="lazy"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans text-sm text-[var(--color-ink)] truncate">{result.title}</p>
              <p className="font-sans text-xs text-[var(--color-ink-secondary)] truncate">
                {result.author}
                {result.year ? ` · ${result.year}` : ''}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
