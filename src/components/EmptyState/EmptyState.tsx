'use client'

export function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-8 text-center relative">
      {/* Large ambient glow behind text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(232, 168, 56, 0.06) 0%, transparent 65%)',
          animation: 'orb-glow 6s ease-in-out infinite',
        }}
      />

      {/* Vertical Japanese text accent */}
      <div className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 opacity-[0.06] pointer-events-none">
        <p className="font-display text-[80px] md:text-[120px] leading-none tracking-tighter"
          style={{ writingMode: 'vertical-rl' }}
        >
          積ん読
        </p>
      </div>

      {/* Decorative line */}
      <div className="w-px h-16 bg-gradient-to-b from-transparent via-[var(--color-accent)] to-transparent mb-10 animate-fadeIn opacity-40" />

      <h2 className="font-display text-[36px] md:text-[52px] leading-[1.1] text-[var(--color-ink)] max-w-lg mb-6 tracking-[-0.02em] animate-fadeInUp">
        Your reading list<br />
        <span className="text-[var(--color-ink-tertiary)]">awaits.</span>
      </h2>

      <p className="font-display text-[16px] md:text-[18px] leading-[1.7] text-[var(--color-ink-secondary)] max-w-sm italic mb-3 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
        When you come across a book &mdash; a recommendation,
        a spine on a shelf, a name dropped in conversation &mdash;
      </p>
      <p className="font-sans text-[13px] text-[var(--color-ink-tertiary)] tracking-[0.04em] mb-16 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
        it belongs here.
      </p>

      {/* CTA button — glowing ring */}
      <button
        onClick={onAdd}
        className="group relative w-16 h-16 rounded-2xl flex items-center justify-center btn-magnetic animate-fadeInUp"
        style={{ animationDelay: '300ms' }}
        aria-label="Add your first book"
      >
        {/* Glow ring */}
        <span className="absolute inset-0 rounded-2xl border border-[var(--color-accent)] opacity-40"
          style={{ animation: 'border-glow 3s ease-in-out infinite' }}
        />
        {/* Background */}
        <span className="absolute inset-0 rounded-2xl bg-[var(--color-accent)] opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Icon */}
        <svg className="relative z-10" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-bg)" strokeWidth="2" strokeLinecap="round">
          <path d="M12 4v16M4 12h16" />
        </svg>
      </button>
      <p className="font-mono text-[10px] text-[var(--color-ink-tertiary)] mt-5 tracking-[0.12em] uppercase animate-fadeInUp" style={{ animationDelay: '400ms' }}>
        Add a book
      </p>
    </div>
  )
}
