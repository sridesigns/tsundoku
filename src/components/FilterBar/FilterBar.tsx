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
  genres, activeGenre, onGenreChange,
  sort, onSortChange,
  viewMode, onViewModeChange,
  count,
}: FilterBarProps) {
  return (
    <div className="mb-8 space-y-4">
      {/* Genre pills */}
      {genres.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
          <button
            onClick={() => onGenreChange(null)}
            className={`shrink-0 px-4 py-1.5 text-[11px] font-mono tracking-[0.05em] uppercase rounded-full transition-all duration-250 ${
              activeGenre === null
                ? 'bg-gold text-bg'
                : 'text-ink-2 border border-wire hover:border-wire-2 hover:text-ink'
            }`}
          >
            All
          </button>
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => onGenreChange(genre)}
              className={`shrink-0 px-4 py-1.5 text-[11px] font-mono tracking-[0.05em] uppercase rounded-full transition-all duration-250 ${
                activeGenre === genre
                  ? 'bg-gold text-bg'
                  : 'text-ink-2 border border-wire hover:border-wire-2 hover:text-ink'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="text-[12px] font-mono text-ink-2 bg-transparent border-none outline-none cursor-pointer appearance-none pr-4 hover:text-ink transition-colors duration-200"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='8' height='5' viewBox='0 0 8 5' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l3 3 3-3' stroke='%2354504C' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right center',
            }}
          >
            <option value="date_added">Recent</option>
            <option value="title">Title</option>
            <option value="author">Author</option>
          </select>
          <span className="font-mono text-[11px] text-ink-3">
            {count} {count === 1 ? 'book' : 'books'}
          </span>
        </div>

        <div className="flex gap-0.5 p-1 rounded-lg bg-raised border border-wire">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded-md transition-colors duration-200 ${
              viewMode === 'grid' ? 'text-gold bg-surface' : 'text-ink-3 hover:text-ink-2'
            }`}
            aria-label="Grid view"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="1.5" y="1.5" width="5" height="5" rx="1" />
              <rect x="9.5" y="1.5" width="5" height="5" rx="1" />
              <rect x="1.5" y="9.5" width="5" height="5" rx="1" />
              <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
            </svg>
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-1.5 rounded-md transition-colors duration-200 ${
              viewMode === 'list' ? 'text-gold bg-surface' : 'text-ink-3 hover:text-ink-2'
            }`}
            aria-label="List view"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1.5 4h13M1.5 8h13M1.5 12h13" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
