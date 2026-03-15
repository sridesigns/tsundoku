'use client'

interface TypedSearchProps {
  query: string
  onQueryChange: (value: string) => void
  isSearching: boolean
}

export function TypedSearch({ query, onQueryChange, isSearching }: TypedSearchProps) {
  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search by title or author..."
        autoFocus
        className="w-full px-4 py-3 text-sm font-sans bg-[var(--color-surface-raised)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-tertiary)] border border-[var(--color-border)] outline-none focus:border-[var(--color-border-strong)] transition-colors"
      />
      {isSearching && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-[var(--color-ink-tertiary)] border-t-transparent animate-spin" />
        </div>
      )}
    </div>
  )
}
