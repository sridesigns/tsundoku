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
  const { books, isLoading, markAsRead, removeBook } = useBooks()
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

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="font-display text-3xl text-[var(--color-ink)]">Collection</h1>
        </div>
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6' : ''}>
          {Array.from({ length: 8 }).map((_, i) => (
            <BookCardSkeleton key={i} viewMode={viewMode} />
          ))}
        </div>
      </div>
    )
  }

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
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl text-[var(--color-ink)]">Collection</h1>
        <span className="font-mono text-xs text-[var(--color-ink-tertiary)]">
          {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}
        </span>
      </div>

      <FilterBar
        genres={genres}
        activeGenre={activeGenre}
        onGenreChange={setActiveGenre}
        sort={sort}
        onSortChange={setSort}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
        <div className="border-t border-[var(--color-border)]">
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

      {/* FAB */}
      <button
        onClick={() => setIsAddOpen(true)}
        className="fixed bottom-24 right-4 md:bottom-8 md:right-8 w-14 h-14 bg-[var(--color-accent)] text-white text-2xl font-sans shadow-lg hover:opacity-90 transition-opacity z-30 flex items-center justify-center"
        aria-label="Add book"
      >
        +
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
