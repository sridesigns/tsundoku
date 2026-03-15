'use client'

import { useRef, useCallback, useState, type ComponentType } from 'react'
import dynamic from 'next/dynamic'

interface WebcamComponentProps {
  screenshotFormat?: string
  videoConstraints?: MediaTrackConstraints
  onUserMedia?: () => void
  className?: string
  audio?: boolean
  ref?: React.Ref<{ getScreenshot: () => string | null }>
}

const Webcam = dynamic(
  () =>
    import('react-webcam').then(
      (mod) => mod.default as unknown as ComponentType<WebcamComponentProps>
    ),
  { ssr: false }
)

interface CameraCaptureProps {
  isProcessing: boolean
  error: string | null
  onCapture: (imageDataUrl: string) => Promise<string>
}

export function CameraCapture({ isProcessing, error, onCapture }: CameraCaptureProps) {
  const webcamRef = useRef<{ getScreenshot: () => string | null }>(null)
  const [cameraReady, setCameraReady] = useState(false)

  const handleCapture = useCallback(() => {
    if (!webcamRef.current) return
    const screenshot = webcamRef.current.getScreenshot()
    if (screenshot) {
      onCapture(screenshot)
    }
  }, [onCapture])

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-[320px] aspect-[3/4] bg-[var(--color-surface-raised)] overflow-hidden relative mb-4">
        <Webcam
          ref={webcamRef as React.RefObject<never>}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: 'environment' }}
          onUserMedia={() => setCameraReady(true)}
          className="w-full h-full object-cover"
          audio={false}
        />
        {!cameraReady && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="font-sans text-sm text-[var(--color-ink-tertiary)]">Starting camera...</p>
          </div>
        )}
      </div>

      {isProcessing ? (
        <p className="font-sans text-sm text-[var(--color-ink-secondary)] py-3">Reading...</p>
      ) : (
        <button
          onClick={handleCapture}
          disabled={!cameraReady}
          className="px-6 py-3 text-sm font-sans bg-[var(--color-ink)] text-[var(--color-bg)] hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Capture
        </button>
      )}

      {error && (
        <p className="font-sans text-sm text-[var(--color-accent)] mt-3">{error}</p>
      )}
    </div>
  )
}
