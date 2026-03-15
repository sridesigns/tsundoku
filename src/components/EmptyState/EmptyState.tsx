'use client'

export function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-8 text-center">
      {/* Decorative line */}
      <div className="w-8 h-px bg-[var(--color-border-strong)] mb-12" />

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
        className="group relative w-14 h-14 flex items-center justify-center bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors duration-200"
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
