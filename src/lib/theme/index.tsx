'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

interface ThemeContextType {
  mode:     ThemeMode
  resolved: ResolvedTheme
  isDark:   boolean
  setMode:  (m: ThemeMode) => void
  toggle:   () => void
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'system', resolved: 'light', isDark: false,
  setMode: () => {}, toggle: () => {},
})

const STORAGE_KEY = 'cellaviva_theme'

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(resolved: ResolvedTheme) {
  const html = document.documentElement
  if (resolved === 'dark') {
    html.setAttribute('data-theme', 'dark')
    html.classList.add('dark')
  } else {
    html.setAttribute('data-theme', 'light')
    html.classList.remove('dark')
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode,     setModeState] = useState<ThemeMode>('system')
  const [resolved, setResolved]  = useState<ResolvedTheme>('light')

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as ThemeMode) ?? 'system'
    setModeState(saved)

    const calc = saved === 'system' ? getSystemTheme() : saved
    setResolved(calc)
    applyTheme(calc)

    // Listen for system theme changes
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      if (saved === 'system') {
        const next = e.matches ? 'dark' : 'light'
        setResolved(next)
        applyTheme(next)
      }
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const setMode = (m: ThemeMode) => {
    setModeState(m)
    localStorage.setItem(STORAGE_KEY, m)
    const calc = m === 'system' ? getSystemTheme() : m
    setResolved(calc)
    applyTheme(calc)
  }

  const toggle = () => setMode(resolved === 'dark' ? 'light' : 'dark')

  return (
    <ThemeContext.Provider value={{ mode, resolved, isDark: resolved === 'dark', setMode, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() { return useContext(ThemeContext) }
