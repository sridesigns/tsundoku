'use client'

import type { ReactNode } from 'react'
import { StorageProvider } from '@/src/lib/storage/StorageContext'
import { ToastProvider } from '@/src/components/Toast/Toast'
import { DesktopNav, MobileNav } from '@/src/components/Nav/Nav'

export function ClientShell({ children }: { children: ReactNode }) {
  return (
    <StorageProvider>
      <ToastProvider>
        {/* Decorative ambient orbs — behind everything */}
        <div className="orb orb-gold" />
        <div className="orb orb-purple" />

        <DesktopNav />
        <MobileNav />
        <main className="md:ml-[68px] pb-[76px] md:pb-0 min-h-screen">
          <div className="max-w-[1100px] mx-auto px-5 md:px-10 lg:px-14 py-6 md:py-10">
            {children}
          </div>
        </main>
      </ToastProvider>
    </StorageProvider>
  )
}
