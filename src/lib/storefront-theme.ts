import 'server-only'
import { unstable_cache } from 'next/cache'
import { prisma } from './prisma'
export type { StorefrontTheme } from './storefront-theme-shared'
export { THEME_DEFAULTS } from './storefront-theme-shared'
import type { StorefrontTheme } from './storefront-theme-shared'
import { THEME_DEFAULTS } from './storefront-theme-shared'

const ICON_SIZE_MAP = { sm: '16px', md: '20px', lg: '24px' } as const
const RADIUS_BTN_MAP = { pill: '9999px', lg: '16px', md: '12px', sm: '8px', none: '0px' } as const
const RADIUS_CARD_MAP = { xl: '24px', lg: '16px', md: '12px', sm: '8px', none: '0px' } as const

export function buildCssVars(t: StorefrontTheme): string {
  const displayStack = t.sfFontDisplay === 'Cormorant Garamond'
    ? `var(--font-display,'Cormorant Garamond',serif)`
    : `'${t.sfFontDisplay}',serif`
  const bodyStack = t.sfFontBody === 'DM Sans'
    ? `var(--font-body,'DM Sans',system-ui,sans-serif)`
    : `'${t.sfFontBody}',system-ui,sans-serif`

  const lightVars = `:root{` +
    `--sf-primary:${t.sfPrimary};` +
    `--sf-primary-dark:${t.sfPrimaryDark};` +
    `--sf-accent-light:${t.sfAccentLight};` +
    `--sf-text:${t.sfText};` +
    `--sf-text-muted:${t.sfTextMuted};` +
    `--sf-bg:${t.sfBg};` +
    `--sf-border:${t.sfBorder};` +
    `--sf-dark-bg:${t.sfDarkBg};` +
    `--sf-dark-section:${t.sfDarkSection};` +
    `--sf-icon-size:${ICON_SIZE_MAP[t.sfIconSize]};` +
    `--sf-radius-btn:${RADIUS_BTN_MAP[t.sfRadiusBtn]};` +
    `--sf-radius-card:${RADIUS_CARD_MAP[t.sfRadiusCard]};` +
    `--sf-font-display:${displayStack};` +
    `--sf-font-body:${bodyStack};` +
    `}`

  // Dark mode overrides — placed after :root so they win in cascade order
  const darkVars = `:root[data-theme="dark"]{` +
    `--sf-primary:#52B788;` +
    `--sf-primary-dark:#40916C;` +
    `--sf-accent-light:#1A2E1E;` +
    `--sf-text:#E7EFE4;` +
    `--sf-text-muted:#98CBB0;` +
    `--sf-bg:#0D1A10;` +
    `--sf-border:#2E5B41;` +
    `--sf-dark-bg:#0A120C;` +
    `--sf-dark-section:#142718;` +
    `--sf-font-display:${displayStack};` +
    `--sf-font-body:${bodyStack};` +
    `}`

  return lightVars + darkVars
}

async function fetchStorefrontTheme(): Promise<StorefrontTheme> {
  try {
    const rows = await prisma.storeSettings.findMany({
      where: { key: { startsWith: 'sf' } },
    })
    const m: Record<string, string> = {}
    for (const r of rows) m[r.key] = r.value

    return {
      sfPrimary:        m.sfPrimary        ?? THEME_DEFAULTS.sfPrimary,
      sfPrimaryDark:    m.sfPrimaryDark    ?? THEME_DEFAULTS.sfPrimaryDark,
      sfAccentLight:    m.sfAccentLight    ?? THEME_DEFAULTS.sfAccentLight,
      sfText:           m.sfText           ?? THEME_DEFAULTS.sfText,
      sfTextMuted:      m.sfTextMuted      ?? THEME_DEFAULTS.sfTextMuted,
      sfBg:             m.sfBg             ?? THEME_DEFAULTS.sfBg,
      sfBorder:         m.sfBorder         ?? THEME_DEFAULTS.sfBorder,
      sfDarkBg:         m.sfDarkBg         ?? THEME_DEFAULTS.sfDarkBg,
      sfDarkSection:    m.sfDarkSection    ?? THEME_DEFAULTS.sfDarkSection,
      sfIconSize:       (m.sfIconSize as StorefrontTheme['sfIconSize'])       ?? THEME_DEFAULTS.sfIconSize,
      sfRadiusBtn:      (m.sfRadiusBtn as StorefrontTheme['sfRadiusBtn'])     ?? THEME_DEFAULTS.sfRadiusBtn,
      sfRadiusCard:     (m.sfRadiusCard as StorefrontTheme['sfRadiusCard'])   ?? THEME_DEFAULTS.sfRadiusCard,
      sfSpacing:        (m.sfSpacing as StorefrontTheme['sfSpacing'])         ?? THEME_DEFAULTS.sfSpacing,
      sfIconGuarantee1: m.sfIconGuarantee1 ?? THEME_DEFAULTS.sfIconGuarantee1,
      sfIconGuarantee2: m.sfIconGuarantee2 ?? THEME_DEFAULTS.sfIconGuarantee2,
      sfIconGuarantee3: m.sfIconGuarantee3 ?? THEME_DEFAULTS.sfIconGuarantee3,
      sfIconFaq:        m.sfIconFaq        ?? THEME_DEFAULTS.sfIconFaq,
      sfIconCart:       m.sfIconCart       ?? THEME_DEFAULTS.sfIconCart,
      sfFontDisplay:    m.sfFontDisplay    ?? THEME_DEFAULTS.sfFontDisplay,
      sfFontBody:       m.sfFontBody       ?? THEME_DEFAULTS.sfFontBody,
      sfFontLibrary:    m.sfFontLibrary    ?? THEME_DEFAULTS.sfFontLibrary,
    }
  } catch {
    return THEME_DEFAULTS
  }
}

export const getStorefrontTheme = unstable_cache(
  fetchStorefrontTheme,
  ['storefront-theme'],
  { revalidate: 60 }
)
