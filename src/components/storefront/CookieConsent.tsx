'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cookie, X, Check, Settings2, ChevronDown, ChevronUp } from 'lucide-react'
import { useT } from '@/lib/i18n'

const COOKIE_KEY = 'cellaviva_cookie_consent'

interface ConsentState {
  necessary:   boolean // always true
  analytics:   boolean
  marketing:   boolean
  preferences: boolean
}

function getStored(): ConsentState | null {
  try {
    const raw = localStorage.getItem(COOKIE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function CookieConsent() {
  const t = useT()
  const [visible,  setVisible]  = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [consent,  setConsent]  = useState<ConsentState>({
    necessary: true, analytics: false, marketing: false, preferences: false,
  })

  useEffect(() => {
    if (!getStored()) setVisible(true)
  }, [])

  function save(c: ConsentState) {
    localStorage.setItem(COOKIE_KEY, JSON.stringify(c))
    setVisible(false)
    // Signal to analytics scripts etc.
    window.dispatchEvent(new CustomEvent('cookie-consent', { detail: c }))
  }

  function acceptAll()  { save({ necessary: true, analytics: true,  marketing: true,  preferences: true  }) }
  function rejectAll()  { save({ necessary: true, analytics: false, marketing: false, preferences: false }) }
  function saveCustom() { save(consent) }

  if (!visible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6 sm:w-[420px] z-[9999]">
      <div className="bg-white border border-[var(--sf-border)] rounded-2xl shadow-2xl overflow-hidden">

        {/* Main banner */}
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--sf-accent-light)] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Cookie className="w-5 h-5 text-[var(--sf-primary)]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-[var(--sf-text)] mb-1">{t("cookie.title")}</h3>
              <p className="text-xs text-[var(--sf-text-muted)] leading-relaxed">
                {t("cookie.desc")}{' '}
                <Link href="/privacy" className="text-[var(--sf-primary)] hover:underline">{t("cookie.learnMore")}</Link>
              </p>
            </div>
          </div>

          {/* Expandable settings */}
          {expanded && (
            <div className="mt-4 space-y-3 border-t border-[var(--sf-border)] pt-4">
              {([
                { key: 'necessary',   label: 'Necessary',    desc: 'Required for the site to work. Cannot be disabled.', locked: true },
                { key: 'analytics',   label: 'Analytics',    desc: 'Helps us understand how visitors use the site.', locked: false },
                { key: 'marketing',   label: 'Marketing',    desc: 'Used to show you relevant ads and promotions.', locked: false },
                { key: 'preferences', label: 'Preferences',  desc: 'Remembers your settings like language and region.', locked: false },
              ] as const).map(({ key, label, desc, locked }) => (
                <div key={key} className="flex items-start gap-3">
                  <button
                    disabled={locked}
                    onClick={() => !locked && setConsent(c => ({ ...c, [key]: !c[key] }))}
                    className={`mt-0.5 w-10 h-6 rounded-full flex items-center flex-shrink-0 transition-colors ${
                      consent[key] ? 'bg-[var(--sf-primary)]' : 'bg-gray-200'
                    } ${locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform mx-1 ${consent[key] ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                  <div>
                    <p className="text-xs font-semibold text-[var(--sf-text)]">{label} {locked && <span className="text-[10px] text-[var(--sf-text-muted)] font-normal">(always on)</span>}</p>
                    <p className="text-[11px] text-[var(--sf-text-muted)]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <button onClick={acceptAll}
              className="flex items-center gap-1.5 px-4 py-2 bg-[var(--sf-primary)] text-white text-xs font-bold rounded-full hover:bg-[var(--sf-primary-dark)] transition-colors">
              <Check className="w-3.5 h-3.5" /> {t('cookie.acceptAll')}
            </button>
            <button onClick={rejectAll}
              className="px-4 py-2 border border-[var(--sf-border)] text-[var(--sf-text-muted)] text-xs font-semibold rounded-full hover:border-[var(--sf-primary)] hover:text-[var(--sf-primary)] transition-colors">
              {t('cookie.rejectAll')}
            </button>
            {expanded ? (
              <button onClick={saveCustom}
                className="px-4 py-2 bg-[var(--sf-accent-light)] text-[var(--sf-primary)] text-xs font-semibold rounded-full hover:bg-[var(--sf-border)] transition-colors">
                {t('cookie.saveChoices')}
              </button>
            ) : null}
            <button onClick={() => setExpanded(e => !e)}
              className="flex items-center gap-1 ml-auto text-xs text-[var(--sf-text-muted)] hover:text-[var(--sf-primary)] transition-colors">
              <Settings2 className="w-3.5 h-3.5" />
              {expanded ? t('cookie.hide') : t('cookie.customise')}
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
