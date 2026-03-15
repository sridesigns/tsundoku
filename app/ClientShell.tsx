'use client'

import type { ReactNode } from 'react'
import { StorageProvider } from '@/src/lib/storage/StorageContext'
import { ToastProvider } from '@/src/components/Toast/Toast'
import { DesktopNav, MobileNav } from '@/src/components/Nav/Nav'

export function ClientShell({ children }: { children: ReactNode }) {
  return (
    <StorageProvider>
      <ToastProvider>
        <DesktopNav />
        <MobileNav />
        <main className="md:ml-60 pb-[72px] md:pb-0 min-h-screen">
          <div className="max-w-[960px] mx-auto px-5 md:px-10 py-8 md:py-12">
            {children}
          </div>
        </main>
      </ToastProvider>
    </StorageProvider>
  )
}
