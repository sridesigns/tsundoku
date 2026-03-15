'use client'

import { useEffect } from 'react'
import { useBookStore } from '@/src/store/books'

export function useBooks() {
  const store = useBookStore()
  const hydrate = useBookStore((s) => s.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return store
}
