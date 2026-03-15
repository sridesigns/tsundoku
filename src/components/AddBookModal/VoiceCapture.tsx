'use client'

interface VoiceCaptureProps {
  isListening: boolean
  isSupported: boolean
  transcript: string
  interimTranscript: string
  error: string | null
  onStart: () => void
  onStop: () => void
}

export function VoiceCapture({
  isListening,
  isSupported,
  transcript,
  interimTranscript,
  error,
  onStart,
  onStop,
}: VoiceCaptureProps) {
  if (!isSupported) {
    return (
      <div className="flex flex-col items-center py-12 px-4">
        <div className="w-16 h-16 flex items-center justify-center bg-[var(--color-surface-raised)] mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-tertiary)" strokeWidth="1.5" strokeLinecap="round">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        </div>
        <p className="font-sans text-[13px] text-[var(--color-ink-secondary)] text-center leading-relaxed max-w-[260px]">
          Voice input isn&apos;t available in this browser. Try using Chrome or Edge for voice support.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center py-8">
      {/* Mic button with pulse ring */}
      <div className="relative">
        {isListening && (
          <div
            className="absolute inset-0 rounded-full bg-[var(--color-accent)]"
            style={{ animation: 'pulse-ring 1.5s ease-out infinite' }}
          />
        )}
        <button
          onClick={isListening ? onStop : onStart}
          className={`relative w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all duration-300 ${
            isListening
              ? 'bg-[var(--color-accent)] text-white scale-105'
              : 'bg-[var(--color-surface-raised)] text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)] hover:bg-[var(--color-border)]'
          }`}
          aria-label={isListening ? 'Stop listening' : 'Start listening'}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        </button>
      </div>

      {/* Status text */}
      <p className="font-sans text-[13px] text-[var(--color-ink-secondary)] mt-6 text-center">
        {isListening ? (
          <span className="text-[var(--color-accent)]">Listening...</span>
        ) : (
          'Tap to speak a book title'
        )}
      </p>

      {/* Interim transcript (what user is currently saying) */}
      {isListening && interimTranscript && (
        <p className="font-sans text-[14px] text-[var(--color-ink-tertiary)] italic mt-4 px-4 text-center">
          {interimTranscript}
        </p>
      )}

      {/* Final transcript */}
      {transcript && (
        <div className="mt-5 px-4 py-3 bg-[var(--color-surface-raised)] max-w-[280px]">
          <p className="font-sans text-[14px] text-[var(--color-ink)] text-center">
            &ldquo;{transcript}&rdquo;
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="font-sans text-[12px] text-[var(--color-accent)] mt-4 text-center max-w-[280px]">
          {error}
        </p>
      )}
    </div>
  )
}
