'use client'
import { useT, useLanguage } from '@/lib/i18n'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { StorefrontIcon } from './StorefrontIcon'
import type { FAQItem } from '@/types'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { DEFAULT_SETTINGS } from '@/lib/defaults'

interface FAQAccordionProps {
  items: FAQItem[]
  sfIconFaq?: string
}

export function FAQAccordion({ items, sfIconFaq = DEFAULT_SETTINGS.sfIconFaq }: FAQAccordionProps) {
  const t = useT()
  const { locale } = useLanguage()
  const ar = locale === 'ar'

  const [open, setOpen] = useState<string | null>(null)

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <ScrollReveal className="text-center mb-14">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[var(--sf-accent-light)] rounded-2xl mb-4">
            <StorefrontIcon name={sfIconFaq} className="text-[var(--sf-primary)]" style={{ width: 'var(--sf-icon-size)', height: 'var(--sf-icon-size)' }} />
          </div>
          <p className="text-[var(--sf-primary)] font-semibold text-sm uppercase tracking-widest mb-3">
            Got Questions?
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-[var(--sf-text)]">
            {ar ? t('faq.heading') : 'Frequently Asked Questions'}
          </h2>
        </ScrollReveal>

        {/* Items — staggered */}
        <div className="space-y-3">
          {items.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 70} direction="up">
              <div
                className={`border rounded-2xl overflow-hidden transition-colors duration-200 ${
                  open === item.id ? 'border-[var(--sf-primary)]' : 'border-gray-200'
                }`}
              >
                <button
                  onClick={() => setOpen(open === item.id ? null : item.id)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[var(--sf-bg)] transition-colors"
                  aria-expanded={open === item.id}
                >
                  <span className="font-semibold text-[var(--sf-text)] pr-4">{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[var(--sf-primary)] flex-shrink-0 transition-transform duration-300 ${
                      open === item.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-400 ease-in-out ${
                    open === item.id ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                  style={{ transition: 'max-height 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.25s ease' }}
                >
                  <p className="px-6 pb-5 text-gray-600 leading-relaxed text-sm">
                    {item.answer}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom CTA */}
        <ScrollReveal delay={100} className="mt-12 bg-[var(--sf-bg)] rounded-[var(--sf-radius-card)] p-8 text-center">
          <p className="font-bold text-gray-900 mb-1">Still have questions?</p>
          <p className="text-sm text-gray-500 mb-4">
            Our team is happy to help — we typically respond in under 2 hours.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-[var(--sf-primary)] text-white rounded-[var(--sf-radius-btn)] px-6 py-3 text-sm font-semibold hover:bg-[var(--sf-primary-dark)] transition-colors"
          >
            Contact Support
          </a>
        </ScrollReveal>
      </div>
    </section>
  )
}
