import { Suspense } from 'react'
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar'
import { Header } from '@/components/storefront/Header'
import { Footer } from '@/components/storefront/Footer'
import { PluginRenderer } from '@/components/storefront/PluginRenderer'
import { AuthProvider } from '@/components/storefront/AuthProvider'
import { BuilderBridge } from '@/components/storefront/BuilderBridge'
import { ElementOverrides } from '@/components/storefront/ElementOverrides'
import { CookieConsent } from '@/components/storefront/CookieConsent'
import { PixelScripts } from '@/components/storefront/PixelScripts'
import { PWARegister } from '@/components/storefront/PWARegister'
import { FloatingWhatsApp } from '@/components/storefront/FloatingWhatsApp'
import { CurrencyLoader } from '@/components/storefront/CurrencyLoader'
import { LanguageProvider } from '@/lib/i18n'
import { ThemeProvider } from '@/lib/theme'
import { getStoreSettings } from '@/lib/settings'
import { getStorefrontTheme, buildCssVars } from '@/lib/storefront-theme'
import { prisma } from '@/lib/prisma'
import type { Plugin } from '@/types'

const PRELOADED_FONTS = ['Cormorant Garamond', 'DM Sans']

function buildGoogleFontsUrl(fonts: string[]): string | null {
  const toLoad = [...new Set(fonts)].filter(f => f && !PRELOADED_FONTS.includes(f))
  if (toLoad.length === 0) return null
  const families = toLoad
    .map(f => `family=${encodeURIComponent(f)}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400`)
    .join('&')
  return `https://fonts.googleapis.com/css2?${families}&display=swap`
}

async function loadPlugins(): Promise<Plugin[]> {
  try {
    const row = await prisma.storeSettings.findUnique({ where: { key: 'plugins' } })
    if (!row) return []
    return JSON.parse(row.value) as Plugin[]
  } catch {
    return []
  }
}

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const [s, theme, plugins] = await Promise.all([
    getStoreSettings(),
    getStorefrontTheme(),
    loadPlugins(),
  ])
  const cssVars = buildCssVars(theme)

  let libraryFontNames: string[] = []
  try { libraryFontNames = (JSON.parse(theme.sfFontLibrary) as { name: string }[]).map(f => f.name) } catch {}

  // Always include Cairo for Arabic
  const googleFontsUrl = buildGoogleFontsUrl([
    theme.sfFontDisplay,
    theme.sfFontBody,
    ...libraryFontNames,
    'Cairo',
  ])

  return (
    <ThemeProvider>
    <LanguageProvider>
      <AuthProvider>
        {googleFontsUrl && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="stylesheet" href={googleFontsUrl} />
          </>
        )}
        <style dangerouslySetInnerHTML={{ __html: cssVars }} />
        <AnnouncementBar text={s.announcementText} />
        <Header navLinks={s.navLinks} sfIconCart={theme.sfIconCart} />
        <main>{children}</main>
        <Footer settings={s} />
        <PluginRenderer plugins={plugins} />
        <ElementOverrides />
        <Suspense><BuilderBridge /></Suspense>
        <CookieConsent />
        <PixelScripts />
        <PWARegister />
        <FloatingWhatsApp />
        <CurrencyLoader />
      </AuthProvider>
    </LanguageProvider>
    </ThemeProvider>
  )
}
