'use client'

import { useEffect, useState, useCallback, createContext, useContext, type ReactNode } from 'react'

interface ToastData { id: string; message: string }
interface ToastContextType { showToast: (message: string) => void }

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

function ToastItem({ toast, onDismiss }: { toast: ToastData; onDismiss: (id: string) => void }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onDismiss(toast.id), 350)
    }, 3000)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <div
      className="font-sans text-[13px] tracking-[0.01em] px-5 py-3.5 rounded-xl bg-surface border border-wire text-ink transition-all duration-350"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.97)',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <span className="text-gold mr-2">✓</span>
      {toast.message}
    </div>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const showToast = useCallback((message: string) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message }])
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-[84px] md:bottom-8 left-4 right-4 md:left-auto md:right-8 z-[60] flex flex-col items-center md:items-end gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
