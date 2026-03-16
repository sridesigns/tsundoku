'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Collection', icon: 'grid' },
  { href: '/archive', label: 'Archive', icon: 'archive' },
  { href: '/settings', label: 'Settings', icon: 'settings' },
]

function NavIcon({ icon, active }: { icon: string; active: boolean }) {
  const stroke = active ? 'var(--color-gold)' : 'currentColor'
  const sw = active ? '1.8' : '1.5'
  switch (icon) {
    case 'grid':
      return (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      )
    case 'archive':
      return (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 8v13H3V8" />
          <path d="M1 3h22v5H1z" />
          <path d="M10 12h4" />
        </svg>
      )
    case 'settings':
      return (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
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
    <aside className="nav-sidebar glass-nav hidden md:flex flex-col h-screen fixed left-0 top-0 z-40">
      {/* Brand */}
      <div className="nav-brand-row">
        {/* Amber "T" monogram */}
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gold text-bg font-display text-[17px] font-bold shrink-0">
          T
        </div>
        <div className="nav-expand">
          <p className="font-display text-[17px] text-ink tracking-[-0.01em] leading-tight">
            Tsundoku
          </p>
          <p className="font-mono text-[9px] text-ink-3 tracking-[0.2em] uppercase mt-0.5">
            積ん読
          </p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="nav-links">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200 ${
                active
                  ? 'text-gold bg-gold/10'
                  : 'text-ink-2 hover:text-ink hover:bg-white/[0.03]'
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px] bg-gold rounded-r-full" />
              )}
              <span className="shrink-0 w-5 flex items-center justify-center">
                <NavIcon icon={item.icon} active={active} />
              </span>
              <span className="nav-expand text-[13px] font-sans">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer version */}
      <div className="nav-footer">
        <span className="nav-expand font-mono text-[9px] text-ink-3 tracking-[0.08em]">v0.1</span>
      </div>
    </aside>
  )
}

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="glass-bottom md:hidden fixed bottom-0 left-0 right-0 z-40 safe-bottom">
      <div className="flex">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center gap-1.5 pt-3 pb-2.5 transition-colors duration-200 ${
                active ? 'text-gold' : 'text-ink-3'
              }`}
            >
              <NavIcon icon={item.icon} active={active} />
              <span className="text-[10px] font-sans tracking-wide">{item.label}</span>
              {active && <div className="w-4 h-[2px] rounded-full bg-gold" />}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
