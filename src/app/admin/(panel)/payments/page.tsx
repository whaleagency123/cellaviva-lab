'use client'
import { useState, useEffect } from 'react'
import {
  CreditCard, Save, CheckCircle2, XCircle, Loader2,
  Wifi, WifiOff, Info, ToggleLeft, ToggleRight,
} from 'lucide-react'

const CARD = 'bg-[#13161f] border border-white/5 rounded-2xl p-6'
const LABEL = 'block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5'
const INPUT = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#4ade80]/50 transition-colors'

const ACCEPTED_CARDS = [
  { name: 'Visa', bg: '#1A1F71', text: 'white', label: 'VISA', font: 'bold' },
  { name: 'Mastercard', colors: ['#EB001B', '#F79E1B'] },
  { name: 'American Express', label: 'AMEX', border: '#016fd0', textColor: '#016fd0' },
  { name: 'Discover', label: 'DISCOVER', bg: '#f76f20', text: 'white' },
]

interface Settings {
  paymentCurrency: string
  paymentShippingThreshold: string
  paymentShippingFee: string
  paymentTaxRate: string
  paymentEnableWallets: string
  paymentEnabled: string
}

const DEFAULTS: Settings = {
  paymentCurrency: 'eur',
  paymentShippingThreshold: '50',
  paymentShippingFee: '9.99',
  paymentTaxRate: '0',
  paymentEnableWallets: 'true',
  paymentEnabled: 'true',
}

export default function PaymentsPage() {
  const [settings, setSettings] = useState<Settings>({ ...DEFAULTS })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Gateway test state
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ ok: boolean; mode?: string; error?: string } | null>(null)

  // Env key status
  const hasSecretKey = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  const stripeMode = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_live')
    ? 'live'
    : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_test')
    ? 'test'
    : 'unknown'

  useEffect(() => {
    fetch('/api/admin/payments')
      .then((r) => r.json())
      .then((d: Record<string, string>) => {
        setSettings((s) => ({ ...s, ...d }))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function set(k: keyof Settings, v: string) {
    setSettings((s) => ({ ...s, [k]: v }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  async function handleTest() {
    setTesting(true)
    setTestResult(null)
    try {
      const r = await fetch('/api/admin/payments?action=test')
      const d = await r.json()
      setTestResult(d)
    } catch {
      setTestResult({ ok: false, error: 'Network error' })
    } finally {
      setTesting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-white/30 text-sm">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading payment settings…
      </div>
    )
  }

  const walletsOn  = settings.paymentEnableWallets === 'true'
  const paymentOn  = settings.paymentEnabled !== 'false'

  async function togglePayment() {
    const newVal = paymentOn ? 'false' : 'true'
    setSettings(s => ({ ...s, paymentEnabled: newVal }))
    await fetch('/api/admin/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...settings, paymentEnabled: newVal }),
    })
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-6 space-y-6">

      {/* ── Online Payment Master Toggle ── */}
      <div className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
        paymentOn
          ? 'bg-[#4ade80]/8 border-[#4ade80]/40'
          : 'bg-red-500/8 border-red-500/30'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            paymentOn ? 'bg-[#4ade80]/15' : 'bg-red-500/15'
          }`}>
            {paymentOn
              ? <CreditCard className="w-6 h-6 text-[#4ade80]" />
              : <WifiOff className="w-6 h-6 text-red-400" />}
          </div>
          <div>
            <p className={`text-lg font-black ${paymentOn ? 'text-[#4ade80]' : 'text-red-400'}`}>
              Online Payment — {paymentOn ? 'ACTIVE' : 'DISABLED'}
            </p>
            <p className="text-sm text-white/40">
              {paymentOn
                ? 'Customers can complete purchases with card payment'
                : 'Checkout is blocked — no payments accepted until re-enabled'}
            </p>
          </div>
        </div>
        <button
          onClick={togglePayment}
          className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
            paymentOn
              ? 'bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400'
              : 'bg-[#4ade80]/15 hover:bg-[#4ade80]/25 border border-[#4ade80]/30 text-[#4ade80]'
          }`}
        >
          {paymentOn
            ? <><ToggleRight className="w-5 h-5" /> Disable Payments</>
            : <><ToggleLeft className="w-5 h-5" /> Enable Payments</>}
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Payment Settings</h1>
          <p className="text-sm text-white/40 mt-1">
            Configure your payment gateway, accepted methods, and checkout rules.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-[#4ade80] text-[#0b0d13] hover:bg-[#22c55e] transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      {/* Gateway Status */}
      <div className={CARD}>
        <p className={LABEL}>Gateway Status</p>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-3">
            {/* Stripe connection */}
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold ${
                process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
                  ? 'bg-[#4ade80]/10 text-[#4ade80]'
                  : 'bg-red-500/10 text-red-400'
              }`}>
                {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
                  ? <CheckCircle2 className="w-3.5 h-3.5" />
                  : <XCircle className="w-3.5 h-3.5" />}
                Publishable Key {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'Configured' : 'Missing'}
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold ${
                stripeMode === 'live' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'
              }`}>
                {stripeMode === 'live' ? '🟠 Live Mode' : stripeMode === 'test' ? '🔵 Test Mode' : '❓ Unknown'}
              </div>
            </div>

            {/* Test connection */}
            {testResult && (
              <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-xl ${
                testResult.ok ? 'bg-[#4ade80]/8 text-[#4ade80]' : 'bg-red-500/10 text-red-400'
              }`}>
                {testResult.ok
                  ? <><Wifi className="w-4 h-4" /> Connected · {testResult.mode === 'live' ? 'Live mode' : 'Test mode'}</>
                  : <><WifiOff className="w-4 h-4" /> {testResult.error ?? 'Connection failed'}</>}
              </div>
            )}

            <p className="text-xs text-white/30 flex items-start gap-1.5 max-w-sm">
              <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              Stripe keys are configured in your server environment (.env). Contact your developer to switch between test and live modes.
            </p>
          </div>

          <button
            onClick={handleTest}
            disabled={testing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/5 text-white/70 border border-white/10 hover:bg-white/8 hover:text-white transition-all disabled:opacity-50 shrink-0"
          >
            {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wifi className="w-4 h-4" />}
            Test Connection
          </button>
        </div>

        {/* Accepted card logos */}
        <div className="mt-5 pt-5 border-t border-white/5">
          <p className="text-[11px] font-semibold text-white/30 uppercase tracking-wider mb-3">Accepted Cards</p>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Visa */}
            <div className="px-3 py-1.5 rounded-lg bg-[#1A1F71] text-white font-bold text-sm tracking-widest">VISA</div>
            {/* Mastercard */}
            <div className="relative flex items-center px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <span className="text-xs font-bold text-white/70">Mastercard</span>
              <span className="ml-2 flex">
                <span className="w-5 h-5 rounded-full bg-[#EB001B] opacity-90" />
                <span className="w-5 h-5 rounded-full bg-[#F79E1B] opacity-90 -ml-2.5" />
              </span>
            </div>
            {/* Amex */}
            <div className="px-3 py-1.5 rounded-lg border border-[#016fd0] text-[#016fd0] text-xs font-bold tracking-wider">AMEX</div>
            {/* Discover */}
            <div className="px-3 py-1.5 rounded-lg bg-[#f76f20] text-white text-xs font-bold tracking-wider">DISCOVER</div>
            <span className="text-xs text-white/20">+ more via Stripe</span>
          </div>
        </div>
      </div>

      {/* Payment Settings */}
      <div className={CARD}>
        <p className={LABEL}>Checkout Settings</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
          {/* Currency */}
          <div>
            <label className={LABEL}>Currency</label>
            <select value={settings.paymentCurrency} onChange={(e) => set('paymentCurrency', e.target.value)} className={INPUT}>
              <option value="eur">EUR — Euro (€)</option>
              <option value="usd">USD — US Dollar ($)</option>
              <option value="gbp">GBP — British Pound (£)</option>
              <option value="cad">CAD — Canadian Dollar (CA$)</option>
              <option value="aud">AUD — Australian Dollar (A$)</option>
            </select>
          </div>

          {/* Tax rate */}
          <div>
            <label className={LABEL}>Tax Rate (%)</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={settings.paymentTaxRate}
                onChange={(e) => set('paymentTaxRate', e.target.value)}
                className={INPUT + ' pr-8'}
                placeholder="0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">%</span>
            </div>
            <p className="text-[11px] text-white/25 mt-1">Set 0 for VAT-inclusive pricing</p>
          </div>

          {/* Free shipping threshold */}
          <div>
            <label className={LABEL}>Free Shipping Threshold</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm uppercase">{settings.paymentCurrency}</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={settings.paymentShippingThreshold}
                onChange={(e) => set('paymentShippingThreshold', e.target.value)}
                className={INPUT + ' pl-12'}
                placeholder="50"
              />
            </div>
            <p className="text-[11px] text-white/25 mt-1">Orders above this amount get free shipping</p>
          </div>

          {/* Shipping fee */}
          <div>
            <label className={LABEL}>Standard Shipping Fee</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm uppercase">{settings.paymentCurrency}</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={settings.paymentShippingFee}
                onChange={(e) => set('paymentShippingFee', e.target.value)}
                className={INPUT + ' pl-12'}
                placeholder="9.99"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Digital Wallets */}
      <div className={CARD}>
        <div className="flex items-center justify-between">
          <div>
            <p className={LABEL} style={{ marginBottom: 0 }}>Apple Pay & Google Pay</p>
            <p className="text-xs text-white/30 mt-1 max-w-sm">
              Stripe's PaymentElement automatically enables Apple Pay on Safari and Google Pay on Chrome when the customer's device supports it.
            </p>
          </div>
          <button
            onClick={() => set('paymentEnableWallets', walletsOn ? 'false' : 'true')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
              walletsOn
                ? 'bg-[#4ade80]/10 border-[#4ade80]/30 text-[#4ade80]'
                : 'bg-white/5 border-white/10 text-white/40'
            }`}
          >
            {walletsOn
              ? <><ToggleRight className="w-5 h-5" /> Enabled</>
              : <><ToggleLeft className="w-5 h-5" /> Disabled</>}
          </button>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/50">
            🍎 Apple Pay
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/50">
            🅖 Google Pay
          </div>
        </div>
      </div>

      {/* Security note */}
      <div className="flex items-start gap-3 px-5 py-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
        <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-300 mb-0.5">PCI DSS Compliant</p>
          <p className="text-xs text-white/40 leading-relaxed">
            Card data is never transmitted to or stored on your server. All card information is handled exclusively by Stripe's secure iframe (Stripe Elements), which is PCI DSS Level 1 certified. Your customers' card numbers, CVCs, and expiry dates never touch your codebase.
          </p>
        </div>
      </div>

      {/* Bottom save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#4ade80] text-[#0b0d13] hover:bg-[#22c55e] transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Payment Settings'}
        </button>
      </div>
    </div>
  )
}
