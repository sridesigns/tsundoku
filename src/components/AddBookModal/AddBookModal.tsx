'use client'

import { useState, useEffect, useCallback } from 'react'
import type { SearchResult, CaptureMethod, Genre } from '@/src/types/book'
import { useSearch } from '@/src/hooks/useSearch'
import { useVoice } from '@/src/hooks/useVoice'
import { useCamera } from '@/src/hooks/useCamera'
import { useBookStore, createBookFromSearch } from '@/src/store/books'
import { useToast } from '@/src/components/Toast/Toast'
import { TypedSearch } from './TypedSearch'
import { VoiceCapture } from './VoiceCapture'
import { CameraCapture } from './CameraCapture'
import { SearchResults } from './SearchResults'

type CaptureTab = 'type' | 'voice' | 'camera'

interface AddBookModalProps {
  isOpen: boolean
  onClose: () => void
}

const tabs: { key: CaptureTab; label: string; icon: (active: boolean) => React.ReactNode }[] = [
  {
    key: 'type',
    label: 'Search',
    icon: (active) => (
      <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={active ? '2' : '1.5'} strokeLinecap="round">
        <circle cx="8" cy="8" r="5.5" />
        <path d="M15.5 15.5l-3-3" />
      </svg>
    ),
  },
  {
    key: 'voice',
    label: 'Voice',
    icon: (active) => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? '2' : '1.5'} strokeLinecap="round">
        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5" />
        <path d="M12 19v2" />
      </svg>
    ),
  },
  {
    key: 'camera',
    label: 'Camera',
    icon: (active) => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? '2' : '1.5'} strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
  },
]

export function AddBookModal({ isOpen, onClose }: AddBookModalProps) {
  const [tab, setTab] = useState<CaptureTab>('type')
  const [query, setQuery] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const { results, isSearching, error, search, clearResults } = useSearch()
  const voice = useVoice()
  const camera = useCamera()
  const addBook = useBookStore((s) => s.addBook)
  const updateBook = useBookStore((s) => s.updateBook)
  const { showToast } = useToast()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)))
    } else {
      document.body.style.overflow = ''
      setIsVisible(false)
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (voice.transcript && !voice.isListening) {
      setQuery(voice.transcript)
      search(voice.transcript)
      setTab('type')
    }
  }, [voice.transcript, voice.isListening, search])

  useEffect(() => {
    if (camera.extractedText) {
      setQuery(camera.extractedText)
      search(camera.extractedText)
      setTab('type')
    }
  }, [camera.extractedText, search])

  const handleSearch = useCallback((value: string) => {
    setQuery(value)
    search(value)
  }, [search])

  const handleSelect = async (result: SearchResult) => {
    setIsAdding(true)
    const captureMethod: CaptureMethod = tab === 'camera' ? 'photo' : tab === 'voice' ? 'voice' : 'typed'
    const bookData = createBookFromSearch(result, captureMethod)
    const book = await addBook(bookData)
    showToast(`Added "${result.title}"`)
    categorizeBook(book.id, result)
    setIsAdding(false)
    handleClose()
  }

  const categorizeBook = async (bookId: string, result: SearchResult) => {
    try {
      const res = await fetch('/api/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: result.title, author: result.author, description: result.description }),
      })
      if (res.ok) {
        const data: { genre: Genre } = await res.json()
        await updateBook(bookId, { genre: data.genre })
      }
    } catch (err) {
      console.warn('Genre categorization failed:', err)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
      setQuery('')
      clearResults()
      voice.resetTranscript()
      camera.reset()
      document.body.style.overflow = ''
    }, 320)
  }

  if (!isOpen) return null

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

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center pointer-events-none">
        <div
          onClick={(e) => e.stopPropagation()}
          className={`pointer-events-auto relative w-full md:w-[540px] max-h-[92vh] md:max-h-[84vh] bg-snow rounded-t-3xl md:rounded-3xl overflow-y-auto overscroll-contain safe-bottom border border-edge transition-all duration-300 drawer-timing
            ${isVisible
              ? 'translate-y-0 md:scale-100 opacity-100'
              : 'translate-y-full md:translate-y-4 md:scale-[0.97] opacity-0'
            }`}
          style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)' }}
        >
          {/* Mobile drag handle */}
          <div className="md:hidden flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-edge" />
          </div>

          <div className="px-6 md:px-8 pt-5 md:pt-7 pb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-[24px] text-ink tracking-tight">Add a book</h2>
              <button
                onClick={handleClose}
                className="p-2 rounded-xl text-faint hover:text-ink hover:bg-fog transition-colors duration-200"
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M15 5L5 15M5 5l10 10" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 p-1 rounded-2xl bg-fog border border-edge">
              {tabs.map((t) => {
                const active = tab === t.key
                return (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[12px] font-sans rounded-xl transition-all duration-200 ${
                      active
                        ? 'bg-snow text-pop font-medium shadow-sm'
                        : 'text-faint hover:text-muted'
                    }`}
                  >
                    {t.icon(active)}
                    {t.label}
                  </button>
                )
              })}
            </div>

            {tab === 'type'   && <TypedSearch query={query} onQueryChange={handleSearch} isSearching={isSearching} />}
            {tab === 'voice'  && (
              <VoiceCapture
                isListening={voice.isListening} isSupported={voice.isSupported}
                transcript={voice.transcript} interimTranscript={voice.interimTranscript}
                error={voice.error} onStart={voice.startListening} onStop={voice.stopListening}
              />
            )}
            {tab === 'camera' && (
              <CameraCapture isProcessing={camera.isProcessing} error={camera.error} onCapture={camera.processImage} />
            )}

            {error && (
              <p className="font-sans text-[12px] text-heat mt-4 text-center">{error}</p>
            )}

            <SearchResults results={results} isSearching={isSearching} isAdding={isAdding} onSelect={handleSelect} />
          </div>
        </div>
      </div>
    </>
  )
}
