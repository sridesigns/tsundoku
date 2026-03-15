export async function extractTextFromImage(imageDataUrl: string): Promise<string> {
  const { createWorker } = await import('tesseract.js')
  const worker = await createWorker('eng')
  const { data } = await worker.recognize(imageDataUrl)
  await worker.terminate()
  return data.text
}

export function extractLikelyTitle(ocrText: string): string {
  const lines = ocrText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 2 && l.length < 100)

  if (lines.length === 0) return ''

  // Return the longest line as the most likely title
  return lines.reduce((a, b) => (a.length >= b.length ? a : b), '')
}
