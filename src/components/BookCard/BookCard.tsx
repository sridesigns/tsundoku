'use client'

import Image from 'next/image'
import type { Book } from '@/src/types/book'

function genreClass(genre: string | null): string {
  if (!genre) return 'genre-default'
  const g = genre.toLowerCase()
  if (g.includes('sci')) return 'genre-scifi'
  if (g.includes('fantasy')) return 'genre-fantasy'
  if (g.includes('mystery') || g.includes('thriller')) return 'genre-mystery'
  if (g.includes('history') || g.includes('historical')) return 'genre-history'
  if (g.includes('philosophy')) return 'genre-philosophy'
  if (g.includes('bio') || g.includes('memoir')) return 'genre-biography'
  if (g.includes('non-fiction') || g.includes('science') || g.includes('nature')) return 'genre-nonfiction'
  if (g.includes('fiction') || g.includes('literary')) return 'genre-fiction'
  return 'genre-default'
}

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
        className="w-full flex items-center gap-4 px-5 py-4 text-left border-b border-edge last:border-b-0 hover:bg-fog/60 transition-all duration-200 animate-fadeInUp group"
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="w-12 h-[66px] shrink-0 overflow-hidden relative rounded-lg cover-shadow">
          {book.cover_url ? (
            <Image src={book.cover_url} alt={book.title} fill sizes="48px" className="object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-fog border border-edge">
              <span className="font-serif text-[9px] text-muted text-center leading-tight px-1">{book.title.slice(0, 20)}</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-sans text-[14px] text-ink font-medium truncate group-hover:text-pop transition-colors duration-200">{book.title}</p>
          <p className="font-sans text-[12px] text-muted truncate mt-0.5">{book.author}</p>
        </div>

        <div className="shrink-0 flex flex-col items-end gap-1.5">
          {book.genre && book.genre !== 'Other' && (
            <span className={`${genreClass(book.genre)} genre-badge font-mono text-[9px] tracking-wide uppercase px-2.5 py-1 rounded-full`}>
              {book.genre}
            </span>
          )}
          <span className="font-mono text-[10px] text-faint">
            {new Date(book.date_added).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={() => onClick(book)}
      className="w-full text-left group animate-fadeInUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="aspect-[2/3] overflow-hidden relative mb-3 rounded-2xl cover-shadow">
        {book.cover_url ? (
          <Image src={book.cover_url} alt={book.title} fill sizes="(max-width:640px) 46vw, (max-width:1024px) 30vw, 22vw" className="object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-fog to-snow border border-edge">
            <div className="w-8 h-[2px] rounded-full mb-3" style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }} />
            <p className="font-serif text-[12px] text-ink text-center leading-snug italic">{book.title}</p>
            <p className="font-sans text-[10px] text-muted mt-1.5">{book.author}</p>
          </div>
        )}

        {book.genre && book.genre !== 'Other' && (
          <div className="absolute bottom-2 left-2">
            <span className={`${genreClass(book.genre)} genre-badge font-mono text-[8px] tracking-wider uppercase px-2 py-0.5 rounded-full`}>
              {book.genre}
            </span>
          </div>
        )}
      </div>

      <p className="font-sans text-[13px] text-ink font-medium truncate leading-tight group-hover:text-pop transition-colors duration-200">{book.title}</p>
      <p className="font-sans text-[11px] text-muted truncate mt-0.5">{book.author}</p>
    </button>
  )
}

export function BookCardSkeleton({ viewMode }: { viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <div className="flex items-center gap-4 px-5 py-4 border-b border-edge">
        <div className="w-12 h-[66px] skeleton shrink-0 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 skeleton w-3/5" />
          <div className="h-3 skeleton w-2/5" />
        </div>
      </div>
    )
  }
  return (
    <div>
      <div className="aspect-[2/3] skeleton rounded-2xl mb-3" />
      <div className="h-3 skeleton w-[70%] mb-1.5" />
      <div className="h-2.5 skeleton w-[45%]" />
    </div>
  )
}
