'use client'

import { useMemo } from 'react'
import { useBooks } from '@/src/hooks/useBooks'
import { useToast } from '@/src/components/Toast/Toast'
import type { Book } from '@/src/types/book'
import Image from 'next/image'

function ArchiveItem({
  book,
  onRestore,
  index,
}: {
  book: Book
  onRestore: (id: string) => void
  index: number
}) {
  return (
    <div
      className="flex items-center gap-4 py-4 border-b border-[var(--color-border)] last:border-b-0 animate-fadeInUp"
      style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
    >
      {/* Cover */}
      <div className="w-11 h-[62px] bg-[var(--color-surface-raised)] shrink-0 overflow-hidden relative shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
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
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display text-[8px] text-[var(--color-ink-tertiary)] text-center leading-tight px-0.5">
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

      {/* Restore */}
      <button
        onClick={() => onRestore(book.id)}
        className="shrink-0 px-3.5 py-2 text-[11px] font-mono tracking-[0.04em] uppercase border border-[var(--color-border)] text-[var(--color-ink-secondary)] hover:border-[var(--color-ink-tertiary)] hover:text-[var(--color-ink)] transition-all duration-200"
      >
        Restore
      </button>
    </div>
  )
}

export default function ArchivePage() {
  const { books, restoreBook } = useBooks()
  const { showToast } = useToast()

  const readBooks = useMemo(
    () => books.filter((b) => b.status === 'read').sort((a, b) => b.date_updated - a.date_updated),
    [books]
  )

  const removedBooks = useMemo(
    () => books.filter((b) => b.status === 'removed').sort((a, b) => b.date_updated - a.date_updated),
    [books]
  )

  const handleRestore = async (id: string) => {
    const book = books.find((b) => b.id === id)
    await restoreBook(id)
    showToast(`Restored "${book?.title}"`)
  }

  const isEmpty = readBooks.length === 0 && removedBooks.length === 0

  return (
    <div>
      <header className="mb-8 md:mb-10">
        <h1 className="font-display text-[28px] md:text-[34px] text-[var(--color-ink)] tracking-[-0.01em]">
          Archive
        </h1>
      </header>

      {isEmpty && (
        <div className="py-20 text-center">
          <p className="font-sans text-[14px] text-[var(--color-ink-tertiary)] leading-relaxed">
            Books you&apos;ve read or removed<br />will appear here.
          </p>
        </div>
      )}

      {readBooks.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink-tertiary)] uppercase">
              Read
            </h2>
            <div className="flex-1 h-px bg-[var(--color-border)]" />
            <span className="font-mono text-[10px] text-[var(--color-ink-tertiary)]">
              {readBooks.length}
            </span>
          </div>
          <div>
            {readBooks.map((book, i) => (
              <ArchiveItem key={book.id} book={book} onRestore={handleRestore} index={i} />
            ))}
          </div>
        </section>
      )}

      {removedBooks.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink-tertiary)] uppercase">
              Removed
            </h2>
            <div className="flex-1 h-px bg-[var(--color-border)]" />
            <span className="font-mono text-[10px] text-[var(--color-ink-tertiary)]">
              {removedBooks.length}
            </span>
          </div>
          <div>
            {removedBooks.map((book, i) => (
              <ArchiveItem key={book.id} book={book} onRestore={handleRestore} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
