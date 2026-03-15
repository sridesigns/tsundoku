'use client'

interface VoiceCaptureProps {
  isListening: boolean
  isSupported: boolean
  transcript: string
  onStart: () => void
  onStop: () => void
}

export function VoiceCapture({
  isListening,
  isSupported,
  transcript,
  onStart,
  onStop,
}: VoiceCaptureProps) {
  if (!isSupported) {
    return (
      <p className="font-sans text-sm text-[var(--color-ink-secondary)] text-center py-8">
        Voice input is not supported in this browser. Try Chrome or Edge.
      </p>
    )
  }

  return (
    <div className="flex flex-col items-center py-6">
      <button
        onClick={isListening ? onStop : onStart}
        className={`w-16 h-16 flex items-center justify-center transition-colors ${
          isListening
            ? 'bg-[var(--color-accent)] text-white'
            : 'bg-[var(--color-surface-raised)] text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)]'
        }`}
        aria-label={isListening ? 'Stop listening' : 'Start listening'}
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
        </svg>
      </button>
      <p className="font-sans text-sm text-[var(--color-ink-secondary)] mt-4">
        {isListening ? 'Listening...' : 'Tap to speak a book title'}
      </p>
      {transcript && (
        <p className="font-mono text-sm text-[var(--color-ink)] mt-3 px-3 py-2 bg-[var(--color-surface-raised)]">
          &ldquo;{transcript}&rdquo;
        </p>
      )}
    </div>
  )
}
