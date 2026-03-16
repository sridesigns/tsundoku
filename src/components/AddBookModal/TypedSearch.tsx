'use client'

interface TypedSearchProps {
  query: string
  onQueryChange: (value: string) => void
  isSearching: boolean
}

export function TypedSearch({ query, onQueryChange, isSearching }: TypedSearchProps) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="7" cy="7" r="5" />
          <path d="M14 14l-3.5-3.5" />
        </svg>
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search by title or author..."
        autoFocus
        className="w-full pl-11 pr-10 py-4 text-[14px] font-sans bg-raised text-ink placeholder:text-ink-3 border border-wire rounded-xl input-focus"
      />

      {isSearching && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-[1.5px] border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
