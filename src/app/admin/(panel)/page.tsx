'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import {
  TrendingUp, TrendingDown, ShoppingCart,
  ArrowUpRight, AlertTriangle, Activity, Eye, RefreshCw,
  DollarSign, BarChart2, Bell, Settings, Download,
  Landmark, Pencil, Save, X, Check, Copy, Package,
  CheckCircle2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

const DashboardCharts = dynamic(() => import('./DashboardCharts'), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 bg-[#13161f] border border-white/5 rounded-2xl p-6 h-[280px] animate-pulse" />
      <div className="bg-[#13161f] border border-white/5 rounded-2xl p-6 h-[280px] animate-pulse" />
    </div>
  ),
})

const RANGES = ['Today', '7 days', '30 days', '90 days'] as const
type Range = typeof RANGES[number]

const REVENUE_DATA: Record<Range, { label: string; revenue: number; orders: number; prev: number }[]> = {
  'Today': [
    { label: '00:00', revenue: 0,    orders: 0,  prev: 180  },
    { label: '04:00', revenue: 49,   orders: 1,  prev: 220  },
    { label: '08:00', revenue: 147,  orders: 3,  prev: 490  },
    { label: '12:00', revenue: 490,  orders: 10, prev: 740  },
    { label: '16:00', revenue: 784,  orders: 16, prev: 860  },
    { label: '20:00', revenue: 931,  orders: 19, prev: 920  },
    { label: '23:59', revenue: 1029, orders: 21, prev: 980  },
  ],
  '7 days': [
    { label: 'Mon', revenue: 1274, orders: 26, prev: 1050 },
    { label: 'Tue', revenue: 980,  orders: 20, prev: 1200 },
    { label: 'Wed', revenue: 1519, orders: 31, prev: 1380 },
    { label: 'Thu', revenue: 2107, orders: 43, prev: 1750 },
    { label: 'Fri', revenue: 2891, orders: 59, prev: 2100 },
    { label: 'Sat', revenue: 3430, orders: 70, prev: 2800 },
    { label: 'Sun', revenue: 2156, orders: 44, prev: 1900 },
  ],
  '30 days': Array.from({ length: 30 }, (_, i) => ({
    label: `${i + 1}`,
    revenue: 800  + ((i * 137 + 42)  % 3200),
    orders:  16   + ((i * 73  + 11)  % 65),
    prev:    600  + ((i * 113 + 31)  % 2800),
  })),
  '90 days': Array.from({ length: 12 }, (_, i) => ({
    label:   `Wk ${i + 1}`,
    revenue: 5000  + ((i * 1337 + 420)  % 15000),
    orders:  100   + ((i * 73   + 50)   % 300),
    prev:    4000  + ((i * 1113 + 310)  % 12000),
  })),
}

const SUMMARY: Record<Range, { revenue: string; orders: string; sessions: string; conversion: string; aov: string; revChange: number; ordChange: number }> = {
  'Today':   { revenue: '€1,029',   orders: '21',    sessions: '312',    conversion: '6.7%', aov: '€49.0', revChange: +14.2, ordChange: +11.1 },
  '7 days':  { revenue: '€14,357',  orders: '293',   sessions: '4,218',  conversion: '6.9%', aov: '€49.0', revChange: +8.4,  ordChange: +6.2  },
  '30 days': { revenue: '€54,891',  orders: '1,120', sessions: '16,340', conversion: '6.9%', aov: '€49.0', revChange: +12.5, ordChange: +8.2  },
  '90 days': { revenue: '€142,310', orders: '2,904', sessions: '43,200', conversion: '6.7%', aov: '€49.0', revChange: +22.3, ordChange: +18.6 },
}

const LOW_STOCK = [
  { name: 'Stemuvita™ Hair Cleanse', stock: 47, threshold: 50 },
  { name: 'Stemuvita™ Scalp Serum',  stock: 63, threshold: 50 },
]
const TOP_PRODUCTS = [
  { name: 'Stemuvita™ Hair Cleanse', units: 847, revenue: 41503, pct: 71, color: '#4ade80' },
  { name: 'Stemuvita™ Scalp Serum',  units: 400, revenue: 16800, pct: 29, color: '#f59e0b' },
]
const ACTIVITY = [
  { time: '2 min ago',  text: 'New order #ORD-4822 from Nina Park',        type: 'order'    },
  { time: '14 min ago', text: 'Payment confirmed for #ORD-4821 (€98)',     type: 'payment'  },
  { time: '1 hr ago',   text: '#ORD-4820 shipped via DHL',                 type: 'ship'     },
  { time: '2 hr ago',   text: 'New customer: elena@example.com',           type: 'customer' },
  { time: '3 hr ago',   text: 'Low stock alert: Hair Cleanse at 47 units', type: 'alert'    },
]
const RECENT_ORDERS = [
  { id: 'ORD-4822', customer: 'Nina Park',      date: '2026-05-25T11:04:00Z', status: 'PENDING',    total: 49  },
  { id: 'ORD-4821', customer: 'Sarah Miller',   date: '2026-05-24T10:32:00Z', status: 'DELIVERED',  total: 98  },
  { id: 'ORD-4820', customer: 'James Thompson', date: '2026-05-24T09:14:00Z', status: 'SHIPPED',    total: 49  },
  { id: 'ORD-4819', customer: 'Amara Lawal',    date: '2026-05-23T18:55:00Z', status: 'PROCESSING', total: 91  },
  { id: 'ORD-4818', customer: 'Priya Kumar',    date: '2026-05-23T14:22:00Z', status: 'PENDING',    total: 49  },
]
const STATUS_STYLE: Record<string, string> = {
  PENDING:    'bg-white/8 text-white/50',
  PROCESSING: 'bg-blue-500/15 text-blue-400',
  SHIPPED:    'bg-amber-500/15 text-amber-400',
  DELIVERED:  'bg-emerald-500/15 text-emerald-400',
  CANCELLED:  'bg-red-500/15 text-red-400',
}
const ACTIVITY_ICON: Record<string, string> = {
  order: '🛒', payment: '💳', ship: '📦', customer: '👤', alert: '⚠️',
}
const CARD = 'bg-[#13161f] border border-white/5 rounded-2xl'

interface BankAccount {
  payoutAccountHolder: string
  payoutBankName:      string
  payoutIBAN:          string
  payoutBIC:           string
  payoutAccountNumber: string
}
const BANK_DEFAULTS: BankAccount = {
  payoutAccountHolder: '', payoutBankName: '',
  payoutIBAN: '', payoutBIC: '', payoutAccountNumber: '',
}
function maskIBAN(iban: string) {
  if (!iban || iban.length < 8) return iban
  return iban.slice(0, 4) + ' •••• •••• ' + iban.slice(-4)
}

export default function AdminDashboard() {
  const router = useRouter()
  const [range, setRange] = useState<Range>('7 days')
  const [showNotifications, setShowNotifications] = useState(false)
  const summary   = SUMMARY[range]
  const chartData = REVENUE_DATA[range]

  // ── Real stats from DB ─────────────────────────────────────────────────────
  const [realStats, setRealStats] = useState<{
    totalRevenue: number; totalOrders: number; recentOrders: typeof RECENT_ORDERS; lowStock: typeof LOW_STOCK
  } | null>(null)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setRealStats(d))
      .catch(() => {})
  }, [])

  const [bank,        setBank]        = useState<BankAccount>({ ...BANK_DEFAULTS })
  const [bankEdit,    setBankEdit]    = useState<BankAccount>({ ...BANK_DEFAULTS })
  const [bankMode,    setBankMode]    = useState<'view' | 'edit'>('view')
  const [bankSaving,  setBankSaving]  = useState(false)
  const [bankSaved,   setBankSaved]   = useState(false)
  const [bankLoading, setBankLoading] = useState(true)
  const [copied,      setCopied]      = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/payments').then(r => r.json())
      .then((d: Record<string, string>) => {
        const loaded: BankAccount = {
          payoutAccountHolder: d.payoutAccountHolder ?? '',
          payoutBankName:      d.payoutBankName      ?? '',
          payoutIBAN:          d.payoutIBAN          ?? '',
          payoutBIC:           d.payoutBIC           ?? '',
          payoutAccountNumber: d.payoutAccountNumber ?? '',
        }
        setBank(loaded); setBankEdit(loaded)
      }).catch(() => {}).finally(() => setBankLoading(false))
  }, [])

  async function saveBank() {
    setBankSaving(true)
    try {
      await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bankEdit),
      })
      setBank({ ...bankEdit }); setBankMode('view')
      setBankSaved(true); setTimeout(() => setBankSaved(false), 2500)
    } finally { setBankSaving(false) }
  }

  function copyToClipboard(val: string, key: string) {
    navigator.clipboard.writeText(val).then(() => {
      setCopied(key); setTimeout(() => setCopied(null), 1500)
    })
  }

  function exportDashboard() {
    const data = realStats?.recentOrders ?? RECENT_ORDERS
    const rows = [
      ['Order ID', 'Customer', 'Date', 'Status', 'Total'],
      ...data.map(o => [o.id, o.customer, o.date, o.status, `€${o.total}`])
    ]
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = `dashboard-${range.replace(' ','-')}-${new Date().toISOString().slice(0,10)}.csv`
    a.click(); URL.revokeObjectURL(url)
  }

  const hasBank = bank.payoutIBAN || bank.payoutAccountNumber

  // Use real stats if available, fall back to mock data
  const realRevenue = realStats ? `€${realStats.totalRevenue.toLocaleString('en-IE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : summary.revenue
  const realOrders  = realStats ? String(realStats.totalOrders) : summary.orders
  const recentOrdersData = realStats?.recentOrders?.length
    ? realStats.recentOrders.map(o => ({
        id: o.id.slice(0, 8).toUpperCase(),
        customer: o.customer,
        date: o.date,
        status: o.status as 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED',
        total: o.total,
      }))
    : RECENT_ORDERS
  const lowStockData = realStats?.lowStock ?? LOW_STOCK

  const kpis = [
    { label: 'Revenue',    value: realRevenue,        change: summary.revChange, icon: DollarSign,  accent: '#4ade80' },
    { label: 'Orders',     value: realOrders,         change: summary.ordChange, icon: ShoppingCart, accent: '#60a5fa' },
    { label: 'Sessions',   value: summary.sessions,   change: +3.1,              icon: Eye,          accent: '#a78bfa' },
    { label: 'Conversion', value: summary.conversion, change: +0.4,              icon: BarChart2,    accent: '#f59e0b' },
    { label: 'Avg. Order', value: summary.aov,        change: 0,                 icon: TrendingUp,   accent: '#f87171' },
  ]

  return (
    <div className="p-8 space-y-7 min-h-screen bg-[#0f1117]">

      {/* Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Hey, Admin 👋</h1>
          <p className="text-white/40 text-sm mt-0.5">Here's your store performance at a glance.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white/5 rounded-xl p-1 gap-0.5">
            {RANGES.map(r => (
              <button key={r} onClick={() => setRange(r)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${range === r ? 'bg-white/10 text-white shadow-sm' : 'text-white/35 hover:text-white/60'}`}>
                {r}
              </button>
            ))}
          </div>
          <button onClick={exportDashboard} className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/8 rounded-xl px-3.5 py-2 text-xs text-white/60 hover:text-white transition-all">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(v => !v)}
              className="w-9 h-9 bg-white/5 hover:bg-white/10 border border-white/8 rounded-xl flex items-center justify-center text-white/50 hover:text-white transition-all relative"
            >
              <Bell className="w-4 h-4" />
              {/* Badge */}
              {(realStats?.lowStock?.length ?? LOW_STOCK.length) > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {realStats?.lowStock?.length ?? LOW_STOCK.length}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 top-11 w-80 bg-[#13161f] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
                    <p className="text-sm font-bold text-white">Notifications</p>
                    <button onClick={() => setShowNotifications(false)} className="text-white/30 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {/* Low stock alerts */}
                    {(realStats?.lowStock ?? LOW_STOCK).map((item: any) => (
                      <div key={item.name} className="flex items-start gap-3 px-4 py-3 hover:bg-white/4 transition-colors border-b border-white/4">
                        <div className="w-8 h-8 bg-amber-500/15 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white/80">{item.name}</p>
                          <p className="text-xs text-amber-400 mt-0.5">Only {item.stock} left in stock</p>
                        </div>
                      </div>
                    ))}
                    {/* Recent orders */}
                    {(realStats?.recentOrders ?? RECENT_ORDERS).slice(0, 3).map((o: any) => (
                      <div key={o.id} className="flex items-start gap-3 px-4 py-3 hover:bg-white/4 transition-colors border-b border-white/4">
                        <div className="w-8 h-8 bg-[#4ade80]/15 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Package className="w-4 h-4 text-[#4ade80]" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white/80">New order {o.id}</p>
                          <p className="text-xs text-white/40 mt-0.5">{o.customer} — €{o.total}</p>
                        </div>
                      </div>
                    ))}
                    {(realStats?.lowStock ?? LOW_STOCK).length === 0 && (realStats?.recentOrders ?? RECENT_ORDERS).length === 0 && (
                      <div className="flex flex-col items-center justify-center py-8 text-white/25">
                        <CheckCircle2 className="w-8 h-8 mb-2" />
                        <p className="text-xs">All clear — no alerts</p>
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-3 border-t border-white/8">
                    <Link href="/admin/orders" onClick={() => setShowNotifications(false)}
                      className="text-xs text-[#4ade80] hover:underline">
                      View all orders →
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Settings — navigate to settings page */}
          <button
            onClick={() => router.push('/admin/settings')}
            className="w-9 h-9 bg-white/5 hover:bg-white/10 border border-white/8 rounded-xl flex items-center justify-center text-white/50 hover:text-white transition-all"
            title="Store Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        {kpis.map(k => (
          <div key={k.label} className={`${CARD} p-5`}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${k.accent}18` }}>
                <k.icon className="w-4 h-4" style={{ color: k.accent }} />
              </div>
              {k.change !== 0 && (
                <span className={`flex items-center gap-0.5 text-xs font-semibold ${k.change > 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                  {k.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(k.change)}%
                </span>
              )}
            </div>
            <p className="text-2xl font-black text-white">{k.value}</p>
            <p className="text-xs text-white/35 mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <DashboardCharts chartData={chartData} />

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className={`${CARD} p-6`}>
          <h2 className="text-sm font-bold text-white mb-5">Top Products</h2>
          <div className="space-y-5 mb-6">
            {TOP_PRODUCTS.map(p => (
              <div key={p.name}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-white/70 truncate pr-2 text-xs">{p.name}</span>
                  <span className="font-bold text-white flex-shrink-0 text-xs">€{p.revenue.toLocaleString()}</span>
                </div>
                <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${p.pct}%`, background: p.color }} />
                </div>
                <p className="text-[10px] text-white/30 mt-1">{p.units} units sold · {p.pct}%</p>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-3.5 h-3.5 text-[#f59e0b]" />
              <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider">Low Stock Alert</h3>
            </div>
            {lowStockData.map(item => (
              <div key={item.name} className="flex justify-between items-center text-xs py-2 border-b border-white/5 last:border-0">
                <span className="text-white/50 truncate pr-2">{item.name}</span>
                <span className={`font-bold flex-shrink-0 ${item.stock < item.threshold ? 'text-[#f87171]' : 'text-[#4ade80]'}`}>{item.stock} left</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`${CARD} lg:col-span-2 overflow-hidden`}>
          <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Recent Orders</h2>
            <Link href="/admin/orders" className="flex items-center gap-1 text-xs text-[#4ade80] hover:text-[#86efac] transition-colors font-semibold">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Order', 'Customer', 'Date', 'Status', 'Total'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold text-white/25 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4">
                {recentOrdersData.map(o => (
                  <tr key={o.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3.5">
                      <Link href="/admin/orders" className="font-mono text-xs text-[#4ade80] hover:text-[#86efac] font-semibold transition-colors">{o.id}</Link>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-white/80 text-xs">{o.customer}</td>
                    <td className="px-5 py-3.5 text-white/30 text-xs">
                      {new Date(o.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${STATUS_STYLE[o.status]}`}>{o.status}</span>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-white text-xs">€{o.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-white/5 px-6 py-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-3.5 h-3.5 text-white/25" />
              <h3 className="text-[10px] font-bold text-white/25 uppercase tracking-wider">Live Activity</h3>
            </div>
            <div className="space-y-2.5">
              {ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs">
                  <span className="flex-shrink-0 mt-0.5 text-sm">{ACTIVITY_ICON[a.type]}</span>
                  <span className="text-white/50 flex-1">{a.text}</span>
                  <span className="text-white/20 flex-shrink-0 text-[10px]">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Payout Bank Account */}
      <div className={`${CARD} p-6`}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#4ade80]/10 flex items-center justify-center">
              <Landmark className="w-4 h-4 text-[#4ade80]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Payout Bank Account</h2>
              <p className="text-xs text-white/30 mt-0.5">Account where Stripe sends your payments</p>
            </div>
          </div>
          {bankMode === 'view' ? (
            <button onClick={() => { setBankEdit({ ...bank }); setBankMode('edit') }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white/50 hover:text-white border border-white/10 hover:border-white/20 transition-all">
              <Pencil className="w-3.5 h-3.5" />{hasBank ? 'Edit' : 'Add Account'}
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => { setBankEdit({ ...bank }); setBankMode('view') }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white/40 hover:text-white border border-white/8 transition-all">
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button onClick={saveBank} disabled={bankSaving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#4ade80] text-[#0b0d13] hover:bg-[#22c55e] transition-colors disabled:opacity-50">
                {bankSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {bankSaved ? 'Saved!' : bankSaving ? 'Saving…' : 'Save'}
              </button>
            </div>
          )}
        </div>

        {bankLoading ? (
          <p className="text-xs text-white/25 py-4">Loading…</p>
        ) : bankMode === 'view' ? (
          !hasBank ? (
            <div className="flex items-center gap-4 py-4 border border-dashed border-white/10 rounded-2xl px-5">
              <Landmark className="w-8 h-8 text-white/10 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-white/30">No bank account configured</p>
                <p className="text-xs text-white/20 mt-0.5">Click "Add Account" to configure your payout destination.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { label: 'Account Holder', value: bank.payoutAccountHolder, key: 'holder' },
                { label: 'Bank Name',      value: bank.payoutBankName,      key: 'bank' },
                { label: 'IBAN',           value: bank.payoutIBAN,          key: 'iban', masked: true },
                { label: 'BIC / SWIFT',    value: bank.payoutBIC,           key: 'bic' },
                { label: 'Account Number', value: bank.payoutAccountNumber, key: 'accnum' },
              ].filter(f => f.value).map(field => (
                <div key={field.key} className="bg-white/3 border border-white/6 rounded-xl px-4 py-3">
                  <p className="text-[10px] font-semibold text-white/25 uppercase tracking-wider mb-1">{field.label}</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-mono font-semibold text-white truncate">
                      {field.masked ? maskIBAN(field.value) : field.value}
                    </p>
                    <button onClick={() => copyToClipboard(field.value, field.key)}
                      className="shrink-0 p-1 rounded-lg text-white/20 hover:text-white/60 hover:bg-white/8 transition-all">
                      {copied === field.key ? <Check className="w-3.5 h-3.5 text-[#4ade80]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Account Holder Name',       key: 'payoutAccountHolder' as keyof BankAccount, placeholder: 'e.g. CELLAVIVA Ltd.' },
              { label: 'Bank Name',                 key: 'payoutBankName'      as keyof BankAccount, placeholder: 'e.g. Bank of Ireland' },
              { label: 'IBAN',                      key: 'payoutIBAN'          as keyof BankAccount, placeholder: 'e.g. IE29 AIBK 9311 5212 3456 78' },
              { label: 'BIC / SWIFT Code',          key: 'payoutBIC'           as keyof BankAccount, placeholder: 'e.g. AIBKIE2D' },
              { label: 'Account Number (optional)', key: 'payoutAccountNumber' as keyof BankAccount, placeholder: 'For non-IBAN countries' },
            ].map(field => (
              <div key={field.key} className={field.key === 'payoutIBAN' ? 'sm:col-span-2' : ''}>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">{field.label}</label>
                <input type="text" value={bankEdit[field.key]}
                  onChange={e => setBankEdit(prev => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder-white/20 focus:outline-none focus:border-[#4ade80]/50 transition-colors"
                />
              </div>
            ))}
            <div className="sm:col-span-2 flex items-start gap-2 px-4 py-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-white/40 leading-relaxed">
                Stored securely in your database, visible to admin users only. Used as a reference for Stripe payouts.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
