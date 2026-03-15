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
  const delay = Math.min(index * 50, 400)

  if (viewMode === 'list') {
    return (
      <button
        onClick={() => onClick(book)}
        className="w-full flex items-center gap-4 px-1 py-4 text-left border-b border-[var(--color-border)] hover:bg-[var(--color-surface-raised)]/50 transition-colors duration-200 animate-fadeInUp"
        style={{ animationDelay: `${delay}ms` }}
      >
        {/* Cover thumbnail */}
        <div className="w-11 h-[62px] bg-[var(--color-surface-raised)] shrink-0 overflow-hidden relative shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
          {book.cover_url ? (
            <Image
              src={book.cover_url}
              alt=""
              fill
              sizes="44px"
              className="object-cover"
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
          <p className="font-sans text-[14px] text-[var(--color-ink)] truncate leading-tight">
            {book.title}
          </p>
          <p className="font-sans text-[12px] text-[var(--color-ink-secondary)] truncate mt-0.5">
            {book.author}
          </p>
        </div>

        {/* Meta */}
        <div className="shrink-0 flex flex-col items-end gap-1">
          {book.genre && (
            <span className="font-mono text-[10px] tracking-[0.04em] text-[var(--color-ink-tertiary)] uppercase">
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

  // Grid card
  return (
    <button
      onClick={() => onClick(book)}
      className="w-full text-left group animate-fadeInUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Cover */}
      <div className="aspect-[2/3] bg-[var(--color-surface-raised)] overflow-hidden relative mb-3 shadow-[0_2px_8px_rgba(0,0,0,0.06),_0_1px_2px_rgba(0,0,0,0.04)]">
        {book.cover_url ? (
          <Image
            src={book.cover_url}
            alt=""
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-5 bg-[var(--color-surface-raised)]">
            <div className="w-6 h-px bg-[var(--color-border-strong)] mb-4" />
            <p className="font-display text-[13px] text-[var(--color-ink-secondary)] text-center leading-snug italic">
              {book.title}
            </p>
            <p className="font-sans text-[10px] text-[var(--color-ink-tertiary)] mt-2">
              {book.author}
            </p>
          </div>
        )}

        {/* Genre badge — subtle overlay */}
        {book.genre && !book.genre.startsWith('Categoris') && (
          <div className="absolute bottom-0 left-0 right-0 px-2.5 py-2 bg-gradient-to-t from-black/50 to-transparent">
            <span className="font-mono text-[9px] tracking-[0.06em] text-white/90 uppercase">
              {book.genre}
            </span>
          </div>
        )}
      </div>

      {/* Text beneath card */}
      <p className="font-sans text-[13px] text-[var(--color-ink)] leading-tight truncate">
        {book.title}
      </p>
      <p className="font-sans text-[11px] text-[var(--color-ink-tertiary)] truncate mt-0.5">
        {book.author}
      </p>
    </button>
  )
}

export function BookCardSkeleton({ viewMode }: { viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <div className="flex items-center gap-4 px-1 py-4 border-b border-[var(--color-border)]">
        <div className="w-11 h-[62px] skeleton" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 skeleton w-[65%]" />
          <div className="h-3 skeleton w-[40%]" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="aspect-[2/3] skeleton mb-3" />
      <div className="h-3 skeleton w-[75%] mb-1.5" />
      <div className="h-2.5 skeleton w-[50%]" />
    </div>
  )
}
