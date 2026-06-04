'use client'
import { useT, useLanguage } from '@/lib/i18n'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { StorefrontIcon } from './StorefrontIcon'
import { DEFAULT_SETTINGS } from '@/lib/defaults'
import type { GuaranteeCard } from '@/types'

const ACCENTS = [
  'text-[var(--sf-primary)] bg-[var(--sf-accent-light)]',
  'text-[var(--sf-primary-dark)] bg-[var(--sf-accent-light)]',
  'text-purple-600 bg-purple-50',
]

interface GuaranteeSectionProps {
  sfIconGuarantee1?: string
  sfIconGuarantee2?: string
  sfIconGuarantee3?: string
  guaranteeCards?: GuaranteeCard[]
}

export function GuaranteeSection({
  sfIconGuarantee1 = DEFAULT_SETTINGS.sfIconGuarantee1,
  sfIconGuarantee2 = DEFAULT_SETTINGS.sfIconGuarantee2,
  sfIconGuarantee3 = DEFAULT_SETTINGS.sfIconGuarantee3,
  guaranteeCards = DEFAULT_SETTINGS.guaranteeCards,
}: GuaranteeSectionProps) {
  const t = useT()
  const { locale } = useLanguage()
  const ar = locale === 'ar'

  const icons = [sfIconGuarantee1, sfIconGuarantee2, sfIconGuarantee3]

  return (
    <section className="py-20 bg-[var(--sf-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Guarantee badge */}
        <ScrollReveal direction="up" className="flex justify-center mb-14">
          <div className="relative flex items-center gap-6 bg-white rounded-[2rem] px-10 py-8 shadow-sm border border-[var(--sf-border)]/50 max-w-2xl w-full">
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-[var(--sf-dark-section)] flex items-center justify-center text-center">
                <div>
                  <p className="text-white text-xs font-bold leading-tight">30-DAY</p>
                  <p className="text-[var(--sf-primary)] text-xl font-bold leading-tight">MONEY</p>
                  <p className="text-[var(--sf-primary)] text-xl font-bold leading-tight">BACK</p>
                </div>
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-[var(--sf-primary)] animate-ping opacity-15" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-[var(--sf-text)]">{ar ? t('guarantee.heading') : 'Zero Risk. Try It Free.'}</h3>
              <p className="text-[var(--sf-text-muted)] mt-1.5 text-sm leading-relaxed">
                We're so confident in Stemuvita™ that we put our money where our formula is. No results in 30 days = full refund. Simple as that.
              </p>
              <a href="/products/stemuvita" className="inline-block mt-3 text-sm font-semibold text-[var(--sf-primary)] hover:underline">
                {ar ? t('guarantee.tryRiskFree') : 'Try risk-free →'}
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Three pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guaranteeCards.map((card, i) => (
            <ScrollReveal key={card.id} direction="up" delay={i * 100}>
              <div className="bg-white rounded-[var(--sf-radius-card)] p-7 border border-[var(--sf-border)]/50 shadow-sm h-full">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${ACCENTS[i % ACCENTS.length]}`}>
                  <StorefrontIcon name={icons[i]} style={{ width: 'var(--sf-icon-size)', height: 'var(--sf-icon-size)' }} />
                </div>
                <h3 className="text-lg font-semibold text-[var(--sf-text)] mb-2">{card.title}</h3>
                <p className="text-sm text-[var(--sf-text-muted)] leading-relaxed">{card.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
