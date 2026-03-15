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
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true))
      })
    } else {
      document.body.style.overflow = ''
      setIsVisible(false)
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [book])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 280)
  }

  if (!book) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/25 z-50 transition-opacity duration-300"
        style={{ opacity: isVisible ? 1 : 0 }}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={`fixed z-50 bg-[var(--color-surface)] overflow-y-auto overscroll-contain
          bottom-0 left-0 right-0 max-h-[90vh] rounded-t-2xl shadow-[0_-4px_40px_rgba(0,0,0,0.08)]
          md:top-0 md:right-0 md:bottom-0 md:left-auto md:max-h-none md:w-[440px] md:rounded-none md:shadow-[_-8px_0_40px_rgba(0,0,0,0.06)]
          transition-transform duration-300 drawer-timing
          ${isVisible
            ? 'translate-y-0 md:translate-x-0'
            : 'translate-y-full md:translate-y-0 md:translate-x-full'
          }`}
      >
        {/* Mobile drag indicator */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-8 h-1 rounded-full bg-[var(--color-border-strong)]" />
        </div>

        <div className="px-6 md:px-8 pt-4 md:pt-8 pb-8 safe-bottom">
          {/* Close */}
          <button
            onClick={handleClose}
            className="mb-8 p-1 -ml-1 text-[var(--color-ink-tertiary)] hover:text-[var(--color-ink)] transition-colors duration-200"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M15 5L5 15M5 5l10 10" />
            </svg>
          </button>

          {/* Cover */}
          {book.cover_url && (
            <div className="aspect-[2/3] w-full max-w-[200px] mx-auto relative mb-8 rounded-lg overflow-hidden shadow-[var(--shadow-lg)]">
              <Image
                src={book.cover_url}
                alt={`Cover of ${book.title} by ${book.author}`}
                fill
                sizes="200px"
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Title & Author */}
          <h2 className="font-display text-[24px] md:text-[28px] text-[var(--color-ink)] leading-[1.2] tracking-[-0.01em]">
            {book.title}
          </h2>
          <p className="font-sans text-[15px] text-[var(--color-ink-secondary)] mt-1.5 mb-6">
            {book.author}
          </p>

          {/* Meta tags */}
          <div className="flex gap-2 flex-wrap mb-8">
            {book.genre && (
              <span className="font-mono text-[10px] tracking-[0.06em] uppercase px-2.5 py-1.5 rounded-md bg-[var(--color-accent-light)] text-[var(--color-accent)]">
                {book.genre}
              </span>
            )}
            {book.year && (
              <span className="font-mono text-[10px] tracking-[0.04em] px-2.5 py-1.5 rounded-md bg-[var(--color-surface-raised)] text-[var(--color-ink-secondary)]">
                {book.year}
              </span>
            )}
          </div>

          {/* Description */}
          {book.description && (
            <div className="mb-8">
              <p className="font-sans text-[13px] text-[var(--color-ink-secondary)] leading-[1.7]">
                {book.description}
              </p>
            </div>
          )}

          {/* Date */}
          <p className="font-mono text-[10px] tracking-[0.04em] text-[var(--color-ink-tertiary)] uppercase mb-10">
            Added {new Date(book.date_added).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>

          {/* Actions */}
          {book.status === 'to_read' && (
            <div className="flex gap-3">
              <button
                onClick={() => onMarkAsRead(book.id)}
                className="flex-1 py-3.5 text-[13px] font-sans tracking-[0.01em] bg-[var(--color-ink)] text-[var(--color-bg)] rounded-lg hover:opacity-90 transition-all duration-200"
              >
                Mark as Read
              </button>
              <button
                onClick={() => onRemove(book.id)}
                className="px-5 py-3.5 text-[13px] font-sans tracking-[0.01em] border border-[var(--color-border)] rounded-lg text-[var(--color-ink-secondary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)] transition-all duration-200"
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
