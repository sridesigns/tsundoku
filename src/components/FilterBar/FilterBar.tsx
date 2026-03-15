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
}

export function FilterBar({
  genres,
  activeGenre,
  onGenreChange,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 mb-6">
      {genres.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => onGenreChange(null)}
            className={`shrink-0 px-3 py-1.5 text-xs font-mono transition-colors border ${
              activeGenre === null
                ? 'bg-[var(--color-ink)] text-[var(--color-bg)] border-[var(--color-ink)]'
                : 'text-[var(--color-ink-secondary)] border-[var(--color-border)] hover:border-[var(--color-border-strong)]'
            }`}
          >
            All
          </button>
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => onGenreChange(genre)}
              className={`shrink-0 px-3 py-1.5 text-xs font-mono transition-colors border ${
                activeGenre === genre
                  ? 'bg-[var(--color-ink)] text-[var(--color-bg)] border-[var(--color-ink)]'
                  : 'text-[var(--color-ink-secondary)] border-[var(--color-border)] hover:border-[var(--color-border-strong)]'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="text-xs font-mono text-[var(--color-ink-secondary)] bg-transparent border border-[var(--color-border)] px-2 py-1.5 outline-none focus:border-[var(--color-border-strong)]"
          >
            <option value="date_added">Recently added</option>
            <option value="title">Title A–Z</option>
            <option value="author">Author A–Z</option>
          </select>
        </div>
        <div className="flex border border-[var(--color-border)]">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 transition-colors ${
              viewMode === 'grid' ? 'bg-[var(--color-ink)] text-[var(--color-bg)]' : 'text-[var(--color-ink-secondary)]'
            }`}
            aria-label="Grid view"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="1" width="6" height="6" />
              <rect x="9" y="1" width="6" height="6" />
              <rect x="1" y="9" width="6" height="6" />
              <rect x="9" y="9" width="6" height="6" />
            </svg>
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-1.5 transition-colors ${
              viewMode === 'list' ? 'bg-[var(--color-ink)] text-[var(--color-bg)]' : 'text-[var(--color-ink-secondary)]'
            }`}
            aria-label="List view"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="2" width="14" height="2" />
              <rect x="1" y="7" width="14" height="2" />
              <rect x="1" y="12" width="14" height="2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
