'use client'
import { useT, useLanguage } from '@/lib/i18n'
import { Check, X } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import type { ComparisonRow } from '@/types'
import { DEFAULT_SETTINGS } from '@/lib/defaults'

interface ComparisonTableProps {
  rows?: ComparisonRow[]
}

export function ComparisonTable({ rows = DEFAULT_SETTINGS.comparisonRows }: ComparisonTableProps) {
  const t = useT()
  const { locale } = useLanguage()
  const ar = locale === 'ar'

  return (
    <section className="py-24 bg-[#1b4332] text-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <ScrollReveal direction="up" className="text-center mb-14">
          <p className="text-[#52b788] font-semibold text-sm uppercase tracking-widest mb-3">
            Why Choose Cellaviva
          </p>
          <h2 className="text-4xl sm:text-5xl font-black">
            {ar ? t('comparison.heading') : 'Plant-Based vs. Harsh Chemicals'}
          </h2>
          <p className="text-white/70 mt-4 max-w-lg mx-auto">
            Don't settle for products loaded with chemicals your scalp doesn't need.
          </p>
        </ScrollReveal>

        <div className="bg-white/5 backdrop-blur rounded-3xl overflow-hidden border border-white/10">
          {/* Header */}
          <ScrollReveal direction="fade" className="grid grid-cols-3 bg-white/10">
            <div className="p-5 text-sm font-semibold text-white/60 uppercase tracking-wide">
              Feature
            </div>
            <div className="p-5 text-center">
              <span className="inline-block bg-[#52b788] text-white text-sm font-black rounded-full px-4 py-1.5">
                CELLAVIVA ✓
              </span>
            </div>
            <div className="p-5 text-center">
              <span className="inline-block bg-white/10 text-white/50 text-sm font-semibold rounded-full px-4 py-1.5">
                COMPETITORS
              </span>
            </div>
          </ScrollReveal>

          {/* Rows — staggered slide-in */}
          {rows.map((row, i) => (
            <ScrollReveal
              key={row.id ?? row.feature}
              direction="left"
              delay={i * 60}
              className={`grid grid-cols-3 border-t border-white/10 ${i % 2 === 0 ? 'bg-white/5' : ''}`}
            >
              <div className="p-4 sm:p-5 text-sm text-white/80 flex items-center">
                {row.feature}
              </div>
              <div className="p-4 sm:p-5 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-[#52b788]/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-[#52b788]" strokeWidth={3} />
                </div>
              </div>
              <div className="p-4 sm:p-5 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                  <X className="w-4 h-4 text-red-400" strokeWidth={3} />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
