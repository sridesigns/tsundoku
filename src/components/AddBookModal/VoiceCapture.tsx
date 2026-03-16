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

export function VoiceCapture({ isListening, isSupported, transcript, interimTranscript, error, onStart, onStop }: VoiceCaptureProps) {
  if (!isSupported) {
    return (
      <div className="flex flex-col items-center py-12 px-4">
        <div className="w-16 h-16 flex items-center justify-center bg-raised rounded-2xl border border-wire mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-ink-3" strokeWidth="1.5" strokeLinecap="round">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        </div>
        <p className="font-sans text-[13px] text-ink-2 text-center leading-relaxed max-w-[260px]">
          Voice input isn&apos;t available in this browser. Try Chrome or Edge.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center py-8">
      <div className="relative">
        {isListening && (
          <>
            <div className="absolute inset-0 rounded-full bg-gold" style={{ animation: 'pulse-ring 1.5s ease-out infinite' }} />
            <div className="absolute inset-0 rounded-full bg-gold" style={{ animation: 'pulse-ring 1.5s ease-out infinite 0.6s' }} />
          </>
        )}
        <button
          onClick={isListening ? onStop : onStart}
          className={`relative w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all duration-300 ${
            isListening
              ? 'bg-gold text-bg scale-105'
              : 'bg-raised border border-wire text-ink-2 hover:text-ink hover:border-wire-2'
          }`}
          style={isListening ? { boxShadow: '0 0 32px rgba(232,168,56,0.3)' } : {}}
          aria-label={isListening ? 'Stop listening' : 'Start listening'}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        </button>
      </div>

      <p className="font-sans text-[13px] text-ink-2 mt-6 text-center">
        {isListening ? <span className="text-gold">Listening...</span> : 'Tap to speak a book title'}
      </p>

      {isListening && interimTranscript && (
        <p className="font-sans text-[14px] text-ink-3 italic mt-4 px-4 text-center">{interimTranscript}</p>
      )}

      {transcript && (
        <div className="mt-5 px-5 py-3.5 bg-gold/8 border border-gold/20 max-w-[280px] rounded-xl">
          <p className="font-sans text-[14px] text-ink text-center">&ldquo;{transcript}&rdquo;</p>
        </div>
      )}

      {error && (
        <p className="font-sans text-[12px] text-gold mt-4 text-center max-w-[280px]">{error}</p>
      )}
    </div>
  )
}
