import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ClientShell } from './ClientShell'

export const metadata: Metadata = {
  title: 'Tsundoku — Your Reading List',
  description: 'A personal book discovery and reading list tracker',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Tsundoku',
  },
}

export const viewport: Viewport = {
  themeColor: '#F7F4EF',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300..700&family=Playfair+Display:wght@400..900&display=swap"
          rel="stylesheet"
        />
        {/* Tailwind v4 strips quotes from multi-word font names in utility classes.
            This inline style tag bypasses PostCSS to provide properly-quoted overrides. */}
        <style dangerouslySetInnerHTML={{ __html: `
          .font-sans { font-family: 'DM Sans', system-ui, -apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif !important; }
          .font-display { font-family: 'Playfair Display', Georgia, 'Times New Roman', serif !important; }
          .font-mono { font-family: 'DM Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important; }
        `}} />
      </head>
      <body className="font-sans bg-[var(--color-bg)] text-[var(--color-ink)]" style={{ fontFamily: "'DM Sans', system-ui, -apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif" }}>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  )
}
