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
        const valid = data.filter(
          (b: Record<string, unknown>) =>
            typeof b.id === 'string' &&
            typeof b.title === 'string' &&
            typeof b.author === 'string' &&
            typeof b.status === 'string' &&
            typeof b.date_added === 'number'
        )
        if (valid.length === 0) throw new Error('No valid books found')
        await importBooks(valid)
        const skipped = data.length - valid.length
        showToast(`Imported ${valid.length} books${skipped > 0 ? ` (${skipped} skipped)` : ''}`)
      } catch {
        showToast('Import failed — invalid file format')
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
      <header className="mb-8 md:mb-10">
        <h1 className="font-display text-[32px] md:text-[42px] text-[var(--color-ink)] tracking-[-0.02em]">
          Settings
        </h1>
        <div className="w-12 h-[2px] bg-[var(--color-accent)] mt-3 opacity-60" />
      </header>

      {/* API Key */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="font-mono text-[10px] tracking-[0.08em] text-[var(--color-accent)] uppercase">
            AI Categorization
          </h2>
          <div className="flex-1 h-px bg-[var(--color-border)]" />
        </div>
        <p className="font-sans text-[13px] text-[var(--color-ink-secondary)] leading-relaxed mb-4 max-w-md">
          Add your Anthropic API key to enable automatic genre categorization.
          Stored locally in your browser — never sent to our servers.
        </p>
        <div className="flex gap-2 max-w-md">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-ant-..."
            className="flex-1 px-4 py-3 text-[13px] font-mono bg-[var(--color-surface)] text-[var(--color-ink)] border border-[var(--color-border)] rounded-xl outline-none input-glow transition-all duration-300"
          />
          <button
            onClick={handleSaveKey}
            className="px-5 py-3 text-[13px] font-sans tracking-[0.01em] bg-[var(--color-accent)] text-[var(--color-bg)] rounded-xl hover:shadow-[var(--shadow-glow)] transition-all duration-300 btn-magnetic"
          >
            Save
          </button>
        </div>
      </section>

      {/* Storage */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="font-mono text-[10px] tracking-[0.08em] text-[var(--color-accent)] uppercase">
            Storage
          </h2>
          <div className="flex-1 h-px bg-[var(--color-border)]" />
        </div>
        <div className="space-y-2 max-w-md">
          <div className="flex items-center justify-between px-4 py-3.5 glass rounded-xl">
            <div>
              <span className="font-sans text-[14px] text-[var(--color-ink)]">IndexedDB</span>
              <p className="font-sans text-[11px] text-[var(--color-ink-tertiary)] mt-0.5">Local browser storage</p>
            </div>
            <span className="font-mono text-[10px] tracking-[0.04em] uppercase text-[var(--color-success)]">Active</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3.5 rounded-xl border border-[var(--color-border)] opacity-40">
            <div>
              <span className="font-sans text-[14px] text-[var(--color-ink)]">Notion</span>
              <p className="font-sans text-[11px] text-[var(--color-ink-tertiary)] mt-0.5">Sync with Notion database</p>
            </div>
            <span className="font-mono text-[10px] tracking-[0.04em] uppercase text-[var(--color-ink-tertiary)]">Soon</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3.5 rounded-xl border border-[var(--color-border)] opacity-40">
            <div>
              <span className="font-sans text-[14px] text-[var(--color-ink)]">Google Drive</span>
              <p className="font-sans text-[11px] text-[var(--color-ink-tertiary)] mt-0.5">Sync across devices</p>
            </div>
            <span className="font-mono text-[10px] tracking-[0.04em] uppercase text-[var(--color-ink-tertiary)]">Soon</span>
          </div>
        </div>
      </section>

      {/* Data */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="font-mono text-[10px] tracking-[0.08em] text-[var(--color-accent)] uppercase">
            Data
          </h2>
          <div className="flex-1 h-px bg-[var(--color-border)]" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExport}
            className="px-4 py-2.5 text-[12px] font-sans tracking-[0.01em] border border-[var(--color-border)] rounded-xl text-[var(--color-ink-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all duration-300 btn-magnetic"
          >
            Export JSON
          </button>
          <button
            onClick={handleImport}
            className="px-4 py-2.5 text-[12px] font-sans tracking-[0.01em] border border-[var(--color-border)] rounded-xl text-[var(--color-ink-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all duration-300 btn-magnetic"
          >
            Import JSON
          </button>
          {!showClearConfirm ? (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-4 py-2.5 text-[12px] font-sans tracking-[0.01em] border border-[var(--color-border)] rounded-xl text-red-400 hover:border-red-400 transition-all duration-300"
            >
              Clear All Data
            </button>
          ) : (
            <div className="flex gap-2 animate-fadeIn">
              <button
                onClick={handleClear}
                className="px-4 py-2.5 text-[12px] font-sans tracking-[0.01em] bg-red-500 text-white rounded-xl hover:bg-red-400 transition-colors duration-200"
              >
                Yes, clear everything
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2.5 text-[12px] font-sans tracking-[0.01em] border border-[var(--color-border)] rounded-xl text-[var(--color-ink-secondary)]"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-8 border-t border-[var(--color-border)]">
        <p className="font-mono text-[10px] tracking-[0.04em] text-[var(--color-ink-tertiary)]">
          Tsundoku v0.1.0
        </p>
        <p className="font-mono text-[10px] text-[var(--color-ink-tertiary)] mt-1">
          {books.length} {books.length === 1 ? 'book' : 'books'} stored locally
        </p>
      </footer>
    </div>
  )
}
