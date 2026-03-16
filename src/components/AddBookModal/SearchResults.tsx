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
          <div key={i} className="flex items-center gap-4 py-4 border-b border-edge">
            <div className="w-12 h-[66px] skeleton shrink-0 rounded-lg" />
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
      <p className="font-mono text-[10px] tracking-widest text-faint uppercase mb-2">Results</p>
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
              className="w-full flex items-center gap-4 py-3.5 px-2 text-left border-b border-edge last:border-b-0 hover:bg-fog/60 transition-all duration-200 disabled:opacity-40 group animate-fadeInUp rounded-xl"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="w-12 h-[66px] shrink-0 overflow-hidden relative rounded-lg bg-fog border border-edge">
                {coverUrl ? (
                  <Image src={coverUrl} alt={result.title} fill sizes="48px" className="object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-serif text-[7px] text-muted text-center leading-tight px-0.5">{result.title.slice(0, 15)}</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-sans text-[14px] text-ink font-medium truncate group-hover:text-pop transition-colors duration-200">{result.title}</p>
                <p className="font-sans text-[12px] text-muted truncate mt-0.5">{result.author}</p>
                {result.year && <p className="font-mono text-[10px] text-faint mt-1">{result.year}</p>}
              </div>

              <div className="shrink-0 text-faint group-hover:text-pop transition-colors duration-200">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
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
