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
    setApiKey(localStorage.getItem('tsundoku_anthropic_key') ?? '')
  }, [])

  const handleSaveKey = useCallback(() => {
    localStorage.setItem('tsundoku_anthropic_key', apiKey)
    showToast('API key saved')
  }, [apiKey, showToast])

  const handleExport = useCallback(() => {
    const date = new Date().toISOString().split('T')[0]
    const blob = new Blob([JSON.stringify(books, null, 2)], { type: 'application/json' })
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
        const data = JSON.parse(await file.text())
        if (!Array.isArray(data)) throw new Error()
        const valid = data.filter(
          (b: Record<string, unknown>) =>
            typeof b.id === 'string' && typeof b.title === 'string' &&
            typeof b.author === 'string' && typeof b.status === 'string' &&
            typeof b.date_added === 'number'
        )
        if (valid.length === 0) throw new Error()
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
        <h1 className="font-display text-[34px] md:text-[44px] text-ink tracking-[-0.025em]">Settings</h1>
        <div className="w-10 h-[2px] bg-gold mt-3 opacity-50" />
      </header>

      {/* Sections helper */}
      {(['AI Categorization', 'Storage', 'Data'] as const).map(() => null)}

      <section className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="font-mono text-[10px] tracking-[0.08em] text-gold uppercase">AI Categorization</h2>
          <div className="flex-1 h-px bg-wire" />
        </div>
        <p className="font-sans text-[13px] text-ink-2 leading-relaxed mb-4 max-w-md">
          Add your Anthropic API key to enable automatic genre categorization.
          Stored locally — never sent to our servers.
        </p>
        <div className="flex gap-2 max-w-md">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-ant-..."
            className="flex-1 px-4 py-3 text-[13px] font-mono bg-raised text-ink border border-wire rounded-xl input-focus"
          />
          <button
            onClick={handleSaveKey}
            className="px-5 py-3 text-[13px] font-sans bg-gold text-bg rounded-xl btn-press gold-glow"
          >
            Save
          </button>
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="font-mono text-[10px] tracking-[0.08em] text-gold uppercase">Storage</h2>
          <div className="flex-1 h-px bg-wire" />
        </div>
        <div className="space-y-2 max-w-md">
          <div className="flex items-center justify-between px-4 py-3.5 bg-surface border border-wire rounded-xl">
            <div>
              <span className="font-sans text-[14px] text-ink">IndexedDB</span>
              <p className="font-sans text-[11px] text-ink-3 mt-0.5">Local browser storage</p>
            </div>
            <span className="font-mono text-[10px] tracking-[0.04em] uppercase text-green">Active</span>
          </div>
          {['Notion', 'Google Drive'].map((name) => (
            <div key={name} className="flex items-center justify-between px-4 py-3.5 border border-wire rounded-xl opacity-35">
              <span className="font-sans text-[14px] text-ink">{name}</span>
              <span className="font-mono text-[10px] tracking-[0.04em] uppercase text-ink-3">Soon</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="font-mono text-[10px] tracking-[0.08em] text-gold uppercase">Data</h2>
          <div className="flex-1 h-px bg-wire" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExport} className="px-4 py-2.5 text-[12px] font-sans border border-wire rounded-xl text-ink-2 hover:border-wire-2 hover:text-ink transition-colors duration-200">
            Export JSON
          </button>
          <button onClick={handleImport} className="px-4 py-2.5 text-[12px] font-sans border border-wire rounded-xl text-ink-2 hover:border-wire-2 hover:text-ink transition-colors duration-200">
            Import JSON
          </button>
          {!showClearConfirm ? (
            <button onClick={() => setShowClearConfirm(true)} className="px-4 py-2.5 text-[12px] font-sans border border-wire rounded-xl text-red-400 hover:border-red-400 transition-colors duration-200">
              Clear All Data
            </button>
          ) : (
            <div className="flex gap-2 animate-fadeIn">
              <button onClick={handleClear} className="px-4 py-2.5 text-[12px] font-sans bg-red-600 text-white rounded-xl hover:bg-red-500 transition-colors duration-200">
                Yes, clear everything
              </button>
              <button onClick={() => setShowClearConfirm(false)} className="px-4 py-2.5 text-[12px] font-sans border border-wire rounded-xl text-ink-2">
                Cancel
              </button>
            </div>
          )}
        </div>
      </section>

      <footer className="pt-8 border-t border-wire">
        <p className="font-mono text-[10px] tracking-[0.04em] text-ink-3">Tsundoku v0.1.0</p>
        <p className="font-mono text-[10px] text-ink-3 mt-1">
          {books.length} {books.length === 1 ? 'book' : 'books'} stored locally
        </p>
      </footer>
    </div>
  )
}
