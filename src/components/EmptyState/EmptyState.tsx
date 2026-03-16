'use client'

export function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      {/* Big playful illustration area */}
      <div className="animate-bounce-in mb-8" style={{ animationDelay: '100ms' }}>
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 rounded-3xl bg-fog border-2 border-dashed border-edge rotate-6" />
          <div className="absolute inset-0 rounded-3xl bg-snow border-2 border-dashed border-edge -rotate-3" />
          <div className="absolute inset-0 rounded-3xl bg-snow border border-edge flex items-center justify-center shadow-lg">
            <span className="text-[40px]" role="img" aria-hidden="true">📚</span>
          </div>
        </div>
      </div>

      <h2 className="animate-fadeInUp font-serif text-[32px] md:text-[44px] leading-tight text-ink tracking-tight mb-4">
        Start your <span className="gradient-text">collection</span>
      </h2>

      <p className="animate-fadeInUp font-sans text-[15px] md:text-[16px] text-muted leading-relaxed max-w-sm mb-3"
         style={{ animationDelay: '80ms' }}>
        Snap a photo, speak a title, or search &mdash; capture every book
        that catches your eye.
      </p>

      <p className="animate-fadeInUp font-mono text-[11px] text-faint tracking-widest uppercase mb-10"
         style={{ animationDelay: '150ms' }}>
        積ん読 &middot; the art of collecting books
      </p>

      {/* CTA */}
      <button
        onClick={onAdd}
        aria-label="Add your first book"
        className="animate-bounce-in btn-pop px-8 py-4 text-[15px] font-sans font-medium tracking-wide"
        style={{ animationDelay: '250ms' }}
      >
        <span className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 4v16M4 12h16" />
          </svg>
          Add your first book
        </span>
      </button>
    </div>
  )
}
