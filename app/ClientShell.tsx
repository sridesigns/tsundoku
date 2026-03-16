'use client'

import type { ReactNode } from 'react'
import { StorageProvider } from '@/src/lib/storage/StorageContext'
import { ToastProvider } from '@/src/components/Toast/Toast'
import { TopNav, MobileNav } from '@/src/components/Nav/Nav'

export function ClientShell({ children }: { children: ReactNode }) {
  return (
    <StorageProvider>
      <ToastProvider>
        {/* Decorative mesh blobs */}
        <div className="mesh-blob mesh-blob-1" />
        <div className="mesh-blob mesh-blob-2" />
        <div className="mesh-blob mesh-blob-3" />

        <TopNav />
        <MobileNav />
        <main className="pt-[72px] pb-[80px] md:pb-0 min-h-screen">
          <div className="max-w-[1120px] mx-auto px-5 md:px-8 lg:px-12 py-6 md:py-10">
            {children}
          </div>
        </main>
      </ToastProvider>
    </StorageProvider>
  )
}
