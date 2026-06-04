'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, Mail, ArrowRight, Loader2, XCircle } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { trackPurchase } from '@/lib/pixels'

interface VerifyResult {
  ok: boolean
  orderId: string | null
  customerEmail: string
  customerName: string
  total: number
  currency: string
}

function SuccessContent() {
  const params = useSearchParams()
  const piId = params.get('payment_intent')
  const redirectStatus = params.get('redirect_status')

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [data, setData] = useState<VerifyResult | null>(null)
  const [errMsg, setErrMsg] = useState('')

  useEffect(() => {
    if (!piId) {
      // No payment intent param — this might be a direct visit
      setStatus('success')
      return
    }
    if (redirectStatus === 'failed') {
      setStatus('error')
      setErrMsg('Your payment was not completed. Please return to checkout and try again.')
      return
    }

    fetch(`/api/payment/verify?id=${encodeURIComponent(piId)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          setData(d)
          setStatus('success')
          trackPurchase({ orderId: d.orderId ?? piId, value: d.total })
        } else {
          setErrMsg(d.error ?? 'Could not verify your payment.')
          setStatus('error')
        }
      })
      .catch(() => {
        setErrMsg('Could not reach server. Please contact support if payment was taken.')
        setStatus('error')
      })
  }, [piId, redirectStatus])

  return (
    <div className="min-h-screen bg-[#f6f5f3] flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full">

        {/* ── Loading ── */}
        {status === 'loading' && (
          <div className="bg-white rounded-3xl shadow-sm p-10 text-center">
            <Loader2 className="w-12 h-12 text-[#3a79a9] animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-1">Confirming your payment…</h2>
            <p className="text-sm text-gray-400">Please wait a moment.</p>
          </div>
        )}

        {/* ── Error ── */}
        {status === 'error' && (
          <div className="bg-white rounded-3xl shadow-sm p-10 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Payment Issue</h2>
            <p className="text-gray-500 text-sm mb-6">{errMsg}</p>
            <div className="flex flex-col gap-3">
              <Link href="/checkout" className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#3a79a9] text-white font-semibold text-sm hover:bg-[#266396] transition-colors">
                Return to Checkout
              </Link>
              <Link href="/contact" className="text-sm text-gray-400 underline hover:text-gray-600">
                Contact Support
              </Link>
            </div>
          </div>
        )}

        {/* ── Success ── */}
        {status === 'success' && (
          <div className="bg-white rounded-3xl shadow-sm p-8 sm:p-10 text-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>

            <h1 className="text-3xl font-black text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-500 mb-1 text-sm leading-relaxed">
              {data?.customerName ? `Thank you, ${data.customerName.split(' ')[0]}!` : 'Thank you for your order!'}{' '}
              Your payment was processed successfully.
            </p>
            {data?.customerEmail && (
              <p className="text-gray-400 text-xs mb-6">
                A confirmation will be sent to <span className="font-medium text-gray-600">{data.customerEmail}</span>
              </p>
            )}

            {/* Order details */}
            {data && (
              <div className="bg-[#f6f5f3] rounded-2xl px-5 py-4 text-left mb-6 space-y-2">
                {data.orderId && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Order ID</span>
                    <span className="font-mono text-xs font-semibold text-gray-700">#{data.orderId.slice(-8).toUpperCase()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Amount Paid</span>
                  <span className="font-bold text-gray-900">{formatPrice(data.total)}</span>
                </div>
              </div>
            )}

            {/* Progress steps */}
            <div className="space-y-4 mb-8 text-left">
              {[
                { icon: CheckCircle, label: 'Payment Received', desc: 'Your payment was securely processed via Stripe.', done: true },
                { icon: Package, label: 'Order Processing', desc: 'We are preparing your Stemuvita™ products for dispatch.', done: true },
                { icon: Mail, label: 'Confirmation Email', desc: 'A receipt and tracking link will arrive in your inbox shortly.', done: false },
              ].map((s) => (
                <div key={s.label} className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${s.done ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div className="pt-1.5">
                    <p className={`text-sm font-bold ${s.done ? 'text-gray-900' : 'text-gray-400'}`}>{s.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/track-order" className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#3a79a9] text-white font-semibold text-sm hover:bg-[#266396] transition-colors">
                Track Your Order <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/products" className="px-6 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-300 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}

        <p className="text-center text-sm text-gray-400 mt-6">
          Questions?{' '}
          <Link href="/contact" className="text-[#3a79a9] underline font-medium">
            Contact support
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
