'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Menu, X } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { CartDrawer } from './CartDrawer'
import { StorefrontIcon } from './StorefrontIcon'
import { AuthButton } from './AuthButton'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeSwitcher } from './ThemeSwitcher'
import { useLanguage, useT } from '@/lib/i18n'
import type { NavLink } from '@/types'
import { DEFAULT_SETTINGS } from '@/lib/defaults'

interface HeaderProps {
  navLinks?: NavLink[]
  sfIconCart?: string
}

export function Header({ navLinks = DEFAULT_SETTINGS.navLinks, sfIconCart = 'ShoppingBag' }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const t = useT()
  const { isRTL } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const { openCart, itemCount } = useCartStore()
  const router = useRouter()
  const count = itemCount()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = searchQuery.trim()
    if (!q) return
    setSearchOpen(false)
    setSearchQuery('')
    router.push(`/products?q=${encodeURIComponent(q)}`)
  }

  return (
    <>
      <header
        className="sticky top-0 z-50 bg-white/96 backdrop-blur-md border-b border-[var(--sf-border)]/60 shadow-sm"
        style={{ animation: 'hero-fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/Gemini_Generated_Image_-removebg-preview.png"
                alt="CELLAVIVA"
                width={62}
                height={54}
                className="transition-transform duration-200 group-hover:scale-105 dark:brightness-0 dark:invert"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-7">
              {navLinks.map((l, i) => {
                // Translate nav labels when in Arabic
                const arLabel: Record<string, string> = {
                  'Shop All': t('nav.shopAll'),
                  'The Science': t('nav.theScience'),
                  'Subscribe & Save': t('nav.subscribeSave'),
                  'Take the Quiz': t('nav.takeTheQuiz'),
                  'Blog': t('nav.blog'),
                  'About': t('nav.about'),
                  'Contact': t('nav.contact'),
                }
                const label = isRTL ? (arLabel[l.label] || l.label) : l.label
                return (
                  <Link key={l.href} href={l.href} className="link-underline text-sm font-medium text-[var(--sf-text-muted)] hover:text-[var(--sf-text)] transition-colors" style={{ animationDelay: `${i * 60 + 100}ms` }}>
                    {label}
                  </Link>
                )
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <LanguageSwitcher />
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-[var(--sf-text-muted)] hover:text-[var(--sf-text)] transition-colors hover:scale-110 transform duration-150" aria-label={t('nav.search')}>
                <Search style={{ width: 'var(--sf-icon-size)', height: 'var(--sf-icon-size)' }} />
              </button>
              <AuthButton />
              <button onClick={openCart} className="relative p-2 text-[var(--sf-text-muted)] hover:text-[var(--sf-text)] transition-colors hover:scale-110 transform duration-150" aria-label="Cart">
                <StorefrontIcon name={sfIconCart} style={{ width: 'var(--sf-icon-size)', height: 'var(--sf-icon-size)' }} />
                {mounted && count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[var(--sf-primary)] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse-glow">
                    {count}
                  </span>
                )}
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-[var(--sf-text-muted)] hover:text-[var(--sf-text)] transition-colors" aria-label="Menu">
                <span className={`transition-transform duration-200 inline-block ${mobileOpen ? 'rotate-90' : 'rotate-0'}`}>
                  {mobileOpen
                    ? <X style={{ width: 'var(--sf-icon-size)', height: 'var(--sf-icon-size)' }} />
                    : <Menu style={{ width: 'var(--sf-icon-size)', height: 'var(--sf-icon-size)' }} />}
                </span>
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${searchOpen ? 'max-h-16 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
            <form onSubmit={handleSearch}>
              <input
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('products.searchPlaceholder')}
                autoFocus={searchOpen}
                className="w-full border border-[var(--sf-border)] rounded-full px-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--sf-primary)]"
              />
            </form>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className={`md:hidden border-t border-[var(--sf-border)]/60 bg-white px-4 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? 'max-h-72 py-4 opacity-100' : 'max-h-0 opacity-0'}`}>
          {navLinks.map((l) => {
            const arLabel: Record<string, string> = {
              'Shop All': t('nav.shopAll'), 'The Science': t('nav.theScience'),
              'Subscribe & Save': t('nav.subscribeSave'),
              'Take the Quiz': t('nav.takeTheQuiz'), 'Blog': t('nav.blog'),
              'About': t('nav.about'), 'Contact': t('nav.contact'),
            }
            return (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-[var(--sf-text-muted)] hover:text-[var(--sf-text)] hover:bg-[var(--sf-bg)] rounded-xl px-4 py-2.5 transition-colors">
                {isRTL ? (arLabel[l.label] || l.label) : l.label}
              </Link>
            )
          })}
        </div>
      </header>

      <CartDrawer />
    </>
  )
}
