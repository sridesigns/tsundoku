'use client'

import { useMemo } from 'react'
import { useBooks } from '@/src/hooks/useBooks'
import { useToast } from '@/src/components/Toast/Toast'
import type { Book } from '@/src/types/book'
import Image from 'next/image'

function ArchiveItem({ book, onRestore, index }: { book: Book; onRestore: (id: string) => void; index: number }) {
  return (
    <div
      className="flex items-center gap-4 px-5 py-4 border-b border-edge last:border-b-0 animate-fadeInUp group"
      style={{ animationDelay: `${Math.min(index * 50, 280)}ms` }}
    >
      <div className="w-12 h-[66px] shrink-0 overflow-hidden relative rounded-lg bg-fog border border-edge">
        {book.cover_url ? (
          <Image src={book.cover_url} alt="" fill sizes="48px" className="object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-serif text-[8px] text-muted text-center leading-tight px-0.5">{book.title.slice(0, 18)}</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-sans text-[14px] text-ink font-medium truncate">{book.title}</p>
        <p className="font-sans text-[12px] text-muted truncate mt-0.5">{book.author}</p>
      </div>

      <button
        onClick={() => onRestore(book.id)}
        className="shrink-0 btn-soft px-4 py-2 text-[11px] font-mono tracking-wide uppercase"
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
      <header className="mb-8">
        <h1 className="font-serif text-[32px] md:text-[42px] text-ink tracking-tight">Archive</h1>
        <div className="w-12 h-[3px] rounded-full mt-3" style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }} />
      </header>

      {readBooks.length === 0 && removedBooks.length === 0 && (
        <div className="py-20 text-center">
          <p className="font-sans text-[14px] text-faint leading-relaxed">
            Books you&apos;ve read or removed<br />will appear here.
          </p>
        </div>
      )}

      {readBooks.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-mono text-[10px] tracking-widest text-pop uppercase font-medium">Read</h2>
            <div className="flex-1 h-px bg-edge" />
            <span className="font-mono text-[10px] text-faint">{readBooks.length}</span>
          </div>
          <div className="card overflow-hidden">
            {readBooks.map((book, i) => (
              <ArchiveItem key={book.id} book={book} onRestore={handleRestore} index={i} />
            ))}
          </div>
        </section>
      )}

      {removedBooks.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-mono text-[10px] tracking-widest text-faint uppercase">Removed</h2>
            <div className="flex-1 h-px bg-edge" />
            <span className="font-mono text-[10px] text-faint">{removedBooks.length}</span>
          </div>
          <div className="card overflow-hidden">
            {removedBooks.map((book, i) => (
              <ArchiveItem key={book.id} book={book} onRestore={handleRestore} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
