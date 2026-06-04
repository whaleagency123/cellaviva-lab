'use client'
import { useState, useEffect } from 'react'
import {
  Search, Filter, Download, X, ChevronRight, Package, Truck,
  CheckCircle, Clock, RotateCcw, MessageSquare,
  Printer, MapPin, Mail, Phone, CreditCard, Tag,
  Plus, Minus, ShoppingCart, MessageCircle, Share2, Heart,
} from 'lucide-react'
import type { FulfillmentStatus } from '@/types'

// ─── Types ───────────────────────────────────────────────────────────────────
interface OrderNote { text: string; date: string }
interface TimelineEvent { status: string; date: string; note?: string }
interface OrderDetail {
  id: string; customer: string; email: string; phone: string; date: string
  status: FulfillmentStatus; payment: string; total: number; subtotal: number
  shipping: number; tax: number
  shippingAddress: { line1: string; city: string; country: string; zip: string }
  items: { name: string; qty: number; price: number; sku: string }[]
  timeline: TimelineEvent[]; notes: OrderNote[]; tags: string[]
  trackingNumber?: string; paymentMethod: string; riskLevel: 'Low' | 'Medium' | 'High'
  source?: string
}

interface Product {
  id: string; title: string; price: number; salePrice?: number | null
  stock: number; images: string[]
}

// ─── Channel config ───────────────────────────────────────────────────────────
const CHANNELS = [
  { value: 'WHATSAPP',  label: 'WhatsApp',  color: 'bg-green-500/15 text-green-400',  dot: 'bg-green-400' },
  { value: 'FACEBOOK',  label: 'Facebook',  color: 'bg-blue-500/15 text-blue-400',    dot: 'bg-blue-400' },
  { value: 'INSTAGRAM', label: 'Instagram', color: 'bg-pink-500/15 text-pink-400',    dot: 'bg-pink-400' },
  { value: 'TIKTOK',    label: 'TikTok',    color: 'bg-white/10 text-white/60',       dot: 'bg-white/60' },
  { value: 'DIRECT',    label: 'Direct',    color: 'bg-amber-500/15 text-amber-400',  dot: 'bg-amber-400' },
  { value: 'STOREFRONT',label: 'Storefront',color: 'bg-purple-500/15 text-purple-400',dot: 'bg-purple-400' },
]

function channelBadge(source?: string) {
  const ch = CHANNELS.find(c => c.value === source) ?? CHANNELS.find(c => c.value === 'STOREFRONT')!
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${ch.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${ch.dot}`} />
      {ch.label}
    </span>
  )
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_ORDERS: OrderDetail[] = [
  {
    id: 'ORD-4822', customer: 'Nina Park', email: 'nina@example.com', phone: '+1 555-0192',
    date: '2026-05-25T11:04:00Z', status: 'PENDING', payment: 'PAID', total: 49, subtotal: 49, shipping: 0, tax: 3.92,
    shippingAddress: { line1: '14 Rosewood Ave', city: 'Amsterdam', country: 'Netherlands', zip: '1012 AB' },
    items: [{ name: 'Stemuvita™ Hair Cleanse', qty: 1, price: 49, sku: 'STV-HC-001' }],
    timeline: [
      { status: 'Order placed', date: '2026-05-25 11:04' },
      { status: 'Payment confirmed', date: '2026-05-25 11:04', note: 'Stripe charge ID: ch_3Nxk...' },
    ],
    notes: [], tags: ['new-customer'], paymentMethod: 'Visa •••• 4242', riskLevel: 'Low', source: 'STOREFRONT',
  },
  {
    id: 'ORD-4821', customer: 'Sarah Miller', email: 'sarah@example.com', phone: '+1 555-0101',
    date: '2026-05-24T10:32:00Z', status: 'DELIVERED', payment: 'PAID', total: 98, subtotal: 98, shipping: 0, tax: 7.84,
    shippingAddress: { line1: '88 King St', city: 'London', country: 'UK', zip: 'EC1A 1BB' },
    items: [
      { name: 'Stemuvita™ Hair Cleanse', qty: 1, price: 49, sku: 'STV-HC-001' },
      { name: 'Stemuvita™ Scalp Serum', qty: 1, price: 49, sku: 'STV-SS-001' },
    ],
    timeline: [
      { status: 'Order placed', date: '2026-05-24 10:32' },
      { status: 'Payment confirmed', date: '2026-05-24 10:32' },
      { status: 'Shipped via DHL', date: '2026-05-24 16:45', note: 'Tracking: DHL1234567890' },
      { status: 'Delivered', date: '2026-05-25 12:30' },
    ],
    notes: [{ text: 'Customer requested gift wrapping.', date: '2026-05-24 10:35' }],
    tags: ['returning', 'vip'], paymentMethod: 'Mastercard •••• 5555', riskLevel: 'Low',
    trackingNumber: 'DHL1234567890', source: 'INSTAGRAM',
  },
  {
    id: 'ORD-4820', customer: 'James Thompson', email: 'james@example.com', phone: '+1 555-0123',
    date: '2026-05-24T09:14:00Z', status: 'SHIPPED', payment: 'PAID', total: 49, subtotal: 49, shipping: 0, tax: 3.92,
    shippingAddress: { line1: '5 Oak Lane', city: 'Berlin', country: 'Germany', zip: '10115' },
    items: [{ name: 'Stemuvita™ Hair Cleanse', qty: 1, price: 49, sku: 'STV-HC-001' }],
    timeline: [
      { status: 'Order placed', date: '2026-05-24 09:14' },
      { status: 'Shipped via PostNL', date: '2026-05-24 15:00', note: 'Tracking: PN9876543210' },
    ],
    notes: [], tags: [], paymentMethod: 'Apple Pay', riskLevel: 'Low', trackingNumber: 'PN9876543210', source: 'FACEBOOK',
  },
  {
    id: 'ORD-4819', customer: 'Amara Lawal', email: 'amara@example.com', phone: '+1 555-0145',
    date: '2026-05-23T18:55:00Z', status: 'PROCESSING', payment: 'PAID', total: 91, subtotal: 91, shipping: 0, tax: 7.28,
    shippingAddress: { line1: '22 Maple Dr', city: 'Paris', country: 'France', zip: '75001' },
    items: [
      { name: 'Stemuvita™ Scalp Serum', qty: 1, price: 42, sku: 'STV-SS-001' },
      { name: 'Stemuvita™ Hair Cleanse', qty: 1, price: 49, sku: 'STV-HC-001' },
    ],
    timeline: [
      { status: 'Order placed', date: '2026-05-23 18:55' },
      { status: 'Processing started', date: '2026-05-23 20:00' },
    ],
    notes: [], tags: ['bundle'], paymentMethod: 'Visa •••• 9999', riskLevel: 'Low', source: 'WHATSAPP',
  },
  {
    id: 'ORD-4818', customer: 'Priya Kumar', email: 'priya@example.com', phone: '+1 555-0167',
    date: '2026-05-23T14:22:00Z', status: 'PENDING', payment: 'AUTHORIZED', total: 49, subtotal: 49, shipping: 0, tax: 3.92,
    shippingAddress: { line1: '3 Birch St', city: 'Milan', country: 'Italy', zip: '20121' },
    items: [{ name: 'Stemuvita™ Hair Cleanse', qty: 1, price: 49, sku: 'STV-HC-001' }],
    timeline: [
      { status: 'Order placed', date: '2026-05-23 14:22' },
      { status: 'Payment authorized', date: '2026-05-23 14:22' },
    ],
    notes: [], tags: [], paymentMethod: 'PayPal', riskLevel: 'Medium', source: 'TIKTOK',
  },
  {
    id: 'ORD-4817', customer: 'David Reyes', email: 'david@example.com', phone: '+1 555-0189',
    date: '2026-05-22T20:40:00Z', status: 'DELIVERED', payment: 'PAID', total: 140, subtotal: 140, shipping: 0, tax: 11.2,
    shippingAddress: { line1: '17 Cedar Blvd', city: 'Madrid', country: 'Spain', zip: '28001' },
    items: [
      { name: 'Stemuvita™ Hair Cleanse', qty: 2, price: 49, sku: 'STV-HC-001' },
      { name: 'Stemuvita™ Scalp Serum', qty: 1, price: 42, sku: 'STV-SS-001' },
    ],
    timeline: [
      { status: 'Order placed', date: '2026-05-22 20:40' },
      { status: 'Delivered', date: '2026-05-24 14:00' },
    ],
    notes: [{ text: 'VIP customer — expedited.', date: '2026-05-22 21:00' }],
    tags: ['vip', 'bulk'], paymentMethod: 'Amex •••• 3714', riskLevel: 'Low', trackingNumber: 'DHL9900112233', source: 'DIRECT',
  },
]

// ─── Style constants ──────────────────────────────────────────────────────────
const statusBadge: Record<string, string> = {
  PENDING: 'bg-white/8 text-white/50', PROCESSING: 'bg-blue-500/15 text-blue-400',
  SHIPPED: 'bg-amber-500/15 text-amber-400', DELIVERED: 'bg-emerald-500/15 text-emerald-400',
  CANCELLED: 'bg-red-500/15 text-red-400',
}
const paymentBadge: Record<string, string> = {
  PENDING: 'bg-white/8 text-white/50', AUTHORIZED: 'bg-blue-500/15 text-blue-400',
  PAID: 'bg-emerald-500/15 text-emerald-400', REFUNDED: 'bg-purple-500/15 text-purple-400',
  FAILED: 'bg-red-500/15 text-red-400',
}
const riskColor: Record<string, string> = { Low: 'text-emerald-400', Medium: 'text-amber-400', High: 'text-red-400' }
const FULFILLMENT_STATUSES: FulfillmentStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
const CARD = 'bg-[#13161f] border border-white/5 rounded-2xl'
const INPUT = 'bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#4ade80] transition-colors'

// ─── New Order Drawer ─────────────────────────────────────────────────────────
function NewOrderDrawer({
  onClose, onCreated,
}: {
  onClose: () => void
  onCreated: (order: OrderDetail) => void
}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [productSearch, setProductSearch] = useState('')
  const [selectedItems, setSelectedItems] = useState<{ product: Product; qty: number }[]>([])

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('LB')
  const [postalCode, setPostalCode] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [source, setSource] = useState('WHATSAPP')
  const [shippingAmount, setShippingAmount] = useState(0)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(d => { setProducts(Array.isArray(d) ? d : []); setLoadingProducts(false) })
      .catch(() => setLoadingProducts(false))
  }, [])

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(productSearch.toLowerCase())
  )

  function addProduct(product: Product) {
    setSelectedItems(prev => {
      const exists = prev.find(i => i.product.id === product.id)
      if (exists) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { product, qty: 1 }]
    })
  }

  function setQty(productId: string, qty: number) {
    if (qty <= 0) {
      setSelectedItems(prev => prev.filter(i => i.product.id !== productId))
    } else {
      setSelectedItems(prev => prev.map(i => i.product.id === productId ? { ...i, qty } : i))
    }
  }

  const subtotal = selectedItems.reduce((s, i) => s + (i.product.salePrice ?? i.product.price) * i.qty, 0)
  const orderTotal = subtotal + shippingAmount

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (selectedItems.length === 0) { setError('Add at least one product.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName:  `${firstName} ${lastName}`.trim(),
          customerEmail: email,
          customerPhone: phone,
          address, city, country, postalCode,
          cartItems: selectedItems.map(i => ({ productId: i.product.id, quantity: i.qty })),
          shippingAmount,
          paymentMethod,
          source,
          notes: notes || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to create order')

      const newOrder: OrderDetail = {
        id: data.orderId.slice(0, 10).toUpperCase(),
        customer: data.customerName,
        email: data.customerEmail,
        phone: data.customerPhone ?? '',
        date: new Date().toISOString(),
        status: 'PENDING',
        payment: 'PENDING',
        total: data.total,
        subtotal,
        shipping: shippingAmount,
        tax: 0,
        shippingAddress: {
          line1: address,
          city,
          country,
          zip: postalCode,
        },
        items: data.items.map((i: any) => ({
          name: i.title,
          qty: i.quantity,
          price: i.price,
          sku: '',
        })),
        timeline: [{ status: 'Order created by admin', date: new Date().toLocaleString() }],
        notes: notes ? [{ text: notes, date: new Date().toLocaleString() }] : [],
        tags: ['admin-created'],
        paymentMethod,
        riskLevel: 'Low',
        source,
      }
      onCreated(newOrder)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const FINPUT = 'w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-3 py-2.5 placeholder-white/25 focus:outline-none focus:border-[#4ade80] transition-colors'
  const LABEL = 'block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider'

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-[#0f1117] border-l border-white/5 z-50 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-lg font-black text-white">New Order</h2>
            <p className="text-xs text-white/30 mt-0.5">Create a manual order from any channel</p>
          </div>
          <button onClick={onClose} className="p-2 text-white/30 hover:text-white/70">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form id="new-order-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Channel selector */}
          <div>
            <p className={LABEL}>Order Channel</p>
            <div className="grid grid-cols-3 gap-2">
              {CHANNELS.filter(c => c.value !== 'STOREFRONT').map(ch => (
                <button
                  key={ch.value}
                  type="button"
                  onClick={() => setSource(ch.value)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                    source === ch.value
                      ? `${ch.color} border-current`
                      : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${source === ch.value ? ch.dot : 'bg-white/20'}`} />
                  {ch.value === 'WHATSAPP'  && <MessageCircle className="w-3.5 h-3.5" />}
                  {ch.value === 'FACEBOOK'  && <Share2 className="w-3.5 h-3.5" />}
                  {ch.value === 'INSTAGRAM' && <Heart className="w-3.5 h-3.5" />}
                  {ch.value === 'TIKTOK'    && <span className="text-xs font-black">TT</span>}
                  {ch.value === 'DIRECT'    && <Package className="w-3.5 h-3.5" />}
                  {ch.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product picker */}
          <div>
            <p className={LABEL}>Products</p>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
              <input
                type="text"
                placeholder="Search products…"
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                className={`w-full pl-9 pr-4 py-2.5 ${INPUT}`}
              />
            </div>

            {/* Product list */}
            {loadingProducts ? (
              <p className="text-xs text-white/30 py-3 text-center">Loading products…</p>
            ) : (
              <div className="bg-white/3 border border-white/8 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                {filteredProducts.length === 0 ? (
                  <p className="text-xs text-white/30 py-4 text-center">No products found.</p>
                ) : (
                  filteredProducts.map(p => {
                    const inCart = selectedItems.find(i => i.product.id === p.id)
                    const unitPrice = p.salePrice ?? p.price
                    return (
                      <div key={p.id} className="flex items-center gap-3 px-3 py-2.5 border-b border-white/5 last:border-0 hover:bg-white/4 transition">
                        <div className="w-9 h-9 bg-[#4ade80]/10 rounded-lg flex items-center justify-center text-sm flex-shrink-0">🌿</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{p.title}</p>
                          <p className="text-xs text-white/40">€{unitPrice.toFixed(2)} · Stock: {p.stock}</p>
                        </div>
                        {inCart ? (
                          <div className="flex items-center gap-1.5">
                            <button type="button" onClick={() => setQty(p.id, inCart.qty - 1)}
                              className="w-6 h-6 rounded-lg bg-white/8 flex items-center justify-center text-white/60 hover:bg-white/15">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-bold text-white w-5 text-center">{inCart.qty}</span>
                            <button type="button" onClick={() => setQty(p.id, inCart.qty + 1)}
                              className="w-6 h-6 rounded-lg bg-[#4ade80]/20 flex items-center justify-center text-[#4ade80] hover:bg-[#4ade80]/30">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button type="button" onClick={() => addProduct(p)}
                            className="px-3 py-1.5 text-xs font-semibold bg-[#4ade80]/15 text-[#4ade80] rounded-lg hover:bg-[#4ade80]/25 transition">
                            Add
                          </button>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            )}

            {/* Selected items summary */}
            {selectedItems.length > 0 && (
              <div className="mt-3 bg-white/4 border border-white/8 rounded-xl p-3 space-y-2">
                {selectedItems.map(({ product, qty }) => (
                  <div key={product.id} className="flex justify-between items-center text-sm">
                    <span className="text-white/70 truncate">{product.title} × {qty}</span>
                    <span className="text-white font-semibold ml-2">€{((product.salePrice ?? product.price) * qty).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-white/8 pt-2 flex justify-between text-sm font-bold text-white">
                  <span>Subtotal</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Customer info */}
          <div>
            <p className={LABEL}>Customer</p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/30 mb-1">First Name *</label>
                  <input required value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Jane" className={FINPUT} />
                </div>
                <div>
                  <label className="block text-xs text-white/30 mb-1">Last Name *</label>
                  <input required value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Smith" className={FINPUT} />
                </div>
              </div>
              <div>
                <label className="block text-xs text-white/30 mb-1">Email *</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@example.com" className={FINPUT} />
              </div>
              <div>
                <label className="block text-xs text-white/30 mb-1">Phone</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+961 70 000 000" className={FINPUT} />
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div>
            <p className={LABEL}>Shipping Address</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-white/30 mb-1">Street Address *</label>
                <input required value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Main Street" className={FINPUT} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/30 mb-1">City *</label>
                  <input required value={city} onChange={e => setCity(e.target.value)} placeholder="Beirut" className={FINPUT} />
                </div>
                <div>
                  <label className="block text-xs text-white/30 mb-1">Postal Code</label>
                  <input value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="1100" className={FINPUT} />
                </div>
              </div>
              <div>
                <label className="block text-xs text-white/30 mb-1">Country *</label>
                <select required value={country} onChange={e => setCountry(e.target.value)} className={FINPUT}>
                  <option value="LB" className="bg-[#0f1117]">Lebanon</option>
                  <option value="IE" className="bg-[#0f1117]">Ireland</option>
                  <option value="GB" className="bg-[#0f1117]">United Kingdom</option>
                  <option value="DE" className="bg-[#0f1117]">Germany</option>
                  <option value="FR" className="bg-[#0f1117]">France</option>
                  <option value="SA" className="bg-[#0f1117]">Saudi Arabia</option>
                  <option value="AE" className="bg-[#0f1117]">UAE</option>
                  <option value="US" className="bg-[#0f1117]">United States</option>
                  <option value="CA" className="bg-[#0f1117]">Canada</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment + Shipping fee */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className={LABEL}>Payment Method</p>
              <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className={FINPUT}>
                <option value="cod"   className="bg-[#0f1117]">Cash on Delivery</option>
                <option value="whish" className="bg-[#0f1117]">Whish Money</option>
                <option value="card"  className="bg-[#0f1117]">Credit / Debit Card</option>
                <option value="bank"  className="bg-[#0f1117]">Bank Transfer</option>
              </select>
            </div>
            <div>
              <p className={LABEL}>Shipping Fee (€)</p>
              <input
                type="number" min="0" step="0.01"
                value={shippingAmount}
                onChange={e => setShippingAmount(parseFloat(e.target.value) || 0)}
                className={FINPUT}
              />
            </div>
          </div>

          {/* Order total preview */}
          {selectedItems.length > 0 && (
            <div className="bg-[#4ade80]/5 border border-[#4ade80]/15 rounded-xl px-4 py-3 flex justify-between items-center">
              <span className="text-sm font-semibold text-white/60">Order Total</span>
              <span className="text-xl font-black text-[#4ade80]">€{orderTotal.toFixed(2)}</span>
            </div>
          )}

          {/* Notes */}
          <div>
            <p className={LABEL}>Internal Notes</p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Any notes about this order…"
              className={`${FINPUT} resize-none`}
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5 flex gap-3 flex-shrink-0">
          <button type="button" onClick={onClose}
            className="flex-1 py-3 text-sm font-semibold text-white/50 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition">
            Cancel
          </button>
          <button
            type="submit"
            form="new-order-form"
            disabled={loading || selectedItems.length === 0}
            className="flex-1 py-3 text-sm font-bold bg-[#4ade80] text-[#0b0d13] rounded-xl hover:bg-[#22c55e] disabled:opacity-40 transition flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            {loading ? 'Creating…' : 'Create Order'}
          </button>
        </div>
      </div>
    </>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [sourceFilter, setSourceFilter] = useState('ALL')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [detail, setDetail] = useState<OrderDetail | null>(null)
  const [noteText, setNoteText] = useState('')
  const [showNewOrder, setShowNewOrder] = useState(false)
  const PER_PAGE = 6

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase()
    return (
      (o.customer.toLowerCase().includes(q) || o.id.toLowerCase().includes(q) || o.email.toLowerCase().includes(q)) &&
      (filter === 'ALL' || o.status === filter) &&
      (sourceFilter === 'ALL' || o.source === sourceFilter)
    )
  })
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  function updateStatus(id: string, newStatus: FulfillmentStatus) {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: newStatus } : o))
    if (detail?.id === id) setDetail((d) => d ? { ...d, status: newStatus } : d)
  }

  function addNote() {
    if (!noteText.trim() || !detail) return
    const note: OrderNote = { text: noteText.trim(), date: new Date().toLocaleString() }
    setOrders((prev) => prev.map((o) => o.id === detail.id ? { ...o, notes: [...o.notes, note] } : o))
    setDetail((d) => d ? { ...d, notes: [...d.notes, note] } : d)
    setNoteText('')
  }

  function toggleSelect(id: string) {
    setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  function toggleAll() {
    setSelected(selected.size === paginated.length ? new Set() : new Set(paginated.map((o) => o.id)))
  }
  function bulkFulfill() {
    setOrders((prev) => prev.map((o) => selected.has(o.id) ? { ...o, status: 'SHIPPED' as FulfillmentStatus } : o))
    setSelected(new Set())
  }

  function exportCSV() {
    const rows = [
      ['Order ID', 'Customer', 'Email', 'Date', 'Status', 'Payment', 'Channel', 'Total'],
      ...filtered.map(o => [
        o.id, o.customer, o.email,
        new Date(o.date).toLocaleDateString(),
        o.status, o.payment, o.source ?? 'STOREFRONT', `€${o.total}`,
      ])
    ]
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = `orders-${new Date().toISOString().slice(0,10)}.csv`
    a.click(); URL.revokeObjectURL(url)
  }

  function printOrder(o: OrderDetail) {
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`<html><head><title>Order ${o.id}</title>
      <style>body{font-family:sans-serif;padding:24px}h2{margin-bottom:8px}table{width:100%;border-collapse:collapse}td,th{border:1px solid #ccc;padding:8px;text-align:left}</style>
      </head><body>
      <h2>CELLAVIVA — Order ${o.id}</h2>
      <p><b>Customer:</b> ${o.customer} | <b>Email:</b> ${o.email}</p>
      <p><b>Status:</b> ${o.status} | <b>Payment:</b> ${o.payment} | <b>Channel:</b> ${o.source ?? 'Storefront'} | <b>Total:</b> €${o.total}</p>
      <p><b>Ship to:</b> ${o.shippingAddress.line1}, ${o.shippingAddress.city}, ${o.shippingAddress.country}</p>
      <table><tr><th>Product</th><th>Qty</th><th>Price</th></tr>
      ${o.items.map(i => `<tr><td>${i.name}</td><td>${i.qty}</td><td>€${i.price}</td></tr>`).join('')}
      </table></body></html>`)
    win.document.close(); win.print()
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">Orders</h1>
          <p className="text-white/40 mt-0.5 text-sm">{filtered.length} orders found</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {selected.size > 0 && (
            <button onClick={bulkFulfill}
              className="flex items-center gap-2 text-sm font-semibold bg-[#4ade80] text-[#0b0d13] rounded-xl px-4 py-2.5 hover:bg-[#22c55e] transition">
              <Truck className="w-3.5 h-3.5" /> Mark {selected.size} as Shipped
            </button>
          )}
          <button onClick={exportCSV}
            className="flex items-center gap-2 text-sm font-semibold text-white/50 bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 hover:bg-white/10 hover:text-white/80 transition">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => setShowNewOrder(true)}
            className="flex items-center gap-2 text-sm font-bold bg-[#4ade80] text-[#0b0d13] rounded-xl px-4 py-2.5 hover:bg-[#22c55e] transition">
            <Plus className="w-4 h-4" /> New Order
          </button>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-60">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input type="search" placeholder="Search by order ID, customer, or email…" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className={`w-full pl-10 pr-4 py-2.5 ${INPUT}`} />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-white/30" />
          <select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1) }}
            className={`px-3 py-2.5 ${INPUT}`}>
            <option value="ALL" className="bg-[#13161f]">All Status</option>
            {FULFILLMENT_STATUSES.map((s) => <option key={s} value={s} className="bg-[#13161f]">{s}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <select value={sourceFilter} onChange={(e) => { setSourceFilter(e.target.value); setPage(1) }}
            className={`px-3 py-2.5 ${INPUT}`}>
            <option value="ALL" className="bg-[#13161f]">All Channels</option>
            {CHANNELS.map(c => <option key={c.value} value={c.value} className="bg-[#13161f]">{c.label}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className={`${CARD} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/3">
                <th className="px-4 py-3.5">
                  <input type="checkbox" checked={selected.size === paginated.length && paginated.length > 0}
                    onChange={toggleAll} className="rounded border-white/20 accent-[#4ade80]" />
                </th>
                {['Order ID', 'Customer', 'Date', 'Items', 'Channel', 'Fulfillment', 'Payment', 'Total', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold text-white/30 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginated.map((o) => (
                <tr key={o.id} className={`transition-colors ${selected.has(o.id) ? 'bg-[#4ade80]/5' : 'hover:bg-white/3'}`}>
                  <td className="px-4 py-4">
                    <input type="checkbox" checked={selected.has(o.id)} onChange={() => toggleSelect(o.id)} className="rounded border-white/20 accent-[#4ade80]" />
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-[#4ade80] font-semibold">
                    <button onClick={() => setDetail(o)} className="hover:underline">{o.id}</button>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-white">{o.customer}</p>
                    <p className="text-xs text-white/30">{o.email}</p>
                  </td>
                  <td className="px-4 py-4 text-white/40 text-xs whitespace-nowrap">
                    {new Date(o.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-4 text-xs text-white/50">{o.items.length} item{o.items.length > 1 ? 's' : ''}</td>
                  <td className="px-4 py-4">{channelBadge(o.source)}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadge[o.status]}`}>{o.status}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${paymentBadge[o.payment]}`}>{o.payment}</span>
                  </td>
                  <td className="px-4 py-4 font-bold text-white">€{o.total.toFixed(2)}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value as FulfillmentStatus)}
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#4ade80]">
                        {FULFILLMENT_STATUSES.map((s) => <option key={s} value={s} className="bg-[#13161f]">{s}</option>)}
                      </select>
                      <button onClick={() => setDetail(o)} className="p-1.5 text-white/30 hover:text-[#4ade80] rounded-lg hover:bg-white/5">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr><td colSpan={10} className="px-5 py-12 text-center text-white/30">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-xs text-white/30">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
                className="px-3 py-1.5 text-xs font-semibold bg-white/5 border border-white/8 rounded-lg text-white/50 disabled:opacity-40 hover:bg-white/10">Previous</button>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 text-xs font-semibold bg-white/5 border border-white/8 rounded-lg text-white/50 disabled:opacity-40 hover:bg-white/10">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Drawer */}
      {detail && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setDetail(null)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-[#0f1117] border-l border-white/5 z-50 shadow-2xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-lg font-black text-white">{detail.id}</h2>
                <p className="text-xs text-white/30 mt-0.5">
                  {new Date(detail.date).toLocaleDateString('en-US', { dateStyle: 'long' })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => detail && printOrder(detail)} className="p-2 text-white/30 hover:text-white/70 border border-white/10 rounded-lg hover:bg-white/5" title="Print order">
                  <Printer className="w-4 h-4" />
                </button>
                <button onClick={() => setDetail(null)} className="p-2 text-white/30 hover:text-white/70">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadge[detail.status]}`}>{detail.status}</span>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${paymentBadge[detail.payment]}`}>{detail.payment}</span>
                {channelBadge(detail.source)}
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-white/8 text-white/50`}>Risk: {detail.riskLevel}</span>
                {detail.tags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 bg-[#4ade80]/10 text-[#4ade80] rounded-full px-3 py-1 text-xs font-semibold">
                    <Tag className="w-2.5 h-2.5" />{t}
                  </span>
                ))}
              </div>

              <div className="bg-white/4 rounded-2xl p-4 border border-white/5">
                <h3 className="text-sm font-bold text-white mb-3">Items</h3>
                <div className="space-y-3">
                  {detail.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#4ade80]/10 rounded-xl flex items-center justify-center text-lg flex-shrink-0">🌿</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">{item.name}</p>
                        <p className="text-xs text-white/30">{item.sku ? `SKU: ${item.sku} · ` : ''}Qty: {item.qty}</p>
                      </div>
                      <p className="text-sm font-bold text-white">€{(item.price * item.qty).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/8 mt-4 pt-4 space-y-1.5 text-sm">
                  <div className="flex justify-between text-white/50"><span>Subtotal</span><span>€{detail.subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-white/50"><span>Shipping</span><span>{detail.shipping === 0 ? 'Free' : `€${detail.shipping.toFixed(2)}`}</span></div>
                  {detail.tax > 0 && <div className="flex justify-between text-white/50"><span>Tax</span><span>€{detail.tax.toFixed(2)}</span></div>}
                  <div className="flex justify-between font-black text-white text-base border-t border-white/8 pt-2 mt-1"><span>Total</span><span>€{detail.total.toFixed(2)}</span></div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/4 rounded-2xl p-4 border border-white/5">
                  <h3 className="text-sm font-bold text-white mb-3">Customer</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-white/60"><Mail className="w-3.5 h-3.5 text-white/25" />{detail.email}</div>
                    <div className="flex items-center gap-2 text-white/60"><Phone className="w-3.5 h-3.5 text-white/25" />{detail.phone}</div>
                    <div className="flex items-center gap-2 text-white/60"><CreditCard className="w-3.5 h-3.5 text-white/25" />{detail.paymentMethod}</div>
                  </div>
                </div>
                <div className="bg-white/4 rounded-2xl p-4 border border-white/5">
                  <h3 className="text-sm font-bold text-white mb-3">Shipping Address</h3>
                  <div className="flex items-start gap-2 text-sm text-white/60">
                    <MapPin className="w-3.5 h-3.5 text-white/25 mt-0.5 flex-shrink-0" />
                    <div>
                      <p>{detail.shippingAddress.line1}</p>
                      <p>{detail.shippingAddress.city}, {detail.shippingAddress.zip}</p>
                      <p>{detail.shippingAddress.country}</p>
                    </div>
                  </div>
                  {detail.trackingNumber && (
                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <Truck className="w-3.5 h-3.5 text-[#4ade80]" />
                      <span className="font-mono text-[#4ade80] font-semibold">{detail.trackingNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white/4 rounded-2xl p-4 border border-white/5">
                <h3 className="text-sm font-bold text-white mb-3">Update Fulfillment</h3>
                <div className="flex gap-2 flex-wrap">
                  {FULFILLMENT_STATUSES.map((s) => (
                    <button key={s} onClick={() => updateStatus(detail.id, s)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${detail.status === s ? 'bg-[#4ade80] text-[#0b0d13] border-[#4ade80]' : 'border-white/10 text-white/50 hover:border-[#4ade80] hover:text-[#4ade80]'}`}>
                      {s}
                    </button>
                  ))}
                </div>
                {detail.status === 'DELIVERED' && (
                  <button className="mt-3 flex items-center gap-2 text-sm text-red-400 hover:text-red-300 font-semibold">
                    <RotateCcw className="w-3.5 h-3.5" /> Issue Refund
                  </button>
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-4">Order Timeline</h3>
                <div className="space-y-4">
                  {detail.timeline.map((ev, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-[#4ade80]/10 flex items-center justify-center text-[#4ade80] flex-shrink-0">
                          {i === detail.timeline.length - 1 ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        </div>
                        {i < detail.timeline.length - 1 && <div className="w-0.5 h-6 bg-white/8 mt-1" />}
                      </div>
                      <div className="pb-2">
                        <p className="text-sm font-semibold text-white">{ev.status}</p>
                        <p className="text-xs text-white/30">{ev.date}</p>
                        {ev.note && <p className="text-xs text-white/40 mt-0.5 italic">{ev.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-white/40" /> Internal Notes
                </h3>
                {detail.notes.length === 0 && <p className="text-xs text-white/30 mb-3">No notes yet.</p>}
                {detail.notes.map((n, i) => (
                  <div key={i} className="bg-amber-500/8 border border-amber-500/15 rounded-xl p-3 mb-2">
                    <p className="text-sm text-white/80">{n.text}</p>
                    <p className="text-xs text-white/30 mt-1">{n.date}</p>
                  </div>
                ))}
                <div className="flex gap-2 mt-2">
                  <input value={noteText} onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add a note…"
                    onKeyDown={(e) => e.key === 'Enter' && addNote()}
                    className={`flex-1 px-3 py-2 ${INPUT}`} />
                  <button onClick={addNote} disabled={!noteText.trim()}
                    className="px-4 py-2 text-sm font-semibold bg-[#4ade80] text-[#0b0d13] rounded-xl hover:bg-[#22c55e] disabled:opacity-40 transition">Add</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* New Order Drawer */}
      {showNewOrder && (
        <NewOrderDrawer
          onClose={() => setShowNewOrder(false)}
          onCreated={(order) => setOrders(prev => [order, ...prev])}
        />
      )}
    </div>
  )
}

