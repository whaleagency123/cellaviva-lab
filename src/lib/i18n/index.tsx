'use client'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import en from '../../../messages/en.json'
import ar from '../../../messages/ar.json'

export type Locale = 'en' | 'ar'

const messages: Record<Locale, typeof en> = { en, ar }

interface LangContextType {
  locale:    Locale
  dir:       'ltr' | 'rtl'
  isRTL:     boolean
  t:         (key: string, vars?: Record<string, string | number>) => string
  setLocale: (l: Locale) => void
}

const LangContext = createContext<LangContextType>({
  locale: 'en', dir: 'ltr', isRTL: false,
  t: k => k, setLocale: () => {},
})

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const parts = path.split('.')
  let cur: unknown = obj
  for (const p of parts) {
    if (cur && typeof cur === 'object') cur = (cur as Record<string, unknown>)[p]
    else return path
  }
  return typeof cur === 'string' ? cur : path
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    const saved = (localStorage.getItem('cellaviva_locale') as Locale) ?? 'en'
    setLocaleState(saved)
    applyLocale(saved)
  }, [])

  function applyLocale(l: Locale) {
    document.documentElement.lang = l
    document.documentElement.dir  = l === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.setAttribute('data-locale', l)
  }

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    localStorage.setItem('cellaviva_locale', l)
    document.cookie = `cellaviva_locale=${l}; path=/; max-age=31536000`
    applyLocale(l)
  }, [])

  const t = useCallback((key: string, vars?: Record<string, string | number>): string => {
    let str = getNestedValue(messages[locale] as unknown as Record<string, unknown>, key)
    if (str === key) str = getNestedValue(messages.en as unknown as Record<string, unknown>, key)
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, String(v))
      })
    }
    return str
  }, [locale])

  return (
    <LangContext.Provider value={{ locale, dir: locale === 'ar' ? 'rtl' : 'ltr', isRTL: locale === 'ar', t, setLocale }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LangContext)
}

// Shorthand hook — just for translations
export function useT() {
  return useContext(LangContext).t
}
