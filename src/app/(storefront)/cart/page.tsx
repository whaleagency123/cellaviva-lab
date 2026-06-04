'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ShoppingBag, Minus, Plus, X, Tag, Loader2, ArrowRight, Sparkles, Truck, Shield, RefreshCw,
} from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

const UPSELL_PRODUCTS: Product[] = [
  {
    id: 'prod_stemuvita_01',
    slug: 'stemuvita',
    title: 'Stemuvita™ Hair Cleanse',
    description: 'Plant-based scalp cleanser. Reduces shedding by 91% in 8 weeks.',
    price: 100,
    salePrice: 49,
    stock: 47,
    images: [],
    featured: true,
    active: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'prod_stemuvita_serum_01',
    slug: 'stemuvita-serum',
    title: 'Stemuvita™ Scalp Serum',
    description: 'Leave-in serum that stimulates follicle health overnight.',
    price: 80,
    salePrice: 42,
    stock: 63,
    images: [],
    featured: false,
    active: true,
    createdAt: '',
    updatedAt: '',
  },
]

export default function CartPage() {
  const { items, removeItem, updateQty, addItem, total } = useCartStore()

  const [discountInput, setDiscountInput] = useState('')
  const [discountLoading, setDiscountLoading] = useState(false)
  const [discountError, setDiscountError] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string; type: string; value: number; discountAmount: number
  } | null>(null)

  const [shippingThreshold, setShippingThreshold] = useState(50)
  const [shippingFee, setShippingFee] = useState(9.99)
  useEffect(() => {
    fetch('/api/shipping-config')
      .then(r => r.json())
      .then((d: { threshold: number; fee: number }) => {
        if (d.threshold) setShippingThreshold(d.threshold)
        if (d.fee !== undefined) setShippingFee(d.fee)
      })
      .catch(() => {})
  }, [])

  const cartTotal = total()
  const shipping = cartTotal >= shippingThreshold ? 0 : shippingFee
  const discountAmount = appliedDiscount?.discountAmount ?? 0
  const orderTotal = Math.max(0, cartTotal + shipping - discountAmount)
  const freeShipRemaining = Math.max(0, shippingThreshold - cartTotal)

  const cartIds = new Set(items.map((i) => i.product.id))
  const upsell = UPSELL_PRODUCTS.filter((p) => !cartIds.has(p.id))

  async function applyDiscount() {
    if (!discountInput.trim()) return
    setDiscountLoading(true)
    setDiscountError('')
    try {
      const res = await fetch('/api/discount/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: discountInput, orderTotal: cartTotal + shipping }),
      })
      const data = await res.json()
      if (!res.ok) {
        setDiscountError(data.error ?? 'Invalid code')
        setAppliedDiscount(null)
      } else {
        setAppliedDiscount(data)
        setDiscountInput('')
      }
    } catch {
      setDiscountError('Could not validate code. Try again.')
    } finally {
      setDiscountLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f6f5f3] flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="w-20 h-20 text-gray-200 mx-auto mb-5" />
          <h1 className="text-3xl font-black text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">Add some products and come back here.</p>
          <Link href="/products" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#3a79a9] text-white font-bold text-sm hover:bg-[#266396] transition-colors">
            Shop Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f6f5f3]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Your Cart</h1>

        {/* Free shipping progress */}
        {freeShipRemaining > 0 ? (
          <div className="mb-6 bg-[#f0fdf4] border border-[#dcfce7] rounded-2xl px-5 py-4">
            <p className="text-sm font-semibold text-[#15803d] mb-2">
              Add <span className="font-black">{formatPrice(freeShipRemaining)}</span> more to get free shipping
            </p>
            <div className="h-2 bg-[#dcfce7] rounded-full overflow-hidden">
              <div className="h-full bg-[#22c55e] rounded-full transition-all" style={{ width: `${Math.min(100, (cartTotal / 50) * 100)}%` }} />
            </div>
          </div>
        ) : (
          <div className="mb-6 bg-[#f0fdf4] border border-[#dcfce7] rounded-2xl px-5 py-3">
            <p className="text-sm font-black text-[#15803d]">🎉 You qualify for free shipping!</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: items + upsell */}
          <div className="lg:col-span-2 space-y-4">
            {/* Cart items */}
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
              {items.map(({ product, quantity }, idx) => (
                <div
                  key={product.id}
                  className={`flex gap-4 p-5 ${idx > 0 ? 'border-t border-gray-100' : ''}`}
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#d8f3dc] rounded-2xl flex-shrink-0 flex items-center justify-center text-4xl">
                    🌿
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${product.slug}`}
                        className="text-sm sm:text-base font-bold text-gray-900 hover:text-[#3a79a9] transition-colors leading-snug"
                      >
                        {product.title}
                      </Link>
                      <button onClick={() => removeItem(product.id)} className="p-1 text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-base font-black text-[#3a79a9]">
                        {formatPrice((product.salePrice ?? product.price) * quantity)}
                      </span>
                      {product.salePrice && (
                        <span className="text-sm text-gray-400 line-through">{formatPrice(product.price * quantity)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex items-center gap-1 border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => updateQty(product.id, quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-gray-900">{quantity}</span>
                        <button
                          onClick={() => updateQty(product.id, quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-xs text-gray-400">each: {formatPrice(product.salePrice ?? product.price)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Upsell */}
            {upsell.length > 0 && (
              <div className="bg-white rounded-3xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <p className="text-sm font-bold text-gray-900">Complete Your Routine</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {upsell.map((product) => (
                    <div key={product.id} className="flex gap-3 p-4 bg-[#f8f9f4] rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-default">
                      <div className="w-14 h-14 bg-[#d8f3dc] rounded-xl flex-shrink-0 flex items-center justify-center text-2xl">🌿</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 leading-snug mb-1">{product.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-1 mb-2">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-black text-[#3a79a9]">{formatPrice(product.salePrice ?? product.price)}</span>
                          <button
                            onClick={() => addItem(product, 1)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#3a79a9] text-white text-xs font-bold hover:bg-[#266396] transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" /> Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: order summary */}
          <div>
            <div className="bg-white rounded-3xl shadow-sm p-6 sticky top-6 space-y-4">
              <h2 className="text-lg font-black text-gray-900">Order Summary</h2>

              {/* Discount code */}
              {appliedDiscount ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-700 font-mono">{appliedDiscount.code}</span>
                    <span className="text-xs text-emerald-600">−{formatPrice(appliedDiscount.discountAmount)}</span>
                  </div>
                  <button onClick={() => setAppliedDiscount(null)} className="p-1 text-emerald-400 hover:text-emerald-600 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <input
                      value={discountInput}
                      onChange={(e) => setDiscountInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && applyDiscount()}
                      placeholder="Promo code"
                      className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-mono uppercase placeholder:normal-case placeholder:font-sans placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3a79a9]/40 transition-shadow"
                    />
                    <button
                      onClick={applyDiscount}
                      disabled={discountLoading || !discountInput.trim()}
                      className="px-4 py-2.5 rounded-xl bg-gray-100 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {discountLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                    </button>
                  </div>
                  {discountError && <p className="mt-1.5 text-xs text-red-500">{discountError}</p>}
                </div>
              )}

              {/* Totals */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-emerald-600' : 'text-gray-800'}`}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Discount</span>
                    <span className="font-semibold">−{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-gray-100 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-black text-xl text-[#3a79a9]">{formatPrice(orderTotal)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-[#3a79a9] text-white font-bold text-sm hover:bg-[#266396] transition-colors"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                {[
                  { icon: Truck, label: 'Free ship $50+' },
                  { icon: Shield, label: 'Secure checkout' },
                  { icon: RefreshCw, label: '30-day returns' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1 text-center">
                    <Icon className="w-4 h-4 text-gray-400" />
                    <span className="text-[10px] text-gray-400 leading-tight">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
