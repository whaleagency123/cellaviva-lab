import 'server-only'
import { unstable_cache } from 'next/cache'
import { prisma } from './prisma'
import { DEFAULT_SETTINGS } from './defaults'
import type { StoreSettings } from '@/types'

export { DEFAULT_SETTINGS }

function parseJSON<T>(val: string | undefined, fallback: T): T {
  if (!val) return fallback
  try { return JSON.parse(val) as T } catch { return fallback }
}

async function fetchStoreSettings(): Promise<StoreSettings> {
  try {
    const rows = await prisma.storeSettings.findMany()
    if (!rows.length) return DEFAULT_SETTINGS

    const m: Record<string, string> = {}
    for (const r of rows) m[r.key] = r.value

    return {
      primaryColor:       m.primaryColor       ?? DEFAULT_SETTINGS.primaryColor,
      accentColor:        m.accentColor        ?? DEFAULT_SETTINGS.accentColor,
      backgroundColor:    m.backgroundColor    ?? DEFAULT_SETTINGS.backgroundColor,
      textColor:          m.textColor          ?? DEFAULT_SETTINGS.textColor,

      sfPrimary:        m.sfPrimary        ?? DEFAULT_SETTINGS.sfPrimary,
      sfPrimaryDark:    m.sfPrimaryDark    ?? DEFAULT_SETTINGS.sfPrimaryDark,
      sfAccentLight:    m.sfAccentLight    ?? DEFAULT_SETTINGS.sfAccentLight,
      sfText:           m.sfText           ?? DEFAULT_SETTINGS.sfText,
      sfTextMuted:      m.sfTextMuted      ?? DEFAULT_SETTINGS.sfTextMuted,
      sfBg:             m.sfBg             ?? DEFAULT_SETTINGS.sfBg,
      sfBorder:         m.sfBorder         ?? DEFAULT_SETTINGS.sfBorder,
      sfDarkBg:         m.sfDarkBg         ?? DEFAULT_SETTINGS.sfDarkBg,
      sfDarkSection:    m.sfDarkSection    ?? DEFAULT_SETTINGS.sfDarkSection,
      sfIconSize:       (m.sfIconSize as StoreSettings['sfIconSize'])       ?? DEFAULT_SETTINGS.sfIconSize,
      sfRadiusBtn:      (m.sfRadiusBtn as StoreSettings['sfRadiusBtn'])     ?? DEFAULT_SETTINGS.sfRadiusBtn,
      sfRadiusCard:     (m.sfRadiusCard as StoreSettings['sfRadiusCard'])   ?? DEFAULT_SETTINGS.sfRadiusCard,
      sfSpacing:        (m.sfSpacing as StoreSettings['sfSpacing'])         ?? DEFAULT_SETTINGS.sfSpacing,
      sfIconGuarantee1: m.sfIconGuarantee1 ?? DEFAULT_SETTINGS.sfIconGuarantee1,
      sfIconGuarantee2: m.sfIconGuarantee2 ?? DEFAULT_SETTINGS.sfIconGuarantee2,
      sfIconGuarantee3: m.sfIconGuarantee3 ?? DEFAULT_SETTINGS.sfIconGuarantee3,
      sfIconFaq:        m.sfIconFaq        ?? DEFAULT_SETTINGS.sfIconFaq,
      sfIconCart:       m.sfIconCart       ?? DEFAULT_SETTINGS.sfIconCart,

      announcementText:   m.announcementText   ?? DEFAULT_SETTINGS.announcementText,
      marqueeItems:       parseJSON(m.marqueeItems,       DEFAULT_SETTINGS.marqueeItems),
      heroImage:          m.heroImage          ?? DEFAULT_SETTINGS.heroImage,
      heroVideo:          m.heroVideo          ?? DEFAULT_SETTINGS.heroVideo,
      heroElemBg:     m.heroElemBg     !== undefined ? (parseInt(m.heroElemBg)     || 0) : DEFAULT_SETTINGS.heroElemBg,
      heroElemText:   m.heroElemText   !== undefined ? (parseInt(m.heroElemText)   || 0) : DEFAULT_SETTINGS.heroElemText,
      heroElemCard:   m.heroElemCard   !== undefined ? (parseInt(m.heroElemCard)   || 0) : DEFAULT_SETTINGS.heroElemCard,
      heroElemBadge1: m.heroElemBadge1 !== undefined ? (parseInt(m.heroElemBadge1) || 0) : DEFAULT_SETTINGS.heroElemBadge1,
      heroElemBadge2: m.heroElemBadge2 !== undefined ? (parseInt(m.heroElemBadge2) || 0) : DEFAULT_SETTINGS.heroElemBadge2,
      heroElemScroll: m.heroElemScroll !== undefined ? (parseInt(m.heroElemScroll) || 0) : DEFAULT_SETTINGS.heroElemScroll,
      heroHeading:        m.heroHeading        ?? DEFAULT_SETTINGS.heroHeading,
      heroSubtext:        m.heroSubtext        ?? DEFAULT_SETTINGS.heroSubtext,
      heroBadgeText:      m.heroBadgeText      ?? DEFAULT_SETTINGS.heroBadgeText,
      heroPrimaryBtnText: m.heroPrimaryBtnText ?? DEFAULT_SETTINGS.heroPrimaryBtnText,
      heroPrimaryBtnHref: m.heroPrimaryBtnHref ?? DEFAULT_SETTINGS.heroPrimaryBtnHref,
      heroSecondaryBtnText: m.heroSecondaryBtnText ?? DEFAULT_SETTINGS.heroSecondaryBtnText,
      heroSecondaryBtnHref: m.heroSecondaryBtnHref ?? DEFAULT_SETTINGS.heroSecondaryBtnHref,
      navLinks:           parseJSON(m.navLinks,           DEFAULT_SETTINGS.navLinks),
      pressItems:         parseJSON(m.pressItems,         DEFAULT_SETTINGS.pressItems),
      testimonials:       parseJSON(m.testimonials,       DEFAULT_SETTINGS.testimonials),
      metrics:            parseJSON(m.metrics,            DEFAULT_SETTINGS.metrics),
      timeline:           parseJSON(m.timeline,           DEFAULT_SETTINGS.timeline),
      ingredients:        parseJSON(m.ingredients,        DEFAULT_SETTINGS.ingredients),
      subscriptionPerks:   parseJSON(m.subscriptionPerks,   DEFAULT_SETTINGS.subscriptionPerks),
      faqItems:            parseJSON(m.faqItems,            DEFAULT_SETTINGS.faqItems),
      beforeAfterCases:    parseJSON(m.beforeAfterCases,    DEFAULT_SETTINGS.beforeAfterCases),
      comparisonRows:      parseJSON(m.comparisonRows,      DEFAULT_SETTINGS.comparisonRows),
      guaranteeCards:      parseJSON(m.guaranteeCards,      DEFAULT_SETTINGS.guaranteeCards),
      storeName:           m.storeName           ?? DEFAULT_SETTINGS.storeName,
      storeTagline:        m.storeTagline        ?? DEFAULT_SETTINGS.storeTagline,
      storeEmail:          m.storeEmail          ?? DEFAULT_SETTINGS.storeEmail,
      storeVat:            m.storeVat            ?? DEFAULT_SETTINGS.storeVat,
      storePhone:          m.storePhone          ?? DEFAULT_SETTINGS.storePhone,
      storeWhatsapp:       m.storeWhatsapp       ?? DEFAULT_SETTINGS.storeWhatsapp,
      storeAddress:        m.storeAddress        ?? DEFAULT_SETTINGS.storeAddress,
      socialInstagram:     m.socialInstagram     ?? DEFAULT_SETTINGS.socialInstagram,
      socialFacebook:      m.socialFacebook      ?? DEFAULT_SETTINGS.socialFacebook,
      socialTikTok:        m.socialTikTok        ?? DEFAULT_SETTINGS.socialTikTok,
      socialTwitter:       m.socialTwitter       ?? DEFAULT_SETTINGS.socialTwitter,
      footerTagline:       m.footerTagline       ?? DEFAULT_SETTINGS.footerTagline,
      copyrightText:       m.copyrightText       ?? DEFAULT_SETTINGS.copyrightText,
      sliderTitle:         m.sliderTitle         ?? DEFAULT_SETTINGS.sliderTitle,
      sliderSubtitle:      m.sliderSubtitle      ?? DEFAULT_SETTINGS.sliderSubtitle,
      sliderBeforeImage:   m.sliderBeforeImage   ?? DEFAULT_SETTINGS.sliderBeforeImage,
      sliderAfterImage:    m.sliderAfterImage    ?? DEFAULT_SETTINGS.sliderAfterImage,
      sliderBeforeLabel:   m.sliderBeforeLabel   ?? DEFAULT_SETTINGS.sliderBeforeLabel,
      sliderAfterLabel:    m.sliderAfterLabel    ?? DEFAULT_SETTINGS.sliderAfterLabel,
      pageSections:        parseJSON(m.pageSections, DEFAULT_SETTINGS.pageSections),
      subscriptionsEnabled: m.subscriptionsEnabled ?? DEFAULT_SETTINGS.subscriptionsEnabled,
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export const getStoreSettings = unstable_cache(
  fetchStoreSettings,
  ['store-settings'],
  { revalidate: 10 }
)
