'use client'
import { useT, useLanguage } from '@/lib/i18n'
import Link from 'next/link'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { Check } from 'lucide-react'
import { DEFAULT_SETTINGS } from '@/lib/defaults'

interface SubscriptionSectionProps {
  perks?: string[]
}

export function SubscriptionSection({ perks = DEFAULT_SETTINGS.subscriptionPerks }: SubscriptionSectionProps) {
  const t = useT()
  const { locale } = useLanguage()
  const ar = locale === 'ar'

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[var(--sf-dark-section)] to-[#333333] rounded-[2.5rem] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="p-10 sm:p-14">
              <ScrollReveal direction="left">
                <span className="inline-block bg-[var(--sf-primary)] text-white text-xs font-bold px-3.5 py-1.5 rounded-full mb-6 uppercase tracking-widest">
                  {ar ? t('subscription.badge') : 'Subscribe & Save'}
                </span>
                <h2 className="text-4xl font-light text-white leading-tight mb-4" style={{ fontFamily: 'var(--sf-font-display)' }}>
                  {ar ? t('subscription.heading') : 'Never Run Out.'}<br />Always Save 15%.
                </h2>
                <p className="text-white/65 text-lg mb-8 leading-relaxed">
                  {ar ? t('subscription.subtext') : 'Join over 4,200 subscribers who get Stemuvita™ delivered automatically — and keep the results they\'ve worked for.'} — and keep the results they've worked for.
                </p>
                <ul className="space-y-3 mb-10">
                  {perks.map((p) => (
                    <li key={p} className="flex items-center gap-3 text-white/85 text-sm">
                      <div className="w-5 h-5 rounded-full bg-[var(--sf-primary)] flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      {p}
                    </li>
                  ))}
                </ul>
                <Link href="/subscribe" className="inline-flex items-center gap-2 bg-white text-[var(--sf-text)] font-semibold px-8 py-4 rounded-[var(--sf-radius-btn)] text-sm hover:bg-[var(--sf-accent-light)] transition-colors">
                  Shop & Save 15% →
                </Link>
                <p className="mt-3 text-xs text-white/40">
                  Use discount code <strong className="text-white/60">SAVE15</strong> at checkout for 15% off every order.
                </p>
              </ScrollReveal>
            </div>

            <div className="bg-white/8 p-10 sm:p-14 flex items-center">
              <ScrollReveal direction="right" className="w-full">
                <div className="space-y-4">
                  <div className="bg-white/8 rounded-2xl p-6 border border-white/15">
                    <div className="flex items-start justify-between mb-2">
                      <div><p className="text-white font-semibold">{ar ? t('subscription.oneTime') : 'One-Time Purchase'}</p><p className="text-white/45 text-xs mt-0.5">{ar ? t('subscription.noCommitment') : 'No commitment'}</p></div>
                      <div className="text-right"><p className="text-2xl font-bold text-white">€49</p><p className="text-white/45 text-xs">{ar ? t('subscription.perBottle') : 'per bottle'}</p></div>
                    </div>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {['Standard shipping', '30-day guarantee'].map((f) => (
                        <span key={f} className="text-xs text-white/55 bg-white/8 rounded-full px-2.5 py-1">{f}</span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[var(--sf-primary)] rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-white text-[var(--sf-text)] text-xs font-bold px-3 py-1.5 rounded-bl-2xl">{ar ? t('subscription.mostPopular') : 'MOST POPULAR'}</div>
                    <div className="flex items-start justify-between mb-2">
                      <div><p className="text-white font-semibold">{ar ? t('subscription.badge') : 'Subscribe & Save'}</p><p className="text-white/70 text-xs mt-0.5">{ar ? t('subscription.autoDelivery') : 'Delivered every 30 days'}</p></div>
                      <div className="text-right"><p className="text-2xl font-bold text-white">€41.65</p><p className="text-white/60 text-xs line-through">€49.00</p></div>
                    </div>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {['Free priority shipping', '30-day guarantee', 'Cancel anytime', 'Loyalty points'].map((f) => (
                        <span key={f} className="text-xs text-white bg-white/20 rounded-full px-2.5 py-1">{f}</span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/8 rounded-2xl p-6 border border-white/15">
                    <div className="flex items-start justify-between mb-2">
                      <div><p className="text-white font-semibold">Bundle Subscription</p><p className="text-white/45 text-xs mt-0.5">Cleanser + Serum, every 30 days</p></div>
                      <div className="text-right"><p className="text-2xl font-bold text-white">€71</p><p className="text-white/45 text-xs line-through">€91.00</p></div>
                    </div>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {['Save 22%', 'Free shipping', 'Best results'].map((f) => (
                        <span key={f} className="text-xs text-white/55 bg-white/8 rounded-full px-2.5 py-1">{f}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
