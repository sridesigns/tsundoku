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
        className="fixed inset-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: isVisible ? 'rgba(26, 26, 46, 0.3)' : 'rgba(26, 26, 46, 0)',
          backdropFilter: isVisible ? 'blur(8px)' : 'blur(0)',
          WebkitBackdropFilter: isVisible ? 'blur(8px)' : 'blur(0)',
        }}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={`fixed z-50 bg-snow overflow-y-auto overscroll-contain
          bottom-0 left-0 right-0 max-h-[92vh] rounded-t-3xl
          md:top-0 md:right-0 md:bottom-0 md:left-auto md:max-h-none md:w-[480px] md:rounded-none md:border-l md:border-edge
          transition-transform duration-300 drawer-timing
          ${isVisible
            ? 'translate-y-0 md:translate-x-0'
            : 'translate-y-full md:translate-y-0 md:translate-x-full'
          }`}
        style={{ boxShadow: '-8px 0 40px rgba(0, 0, 0, 0.08)' }}
      >
        {/* Mobile drag handle */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-edge" />
        </div>

        <div className="px-6 md:px-9 pt-5 md:pt-8 pb-10 safe-bottom">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="mb-6 p-2 -ml-2 rounded-xl text-faint hover:text-ink hover:bg-fog transition-colors duration-200"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M15 5L5 15M5 5l10 10" />
            </svg>
          </button>

          {/* Cover */}
          {book.cover_url && (
            <div className="relative w-full max-w-[200px] mx-auto mb-8">
              <div className="aspect-[2/3] relative rounded-2xl overflow-hidden cover-shadow">
                <Image src={book.cover_url} alt={book.title} fill sizes="200px" className="object-cover" priority />
              </div>
            </div>
          )}

          <h2 className="font-serif text-[26px] md:text-[30px] text-ink leading-tight tracking-tight">{book.title}</h2>
          <p className="font-sans text-[15px] text-muted mt-2 mb-5">{book.author}</p>

          {/* Meta pills */}
          <div className="flex gap-2 flex-wrap mb-6">
            {book.genre && (
              <span className="font-mono text-[10px] tracking-wide uppercase px-3 py-1.5 rounded-full bg-pop/8 text-pop border border-pop/15">
                {book.genre}
              </span>
            )}
            {book.year && (
              <span className="font-mono text-[10px] tracking-wide px-3 py-1.5 rounded-full bg-fog text-muted border border-edge">
                {book.year}
              </span>
            )}
          </div>

          {/* Description */}
          {book.description && (
            <p className="font-sans text-[13px] text-muted leading-relaxed mb-6">{book.description}</p>
          )}

          {/* Date */}
          <p className="font-mono text-[10px] tracking-wide text-faint uppercase mb-8">
            Added {new Date(book.date_added).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>

          {/* Actions */}
          {book.status === 'to_read' && (
            <div className="flex gap-3">
              <button onClick={() => onMarkAsRead(book.id)} className="flex-1 py-3.5 text-[13px] font-sans font-medium btn-pop">
                Mark as Read
              </button>
              <button onClick={() => onRemove(book.id)} className="px-5 py-3.5 text-[13px] font-sans btn-ghost">
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
