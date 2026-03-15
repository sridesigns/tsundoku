'use client'

import { useEffect } from 'react'
import { useBookStore } from '@/src/store/books'

export function useBooks() {
  const store = useBookStore()

  useEffect(() => {
    store.hydrate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return store
}
