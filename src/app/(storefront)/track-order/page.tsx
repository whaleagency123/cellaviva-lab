'use client'
import { useState } from 'react'
import { Search, Package, Truck, CheckCircle, Clock, Loader2, AlertCircle, MapPin } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface TrackedOrder {
  id: string
  status: string
  paymentStatus: string
  total: number
  createdAt: string
  shippingAddress: any
  lineItems: Array<{
    id: string
    quantity: number
    price: number
    product: { id: string; title: string; images: string[] }
  }>
}

const STATUS_STEPS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'] as const

const STEP_META: Record<string, { label: string; icon: React.ElementType; date?: string }> = {
  PENDING: { label: 'Order Placed', icon: Package },
  PROCESSING: { label: 'Processing', icon: Clock },
  SHIPPED: { label: 'Shipped', icon: Truck },
  DELIVERED: { label: 'Delivered', icon: CheckCircle },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState<TrackedOrder | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setOrder(null)
    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: orderId.trim(), email: email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Could not find your order.')
      } else {
        setOrder(data)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const currentStepIndex = order ? STATUS_STEPS.indexOf(order.status as any) : -1
  const addr = order?.shippingAddress as any

  return (
    <div className="min-h-screen bg-[#f8f9f4] py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-[#52b788] font-semibold text-sm uppercase tracking-widest mb-3">Order Tracking</p>
          <h1 className="text-4xl font-black text-[#1b1b1b]">Track Your Order</h1>
          <p className="mt-3 text-gray-600">Enter your order ID and email address to check the status.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Order ID</label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Your order ID from confirmation email"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788]/40 transition-shadow"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="The email used at checkout"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788]/40 transition-shadow"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#2d6a4f] hover:bg-[#1b4332] text-white rounded-xl py-3.5 text-sm font-bold transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? 'Looking up…' : 'Track Order'}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div className="mt-6 flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl px-5 py-4">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Order result */}
          {order && (
            <div className="mt-8 border-t border-gray-100 pt-8 space-y-8">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Order ID</p>
                  <p className="font-mono text-sm font-bold text-gray-800">{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-1">Placed</p>
                  <p className="text-sm font-semibold text-gray-700">{formatDate(order.createdAt)}</p>
                </div>
              </div>

              {/* Status timeline */}
              <div>
                <p className="text-sm font-bold text-gray-900 mb-5">Shipment Status</p>
                <div className="space-y-1">
                  {STATUS_STEPS.map((step, i) => {
                    const meta = STEP_META[step]
                    const Icon = meta.icon
                    const isDone = i <= currentStepIndex
                    const isCurrent = i === currentStepIndex
                    return (
                      <div key={step} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                            isDone
                              ? isCurrent ? 'bg-[#2d6a4f] text-white ring-4 ring-[#52b788]/30' : 'bg-[#52b788] text-white'
                              : 'bg-gray-100 text-gray-300'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          {i < STATUS_STEPS.length - 1 && (
                            <div className={`w-0.5 h-6 mt-1 ${isDone ? 'bg-[#52b788]' : 'bg-gray-100'}`} />
                          )}
                        </div>
                        <div className="pt-2.5">
                          <p className={`text-sm font-bold ${isDone ? 'text-gray-900' : 'text-gray-300'}`}>
                            {meta.label}
                            {isCurrent && (
                              <span className="ml-2 text-xs font-semibold bg-[#52b788]/15 text-[#2d6a4f] rounded-full px-2 py-0.5">Current</span>
                            )}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-sm font-bold text-gray-900 mb-4">Items Ordered</p>
                <div className="space-y-3">
                  {order.lineItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-12 h-12 bg-[#d1dee6] rounded-xl flex-shrink-0 flex items-center justify-center text-lg">🌿</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{item.product.title}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-800">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                  <span className="text-sm font-bold text-gray-900">Total Paid</span>
                  <span className="text-sm font-black text-[#2d6a4f]">{formatPrice(order.total)}</span>
                </div>
              </div>

              {/* Shipping address */}
              {addr && (
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#52b788]" /> Shipping Address
                  </p>
                  <div className="bg-gray-50 rounded-2xl px-4 py-3 text-sm text-gray-600 leading-relaxed">
                    {addr.name && <p className="font-semibold text-gray-800">{addr.name}</p>}
                    {addr.address?.line1 && <p>{addr.address.line1}</p>}
                    {addr.address?.line2 && <p>{addr.address.line2}</p>}
                    {(addr.address?.city || addr.address?.postal_code) && (
                      <p>{[addr.address.city, addr.address.postal_code].filter(Boolean).join(', ')}</p>
                    )}
                    {addr.address?.country && <p>{addr.address.country}</p>}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
