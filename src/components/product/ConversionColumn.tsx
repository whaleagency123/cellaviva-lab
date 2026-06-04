'use client'
import { useState } from 'react'
import { Star, Truck, Shield, RotateCcw, Calendar, Minus, Plus, RefreshCw, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cart'
import { formatPrice, getDeliveryWindow } from '@/lib/utils'
import type { Product } from '@/types'

interface ConversionColumnProps {
  product: Product
}

const CERTIFICATIONS = [
  { label: '100% Vegan', icon: '🌱' },
  { label: 'Cruelty-Free', icon: '🐰' },
  { label: 'Sulfate-Free', icon: '✅' },
  { label: 'Paraben-Free', icon: '✅' },
  { label: 'Dermatologist\nTested', icon: '👨‍⚕️' },
  { label: 'pH Balanced', icon: '⚗️' },
]

export function ConversionColumn({ product }: ConversionColumnProps) {
  const [qty, setQty] = useState(1)
  const [purchaseType, setPurchaseType] = useState<'one-time' | 'subscribe'>('subscribe')
  const { addItem } = useCartStore()

  const stockPct = Math.round((product.stock / 200) * 100)
  const basePrice = product.salePrice ?? product.price
  const subscribedPrice = Math.round(basePrice * 0.85 * 100) / 100

  const displayPrice = purchaseType === 'subscribe' ? subscribedPrice : basePrice

  return (
    <div className="sticky top-24 space-y-6">
      {/* Urgency */}
      <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm font-bold text-red-600 text-center animate-pulse">
        🔥 SELLING OUT FAST — {stockPct}% SOLD DUE TO HIGH DEMAND
      </div>

      <div>
        <h1 className="text-3xl font-black text-[#1b1b1b] mb-1">{product.title}</h1>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <span className="text-sm text-gray-500">4.9 (1,247 reviews)</span>
          <span className="text-gray-300">·</span>
          <a href="#reviews" className="text-sm text-[#2d6a4f] hover:underline">Read reviews</a>
        </div>

        <p className="text-gray-600 leading-relaxed">{product.description}</p>
      </div>

      {/* Subscribe vs One-Time toggle */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden">
        {/* One-time */}
        <button
          onClick={() => setPurchaseType('one-time')}
          className={`w-full flex items-start gap-3 p-4 text-left transition-all ${purchaseType === 'one-time' ? 'bg-gray-50 border-b border-gray-200' : 'hover:bg-gray-50 border-b border-gray-100'}`}
        >
          <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${purchaseType === 'one-time' ? 'border-[#2d6a4f] bg-[#2d6a4f]' : 'border-gray-300'}`}>
            {purchaseType === 'one-time' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">One-Time Purchase</span>
              <span className="text-sm font-bold text-gray-900">{formatPrice(basePrice)}</span>
            </div>
          </div>
        </button>

        {/* Subscribe */}
        <button
          onClick={() => setPurchaseType('subscribe')}
          className={`w-full flex items-start gap-3 p-4 text-left transition-all relative ${purchaseType === 'subscribe' ? 'bg-[#f0faf4]' : 'hover:bg-gray-50'}`}
        >
          <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${purchaseType === 'subscribe' ? 'border-[#2d6a4f] bg-[#2d6a4f]' : 'border-gray-300'}`}>
            {purchaseType === 'subscribe' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700">Subscribe &amp; Save</span>
                <span className="text-xs bg-[#52b788] text-white font-bold px-2 py-0.5 rounded-full">15% OFF</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-[#2d6a4f]">{formatPrice(subscribedPrice)}</span>
                <span className="text-xs text-gray-400 line-through ml-1">{formatPrice(basePrice)}</span>
              </div>
            </div>
            {purchaseType === 'subscribe' && (
              <div className="mt-2 space-y-1">
                {['Delivered every 30 days', 'Free priority shipping', 'Cancel or pause anytime', 'Loyalty points on every order'].map((perk) => (
                  <div key={perk} className="flex items-center gap-1.5 text-xs text-[#2d6a4f]">
                    <Check className="w-3 h-3" /> {perk}
                  </div>
                ))}
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Pricing */}
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-black text-[#2d6a4f]">
          {formatPrice(displayPrice * qty)}
        </span>
        {product.salePrice && (
          <>
            <span className="text-xl text-gray-400 line-through">
              {formatPrice(product.price * qty)}
            </span>
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {purchaseType === 'subscribe'
                ? `${Math.round(((product.price - subscribedPrice) / product.price) * 100)}% OFF`
                : `${Math.round(((product.price - basePrice) / product.price) * 100)}% OFF`}
            </span>
          </>
        )}
      </div>

      {/* Stock bar */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span>Stock remaining</span>
          <span className="text-red-500 font-semibold">{product.stock} left</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#52b788] to-[#2d6a4f] rounded-full"
            style={{ width: `${stockPct}%` }}
          />
        </div>
      </div>

      {/* Delivery window */}
      <div className="flex items-center gap-2.5 p-4 bg-[#f8f9f4] rounded-xl text-sm">
        <Calendar className="w-5 h-5 text-[#52b788] flex-shrink-0" />
        <div>
          <p className="font-semibold text-gray-800">{getDeliveryWindow()}</p>
          <p className="text-gray-500 text-xs">Order within 2 hours for this window</p>
        </div>
      </div>

      {/* Qty selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-gray-700">Quantity</span>
        <div className="flex items-center gap-3 border border-gray-200 rounded-full px-3 py-1.5">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-7 h-7 flex items-center justify-center hover:text-[#2d6a4f]"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-sm font-bold w-6 text-center">{qty}</span>
          <button
            onClick={() => setQty(qty + 1)}
            className="w-7 h-7 flex items-center justify-center hover:text-[#2d6a4f]"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        {qty >= 2 && (
          <span className="text-xs text-[#2d6a4f] font-semibold bg-[#d8f3dc] px-2.5 py-1 rounded-full">
            Bundle deal: extra 5% off
          </span>
        )}
      </div>

      {/* CTA */}
      <div className="space-y-3">
        <Button
          className="w-full"
          size="lg"
          onClick={() => addItem(product, qty)}
        >
          {purchaseType === 'subscribe' ? (
            <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Subscribe — {formatPrice(displayPrice * qty)}/mo</span>
          ) : (
            `Add to Cart — ${formatPrice(displayPrice * qty)}`
          )}
        </Button>
        <button className="w-full py-3 rounded-full bg-[#f5c518] text-[#1b1b1b] font-bold text-sm hover:bg-[#e5b000] transition-colors flex items-center justify-center gap-2">
          <span>Express Checkout</span>
          <span className="font-black italic">Pay</span>
          <span className="font-black italic text-[#009cde]">Pal</span>
        </button>
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-3 pt-2">
        {[
          { icon: Truck, label: 'Free Shipping $50+' },
          { icon: Shield, label: '30-Day Guarantee' },
          { icon: RotateCcw, label: 'Easy Refunds' },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1.5 text-center">
            <div className="w-10 h-10 rounded-xl bg-[#d8f3dc] flex items-center justify-center">
              <Icon className="w-5 h-5 text-[#2d6a4f]" />
            </div>
            <span className="text-xs text-gray-600 font-medium">{label}</span>
          </div>
        ))}
      </div>

      {/* Certification badges */}
      <div className="border-t border-gray-100 pt-5">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">Certifications</p>
        <div className="grid grid-cols-3 gap-2">
          {CERTIFICATIONS.map((cert) => (
            <div key={cert.label} className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl px-2 py-2.5 text-center">
              <span className="text-lg">{cert.icon}</span>
              <span className="text-[10px] text-gray-500 font-medium leading-tight whitespace-pre-line">{cert.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Doctor trust */}
      <div className="flex items-center gap-3 bg-blue-50 rounded-2xl p-4">
        <span className="text-2xl flex-shrink-0">👨‍⚕️</span>
        <p className="text-xs text-blue-700 leading-relaxed">
          <strong>Dermatologist Recommended.</strong> Stemuvita™ is formulated with a board-certified dermatologist and tested for scalp safety at an independent EU-accredited lab.
        </p>
      </div>
    </div>
  )
}
