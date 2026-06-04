'use client'
import { useState, useEffect } from 'react'
import { useT, useLanguage } from '@/lib/i18n'

export function AnnouncementBar({ text }: { text?: string }) {
  const t = useT()
  const { locale } = useLanguage()
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  // Always use translated text for Arabic; use DB text only for English
  const activeText = locale === 'ar' ? t('announcement.text') : (text || t('announcement.text'))
  const items = activeText.split('•').map(s => s.trim()).filter(Boolean)

  // Reset index when language changes
  useEffect(() => { setIndex(0) }, [locale])

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex(i => (i + 1) % items.length)
        setVisible(true)
      }, 350)
    }, 3500)
    return () => clearInterval(timer)
  }, [items.length])

  return (
    <div className="relative bg-[var(--sf-dark-section)] text-white/90 text-xs sm:text-sm py-2.5 text-center font-medium tracking-widest uppercase overflow-hidden">
      <span
        className="relative z-10"
        style={{
          opacity:   visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-6px)',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
        }}
      >
        {items[index]}
      </span>
    </div>
  )
}
