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
  const delay = Math.min(index * 55, 440)

  if (viewMode === 'list') {
    return (
      <button
        onClick={() => onClick(book)}
        className="w-full flex items-center gap-4 px-4 py-4 text-left border-b border-wire last:border-b-0 hover:bg-raised transition-colors duration-200 animate-fadeInUp group"
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="w-11 h-[62px] bg-raised shrink-0 overflow-hidden relative rounded-lg">
          {book.cover_url ? (
            <Image
              src={book.cover_url}
              alt={`${book.title}`}
              fill sizes="44px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-display text-[8px] text-ink-3 leading-tight text-center px-0.5">
                {book.title.slice(0, 18)}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-sans text-[14px] text-ink truncate leading-tight group-hover:text-gold transition-colors duration-200">
            {book.title}
          </p>
          <p className="font-sans text-[12px] text-ink-2 truncate mt-0.5">
            {book.author}
          </p>
        </div>

        <div className="shrink-0 flex flex-col items-end gap-1.5">
          {book.genre && (
            <span className="font-mono text-[9px] tracking-[0.06em] text-gold/60 uppercase">
              {book.genre}
            </span>
          )}
          <span className="font-mono text-[10px] text-ink-3">
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
      className="w-full text-left group book-card-3d animate-fadeInUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Cover */}
      <div className="book-cover aspect-[2/3] bg-raised overflow-hidden relative mb-3.5 rounded-xl"
           style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}>
        {book.cover_url ? (
          <Image
            src={book.cover_url}
            alt={`${book.title}`}
            fill
            sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 22vw"
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-5 bg-gradient-to-br from-raised to-surface">
            <div className="w-8 h-px bg-gold opacity-25 mb-4" />
            <p className="font-display text-[12px] text-ink-2 text-center leading-snug italic">
              {book.title}
            </p>
            <p className="font-sans text-[10px] text-ink-3 mt-2">{book.author}</p>
          </div>
        )}

        {/* Genre badge */}
        {book.genre && book.genre !== 'Other' && (
          <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5 bg-gradient-to-t from-black/65 to-transparent">
            <span className="font-mono text-[9px] tracking-[0.08em] text-white/75 uppercase">
              {book.genre}
            </span>
          </div>
        )}

        {/* Hover border */}
        <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-gold/20 transition-colors duration-400 pointer-events-none" />
      </div>

      <p className="font-sans text-[13px] text-ink truncate leading-tight group-hover:text-gold transition-colors duration-200">
        {book.title}
      </p>
      <p className="font-sans text-[11px] text-ink-3 truncate mt-0.5">{book.author}</p>
    </button>
  )
}

export function BookCardSkeleton({ viewMode }: { viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <div className="flex items-center gap-4 px-4 py-4 border-b border-wire">
        <div className="w-11 h-[62px] skeleton shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 skeleton w-[62%]" />
          <div className="h-3 skeleton w-[40%]" />
        </div>
      </div>
    )
  }
  return (
    <div>
      <div className="aspect-[2/3] skeleton rounded-xl mb-3.5" />
      <div className="h-3 skeleton w-[72%] mb-1.5" />
      <div className="h-2.5 skeleton w-[48%]" />
    </div>
  )
}
