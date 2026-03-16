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
      <header className="mb-8">
        <h1 className="font-serif text-[32px] md:text-[42px] text-ink tracking-tight">Settings</h1>
        <div className="w-12 h-[3px] rounded-full mt-3" style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }} />
      </header>

      {/* AI Categorization */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="font-mono text-[10px] tracking-widest text-pop uppercase font-medium">AI Categorization</h2>
          <div className="flex-1 h-px bg-edge" />
        </div>
        <p className="font-sans text-[13px] text-muted leading-relaxed mb-4 max-w-md">
          Add your Anthropic API key to enable automatic genre categorization.
          Stored locally — never sent to our servers.
        </p>
        <div className="flex gap-2 max-w-md">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-ant-..."
            className="flex-1 px-4 py-3 text-[13px] font-mono bg-fog text-ink border border-edge rounded-xl input-ring"
          />
          <button onClick={handleSaveKey} className="px-5 py-3 text-[13px] font-sans font-medium btn-pop text-snow">
            Save
          </button>
        </div>
      </section>

      {/* Storage */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="font-mono text-[10px] tracking-widest text-pop uppercase font-medium">Storage</h2>
          <div className="flex-1 h-px bg-edge" />
        </div>
        <div className="space-y-2 max-w-md">
          <div className="card flex items-center justify-between px-5 py-4">
            <div>
              <span className="font-sans text-[14px] text-ink font-medium">IndexedDB</span>
              <p className="font-sans text-[11px] text-faint mt-0.5">Local browser storage</p>
            </div>
            <span className="font-mono text-[10px] tracking-wide uppercase text-leaf font-medium">Active</span>
          </div>
          {['Notion', 'Google Drive'].map((name) => (
            <div key={name} className="card flex items-center justify-between px-5 py-4 opacity-40">
              <span className="font-sans text-[14px] text-ink">{name}</span>
              <span className="font-mono text-[10px] tracking-wide uppercase text-faint">Soon</span>
            </div>
          ))}
        </div>
      </section>

      {/* Data */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="font-mono text-[10px] tracking-widest text-pop uppercase font-medium">Data</h2>
          <div className="flex-1 h-px bg-edge" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExport} className="btn-ghost px-4 py-2.5 text-[12px] font-sans">Export JSON</button>
          <button onClick={handleImport} className="btn-ghost px-4 py-2.5 text-[12px] font-sans">Import JSON</button>
          {!showClearConfirm ? (
            <button onClick={() => setShowClearConfirm(true)} className="px-4 py-2.5 text-[12px] font-sans rounded-xl border border-edge text-heat hover:border-heat transition-colors duration-200">
              Clear All Data
            </button>
          ) : (
            <div className="flex gap-2 animate-fadeIn">
              <button onClick={handleClear} className="px-4 py-2.5 text-[12px] font-sans bg-heat text-snow rounded-xl hover:brightness-110 transition-all duration-200">
                Yes, clear everything
              </button>
              <button onClick={() => setShowClearConfirm(false)} className="btn-ghost px-4 py-2.5 text-[12px] font-sans">
                Cancel
              </button>
            </div>
          )}
        </div>
      </section>

      <footer className="pt-8 border-t border-edge">
        <p className="font-mono text-[10px] tracking-wide text-faint">Tsundoku v0.1.0</p>
        <p className="font-mono text-[10px] text-faint mt-1">
          {books.length} {books.length === 1 ? 'book' : 'books'} stored locally
        </p>
      </footer>
    </div>
  )
}
