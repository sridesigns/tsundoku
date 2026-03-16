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
      requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)))
    } else {
      document.body.style.overflow = ''
      setIsVisible(false)
    }
    return () => { document.body.style.overflow = '' }
  }, [book])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 320)
  }

  if (!book) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 transition-all duration-400"
        style={{
          backgroundColor: isVisible ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0)',
          backdropFilter: isVisible ? 'blur(6px)' : 'blur(0px)',
        }}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={`fixed z-50 bg-surface border-l border-wire overflow-y-auto overscroll-contain
          bottom-0 left-0 right-0 max-h-[92vh] rounded-t-2xl border-l-0 border-t border-wire
          md:top-0 md:right-0 md:bottom-0 md:left-auto md:max-h-none md:w-[460px] md:rounded-none
          transition-transform duration-350 drawer-timing
          ${isVisible
            ? 'translate-y-0 md:translate-x-0'
            : 'translate-y-full md:translate-y-0 md:translate-x-full'
          }`}
        style={{ boxShadow: '-12px 0 48px rgba(0,0,0,0.4)' }}
      >
        {/* Mobile drag handle */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-wire-2" />
        </div>

        <div className="px-6 md:px-9 pt-6 md:pt-8 pb-10 safe-bottom">
          {/* Close */}
          <button
            onClick={handleClose}
            className="mb-8 p-2 -ml-2 rounded-xl text-ink-3 hover:text-ink hover:bg-raised transition-colors duration-200"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M15 5L5 15M5 5l10 10" />
            </svg>
          </button>

          {/* Cover with soft glow */}
          {book.cover_url && (
            <div className="relative w-full max-w-[200px] mx-auto mb-9">
              {/* Blurred glow layer */}
              <div className="absolute inset-[-20%] blur-3xl opacity-15 rounded-full overflow-hidden pointer-events-none">
                <Image src={book.cover_url} alt="" fill sizes="200px" className="object-cover" />
              </div>
              <div className="aspect-[2/3] relative rounded-xl overflow-hidden"
                   style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
                <Image
                  src={book.cover_url}
                  alt={`${book.title}`}
                  fill sizes="200px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}

          <h2 className="font-display text-[26px] md:text-[30px] text-ink leading-[1.15] tracking-[-0.02em]">
            {book.title}
          </h2>
          <p className="font-sans text-[15px] text-ink-2 mt-2 mb-6">{book.author}</p>

          {/* Meta pills */}
          <div className="flex gap-2 flex-wrap mb-7">
            {book.genre && (
              <span className="font-mono text-[10px] tracking-[0.06em] uppercase px-3 py-1.5 rounded-full bg-gold/10 text-gold border border-gold/20">
                {book.genre}
              </span>
            )}
            {book.year && (
              <span className="font-mono text-[10px] tracking-[0.04em] px-3 py-1.5 rounded-full bg-raised text-ink-2 border border-wire">
                {book.year}
              </span>
            )}
          </div>

          {/* Description */}
          {book.description && (
            <p className="font-sans text-[13px] text-ink-2 leading-[1.8] mb-7">
              {book.description}
            </p>
          )}

          {/* Date */}
          <p className="font-mono text-[10px] tracking-[0.04em] text-ink-3 uppercase mb-9">
            Added {new Date(book.date_added).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>

          {/* Actions */}
          {book.status === 'to_read' && (
            <div className="flex gap-3">
              <button
                onClick={() => onMarkAsRead(book.id)}
                className="flex-1 py-3.5 text-[13px] font-sans tracking-[0.01em] bg-gold text-bg rounded-xl btn-press gold-glow"
              >
                Mark as Read
              </button>
              <button
                onClick={() => onRemove(book.id)}
                className="px-5 py-3.5 text-[13px] font-sans border border-wire rounded-xl text-ink-2 hover:border-wire-2 hover:text-ink transition-colors duration-200"
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
