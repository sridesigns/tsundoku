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
  const delay = index * 40

  if (viewMode === 'list') {
    return (
      <button
        onClick={() => onClick(book)}
        className="w-full flex items-center gap-4 px-4 py-3 text-left border-b border-[var(--color-border)] hover:bg-[var(--color-surface-raised)] transition-colors animate-fadeIn"
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="w-10 h-14 bg-[var(--color-surface-raised)] shrink-0 overflow-hidden relative">
          {book.cover_url && (
            <Image
              src={book.cover_url}
              alt={book.title}
              fill
              sizes="40px"
              className="object-cover"
              loading="lazy"
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-sans text-sm text-[var(--color-ink)] truncate">{book.title}</p>
          <p className="font-sans text-xs text-[var(--color-ink-secondary)] truncate">{book.author}</p>
        </div>
        {book.genre && (
          <span className="shrink-0 font-mono text-xs text-[var(--color-ink-tertiary)] px-2 py-0.5 border border-[var(--color-border)]">
            {book.genre}
          </span>
        )}
        <span className="shrink-0 font-mono text-xs text-[var(--color-ink-tertiary)]">
          {new Date(book.date_added).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </button>
    )
  }

  return (
    <button
      onClick={() => onClick(book)}
      className="w-full text-left group animate-fadeIn"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="aspect-[2/3] bg-[var(--color-surface-raised)] overflow-hidden relative mb-2">
        {book.cover_url ? (
          <Image
            src={book.cover_url}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-[1.02] transition-transform duration-280"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-4">
            <p className="font-display text-sm text-[var(--color-ink-tertiary)] text-center leading-tight">
              {book.title}
            </p>
          </div>
        )}
        {book.genre && (
          <span className="absolute bottom-2 left-2 font-mono text-[10px] text-[var(--color-bg)] bg-[var(--color-ink)]/80 px-1.5 py-0.5">
            {book.genre}
          </span>
        )}
      </div>
      <p className="font-sans text-sm text-[var(--color-ink)] truncate">{book.title}</p>
      <p className="font-sans text-xs text-[var(--color-ink-secondary)] truncate">{book.author}</p>
    </button>
  )
}

export function BookCardSkeleton({ viewMode }: { viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <div className="flex items-center gap-4 px-4 py-3 border-b border-[var(--color-border)] animate-pulse">
        <div className="w-10 h-14 bg-[var(--color-surface-raised)]" />
        <div className="flex-1">
          <div className="h-3.5 bg-[var(--color-surface-raised)] w-40 mb-1.5" />
          <div className="h-3 bg-[var(--color-surface-raised)] w-24" />
        </div>
      </div>
    )
  }

  return (
    <div className="animate-pulse">
      <div className="aspect-[2/3] bg-[var(--color-surface-raised)] mb-2" />
      <div className="h-3.5 bg-[var(--color-surface-raised)] w-3/4 mb-1.5" />
      <div className="h-3 bg-[var(--color-surface-raised)] w-1/2" />
    </div>
  )
}
