'use client'

import { create } from 'zustand'
import type { Book, BookStatus, Genre, CaptureMethod } from '@/src/types/book'
import { StorageManager } from '@/src/lib/storage/StorageManager'

interface BooksState {
  books: Book[]
  isLoading: boolean
  hydrate: () => Promise<void>
  addBook: (book: Omit<Book, 'id' | 'date_added' | 'date_updated'>) => Promise<Book>
  updateBook: (id: string, patch: Partial<Book>) => Promise<void>
  removeBook: (id: string) => Promise<void>
  markAsRead: (id: string) => Promise<void>
  restoreBook: (id: string) => Promise<void>
  clearAll: () => Promise<void>
  importBooks: (books: Book[]) => Promise<void>
}

export const useBookStore = create<BooksState>((set, get) => ({
  books: [],
  isLoading: true,

  hydrate: async () => {
    try {
      const adapter = StorageManager.getAdapter()
      const books = await adapter.getAll()
      set({ books, isLoading: false })
    } catch (err) {
      console.error('Failed to hydrate books:', err)
      set({ isLoading: false })
    }
  },

  addBook: async (bookData) => {
    const now = Date.now()
    const book: Book = {
      ...bookData,
      id: crypto.randomUUID(),
      date_added: now,
      date_updated: now,
    }
    const adapter = StorageManager.getAdapter()
    await adapter.save(book)
    set((state) => ({ books: [...state.books, book] }))
    return book
  },

  updateBook: async (id, patch) => {
    const adapter = StorageManager.getAdapter()
    await adapter.update(id, patch)
    set((state) => ({
      books: state.books.map((b) =>
        b.id === id ? { ...b, ...patch, date_updated: Date.now() } : b
      ),
    }))
  },

  removeBook: async (id) => {
    const adapter = StorageManager.getAdapter()
    await adapter.update(id, { status: 'removed' as BookStatus, date_updated: Date.now() })
    set((state) => ({
      books: state.books.map((b) =>
        b.id === id ? { ...b, status: 'removed' as BookStatus, date_updated: Date.now() } : b
      ),
    }))
  },

  markAsRead: async (id) => {
    const adapter = StorageManager.getAdapter()
    await adapter.update(id, { status: 'read' as BookStatus, date_updated: Date.now() })
    set((state) => ({
      books: state.books.map((b) =>
        b.id === id ? { ...b, status: 'read' as BookStatus, date_updated: Date.now() } : b
      ),
    }))
  },

  restoreBook: async (id) => {
    const adapter = StorageManager.getAdapter()
    await adapter.update(id, { status: 'to_read' as BookStatus, date_updated: Date.now() })
    set((state) => ({
      books: state.books.map((b) =>
        b.id === id ? { ...b, status: 'to_read' as BookStatus, date_updated: Date.now() } : b
      ),
    }))
  },

  clearAll: async () => {
    const adapter = StorageManager.getAdapter()
    await adapter.clear()
    set({ books: [] })
  },

  importBooks: async (books) => {
    const adapter = StorageManager.getAdapter()
    for (const book of books) {
      await adapter.save(book)
    }
    set({ books })
  },
}))

export function createBookFromSearch(
  result: { open_library_key: string; title: string; author: string; year: number | null; cover_id: number | null; description: string | null },
  captureMethod: CaptureMethod,
  genre: Genre | null = null
): Omit<Book, 'id' | 'date_added' | 'date_updated'> {
  return {
    title: result.title,
    author: result.author,
    cover_url: result.cover_id
      ? `https://covers.openlibrary.org/b/id/${result.cover_id}-L.jpg`
      : null,
    cover_cache: null,
    year: result.year,
    description: result.description ? result.description.slice(0, 500) : null,
    genre,
    status: 'to_read',
    capture_method: captureMethod,
    open_library_key: result.open_library_key,
    notes: null,
  }
}
