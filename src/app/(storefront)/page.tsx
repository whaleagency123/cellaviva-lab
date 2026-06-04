import type { Metadata } from 'next'
import { HeroSection } from '@/components/storefront/HeroSection'
import { PressSection } from '@/components/storefront/PressSection'
import { TestimonialGrid } from '@/components/storefront/TestimonialGrid'
import { BeforeAfterSection } from '@/components/storefront/BeforeAfterSection'
import { ResultsTimeline } from '@/components/storefront/ResultsTimeline'
import { MetricsSection } from '@/components/storefront/MetricsSection'
import { IngredientsSection } from '@/components/storefront/IngredientsSection'
import { FeaturedProduct } from '@/components/storefront/FeaturedProduct'
import { SubscriptionSection } from '@/components/storefront/SubscriptionSection'
import { GuaranteeSection } from '@/components/storefront/GuaranteeSection'
import { ComparisonTable } from '@/components/storefront/ComparisonTable'
import { FAQAccordion } from '@/components/storefront/FAQAccordion'
import { BeforeAfterSlider } from '@/components/storefront/BeforeAfterSlider'
import { getStoreSettings } from '@/lib/settings'
import { DEFAULT_SETTINGS } from '@/lib/defaults'
import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import type { CustomSection } from '@/types'

export const revalidate = 60

const getCustomSections = unstable_cache(
  async () => prisma.storeSettings.findUnique({ where: { key: 'customSections' } }),
  ['custom-sections'],
  { revalidate: 60 }
)

export const metadata: Metadata = {
  title: 'CELLAVIVA — Plant-Based Hair Care | Clinically Proven Results',
  description: 'Powered by nature, backed by science. Stemuvita™ plant-based hair care reduces shedding by 91% in 8 weeks. Free shipping on orders over €50.',
  openGraph: {
    title: 'CELLAVIVA — Plant-Based Hair Care',
    description: 'Clinically proven plant-based hair care. Reduces shedding by 91% in 8 weeks.',
    type: 'website',
  },
}

export default async function HomePage() {
  const [s, csRow] = await Promise.all([
    getStoreSettings(),
    getCustomSections(),
  ])
  const sections = s.pageSections ?? DEFAULT_SETTINGS.pageSections
  const customSections: CustomSection[] = csRow ? (() => { try { return JSON.parse(csRow.value) } catch { return [] } })() : []

  const sectionMap: Record<string, React.ReactNode> = {
    hero: (
      <HeroSection
        heading={s.heroHeading}
        subtext={s.heroSubtext}
        image={s.heroImage}
        video={s.heroVideo}
        badgeText={s.heroBadgeText}
        primaryBtnText={s.heroPrimaryBtnText}
        primaryBtnHref={s.heroPrimaryBtnHref}
        secondaryBtnText={s.heroSecondaryBtnText}
        secondaryBtnHref={s.heroSecondaryBtnHref}
        marqueeItems={s.marqueeItems}
        elemZ={{ bg: s.heroElemBg, text: s.heroElemText, card: s.heroElemCard, badge1: s.heroElemBadge1, badge2: s.heroElemBadge2, scroll: s.heroElemScroll }}
      />
    ),
    press: <PressSection items={s.pressItems} />,
    testimonials: <TestimonialGrid testimonials={s.testimonials} />,
    beforeafter: <BeforeAfterSection cases={s.beforeAfterCases} />,
    'before-after-slider': (
      <BeforeAfterSlider
        title={s.sliderTitle}
        subtitle={s.sliderSubtitle}
        beforeImage={s.sliderBeforeImage}
        afterImage={s.sliderAfterImage}
        beforeLabel={s.sliderBeforeLabel}
        afterLabel={s.sliderAfterLabel}
      />
    ),
    timeline: <ResultsTimeline timeline={s.timeline} />,
    metrics: <MetricsSection metrics={s.metrics} />,
    ingredients: <IngredientsSection ingredients={s.ingredients} />,
    'featured-product': <FeaturedProduct />,
    subscription: <SubscriptionSection perks={s.subscriptionPerks} />,
    guarantee: (
      <GuaranteeSection
        sfIconGuarantee1={s.sfIconGuarantee1}
        sfIconGuarantee2={s.sfIconGuarantee2}
        sfIconGuarantee3={s.sfIconGuarantee3}
        guaranteeCards={s.guaranteeCards}
      />
    ),
    comparison: <ComparisonTable rows={s.comparisonRows} />,
    faq: <FAQAccordion items={s.faqItems} sfIconFaq={s.sfIconFaq} />,
  }

  return (
    <>
      {sections
        .filter(sec => sec.visible && sectionMap[sec.id])
        .map(sec => (
          <div
            key={sec.id}
            data-section={sec.id}
            style={sec.zIndex !== undefined ? { position: 'relative', zIndex: sec.zIndex } : undefined}
          >
            {sectionMap[sec.id]}
          </div>
        ))}
      {customSections
        .filter(cs => cs.visible)
        .sort((a, b) => a.order - b.order)
        .map(cs => (
          <div
            key={cs.id}
            data-section={cs.id}
            dangerouslySetInnerHTML={{ __html: cs.html }}
          />
        ))}
    </>
  )
}
