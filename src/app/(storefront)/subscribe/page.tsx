'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2, Star, Shield, Truck, RefreshCw, Leaf } from 'lucide-react'
import Link from 'next/link'

const PLANS = [
  {
    slug:        'stemuvita',
    name:        'Stemuvita™ Hair Cleanse',
    desc:        'Plant-based scalp cleanser powered by botanical stem cells.',
    monthlyPrice:'$41.65',
    regularPrice:'$49.00',
    savings:     '15%',
    popular:     false,
    features: ['91% reduction in shedding in 8 weeks', 'Sulfate-free formula', 'Free priority shipping', 'Cancel anytime'],
  },
  {
    slug:        'stemuvita-serum',
    name:        'Stemuvita™ Scalp Serum',
    desc:        'Concentrated leave-in serum that stimulates follicle health overnight.',
    monthlyPrice:'$35.70',
    regularPrice:'$42.00',
    savings:     '15%',
    popular:     false,
    features: ['Overnight follicle stimulation', 'Plant stem cell technology', 'Free priority shipping', 'Cancel anytime'],
  },
  {
    slug:        'stemuvita-bundle',
    name:        'Complete Routine Bundle',
    desc:        'The full Stemuvita™ system — Hair Cleanse + Scalp Serum together for maximum results.',
    monthlyPrice:'$71.00',
    regularPrice:'$91.00',
    savings:     '22%',
    popular:     true,
    features: ['Full 8-week protocol', '2× faster results vs single product', 'Free priority shipping', 'Loyalty points every delivery', 'Pause or cancel anytime'],
  },
]

const PERKS = [
  { icon: Shield,  text: '30-Day Money-Back Guarantee' },
  { icon: Truck,   text: 'Free Priority Shipping' },
  { icon: RefreshCw, text: 'Pause or Cancel Anytime' },
  { icon: Leaf,    text: 'Early Access to New Formulas' },
]

export default function SubscribePage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [error,   setError]   = useState<string | null>(null)
  const [enabled, setEnabled] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then((d: Record<string, string>) => {
        const on = d.subscriptionsEnabled !== 'false'
        setEnabled(on)
        if (!on) router.replace('/products')
      })
      .catch(() => setEnabled(true))
  }, [router])

  async function subscribe(slug: string) {
    setLoading(slug)
    setError(null)
    try {
      const res = await fetch('/api/subscription/create', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ productSlug: slug }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Something went wrong'); return }
      window.location.href = data.url
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  if (enabled !== true) {
    return (
      <div className="min-h-screen bg-[var(--sf-bg)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--sf-primary)]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--sf-bg)]">
      {/* Hero */}
      <div className="bg-[var(--sf-dark-bg)] text-white text-center py-20 px-4">
        <div className="inline-flex items-center gap-2 border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--sf-accent-light)] inline-block" />
          Subscribe &amp; Save
        </div>
        <h1 className="text-4xl sm:text-5xl font-light mb-4" style={{ fontFamily: 'var(--sf-font-display)' }}>
          Never Run Out.<br />Always Save.
        </h1>
        <p className="text-white/60 max-w-lg mx-auto text-lg mb-10">
          Get Stemuvita™ delivered automatically every 30 days and save up to 22%.
          Pause or cancel anytime — no commitment.
        </p>
        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6">
          {PERKS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm text-white/70">
              <Icon className="w-4 h-4 text-[var(--sf-accent-light)]" />
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 text-sm text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map(plan => (
            <div
              key={plan.slug}
              className={`relative rounded-3xl border p-7 flex flex-col transition-all ${
                plan.popular
                  ? 'bg-[var(--sf-primary)] text-white border-transparent shadow-2xl scale-105'
                  : 'bg-white text-[var(--sf-text)] border-[var(--sf-border)] hover:border-[var(--sf-primary)] hover:shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-[var(--sf-primary)] text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-lg font-bold mb-1 ${plan.popular ? 'text-white' : 'text-[var(--sf-text)]'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${plan.popular ? 'text-white/75' : 'text-[var(--sf-text-muted)]'}`}>
                  {plan.desc}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className={`text-4xl font-black ${plan.popular ? 'text-white' : 'text-[var(--sf-text)]'}`}>
                    {plan.monthlyPrice}
                  </span>
                  <span className={`text-sm ${plan.popular ? 'text-white/60' : 'text-[var(--sf-text-muted)]'}`}>
                    / month
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-sm line-through ${plan.popular ? 'text-white/50' : 'text-gray-400'}`}>
                    {plan.regularPrice}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    plan.popular ? 'bg-white/20 text-white' : 'bg-[var(--sf-accent-light)] text-[var(--sf-primary)]'
                  }`}>
                    Save {plan.savings}
                  </span>
                </div>
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-white' : 'text-[var(--sf-primary)]'}`} />
                    <span className={plan.popular ? 'text-white/85' : 'text-[var(--sf-text-muted)]'}>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => subscribe(plan.slug)}
                disabled={!!loading}
                className={`w-full py-3.5 rounded-[var(--sf-radius-btn)] text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  plan.popular
                    ? 'bg-white text-[var(--sf-primary)] hover:bg-[var(--sf-accent-light)] disabled:opacity-60'
                    : 'bg-[var(--sf-primary)] text-white hover:bg-[var(--sf-primary-dark)] disabled:opacity-60'
                }`}
              >
                {loading === plan.slug
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Redirecting…</>
                  : 'Subscribe Now'}
              </button>
            </div>
          ))}
        </div>

        {/* One-time option */}
        <p className="text-center mt-10 text-sm text-[var(--sf-text-muted)]">
          Prefer a one-time purchase?{' '}
          <Link href="/products" className="text-[var(--sf-primary)] font-semibold hover:underline">
            Shop without subscription →
          </Link>
        </p>

        {/* FAQ */}
        <div className="mt-16 bg-white rounded-3xl border border-[var(--sf-border)] p-8">
          <h2 className="text-xl font-bold text-[var(--sf-text)] mb-6">Subscription FAQ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { q: 'When will I be charged?', a: 'You\'ll be charged immediately for the first month, then automatically every 30 days.' },
              { q: 'Can I cancel anytime?', a: 'Yes — cancel anytime from your account page or via our customer portal. No cancellation fees.' },
              { q: 'What if I need to skip a delivery?', a: 'You can pause your subscription from your account page. We\'ll hold your next shipment.' },
              { q: 'What if I\'m not satisfied?', a: 'We offer a 30-day money-back guarantee on your first subscription delivery.' },
            ].map(({ q, a }) => (
              <div key={q}>
                <p className="font-semibold text-[var(--sf-text)] text-sm mb-1">{q}</p>
                <p className="text-sm text-[var(--sf-text-muted)]">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
