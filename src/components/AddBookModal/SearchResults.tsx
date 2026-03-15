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
      <div className="mt-6 space-y-0">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 py-4 border-b border-[var(--color-border)]">
            <div className="w-11 h-[62px] skeleton shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 skeleton w-[70%]" />
              <div className="h-3 skeleton w-[45%]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (results.length === 0) return null

  return (
    <div className="mt-5">
      <p className="font-mono text-[10px] tracking-[0.06em] text-[var(--color-ink-tertiary)] uppercase mb-2">
        Results
      </p>
      <div>
        {results.map((result, i) => {
          const coverUrl = result.cover_id
            ? `https://covers.openlibrary.org/b/id/${result.cover_id}-M.jpg`
            : null

          return (
            <button
              key={result.open_library_key}
              onClick={() => onSelect(result)}
              disabled={isAdding}
              className="w-full flex items-center gap-4 py-3.5 text-left border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface-raised)] transition-colors duration-200 disabled:opacity-40 animate-fadeInUp"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Cover */}
              <div className="w-12 h-[68px] bg-[var(--color-surface-raised)] shrink-0 overflow-hidden relative rounded shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                {coverUrl ? (
                  <Image
                    src={coverUrl}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-display text-[7px] text-[var(--color-ink-tertiary)] text-center leading-tight px-0.5">
                      {result.title.slice(0, 15)}
                    </span>
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="font-sans text-[14px] text-[var(--color-ink)] truncate leading-tight">
                  {result.title}
                </p>
                <p className="font-sans text-[12px] text-[var(--color-ink-secondary)] truncate mt-0.5">
                  {result.author}
                </p>
                {result.year && (
                  <p className="font-mono text-[10px] text-[var(--color-ink-tertiary)] mt-1">
                    {result.year}
                  </p>
                )}
              </div>

              {/* Add indicator */}
              <div className="shrink-0 text-[var(--color-ink-tertiary)]">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M8 3v10M3 8h10" />
                </svg>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
