'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent {
  error: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  maxAlternatives: number
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  onspeechend: (() => void) | null
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition
    webkitSpeechRecognition?: new () => SpeechRecognition
  }
}

export function useVoice() {
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const intentionalStopRef = useRef(false)
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasResultRef = useRef(false)

  useEffect(() => {
    setIsSupported(
      typeof window !== 'undefined' &&
      !!(window.SpeechRecognition || window.webkitSpeechRecognition)
    )
  }, [])

  const cleanup = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
  }, [])

  const stopListening = useCallback(() => {
    intentionalStopRef.current = true
    cleanup()
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch {
        // Already stopped
      }
    }
    setIsListening(false)
  }, [cleanup])

  const startListening = useCallback(() => {
    if (!isSupported) return

    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognitionClass) return

    // Clean up any previous instance
    if (recognitionRef.current) {
      try { recognitionRef.current.abort() } catch { /* ignore */ }
    }

    setError(null)
    setInterimTranscript('')
    intentionalStopRef.current = false
    hasResultRef.current = false

    const recognition = new SpeechRecognitionClass()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.maxAlternatives = 1

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      hasResultRef.current = true
      let interim = ''
      let final = ''

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          final += result[0]?.transcript ?? ''
        } else {
          interim += result[0]?.transcript ?? ''
        }
      }

      if (final) {
        setTranscript(final.trim())
        setInterimTranscript('')
        // Auto-stop after getting a final result with a small delay
        // to allow for additional speech
        cleanup()
        silenceTimerRef.current = setTimeout(() => {
          stopListening()
        }, 2000)
      } else {
        setInterimTranscript(interim)
        // Reset silence timer on each interim result (user is still speaking)
        cleanup()
        silenceTimerRef.current = setTimeout(() => {
          // If we have interim but no final after 3s of silence, stop
          stopListening()
        }, 3000)
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // 'no-speech' and 'aborted' are expected — don't treat as errors
      if (event.error === 'no-speech') {
        setError('No speech detected. Tap to try again.')
        setIsListening(false)
        return
      }
      if (event.error === 'aborted') {
        return
      }
      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Check browser permissions.')
        setIsListening(false)
        return
      }
      // For network errors, try to be helpful
      if (event.error === 'network') {
        setError('Network error. Voice input requires an internet connection.')
        setIsListening(false)
        return
      }
      setError('Voice input error. Tap to try again.')
      setIsListening(false)
    }

    recognition.onend = () => {
      if (!intentionalStopRef.current && isListening) {
        // Browser stopped recognition unexpectedly — restart if user didn't stop
        try {
          recognition.start()
        } catch {
          setIsListening(false)
        }
      } else {
        setIsListening(false)
      }
    }

    recognitionRef.current = recognition

    try {
      recognition.start()
      setIsListening(true)
    } catch {
      setError('Could not start voice input. Try again.')
    }
  }, [isSupported, isListening, cleanup, stopListening])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
    setError(null)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup()
      if (recognitionRef.current) {
        try { recognitionRef.current.abort() } catch { /* ignore */ }
      }
    }
  }, [cleanup])

  return {
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  }
}
