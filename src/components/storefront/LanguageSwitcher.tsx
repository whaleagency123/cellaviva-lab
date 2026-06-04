'use client'
import { useLanguage } from '@/lib/i18n'

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()

  return (
    <div className="flex items-center gap-0.5 bg-[var(--sf-accent-light)]/40 rounded-full p-0.5">
      <button
        onClick={() => setLocale('en')}
        title="English"
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
          locale === 'en'
            ? 'bg-white text-[var(--sf-primary)] shadow-sm'
            : 'text-[var(--sf-text-muted)] hover:text-[var(--sf-text)]'
        }`}
      >
        🇬🇧 EN
      </button>
      <button
        onClick={() => setLocale('ar')}
        title="العربية"
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
          locale === 'ar'
            ? 'bg-white text-[var(--sf-primary)] shadow-sm'
            : 'text-[var(--sf-text-muted)] hover:text-[var(--sf-text)]'
        }`}
      >
        🇸🇦 ع
      </button>
    </div>
  )
}
