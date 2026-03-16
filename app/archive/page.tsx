'use client'

import { useMemo } from 'react'
import { useBooks } from '@/src/hooks/useBooks'
import { useToast } from '@/src/components/Toast/Toast'
import type { Book } from '@/src/types/book'
import Image from 'next/image'

function ArchiveItem({ book, onRestore, index }: { book: Book; onRestore: (id: string) => void; index: number }) {
  return (
    <div
      className="flex items-center gap-4 px-4 py-4 border-b border-wire last:border-b-0 animate-fadeInUp group"
      style={{ animationDelay: `${Math.min(index * 50, 280)}ms` }}
    >
      <div className="w-11 h-[62px] bg-raised shrink-0 overflow-hidden relative rounded-lg border border-wire">
        {book.cover_url ? (
          <Image src={book.cover_url} alt="" fill sizes="44px" className="object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display text-[8px] text-ink-3 text-center leading-tight px-0.5">
              {book.title.slice(0, 18)}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-sans text-[14px] text-ink truncate leading-tight">{book.title}</p>
        <p className="font-sans text-[12px] text-ink-2 truncate mt-0.5">{book.author}</p>
      </div>

      <button
        onClick={() => onRestore(book.id)}
        className="shrink-0 px-4 py-2 text-[11px] font-mono tracking-[0.04em] uppercase rounded-xl border border-wire text-ink-2 hover:border-gold hover:text-gold transition-colors duration-200"
      >
        Restore
      </button>
    </div>
  )
}

export default function ArchivePage() {
  const { books, restoreBook } = useBooks()
  const { showToast } = useToast()

  const readBooks    = useMemo(() => books.filter((b) => b.status === 'read').sort((a, b) => b.date_updated - a.date_updated),    [books])
  const removedBooks = useMemo(() => books.filter((b) => b.status === 'removed').sort((a, b) => b.date_updated - a.date_updated), [books])

  const handleRestore = async (id: string) => {
    const book = books.find((b) => b.id === id)
    await restoreBook(id)
    showToast(`Restored "${book?.title}"`)
  }

  return (
    <div>
      <header className="mb-8 md:mb-10">
        <h1 className="font-display text-[34px] md:text-[44px] text-ink tracking-[-0.025em]">Archive</h1>
        <div className="w-10 h-[2px] bg-gold mt-3 opacity-50" />
      </header>

      {readBooks.length === 0 && removedBooks.length === 0 && (
        <div className="py-20 text-center">
          <p className="font-sans text-[14px] text-ink-3 leading-relaxed">
            Books you&apos;ve read or removed<br />will appear here.
          </p>
        </div>
      )}

      {readBooks.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-mono text-[10px] tracking-[0.08em] text-gold uppercase">Read</h2>
            <div className="flex-1 h-px bg-wire" />
            <span className="font-mono text-[10px] text-ink-3">{readBooks.length}</span>
          </div>
          <div className="bg-surface border border-wire rounded-2xl overflow-hidden">
            {readBooks.map((book, i) => (
              <ArchiveItem key={book.id} book={book} onRestore={handleRestore} index={i} />
            ))}
          </div>
        </section>
      )}

      {removedBooks.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-mono text-[10px] tracking-[0.08em] text-ink-3 uppercase">Removed</h2>
            <div className="flex-1 h-px bg-wire" />
            <span className="font-mono text-[10px] text-ink-3">{removedBooks.length}</span>
          </div>
          <div className="bg-surface border border-wire rounded-2xl overflow-hidden">
            {removedBooks.map((book, i) => (
              <ArchiveItem key={book.id} book={book} onRestore={handleRestore} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
