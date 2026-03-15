'use client'

import type { Genre } from '@/src/types/book'

type SortOption = 'date_added' | 'title' | 'author'
type ViewMode = 'grid' | 'list'

interface FilterBarProps {
  genres: Genre[]
  activeGenre: Genre | null
  onGenreChange: (genre: Genre | null) => void
  sort: SortOption
  onSortChange: (sort: SortOption) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  count: number
}

export function FilterBar({
  genres,
  activeGenre,
  onGenreChange,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  count,
}: FilterBarProps) {
  return (
    <div className="mb-8 space-y-5">
      {/* Genre pills — horizontal scroll on mobile */}
      {genres.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide -mx-1 px-1">
          <button
            onClick={() => onGenreChange(null)}
            className={`shrink-0 px-3.5 py-[7px] text-[11px] font-mono tracking-[0.04em] uppercase rounded-full transition-all duration-200 ${
              activeGenre === null
                ? 'bg-[var(--color-ink)] text-[var(--color-bg)]'
                : 'text-[var(--color-ink-secondary)] border border-[var(--color-border)] hover:border-[var(--color-ink-tertiary)]'
            }`}
          >
            All
          </button>
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => onGenreChange(genre)}
              className={`shrink-0 px-3.5 py-[7px] text-[11px] font-mono tracking-[0.04em] uppercase rounded-full transition-all duration-200 ${
                activeGenre === genre
                  ? 'bg-[var(--color-ink)] text-[var(--color-bg)]'
                  : 'text-[var(--color-ink-secondary)] border border-[var(--color-border)] hover:border-[var(--color-ink-tertiary)]'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      )}

      {/* Controls row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="text-[12px] font-mono text-[var(--color-ink-secondary)] bg-transparent border-none outline-none cursor-pointer appearance-none pr-4"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='8' height='5' viewBox='0 0 8 5' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l3 3 3-3' stroke='%23847A72' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right center',
            }}
          >
            <option value="date_added">Recent</option>
            <option value="title">Title</option>
            <option value="author">Author</option>
          </select>
          <span className="text-[11px] font-mono text-[var(--color-ink-tertiary)]">
            {count} {count === 1 ? 'book' : 'books'}
          </span>
        </div>

        <div className="flex gap-0.5">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 transition-colors duration-200 ${
              viewMode === 'grid'
                ? 'text-[var(--color-ink)]'
                : 'text-[var(--color-ink-tertiary)] hover:text-[var(--color-ink-secondary)]'
            }`}
            aria-label="Grid view"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="1.5" y="1.5" width="5" height="5" />
              <rect x="9.5" y="1.5" width="5" height="5" />
              <rect x="1.5" y="9.5" width="5" height="5" />
              <rect x="9.5" y="9.5" width="5" height="5" />
            </svg>
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 transition-colors duration-200 ${
              viewMode === 'list'
                ? 'text-[var(--color-ink)]'
                : 'text-[var(--color-ink-tertiary)] hover:text-[var(--color-ink-secondary)]'
            }`}
            aria-label="List view"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1.5 4h13M1.5 8h13M1.5 12h13" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
