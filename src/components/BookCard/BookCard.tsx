'use client'

import Image from 'next/image'
import type { Book } from '@/src/types/book'

interface BookCardProps {
  book: Book
  index: number
  viewMode: 'grid' | 'list'
  onClick: (book: Book) => void
}

export function BookCard({ book, index, viewMode, onClick }: BookCardProps) {
  const delay = Math.min(index * 60, 480)

  if (viewMode === 'list') {
    return (
      <button
        onClick={() => onClick(book)}
        className="w-full flex items-center gap-4 px-3 py-4 text-left border-b border-[var(--color-border)] hover:bg-[rgba(255,255,255,0.02)] transition-all duration-300 animate-fadeInUp group"
        style={{ animationDelay: `${delay}ms` }}
      >
        {/* Cover thumbnail */}
        <div className="w-11 h-[62px] bg-[var(--color-surface-raised)] shrink-0 overflow-hidden relative rounded-lg shadow-[var(--shadow-sm)]">
          {book.cover_url ? (
            <Image
              src={book.cover_url}
              alt={`Cover of ${book.title} by ${book.author}`}
              fill
              sizes="44px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[var(--color-surface-raised)]">
              <span className="font-display text-[8px] text-[var(--color-ink-tertiary)] leading-tight text-center px-0.5">
                {book.title.slice(0, 20)}
              </span>
            </div>
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="font-sans text-[14px] text-[var(--color-ink)] truncate leading-tight group-hover:text-[var(--color-accent)] transition-colors duration-300">
            {book.title}
          </p>
          <p className="font-sans text-[12px] text-[var(--color-ink-secondary)] truncate mt-1">
            {book.author}
          </p>
        </div>

        {/* Meta */}
        <div className="shrink-0 flex flex-col items-end gap-1.5">
          {book.genre && (
            <span className="font-mono text-[9px] tracking-[0.06em] text-[var(--color-accent)] uppercase opacity-70">
              {book.genre}
            </span>
          )}
          <span className="font-mono text-[10px] text-[var(--color-ink-tertiary)]">
            {new Date(book.date_added).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </button>
    )
  }

  // Grid card — 3D perspective tilt
  return (
    <button
      onClick={() => onClick(book)}
      className="w-full text-left group book-card-3d animate-fadeInUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Cover with 3D tilt */}
      <div className="book-cover aspect-[2/3] bg-[var(--color-surface-raised)] overflow-hidden relative mb-4 rounded-xl shadow-[var(--shadow-md)]">
        {book.cover_url ? (
          <Image
            src={book.cover_url}
            alt={`Cover of ${book.title} by ${book.author}`}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-5 bg-gradient-to-br from-[var(--color-surface-raised)] to-[var(--color-surface)]">
            <div className="w-8 h-px bg-[var(--color-accent)] opacity-30 mb-4" />
            <p className="font-display text-[13px] text-[var(--color-ink-secondary)] text-center leading-snug italic">
              {book.title}
            </p>
            <p className="font-sans text-[10px] text-[var(--color-ink-tertiary)] mt-2">
              {book.author}
            </p>
          </div>
        )}

        {/* Genre badge — glass overlay */}
        {book.genre && book.genre !== 'Other' && (
          <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
            <span className="font-mono text-[9px] tracking-[0.08em] text-white/80 uppercase">
              {book.genre}
            </span>
          </div>
        )}

        {/* Hover glow border */}
        <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-[rgba(232,168,56,0.2)] transition-all duration-500 pointer-events-none" />
      </div>

      {/* Text beneath card */}
      <p className="font-sans text-[13px] text-[var(--color-ink)] leading-tight truncate group-hover:text-[var(--color-accent)] transition-colors duration-300">
        {book.title}
      </p>
      <p className="font-sans text-[11px] text-[var(--color-ink-tertiary)] truncate mt-1">
        {book.author}
      </p>
    </button>
  )
}

export function BookCardSkeleton({ viewMode }: { viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <div className="flex items-center gap-4 px-3 py-4 border-b border-[var(--color-border)]">
        <div className="w-11 h-[62px] skeleton shrink-0 rounded-lg" />
        <div className="flex-1 space-y-2.5">
          <div className="h-3.5 skeleton w-[65%] rounded" />
          <div className="h-3 skeleton w-[40%] rounded" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="aspect-[2/3] skeleton rounded-xl mb-4" />
      <div className="h-3 skeleton rounded w-[75%] mb-2" />
      <div className="h-2.5 skeleton rounded w-[50%]" />
    </div>
  )
}
