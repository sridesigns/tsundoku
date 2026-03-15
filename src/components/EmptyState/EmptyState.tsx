'use client'

export function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-8 text-center">
      {/* Decorative book icon */}
      <div className="w-16 h-16 mb-10 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center shadow-[var(--shadow-sm)]">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      </div>

      <h2 className="font-display text-[28px] md:text-[34px] leading-[1.3] text-[var(--color-ink)] max-w-md mb-4 tracking-[-0.01em]">
        Your reading list
      </h2>

      <p className="font-display text-[17px] md:text-[19px] leading-[1.6] text-[var(--color-ink-secondary)] max-w-sm italic mb-2">
        When you come across a book &mdash; a recommendation, a spine on a shelf,
        a name dropped in conversation &mdash;
      </p>
      <p className="font-sans text-[14px] text-[var(--color-ink-tertiary)] tracking-[0.01em] mb-14">
        it belongs here.
      </p>

      <button
        onClick={onAdd}
        className="group relative w-14 h-14 rounded-2xl flex items-center justify-center bg-[var(--color-accent)] text-white shadow-[0_4px_16px_rgba(193,68,14,0.3)] hover:bg-[var(--color-accent-hover)] hover:shadow-[0_6px_20px_rgba(193,68,14,0.35)] transition-all duration-200 active:scale-95"
        aria-label="Add your first book"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M11 3v16M3 11h16" />
        </svg>
      </button>
      <p className="font-sans text-[11px] text-[var(--color-ink-tertiary)] mt-4 tracking-[0.04em] uppercase">
        Add a book
      </p>
    </div>
  )
}
