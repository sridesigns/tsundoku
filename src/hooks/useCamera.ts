'use client'

import { useState, useCallback } from 'react'
import { extractTextFromImage, extractLikelyTitle } from '@/src/lib/ocr'

export function useCamera() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedText, setExtractedText] = useState('')
  const [rawOcrText, setRawOcrText] = useState('')
  const [error, setError] = useState<string | null>(null)

  const processImage = useCallback(async (imageDataUrl: string) => {
    setIsProcessing(true)
    setError(null)
    setRawOcrText('')
    try {
      const text = await extractTextFromImage(imageDataUrl)
      setRawOcrText(text)
      const title = extractLikelyTitle(text)
      if (!title) {
        setError('Could not find text in image. Try holding the camera steady with good lighting, or type the title instead.')
        setExtractedText('')
        return ''
      }
      setExtractedText(title)
      return title
    } catch {
      setError('Failed to read text from image. Try typing the title instead.')
      return ''
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const reset = useCallback(() => {
    setExtractedText('')
    setRawOcrText('')
    setError(null)
    setIsProcessing(false)
  }, [])

  return { isProcessing, extractedText, rawOcrText, error, processImage, reset }
}
