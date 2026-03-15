'use client'

import { useState, useCallback } from 'react'
import { extractTextFromImage, extractLikelyTitle } from '@/src/lib/ocr'

export function useCamera() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedText, setExtractedText] = useState('')
  const [error, setError] = useState<string | null>(null)

  const processImage = useCallback(async (imageDataUrl: string) => {
    setIsProcessing(true)
    setError(null)
    try {
      const text = await extractTextFromImage(imageDataUrl)
      const title = extractLikelyTitle(text)
      setExtractedText(title)
      return title
    } catch {
      setError('Failed to read text from image. Try typing instead.')
      return ''
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const reset = useCallback(() => {
    setExtractedText('')
    setError(null)
    setIsProcessing(false)
  }, [])

  return { isProcessing, extractedText, error, processImage, reset }
}
