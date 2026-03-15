'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import type { Book } from '@/src/types/book'

interface BookDetailProps {
  book: Book | null
  onClose: () => void
  onMarkAsRead: (id: string) => void
  onRemove: (id: string) => void
}

export function BookDetail({ book, onClose, onMarkAsRead, onRemove }: BookDetailProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (book) {
      requestAnimationFrame(() => setIsVisible(true))
    } else {
      setIsVisible(false)
    }
  }, [book])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 220)
  }

  if (!book) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-50 transition-opacity duration-220"
        style={{ opacity: isVisible ? 1 : 0 }}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={`fixed z-50 bg-[var(--color-surface)] overflow-y-auto
          bottom-0 left-0 right-0 max-h-[85vh]
          md:top-0 md:right-0 md:bottom-0 md:left-auto md:max-h-none md:w-[420px]
          transition-transform duration-220
          ${isVisible ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full'}`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)' }}
      >
        <div className="p-6">
          <button
            onClick={handleClose}
            className="mb-6 text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)] transition-colors font-sans text-sm"
          >
            Close
          </button>

          {book.cover_url && (
            <div className="aspect-[2/3] w-full max-w-[240px] mx-auto relative mb-6 bg-[var(--color-surface-raised)]">
              <Image
                src={book.cover_url}
                alt={book.title}
                fill
                sizes="240px"
                className="object-cover"
              />
            </div>
          )}

          <h2 className="font-display text-2xl text-[var(--color-ink)] mb-1">{book.title}</h2>
          <p className="font-sans text-sm text-[var(--color-ink-secondary)] mb-4">{book.author}</p>

          <div className="flex gap-3 flex-wrap mb-6">
            {book.genre && (
              <span className="font-mono text-xs px-2 py-1 border border-[var(--color-border)] text-[var(--color-ink-secondary)]">
                {book.genre}
              </span>
            )}
            {book.year && (
              <span className="font-mono text-xs px-2 py-1 border border-[var(--color-border)] text-[var(--color-ink-secondary)]">
                {book.year}
              </span>
            )}
            <span className="font-mono text-xs px-2 py-1 border border-[var(--color-border)] text-[var(--color-ink-tertiary)]">
              {book.capture_method}
            </span>
          </div>

          {book.description && (
            <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed mb-6">
              {book.description}
            </p>
          )}

          <p className="font-mono text-xs text-[var(--color-ink-tertiary)] mb-8">
            Added {new Date(book.date_added).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>

          {book.status === 'to_read' && (
            <div className="flex gap-3">
              <button
                onClick={() => onMarkAsRead(book.id)}
                className="flex-1 py-3 text-sm font-sans bg-[var(--color-ink)] text-[var(--color-bg)] hover:opacity-90 transition-opacity"
              >
                Mark as Read
              </button>
              <button
                onClick={() => onRemove(book.id)}
                className="px-4 py-3 text-sm font-sans border border-[var(--color-border)] text-[var(--color-ink-secondary)] hover:border-[var(--color-border-strong)] transition-colors"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
