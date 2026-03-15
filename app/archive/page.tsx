'use client'

import { useMemo } from 'react'
import { useBooks } from '@/src/hooks/useBooks'
import { useToast } from '@/src/components/Toast/Toast'
import type { Book } from '@/src/types/book'
import Image from 'next/image'

function ArchiveItem({
  book,
  onRestore,
}: {
  book: Book
  onRestore: (id: string) => void
}) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-[var(--color-border)]">
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
      <button
        onClick={() => onRestore(book.id)}
        className="shrink-0 px-3 py-1.5 text-xs font-mono border border-[var(--color-border)] text-[var(--color-ink-secondary)] hover:border-[var(--color-border-strong)] transition-colors"
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

  return (
    <div>
      <h1 className="font-display text-3xl text-[var(--color-ink)] mb-8">Archive</h1>

      {readBooks.length === 0 && removedBooks.length === 0 && (
        <p className="font-sans text-sm text-[var(--color-ink-tertiary)]">
          Books you&apos;ve read or removed will appear here.
        </p>
      )}

      {readBooks.length > 0 && (
        <section className="mb-10">
          <h2 className="font-sans text-xs font-medium text-[var(--color-ink-tertiary)] uppercase tracking-wider mb-4">
            Read ({readBooks.length})
          </h2>
          <div>
            {readBooks.map((book) => (
              <ArchiveItem key={book.id} book={book} onRestore={handleRestore} />
            ))}
          </div>
        </section>
      )}

      {removedBooks.length > 0 && (
        <section>
          <h2 className="font-sans text-xs font-medium text-[var(--color-ink-tertiary)] uppercase tracking-wider mb-4">
            Removed ({removedBooks.length})
          </h2>
          <div>
            {removedBooks.map((book) => (
              <ArchiveItem key={book.id} book={book} onRestore={handleRestore} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
