'use client'

import { useState, useMemo } from 'react'
import type { Book, Genre } from '@/src/types/book'
import { useBooks } from '@/src/hooks/useBooks'
import { useToast } from '@/src/components/Toast/Toast'
import { EmptyState } from '@/src/components/EmptyState/EmptyState'
import { FilterBar } from '@/src/components/FilterBar/FilterBar'
import { BookCard, BookCardSkeleton } from '@/src/components/BookCard/BookCard'
import { BookDetail } from '@/src/components/BookDetail/BookDetail'
import { AddBookModal } from '@/src/components/AddBookModal/AddBookModal'

type SortOption = 'date_added' | 'title' | 'author'
type ViewMode = 'grid' | 'list'

export default function CollectionPage() {
  const { books, isLoading, hydrationError, markAsRead, removeBook } = useBooks()
  const { showToast } = useToast()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [activeGenre, setActiveGenre] = useState<Genre | null>(null)
  const [sort, setSort] = useState<SortOption>('date_added')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  const activeBooks = useMemo(
    () => books.filter((b) => b.status === 'to_read'),
    [books]
  )

  const genres = useMemo(() => {
    const genreSet = new Set<Genre>()
    activeBooks.forEach((b) => {
      if (b.genre) genreSet.add(b.genre)
    })
    return Array.from(genreSet).sort()
  }, [activeBooks])

  const filteredBooks = useMemo(() => {
    let result = activeBooks
    if (activeGenre) {
      result = result.filter((b) => b.genre === activeGenre)
    }
    switch (sort) {
      case 'title':
        return [...result].sort((a, b) => a.title.localeCompare(b.title))
      case 'author':
        return [...result].sort((a, b) => a.author.localeCompare(b.author))
      default:
        return [...result].sort((a, b) => b.date_added - a.date_added)
    }
  }, [activeBooks, activeGenre, sort])

  const handleMarkAsRead = async (id: string) => {
    const book = books.find((b) => b.id === id)
    await markAsRead(id)
    setSelectedBook(null)
    showToast(`Marked "${book?.title}" as read`)
  }

  const handleRemove = async (id: string) => {
    const book = books.find((b) => b.id === id)
    await removeBook(id)
    setSelectedBook(null)
    showToast(`Removed "${book?.title}"`)
  }

  // Loading state
  if (isLoading) {
    return (
      <div>
        <header className="mb-10">
          <h1 className="font-display text-[32px] md:text-[42px] text-[var(--color-ink)] tracking-[-0.02em]">
            Collection
          </h1>
          <div className="w-12 h-[2px] bg-[var(--color-accent)] mt-3 opacity-60" />
        </header>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
          {Array.from({ length: 8 }).map((_, i) => (
            <BookCardSkeleton key={i} viewMode="grid" />
          ))}
        </div>
      </div>
    )
  }

  // Hydration error state
  if (hydrationError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="font-sans text-[14px] text-[var(--color-accent)] mb-4">{hydrationError}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 text-[13px] font-sans border border-[var(--color-border)] rounded-xl text-[var(--color-ink-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-ink)] transition-all duration-300"
        >
          Refresh page
        </button>
      </div>
    )
  }

  // Empty state
  if (activeBooks.length === 0) {
    return (
      <>
        <EmptyState onAdd={() => setIsAddOpen(true)} />
        <AddBookModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      </>
    )
  }

  return (
    <>
      {/* Header */}
      <header className="mb-8 md:mb-10">
        <h1 className="font-display text-[32px] md:text-[42px] text-[var(--color-ink)] tracking-[-0.02em]">
          Collection
        </h1>
        <div className="w-12 h-[2px] bg-[var(--color-accent)] mt-3 opacity-60" />
      </header>

      {/* Filters */}
      <FilterBar
        genres={genres}
        activeGenre={activeGenre}
        onGenreChange={setActiveGenre}
        sort={sort}
        onSortChange={setSort}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        count={filteredBooks.length}
      />

      {/* Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8 md:gap-x-7 md:gap-y-10">
          {filteredBooks.map((book, i) => (
            <BookCard
              key={book.id}
              book={book}
              index={i}
              viewMode="grid"
              onClick={setSelectedBook}
            />
          ))}
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          {filteredBooks.map((book, i) => (
            <BookCard
              key={book.id}
              book={book}
              index={i}
              viewMode="list"
              onClick={setSelectedBook}
            />
          ))}
        </div>
      )}

      {/* FAB — glowing accent button */}
      <button
        onClick={() => setIsAddOpen(true)}
        className="fixed bottom-[96px] right-5 md:bottom-10 md:right-10 w-14 h-14 rounded-2xl bg-[var(--color-accent)] text-[var(--color-bg)] z-30 flex items-center justify-center btn-magnetic shadow-[0_4px_24px_rgba(232,168,56,0.3)] hover:shadow-[0_8px_40px_rgba(232,168,56,0.4)]"
        aria-label="Add book"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M11 3v16M3 11h16" />
        </svg>
      </button>

      <AddBookModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <BookDetail
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        onMarkAsRead={handleMarkAsRead}
        onRemove={handleRemove}
      />
    </>
  )
}
