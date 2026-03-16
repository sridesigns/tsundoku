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
            <div className="w-11 h-[62px] skeleton shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2.5">
              <div className="h-3.5 skeleton w-[70%] rounded" />
              <div className="h-3 skeleton w-[45%] rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (results.length === 0) return null

  return (
    <div className="mt-6">
      <p className="font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink-tertiary)] uppercase mb-3">
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
              className="w-full flex items-center gap-4 py-4 text-left border-b border-[var(--color-border)] last:border-b-0 hover:bg-[rgba(255,255,255,0.02)] transition-all duration-300 disabled:opacity-40 group animate-fadeInUp"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Cover */}
              <div className="w-12 h-[68px] bg-[var(--color-surface-raised)] shrink-0 overflow-hidden relative rounded-lg shadow-[var(--shadow-sm)]">
                {coverUrl ? (
                  <Image
                    src={coverUrl}
                    alt={`Cover of ${result.title}`}
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
                <p className="font-sans text-[14px] text-[var(--color-ink)] truncate leading-tight group-hover:text-[var(--color-accent)] transition-colors duration-300">
                  {result.title}
                </p>
                <p className="font-sans text-[12px] text-[var(--color-ink-secondary)] truncate mt-1">
                  {result.author}
                </p>
                {result.year && (
                  <p className="font-mono text-[10px] text-[var(--color-ink-tertiary)] mt-1">
                    {result.year}
                  </p>
                )}
              </div>

              {/* Add indicator — glowing plus */}
              <div className="shrink-0 text-[var(--color-ink-tertiary)] group-hover:text-[var(--color-accent)] transition-colors duration-300">
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
