'use client'

export function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <p className="font-display text-2xl md:text-3xl text-[var(--color-ink)] max-w-lg leading-relaxed italic">
        &ldquo;When you come across a book &mdash; a recommendation, a spine on a shelf,
        a name dropped in conversation &mdash; it belongs here.&rdquo;
      </p>
      <button
        onClick={onAdd}
        className="mt-10 w-14 h-14 flex items-center justify-center bg-[var(--color-accent)] text-white text-2xl font-sans hover:opacity-90 transition-opacity"
        aria-label="Add your first book"
      >
        +
      </button>
    </div>
  )
}
