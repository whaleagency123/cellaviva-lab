'use client'
import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import {
  ShoppingBag, ArrowLeft, Lock, Truck, Shield, CreditCard, CheckCircle2, ChevronRight,
  Tag, X, Loader2, Smartphone, Banknote, MessageCircle,
} from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// ─── Types ───────────────────────────────────────────────────────────────────
interface ContactForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  postalCode: string
}

const INITIAL_FORM: ContactForm = {
  firstName: '', lastName: '', email: '', phone: '',
  address: '', city: '', country: 'IE', postalCode: '',
}

const COUNTRIES = [
  { code: 'IE', name: 'Ireland' }, { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' }, { code: 'FR', name: 'France' },
  { code: 'NL', name: 'Netherlands' }, { code: 'BE', name: 'Belgium' },
  { code: 'ES', name: 'Spain' }, { code: 'IT', name: 'Italy' },
  { code: 'US', name: 'United States' }, { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
]

const INPUT = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3a79a9]/40 transition-shadow'
const LABEL = 'block text-sm font-semibold text-gray-700 mb-1.5'

// ─── Step 2: Payment form (must be inside <Elements>) ────────────────────────
function PaymentForm({
  total,
  onBack,
  onSuccess,
}: {
  total: number
  onBack: () => void
  onSuccess: (piId: string) => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [status, setStatus] = useState<'idle' | 'processing' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handlePay(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setStatus('processing')
    setErrorMsg('')

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${appUrl}/checkout/success`,
      },
    })

    // confirmPayment only returns here on error; success causes a redirect
    if (error) {
      setErrorMsg(error.message ?? 'Payment failed. Please try again.')
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handlePay} className="space-y-5">
      <div className="bg-white rounded-3xl shadow-sm p-7">
        <div className="flex items-center gap-2 mb-5">
          <CreditCard className="w-5 h-5 text-[#3a79a9]" />
          <h2 className="text-xl font-black text-gray-900">Payment</h2>
        </div>

        {/* Accepted card logos */}
        <div className="flex items-center gap-2 mb-5">
          <span className="text-xs text-gray-400">Accepted:</span>
          {/* Visa */}
          <svg viewBox="0 0 60 20" className="h-5" aria-label="Visa">
            <text x="0" y="16" fontSize="18" fontWeight="bold" fill="#1A1F71" fontFamily="Arial">VISA</text>
          </svg>
          {/* Mastercard */}
          <svg viewBox="0 0 38 24" className="h-5" aria-label="Mastercard">
            <circle cx="13" cy="12" r="10" fill="#EB001B"/>
            <circle cx="25" cy="12" r="10" fill="#F79E1B"/>
            <path d="M19 5.3a10 10 0 0 1 0 13.4A10 10 0 0 1 19 5.3z" fill="#FF5F00"/>
          </svg>
          {/* Amex */}
          <span className="text-[10px] font-bold text-[#016fd0] border border-[#016fd0] rounded px-1 py-0.5">AMEX</span>
          <Lock className="w-3.5 h-3.5 text-gray-300 ml-auto" />
          <span className="text-[10px] text-gray-400">SSL Secured</span>
        </div>

        {/* Stripe PaymentElement */}
        <PaymentElement
          options={{
            layout: 'tabs',
            fields: { billingDetails: { name: 'never', email: 'never' } },
          }}
        />

        {errorMsg && (
          <div className="mt-4 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <p className="text-sm text-red-600">{errorMsg}</p>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={status === 'processing'}
          className="flex items-center gap-2 px-5 py-3.5 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-300 transition-colors disabled:opacity-40"
        >
          <ArrowLeft className="w-4 h-4" /> Edit details
        </button>
        <button
          type="submit"
          disabled={!stripe || status === 'processing'}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#3a79a9] text-white text-sm font-bold hover:bg-[#266396] transition-colors disabled:opacity-50"
        >
          <Lock className="w-4 h-4" />
          {status === 'processing' ? 'Processing…' : `Pay ${formatPrice(total)}`}
        </button>
      </div>
    </form>
  )
}

// ─── Main checkout page ───────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore()
  const [form, setForm] = useState<ContactForm>(INITIAL_FORM)
  const [step, setStep] = useState<1 | 2>(1)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [intentTotal, setIntentTotal] = useState(0)
  const [loadingIntent, setLoadingIntent] = useState(false)
  const [intentError, setIntentError] = useState('')

  // Payment enabled check
  const [paymentEnabled, setPaymentEnabled] = useState(true)
  useEffect(() => {
    fetch('/api/admin/payments')
      .then(r => r.json())
      .then((d: Record<string, string>) => {
        if (d.paymentEnabled === 'false') setPaymentEnabled(false)
      })
      .catch(() => {})
  }, [])

  // Shipping config (fetched from DB via settings API)
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

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'whish' | 'cod'>('card')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [manualOrderDone, setManualOrderDone] = useState(false)
  const [manualOrderData, setManualOrderData] = useState<any>(null)

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then((d: any) => { if (d.storeWhatsapp) setWhatsappNumber(d.storeWhatsapp) })
      .catch(() => {})
  }, [])

  // Discount code state
  const [discountInput, setDiscountInput] = useState('')
  const [discountLoading, setDiscountLoading] = useState(false)
  const [discountError, setDiscountError] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string; type: string; value: number; discountAmount: number
  } | null>(null)

  const cartTotal = total()
  const shipping = cartTotal >= shippingThreshold ? 0 : shippingFee
  const discountAmount = appliedDiscount?.discountAmount ?? 0
  const orderTotal = cartTotal + shipping - discountAmount

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
        setDiscountError('')
      }
    } catch {
      setDiscountError('Could not validate code. Try again.')
    } finally {
      setDiscountLoading(false)
    }
  }

  const setField = useCallback(
    (k: keyof ContactForm, v: string) => setForm((f) => ({ ...f, [k]: v })),
    [],
  )

  function buildWhatsAppMessage(order: any) {
    const method = order.paymentMethod === 'whish' ? '💳 Whish Money'
                 : order.paymentMethod === 'cod'   ? '💵 Cash on Delivery'
                 :                                   '💳 Credit / Debit Card'
    const items  = order.items.map((i: any) => `  • ${i.title} × ${i.quantity} = €${(i.price * i.quantity).toFixed(2)}`).join('\n')
    const addr   = order.shippingAddress
    return encodeURIComponent(
      `🛒 *New Order — CELLAVIVA*\n\n` +
      `📋 *Order ID:* ${order.orderId.slice(0,10).toUpperCase()}\n` +
      `💰 *Payment:* ${method}\n\n` +
      `👤 *Customer:*\n` +
      `  Name: ${order.customerName}\n` +
      `  Phone: ${order.customerPhone}\n` +
      `  Email: ${order.customerEmail}\n\n` +
      `📦 *Items:*\n${items}\n\n` +
      `🚚 *Shipping Address:*\n` +
      `  ${addr.address}\n` +
      `  ${addr.city}, ${addr.country} ${addr.postalCode}\n\n` +
      `💵 *Total: €${order.total.toFixed(2)}*`
    )
  }

  async function handleManualOrder(e: React.FormEvent) {
    e.preventDefault()
    setLoadingIntent(true)
    setIntentError('')
    try {
      const res = await fetch('/api/orders/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName:  `${form.firstName} ${form.lastName}`.trim(),
          customerEmail: form.email,
          customerPhone: form.phone,
          address:       form.address,
          city:          form.city,
          country:       form.country,
          postalCode:    form.postalCode,
          cartItems: items.map(i => ({
            productId: i.product.id,
            quantity:  i.quantity,
          })),
          shippingAmount: shipping,
          discountCode:   appliedDiscount?.code ?? null,
          discountAmount: appliedDiscount?.discountAmount ?? 0,
          paymentMethod,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Could not place order')
      clearCart()
      setManualOrderData(data)
      setManualOrderDone(true)
      const waNumber = whatsappNumber.replace(/\D/g, '') || '9613054122'
      const msg = buildWhatsAppMessage(data)
      window.open(`https://wa.me/${waNumber}?text=${msg}`, '_blank')
    } catch (err) {
      setIntentError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoadingIntent(false)
    }
  }

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault()
    setLoadingIntent(true)
    setIntentError('')
    try {
      const res = await fetch('/api/payment/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: `${form.firstName} ${form.lastName}`.trim(),
          customerEmail: form.email,
          customerPhone: form.phone,
          cartItems: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
            clientPrice: i.product.salePrice ?? i.product.price,
          })),
          shippingAmount: shipping,
          discountCode: appliedDiscount?.code ?? null,
          discountAmount: appliedDiscount?.discountAmount ?? 0,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Could not create payment session')
      setClientSecret(data.clientSecret)
      setIntentTotal(data.total)
      setStep(2)
    } catch (err) {
      setIntentError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoadingIntent(false)
    }
  }

  // Manual order success screen
  if (manualOrderDone && manualOrderData) {
    const msg = buildWhatsAppMessage(manualOrderData)
    const waNumber = whatsappNumber.replace(/\D/g, '') || '9613054122'
    const waUrl = `https://wa.me/${waNumber}?text=${msg}`
    return (
      <div className="min-h-screen bg-[#f6f5f3] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Order Placed!</h2>
          <p className="text-gray-500 mb-1">
            Order <span className="font-bold text-gray-700">#{manualOrderData.orderId.slice(0,10).toUpperCase()}</span>
          </p>
          <p className="text-gray-500 mb-8">
            {manualOrderData.paymentMethod === 'whish'
              ? 'Please send payment via Whish Money. Our team will confirm your order via WhatsApp.'
              : manualOrderData.paymentMethod === 'cod'
              ? 'Your order will be delivered and you pay upon receipt.'
              : 'Your order details have been sent via WhatsApp. Our team will confirm shortly.'}
          </p>

          {/* WhatsApp button */}
          <a href={waUrl} target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-white text-sm mb-3 transition-all hover:opacity-90"
            style={{ background: '#25D366' }}>
            <MessageCircle className="w-5 h-5" />
            Send Order via WhatsApp
          </a>

          {/* Whish instructions */}
          {manualOrderData.paymentMethod === 'whish' && (
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 mb-4 text-left">
              <p className="font-bold text-purple-700 text-sm mb-1">Whish Payment Instructions</p>
              <p className="text-purple-600 text-xs leading-relaxed">
                Open your Whish app → Send Money → Enter our Whish number (sent via WhatsApp) → Amount: €{manualOrderData.total.toFixed(2)} → Send screenshot to confirm.
              </p>
            </div>
          )}

          <Link href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#2B5E3F] text-white font-semibold text-sm hover:bg-[#1B3E2A] transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  if (!paymentEnabled) {
    return (
      <div className="min-h-screen bg-[#f6f5f3] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">Payments Temporarily Unavailable</h2>
          <p className="text-gray-500 mb-6 leading-relaxed">
            Our online payment system is currently undergoing maintenance. Please check back shortly or contact us directly.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#2B5E3F] text-white font-semibold text-sm hover:bg-[#1B3E2A] transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f6f5f3] flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some products before checking out.</p>
          <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#3a79a9] text-white font-semibold text-sm hover:bg-[#266396] transition-colors">
            Shop Now
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f6f5f3]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back */}
        <Link href="/products" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#3a79a9] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-8">
          <div className={`flex items-center gap-2 text-sm font-semibold ${step === 1 ? 'text-[#3a79a9]' : 'text-emerald-600'}`}>
            {step === 2 ? <CheckCircle2 className="w-4 h-4" /> : <span className="w-5 h-5 rounded-full bg-[#3a79a9] text-white flex items-center justify-center text-xs">1</span>}
            Contact & Shipping
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <div className={`flex items-center gap-2 text-sm font-semibold ${step === 2 ? 'text-[#3a79a9]' : 'text-gray-300'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${step === 2 ? 'bg-[#3a79a9] text-white' : 'bg-gray-200 text-gray-400'}`}>2</span>
            Payment
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left column */}
          <div className="lg:col-span-3">
            {/* ── Step 1: Contact & Shipping ── */}
            {step === 1 && (
              <form onSubmit={handleManualOrder} className="space-y-5">
                <div className="bg-white rounded-3xl shadow-sm p-7">
                  <h2 className="text-xl font-black text-gray-900 mb-5">Contact Information</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={LABEL}>First Name <span className="text-red-400">*</span></label>
                        <input required value={form.firstName} onChange={(e) => setField('firstName', e.target.value)} className={INPUT} placeholder="Jane" />
                      </div>
                      <div>
                        <label className={LABEL}>Last Name <span className="text-red-400">*</span></label>
                        <input required value={form.lastName} onChange={(e) => setField('lastName', e.target.value)} className={INPUT} placeholder="Smith" />
                      </div>
                    </div>
                    <div>
                      <label className={LABEL}>Email Address <span className="text-red-400">*</span></label>
                      <input required type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} className={INPUT} placeholder="jane@example.com" />
                    </div>
                    <div>
                      <label className={LABEL}>Phone <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input type="tel" value={form.phone} onChange={(e) => setField('phone', e.target.value)} className={INPUT} placeholder="+353 87 000 0000" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm p-7">
                  <h2 className="text-xl font-black text-gray-900 mb-5">Shipping Address</h2>
                  <div className="space-y-4">
                    <div>
                      <label className={LABEL}>Address <span className="text-red-400">*</span></label>
                      <input required value={form.address} onChange={(e) => setField('address', e.target.value)} className={INPUT} placeholder="123 Main Street" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={LABEL}>City <span className="text-red-400">*</span></label>
                        <input required value={form.city} onChange={(e) => setField('city', e.target.value)} className={INPUT} placeholder="Dublin" />
                      </div>
                      <div>
                        <label className={LABEL}>Postal Code <span className="text-red-400">*</span></label>
                        <input required value={form.postalCode} onChange={(e) => setField('postalCode', e.target.value)} className={INPUT} placeholder="D01 A1B2" />
                      </div>
                    </div>
                    <div>
                      <label className={LABEL}>Country <span className="text-red-400">*</span></label>
                      <select required value={form.country} onChange={(e) => setField('country', e.target.value)} className={INPUT}>
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* ── Payment Method ── */}
                <div className="bg-white rounded-3xl shadow-sm p-7">
                  <h2 className="text-xl font-black text-gray-900 mb-5">Payment Method</h2>
                  <div className="space-y-3">
                    {/* Credit Card */}
                    <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-[#3a79a9] bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
                      <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="sr-only" />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === 'card' ? 'border-[#3a79a9] bg-[#3a79a9]' : 'border-gray-300'}`}>
                        {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <CreditCard className="w-5 h-5 text-[#3a79a9] flex-shrink-0" />
                      <div>
                        <p className="font-bold text-gray-900 text-sm">Credit / Debit Card</p>
                        <p className="text-xs text-gray-400">Visa, Mastercard, Amex — Secured by Stripe</p>
                      </div>
                    </label>

                    {/* Whish Money */}
                    <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'whish' ? 'border-purple-500 bg-purple-50' : 'border-gray-100 hover:border-gray-200'}`}>
                      <input type="radio" name="paymentMethod" value="whish" checked={paymentMethod === 'whish'} onChange={() => setPaymentMethod('whish')} className="sr-only" />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === 'whish' ? 'border-purple-500 bg-purple-500' : 'border-gray-300'}`}>
                        {paymentMethod === 'whish' && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <Smartphone className="w-5 h-5 text-purple-500 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-gray-900 text-sm">Whish Money</p>
                        <p className="text-xs text-gray-400">Pay via Whish app — we confirm via WhatsApp</p>
                      </div>
                    </label>

                    {/* Cash on Delivery */}
                    <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}>
                      <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="sr-only" />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === 'cod' ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}>
                        {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <Banknote className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-gray-900 text-sm">Cash on Delivery</p>
                        <p className="text-xs text-gray-400">Pay when your order arrives</p>
                      </div>
                    </label>
                  </div>
                </div>

                {intentError && (
                  <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-4">
                    <p className="text-sm text-red-600">{intentError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loadingIntent}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-white text-sm font-bold transition-colors disabled:opacity-50 ${
                    paymentMethod === 'cod' ? 'bg-green-600 hover:bg-green-700' :
                    paymentMethod === 'whish' ? 'bg-purple-600 hover:bg-purple-700' :
                    'bg-[#25D366] hover:bg-[#1ebe5d]'
                  }`}
                >
                  {paymentMethod === 'cod' ? <Banknote className="w-4 h-4" /> :
                   paymentMethod === 'whish' ? <Smartphone className="w-4 h-4" /> :
                   <MessageCircle className="w-4 h-4" />}
                  {loadingIntent ? 'Placing order…' :
                   paymentMethod === 'cod' ? 'Place Order — Cash on Delivery' :
                   paymentMethod === 'whish' ? 'Place Order — Pay via Whish' :
                   'Continue to Payment via WhatsApp'}
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Trust strip */}
                <div className="flex items-center justify-center gap-5 text-xs text-gray-400">
                  <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> SSL Secured</span>
                  <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Stripe Payments</span>
                  <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Fast Delivery</span>
                </div>
              </form>
            )}

            {/* ── Step 2: Payment ── */}
            {step === 2 && clientSecret && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#3a79a9',
                      fontFamily: 'DM Sans, system-ui, sans-serif',
                      borderRadius: '12px',
                      spacingUnit: '4px',
                    },
                  },
                }}
              >
                <PaymentForm
                  total={intentTotal}
                  onBack={() => setStep(1)}
                  onSuccess={(piId) => {
                    clearCart()
                    window.location.href = `/checkout/success?payment_intent=${piId}`
                  }}
                />
              </Elements>
            )}
          </div>

          {/* Right: Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm p-7 sticky top-6">
              <h2 className="text-xl font-black text-gray-900 mb-5">Order Summary</h2>
              <div className="space-y-4 mb-5">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-4">
                    <div className="w-14 h-14 bg-[#d1dee6] rounded-2xl flex-shrink-0 flex items-center justify-center text-xl">🌿</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 leading-snug">{product.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Qty: {quantity}</p>
                      <p className="text-sm font-bold text-[#3a79a9] mt-1">
                        {formatPrice((product.salePrice ?? product.price) * quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Discount code input */}
              {step === 1 && (
                <div className="mb-4">
                  {appliedDiscount ? (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5">
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
                  )}
                  {discountError && <p className="mt-1.5 text-xs text-red-500">{discountError}</p>}
                </div>
              )}

              <div className="border-t border-gray-100 pt-4 space-y-2">
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
                {shipping > 0 && (
                  <p className="text-xs text-gray-400">Add {formatPrice(50 - cartTotal)} more for free shipping</p>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Discount</span>
                    <span className="font-semibold">−{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-black text-xl text-[#3a79a9]">{formatPrice(Math.max(0, orderTotal))}</span>
                </div>
              </div>
              <p className="text-center text-xs text-gray-400 mt-5">
                By continuing, you agree to our{' '}
                <Link href="/terms" className="underline hover:text-gray-600">Terms</Link> and{' '}
                <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
