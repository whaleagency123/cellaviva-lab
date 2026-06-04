'use client'
import { useT, useLanguage } from '@/lib/i18n'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import type { TimelineStep } from '@/types'
import { DEFAULT_SETTINGS } from '@/lib/defaults'

const DOT_COLORS = ['bg-[#b0cfe0]', 'bg-[#8ab7d0]', 'bg-[var(--sf-primary)]', 'bg-[var(--sf-primary-dark)]']
const BORDER_COLORS = ['border-[#b0cfe0] bg-[#f0f6fa]', 'border-[#8ab7d0] bg-[#e8f3f9]', 'border-[var(--sf-primary)] bg-[#e0edf5]', 'border-[var(--sf-primary-dark)] bg-[var(--sf-accent-light)]']
const BADGE_COLORS = ['bg-[var(--sf-accent-light)] text-[var(--sf-primary-dark)]', 'bg-[#b0cfe0] text-[var(--sf-primary-dark)]', 'bg-[var(--sf-primary)] text-white', 'bg-[var(--sf-primary-dark)] text-white']

interface ResultsTimelineProps {
  timeline?: TimelineStep[]
}

export function ResultsTimeline({ timeline = DEFAULT_SETTINGS.timeline }: ResultsTimelineProps) {
  const t = useT()
  const { locale } = useLanguage()
  const ar = locale === 'ar'

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="text-center mb-16">
          <p className="text-xs font-bold text-[var(--sf-primary)] uppercase tracking-[0.2em] mb-3">Your Treatment Journey</p>
          <h2 className="text-4xl sm:text-5xl font-light text-[var(--sf-text)] leading-tight" style={{ fontFamily: 'var(--sf-font-display)' }}>
            What to Expect,<br className="hidden sm:block" /> Week by Week
          </h2>
          <p className="mt-4 text-[var(--sf-text-muted)] max-w-xl mx-auto text-lg">
            Unlike conventional shampoos, Stemuvita™ works at the follicle level — results build progressively and keep improving.
          </p>
        </ScrollReveal>

        <div className="relative">
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-[#b0cfe0] via-[var(--sf-primary)] to-[var(--sf-primary-dark)]" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {timeline.map((t, i) => (
              <ScrollReveal key={t.id} direction="up" delay={i * 120}>
                <div className={`relative border-2 ${BORDER_COLORS[i % BORDER_COLORS.length]} rounded-[var(--sf-radius-card)] p-6 h-full`}>
                  <div className={`hidden lg:block absolute -top-[calc(1.5rem+1px)] left-1/2 -translate-x-1/2 w-4 h-4 rounded-full ${DOT_COLORS[i % DOT_COLORS.length]} border-4 border-white shadow`} />
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${BADGE_COLORS[i % BADGE_COLORS.length]}`}>{t.week}</span>
                    <span className="text-3xl">{t.icon}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--sf-text)] mb-2">{t.title}</h3>
                  <p className="text-sm text-[var(--sf-text-muted)] leading-relaxed">{t.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <ScrollReveal direction="up" delay={100} className="mt-12 text-center">
          <p className="text-[var(--sf-text-muted)] mb-4 text-sm">Results may vary. Based on an independent 8-week study of 200 participants.</p>
          <a href="/products/stemuvita" className="inline-flex items-center gap-2 bg-[var(--sf-dark-section)] text-white px-8 py-3.5 rounded-[var(--sf-radius-btn)] font-semibold text-sm hover:bg-[var(--sf-primary)] transition-colors">
            Start My Journey →
          </a>
        </ScrollReveal>
      </div>
    </section>
  )
}
