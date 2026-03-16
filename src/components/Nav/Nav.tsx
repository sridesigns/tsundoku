'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Collection', icon: 'grid' },
  { href: '/archive', label: 'Archive', icon: 'archive' },
  { href: '/settings', label: 'Settings', icon: 'settings' },
]

function NavIcon({ icon, active }: { icon: string; active: boolean }) {
  const color = active ? 'var(--color-accent)' : 'currentColor'
  const strokeWidth = active ? '1.8' : '1.5'
  switch (icon) {
    case 'grid':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      )
    case 'archive':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 8v13H3V8" />
          <path d="M1 3h22v5H1z" />
          <path d="M10 12h4" />
        </svg>
      )
    case 'settings':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
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
    <aside className="hidden md:flex flex-col w-[72px] hover:w-[220px] h-screen fixed left-0 top-0 z-40 glass-strong transition-all duration-300 group/nav overflow-hidden">
      {/* Brand */}
      <div className="px-0 pt-8 pb-10 flex flex-col items-center group-hover/nav:items-start group-hover/nav:px-6 transition-all duration-300">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--color-accent)] text-[var(--color-bg)] font-display text-[18px] font-bold shrink-0">
          T
        </div>
        <div className="opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300 mt-2 whitespace-nowrap overflow-hidden">
          <p className="font-display text-[18px] text-[var(--color-ink)] tracking-[-0.01em] leading-tight">
            Tsundoku
          </p>
          <p className="font-mono text-[9px] text-[var(--color-ink-tertiary)] tracking-[0.2em] uppercase mt-0.5">
            積ん読
          </p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 flex flex-col gap-1 px-3 group-hover/nav:px-3 transition-all duration-300">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-3 py-3 rounded-xl text-[13px] font-sans tracking-[0.01em] transition-all duration-200 whitespace-nowrap overflow-hidden ${
                active
                  ? 'text-[var(--color-accent)] bg-[var(--color-accent-light)]'
                  : 'text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)] hover:bg-[rgba(255,255,255,0.04)]'
              }`}
            >
              <span className="shrink-0 flex items-center justify-center w-[20px]">
                <NavIcon icon={item.icon} active={active} />
              </span>
              <span className="opacity-0 group-hover/nav:opacity-100 transition-opacity duration-200">
                {item.label}
              </span>
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[var(--color-accent)] rounded-r-full" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 group-hover/nav:px-6 py-6 transition-all duration-300">
        <div className="opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300">
          <p className="font-mono text-[9px] text-[var(--color-ink-tertiary)] tracking-[0.08em]">
            v0.1
          </p>
        </div>
      </div>
    </aside>
  )
}

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 safe-bottom glass-strong">
      <div className="flex">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center gap-1.5 pt-3 pb-2.5 transition-colors duration-200 ${
                active
                  ? 'text-[var(--color-accent)]'
                  : 'text-[var(--color-ink-tertiary)]'
              }`}
            >
              <NavIcon icon={item.icon} active={active} />
              <span className="text-[10px] font-sans tracking-[0.02em]">
                {item.label}
              </span>
              {active && (
                <div className="w-4 h-[2px] rounded-full bg-[var(--color-accent)]" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
