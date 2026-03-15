'use client'

import { useState, useEffect, useCallback } from 'react'
import { useBookStore } from '@/src/store/books'
import { useToast } from '@/src/components/Toast/Toast'

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('')
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const { books, clearAll, importBooks } = useBookStore()
  const { showToast } = useToast()

  useEffect(() => {
    const saved = localStorage.getItem('tsundoku_anthropic_key') ?? ''
    setApiKey(saved)
  }, [])

  const handleSaveKey = useCallback(() => {
    localStorage.setItem('tsundoku_anthropic_key', apiKey)
    showToast('API key saved')
  }, [apiKey, showToast])

  const handleExport = useCallback(() => {
    const date = new Date().toISOString().split('T')[0]
    const data = JSON.stringify(books, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tsundoku-export-${date}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Data exported')
  }, [books, showToast])

  const handleImport = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      try {
        const text = await file.text()
        const data = JSON.parse(text)
        if (!Array.isArray(data)) throw new Error('Invalid format')
        await importBooks(data)
        showToast(`Imported ${data.length} books`)
      } catch {
        showToast('Import failed — invalid file')
      }
    }
    input.click()
  }, [importBooks, showToast])

  const handleClear = async () => {
    await clearAll()
    setShowClearConfirm(false)
    showToast('All data cleared')
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-[var(--color-ink)] mb-8">Settings</h1>

      {/* API Key */}
      <section className="mb-10">
        <h2 className="font-sans text-sm font-medium text-[var(--color-ink)] mb-3">
          Anthropic API Key
        </h2>
        <p className="font-sans text-xs text-[var(--color-ink-tertiary)] mb-3">
          Used for AI genre categorization. Stored locally, never sent to our servers.
        </p>
        <div className="flex gap-2">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-ant-..."
            className="flex-1 px-3 py-2 text-sm font-mono bg-[var(--color-surface)] text-[var(--color-ink)] border border-[var(--color-border)] outline-none focus:border-[var(--color-border-strong)]"
          />
          <button
            onClick={handleSaveKey}
            className="px-4 py-2 text-sm font-sans bg-[var(--color-ink)] text-[var(--color-bg)] hover:opacity-90 transition-opacity"
          >
            Save
          </button>
        </div>
      </section>

      {/* Storage Adapter */}
      <section className="mb-10">
        <h2 className="font-sans text-sm font-medium text-[var(--color-ink)] mb-3">
          Storage
        </h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between px-3 py-2 border border-[var(--color-border)]">
            <span className="font-sans text-sm">IndexedDB</span>
            <span className="font-mono text-xs text-[var(--color-accent)]">Active</span>
          </div>
          <div className="flex items-center justify-between px-3 py-2 border border-[var(--color-border)] opacity-50">
            <span className="font-sans text-sm">Notion</span>
            <span className="font-mono text-xs text-[var(--color-ink-tertiary)]">Coming soon</span>
          </div>
          <div className="flex items-center justify-between px-3 py-2 border border-[var(--color-border)] opacity-50">
            <span className="font-sans text-sm">Google Drive</span>
            <span className="font-mono text-xs text-[var(--color-ink-tertiary)]">Coming soon</span>
          </div>
        </div>
      </section>

      {/* Data Management */}
      <section className="mb-10">
        <h2 className="font-sans text-sm font-medium text-[var(--color-ink)] mb-3">
          Data
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExport}
            className="px-4 py-2 text-sm font-sans border border-[var(--color-border)] text-[var(--color-ink-secondary)] hover:border-[var(--color-border-strong)] transition-colors"
          >
            Export JSON
          </button>
          <button
            onClick={handleImport}
            className="px-4 py-2 text-sm font-sans border border-[var(--color-border)] text-[var(--color-ink-secondary)] hover:border-[var(--color-border-strong)] transition-colors"
          >
            Import JSON
          </button>
          {!showClearConfirm ? (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-4 py-2 text-sm font-sans border border-[var(--color-border)] text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors"
            >
              Clear All Data
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleClear}
                className="px-4 py-2 text-sm font-sans bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity"
              >
                Confirm Clear
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-sm font-sans border border-[var(--color-border)] text-[var(--color-ink-secondary)]"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </section>

      <footer className="font-mono text-xs text-[var(--color-ink-tertiary)]">
        Tsundoku v0.1.0 &middot; {books.length} books stored
      </footer>
    </div>
  )
}
