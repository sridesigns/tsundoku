'use client'

export function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-8 text-center relative">
      {/* Vertical Japanese watermark */}
      <div className="absolute right-4 md:right-16 top-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none select-none" aria-hidden>
        <p className="font-display text-[90px] md:text-[130px] leading-none text-ink"
           style={{ writingMode: 'vertical-rl' }}>
          積ん読
        </p>
      </div>

      {/* Thin accent divider */}
      <div className="w-px h-14 bg-gradient-to-b from-transparent via-gold to-transparent mb-10 animate-fadeIn opacity-50" />

      <h2 className="animate-fadeInUp font-display text-[38px] md:text-[54px] leading-[1.08] text-ink max-w-lg mb-6 tracking-[-0.025em]">
        Your reading list<br />
        <span className="text-ink-3">awaits.</span>
      </h2>

      <p className="animate-fadeInUp font-display text-[16px] md:text-[18px] leading-[1.75] text-ink-2 max-w-sm italic mb-3"
         style={{ animationDelay: '80ms' }}>
        When you come across a book &mdash; a recommendation,
        a spine on a shelf, a name dropped in conversation &mdash;
      </p>

      <p className="animate-fadeInUp font-sans text-[12px] text-ink-3 tracking-[0.06em] uppercase mb-16"
         style={{ animationDelay: '160ms' }}>
        it belongs here.
      </p>

      {/* Add button */}
      <button
        onClick={onAdd}
        aria-label="Add your first book"
        className="animate-fadeInUp relative group w-16 h-16 rounded-2xl bg-gold text-bg flex items-center justify-center btn-press gold-glow"
        style={{
          animationDelay: '240ms',
          boxShadow: '0 4px 20px rgba(232,168,56,0.25)',
          animation: 'fadeInUp 450ms cubic-bezier(0.16,1,0.3,1) 240ms both, border-breathe 3s ease-in-out 1s infinite',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M12 4v16M4 12h16" />
        </svg>
      </button>

      <p className="font-mono text-[10px] text-ink-3 mt-4 tracking-[0.12em] uppercase animate-fadeIn"
         style={{ animationDelay: '400ms' }}>
        Add a book
      </p>
    </div>
  )
}
