'use client'

import { useRef, useCallback, useState, type ComponentType } from 'react'
import dynamic from 'next/dynamic'

interface WebcamComponentProps {
  screenshotFormat?: string
  screenshotQuality?: number
  videoConstraints?: MediaTrackConstraints
  onUserMedia?: () => void
  onUserMediaError?: () => void
  className?: string
  audio?: boolean
  ref?: React.Ref<{ getScreenshot: (dimensions?: { width: number; height: number }) => string | null }>
}

const Webcam = dynamic(
  () => import('react-webcam').then((mod) => mod.default as unknown as ComponentType<WebcamComponentProps>),
  { ssr: false }
)

interface CameraCaptureProps {
  isProcessing: boolean
  error: string | null
  onCapture: (imageDataUrl: string) => Promise<string>
}

export function CameraCapture({ isProcessing, error, onCapture }: CameraCaptureProps) {
  const webcamRef = useRef<{ getScreenshot: (d?: { width: number; height: number }) => string | null }>(null)
  const [cameraReady, setCameraReady] = useState(false)
  const [cameraError, setCameraError] = useState(false)

  const handleCapture = useCallback(() => {
    if (!webcamRef.current) return
    const screenshot = webcamRef.current.getScreenshot({ width: 1920, height: 2560 })
    if (screenshot) onCapture(screenshot)
  }, [onCapture])

  if (cameraError) {
    return (
      <div className="flex flex-col items-center py-12 px-4">
        <div className="w-16 h-16 flex items-center justify-center bg-raised rounded-2xl border border-wire mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-ink-3" strokeWidth="1.5" strokeLinecap="round">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
            <circle cx="12" cy="13" r="4" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        </div>
        <p className="font-sans text-[13px] text-ink-2 text-center leading-relaxed max-w-[260px]">
          Camera access denied. Check your browser permissions, or try typing instead.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-[300px] aspect-[3/4] bg-black overflow-hidden relative rounded-2xl border border-wire">
        <Webcam
          ref={webcamRef as React.RefObject<never>}
          screenshotFormat="image/png"
          screenshotQuality={1}
          videoConstraints={{ facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 2560 } }}
          onUserMedia={() => setCameraReady(true)}
          onUserMediaError={() => setCameraError(true)}
          className="w-full h-full object-cover"
          audio={false}
        />
        {!cameraReady && !cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface">
            <div className="w-5 h-5 border-[1.5px] border-gold border-t-transparent rounded-full animate-spin mb-3" />
            <p className="font-sans text-[12px] text-ink-3">Starting camera...</p>
          </div>
        )}
        {cameraReady && (
          <div className="absolute inset-4 pointer-events-none">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-gold/50" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-gold/50" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-gold/50" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-gold/50" />
          </div>
        )}
      </div>

      <p className="font-sans text-[11px] text-ink-3 mt-3 mb-4 text-center">
        Point at a book cover or title page
      </p>

      {isProcessing ? (
        <div className="flex items-center gap-2.5 py-3">
          <div className="w-4 h-4 border-[1.5px] border-gold border-t-transparent rounded-full animate-spin" />
          <span className="font-sans text-[13px] text-ink-2">Reading text...</span>
        </div>
      ) : (
        <button
          onClick={handleCapture}
          disabled={!cameraReady}
          className="px-8 py-3.5 text-[13px] font-sans bg-gold text-bg rounded-xl btn-press gold-glow disabled:opacity-30"
        >
          Capture
        </button>
      )}

      {error && (
        <p className="font-sans text-[12px] text-gold mt-4 text-center max-w-[280px] leading-relaxed">{error}</p>
      )}
    </div>
  )
}
