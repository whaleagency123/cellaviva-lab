'use client'
import { useT, useLanguage } from '@/lib/i18n'
import { Star, CheckCircle2, Quote } from 'lucide-react'
import type { Testimonial } from '@/types'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { DEFAULT_SETTINGS } from '@/lib/defaults'

interface TestimonialGridProps {
  testimonials?: Testimonial[]
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
      ))}
    </div>
  )
}

export function TestimonialGrid({ testimonials = DEFAULT_SETTINGS.testimonials }: TestimonialGridProps) {
  const t = useT()
  const { locale } = useLanguage()
  const ar = locale === 'ar'

  return (
    <section className="py-24 bg-[var(--sf-bg)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-14">
          <p className="text-[var(--sf-primary)] font-semibold text-sm uppercase tracking-widest mb-3">Real Customers, Real Results</p>
          <h2 className="text-4xl sm:text-5xl font-light text-[var(--sf-text)]" style={{ fontFamily: 'var(--sf-font-display)' }}>
            {ar ? t('testimonials.heading') : 'Rave Reviews From Happy Hair Days'}
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.id} delay={i * 80} direction="up" className="card-tilt bg-white rounded-2xl p-6 border border-[var(--sf-border)]/50 shadow-sm cursor-default">
              <Quote className="w-6 h-6 text-[var(--sf-accent-light)] mb-3" />
              <StarRating rating={t.rating} />
              <p className="mt-4 text-[var(--sf-text-muted)] text-sm leading-relaxed">"{t.text}"</p>
              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--sf-primary)] to-[var(--sf-primary-dark)] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--sf-text)]">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.date}</p>
                  </div>
                </div>
                {t.verified && (
                  <div className="flex items-center gap-1 text-xs text-[var(--sf-primary)] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={200} className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-center">
          {[
            { value: '4.9', label: 'Average Rating', stars: true },
            { value: '12K+', label: 'Verified Customers', stars: false },
            { value: '94%', label: 'Report Visible Results', stars: false },
          ].map((s, i) => (
            <div key={s.value} className="flex flex-col items-center">
              {i > 0 && <div className="h-12 w-px bg-[var(--sf-border)] hidden sm:block absolute" />}
              <p className="text-5xl font-bold text-[var(--sf-text)]" style={{ fontFamily: 'var(--sf-font-display)' }}>{s.value}</p>
              {s.stars && (
                <div className="flex gap-0.5 justify-center mt-1.5 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">{s.label}</p>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  )
}
