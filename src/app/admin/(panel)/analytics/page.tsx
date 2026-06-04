'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, MousePointer, CreditCard, Globe } from 'lucide-react'

const AnalyticsCharts = dynamic(() => import('./AnalyticsCharts'), {
  ssr: false,
  loading: () => (
    <div className="space-y-6">
      <div className="bg-[#13161f] border border-white/5 rounded-2xl p-6 h-[320px] animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#13161f] border border-white/5 rounded-2xl p-6 h-[260px] animate-pulse" />
        <div className="bg-[#13161f] border border-white/5 rounded-2xl p-6 h-[260px] animate-pulse" />
      </div>
    </div>
  ),
})

const RANGE_LABELS = ['7d', '30d', '90d', '12m']

const REVENUE_DATA: Record<string, { date: string; revenue: number; orders: number; sessions: number }[]> = {
  '7d': [
    { date: 'Mon 19', revenue: 196, orders: 4, sessions: 310 },
    { date: 'Tue 20', revenue: 245, orders: 5, sessions: 380 },
    { date: 'Wed 21', revenue: 147, orders: 3, sessions: 290 },
    { date: 'Thu 22', revenue: 392, orders: 8, sessions: 520 },
    { date: 'Fri 23', revenue: 294, orders: 6, sessions: 460 },
    { date: 'Sat 24', revenue: 441, orders: 9, sessions: 610 },
    { date: 'Sun 25', revenue: 196, orders: 4, sessions: 330 },
  ],
  '30d': Array.from({ length: 30 }, (_, i) => ({
    date: `May ${i + 1}`,
    revenue: Math.floor((i * 37 + 211) % 400 + 100),
    orders: Math.floor((i * 7 + 3) % 10 + 1),
    sessions: Math.floor((i * 83 + 201) % 500 + 200),
  })),
  '90d': Array.from({ length: 13 }, (_, i) => ({
    date: `Wk ${i + 1}`,
    revenue: Math.floor((i * 317 + 811) % 2000 + 800),
    orders: Math.floor((i * 13 + 11) % 50 + 10),
    sessions: Math.floor((i * 281 + 1001) % 2500 + 1000),
  })),
  '12m': ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'].map((m, i) => ({
    date: m,
    revenue: Math.floor((i * 1237 + 2011) % 8000 + 2000),
    orders: Math.floor((i * 37 + 41) % 180 + 40),
    sessions: Math.floor((i * 1811 + 4001) % 10000 + 4000),
  })),
}


const FUNNEL = [
  { stage: 'Sessions', value: 12480, pct: 100 },
  { stage: 'Product Views', value: 7920, pct: 63.5 },
  { stage: 'Add to Cart', value: 2890, pct: 23.2 },
  { stage: 'Checkout', value: 1104, pct: 8.8 },
  { stage: 'Purchased', value: 720, pct: 5.8 },
]

const TOP_PRODUCTS = [
  { name: 'Stemuvita™ Hair Cleanse', units: 512, revenue: 25088, pct: 100 },
  { name: 'Stemuvita™ Scalp Serum', units: 208, revenue: 8736, pct: 35 },
]

const GEO = [
  { country: '🇬🇧 United Kingdom', orders: 182, revenue: 9282 },
  { country: '🇩🇪 Germany', orders: 134, revenue: 6566 },
  { country: '🇫🇷 France', orders: 97, revenue: 4753 },
  { country: '🇮🇪 Ireland', orders: 88, revenue: 4312 },
  { country: '🇳🇬 Nigeria', orders: 74, revenue: 3626 },
  { country: '🇪🇸 Spain', orders: 63, revenue: 3087 },
  { country: '🇮🇳 India', orders: 51, revenue: 2499 },
  { country: '🇸🇬 Singapore', orders: 31, revenue: 1519 },
]

const PAYMENT_LEDGER = [
  { id: 'pi_3NxJKI2eZvKYlo2C1abc', customer: 'Sarah Miller', amount: 98, status: 'PAID', date: '2026-05-24', method: 'Visa •••• 4242' },
  { id: 'pi_3NxJKI2eZvKYlo2C1bcd', customer: 'James Thompson', amount: 49, status: 'PAID', date: '2026-05-24', method: 'Mastercard •••• 5555' },
  { id: 'pi_3NxJKI2eZvKYlo2C1cde', customer: 'Amara Lawal', amount: 91, status: 'AUTHORIZED', date: '2026-05-23', method: 'Visa •••• 9999' },
  { id: 'pi_3NxJKI2eZvKYlo2C1def', customer: 'Priya Kumar', amount: 49, status: 'PAID', date: '2026-05-23', method: 'Apple Pay' },
  { id: 'pi_3NxJKI2eZvKYlo2C1efg', customer: 'David Reyes', amount: 140, status: 'PAID', date: '2026-05-22', method: 'PayPal' },
  { id: 'pi_3NxJKI2eZvKYlo2C1ghi', customer: 'Marcus Chen', amount: 49, status: 'REFUNDED', date: '2026-05-21', method: 'Visa •••• 1234' },
  { id: 'pi_3NxJKI2eZvKYlo2C1hij', customer: 'Tom Andrews', amount: 49, status: 'FAILED', date: '2026-05-20', method: 'Visa •••• 0000' },
]

const PAYMENT_BADGE: Record<string, string> = {
  AUTHORIZED: 'bg-blue-500/15 text-blue-400',
  PAID: 'bg-emerald-500/15 text-emerald-400',
  REFUNDED: 'bg-purple-500/15 text-purple-400',
  FAILED: 'bg-red-500/15 text-red-400',
  PENDING: 'bg-white/8 text-white/50',
}

const TOOLTIP_STYLE = { background: '#1a1e2b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 12, color: '#fff' }
const CARD = 'bg-[#13161f] border border-white/5 rounded-2xl'

function sum(data: typeof REVENUE_DATA['7d'], key: 'revenue' | 'orders' | 'sessions') {
  return data.reduce((s, d) => s + d[key], 0)
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<string>('30d')
  const data = REVENUE_DATA[range]
  const totalRevenue = sum(data, 'revenue')
  const totalOrders = sum(data, 'orders')
  const totalSessions = sum(data, 'sessions')
  const convRate = ((totalOrders / totalSessions) * 100).toFixed(1)
  const avgOrder = (totalRevenue / totalOrders).toFixed(0)

  const kpis = [
    { label: 'Revenue', value: `€${totalRevenue.toLocaleString()}`, trend: '+14.2%', up: true, icon: DollarSign, accent: '#4ade80', bg: 'bg-emerald-500/10' },
    { label: 'Orders', value: totalOrders, trend: '+11.8%', up: true, icon: ShoppingBag, accent: '#60a5fa', bg: 'bg-blue-500/10' },
    { label: 'Sessions', value: totalSessions.toLocaleString(), trend: '+8.3%', up: true, icon: MousePointer, accent: '#a78bfa', bg: 'bg-purple-500/10' },
    { label: 'Conv. Rate', value: `${convRate}%`, trend: '+0.4%', up: true, icon: TrendingUp, accent: '#f59e0b', bg: 'bg-amber-500/10' },
    { label: 'Avg. Order', value: `€${avgOrder}`, trend: '-2.1%', up: false, icon: CreditCard, accent: '#f87171', bg: 'bg-red-500/10' },
  ]

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Analytics</h1>
          <p className="text-white/40 mt-0.5 text-sm">Store performance, traffic and revenue insights.</p>
        </div>
        <div className="flex rounded-xl border border-white/10 overflow-hidden text-sm">
          {RANGE_LABELS.map((r) => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-4 py-2 font-semibold transition-colors ${range === r ? 'bg-[#4ade80] text-[#0b0d13]' : 'text-white/40 hover:bg-white/5 hover:text-white/70'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className={`${CARD} p-5`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${k.bg} flex-shrink-0`}>
                <k.icon className="w-5 h-5" style={{ color: k.accent }} />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-bold ${k.up ? 'text-emerald-400' : 'text-red-400'}`}>
                {k.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {k.trend}
              </span>
            </div>
            <p className="text-2xl font-black text-white">{k.value}</p>
            <p className="text-xs text-white/30 mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <AnalyticsCharts data={data} />

      {/* Conversion funnel */}
      <div className={`${CARD} p-6`}>
        <h2 className="text-lg font-bold text-white mb-6">Conversion Funnel</h2>
        <div className="space-y-3">
          {FUNNEL.map((f, i) => (
            <div key={f.stage} className="flex items-center gap-4">
              <div className="w-32 text-sm text-white/50 font-medium flex-shrink-0">{f.stage}</div>
              <div className="flex-1 h-9 bg-white/5 rounded-xl overflow-hidden relative">
                <div
                  className="h-full rounded-xl flex items-center px-3 transition-all duration-700"
                  style={{ width: `${f.pct}%`, background: `rgba(74,222,128,${1 - i * 0.15})` }}
                >
                  <span className="text-xs font-bold text-[#0b0d13] whitespace-nowrap">{f.value.toLocaleString()}</span>
                </div>
              </div>
              <div className="w-14 text-right text-sm font-semibold text-white/40">{f.pct}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top products + Geo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${CARD} p-6`}>
          <h2 className="text-lg font-bold text-white mb-5">Top Products</h2>
          <div className="space-y-5">
            {TOP_PRODUCTS.map((p) => (
              <div key={p.name}>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="font-semibold text-white/80 line-clamp-1">{p.name}</span>
                  <span className="font-bold text-white ml-4 flex-shrink-0">€{p.revenue.toLocaleString()}</span>
                </div>
                <div className="h-2.5 bg-white/8 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#4ade80] to-[#22c55e] rounded-full" style={{ width: `${p.pct}%` }} />
                </div>
                <p className="text-xs text-white/30 mt-1">{p.units} units sold</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`${CARD} p-6`}>
          <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
            <Globe className="w-5 h-5 text-white/30" /> Sales by Country
          </h2>
          <div className="space-y-2.5">
            {GEO.map((g) => (
              <div key={g.country} className="flex items-center justify-between text-sm">
                <span className="text-white/60">{g.country}</span>
                <div className="flex items-center gap-4">
                  <span className="text-white/30 text-xs">{g.orders} orders</span>
                  <span className="font-bold text-white w-20 text-right">€{g.revenue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment ledger */}
      <div className={`${CARD} overflow-hidden`}>
        <div className="px-6 py-5 border-b border-white/5">
          <h2 className="text-lg font-bold text-white">Payment Ledger</h2>
          <p className="text-sm text-white/30 mt-0.5">Stripe payment processing log</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/3">
                {['Payment ID', 'Customer', 'Method', 'Date', 'Status', 'Amount'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-white/30 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {PAYMENT_LEDGER.map((p) => (
                <tr key={p.id} className="hover:bg-white/3 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-white/25 max-w-[160px] truncate">{p.id}</td>
                  <td className="px-5 py-4 font-semibold text-white">{p.customer}</td>
                  <td className="px-5 py-4 text-white/40 text-xs">{p.method}</td>
                  <td className="px-5 py-4 text-white/30 text-xs">{p.date}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${PAYMENT_BADGE[p.status]}`}>{p.status}</span>
                  </td>
                  <td className="px-5 py-4 font-bold text-white">€{p.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
