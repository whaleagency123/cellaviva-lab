export interface StorefrontTheme {
  sfPrimary: string
  sfPrimaryDark: string
  sfAccentLight: string
  sfText: string
  sfTextMuted: string
  sfBg: string
  sfBorder: string
  sfDarkBg: string
  sfDarkSection: string
  sfIconSize: 'sm' | 'md' | 'lg'
  sfRadiusBtn: 'pill' | 'lg' | 'md' | 'sm' | 'none'
  sfRadiusCard: 'xl' | 'lg' | 'md' | 'sm' | 'none'
  sfSpacing: 'compact' | 'default' | 'comfortable'
  sfIconGuarantee1: string
  sfIconGuarantee2: string
  sfIconGuarantee3: string
  sfIconFaq: string
  sfIconCart: string
  sfFontDisplay: string
  sfFontBody: string
  sfFontLibrary: string
}

export const THEME_DEFAULTS: StorefrontTheme = {
  sfPrimary:        '#3a79a9',
  sfPrimaryDark:    '#266396',
  sfAccentLight:    '#d1dee6',
  sfText:           '#222222',
  sfTextMuted:      '#544d43',
  sfBg:             '#f6f5f3',
  sfBorder:         '#dad7d4',
  sfDarkBg:         '#111111',
  sfDarkSection:    '#222222',
  sfIconSize:       'md',
  sfRadiusBtn:      'pill',
  sfRadiusCard:     'xl',
  sfSpacing:        'default',
  sfIconGuarantee1: 'Shield',
  sfIconGuarantee2: 'RefreshCw',
  sfIconGuarantee3: 'Headphones',
  sfIconFaq:        'HelpCircle',
  sfIconCart:       'ShoppingBag',
  sfFontDisplay:    'Cormorant Garamond',
  sfFontBody:       'DM Sans',
  sfFontLibrary:    '[]',
}
