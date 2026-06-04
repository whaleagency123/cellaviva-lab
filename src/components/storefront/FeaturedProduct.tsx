'use client'
import Link from 'next/link'
import { Star, Calendar, Shield, Truck, RotateCcw, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cart'
import { formatPrice, getDeliveryWindow } from '@/lib/utils'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import type { Product } from '@/types'

const FEATURED: Product = {
  id: 'featured-stemuvita',
  slug: 'stemuvita',
  title: 'Stemuvita™ Hair Cleanse',
  description: 'Plant-based scalp cleanser powered by botanical stem cell technology.',
  price: 100,
  salePrice: 49,
  stock: 47,
  images: ['/images/stemuvita-bottle.jpg'],
  featured: true,
  active: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export function FeaturedProduct() {
  const { addItem } = useCartStore()

  return (
    <section className="py-24 bg-[var(--sf-bg)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <ScrollReveal className="text-center mb-14">
          <p className="text-[var(--sf-primary)] font-semibold text-sm uppercase tracking-widest mb-3">
            Bestseller
          </p>
          <h2
            className="text-4xl sm:text-5xl font-light text-[var(--sf-text)]"
            style={{ fontFamily: 'var(--sf-font-display)' }}
          >
            Start Your Routine Today
          </h2>
        </ScrollReveal>

        <div className="bg-white rounded-[var(--sf-radius-card)] overflow-hidden shadow-sm border border-[var(--sf-border)]/50 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Product image — slides from left */}
            <ScrollReveal direction="left" className="bg-[var(--sf-accent-light)] flex items-center justify-center p-16 min-h-[400px]">
              <div className="text-center">
                <div
                  className="text-9xl mb-4"
                  style={{ animation: 'float 6s ease-in-out infinite' }}
                >
                  🌿
                </div>
                <p className="text-[var(--sf-primary-dark)] font-semibold text-lg">Stemuvita™</p>
                <div
                  className="mt-4 mx-auto w-16 h-16 rounded-full border-2 border-dashed border-[var(--sf-primary)]/40"
                  style={{ animation: 'spin-slow 20s linear infinite' }}
                />
              </div>
            </ScrollReveal>

            {/* Info — slides from right */}
            <ScrollReveal direction="right" className="p-8 sm:p-10">
              {/* Urgency ticker */}
              <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 rounded-full px-3 py-1.5 text-xs font-bold text-red-600 mb-5 animate-pulse-red">
                <Zap className="w-3 h-3 fill-red-500" />
                SELLING OUT FAST — 93% SOLD
              </div>

              <h3 className="text-2xl font-semibold text-[var(--sf-text)] mb-1">{FEATURED.title}</h3>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-500">(1,247 reviews)</span>
              </div>

              <p className="text-[var(--sf-text-muted)] text-sm leading-relaxed mb-6">
                {FEATURED.description} Zero harsh sulfates, no parabens — just pure plant science.
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-[var(--sf-primary)]">
                  {formatPrice(FEATURED.salePrice!)}
                </span>
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(FEATURED.price)}
                </span>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  51% OFF
                </span>
              </div>

              {/* Delivery window */}
              <div className="flex items-center gap-2 text-sm text-[var(--sf-text-muted)] mb-6 p-3 bg-[var(--sf-bg)] rounded-xl">
                <Calendar className="w-4 h-4 text-[var(--sf-primary)]" />
                <span>
                  <strong>{getDeliveryWindow()}</strong> if ordered now
                </span>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-3 mb-7">
                {[
                  { icon: Truck, label: 'Free Shipping' },
                  { icon: Shield, label: 'Safe & Natural' },
                  { icon: RotateCcw, label: '30-Day Returns' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-xs text-[var(--sf-text-muted)]">
                    <Icon className="w-3.5 h-3.5 text-[var(--sf-primary)]" />
                    {label}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  className="w-full bg-[var(--sf-primary)] text-white font-semibold px-6 py-3.5 rounded-[var(--sf-radius-btn)] text-sm hover:bg-[var(--sf-primary-dark)] transition-colors"
                  onClick={() => addItem(FEATURED)}
                >
                  Add to Cart — {formatPrice(FEATURED.salePrice!)}
                </button>
                <Link
                  href="/products/stemuvita"
                  className="block w-full text-center border border-[var(--sf-border)] text-[var(--sf-text)] font-semibold px-6 py-3.5 rounded-[var(--sf-radius-btn)] text-sm hover:bg-[var(--sf-bg)] transition-colors"
                >
                  View Full Details
                </Link>
              </div>

              <div className="mt-4 text-center text-xs text-gray-400">
                Also available: Express Checkout with PayPal
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
