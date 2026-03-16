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
      <div className="mt-5 space-y-0">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 py-4 border-b border-wire">
            <div className="w-11 h-[62px] skeleton shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 skeleton w-[68%]" />
              <div className="h-3 skeleton w-[44%]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (results.length === 0) return null

  return (
    <div className="mt-5">
      <p className="font-mono text-[10px] tracking-[0.08em] text-ink-3 uppercase mb-2">Results</p>
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
              className="w-full flex items-center gap-4 py-3.5 text-left border-b border-wire last:border-b-0 hover:bg-raised transition-colors duration-200 disabled:opacity-40 group animate-fadeInUp rounded-lg px-2"
              style={{ animationDelay: `${i * 55}ms` }}
            >
              <div className="w-12 h-[68px] bg-raised shrink-0 overflow-hidden relative rounded-lg border border-wire">
                {coverUrl ? (
                  <Image src={coverUrl} alt={result.title} fill sizes="48px" className="object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-display text-[7px] text-ink-3 text-center leading-tight px-0.5">
                      {result.title.slice(0, 15)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-sans text-[14px] text-ink truncate leading-tight group-hover:text-gold transition-colors duration-200">
                  {result.title}
                </p>
                <p className="font-sans text-[12px] text-ink-2 truncate mt-0.5">{result.author}</p>
                {result.year && (
                  <p className="font-mono text-[10px] text-ink-3 mt-1">{result.year}</p>
                )}
              </div>

              <div className="shrink-0 text-ink-3 group-hover:text-gold transition-colors duration-200">
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
