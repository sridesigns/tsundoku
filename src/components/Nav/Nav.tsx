'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Collection', icon: 'grid' },
  { href: '/archive', label: 'Archive', icon: 'archive' },
  { href: '/settings', label: 'Settings', icon: 'settings' },
]

function NavIcon({ icon, className }: { icon: string; className?: string }) {
  const cls = className ?? 'w-5 h-5'
  switch (icon) {
    case 'grid':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      )
    case 'archive':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="3" width="20" height="5" rx="1" />
          <path d="M4 8v10a2 2 0 002 2h12a2 2 0 002-2V8" />
          <path d="M10 12h4" />
        </svg>
      )
    case 'settings':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
    <aside className="hidden md:flex flex-col w-60 h-screen fixed left-0 top-0 border-r border-[var(--color-border)] bg-[var(--color-surface)] z-40">
      <div className="p-6 pb-2">
        <h1 className="font-display text-2xl text-[var(--color-ink)]">Tsundoku</h1>
        <p className="font-mono text-xs text-[var(--color-ink-tertiary)] mt-1 tracking-wide">
          積ん読
        </p>
      </div>
      <nav className="flex-1 px-3 py-4">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-sans transition-colors ${
                active
                  ? 'text-[var(--color-ink)] bg-[var(--color-surface-raised)]'
                  : 'text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)]'
              }`}
            >
              <NavIcon icon={item.icon} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--color-surface)] border-t border-[var(--color-border)] z-40 flex">
      {navItems.map((item) => {
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-sans transition-colors ${
              active
                ? 'text-[var(--color-ink)]'
                : 'text-[var(--color-ink-tertiary)]'
            }`}
          >
            <NavIcon icon={item.icon} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
