'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Collection', icon: 'grid' },
  { href: '/archive', label: 'Archive', icon: 'archive' },
  { href: '/settings', label: 'Settings', icon: 'settings' },
]

function NavIcon({ icon, active }: { icon: string; active: boolean }) {
  const strokeWidth = active ? '1.8' : '1.5'
  switch (icon) {
    case 'grid':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      )
    case 'archive':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 8v13H3V8" />
          <path d="M1 3h22v5H1z" />
          <path d="M10 12h4" />
        </svg>
      )
    case 'settings':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      )
    default:
      return null
  }
}

export function DesktopNav() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-60 h-screen fixed left-0 top-0 bg-[var(--color-surface)] border-r border-[var(--color-border)] z-40">
      {/* Brand */}
      <div className="px-8 pt-10 pb-12">
        <h1 className="font-display text-[22px] tracking-[-0.01em] text-[var(--color-ink)]">
          Tsundoku
        </h1>
        <p className="font-mono text-[10px] text-[var(--color-ink-tertiary)] mt-1.5 tracking-[0.15em] uppercase">
          積ん読
        </p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-4 space-y-0.5">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3.5 px-4 py-2.5 text-[13px] font-sans tracking-[0.01em] transition-all duration-200 ${
                active
                  ? 'text-[var(--color-ink)] bg-[var(--color-surface-raised)] font-medium'
                  : 'text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-raised)]'
              }`}
            >
              <NavIcon icon={item.icon} active={active} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-8 py-6 border-t border-[var(--color-border)]">
        <p className="font-mono text-[10px] text-[var(--color-ink-tertiary)] tracking-wide">
          v0.1
        </p>
      </div>
    </aside>
  )
}

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 backdrop-blur-md border-t border-[var(--color-border)] z-40 safe-bottom" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
      <div className="flex">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center gap-1 pt-2.5 pb-2 transition-colors duration-200 ${
                active
                  ? 'text-[var(--color-ink)]'
                  : 'text-[var(--color-ink-tertiary)]'
              }`}
            >
              <NavIcon icon={item.icon} active={active} />
              <span className="text-[10px] font-sans tracking-[0.02em]">
                {item.label}
              </span>
              {active && (
                <div className="w-1 h-1 rounded-full bg-[var(--color-accent)] mt-0.5" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
