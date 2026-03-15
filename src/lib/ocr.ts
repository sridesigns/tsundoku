'use client'

/**
 * Preprocess image for better OCR results:
 * - Convert to grayscale
 * - Increase contrast
 * - Sharpen edges
 * - Scale up small images
 */
function preprocessImage(imageDataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      // Scale up for better OCR (Tesseract works best at 300+ DPI equivalent)
      const scale = Math.max(1, 1500 / Math.max(img.width, img.height))
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

        // Increase contrast (stretch histogram)
        const contrast = 1.5
        const adjusted = ((gray / 255 - 0.5) * contrast + 0.5) * 255

        // Threshold to make text crisper
        const value = adjusted > 140 ? 255 : adjusted < 80 ? 0 : adjusted

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
  // Preprocess for better OCR accuracy
  const processedImage = await preprocessImage(imageDataUrl)

  const { createWorker } = await import('tesseract.js')
  const worker = await createWorker('eng')
  const { data } = await worker.recognize(processedImage)
  await worker.terminate()
  return data.text
}

export function extractLikelyTitle(ocrText: string): string {
  const lines = ocrText
    .split('\n')
    .map((l) => l.trim())
    // Remove lines that are obviously not titles
    .filter((l) => {
      if (l.length < 2 || l.length > 120) return false
      // Skip lines that are mostly numbers or special chars
      const alphaRatio = (l.match(/[a-zA-Z]/g) || []).length / l.length
      if (alphaRatio < 0.5) return false
      // Skip common noise words from book covers
      const lower = l.toLowerCase()
      if (['bestseller', 'new york times', 'national', 'winner', 'prize', 'award'].some(w => lower === w)) return false
      return true
    })

  if (lines.length === 0) return ''

  // Score each line — titles tend to be:
  // - In the upper portion of the text (book covers have title at top)
  // - Moderately long but not the longest (longest is often a subtitle or blurb)
  // - Often in UPPER CASE or Title Case
  let bestScore = -1
  let bestLine = lines[0]

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    let score = 0

    // Position bonus — earlier lines are more likely titles
    score += Math.max(0, (lines.length - i) / lines.length) * 30

    // Length sweet spot — titles are typically 3-60 chars
    if (line.length >= 3 && line.length <= 60) score += 25
    if (line.length >= 5 && line.length <= 40) score += 15

    // Title case or ALL CAPS bonus
    const words = line.split(/\s+/)
    const capitalizedWords = words.filter(w => w.length > 0 && w[0] === w[0].toUpperCase())
    if (capitalizedWords.length === words.length) score += 20

    // All caps (common for book titles on covers)
    if (line === line.toUpperCase() && line !== line.toLowerCase()) score += 10

    // Penalize lines that look like author names (usually have "by" before them)
    if (i > 0 && lines[i - 1].toLowerCase().startsWith('by')) score -= 30

    // Penalize very short lines (likely fragments)
    if (line.length < 4) score -= 20

    if (score > bestScore) {
      bestScore = score
      bestLine = line
    }
  }

  // Clean up: remove stray punctuation but keep apostrophes and hyphens
  return bestLine.replace(/[^a-zA-Z0-9\s'\-:,&.]/g, '').trim()
}
