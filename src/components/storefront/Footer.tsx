'use client'
import Link from 'next/link'
import { useState } from 'react'
import type { StoreSettings } from '@/types'
import { DEFAULT_SETTINGS } from '@/lib/defaults'
import { useT } from '@/lib/i18n'

const CERTIFICATIONS = [
  { icon: '🌱', label: 'Vegan' },
  { icon: '🐰', label: 'Cruelty-Free' },
  { icon: '⚗️', label: 'pH Balanced' },
  { icon: '♻️', label: 'Eco Packaging' },
]

interface FooterProps {
  settings?: StoreSettings
}

export function Footer({ settings = DEFAULT_SETTINGS }: FooterProps) {
  const [email, setEmail] = useState('')
  const t = useT()
  const [subState, setSubState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSubState('loading')
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Newsletter', email, message: 'Newsletter signup – 10% discount requested.' }),
      })
      setSubState('success')
      setEmail('')
    } catch {
      setSubState('error')
    }
  }

  return (
    <footer className="bg-[var(--sf-dark-bg)] text-gray-400">
      {/* Top trust strip */}
      <div className="border-b border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-wrap items-center justify-center gap-6 sm:gap-12">
          {[
            { icon: '🔒', text: 'Secure Checkout', sub: 'SSL encrypted' },
            { icon: '🚚', text: 'Free Shipping', sub: 'On orders $50+' },
            { icon: '↩️', text: '30-Day Guarantee', sub: 'No questions asked' },
            { icon: '🌿', text: '100% Plant-Based', sub: 'No nasty chemicals' },
          ].map((t) => (
            <div key={t.text} className="flex items-center gap-3">
              <span className="text-2xl">{t.icon}</span>
              <div>
                <p className="text-white text-sm font-semibold">{t.text}</p>
                <p className="text-gray-600 text-xs">{t.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <span
              className="text-2xl font-bold text-white"
              style={{ fontFamily: 'var(--sf-font-display)' }}
            >
              CELLA<span className="text-[var(--sf-primary)]">VIVA</span>
            </span>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-xs">
              {settings.storeTagline}
            </p>

            {/* Certifications */}
            <div className="flex gap-3 mt-5">
              {CERTIFICATIONS.map((c) => (
                <div key={c.label} className="flex flex-col items-center gap-1 bg-white/5 rounded-xl px-3 py-2 text-center">
                  <span className="text-lg">{c.icon}</span>
                  <span className="text-[10px] text-gray-600">{c.label}</span>
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="flex gap-3 mt-6">
              {[
                {
                  label: 'Instagram', href: settings.socialInstagram,
                  bg: 'hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#e6683c] hover:via-[#dc2743] hover:via-[#cc2366] hover:to-[#bc1888]',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  ),
                },
                {
                  label: 'Facebook', href: settings.socialFacebook,
                  bg: 'hover:bg-[#1877F2]',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  ),
                },
                {
                  label: 'TikTok', href: settings.socialTikTok,
                  bg: 'hover:bg-[#000000]',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.31 6.31 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
                    </svg>
                  ),
                },
                {
                  label: 'WhatsApp', href: (settings as any).storeWhatsapp ? `https://wa.me/${((settings as any).storeWhatsapp || '').replace(/\D/g,'')}` : '',
                  bg: 'hover:bg-[#25D366]',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  ),
                },
                {
                  label: 'X (Twitter)', href: settings.socialTwitter,
                  bg: 'hover:bg-[#000000]',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.736l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  ),
                },
              ].filter(s => s.href).map(({ label, href, bg, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className={`w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center text-gray-400 hover:text-white transition-all ${bg}`}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('footer.shopTitle')}</h4>
            <ul className="space-y-2.5">
              {[
                ['Stemuvita™ Cleanser', '/products/stemuvita'],
                ['Stemuvita™ Serum', '/products/stemuvita-serum'],
                ['Complete Bundle', '/products'],
                [t('nav.shopAll'), '/products'],
                [t('trackOrder.title'), '/track-order'],
                [t('footer.subscribeAndSave'), '/products/stemuvita'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm hover:text-[var(--sf-primary)] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('footer.companyTitle')}</h4>
            <ul className="space-y-2.5">
              {[
                [t('footer.aboutUs'), '/about'],
                [t('nav.theScience'), '/science'],
                [t('nav.takeTheQuiz'), '/quiz'],
                [t('nav.contact'), '/contact'],
                [t('footer.privacyPolicy'), '/privacy'],
                [t('footer.termsOfService'), '/terms'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm hover:text-[var(--sf-primary)] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              {t('footer.subscribeTitle')}
            </h4>
            <p className="text-sm text-gray-500 mb-4">{t('footer.subscribeDesc')}</p>
            {subState === 'success' ? (
              <div className="bg-green-500/15 border border-green-500/25 rounded-xl px-4 py-4 text-center">
                <p className="text-green-400 font-semibold text-sm">🎉 {t('quiz.emailSent')}</p>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t('footer.emailPlaceholder')}
                  required
                  className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[var(--sf-primary)]"
                />
                <button
                  type="submit"
                  disabled={subState === 'loading'}
                  className="w-full bg-[var(--sf-primary)] text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-[var(--sf-primary-dark)] disabled:opacity-60 transition-colors"
                >
                  {subState === 'loading' ? t('common.loading') : t('footer.subscribeBtn')}
                </button>
                {subState === 'error' && <p className="text-red-400 text-xs">{t('common.error')}</p>}
              </form>
            )}
            <p className="text-xs text-gray-700 mt-2">{t('footer.subscribeLegal')}</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            {settings.copyrightText || `© ${new Date().getFullYear()} CELLAVIVA. All rights reserved.`}
          </p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay', 'Google Pay', 'Klarna'].map((p) => (
              <span key={p} className="bg-white/8 rounded px-2 py-1 text-xs text-gray-500 font-medium">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
