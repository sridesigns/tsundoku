'use client'

import type { ReactNode } from 'react'
import { StorageProvider } from '@/src/lib/storage/StorageContext'
import { ToastProvider } from '@/src/components/Toast/Toast'
import { DesktopNav, MobileNav } from '@/src/components/Nav/Nav'

export function ClientShell({ children }: { children: ReactNode }) {
  return (
    <StorageProvider>
      <ToastProvider>
        {/* Ambient orbs */}
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />

        <DesktopNav />
        <MobileNav />
        <main className="md:ml-[72px] pb-[80px] md:pb-0 min-h-screen relative z-[1]">
          <div className="max-w-[1100px] mx-auto px-5 md:px-10 lg:px-14 py-6 md:py-10">
            {children}
          </div>
        </main>
      </ToastProvider>
    </StorageProvider>
  )
}
