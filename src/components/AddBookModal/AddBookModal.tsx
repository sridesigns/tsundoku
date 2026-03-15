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
      requestAnimationFrame(() => setIsVisible(true))
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (voice.transcript && !voice.isListening) {
      setQuery(voice.transcript)
      search(voice.transcript)
    }
  }, [voice.transcript, voice.isListening, search])

  useEffect(() => {
    if (camera.extractedText) {
      setQuery(camera.extractedText)
      search(camera.extractedText)
      setTab('type')
    }
  }, [camera.extractedText, search])

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value)
      search(value)
    },
    [search]
  )

  const handleSelect = async (result: SearchResult) => {
    setIsAdding(true)
    const captureMethod: CaptureMethod =
      tab === 'camera' ? 'photo' : tab === 'voice' ? 'voice' : 'typed'
    const bookData = createBookFromSearch(result, captureMethod)
    const book = await addBook(bookData)
    showToast(`Added "${result.title}"`)

    // Categorize non-blocking
    categorizeBook(book.id, result)

    setIsAdding(false)
    handleClose()
  }

  const categorizeBook = async (
    bookId: string,
    result: SearchResult
  ) => {
    try {
      const res = await fetch('/api/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: result.title,
          author: result.author,
          description: result.description,
        }),
      })
      if (res.ok) {
        const data: { genre: Genre } = await res.json()
        await updateBook(bookId, { genre: data.genre })
      }
    } catch {
      // Non-critical — genre stays null
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
    }, 220)
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-50 transition-opacity duration-220"
        style={{ opacity: isVisible ? 1 : 0 }}
        onClick={handleClose}
      />
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-surface)] max-h-[85vh] overflow-y-auto transition-transform duration-220"
        style={{
          transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)',
          transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl text-[var(--color-ink)]">Add a book</h2>
            <button
              onClick={handleClose}
              className="text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)] font-sans text-sm transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[var(--color-border)] mb-6">
            {(['type', 'voice', 'camera'] as CaptureTab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 pb-3 text-sm font-sans capitalize transition-colors border-b-2 ${
                  tab === t
                    ? 'border-[var(--color-ink)] text-[var(--color-ink)]'
                    : 'border-transparent text-[var(--color-ink-tertiary)] hover:text-[var(--color-ink-secondary)]'
                }`}
              >
                {t === 'type' ? 'Type' : t === 'voice' ? 'Voice' : 'Camera'}
              </button>
            ))}
          </div>

          {/* Capture area */}
          {tab === 'type' && (
            <TypedSearch
              query={query}
              onQueryChange={handleSearch}
              isSearching={isSearching}
            />
          )}
          {tab === 'voice' && (
            <VoiceCapture
              isListening={voice.isListening}
              isSupported={voice.isSupported}
              transcript={voice.transcript}
              onStart={voice.startListening}
              onStop={voice.stopListening}
            />
          )}
          {tab === 'camera' && (
            <CameraCapture
              isProcessing={camera.isProcessing}
              error={camera.error}
              onCapture={camera.processImage}
            />
          )}

          {/* Results */}
          {error && (
            <p className="font-sans text-sm text-[var(--color-accent)] mt-4">{error}</p>
          )}
          <SearchResults
            results={results}
            isSearching={isSearching}
            isAdding={isAdding}
            onSelect={handleSelect}
          />
        </div>
      </div>
    </>
  )
}
