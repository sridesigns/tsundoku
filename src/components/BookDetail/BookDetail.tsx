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
    setTimeout(onClose, 350)
  }

  if (!book) return null

  return (
    <>
      {/* Backdrop — heavy blur */}
      <div
        className="fixed inset-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: isVisible ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0)',
          backdropFilter: isVisible ? 'blur(8px)' : 'blur(0px)',
        }}
        onClick={handleClose}
      />

      {/* Drawer — slides from right on desktop, bottom on mobile */}
      <div
        className={`fixed z-50 overflow-y-auto overscroll-contain
          bottom-0 left-0 right-0 max-h-[92vh] rounded-t-2xl
          md:top-0 md:right-0 md:bottom-0 md:left-auto md:max-h-none md:w-[480px] md:rounded-none
          transition-all duration-500 drawer-timing glass-strong
          ${isVisible
            ? 'translate-y-0 md:translate-x-0'
            : 'translate-y-full md:translate-y-0 md:translate-x-full'
          }`}
        style={{
          boxShadow: isVisible ? '-20px 0 60px rgba(0,0,0,0.3)' : 'none',
        }}
      >
        {/* Mobile drag indicator */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[var(--color-border-strong)]" />
        </div>

        <div className="px-6 md:px-10 pt-6 md:pt-10 pb-10 safe-bottom">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="mb-8 p-2 -ml-2 rounded-xl text-[var(--color-ink-tertiary)] hover:text-[var(--color-ink)] hover:bg-[rgba(255,255,255,0.04)] transition-all duration-200"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M15 5L5 15M5 5l10 10" />
            </svg>
          </button>

          {/* Cover — with glow effect */}
          {book.cover_url && (
            <div className="relative w-full max-w-[220px] mx-auto mb-10">
              {/* Glow behind cover */}
              <div className="absolute inset-0 scale-110 blur-3xl opacity-20 rounded-2xl overflow-hidden">
                <Image
                  src={book.cover_url}
                  alt=""
                  fill
                  sizes="220px"
                  className="object-cover"
                />
              </div>
              <div className="aspect-[2/3] relative rounded-xl overflow-hidden shadow-[var(--shadow-lg)]">
                <Image
                  src={book.cover_url}
                  alt={`Cover of ${book.title} by ${book.author}`}
                  fill
                  sizes="220px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}

          {/* Title & Author */}
          <h2 className="font-display text-[26px] md:text-[32px] text-[var(--color-ink)] leading-[1.15] tracking-[-0.02em]">
            {book.title}
          </h2>
          <p className="font-sans text-[15px] text-[var(--color-ink-secondary)] mt-2 mb-6">
            {book.author}
          </p>

          {/* Meta tags — glass pills */}
          <div className="flex gap-2 flex-wrap mb-8">
            {book.genre && (
              <span className="font-mono text-[10px] tracking-[0.06em] uppercase px-3 py-1.5 rounded-full glass-accent text-[var(--color-accent)]">
                {book.genre}
              </span>
            )}
            {book.year && (
              <span className="font-mono text-[10px] tracking-[0.04em] px-3 py-1.5 rounded-full glass text-[var(--color-ink-secondary)]">
                {book.year}
              </span>
            )}
          </div>

          {/* Description */}
          {book.description && (
            <div className="mb-8">
              <p className="font-sans text-[13px] text-[var(--color-ink-secondary)] leading-[1.8]">
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
                className="flex-1 py-3.5 text-[13px] font-sans tracking-[0.01em] bg-[var(--color-accent)] text-[var(--color-bg)] rounded-xl hover:shadow-[var(--shadow-glow)] transition-all duration-300 btn-magnetic"
              >
                Mark as Read
              </button>
              <button
                onClick={() => onRemove(book.id)}
                className="px-5 py-3.5 text-[13px] font-sans tracking-[0.01em] border border-[var(--color-border)] rounded-xl text-[var(--color-ink-secondary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)] transition-all duration-300"
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
