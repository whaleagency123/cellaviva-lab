'use client'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { DEFAULT_SETTINGS } from '@/lib/defaults'
import { useT, useLanguage } from '@/lib/i18n'

interface HeroSectionProps {
  heading?: string
  subtext?: string
  image?: string
  video?: string
  badgeText?: string
  primaryBtnText?: string
  primaryBtnHref?: string
  secondaryBtnText?: string
  secondaryBtnHref?: string
  marqueeItems?: string[]
  elemZ?: Record<string, number>
}

export function HeroSection({
  heading = DEFAULT_SETTINGS.heroHeading,
  subtext = DEFAULT_SETTINGS.heroSubtext,
  image = DEFAULT_SETTINGS.heroImage,
  video = '',
  badgeText = DEFAULT_SETTINGS.heroBadgeText,
  primaryBtnText = DEFAULT_SETTINGS.heroPrimaryBtnText,
  primaryBtnHref = DEFAULT_SETTINGS.heroPrimaryBtnHref,
  secondaryBtnText = DEFAULT_SETTINGS.heroSecondaryBtnText,
  secondaryBtnHref = DEFAULT_SETTINGS.heroSecondaryBtnHref,
  marqueeItems = DEFAULT_SETTINGS.marqueeItems,
  elemZ,
}: HeroSectionProps) {
  const t = useT()
  const { locale } = useLanguage()
  const ar = locale === 'ar'
  const hasMedia = !!(video || image)

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-[var(--sf-bg)] overflow-hidden min-h-[92vh] flex items-center">
        <div className="pointer-events-none absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[var(--sf-accent-light)]/50 blur-[120px]" style={{ zIndex: elemZ?.bg ?? 0 }} />
        <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[var(--sf-primary)]/8 blur-[100px]" style={{ zIndex: elemZ?.bg ?? 0 }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left: Text ────────────────────────────────────────────── */}
          <div style={{ position: 'relative', zIndex: elemZ?.text ?? 'auto' }}>
            <div className="animate-hero-badge inline-flex items-center gap-2 border border-[var(--sf-border)] rounded-full px-4 py-1.5 text-[11px] font-semibold text-[var(--sf-text-muted)] uppercase tracking-[0.18em] mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--sf-primary)] inline-block" />
              {ar ? t('hero.badge') : (badgeText || t('hero.badge'))}
            </div>

            <h1
              className="animate-hero-heading text-5xl sm:text-6xl lg:text-7xl font-light text-[var(--sf-text)] leading-[1.08] tracking-tight mb-6"
              style={{ fontFamily: 'var(--sf-font-display)' }}
            >
              {ar ? t('hero.heading') : (heading || t('hero.heading'))}
            </h1>

            <p className="animate-hero-sub text-base sm:text-lg text-[var(--sf-text-muted)] leading-relaxed mb-10 max-w-md">
              {ar ? t('hero.subtext') : (subtext || t('hero.subtext'))}
            </p>

            <div className="animate-hero-btns flex flex-wrap gap-3 mb-12">
              <Link
                href={primaryBtnHref}
                className="inline-flex items-center gap-2 bg-[var(--sf-primary)] text-white font-semibold px-8 py-3.5 rounded-[var(--sf-radius-btn)] text-sm hover:bg-[var(--sf-primary-dark)] transition-colors duration-300"
              >
                {ar ? t('hero.primaryBtn') : (primaryBtnText || t('hero.primaryBtn'))}
              </Link>
              <Link
                href={secondaryBtnHref}
                className="inline-flex items-center gap-2 border border-[var(--sf-border)] text-[var(--sf-text)] font-semibold px-8 py-3.5 rounded-[var(--sf-radius-btn)] text-sm hover:border-[var(--sf-primary)] hover:text-[var(--sf-primary)] transition-colors duration-300 bg-white"
              >
                {ar ? t('hero.secondaryBtn') : (secondaryBtnText || t('hero.secondaryBtn'))} {ar ? '←' : '→'}
              </Link>
            </div>

            <div className="animate-hero-stats flex items-center gap-5">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm text-[var(--sf-text-muted)]">
                <strong className="text-[var(--sf-text)]">4.9/5</strong> from 1,247 reviews
              </span>
              <span className="h-4 w-px bg-[var(--sf-border)]" />
              <span className="text-sm text-[var(--sf-text-muted)]">
                <strong className="text-[var(--sf-text)]">12,000+</strong> customers
              </span>
            </div>
          </div>

          {/* ── Right: Product Visual ──────────────────────────────────── */}
          <div className="animate-hero-image flex justify-center lg:justify-end" style={{ position: 'relative', zIndex: elemZ?.card ?? 'auto' }}>
            <div className="relative w-full max-w-[420px]">
              <div className="relative rounded-[2.5rem] overflow-hidden bg-white shadow-[0_32px_80px_-16px_rgba(198,123,92,0.18)] border border-[var(--sf-border)]/50">
                <div className="relative aspect-[4/5] bg-gradient-to-br from-[var(--sf-bg)] to-[var(--sf-accent-light)]">

                  {/* Fallback visual — always present but underneath media */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-10" style={{ zIndex: 0 }}>
                    <div className="text-8xl" style={{ animation: 'float 6s ease-in-out infinite' }}>🌿</div>
                    <div className="text-center">
                      <p className="text-3xl font-light text-[var(--sf-primary-dark)] tracking-tight" style={{ fontFamily: 'var(--sf-font-display)' }}>Stemuvita™</p>
                      <p className="text-[11px] text-[var(--sf-primary)] mt-1 tracking-widest uppercase">Hair Cleanse</p>
                    </div>
                    <div className="absolute inset-8 rounded-full border border-dashed border-[var(--sf-primary)]/20" style={{ animation: 'spin-slow 30s linear infinite' }} />
                  </div>

                  {/* Video — lazy loaded, preload=none to not block page */}
                  {video && (
                    <video
                      key={video}
                      src={video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="none"
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ zIndex: 2 }}
                    />
                  )}

                  {/* Image — shown when no video, hidden if video present */}
                  {image && !video && (
                    <img
                      key={image}
                      src={image}
                      alt="Product"
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ zIndex: 1 }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  )}
                </div>

                <div className="px-6 py-5 bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[var(--sf-text)] text-sm">Stemuvita™ System</p>
                      <p className="text-xs text-[var(--sf-text-muted)] mt-0.5">Plant-Based · Sulfate-Free</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[var(--sf-primary)]">€49</p>
                      <p className="text-xs text-gray-400 line-through">€100</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-lg px-4 py-3 border border-[var(--sf-border)]/50" style={{ animation: 'float-badge 4s ease-in-out infinite', zIndex: elemZ?.badge1 ?? 20 }}>
                <p className="text-xs font-bold text-[var(--sf-text)] uppercase tracking-wide">Clinically Proven</p>
                <div className="flex gap-0.5 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-[var(--sf-primary)] text-white rounded-2xl shadow-lg px-4 py-3" style={{ animation: 'float-badge 4s ease-in-out 2s infinite', zIndex: elemZ?.badge2 ?? 20 }}>
                <p className="text-2xl font-light" style={{ fontFamily: 'var(--sf-font-display)' }}>94%</p>
                <p className="text-[10px] text-white/80 leading-tight mt-0.5">See results<br />in 4 weeks</p>
              </div>
            </div>
          </div>
        </div>

        <div className="animate-hero-stats absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--sf-text-muted)]/60" style={{ zIndex: elemZ?.scroll ?? 10 }}>
          <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-[var(--sf-text-muted)]/40 to-transparent" />
        </div>
      </section>

      {/* ── MARQUEE STRIP ────────────────────────────────────────────────── */}
      <div className="bg-[var(--sf-dark-section)] text-white py-3.5 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, rep) => (
            <span key={rep} className="flex items-center gap-0">
              {marqueeItems.map((item) => (
                <span key={item} className="flex items-center gap-6 px-6">
                  <span className="text-xs font-medium tracking-[0.14em] uppercase text-white/80">{item}</span>
                  <span className="text-[var(--sf-primary)] text-sm">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </>
  )
}
