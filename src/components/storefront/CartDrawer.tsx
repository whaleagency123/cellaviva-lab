'use client'
import { useState, useEffect } from 'react'
import { X, Plus, Minus, ShoppingBag, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { Product } from '@/types'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, addItem, total } = useCartStore()

  // Fetch live products for upsell suggestions
  const [allProducts, setAllProducts] = useState<Product[]>([])
  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then((data: Product[]) => Array.isArray(data) && setAllProducts(data))
      .catch(() => {})
  }, [])

  const cartIds = new Set(items.map((i) => i.product.id))
  const upsell = allProducts.filter((p) => !cartIds.has(p.id)).slice(0, 2)
  const cartTotal = total()
  const freeShippingThreshold = 50
  const remainingForFreeShip = Math.max(0, freeShippingThreshold - cartTotal)

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={closeCart} />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[var(--sf-primary)]" />
            <h2 className="text-lg font-bold text-gray-900">Your Cart ({items.length})</h2>
          </div>
          <button onClick={closeCart} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free shipping progress */}
        {items.length > 0 && (
          <div className="px-6 py-3 bg-[#f0fdf4] border-b border-[#dcfce7]">
            {remainingForFreeShip > 0 ? (
              <>
                <p className="text-xs font-semibold text-[#15803d] mb-1.5">
                  Add <span className="font-black">{formatPrice(remainingForFreeShip)}</span> more for free shipping
                </p>
                <div className="h-1.5 bg-[#dcfce7] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#22c55e] rounded-full transition-all"
                    style={{ width: `${Math.min(100, (cartTotal / freeShippingThreshold) * 100)}%` }}
                  />
                </div>
              </>
            ) : (
              <p className="text-xs font-black text-[#15803d]">🎉 You qualify for free shipping!</p>
            )}
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-200" />
              <p className="text-gray-500 font-medium">Your cart is empty</p>
              <Button onClick={closeCart} asChild>
                <Link href="/products/stemuvita">Shop Now</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-4 py-4 border-b border-gray-50">
                    <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center text-3xl">
                      🌿
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{product.title}</p>
                      <p className="text-sm text-[var(--sf-primary)] font-bold mt-0.5">
                        {formatPrice(product.salePrice ?? product.price)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQty(product.id, quantity - 1)}
                          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-semibold w-6 text-center">{quantity}</span>
                        <button
                          onClick={() => updateQty(product.id, quantity + 1)}
                          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button onClick={() => removeItem(product.id)} className="ml-auto text-xs text-red-400 hover:text-red-600">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upsell section */}
              {upsell.length > 0 && (
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Complete Your Routine</p>
                  </div>
                  <div className="space-y-3">
                    {upsell.map((product) => (
                      <div key={product.id} className="flex items-center gap-3 p-3 bg-[#f8f9f4] rounded-2xl border border-gray-100">
                        <div className="w-12 h-12 bg-[#d8f3dc] rounded-xl flex-shrink-0 flex items-center justify-center text-xl">🌿</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900 leading-snug truncate">{product.title}</p>
                          <p className="text-xs text-[var(--sf-primary)] font-semibold mt-0.5">
                            {formatPrice(product.salePrice ?? product.price)}
                          </p>
                        </div>
                        <button
                          onClick={() => addItem(product, 1)}
                          className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--sf-primary)] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-gray-100 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-bold text-gray-900">{formatPrice(cartTotal)}</span>
            </div>
            <p className="text-xs text-gray-400 text-center">Shipping & taxes calculated at checkout</p>
            <Button className="w-full" size="lg" asChild>
              <Link href="/checkout" onClick={closeCart}>Proceed to Checkout</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/cart" onClick={closeCart}>View Cart</Link>
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
