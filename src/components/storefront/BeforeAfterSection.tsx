'use client'
import { useT, useLanguage } from '@/lib/i18n'
import { useState } from 'react'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { Star } from 'lucide-react'
import type { BeforeAfterCase } from '@/types'
import { DEFAULT_SETTINGS } from '@/lib/defaults'

const BG_BEFORE = ['from-amber-100 to-amber-200', 'from-orange-100 to-orange-200', 'from-red-100 to-red-200']
const BG_AFTER  = ['from-[#d1dee6] to-[#b0cfe0]', 'from-[#d1dee6] to-[#8ab7d0]', 'from-[#d1dee6] to-[#3a79a9]']

interface BeforeAfterSectionProps {
  cases?: BeforeAfterCase[]
}

export function BeforeAfterSection({ cases = DEFAULT_SETTINGS.beforeAfterCases }: BeforeAfterSectionProps) {
  const t = useT()
  const { locale } = useLanguage()
  const ar = locale === 'ar'
  const [active, setActive] = useState(0)
  const safeCases = cases.length > 0 ? cases : DEFAULT_SETTINGS.beforeAfterCases
  const c = safeCases[active] ?? safeCases[0]

  return (
    <section className="py-24 bg-[var(--sf-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="text-center mb-14">
          <p className="text-xs font-bold text-[var(--sf-primary)] uppercase tracking-[0.2em] mb-3">{ar ? t('beforeAfter.badge') : 'REAL RESULTS'}</p>
          <h2
            className="text-4xl sm:text-5xl font-light text-[var(--sf-text)] leading-tight"
            style={{ fontFamily: 'var(--sf-font-display)' }}
          >
            {ar ? t('beforeAfter.heading') : <>The Proof Is In<br className="hidden sm:block" /> The Before &amp; After</>}
          </h2>
          <p className="mt-4 text-[var(--sf-text-muted)] max-w-xl mx-auto">
            {ar ? t("beforeAfter.subtext") : "Verified customer results from an independent 8-week clinical study with 200 participants."}
          </p>
        </ScrollReveal>

        {/* Case selector */}
        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {safeCases.map((cs, i) => (
            <button
              key={cs.id}
              onClick={() => setActive(i)}
              className={`px-5 py-2 rounded-[var(--sf-radius-btn)] text-sm font-semibold transition-all ${active === i ? 'bg-[var(--sf-dark-section)] text-white shadow-md' : 'bg-white text-[var(--sf-text-muted)] border border-[var(--sf-border)] hover:border-[var(--sf-primary)]'}`}
            >
              {cs.name} · {cs.duration}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Before / After visual */}
          <ScrollReveal direction="left">
            <div className="grid grid-cols-2 gap-4">
              {/* Before */}
              <div className="group relative overflow-hidden rounded-[var(--sf-radius-card)] aspect-square">
                <div className={`absolute inset-0 bg-gradient-to-br ${BG_BEFORE[active % BG_BEFORE.length]} flex items-end justify-center pb-6`}>
                  <div className="text-center">
                    <div className="text-5xl mb-3">🪮</div>
                    <div className="flex gap-1 justify-center mb-1">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="w-0.5 h-6 bg-amber-400/60 rounded-full" />
                      ))}
                    </div>
                    <div className="flex gap-1 justify-center">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="w-0.5 h-4 bg-amber-400/40 rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-[var(--sf-text)]">
                  {c.beforeLabel}
                </div>
                <div className="absolute bottom-4 right-4 bg-red-100 rounded-full px-2.5 py-1 text-xs font-semibold text-red-600">
                  High Shedding
                </div>
              </div>

              {/* After */}
              <div className="group relative overflow-hidden rounded-[var(--sf-radius-card)] aspect-square">
                <div className={`absolute inset-0 bg-gradient-to-br ${BG_AFTER[active % BG_AFTER.length]} flex items-end justify-center pb-6`}>
                  <div className="text-center">
                    <div className="text-5xl mb-3">✨</div>
                    <div className="flex gap-0.5 justify-center mb-1">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="w-0.5 h-8 bg-[#266396]/50 rounded-full" />
                      ))}
                    </div>
                    <div className="flex gap-0.5 justify-center">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="w-0.5 h-6 bg-[#266396]/35 rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-[var(--sf-text)]">
                  {c.afterLabel}
                </div>
                <div className="absolute bottom-4 right-4 bg-[var(--sf-accent-light)] rounded-full px-2.5 py-1 text-xs font-semibold text-[var(--sf-primary-dark)]">
                  {c.result.split(' ').slice(0, 2).join(' ')}
                </div>
              </div>
            </div>

            {/* Stat bar */}
            <div className="mt-4 bg-white rounded-2xl p-4 border border-[var(--sf-border)]/50 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--sf-accent-light)] flex items-center justify-center text-xl flex-shrink-0">📊</div>
              <div>
                <p className="font-semibold text-[var(--sf-primary-dark)] text-lg">{c.result}</p>
                <p className="text-xs text-[var(--sf-text-muted)]">{c.concern}</p>
              </div>
            </div>
          </ScrollReveal>

          {/* Testimonial */}
          <ScrollReveal direction="right">
            <div className="bg-white rounded-[var(--sf-radius-card)] p-8 shadow-sm border border-[var(--sf-border)]/50">
              <div className="flex gap-0.5 mb-6">
                {Array.from({ length: c.stars }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-xl text-[var(--sf-text)] leading-relaxed font-light italic mb-8" style={{ fontFamily: 'var(--sf-font-display)' }}>
                "{c.quote}"
              </p>
              <div className="flex items-center gap-4 pt-6 border-t border-[var(--sf-border)]/50">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--sf-primary)] to-[var(--sf-primary-dark)] flex items-center justify-center text-white font-bold text-lg">
                  {c.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-[var(--sf-text)]">{c.name}, {c.age}</p>
                  <p className="text-sm text-[var(--sf-text-muted)]">{c.concern}</p>
                </div>
                <div className="ml-auto bg-[var(--sf-accent-light)] rounded-xl px-3 py-1.5 text-center">
                  <p className="text-xs font-bold text-[var(--sf-primary-dark)] uppercase tracking-wide">Verified</p>
                  <p className="text-xs text-[var(--sf-primary)]">{c.duration} result</p>
                </div>
              </div>
            </div>

            {/* Study callout */}
            <div className="mt-5 bg-[var(--sf-dark-section)] text-white rounded-2xl p-5 flex items-center gap-4">
              <div className="text-3xl flex-shrink-0">🔬</div>
              <div>
                <p className="font-semibold">{ar ? t("beforeAfter.clinicalStudy") : "Independent Clinical Study"}</p>
                <p className="text-sm text-white/65 mt-0.5">{ar ? t("beforeAfter.clinicalStudyDesc") : "200 participants · 8 weeks · Third-party verified results"}</p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Aggregate stat pills */}
        <ScrollReveal direction="up" delay={100} className="mt-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: '91%', label: 'Reduction in shedding', icon: '📉' },
              { value: '94%', label: 'Saw visible results', icon: '✨' },
              { value: '8 wks', label: 'Average to see results', icon: '⏱' },
              { value: '4.9★', label: 'Average rating (1,247)', icon: '⭐' },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-5 border border-[var(--sf-border)]/50 text-center shadow-sm">
                <p className="text-2xl mb-1">{s.icon}</p>
                <p className="text-2xl font-bold text-[var(--sf-primary-dark)]" style={{ fontFamily: 'var(--sf-font-display)' }}>{s.value}</p>
                <p className="text-xs text-[var(--sf-text-muted)] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
