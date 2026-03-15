'use client'

/**
 * Preprocess image for better OCR results:
 * - Convert to grayscale
 * - Increase contrast
 * - Apply adaptive thresholding
 * - Scale up small images
 */
function preprocessImage(imageDataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      // Scale up for better OCR (Tesseract works best at 300+ DPI equivalent)
      const minDim = Math.min(img.width, img.height)
      const scale = minDim < 1000 ? Math.max(1, 2000 / minDim) : 1
      canvas.width = img.width * scale
      canvas.height = img.height * scale

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(imageDataUrl)
        return
      }

      // Draw scaled image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Get image data and process pixels
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        // Convert to grayscale using luminance
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]

        // Increase contrast
        const contrast = 1.8
        const adjusted = ((gray / 255 - 0.5) * contrast + 0.5) * 255

        // Clamp
        const value = Math.max(0, Math.min(255, adjusted))

        data[i] = value
        data[i + 1] = value
        data[i + 2] = value
      }

      ctx.putImageData(imageData, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => resolve(imageDataUrl)
    img.src = imageDataUrl
  })
}

export async function extractTextFromImage(imageDataUrl: string): Promise<string> {
  const processedImage = await preprocessImage(imageDataUrl)

  const { createWorker } = await import('tesseract.js')
  const worker = await createWorker('eng')
  const { data } = await worker.recognize(processedImage)
  await worker.terminate()
  return data.text
}

/**
 * Extract a likely book title from OCR text.
 *
 * Strategy: instead of trying to pick a single "best" line, we extract
 * the most promising text fragments and return them as a search query.
 * The Open Library API is much better at fuzzy matching than we are at
 * guessing which exact line is the title.
 */
export function extractLikelyTitle(ocrText: string): string {
  const lines = ocrText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => {
      if (l.length < 2) return false
      // Must have some alphabetic content
      const alphaCount = (l.match(/[a-zA-Z]/g) || []).length
      if (alphaCount < 2) return false
      const alphaRatio = alphaCount / l.length
      if (alphaRatio < 0.4) return false
      return true
    })

  if (lines.length === 0) return ''

  // Score lines to find the most title-like ones
  const scored = lines.map((line, i) => {
    let score = 0

    // Position: titles are usually in the top half of the cover
    const positionRatio = i / lines.length
    if (positionRatio < 0.5) score += 30
    if (positionRatio < 0.3) score += 15

    // Length: titles are typically 3-60 chars
    if (line.length >= 3 && line.length <= 60) score += 25
    if (line.length >= 5 && line.length <= 40) score += 15

    // Title case or ALL CAPS
    const words = line.split(/\s+/).filter(w => w.length > 0)
    const capitalizedWords = words.filter(w => w[0] === w[0].toUpperCase())
    if (words.length > 0 && capitalizedWords.length === words.length) score += 20
    if (line === line.toUpperCase() && line !== line.toLowerCase()) score += 15

    // Penalize things that look like subtitles, blurbs, or author attributions
    const lower = line.toLowerCase()
    if (lower.startsWith('by ') || lower.startsWith('a novel')) score -= 40
    if (lower.includes('bestseller') || lower.includes('new york times')) score -= 30
    if (lower.includes('winner') || lower.includes('award') || lower.includes('prize')) score -= 25
    if (lower.includes('edition') || lower.includes('isbn') || lower.includes('copyright')) score -= 50
    if (lower.includes('www.') || lower.includes('.com') || lower.includes('.org')) score -= 50

    // Penalize very short fragments
    if (line.length < 3) score -= 30

    // Penalize lines that are mostly punctuation/numbers after cleanup
    const cleaned = line.replace(/[^a-zA-Z\s]/g, '').trim()
    if (cleaned.length < 2) score -= 40

    return { line, score, cleaned }
  })

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score)

  // Take the top 1-2 scoring lines and combine them as a search query
  // This gives Open Library more context for fuzzy matching
  const topLines = scored
    .filter(s => s.score > 0)
    .slice(0, 2)
    .map(s => s.cleaned.replace(/[^a-zA-Z0-9\s'\-]/g, '').trim())
    .filter(s => s.length > 0)

  if (topLines.length === 0) {
    // Fallback: return the longest alphabetic line
    const fallback = lines
      .map(l => l.replace(/[^a-zA-Z0-9\s'\-]/g, '').trim())
      .filter(l => l.length >= 3)
      .sort((a, b) => b.length - a.length)[0]
    return fallback || ''
  }

  return topLines.join(' ')
}
