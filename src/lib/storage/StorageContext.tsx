'use client'

import { createContext, useContext, useRef, type ReactNode } from 'react'
import type { StorageAdapter } from './types'
import { StorageManager } from './StorageManager'

const StorageContext = createContext<StorageAdapter | null>(null)

export function StorageProvider({ children }: { children: ReactNode }) {
  const adapterRef = useRef<StorageAdapter>(StorageManager.getAdapter())
  return (
    <StorageContext.Provider value={adapterRef.current}>
      {children}
    </StorageContext.Provider>
  )
}

export function useStorage(): StorageAdapter {
  const ctx = useContext(StorageContext)
  if (!ctx) throw new Error('useStorage must be used within StorageProvider')
  return ctx
}
