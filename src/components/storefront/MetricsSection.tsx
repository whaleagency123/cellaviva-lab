'use client'
import { useT, useLanguage } from '@/lib/i18n'
import { useEffect, useRef } from 'react'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { CountUp } from '@/components/ui/count-up'
import type { MetricItem } from '@/types'
import { DEFAULT_SETTINGS } from '@/lib/defaults'

const BAR_COLORS = ['bg-[var(--sf-primary)]', 'bg-[var(--sf-primary-dark)]', 'bg-[#4a8ab8]']

interface MetricsSectionProps {
  metrics?: MetricItem[]
}

function AnimatedBar({ value, color }: { value: number; color: string }) {
  const barRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = barRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setTimeout(() => el.classList.add('bar-ready'), 200); obs.disconnect() }
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div className="mt-2.5 h-2 w-full bg-[#edebe8] rounded-full overflow-hidden">
      <div ref={barRef} className={`h-full ${color} rounded-full bar-animate`} style={{ '--bar-w': `${value}%` } as React.CSSProperties} />
    </div>
  )
}

export function MetricsSection({ metrics = DEFAULT_SETTINGS.metrics }: MetricsSectionProps) {
  const t = useT()
  const { locale } = useLanguage()
  const ar = locale === 'ar'

  return (
    <section id="results" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal direction="left">
            <div className="relative">
              <div className="aspect-[4/5] rounded-[var(--sf-radius-card)] overflow-hidden bg-[var(--sf-accent-light)] img-zoom">
                <img src="/images/product-application.jpg" alt="Stemuvita" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-[var(--sf-primary-dark)] text-center p-8">
                    <div className="text-8xl mb-4" style={{ animation: 'float 6s ease-in-out infinite' }}>🌿</div>
                    <p className="font-semibold text-xl">{ar ? t('metrics.pureLabel') : 'Pure Plant Power'}</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-5 -right-5 bg-[var(--sf-dark-section)] text-white rounded-2xl px-6 py-4 shadow-xl" style={{ animation: 'float-badge 3s ease-in-out infinite' }}>
                <p className="text-3xl font-bold" style={{ fontFamily: 'var(--sf-font-display)' }}>4.9★</p>
                <p className="text-xs text-white/65 mt-0.5">{ar ? t('metrics.ratingLabel') : 'Average Rating'}</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <p className="text-[var(--sf-primary)] font-semibold text-sm uppercase tracking-widest mb-3">Clinical Study Results</p>
            <h2 className="text-4xl sm:text-5xl font-light text-[var(--sf-text)] leading-tight mb-6" style={{ fontFamily: 'var(--sf-font-display)' }}>
              Real Results,<br />Healthier Scalp
            </h2>
            <p className="text-[var(--sf-text-muted)] text-lg mb-10 leading-relaxed">
              In an independent 8-week clinical study with 200 participants, Stemuvita™ delivered measurable improvements across every key scalp health metric.
            </p>
            <div className="space-y-7">
              {metrics.map((m, i) => (
                <div key={i} className="flex items-start gap-5">
                  <div className="flex-shrink-0 rounded-2xl bg-[var(--sf-accent-light)] flex items-center justify-center px-3 py-3 min-w-[5.5rem]">
                    <span className="text-2xl font-bold text-[var(--sf-primary-dark)]">
                      <CountUp end={m.value} suffix="%" duration={1600 + i * 150} />
                    </span>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-[var(--sf-text-muted)] font-medium leading-snug">{m.label}</p>
                    <AnimatedBar value={m.value} color={BAR_COLORS[i % BAR_COLORS.length]} />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 text-xs text-gray-400">{ar ? t('metrics.disclaimer') : '*Results based on independent 8-week double-blind study. Individual results may vary.'}</p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
