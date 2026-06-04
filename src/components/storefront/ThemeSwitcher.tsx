'use client'
import { useState, useRef, useEffect } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import type { ThemeMode } from '@/lib/theme'

const OPTIONS: { value: ThemeMode; icon: typeof Sun; label: string }[] = [
  { value: 'light',  icon: Sun,     label: 'Light'  },
  { value: 'dark',   icon: Moon,    label: 'Dark'   },
  { value: 'system', icon: Monitor, label: 'System' },
]

export function ThemeSwitcher() {
  const { mode, isDark, setMode } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const ActiveIcon = isDark ? Moon : Sun

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        title="Toggle theme"
        className="p-2 rounded-xl text-[var(--sf-text-muted)] hover:text-[var(--sf-text)] hover:bg-[var(--sf-accent-light)]/50 transition-all"
        aria-label="Theme"
      >
        <ActiveIcon className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-36 bg-white dark:bg-[#1A2E1E] border border-[var(--sf-border)] rounded-2xl shadow-xl overflow-hidden z-50 py-1">
          {OPTIONS.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => { setMode(value); setOpen(false) }}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                mode === value
                  ? 'bg-[var(--sf-accent-light)] text-[var(--sf-primary)] font-semibold'
                  : 'text-[var(--sf-text-muted)] hover:bg-[var(--sf-accent-light)]/40 hover:text-[var(--sf-text)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              {label}
              {mode === value && <span className="ml-auto text-[var(--sf-primary)]">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
